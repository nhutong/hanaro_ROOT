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
	String requiredRoles = "ROLE1,ROLE2,ROLE3";
%><%@ include file = "../01_sign/auth.jsp" %><%-- 권한체크 --%><%

	Integer userNo = (Integer)session.getAttribute("userNo");			

  // 파라미터	
	String company_no = request.getParameter("company_no") == null ? "" : request.getParameter("company_no").trim();
	String dong_list = request.getParameter("dong_list") == null ? "" : request.getParameter("dong_list").trim();
	String min_amount = request.getParameter("min_amount") == null ? "" : request.getParameter("min_amount").trim();
	String undeliverable_weekend_flag = request.getParameter("undeliverable_weekend_flag") == null ? "N" : request.getParameter("undeliverable_weekend_flag").trim();
	String undeliverable_holiday_flag = request.getParameter("undeliverable_holiday_flag") == null ? "N" : request.getParameter("undeliverable_holiday_flag").trim();	
	String undeliverable_day = request.getParameter("undeliverable_day") ==  null ? "N" : request.getParameter("undeliverable_day").trim();
	String undeliverable_period_flag = request.getParameter("undeliverable_period_flag") ==  null ? "N" : request.getParameter("undeliverable_period_flag").trim();
	String undeliverable_date_start = request.getParameter("undeliverable_date_start") == null ? "" : request.getParameter("undeliverable_date_start").trim();
	String undeliverable_date_end = request.getParameter("undeliverable_date_end") == null ? "" : request.getParameter("undeliverable_date_end").trim();
	
	if("".equals(company_no)){
		results.put("error", "지점번호가 없습니다.");
		out.print(gson.toJson(results));
		return;
	}

	if("Y".equals(undeliverable_period_flag)){
		if("".equals(undeliverable_date_start)){
			results.put("error", "배달 불가 시작일자가 없습니다.");
			out.print(gson.toJson(results));
			return;
		}

		if("".equals(undeliverable_date_end)){
			results.put("error", "배달 불가 종료일자가 없습니다.");
			out.print(gson.toJson(results));
			return;
		}
		
	}else{
		undeliverable_date_start = null;
		undeliverable_date_end = null;
	}
	

 	try {
		QueryRunner queryRunner = new QueryRunner();
		
		String query =  " INSERT INTO vm_delivery_master " + 
						" 		(company_no, dong_list, min_amount, undeliverable_weekend_flag, undeliverable_holiday_flag, undeliverable_day, undeliverable_date_start, undeliverable_date_end, reg_no, reg_date, lst_no, lst_date) "+ 
						" VALUES(?, 		 ?, 		?, 			?, 							?, 							?, 					?, 							?,						?, 	now(), ?, now()) " +
						" ON DUPLICATE KEY UPDATE " +
						" dong_list= ? , min_amount= ? , undeliverable_weekend_flag= ?, undeliverable_holiday_flag= ?, undeliverable_day= ?, undeliverable_date_start= ?, undeliverable_date_end= ?, lst_no=?, lst_date=now() " ;
			


					
		int result = queryRunner.update(
				conn,
				query,
				company_no,
				dong_list,
				min_amount,				
				undeliverable_weekend_flag,				
				undeliverable_holiday_flag,
				undeliverable_day,
				undeliverable_date_start, 
				undeliverable_date_end, 
				userNo, 				
				userNo, 				
				dong_list,
				min_amount,
				undeliverable_weekend_flag, 
				undeliverable_holiday_flag, 
				undeliverable_day, 
				undeliverable_date_start, 
				undeliverable_date_end, 				
				userNo			
			);
		
		results.put("update", result);

	} catch(Exception se) {
		results.put("error", se.getMessage());

	} finally {
		DbUtils.closeQuietly(conn);

	}

	out.print(gson.toJson(results));
%>
