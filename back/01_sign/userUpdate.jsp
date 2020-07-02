<%@ page contentType = "text/html;charset=utf-8" %>
<%@ page import="java.sql.*" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="java.util.*" %>
<%@ page import="org.json.simple.*" %>
<%@ include file = "../00_include/dbPoolingConn.jsp" %>


<%	
	String name = request.getParameter("user_name")==null? "":request.getParameter("user_name"); // 이름
	String empNo = request.getParameter("user_numb")==null? "":request.getParameter("user_numb"); // 사번
	String email = request.getParameter("user_email")==null? "":request.getParameter("user_email"); // 이메일
	String cellPhone = request.getParameter("user_hp")==null? "":request.getParameter("user_hp"); // 전화번호	
	String pw = request.getParameter("user_pw")==null? "":request.getParameter("user_pw"); // 비밀번호	
	
	//유효성검사 (디버깅)
	if(name.equals("") || empNo.equals("") || email.equals("") || cellPhone.equals("") || pw.equals(""))
	{

		out.println(name);
		out.println(empNo);
		out.println(email);		
		out.println(cellPhone);
		out.println(pw);
		out.print("empty");
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
		
		sql = " update vm_user set "
		    + " VM_NAME = '"+name+"', "
			+ " VM_EMAIL = '"+email+"', "
			+ " VM_CELLPHONE = '"+cellPhone+"', "
			+ " VM_PW = '"+shaPw+"', "
			+ " VM_LAST_DATE = now() "
			+ " where VM_EMP_NO = '"+empNo+"'; ";

		pstmt = conn.prepareStatement(sql);
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
