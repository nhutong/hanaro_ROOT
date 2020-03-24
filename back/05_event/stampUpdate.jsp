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

<%@ include file = "../00_include/dbConn.jsp" %>

<%	
	// https://stackoverflow.com/a/27669890
	// Apache Commons DbUtils : https://commons.apache.org/proper/commons-dbutils/
	// Gson : https://github.com/google/gson
	Gson gson = new GsonBuilder().serializeNulls().create();

	Map<String, Object> results = new HashMap<>();

	// 본사관리자(ROLE1), 판매장관리자(ROLE2) 만 접근가능
	String requiredRoles = "ROLE1,ROLE2";
%><%@ include file = "auth.jsp" %><%-- 권한체크 --%><%

	Integer userNo = (Integer)session.getAttribute("userNo");			

  // 파라미터	  	
  	String stamp_no = request.getParameter("stamp_no") == null ? "" : request.getParameter("stamp_no").trim();	
	String coupon_code = request.getParameter("coupon_code") == null ? "" : request.getParameter("coupon_code").trim();	
	String min_price = request.getParameter("min_price") == null ? "" : request.getParameter("min_price").trim();	
	String start_date = request.getParameter("start_date") ==  null ? "2019-01-01" : request.getParameter("start_date").trim();
	String end_date = request.getParameter("end_date") == null ? "2025-12-31" : request.getParameter("end_date").trim();
	//String company_no = request.getParameter("company_no") == null ? "" : request.getParameter("company_no").trim();
	String status = request.getParameter("status") == null ? "T" : request.getParameter("status").trim();
	
 	try {
		QueryRunner queryRunner = new QueryRunner();

		String query = "  UPDATE vm_stamp " + 
					  "  SET start_date = ?, end_date = ? , min_price = ? , coupon_code = ?, lst_no = ?, lst_date = now(), status = ? " + 
					 " WHERE stamp_no = ? " ;
				
		int result = queryRunner.update(
						conn,
						query,
						start_date,
						end_date,
						min_price,						
						coupon_code,						
						userNo,
						status,
						stamp_no
					);
	 	
		results.put("update", result);		

	} catch(Exception se) {
		results.put("error", se.getMessage());

	} finally {
		DbUtils.closeQuietly(conn);
	}

	out.print(gson.toJson(results));
%>
