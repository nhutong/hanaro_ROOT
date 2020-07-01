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
%><%@ include file = "../01_sign/auth.jsp" %><%-- 권한체크 --%><%

	//Integer userNo = (Integer)session.getAttribute("userNo");
	Integer lst_no = (Integer)session.getAttribute("userNo");

  // 파라미터	  	
    String coupon_no = request.getParameter("coupon_no") == null ? "" : request.getParameter("coupon_no").trim();
	String product_code = request.getParameter("product_code") == null ? "" : request.getParameter("product_code").trim();
	String product_name = request.getParameter("product_name") == null ? "" : request.getParameter("product_name").trim();	
	String min_price = request.getParameter("min_price") == null ? "" : request.getParameter("min_price").trim();
	String weight = request.getParameter("weight") == null ? "" : request.getParameter("weight").trim();
	String unit_price = request.getParameter("unit_price") == null ? "" : request.getParameter("unit_price").trim();
	String origin = request.getParameter("origin") == null ? "" : request.getParameter("origin").trim();
	String discount_price = request.getParameter("discount_price") == null ? "" : request.getParameter("discount_price").trim();
	String start_date = request.getParameter("start_date") ==  null ? "" : request.getParameter("start_date").trim();
	String end_date = request.getParameter("end_date") == null ? "" : request.getParameter("end_date").trim();
	String limit_qty = request.getParameter("limit_qty") == null ? "" : request.getParameter("limit_qty").trim();	
	String etc_info = request.getParameter("etc_info") == null ? "" : request.getParameter("etc_info").trim();
	String status_cd = request.getParameter("status_cd") == null ? "NOAPPLY" : request.getParameter("status_cd").trim();		
	//String lst_no = request.getParameter("lst_no") == null ? "" : request.getParameter("lst_no").trim();

 	try {
		QueryRunner queryRunner = new QueryRunner();
	
		// 관리자 등록 (insert)
		String query = " UPDATE hanaro.vm_coupon " + 
					   " SET product_code = ?, product_name = ?, min_price = ?, weight = ?, unit_price = ?, origin = ?, " +
					   " discount_price = ?, start_date = ?, end_date = ?, limit_qty = ?, etc_info = ?, lst_no = ?, lst_date = now(), status_cd = ? " +
					   " WHERE coupon_no= ? ;" ;
				
		int result = queryRunner.update(
						conn,
						query,
						product_code,
						product_name,
						min_price,
						weight,
						unit_price,
						origin,
						discount_price,
						start_date + " 00:00:00",
						end_date + " 00:00:00",
						limit_qty,
						etc_info,
						lst_no,
						status_cd,
						coupon_no
					);

		results.put("update", result);

	} catch(Exception se) {
		results.put("error", se.getMessage());

	} finally {
		DbUtils.closeQuietly(conn);

	}

	out.print(gson.toJson(results));
%>
