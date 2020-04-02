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
<%@ include file = "../00_include/dbConn.jsp" %>


<%	

	String email = request.getParameter("email")==null?"":request.getParameter("email");	

	//out.print(email);
	if(email.equals("")){
    	out.print("empty");
    	return;
	};
	
	
	try{
		sql = "select vm_no from vm_user where vm_email = '"+email+"'";
		stmt = conn.createStatement();
		rs = stmt.executeQuery(sql);
		rs.last();
		int listCount = rs.getRow();
		if(listCount == 0){	
			JSONArray arr = new JSONArray();		
			JSONObject obj = new JSONObject();			
			obj.put("result", "no_user");
			arr.add(obj);		
			out.clear();
			out.print(arr);
			return;
		};	
		
	}catch(Exception e){
		return;		
	}finally{
//		if(stmt != null) try { stmt.close(); } catch(SQLException sqle) {}
 //  		if(conn != null) try { conn.close(); } catch(SQLException sqle) {}
	}

	String ran = Double.toString(Math.floor(Math.random() * 1000000)+1).substring(1,6);
 	out.print(ran);
	
	try{	
		sql = "insert into vm_session (session_no, reg_date, email) values("+ran +", now(), '"+email+"')";		
		pstmt = conn.prepareStatement(sql);
		pstmt.executeUpdate();	
		
	}catch(Exception e){		
 		out.print(e.getMessage());
		return;		
	}finally{
		if(stmt != null) try { stmt.close(); } catch(SQLException sqle) {}
   		if(conn != null) try { conn.close(); } catch(SQLException sqle) {}
	}


	String emailContent = "<!DOCTYPE html>" +
		"<html>" +
		"    <head>" +
		"" +
		"        <meta charset=\"utf-8\">" +
		"" +
		"    </head>" +
		"    <body>" +
		"            <section style=\"padding:15px; text-align:center; width:300px; border:1px solid #eeeeee; background-color:#f8f8f8;\">" +
		"                <h3 style=\"font-size:14px; font-weight:600; color:#55b190;\">관리자 인증코드 </h3>" +
		"" +
		"" + "인증코드<br/>"+ran+
		"                    " +
		"                    </section><p style=\"width:330px; text-align:center;font-size:12px; margin-top:30px;\">(주)농협유통 Co. ltd. All right reserved</p>" +
		"    </body>" +
		"</html>";
	
%>

<%// vis 구글 계정
	final String username  = "kacmapp1995@gmail.com";
	final String password  = "kacm!995050!";
%>
<% // 메일 발송
	Properties props = new Properties(); 
	props.put("mail.smtp.host", "smtp.gmail.com"); 
	props.put("mail.smtp.port", "25"); 
	props.put("mail.debug", "true"); 
	props.put("mail.smtp.auth", "true"); 
	props.put("mail.smtp.starttls.enable","true"); 
	props.put("mail.smtp.starttls.enable","true");         
	props.put("mail.smtp.connectiontimeout","t1");
	props.put("mail.smtp.timeout","t2");

	props.put("mail.smtp.ssl.enable", "true"); 
	props.put("mail.smtp.ssl.trust", "smtp.gmail.com");
	
	props.setProperty("mail.smtp.socketFactory.class", "javax.net.ssl.SSLSocketFactory");   
	props.setProperty("mail.smtp.socketFactory.fallback", "false");
	props.setProperty("mail.smtp.port", "465");   
	props.setProperty("mail.smtp.socketFactory.port", "465"); 

	Session sess = Session.getInstance(props, new javax.mail.Authenticator() { 
		protected PasswordAuthentication getPasswordAuthentication() { 
			return new PasswordAuthentication(username, password); 
			}});

	try{
	    Message message = new MimeMessage(sess); 
		message.setSubject(MimeUtility.encodeText("[농협유통] 이메일 인증코드 입니다.","UTF-8","B"));
	    message.setContent("Mail Content", "text/plain");
	    message.setFrom(new InternetAddress(username));// 
	    message.setRecipient(Message.RecipientType.TO, new InternetAddress(email)); 	    
		message.setContent(emailContent, "text/html; charset=UTF-8");

	    Transport.send(message);

		JSONArray arr = new JSONArray();		
		JSONObject obj = new JSONObject();
		obj.put("result", "success");
		arr.add(obj);		
		out.clear();
		out.print(arr);
    
	} catch(Exception e){		
		out.println("-1");
		out.println(e.getMessage());
		e.printStackTrace();
	
	}finally{
		if(rs != null) try{ rs.close(); }catch(SQLException sqle){};
		if(stmt != null) try{ stmt.close(); }catch(SQLException sqle){};
		if(conn != null) try{ conn.close(); }catch(SQLException sqle){};
	};
%>
