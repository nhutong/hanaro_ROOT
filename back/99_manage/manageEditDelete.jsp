<%@ page contentType = "application/json;charset=utf-8" %>
<%@ page trimDirectiveWhitespaces="true" %>
<%@ page import="java.util.*" %>
<%@ page import="org.apache.commons.dbutils.DbUtils" %>
<%@ page import="org.apache.commons.dbutils.QueryRunner" %>
<%@ page import="org.apache.commons.dbutils.handlers.MapHandler" %>
<%@ page import="com.google.gson.Gson" %>
<%@ page import="com.google.gson.GsonBuilder" %>

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

  // 파라미터
	String no = request.getParameter("no") == null ? "" : request.getParameter("no").trim();
  String empNo = request.getParameter("empNo") == null ? "" : request.getParameter("empNo").trim();

 	try {
		QueryRunner queryRunner = new QueryRunner();

		// 특정 관리자 조회 (delete전)
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

		// 특정 관리자 삭제 (delete)
		results.put("delete", 
			queryRunner.update(
				conn,
				" DELETE FROM vm_user WHERE VM_NO = ? ",
				no
			)
		);

	} catch(Exception se) {
		results.put("error", se.getMessage());

	} finally {
		DbUtils.closeQuietly(conn);

	}

	out.print(gson.toJson(results));
%>