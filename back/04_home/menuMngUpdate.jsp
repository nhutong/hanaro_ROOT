<%@ page contentType = "text/html;charset=utf-8" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="java.util.*" %>
<%@ page import="org.json.simple.*" %>
<%@ page import="java.sql.*" %>
<%@ page import="java.text.*" %>

<%@ include file = "../00_include/dbConn.jsp" %>

<%	
	String menu_no = (request.getParameter("menu_no")==null)? "0":request.getParameter("menu_no");
	String hide_fg = (request.getParameter("hide_fg")==null)? "0":request.getParameter("hide_fg");
	
	try{

		sql = "update vm_menu set hide_fg = '"+hide_fg+"' "
			+" where menu_no = "+menu_no+"";
	
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