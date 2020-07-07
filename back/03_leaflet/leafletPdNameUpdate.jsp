<%@ page contentType = "text/html;charset=utf-8" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="java.util.*" %>
<%@ page import="org.json.simple.*" %>
<%@ page import="java.sql.*" %>
<%@ page import="java.text.*" %>

<%@ include file = "../00_include/dbConn.jsp" %>

<%	
	String jd_prod_con_no = (request.getParameter("jd_prod_con_no")==null)? "0":request.getParameter("jd_prod_con_no");
	String pd_name = (request.getParameter("pd_name")==null)? "0":request.getParameter("pd_name");
	String weight = (request.getParameter("weight")==null)? "0":request.getParameter("weight");	
	
	try{

		sql = "update vm_jundan_prod_content set pd_name = '"+pd_name+"', weight = '"+weight+"'  "
			+" where jd_prod_con_no = "+jd_prod_con_no+"";
	
		pstmt = conn.prepareStatement(sql);
		pstmt.executeUpdate();

	}catch(Exception e){
		out.clear();
		out.print("'exception error");	
	}finally{
		out.clear();
		out.print("success");
//		out.print(sql);
		if(pstmt != null) try{ pstmt.close(); }catch(SQLException sqle) {}
		if(conn != null) try{ conn.close(); }catch(SQLException sqle) {}
	};
	
%>