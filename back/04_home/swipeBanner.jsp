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

	// 본사관리자(ROLE1), 판매장관리자(ROLE2), 배송담당자(ROLE3)만 접근가능
	String requiredRoles = "ROLE1,ROLE2";
	Map<String, Object> results = new HashMap<>();

%><%@ include file = "../01_sign/auth.jsp" %><%-- 권한체크 --%><%
		
	String companyNo = request.getParameter("companyNo") == null ? "" : request.getParameter("companyNo");		
  
  	

 	try {
		
		QueryRunner queryRunner = new QueryRunner();

		// 리스트 조회 
		String query = " SELECT event_no, event_title, img_url, detail_img_url, company, banner_yn FROM vm_event t " +
					   " WHERE activated = 'Y' AND company = " + companyNo ;

		results.put("list", 
			queryRunner.query(
				conn,
				query,
				new MapListHandler()
			)
		);

		String bannerQuery = " SELECT event_no, event_title, img_url, detail_img_url, company, banner_yn, order_no FROM vm_event t " +
					   " WHERE banner_yn = 'Y' AND activated = 'Y' AND company = " + companyNo ;
		
		results.put("bannerList", 
			queryRunner.query(
				conn,
				bannerQuery,
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
