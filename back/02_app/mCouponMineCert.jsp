<%@ page contentType = "text/html;charset=utf-8" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="java.util.*" %>
<%@ page import="org.json.simple.*" %>
<%@ page import="java.sql.*" %>
<%@ page import="java.text.*" %>

<%@ include file = "../00_include/dbPoolingConn.jsp" %>

<%	
	String mcNo = (request.getParameter("mcNo")==null)? "0":request.getParameter("mcNo");

	//중복 체크
	sql = "select mc_no from vm_member_coupon where mc_no = "+mcNo+" and staff_cert_fg = 'Y' ";

	stmt = conn.createStatement();
	rs = stmt.executeQuery(sql);
	rs.last(); 
	int listCount = rs.getRow(); // 현재 커서의 row Index값을 저장 
	if(listCount > 0){
		out.clear();
		out.print("dup");
		return;
	}

	try{

		sql = " update vm_member_coupon set staff_cert_fg = 'Y', staff_cert_date = now() "
			 +" where mc_no = "+mcNo;
				
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