<%@ page contentType = "text/html;charset=utf-8" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="java.util.*" %>
<%@ page import="org.json.simple.*" %>
<%@ page import="java.sql.*" %>
<%@ page import="java.text.*" %>

<%@ include file = "../00_include/dbConn.jsp" %>

<%	
	String pd_name = (request.getParameter("pd_name")==null)? "0":request.getParameter("pd_name");
	String pd_code = (request.getParameter("pd_code")==null)? "0":request.getParameter("pd_code");
	String group_tag = (request.getParameter("group_tag")==null)? "0":request.getParameter("group_tag");

//	String rcvImgNo = imgNo.replaceAll(" ","");

	try{

		sql = "update vm_product set pd_name = '"+pd_name+"', group_tag='"+group_tag+"' "
			+" where pd_code = '"+pd_code+"'; ";

		pstmt = conn.prepareStatement(sql);
		pstmt.executeUpdate();

	}catch(Exception e){
		out.clear();
		out.print("exception error");	
	}finally{
		out.clear();
		out.print("success");
		if(pstmt != null) try{ pstmt.close(); }catch(SQLException sqle) {}
		if(conn != null) try{ conn.close(); }catch(SQLException sqle) {}
	};
	
%>