<%@ page contentType = "text/html;charset=utf-8" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="java.util.*" %>
<%@ page import="org.json.simple.*" %>
<%@ page import="java.sql.*" %>
<%@ page import="java.text.*" %>

<%@ include file = "../00_include/dbConn.jsp" %>

<%	
	String platform = (request.getParameter("platform")==null)? "null":request.getParameter("platform");

	JSONObject appVersionJSON = new JSONObject();
	
	try{
	    /* 2020.09.21 심규문  appversion 1.0.9 -> 1.0.10 max함수 구별 불가로 sort limit 방식으로 변경 
		sql = " SELECT max(a.app_version) as app_version "
			 +" FROM app_version AS a "
			 +" WHERE del_yn = 'N' and a.platform = '"+platform+"' ";
		*/	 

		sql = " SELECT a.app_version as app_version "
			 +" FROM app_version AS a "
			 +" WHERE del_yn = 'N' and a.platform = '"+platform+"' "			 
			 +" ORDER BY a.app_version LIMIT 1";			 
	
		stmt = conn.createStatement();
		rs = stmt.executeQuery(sql);
		
		rs.last();
		int listCount = rs.getRow();
		if(listCount == 0){
			out.clear();
			out.print("NoN");
			return;
		};
		rs.first();
		
		appVersionJSON.put("App_Version", rs.getString("app_version"));
		out.clear();
		out.print(appVersionJSON);
	
	}catch(Exception e){
		out.print("'exception error");	
	}finally{
		if(stmt != null) try{ stmt.close(); }catch(SQLException sqle) {};
		if(conn != null) try{ conn.close(); }catch(SQLException sqle) {};
	};
	
%>