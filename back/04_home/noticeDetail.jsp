<%@ page contentType = "text/html;charset=utf-8" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="java.util.*" %>
<%@ page import="org.json.simple.*" %>
<%@ page import="java.sql.*" %>
<%@ page import="java.text.*" %>

<%@ include file = "../00_include/dbConn.jsp" %>

<%	

	String rcv_nt_no = (request.getParameter("nt_no")==null)? "0":request.getParameter("nt_no");

	JSONObject bdListJSON = new JSONObject();
	
	try{

        sql = " SELECT a.nt_no, a.nt_title, a.nt_content, left(a.reg_date,10) as reg_date, b.vm_name "
		    + " FROM vm_company_notice AS a " 
			+ " inner join vm_user as b "
			+ " on a.reg_no = b.vm_no "
		    + " where a.nt_no = '" + rcv_nt_no + "' "
			+" order by a.reg_date desc "; 
	
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
			String vm_name = rs.getString("vm_name");
			
			JSONObject obj = new JSONObject();
						
			obj.put("nt_no", nt_no);
			obj.put("nt_title", nt_title);
			obj.put("nt_content", nt_content);
			obj.put("reg_date", reg_date);
			obj.put("vm_name", vm_name);

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