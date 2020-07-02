<%@ page contentType = "text/html;charset=utf-8" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="java.util.*" %>
<%@ page import="org.json.simple.*" %>
<%@ page import="java.sql.*" %>
<%@ page import="java.text.*" %>

<%@ include file = "../00_include/dbPoolingConn.jsp" %>

<%	
	String img_no = (request.getParameter("img_no")==null)? "0":request.getParameter("img_no");
	String pd_code = (request.getParameter("pd_code")==null)? "0":request.getParameter("pd_code");
	pd_code = pd_code.trim();
	String group_tag = (request.getParameter("group_tag")==null)? "0":request.getParameter("group_tag");

	try{

		sql = "update vm_product_image "
			+" set pd_code = '"+pd_code+"', group_tag = '"+group_tag+"' "
			+" where img_no = '"+img_no+"' ";

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