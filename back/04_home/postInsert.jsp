<%@ page contentType = "text/html;charset=utf-8" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="java.util.*" %>
<%@ page import="org.json.simple.*" %>
<%@ page import="java.sql.*" %>
<%@ page import="java.text.*" %>
<%@ page import="java.io.File,java.util.Date,jxl.*"%>

<%@ include file = "../00_include/dbConn.jsp" %>
<%@ include file = "../00_include/common.jsp" %>

<%

	String post_title = (request.getParameter("post_title")==null)? "0":request.getParameter("post_title");
	String post_content = (request.getParameter("post_content")==null)? "0":request.getParameter("post_content");
	String reg_no = (request.getParameter("reg_no")==null)? "0":request.getParameter("reg_no");
	String noticeFg = (request.getParameter("noticeFg")==null)? "0":request.getParameter("noticeFg");

	try{

		// 전달받은 정보를 바탕으로 전단상품을 insert 한다.
		sql = " insert into vm_notice (post_type_cd, title, content, reg_no, reg_date, lst_no, lst_date) "
			+ " values('"+noticeFg+"', '"+post_title+"', '"+post_content+"', '"+reg_no+"', now(), '"+reg_no+"', now()); ";

		pstmt = conn.prepareStatement(sql);
		pstmt.executeUpdate();

		out.clear();
		out.print("success");

	}catch(Exception e){
		out.clear();
		out.print("exception error");	
	}finally{
		if(pstmt != null) try{ pstmt.close(); }catch(SQLException sqle) {}
		if(conn != null) try{ conn.close(); }catch(SQLException sqle) {}
	};


%>