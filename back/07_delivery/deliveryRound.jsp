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
  // 페이징 	
	String company_no = request.getParameter("company_no") == null ? "" : request.getParameter("company_no");

	try {
		QueryRunner queryRunner = new QueryRunner();

		// 리스트 조회 
		String queryList =
			" SELECT round_id, company_no, delivery_start_time, delivery_end_time, order_closing_cnt, open_flag, reg_no, reg_date, lst_no, lst_date, " + 
			" (SELECT count(r.rs_no) FROM vm_reserve r WHERE r.company_no = d.company_no AND r.delivery_round_id = d.round_id) as order_cnt " + 
			" FROM vm_delivery_round d WHERE company_no = " + company_no + " ORDER BY delivery_start_time ";

		results.put("list", 
			queryRunner.query(
				conn,
				queryList,
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
