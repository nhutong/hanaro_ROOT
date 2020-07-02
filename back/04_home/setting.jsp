<%@ page contentType = "text/html;charset=utf-8" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="java.util.*" %>
<%@ page import="org.json.simple.*" %>
<%@ page import="java.sql.*" %>
<%@ page import="java.text.*" %>

<%@ include file = "../00_include/dbPoolingConn.jsp" %>

<%	
	String memberNo = (request.getParameter("memberNo")==null)? "":request.getParameter("memberNo");

	JSONObject bdListJSON = new JSONObject();
	
	try{

        sql = " SELECT ifnull(a.agree_push,'N') as agree_push, ifnull(a.agree_location,'N') as agree_location FROM vm_member AS a WHERE a.no = '"+memberNo+"'; "; 
	
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
			
			String agree_push   = rs.getString("agree_push");        // 긴급공지번호
			String agree_location = rs.getString("agree_location");   // 긴급공지내용
			
			JSONObject obj = new JSONObject();
						
			obj.put("agree_push", agree_push);
			obj.put("agree_location", agree_location);

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