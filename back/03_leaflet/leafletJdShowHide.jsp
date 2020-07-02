<%@ page contentType = "text/html;charset=utf-8" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="java.util.*" %>
<%@ page import="org.json.simple.*" %>
<%@ page import="java.sql.*" %>
<%@ page import="java.text.*" %>

<%@ include file = "../00_include/dbPoolingConn.jsp" %>

<%	
	String jd_no = (request.getParameter("jd_no")==null)? "0":request.getParameter("jd_no");
	
	try{

		sql = "update vm_jundan set show_fg = ( case when show_fg is null then 'Y' when show_fg = 'N' then 'Y' else 'N' end )"
			+" where jd_no = "+jd_no;
	
		pstmt = conn.prepareStatement(sql);
		pstmt.executeUpdate();

	}catch(Exception e){
		out.clear();
		out.print("exception error");	
	}finally{
		out.clear();
		out.print("success");
//		out.print(sql);
		if(pstmt != null) try{ pstmt.close(); }catch(SQLException sqle) {}
		if(conn != null) try{ conn.close(); }catch(SQLException sqle) {}
	};
	
%>