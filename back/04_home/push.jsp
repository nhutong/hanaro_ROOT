<%@ page contentType = "text/html;charset=utf-8" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="java.util.*" %>
<%@ page import="org.json.simple.*" %>
<%@ page import="java.sql.*" %>
<%@ page import="java.text.*" %>

<%@ include file = "../00_include/dbConn.jsp" %>

<%	
	String userCompanyNo = (request.getParameter("userCompanyNo")==null)? "0":request.getParameter("userCompanyNo");
	String memberNo = (request.getParameter("memberNo")==null)? "":request.getParameter("memberNo");

	JSONObject bdListJSON = new JSONObject();
	
	try{

        sql = " SELECT a.ms_content, ifnull(case when a.event_no = '' then 'home/main.html' else a.event_no end,'home/main.html') as event_no, c.VM_CP_NAME "  
		    + " from vm_push_message AS a "
		    + " INNER JOIN vm_member AS b "
		    + " ON a.vm_cp_no = b.company_no "
		    + " INNER JOIN vm_company AS c "
		    + " ON b.company_no = c.VM_CP_NO "
		    + " WHERE b.company_no = "+userCompanyNo
		    + " AND b.no = '"+memberNo+"' order by a.reg_date desc; ";
	
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
			
			String ms_content   = rs.getString("ms_content");        // 긴급공지번호
			String event_no = rs.getString("event_no");   // 긴급공지내용
			String VM_CP_NAME = rs.getString("VM_CP_NAME");   // 긴급공지내용
			
			JSONObject obj = new JSONObject();
						
			obj.put("ms_content", ms_content);
			obj.put("event_no", event_no);
			obj.put("VM_CP_NAME", VM_CP_NAME);

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