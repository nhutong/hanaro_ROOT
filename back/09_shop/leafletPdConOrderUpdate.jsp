<%@ page contentType = "text/html;charset=utf-8" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="java.util.*" %>
<%@ page import="org.json.simple.*" %>
<%@ page import="java.sql.*" %>
<%@ page import="java.text.*" %>

<%@ include file = "../00_include/dbPoolingConn.jsp" %>

<%	
	String orderArray = (request.getParameter("orderArray")==null)? "0":request.getParameter("orderArray");
	String comma = ",";
	String[] sArray = orderArray.split(comma);
	int j;
	
	try{
	
	    for ( int i = 0; i < sArray.length ; i++ ){

			j = i + 1;
			sql = "update vm_jundan_prod_content set order_number = "+j+" where jd_prod_con_no = "+sArray[i];
		
			pstmt = conn.prepareStatement(sql);
			pstmt.executeUpdate();

		}

	}catch(Exception e){
		out.clear();
		out.print("'exception error");	
	}finally{
		out.clear();
		out.print("success");
		if(pstmt != null) try{ pstmt.close(); }catch(SQLException sqle) {}
		if(conn != null) try{ conn.close(); }catch(SQLException sqle) {}
	};
	
%>