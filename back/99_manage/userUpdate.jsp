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

	// 본사관리자(ROLE1)와 판매장관리자(ROLE2)만 접근가능
	String requiredRoles = "ROLE1,ROLE2";
%><%@ include file = "auth.jsp" %><%-- 권한체크 --%><%

  // 파라미터 초기화
	String memberNo = "-1";
	String memo = "";
	
	try {
		memberNo = request.getParameter("memberNo") == null ? "-1" : request.getParameter("memberNo").trim();
		memo = request.getParameter("memo") == null ? "" : request.getParameter("memo").trim();

	} catch(Exception e) {
	}
	
 	try {
		QueryRunner queryRunner = new QueryRunner();

		// 리스트 조회
		String queryUpdate = " UPDATE vm_member SET memo = ? WHERE no = ? " ;		
		int updateCnt = queryRunner.update( conn, queryUpdate,memo,memberNo);
		results.put("result", "success" );
		results.put("count", updateCnt );
		 

	} catch(Exception se) {
		results.put("error", se.getMessage());

	} finally {
		DbUtils.closeQuietly(conn);

	}

	out.print(gson.toJson(results));
%>
