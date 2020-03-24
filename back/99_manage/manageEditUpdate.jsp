<%@ page contentType = "application/json;charset=utf-8" %>
<%@ page trimDirectiveWhitespaces="true" %>
<%@ page import="java.util.*" %>
<%@ page import="org.apache.commons.dbutils.DbUtils" %>
<%@ page import="org.apache.commons.dbutils.QueryRunner" %>
<%@ page import="org.apache.commons.dbutils.handlers.MapHandler" %>
<%@ page import="org.apache.commons.dbutils.handlers.MapListHandler" %>
<%@ page import="com.google.gson.Gson" %>
<%@ page import="com.google.gson.GsonBuilder" %>
<%@ page import="javax.mail.*" %>
<%@ page import="javax.mail.internet.*" %>
<%@ page import="java.sql.*" %>

<%@ include file = "../00_include/dbConn.jsp" %>

<%	
	// https://stackoverflow.com/a/27669890
	// Apache Commons DbUtils : https://commons.apache.org/proper/commons-dbutils/
	// Gson : https://github.com/google/gson
	Gson gson = new GsonBuilder().serializeNulls().create();

	Map<String, Object> results = new HashMap<>();

	// 본사관리자(ROLE1)만 접근가능
	String requiredRoles = "ROLE1";
%><%@ include file = "auth.jsp" %><%-- 권한체크 --%><%

	Integer userNo = (Integer)session.getAttribute("userNo");

  // 파라미터
	String no = request.getParameter("no") == null ? "" : request.getParameter("no").trim();
	String empNo = request.getParameter("empNo") == null ? "" : request.getParameter("empNo").trim();
	String cellphone = request.getParameter("cellphone") == null ? "" : request.getParameter("cellphone").trim();
	String name = request.getParameter("name") == null ? "" : request.getParameter("name").trim();
	String email = request.getParameter("email") == null ? "" : request.getParameter("email").trim();
	String company = request.getParameter("company") == null ? "" : request.getParameter("company").trim();
	String role = request.getParameter("role") == null ? "" : request.getParameter("role").trim();
	String status = request.getParameter("status") == null ? "" : request.getParameter("status").trim();

 	try {

//		// 신규입력한 전단컨텐츠상품의 전단컨텐츠상품번호를 select 한다.
//		sql = " select vm_no as vm_no from vm_user where vm_emp_no = '"+empNo+"'; ";
//	
//		stmt = conn.createStatement();
//		rs = stmt.executeQuery(sql);
//		
//		rs.last();
//		int listCount = rs.getRow();
//		if(listCount > 0){
//			out.print(gson.toJson("NoN"));
//			return;
//		};
//		rs.beforeFirst();

		QueryRunner queryRunner = new QueryRunner();

		// 특정 관리자 조회 (update전)
		Map<String, Object> previous =  
			queryRunner.query(
				conn,
				" SELECT u.VM_NO AS no, u.VM_EMP_NO AS empNo, u.VM_CELLPHONE AS cellphone,  " + 
				" u.VM_REF_COMPANY_NO AS companyNo, " + 
				" u.VM_NAME AS name, " + 
				" u.VM_EMAIL AS email, " + 
				" u.VM_ROLE_CD AS roleCd, " + 
				" u.VM_USER_STATUS_CD as statusCd, " + 
				" DATE_FORMAT(u.VM_LAST_DATE, '%Y-%m-%d') AS lastDate, " + 
				" DATE_FORMAT(u.VM_REG_DATE, '%Y-%m-%d') AS regDate " + 

				" FROM vm_user AS u " + 

				" WHERE u.VM_NO = ?",
				new MapHandler(),
				no
			);

		// 특정 관리자 수정 (update)
		results.put("update", 
			queryRunner.update(
				conn,
				" UPDATE vm_user SET " +
				" VM_EMP_NO = ?, VM_CELLPHONE = ?, " + 
				" VM_REF_COMPANY_NO = ?, " + 
				" VM_NAME = ?, " + 
			    " VM_EMAIL = ?, " + 
				" VM_ROLE_CD = ?, " + 
				" VM_USER_STATUS_CD = ?, " + 
				" VM_LAST_NO = ?, VM_LAST_DATE = SYSDATE() " +

				" WHERE VM_NO = ?",
				empNo,
				cellphone,
				company,
				name,
				email,
				role,
				status,
				userNo,
				no
			)
		);

		// 상태가 승인요청(REQUESTED) -> 승인완료(APPROVED) 변경된 경우, 승인완료 메일 발송
		if("REQUESTED".equals((String)previous.get("statusCd")) && "APPROVED".equals(status)) {
			String emailContent = 
				"<!DOCTYPE html>" +
				"<html>" +
				"    <head>" +
				"        <meta charset=\"utf-8\">" +
				"    </head>" +
				"    <body style=\"width:720px;\">" +
        "				<div style=\"width:92.5vmin; font-size:10vmin;\">" +
        "				<div style=\"position:relative; text-align:right; border-bottom:2px solid #1fad4d; line-height:0; padding-top:14.1891%; padding-bottom:2.027%;\"><img src=\"http://www.it7.kr:8080/images/logo.png\" alt=\"(주)농협유통\" style=\"float:left; width:34.7972%\" />" +
				"				<span style=\"padding-bottom:4.91%; display:inline-block; font-size:0.234375em; color:#999999; font-weight:500; max-height:10000px;\"><img src=\"\" alt=\"\"></span>" +
				"				</div>" +
        "				<div style=\"text-align:center;\">" +
        "		       <h1 style=\"font-family:'Noto Sans KR', sans-serif; letter-spacing: -1px;  font-size:0.46875em; color:#121212; border-bottom:1px solid #eeeeee; margin-top:8.1081%; margin-bottom:7.0945%; padding-bottom:1.502%;\">회원가입 승인 완료</h1>" +
        "				   <article style=\"padding:4.8986% 4.1666%; margin-bottom:6.5878%;\">" +
        "				     <h2 style=\"font-family:'Noto Sans KR', sans-serif; font-size:0.4375em; letter-spacing:-0.025em; font-weight:500; color:#222222; margin:0 0 1.6891% 0; font-weight: 500;\">" + name +  "(" +  empNo + ")님</h2>" +
        "				     <p style=\"font-family:'Noto Sans KR', sans-serif; margin:3.3783% 0 0 0; font-size:0.375em; color:#666666; letter-spacing:-0.025em; line-height:1.4583em;\">회원가입 승인이 완료되었습니다.<br> <a href=\"http://hanaro.it7.kr\" style=\"text-decoration: none; color:#666666;\">https://www.nhhanaromart.com</a></p>" +
        "				   </article>" +
        "				   <p style=\"font-size:0.34375em; font-weight:300; margin:0;\">" +
        "				     <span style=\"font-family:'Noto Sans KR', sans-serif; color:#121212; line-height:1.3636em; letter-spacing:-0.025em;\">문의 사항은 아래의 메일 주소로 보내주세요.</span><br/>" +
        "				     <span style=\"font-family:'Noto Sans KR', sans-serif; color:#5ba1d0; line-height:1.3636em;\">E-mail: kacmapp1995@gmail.com</span><br/>" +
        "				     <span style=\"font-family:'Noto Sans KR', sans-serif; display:inline-block; margin-top:3.2094%; color:#121212; font-weight:500; letter-spacing:-0.025em;\">감사합니다.</span>" +
        "				   </p>" +
        "				</div>" +
        "				<div style=\"text-align:center; font-size:0.25em; background-color:#f6f6f6; padding:2.8716% 0; margin-top:7.45%; color:#7b7b7b;\"><span>(주)농협유통 Co. ltd. All right reserved</span></div>" +
        "				</div>" +
				"    </body>" +
				"</html>";

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


			final String senderName = "kacmapp1995@gmail.com";
			final String senderPassword = "kacm!995050!";
			Session sess = Session.getInstance(props, new javax.mail.Authenticator() { 
				protected PasswordAuthentication getPasswordAuthentication() { 
					return new PasswordAuthentication(senderName, senderPassword); 
				}
			});

			Message message = new MimeMessage(sess); 
			message.setContent("Mail Content", "text/plain");
			message.setFrom(new InternetAddress(senderName));
			message.setRecipient(Message.RecipientType.TO, new InternetAddress((String)previous.get("email"))); 
			message.setSubject(MimeUtility.encodeText("㈜농협유통 회원가입 승인이 완료되었습니다.", "UTF-8", "B"));
			message.setContent(emailContent, "text/html; charset=UTF-8");

			Transport.send(message); 
		}

	} catch(Exception se) {
		results.put("error", se.getMessage());

	} finally {
		DbUtils.closeQuietly(conn);

	}

	out.print(gson.toJson(results));
%>