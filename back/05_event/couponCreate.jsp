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

	Integer userNo = (Integer)session.getAttribute("userNo");			

  // 파라미터	  	
	String coupon_name = request.getParameter("coupon_name") == null ? "" : request.getParameter("coupon_name").trim();
	String limit_qty = request.getParameter("limit_qty") == null ? "0" : request.getParameter("limit_qty").trim();	
	String start_date = request.getParameter("start_date") ==  null ? "2019-01-01" : request.getParameter("start_date").trim();
	String end_date = request.getParameter("end_date") == null ? "2025-12-31" : request.getParameter("end_date").trim();
	String coupon_type = request.getParameter("coupon_type") == null ? "" : request.getParameter("coupon_type").trim();
	String product_code = request.getParameter("product_code") == null ? "" : request.getParameter("product_code").trim();
	String product_name = request.getParameter("product_name") == null ? "" : request.getParameter("product_name").trim();
	String coupon_code = request.getParameter("coupon_code") == null ? "" : request.getParameter("coupon_code").trim();
	String discount_price = request.getParameter("discount_price") == null ? "" : request.getParameter("discount_price").trim();
	String min_price = request.getParameter("min_price") == null ? "0" : request.getParameter("min_price").trim();
	String extra = request.getParameter("extra") == null ? "" : request.getParameter("extra").trim();
	String company_list = request.getParameter("company_list") == null ? "" : request.getParameter("company_list").trim();
	String status_cd = request.getParameter("status_cd") == null ? "NOAPPLY" : request.getParameter("status_cd").trim();
	String coupon_detail = request.getParameter("coupon_detail") == null ? "N" : request.getParameter("coupon_detail").trim();
	

 	try {
		QueryRunner queryRunner = new QueryRunner();
	
		String[] arr = company_list.split(",") ;
		int result = 0;
    
		for(String companyNo : arr){
		
		
		// 관리자 등록 (insert)
		String query = "  INSERT INTO hanaro.vm_coupon " + 
					  " (coupon_name, coupon_type, coupon_code, reg_no, reg_date, lst_no, lst_date, start_date, end_date, product_code, product_name, discount_price, min_price, limit_qty, extra, company_no, status_cd, coupon_detail) " + 
					 " VALUES(?, ?, ?, ?, now(), ?, now(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) " ;
				
		result += queryRunner.update(
						conn,
						query,
						coupon_name,
						coupon_type,
						coupon_code,
						userNo,
						userNo,
						start_date,
						end_date,
						product_code, 
						 product_name, 
						discount_price, 
						min_price, 
						limit_qty, 
						extra,
						companyNo,
						status_cd,
			            coupon_detail
					);
		}

		results.put("insert", result);

	} catch(Exception se) {
		results.put("error", se.getMessage());

	} finally {
		DbUtils.closeQuietly(conn);

	}

	out.print(gson.toJson(results));
%>
