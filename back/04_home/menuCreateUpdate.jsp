<%@ page contentType = "text/html;charset=utf-8" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="java.util.*" %>
<%@ page import="org.json.simple.*" %>
<%@ page import="java.sql.*" %>
<%@ page import="java.text.*" %>

<%@ include file = "../00_include/dbPoolingConn.jsp" %>

<%	
	String menu_no = (request.getParameter("menu_no")==null)? "0":request.getParameter("menu_no");
	String menu_name = (request.getParameter("menu_name")==null)? "0":request.getParameter("menu_name");
	String menu_type_cd = (request.getParameter("menu_type_cd")==null)? "0":request.getParameter("menu_type_cd");
	String rcvCompanyNo = (request.getParameter("rcvCompanyNo")==null)? "0":request.getParameter("rcvCompanyNo");
	
	String rcvMenuName = menu_name.trim();

	try{

		sql = " update vm_menu set "
		    + " menu_name = '"+menu_name+"', "
			+ " menu_type_cd = '"+menu_type_cd+"' "
			+ " where menu_no = '"+menu_no+"' ";
	
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