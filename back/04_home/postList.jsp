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
	Integer pageNo_new;

//	mariadb의 페이징 시작 쿼리를 위해 1을 뺀다.
	pageNo_new = Integer.parseInt(pageNo) - 1;
	pageNo_new = pageNo_new * 15;

	JSONObject bdListJSON = new JSONObject();
	
	try{

	
		sql = " (SELECT " 
		+ "  pp.post_no, concat('[공지] ',pp.title) as title, a.vm_name, DATE_FORMAT(pp.reg_date, '%Y-%m-%d') AS regDate, pp.view_count, post_type_cd, lst_date "
        + "  FROM vm_notice AS pp " 
		+ "  inner join vm_user as a " 
		+ "  on pp.reg_no = a.vm_no " 
        + "  WHERE pp.post_type_cd = 'NOTICE' " 
		+ " ) "
		+ " UNION "
	    + " ( SELECT "
		+ " p.post_no, p.title, a.vm_name, DATE_FORMAT(p.reg_date, '%Y-%m-%d') AS regDate, p.view_count, post_type_cd, lst_date "
        + " FROM vm_notice AS p "
		+ " inner join vm_user as a "
		+ " on p.reg_no = a.vm_no "
        + " WHERE p.post_type_cd = 'POST' ";   
		
		if (searchText != ""){
           sql = sql + " and ( p.title like '%"+searchText+"' or a.vm_name like '%"+searchText+"%' or p.content like '%"+searchText+"%' )";
		}else{
		   sql = sql + " ";
		}
	
	sql = sql + " ) "
	          + " ORDER BY post_type_cd ASC, lst_date desc "
	          + " LIMIT "+pageNo_new+" ,15; ";

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
			
			Integer post_no     = Integer.parseInt(rs.getString("post_no")); 
			String title   = rs.getString("title");     // 판매장번호
			String vm_name   = rs.getString("vm_name");   // 판매장명
			String regDate   = rs.getString("regDate");   // 판매장명
			String view_count   = rs.getString("view_count");
			
			JSONObject obj = new JSONObject();
						
			obj.put("post_no", post_no);
			obj.put("title", title);
			obj.put("vm_name", vm_name);
			obj.put("regDate", regDate);
			obj.put("view_count", view_count);

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