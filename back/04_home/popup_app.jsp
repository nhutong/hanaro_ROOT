<%@ page contentType = "text/html;charset=utf-8" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="java.util.*" %>
<%@ page import="org.json.simple.*" %>
<%@ page import="java.sql.*" %>
<%@ page import="java.text.*" %>

<%@ include file = "../00_include/dbConn.jsp" %>

<%	

	String vm_cp_no = (request.getParameter("vm_cp_no")==null)? "0":request.getParameter("vm_cp_no");

	JSONObject bdListJSON = new JSONObject();
	
	try{

        sql = " select kk.* from ( SELECT a.img_url, a.link_url, a.reg_date "
		+ " from vm_popup AS a "
		+ " WHERE a.company = "+vm_cp_no
		+ " AND a.period_type = 1 "
		+ " AND a.show_flag = 'Y' "
		+ " UNION "
		+ " SELECT a.img_url, a.link_url, a.reg_date "
		+ " from vm_popup AS a "
		+ " WHERE a.company = "+vm_cp_no
		+ " AND a.period_type = 2 "
		+ " AND a.show_flag = 'Y' "
		+ " AND left(start_date,10) <= left(now(),10) "
		+ " AND left(end_date,10) >= left(now(),10) ) as kk order by reg_date desc limit 0,1"; 
	
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
			
			String img_url   = rs.getString("img_url");        // 긴급공지번호
			String link_url = rs.getString("link_url");   // 긴급공지내용
			
			JSONObject obj = new JSONObject();
						
			obj.put("img_url", img_url);
			obj.put("link_url", link_url);

			if(obj != null){
				arr.add(obj);
			}
		};

		bdListJSON.put("CompanyList", arr);
		out.clear();
		out.print(bdListJSON);
	
	}catch(Exception e){
		out.clear();
		out.print("'exception error");	
	}finally{
		if(stmt != null) try{ stmt.close(); }catch(SQLException sqle) {};
		if(conn != null) try{ conn.close(); }catch(SQLException sqle) {};
	};
	
%>