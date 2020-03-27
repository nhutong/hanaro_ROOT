<%@ page contentType = "application/json;charset=utf-8" %>
<%@ page trimDirectiveWhitespaces="true" %>
<%@ page import="java.util.*" %>
<%@ page import="org.apache.commons.dbutils.DbUtils" %>
<%@ page import="org.apache.commons.dbutils.QueryRunner" %>
<%@ page import="org.apache.commons.dbutils.handlers.MapListHandler" %>
<%@ page import="org.apache.commons.dbutils.handlers.ScalarHandler" %>
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

  // 페이징 
	int pageSize = 8;
	int pageNumber = 1;
	
	try {
		pageNumber = Integer.parseInt(request.getParameter("pageNumber") == null ? "1" : request.getParameter("pageNumber").trim(), 10);
		pageSize = Integer.parseInt(request.getParameter("pageSize") == null ? "8" : request.getParameter("pageSize").trim(), 10);
	} catch(NumberFormatException nfe) {
	}

	int offset = pageSize * (pageNumber - 1);
	int rowCount = pageSize;
 
 	try {
		QueryRunner queryRunner = new QueryRunner();

		// 전체 건수 조회
		results.put("total", 
			queryRunner.query(
				conn,
				" SELECT COUNT(*) AS count"  +
				" FROM vm_user AS a ",
				new ScalarHandler<Integer>()
			)
		);

		// 리스트 조회
		results.put("list", 
			queryRunner.query(
				conn,
				" SELECT u.VM_NO AS no, u.VM_EMP_NO AS empNo, u.VM_CELLPHONE AS cellphone,  " + 
				" c.VM_CP_NAME AS company, u.VM_REF_COMPANY_NO AS companyNo, " + 
				" u.VM_NAME AS name, " + 
				" u.VM_EMAIL AS email, " + 
				" r.CODE_NAME AS role, u.VM_ROLE_CD AS roleCd, " + 
				" s.CODE_NAME AS status, u.VM_USER_STATUS_CD as statusCd, " + 
				" DATE_FORMAT(u.VM_LAST_DATE, '%Y-%m-%d') AS lastDate, " + 
				" DATE_FORMAT(u.VM_REG_DATE, '%Y-%m-%d') AS regDate " + 

				" FROM vm_user AS u " + 

				" JOIN vm_company AS c " + 
				" ON (c.VM_CP_NO = u.VM_REF_COMPANY_NO) " + 

				" JOIN vm_code AS r " + 
				" ON (r.CODE = u.VM_ROLE_CD) " + 

				" JOIN vm_code AS s " + 
				" ON (s.CODE = u.VM_USER_STATUS_CD) " +

				" ORDER BY u.VM_NO DESC " + 

				" LIMIT ?,?",
				new MapListHandler(),
				offset,
				rowCount
			)
		);

	} catch(Exception se) {
		results.put("error", se.getMessage());

	} finally {
		DbUtils.closeQuietly(conn);

	}

	out.print(gson.toJson(results));
%>