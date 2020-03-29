<%@ page contentType = "text/html;charset=utf-8" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="java.util.*" %>
<%@ page import="org.json.simple.*" %>
<%@ page import="java.sql.*" %>
<%@ page import="java.text.*" %>

<%@ include file = "../00_include/dbConn.jsp" %>

<%	
	String eventNo = (request.getParameter("eventNo")==null)? "0":request.getParameter("eventNo");
	String memberNo = (request.getParameter("memberNo")==null)? "0":request.getParameter("memberNo");

	//중복 체크
	sql = "select me_no from vm_member_event where no = '"+memberNo+"' and event_no = "+eventNo;

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

		sql = " insert into vm_member_event (event_no, no, reg_date) "
			 +" values ("+eventNo+", '"+memberNo+"', now())";
				
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