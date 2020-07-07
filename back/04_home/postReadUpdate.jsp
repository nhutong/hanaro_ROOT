<%@ page contentType = "text/html;charset=utf-8" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="java.util.*" %>
<%@ page import="org.json.simple.*" %>
<%@ page import="java.sql.*" %>
<%@ page import="java.text.*" %>
<%@ page import="java.io.File,java.util.Date"%>

<%@ include file = "../00_include/dbConn.jsp" %>
<%@ include file = "../00_include/common.jsp" %>

<%

    String post_no = (request.getParameter("post_no")==null)? "0":request.getParameter("post_no");
	String post_title = (request.getParameter("post_title")==null)? "0":request.getParameter("post_title");
	String post_content = (request.getParameter("post_content")==null)? "0":request.getParameter("post_content");
	String notice_fg = (request.getParameter("notice_fg")==null)? "0":request.getParameter("notice_fg");

	try{

		// 전달받은 정보를 바탕으로 전단상품을 insert 한다.
		sql = " update vm_notice  "
		    + " set title = '"+post_title+"', "
			+ " content = '"+post_content+"', "
			+ " post_type_cd = '"+notice_fg+"', "
			+ " lst_date = now() "
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