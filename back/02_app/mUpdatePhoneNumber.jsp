<%@ page contentType = "text/html;charset=utf-8" %>
<%@ page import="java.sql.*" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="java.util.*" %>
<%@ page import="org.json.simple.*" %>
<%@ page import="java.text.*" %>
<%@ include file = "../00_include/dbPoolingConn.jsp" %>

<%	

    String company_no = request.getParameter("company_no")==null? "":request.getParameter("company_no"); // 매장	
	String tel = request.getParameter("tel")==null? "":request.getParameter("tel"); // 이름
	String usim = request.getParameter("usim")==null? "":request.getParameter("usim"); // 유심
	String agree_privacy = request.getParameter("agree_privacy")==null? "":request.getParameter("agree_privacy"); // 유심동의
	String agree_push = request.getParameter("agree_push")==null? "":request.getParameter("agree_push"); // 푸시동의
	String agree_location = request.getParameter("agree_location")==null? "":request.getParameter("agree_location"); // 위치동의

	if( tel == "" || tel.equals("null") ) {
        out.clear();
        out.print("tel empty");
		return;
	}

	sql = "select no from vm_member where tel = '"+tel+"' ; ";

	stmt = conn.createStatement();
	rs = stmt.executeQuery(sql);
	rs.last(); 
	int listCount = rs.getRow(); // 현재 커서의 row Index값을 저장 
	if(listCount > 0){
		out.clear();
		out.print("Dup");
		return;
	}

	try
	{	

        sql = "insert into vm_member (tel, company_no, agree_privacy, agree_push, agree_location, reg_date, usim, push_agree_date)"+
            "values"+
            "('"+tel+"', '"+company_no+"', '"+agree_privacy+"', '"+agree_push+"', '"+agree_location+"', now(), '"+usim+"', now() )";

		pstmt = conn.prepareStatement(sql);	
		pstmt.executeUpdate();
	
		sql = "select no from vm_member where tel = '"+tel+"' ; ";

		stmt = conn.createStatement();
		rs = stmt.executeQuery(sql);
		rs.last(); 
		int listCount1 = rs.getRow(); // 현재 커서의 row Index값을 저장 
		String member_no = "";
		if(listCount1 > 0){
			out.clear();
			member_no = rs.getString("no");
			out.print(member_no);
			return;
		}

	}	
	catch(Exception e)
	{		
		out.println("ERROR");		
		out.println(e.getMessage());
		
		return;
	}
	finally
	{	
	 	if(pstmt != null) try { pstmt.close(); } catch(SQLException sqle) {}
   		if(conn != null) try { conn.close(); } catch(SQLException sqle) {}
	}

%>
