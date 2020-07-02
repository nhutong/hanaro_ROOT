<%@ page contentType = "text/html;charset=utf-8" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="org.json.simple.*" %>
<%@ page import="java.util.*" %>
<%@ page import="java.util.Properties" %>
<%@ page import="java.sql.*" %>
<%@ page import="java.io.*" %>
<%@ page import="javax.mail.Session" %>
<%@ page import="javax.mail.*" %>
<%@ page import="javax.mail.Message" %>
<%@ page import="javax.mail.Transport" %>
<%@ page import="javax.mail.internet.InternetAddress" %>
<%@ page import="javax.mail.internet.MimeMessage" %>
<%@ page import="javax.mail.internet.MimeUtility" %>
<%@ include file = "../00_include/dbPoolingConn.jsp" %>


<%	

	// 세션테이블 하루 지난것 삭제
	try{
		sql = "delete from vm_session where reg_date < date_sub(now(), interval 1 day)";
		pstmt = conn.prepareStatement(sql);
		pstmt.executeUpdate();
		}catch(Exception e){
	// 		e.getMessage();
	}

	String email = request.getParameter("email")==null?"":request.getParameter("email");	
	String authcode = request.getParameter("authcode")==null?"0":request.getParameter("authcode");
	int codeNo = Integer.parseInt(authcode); 	
	if(codeNo == 0 || email.equals("")){
		out.print("empty");
		return;
	};
	try{
		sql = "select session_no from vm_session where email = '"+email+"' order by reg_date desc limit 1";
		stmt = conn.createStatement();
		rs = stmt.executeQuery(sql);
		rs.next();
		int sessNo = rs.getInt("session_no");
		
		JSONArray arr = new JSONArray();		
		JSONObject obj = new JSONObject();

		if(codeNo == sessNo){
			obj.put("result", "success");
		}else{
			obj.put("result", "unmatch");
		};
		arr.add(obj);		
		out.clear();
		out.print(arr);

	}catch(Exception e){
		out.print(e.getMessage());
	}finally{		
		if(stmt != null) try { stmt.close(); } catch(SQLException sqle) {}
		if(conn != null) try { conn.close(); } catch(SQLException sqle) {}
	}
   
%>
