<%@ page contentType = "application/json;charset=utf-8" %>
<%@ page trimDirectiveWhitespaces="true" %>
<%@ page import="java.util.*" %>
<%@ page import="org.apache.commons.dbutils.DbUtils" %>
<%@ page import="org.apache.commons.dbutils.QueryRunner" %>
<%@ page import="org.apache.commons.dbutils.handlers.MapHandler" %>
<%@ page import="org.apache.commons.dbutils.handlers.MapListHandler" %>
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
 
 	try {
		QueryRunner queryRunner = new QueryRunner();

		// 특정 관리자 조회
		results.put("data", 
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
			)
		);

		// 판매장 리스트 조회
		results.put("companyList", 
			queryRunner.query(
				conn,
				" SELECT c.VM_CP_NO AS no, c.VM_CP_NAME AS name " + 

				" FROM vm_company AS c " + 

				" ORDER BY c.VM_CP_NO ASC ",
				new MapListHandler()
			)
		);

		// 역할 리스트 조회
		results.put("roleList", 
			queryRunner.query(
				conn,
				" SELECT r.CODE AS code, r.CODE_NAME AS name " + 

				" FROM vm_code AS r " +

				" WHERE r.CODE_GROUP = 'ROLE' " + 

				" ORDER BY r.NO ASC ",
				new MapListHandler()
			)
		);

		// 상태 리스트 조회
		results.put("userStatusList", 
			queryRunner.query(
				conn,
				" SELECT s.CODE AS code, s.CODE_NAME AS name " + 

				" FROM vm_code AS s " +

				" WHERE s.CODE_GROUP = 'USER_STATUS' " + 

				" ORDER BY s.NO ASC ",
				new MapListHandler()
			)
		);

	} catch(Exception se) {
		results.put("error", se.getMessage());

	} finally {
		DbUtils.closeQuietly(conn);

	}

	out.print(gson.toJson(results));
%>