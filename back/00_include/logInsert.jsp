<%@ page contentType = "text/html;charset=utf-8" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="java.net.URLDecoder"%>
<%@ page import="java.util.*" %>
<%@ page import="org.json.simple.*" %>
<%@ page import="java.sql.*" %>
<%@ page import="java.text.*" %>

<%@ include file = "../00_include/dbPoolingConn.jsp" %>

<%

String sessionNo = (request.getParameter("stel")==null)? "0":request.getParameter("stel");
String sessionVmCpNo = (request.getParameter("svm_cp_no")==null)? "0":request.getParameter("svm_cp_no");
String sessionMenuNo = (request.getParameter("srcv_menu_no")==null)? "0":request.getParameter("srcv_menu_no");
String addressIp = request.getRemoteAddr();

String pageUrl = (request.getParameter("pageName")==null)? "0":request.getParameter("pageName");
//String pageUrl = request.getRequestURL().toString();

String browseOs = request.getHeader("User-Agent");

	try{

	/* 배송주문 마스터에 insert */
	sql = " insert into eb_page_contact_log_front (IP_ADDRESS, LST_UPDATE_DATE, SESSION_ID_NAME, PAGE_NAME, vm_cp_no, web_fg, menu_cd ) "
	    + " values( '"+addressIp+"', now(), '"+sessionNo+"', '"+pageUrl+"', '"+sessionVmCpNo+"', '"+browseOs+"', '"+sessionMenuNo+"'); "; 
//out.print(sql);
	pstmt = conn.prepareStatement(sql);
	pstmt.executeUpdate();

	}catch(Exception e){
//		out.clear();
		out.print("exception error");	
	}finally{
//		out.clear();
		out.print("success");
		if(pstmt != null) try{ pstmt.close(); }catch(SQLException sqle) {}
		if(conn != null) try{ conn.close(); }catch(SQLException sqle) {}
	};
%>