<%@ page contentType = "text/html;charset=utf-8" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="java.util.*" %>
<%@ page import="org.json.simple.*" %>
<%@ page import="java.sql.*" %>
<%@ page import="java.text.*" %>

<%@ include file = "../00_include/dbPoolingConn.jsp" %>

<%	
	String from_date_origin = (request.getParameter("from_date_origin")==null)? "0":request.getParameter("from_date_origin");
	String to_date_origin = (request.getParameter("to_date_origin")==null)? "0":request.getParameter("to_date_origin");
	String jd_no = (request.getParameter("jd_no")==null)? "0":request.getParameter("jd_no");
	
	try{

		sql = "update vm_jundan set from_date = '"+from_date_origin+"', to_date = '"+to_date_origin+"' "
			+" where jd_no = "+jd_no+"";
	
		pstmt = conn.prepareStatement(sql);
		pstmt.executeUpdate();

	}catch(Exception e){
		out.clear();
		out.print("'exception error");	
	}finally{
		out.clear();
		out.print("success");
		if(pstmt != null) try{ pstmt.close(); }catch(SQLException sqle) {}
		if(conn != null) try{ conn.close(); }catch(SQLException sqle) {}
	};
	
%>