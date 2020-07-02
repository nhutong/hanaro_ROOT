<%@ page contentType = "text/html;charset=utf-8" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="java.util.*" %>
<%@ page import="org.json.simple.*" %>
<%@ page import="java.sql.*" %>
<%@ page import="java.text.*" %>

<%@ include file = "../00_include/dbPoolingConn.jsp" %>

<%	
	String pageNo = (request.getParameter("pageNo")==null)? "0":request.getParameter("pageNo");
	String searchText = (request.getParameter("searchText")==null)? "0":request.getParameter("searchText");	
	String orderByText = (request.getParameter("orderByText")==null)? "":request.getParameter("orderByText");
	Integer pageNo_new;

	//mariadb의 페이징 시작 쿼리를 위해 1을 뺀다.
	pageNo_new = Integer.parseInt(pageNo) - 1;
	pageNo_new = pageNo_new * 10;

	JSONObject bdListJSON = new JSONObject();
	
	try{
        
        sql = " SELECT a.pd_no, a.pd_code, a.pd_name, a.group_tag, " //a.reg_no, a.reg_date, a.lst_no, a.lst_date, "
            + " ifnull(bb.pd_code_cnt,0) AS pd_code_cnt, ifnull(cc.group_tag_cnt,0) AS group_tag_cnt "
            + " from vm_product a "
			+ " LEFT OUTER JOIN vm_product_image d "    //2020.06.18 심규문 상품검색 이미지명 추가
            + " ON a.pd_code = d.pd_code "
            + " LEFT OUTER JOIN ( "
            + "     SELECT b.pd_code, COUNT(b.img_no) pd_code_cnt "
            + "     from vm_product_image AS b "
            + "     WHERE b.pd_code IS NOT NULL "
            + "       AND b.pd_code != '' "
            + "       AND b.std_fg = 'Y' "
            + "     GROUP BY b.pd_code "
            + " ) bb ON a.pd_code = bb.pd_code "
            + " LEFT OUTER JOIN ( "
            + "     SELECT c.group_tag, COUNT(c.img_no) as group_tag_cnt "
            + "     FROM vm_product_image c "
            + "    where c.group_tag IS NOT NULL "
            + "      AND c.group_tag != '' "
            + "      AND c.std_fg = 'Y' "
            + "    GROUP BY c.group_tag "
            + " ) cc ON a.group_tag = cc.group_tag "
			+ " WHERE 1 = 1 ";
			
			if (searchText != ""){
				sql = sql + " and ( a.pd_name like '%"+searchText+"%' or a.group_tag like '%"+searchText+"%' or a.pd_code like '%"+searchText+"%' or d.img_path like '%"+searchText+"%')";  //2020.06.18 심규문 상품검색 이미지명 추가
			}			

			if (orderByText != ""){
				sql = sql + " ORDER BY " + orderByText;
			}
			
			sql = sql + " LIMIT "+pageNo_new+" , 10; ";
			
		out.print(sql);

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
			String pd_code_cnt   = rs.getString("pd_code_cnt"); 
			String group_tag_cnt   = rs.getString("group_tag_cnt"); 
			
			JSONObject obj = new JSONObject();
						
			obj.put("pd_no", pd_no);
			obj.put("pd_code", pd_code);
			obj.put("pd_name", pd_name);
			obj.put("group_tag", group_tag);
			obj.put("pd_code_cnt", pd_code_cnt);
			obj.put("group_tag_cnt", group_tag_cnt);

			obj.put("sql", sql);

			if(obj != null){
				arr.add(obj);
			}
		};

		bdListJSON.put("CompanyList", arr);
		out.clear();
		out.print(bdListJSON);
	
	}catch(Exception e){
		out.clear();
		out.print("exception error"+","+e);	
	}finally{
		if(stmt != null) try{ stmt.close(); }catch(SQLException sqle) {};
		if(conn != null) try{ conn.close(); }catch(SQLException sqle) {};
	};
	
%>