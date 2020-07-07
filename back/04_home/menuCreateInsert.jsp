<%@ page contentType = "text/html;charset=utf-8" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="java.util.*" %>
<%@ page import="org.json.simple.*" %>
<%@ page import="java.sql.*" %>
<%@ page import="java.text.*" %>

<%@ include file = "../00_include/dbConn.jsp" %>

<%	
	String menu_name = (request.getParameter("menu_name")==null)? "0":request.getParameter("menu_name");
	String menu_type_cd = (request.getParameter("menu_type_cd")==null)? "0":request.getParameter("menu_type_cd");
	String rcvCompanyNo = (request.getParameter("rcvCompanyNo")==null)? "0":request.getParameter("rcvCompanyNo");
	
	String rcvMenuName = menu_name.trim();

	try{

		sql = "insert into vm_menu(hide_fg, reg_date, menu_name, menu_type_cd, ref_cp_no) "
			+" values('N', now(), '"+rcvMenuName+"', '"+menu_type_cd+"', '"+rcvCompanyNo+"'); ";
	
		pstmt = conn.prepareStatement(sql);
		pstmt.executeUpdate();


	}catch(Exception e){
		out.clear();
		out.print("'exception error");	
	}finally{
		out.print("success");
		if(pstmt != null) try{ pstmt.close(); }catch(SQLException sqle) {}
		if(conn != null) try{ conn.close(); }catch(SQLException sqle) {}
	};
	
%>