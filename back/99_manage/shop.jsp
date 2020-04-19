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

	// 본사관리자(ROLE1)와 판매장관리자(ROLE2)만 접근가능
	String requiredRoles = "ROLE1,ROLE2";
%><%@ include file = "../01_sign/auth.jsp" %><%-- 권한체크 --%><%

  // 페이징 
	int pageSize = 8;
	int pageNumber = 1;
	
	try {
		pageNumber = Integer.parseInt(request.getParameter("pageNumber") == null ? "1" : request.getParameter("pageNumber").trim(), 10);
		pageSize = Integer.parseInt(request.getParameter("pageSize") == null ? "8" : request.getParameter("pageSize").trim(), 10);
	} catch(NumberFormatException nfe) {
	}

	int offset = pageSize * (pageNumber - 1);
	int rowCount = pageSize;
 
 	try {
		QueryRunner queryRunner = new QueryRunner();

		// 판매장관리자(ROLE2)이면 해당 판매장만 조회되도록 조건 쿼리 및 파라미터 추가
		Integer userCompanyNo = (Integer)session.getAttribute("userCompanyNo");

		// 전체 건수 조회
		String queryTotal =
			" SELECT COUNT(*) AS count"  +
			" FROM vm_company AS c where vm_cp_no <> 0 " +
			("ROLE2".equals(userRoleCd) ? " and VM_CP_NO = ? " : "");

		Object[] paramTotal = "ROLE2".equals(userRoleCd) ? new Object[]{ userCompanyNo } : new Object[]{ };

		results.put("total", 
			queryRunner.query(
				conn,
				queryTotal,
				new ScalarHandler<Integer>(),
				paramTotal
			)
		);

		// 리스트 조회
		String queryList =
			" SELECT c.VM_CP_NO AS no, c.VM_CP_NAME AS name, " + 
			" c.VM_ADDRESS1 AS address1, c.VM_ADDRESS2 AS address2, " +
			" c.VM_TEL AS tel, " + 
			" c.VM_START_TIME AS startTime, c.VM_END_TIME AS endTime, c.VM_OFF_NOTE AS offNote, " +
			" c.VM_tsf_FG AS tsf, c.VM_delivery_FG AS delivery, c.VM_sales_FG AS sales, " + 
			" DATE_FORMAT(c.VM_LAST_DATE, '%Y-%m-%d') AS lastDate, " + 
			" DATE_FORMAT(c.VM_REG_DATE, '%Y-%m-%d') AS regDate " + 

			" FROM vm_company AS c where vm_cp_no <> 0 " +

			("ROLE2".equals(userRoleCd) ? " and VM_CP_NO = ? " : "") + 

			" ORDER BY c.VM_CP_NO DESC " + 

			" LIMIT ?,? ";

		Object[] paramList = "ROLE2".equals(userRoleCd) ? new Object[]{ userCompanyNo, offset, rowCount } : new Object[]{ offset, rowCount };

		results.put("list", 
			queryRunner.query(
				conn,
				queryList,
				new MapListHandler(),
				paramList
			)
		);

	} catch(Exception se) {
		results.put("error", se.getMessage());

	} finally {
		DbUtils.closeQuietly(conn);

	}

	out.print(gson.toJson(results));
%>