<%@ page contentType = "text/html;charset=utf-8" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="java.util.*" %>
<%@ page import="org.json.simple.*" %>
<%@ page import="java.sql.*" %>
<%@ page import="java.text.*" %>

<%@ include file = "../00_include/dbConn.jsp" %>

<%	
	String popNo = (request.getParameter("popNo")==null)? "":request.getParameter("popNo");
	String show_flag = (request.getParameter("show_flag")==null)? "0":request.getParameter("show_flag");

	try{

		sql = "update vm_popup set show_flag = '"+show_flag+"' "
		    +" where popup_no = '"+popNo+"' ";
				
		pstmt = conn.prepareStatement(sql);
		pstmt.executeUpdate();

	}catch(Exception e){
		out.clear();
		out.print("exception error");	
	}finally{
//		out.print("success");
		if(pstmt != null) try{ pstmt.close(); }catch(SQLException sqle) {}
		if(conn != null) try{ conn.close(); }catch(SQLException sqle) {}
	};
	
%>