<%@ page contentType = "text/html;charset=utf-8" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="java.util.*" %>
<%@ page import="org.json.simple.*" %>
<%@ page import="java.sql.*" %>
<%@ page import="java.text.*" %>

<%@ include file = "../00_include/dbConn.jsp" %>

<%	
	String couponNo = (request.getParameter("couponNo")==null)? "":request.getParameter("couponNo");
	String status_cd = (request.getParameter("status_cd")==null)? "0":request.getParameter("status_cd");

	try{

		sql = "update vm_coupon set status_cd = '"+status_cd+"' "
		    +" where coupon_no = '"+couponNo+"' ";
				
		pstmt = conn.prepareStatement(sql);
		pstmt.executeUpdate();

	}catch(Exception e){
		out.clear();
		out.print("exception error");	
	}finally{
//		out.print("success");
		if(pstmt != null) try{ pstmt.close(); }catch(SQLException sqle) {}
		if(conn != null) try{ conn.close(); }catch(SQLException sqle) {}
	};
	
%>