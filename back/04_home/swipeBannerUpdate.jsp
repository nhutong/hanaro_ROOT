<%@ page contentType = "application/json;charset=utf-8" %>
<%@ page trimDirectiveWhitespaces="true" %>
<%@ page import="java.util.*" %>
<%@ page import="org.apache.commons.dbutils.DbUtils" %>
<%@ page import="org.apache.commons.dbutils.QueryRunner" %>
<%@ page import="org.apache.commons.dbutils.handlers.MapListHandler" %>
<%@ page import="org.apache.commons.dbutils.handlers.ScalarHandler" %>
<%@ page import="com.google.gson.Gson" %>
<%@ page import="com.google.gson.GsonBuilder" %>

<%@ include file = "../00_include/dbPoolingConn.jsp" %>

<%
	// https://stackoverflow.com/a/27669890
	// Apache Commons DbUtils : https://commons.apache.org/proper/commons-dbutils/
	// Gson : https://github.com/google/gson
	
	Gson gson = new GsonBuilder().serializeNulls().create();
	Map<String, Object> results = new HashMap<>();
	// 본사관리자(ROLE1), 판매장관리자(ROLE2), 배송담당자(ROLE3)만 접근가능
	String requiredRoles = "ROLE1,ROLE2";
%><%@ include file = "../01_sign/auth.jsp" %><%-- 권한체크 --%><%
		
	String companyNo = request.getParameter("companyNo") == null ? "-1" : request.getParameter("companyNo");
	String eventList = request.getParameter("eventList") == null ? "-1" : request.getParameter("eventList");
  
  	

 	try {
		
		QueryRunner queryRunner = new QueryRunner();

		// 반영 초기화
		String updateQuery = " UPDATE vm_event t set banner_yn = 'N', order_no = 0 WHERE banner_yn = 'Y' AND company = " + companyNo ;
		int result = queryRunner.update(
						conn,
						updateQuery
					 );

		//반영 요청건 반영
		String[] arr = eventList.split(",") ;
		int resultSum = 0;

		int idx = 0;
		for(String event_no : arr){
			idx ++ ;
			if("".equals(event_no)) continue;

			String query = " UPDATE vm_event t set banner_yn = 'Y' , order_no =  " + idx +
						   " WHERE activated = 'Y' " + " AND event_no =  " + event_no + " AND company = " + companyNo ;
			
			resultSum += queryRunner.update(
						conn,
						query
					);
		}

		results.put("update", resultSum);

	} catch(Exception se) {
		results.put("error", se.getMessage());

	} finally {
		DbUtils.closeQuietly(conn);

	}

	out.print(gson.toJson(results));
%>
