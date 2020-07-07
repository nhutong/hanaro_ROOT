<%@ page contentType = "text/html;charset=utf-8" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="java.net.URLDecoder" %>
<%@ page import="java.util.*" %>
<%@ page import="org.json.simple.*" %>
<%@ page import="java.sql.*" %>
<%@ page import="java.text.*" %>

<%@ include file = "../00_include/dbConn.jsp" %>

<%	

	String memberNo = (request.getParameter("memberNo")==null)? "":request.getParameter("memberNo");
	String vm_cp_no = (request.getParameter("vm_cp_no")==null)? "0":request.getParameter("vm_cp_no");
	String title = (request.getParameter("title")==null)? "0":request.getParameter("title");
	String contents = (request.getParameter("contents")==null)? "0":request.getParameter("contents");

	try{

		sql = "insert into vm_company_qna(nt_title, nt_content, reg_date, reg_member_no, vm_cp_no) "
			+" values('"+URLDecoder.decode(title,"utf-8")+"', '"+URLDecoder.decode(contents,"utf-8")+"', now(), '"+memberNo+"', '"+vm_cp_no+"'); ";
	
		pstmt = conn.prepareStatement(sql);
		pstmt.executeUpdate();

//out.print(sql);
	}catch(Exception e){
		out.clear();
		out.print("'exception error");	
	}finally{
		out.print("success");
		if(pstmt != null) try{ pstmt.close(); }catch(SQLException sqle) {}
		if(conn != null) try{ conn.close(); }catch(SQLException sqle) {}
	};
	
%>