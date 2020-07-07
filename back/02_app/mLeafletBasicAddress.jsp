<%@ page contentType = "text/html;charset=utf-8" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="java.util.*" %>
<%@ page import="org.json.simple.*" %>
<%@ page import="java.sql.*" %>
<%@ page import="java.text.*" %>

<%@ include file = "../00_include/dbConn.jsp" %>

<%	
	String memberNo = (request.getParameter("memberNo")==null)? "":request.getParameter("memberNo");

	JSONObject bdListJSON = new JSONObject();
	
	try{
	
		sql = " SELECT ifnull(address1,'') as address1, ifnull(address2,'') as address2 "
			 +" FROM vm_member "
			 +" WHERE no = '"+memberNo+"'; "; 
	
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
			
			String address1 = rs.getString("address1");   // 판매장명
			String address2 = rs.getString("address2"); 
			
			JSONObject obj = new JSONObject();
						
			obj.put("address1", address1);
			obj.put("address2", address2);
			
			if(obj != null){
				arr.add(obj);
			}
		};

		bdListJSON.put("CompanyName", arr);

		out.clear();
		out.print(bdListJSON);
	
	}catch(Exception e){
		out.print("exception error");	
	}finally{
		if(stmt != null) try{ stmt.close(); }catch(SQLException sqle) {};
		if(conn != null) try{ conn.close(); }catch(SQLException sqle) {};
	};
	
%>