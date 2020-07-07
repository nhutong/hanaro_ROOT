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
	
	String userRoleCd = (String)session.getAttribute("userRoleCd");
	int userCompanyNo = (Integer)session.getAttribute("userCompanyNo");

	Map<String, Object> results = new HashMap<>();
	
 	try {
		QueryRunner queryRunner = new QueryRunner();
		String query = "SELECT  VM_CP_NO, VM_CP_NAME FROM vm_company" +
						("ROLE1".equals(userRoleCd) ? "" : " WHERE VM_CP_NO = " + userCompanyNo );

		// 지점 리스트 조회
		results.put("list", 
			queryRunner.query(
				conn,
				query,
				new MapListHandler()
			)
		);

		


		String dateQuery =  "SELECT DATE_FORMAT(now()-1, '%Y-%m-%d') AS TODAY,     "+
							"DATE_FORMAT(SUBDATE(now(),1), '%Y-%m-%d') AS TODAY_1, "+
							"DATE_FORMAT(SUBDATE(now(),2), '%Y-%m-%d') AS TODAY_2, "+
							"DATE_FORMAT(SUBDATE(now(),3), '%Y-%m-%d') AS TODAY_3, "+
							"DATE_FORMAT(SUBDATE(now(),4), '%Y-%m-%d') AS TODAY_4, "+
							"DATE_FORMAT(SUBDATE(now(),5), '%Y-%m-%d') AS TODAY_5, "+
							"DATE_FORMAT(SUBDATE(now(),6), '%Y-%m-%d') AS TODAY_6, "+
							"DATE_FORMAT(SUBDATE(now(),7), '%Y-%m-%d') AS TODAY_7  " ; 

		// 지점 리스트 조회
		results.put("date_list", 
			queryRunner.query(
				conn,
				dateQuery,
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
