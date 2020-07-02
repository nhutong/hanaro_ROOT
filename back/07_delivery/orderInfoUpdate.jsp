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
	String requiredRoles = "ROLE1,ROLE2,ROLE3";
%><%@ include file = "../01_sign/auth.jsp" %><%-- 권한체크 --%><%
	
	int userCompanyNo = (Integer)session.getAttribute("userCompanyNo");
	Integer userNo = (Integer)session.getAttribute("userNo");

	String rs_no = request.getParameter("rs_no") == null ? "" : request.getParameter("rs_no");
	String company_no = request.getParameter("company_no") == null ? "" : request.getParameter("company_no");
	String customer_request = request.getParameter("customer_request") == null ? "" : request.getParameter("customer_request");
	String comment = request.getParameter("comment") == null ? "0" : request.getParameter("comment");
	String rs_status_cd = request.getParameter("rs_status_cd") == null ? "" : request.getParameter("rs_status_cd");
	String delivery_manager = request.getParameter("delivery_manager") == null ? "" : request.getParameter("delivery_manager");
	String cash_receipt_flag = request.getParameter("cash_receipt_flag") == null ? "" : request.getParameter("cash_receipt_flag");
	
 
 	try {
			QueryRunner queryRunner = new QueryRunner();
		
		String query =  " UPDATE vm_reserve  " + 
						" SET rs_status_cd= ? , delivery_manager= ?, lst_no= ?, lst_date= now(), customer_request= ? , comment= ?, cash_receipt_flag= ? "+
						" WHERE rs_no = ? " ;
					
		int result = queryRunner.update(
				conn,
				query,
				rs_status_cd,
				delivery_manager,
				userNo,		
				customer_request, 
				comment,
				cash_receipt_flag,
				rs_no
			);
		
		results.put("update", result);

	} catch(Exception se) {
		results.put("error", se.getMessage());

	} finally {
		DbUtils.closeQuietly(conn);

	}

	out.print(gson.toJson(results));
%>
