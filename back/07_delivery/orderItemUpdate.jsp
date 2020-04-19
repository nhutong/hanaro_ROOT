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

	String item_no = request.getParameter("item_no") == null ? "" : request.getParameter("item_no");
	String item_amount = request.getParameter("item_amount") == null ? "" : request.getParameter("item_amount");
	String item_qty = request.getParameter("item_qty") == null ? "" : request.getParameter("item_qty");	
 
 	try {
			QueryRunner queryRunner = new QueryRunner();
		
		String query =  " UPDATE hanaro.vm_reserve_item " +
						" SET item_amount = ? , item_qty = ? " +
						"WHERE item_no = "  + item_no ;						
					
		int result = queryRunner.update(
				conn,
				query,
				item_amount,
				item_qty
			);
		
		results.put("update", result);

	} catch(Exception se) {
		results.put("error", se.getMessage());

	} finally {
		DbUtils.closeQuietly(conn);

	}

	out.print(gson.toJson(results));
%>
