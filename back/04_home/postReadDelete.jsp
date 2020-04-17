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

    String post_no = (request.getParameter("post_no")==null)? "0":request.getParameter("post_no");

	try{

		// 전달받은 정보를 바탕으로 전단상품을 insert 한다.
		sql = " delete from vm_notice  "
			+ " where post_no = '"+post_no+"'; ";

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