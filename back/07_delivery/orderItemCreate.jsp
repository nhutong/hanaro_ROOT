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

	// 본사관리자(ROLE1), 판매장관리자(ROLE2), 배송담당자(ROLE3)만 접근가능
	String requiredRoles = "ROLE1,ROLE2,ROLE3";
%><%@ include file = "../01_sign/auth.jsp" %><%-- 권한체크 --%><%
	
	int userCompanyNo = (Integer)session.getAttribute("userCompanyNo");
	Integer userNo = (Integer)session.getAttribute("userNo");

	String rs_no = request.getParameter("rs_no") == null ? "" : request.getParameter("rs_no");
	String item_pd_code = request.getParameter("item_pd_code") == null ? "" : request.getParameter("item_pd_code");
	String item_pd_name = request.getParameter("item_pd_name") == null ? "0" : request.getParameter("item_pd_name");
	String item_qty = request.getParameter("item_qty") == null ? "" : request.getParameter("item_qty");
	String item_price = request.getParameter("item_price") == null ? "" : request.getParameter("item_price");
	String item_amount = request.getParameter("item_amount") == null ? "" : request.getParameter("item_amount");
	
 
 	try {
			QueryRunner queryRunner = new QueryRunner();
		
		String query =  " INSERT INTO hanaro.vm_reserve_item " +
						"(rs_no, item_pd_code, item_pd_name, item_qty, item_price, item_amount, reg_no, reg_date, lst_no, lst_date) " +
						" VALUES(?, ?, ?, ?, ?, ?, ?, now(), ?, now()) " ;
					
		int result = queryRunner.update(
				conn,
				query,
				rs_no,
				item_pd_code,
				item_pd_name,		
				item_qty, 
				item_price,
				item_amount,
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
