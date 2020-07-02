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

<%@ include file = "../00_include/dbPoolingConn.jsp" %>

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
	String delviery_start_time = request.getParameter("delviery_start_time") == null ? "" : request.getParameter("delviery_start_time").trim();
	String delviery_end_time = request.getParameter("delviery_end_time") == null ? "" : request.getParameter("delviery_end_time").trim();
	String order_closing_cnt = request.getParameter("order_closing_cnt") == null ? "0" : request.getParameter("order_closing_cnt").trim();
	
	if("".equals(company_no)){
		results.put("error", "지점번호가 없습니다.");
		out.print(gson.toJson(results));
		return;
	}

 	try {
		QueryRunner queryRunner = new QueryRunner();
		
		String query =  " INSERT INTO hanaro.vm_delivery_round " +
						" (company_no, delivery_start_time,delivery_end_time, order_closing_cnt, reg_no, reg_date, lst_no, lst_date) " +
						" VALUES(?, ?, ?, ?, ?, now(), ?, now()) " ;

					
		int result = queryRunner.update(
				conn,
				query,
				company_no,
				delviery_start_time,
				delviery_end_time,
				order_closing_cnt,				
				userNo, 				
				userNo				
			);
		
		results.put("insert", result);

	} catch(Exception se) {
		results.put("error", se.getMessage());

	} finally {
		DbUtils.closeQuietly(conn);

	}

	out.print(gson.toJson(results));
%>
