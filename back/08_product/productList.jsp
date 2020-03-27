<%@ page contentType = "text/html;charset=utf-8" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="java.util.*" %>
<%@ page import="org.json.simple.*" %>
<%@ page import="java.sql.*" %>
<%@ page import="java.text.*" %>

<%@ include file = "../00_include/dbConn.jsp" %>

<%	
	String searchText = (request.getParameter("searchText")==null)? "0":request.getParameter("searchText");
	String pageNo = (request.getParameter("pageNo")==null)? "0":request.getParameter("pageNo");
	String pdNameOrder = (request.getParameter("pdNameOrder")==null)? "":request.getParameter("pdNameOrder");
	String keyOrder = (request.getParameter("keyOrder")==null)? "":request.getParameter("keyOrder");
	String tagOrder = (request.getParameter("tagOrder")==null)? "":request.getParameter("tagOrder");
	Integer pageNo_new;

//	mariadb의 페이징 시작 쿼리를 위해 1을 뺀다.
	pageNo_new = Integer.parseInt(pageNo) - 1;
	pageNo_new = pageNo_new * 6;

	JSONObject bdListJSON = new JSONObject();
	
	try{

//	sql = " select a.pd_no, a.pd_code, a.pd_name, a.group_tag, ifnull(b.img_cnt,0) AS img_cnt "
//	    + " from vm_product AS a "  
//
//		+ " LEFT OUTER JOIN ( "
//		+ " SELECT a.group_tag, count(a.img_no) AS img_cnt "
//		+ " from vm_product_image AS a "
//		+ " WHERE a.group_tag IS NOT NULL "
//		+ " AND a.group_tag <> '' "
//		+ " AND a.std_fg = 'Y' "
//		+ " GROUP BY a.group_tag "
//		+ " ) AS b "
//		+ " ON a.group_tag = b.group_tag "
//
//	    + " WHERE a.pd_code IS NOT null "
//	    + " AND a.pd_code <> 'blank' ";

		sql = " 	SELECT tot.pd_no, tot.pd_code, tot.pd_name, tot.group_tag, sum(tot.img_cnt) AS img_cnt "
		    + " FROM ( "	
		    + " select a.pd_no, a.pd_code, a.pd_name, a.group_tag, ifnull(b.img_cnt,0) AS img_cnt " 
	        + " from vm_product AS a "   
		    + " LEFT OUTER JOIN ( " 
		    + " SELECT a.group_tag, count(a.img_no) AS img_cnt " 
		    + " from vm_product_image AS a " 
		    + " WHERE a.group_tag IS NOT NULL " 
		    + " AND a.group_tag <> '' " 
		    + " AND a.std_fg = 'Y' " 
		    + " GROUP BY a.group_tag " 
		    + " ) AS b " 
		    + " ON a.group_tag = b.group_tag " 
		    + " WHERE a.pd_code IS NOT null " 
	        + " AND a.pd_code <> 'blank' "
		    + " UNION "
		    + " select a.pd_no, a.pd_code, a.pd_name, a.group_tag, ifnull(b.img_cnt,0) AS img_cnt " 
	        + " from vm_product AS a "   
		    + " LEFT OUTER JOIN ( " 
		    + " SELECT a.pd_code, count(a.img_no) AS img_cnt " 
		    + " from vm_product_image AS a " 
		    + " WHERE (a.group_tag IS NULL or a.group_tag = '') "  
		    + " AND a.std_fg = 'Y' "
		    + " GROUP BY a.pd_code " 
		    + " ) AS b " 
		    + " ON a.pd_code = b.pd_code " 
		    + " WHERE a.pd_code IS NOT null " 
	        + " AND a.pd_code <> 'blank' "
	        + "  ) AS tot "
			+ " where 1=1 ";
		
		if (searchText != ""){
           sql = sql + " and ( tot.pd_name like '%"+searchText+"%' or tot.group_tag like '%"+searchText+"%' or tot.pd_code like '%"+searchText+"%' )";
		}else{
		   sql = sql + " ";
		}
	
		if ( pdNameOrder.equals("") && keyOrder.equals("") && tagOrder.equals("") ){

			sql = sql + " GROUP BY tot.pd_no, tot.pd_code, tot.pd_name, tot.group_tag ";
		}else{
			sql = sql + " GROUP BY tot.pd_no, tot.pd_code, tot.pd_name, tot.group_tag ";
			sql = sql + " order by ";
		}

	    if ( pdNameOrder.equals("desc") ){
			sql = sql + " tot.pd_name desc ";
		}else if( pdNameOrder.equals("asc") ){
			sql = sql + " tot.pd_name asc ";
		}else{
		}

		if ( keyOrder.equals("desc") ){
			if ( pdNameOrder.equals("") ){
				sql = sql + " tot.group_tag desc ";
			}else{
				sql = sql + " ,tot.group_tag desc ";
			}
		}else if( keyOrder.equals("asc") ){
			if ( pdNameOrder.equals("") ){
				sql = sql + " tot.group_tag asc ";
			}else{
				sql = sql + " ,tot.group_tag asc ";
			}
		}else{
		}

		if ( tagOrder.equals("desc") ){
			if ( pdNameOrder.equals("") && keyOrder.equals("") ){
				sql = sql + " sum(tot.img_cnt) desc ";
			}else{
				sql = sql + " ,sum(tot.img_cnt) desc ";
			}
		}else if( tagOrder.equals("asc") ){
			if ( pdNameOrder.equals("") && keyOrder.equals("") ){
				sql = sql + " sum(tot.img_cnt) asc ";
			}else{
				sql = sql + " ,sum(tot.img_cnt) asc ";
			}
		}else{
		}

	    sql = sql + " LIMIT "+pageNo_new+" ,6; ";

//		out.print(sql);

		stmt = conn.createStatement();
		rs = stmt.executeQuery(sql);
		
		rs.last();
		int listCount = rs.getRow();
		if(listCount == 0){
			out.clear();
			out.print("NoN");
			return;
		};
		rs.beforeFirst();

		JSONArray arr = new JSONArray();		
		while(rs.next()){
			
			Integer pd_no     = Integer.parseInt(rs.getString("pd_no")); 
			String pd_code   = rs.getString("pd_code");     // 판매장번호
			String pd_name   = rs.getString("pd_name");   // 판매장명
			String group_tag   = rs.getString("group_tag");   // 판매장명	
			String img_cnt   = rs.getString("img_cnt"); 
			
			JSONObject obj = new JSONObject();
						
			obj.put("pd_no", pd_no);
			obj.put("pd_code", pd_code);
			obj.put("pd_name", pd_name);
			obj.put("group_tag", group_tag);
			obj.put("img_cnt", img_cnt);

			if(obj != null){
				arr.add(obj);
			}
		};

		bdListJSON.put("CompanyList", arr);
//		out.clear();
		out.print(bdListJSON);
	
	}catch(Exception e){
//		out.clear();
		out.print("exception error");	
	}finally{
		if(stmt != null) try{ stmt.close(); }catch(SQLException sqle) {};
		if(conn != null) try{ conn.close(); }catch(SQLException sqle) {};
	};
	
%>