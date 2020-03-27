<%@ page contentType = "text/html;charset=utf-8" %>
<%@ page import="java.sql.*" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="java.util.*" %>
<%@ page import="org.json.simple.*" %>
<%@ include file = "../00_include/dbConn_before.jsp" %>


<%	
	System.out.println("Sign Up >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
	String name = request.getParameter("user_name")==null? "":request.getParameter("user_name"); // 이름
	String empNo = request.getParameter("user_numb")==null? "":request.getParameter("user_numb"); // 사번
	String email = request.getParameter("user_email")==null? "":request.getParameter("user_email"); // 이메일
	String cellPhone = request.getParameter("user_hp")==null? "":request.getParameter("user_hp"); // 전화번호	
	String pw = request.getParameter("user_pw")==null? "":request.getParameter("user_pw"); // 비밀번호	
	String company = request.getParameter("user_company")==null? "1":request.getParameter("user_company"); // 연관 회사 번호
	String role = request.getParameter("user_role")==null? "1":request.getParameter("user_role"); // 직급
	
	//유효성검사 (디버깅)
	if(name.equals("") || empNo.equals("") || email.equals("") || cellPhone.equals("") || pw.equals("") || company.equals("") || role.equals(""))
	{

		out.println(name);
		out.println(empNo);
		out.println(email);		
		out.println(cellPhone);
		out.println(pw);
		out.println(company);
		out.println(role);
		out.print("empty");
		return;
	}

	//중복 체크
	sql = "select vm_no from vm_user where vm_emp_no = '"+empNo+"'";

	stmt = conn.createStatement();
	rs = stmt.executeQuery(sql);
	rs.last(); 
	int listCount = rs.getRow(); // 현재 커서의 row Index값을 저장 
	if(listCount > 0){
		out.clear();
		out.print("empno");
		return;
	}

	//중복 체크
	sql = "select vm_no from vm_user where vm_email = '"+email+"'";

	stmt = conn.createStatement();
	rs = stmt.executeQuery(sql);
	rs.last(); 
	listCount = rs.getRow(); // 현재 커서의 row Index값을 저장 
	if(listCount > 0){
		out.clear();
		out.print("email");
		return;
	}

	//패스워드 암호화 //
	sql = "SELECT `EBGA_CREATE_PW_SHA`('"+pw+"')as shaPw";

	stmt = conn.createStatement();
	rs = stmt.executeQuery(sql);
	rs.next(); // 하나의 데이터라도 next 함수 이용
	String shaPw = rs.getString("shaPw");

	try
	{	
		
		sql = "insert into vm_user (VM_NAME, VM_EMAIL, VM_CELLPHONE, VM_PW, VM_REF_COMPANY_NO, VM_ROLE_CD, VM_EMP_NO, VM_USER_STATUS_CD, VM_LAST_DATE, VM_REG_DATE)"+
		      "values"+
			  "(?, ?, ?, ?, ?, ?, ?, 'REQUESTED', now(), now())";

		pstmt = conn.prepareStatement(sql);
		
		pstmt.setString(1, name);
		pstmt.setString(2, email);
		pstmt.setString(3, cellPhone);
		pstmt.setString(4, shaPw);		
		pstmt.setString(5, company);
		pstmt.setString(6, role);
		pstmt.setString(7, empNo);
			
		
		pstmt.executeUpdate();
		
		out.print("SUCCESS");
	}	
	catch(Exception e)
	{		
		out.println("ERROR");		
		out.println(sql);
		out.println(e.getMessage());
		
		return;
	}
	finally
	{	
		
	 	if(pstmt != null) try { pstmt.close(); } catch(SQLException sqle) {}
   		if(conn != null) try { conn.close(); } catch(SQLException sqle) {}
	}

%>
