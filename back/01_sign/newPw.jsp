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
<%@ include file = "../00_include/dbConn_before.jsp" %>

<%	
		

	String pw = request.getParameter("password") == null? "":request.getParameter("password");
	String email = request.getParameter("email") == null? "":request.getParameter("email");
	
	JSONArray arr = new JSONArray();		
	JSONObject obj = new JSONObject();
	obj.put("result", "success");
	arr.add(obj);		
	out.clear();
	out.print(arr);
	if(pw.equals("")){
		obj.put("result", "password not found");
		arr.add(obj);		
		out.clear();
		out.print(arr);
		return;
	};
	if(email.equals("")){
		
		obj.put("result", "session error");
		arr.add(obj);		
		out.clear();
		out.print(arr);
		return;
	}
	
	//패스워드 암호화 및 이전 PW 
	sql = "SELECT `EBGA_CREATE_PW_SHA`('"+pw+"')as shaPw, vm_no as userNo from vm_user where vm_email = '"+email+"'";
	
	stmt = conn.createStatement();
	rs = stmt.executeQuery(sql);
	rs.next(); // 하나의 데이터라도 next 함수 이용
	String shaPw = rs.getString("shaPw");
	String userNo = rs.getString("userNo");
	
	
	try{

		sql = "update vm_user set vm_pw ='"+shaPw+"', vm_last_no = '"+userNo+"', vm_last_date = now() where vm_email = '"+email+"'";
		pstmt = conn.prepareStatement(sql);
		pstmt.executeUpdate();
				
		obj.put("result", "success");
		arr.add(obj);		
		out.clear();
		out.print(arr);

	}catch(Exception e){
		obj.put("result", e.getMessage());
		arr.add(obj);		
		out.clear();
		out.print(arr);
	}finally{
		if(stmt != null) try { stmt.close(); } catch(SQLException sqle) {}
   		if(conn != null) try { conn.close(); } catch(SQLException sqle) {}	
	};
	
	
	

%>

