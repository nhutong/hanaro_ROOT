<%@ page contentType = "text/html;charset=utf-8" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="java.util.*" %>
<%@ page import="org.json.simple.*" %>
<%@ page import="java.sql.*" %>
<%@ page import="java.text.*" %>

<%@ include file = "../00_include/dbConn.jsp" %>

<%	
	Integer list_size = 5;
	String vm_cp_no = (request.getParameter("vm_cp_no")==null)? "0":request.getParameter("vm_cp_no");
	Integer n_page = (request.getParameter("n_page")==null)? 1:Integer.parseInt(request.getParameter("n_page"));
	Integer s_page = (n_page - 1) * list_size;
	JSONObject bdListJSON = new JSONObject();
	
	try{

        sql = " SELECT a.nt_no, a.nt_title, a.nt_content, left(a.reg_date,10) as reg_date "
		    + " FROM vm_company_notice AS a " 
		    + " where vm_cp_no = '" + vm_cp_no + "' "
			+" order by a.reg_date desc LIMIT " + s_page + ", 5"; 
	
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
			
			String nt_no   = rs.getString("nt_no");        // 긴급공지번호
			String nt_title = rs.getString("nt_title");   // 긴급공지내용
			String nt_content = rs.getString("nt_content");   // 긴급공지내용
			String reg_date = rs.getString("reg_date");   // 긴급공지내용
			
			JSONObject obj = new JSONObject();
						
			obj.put("nt_no", nt_no);
			obj.put("nt_title", nt_title);
			obj.put("nt_content", nt_content);
			obj.put("reg_date", reg_date);

			if(obj != null){
				arr.add(obj);
			}
		};

		bdListJSON.put("CompanyList", arr);
		out.clear();
		out.print(bdListJSON);
	
	}catch(Exception e){
		out.clear();
		out.print("exception error");	
	}finally{
		if(stmt != null) try{ stmt.close(); }catch(SQLException sqle) {};
		if(conn != null) try{ conn.close(); }catch(SQLException sqle) {};
	};
	
%>