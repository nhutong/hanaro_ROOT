<%@ page contentType = "text/html;charset=utf-8" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="java.util.*" %>
<%@ page import="org.json.simple.*" %>
<%@ page import="java.sql.*" %>
<%@ page import="java.text.*" %>

<%@ include file = "../00_include/dbPoolingConn.jsp" %>

<%	
	String sn_no = (request.getParameter("sn_no")==null)? "0":request.getParameter("sn_no");
	String Text1 = (request.getParameter("Text1")==null)? "0":request.getParameter("Text1");
	
	try{

		sql = "update vm_sudden_notice set sn_content = '"+Text1+"' "
		    +" where sn_no = "+sn_no+"";
				
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