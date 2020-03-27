<%@ page contentType = "text/html;charset=utf-8" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="java.net.URLDecoder" %>
<%@ page import="java.util.*" %>
<%@ page import="org.json.simple.*" %>
<%@ page import="java.sql.*" %>
<%@ page import="java.text.*" %>

<%@ include file = "../00_include/dbConn.jsp" %>
<!-- <%@ include file = "../00_include/common.jsp" %> -->

<%	
	String rcvTitle = (request.getParameter("rcvTitle")==null)? "0":request.getParameter("rcvTitle");
	String rcvContent = (request.getParameter("rcvContent")==null)? "0":request.getParameter("rcvContent");
	String nt_no = (request.getParameter("nt_no")==null)? "0":request.getParameter("nt_no");
	String userNo = (request.getParameter("userNo")==null)? "0":request.getParameter("userNo");

	try{

		sql = "update vm_company_notice set "
			+" nt_title = '"+java.net.URLDecoder.decode(rcvTitle,"UTF-8")+"', "
			+" nt_content = '"+java.net.URLDecoder.decode(rcvContent,"UTF-8")+"', "
			+" reg_no = '"+userNo+"', "
			+" reg_date = now() "
			+" where nt_no = "+Integer.parseInt(nt_no);
	
		pstmt = conn.prepareStatement(sql);
		pstmt.executeUpdate();

	}catch(Exception e){
		out.clear();
		out.print("exception error");	
	}finally{
		out.print("success");
		if(pstmt != null) try{ pstmt.close(); }catch(SQLException sqle) {}
		if(conn != null) try{ conn.close(); }catch(SQLException sqle) {}
	};
	
%>