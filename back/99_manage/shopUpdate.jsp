<%@ page contentType = "application/json;charset=utf-8" %>
<%@ page trimDirectiveWhitespaces="true" %>
<%@ page import="java.util.*" %>
<%@ page import="org.apache.commons.dbutils.DbUtils" %>
<%@ page import="org.apache.commons.dbutils.QueryRunner" %>
<%@ page import="org.apache.commons.dbutils.handlers.MapHandler" %>
<%@ page import="com.google.gson.Gson" %>
<%@ page import="com.google.gson.GsonBuilder" %>

<%@ include file = "../00_include/dbPoolingConn.jsp" %>

<%	
	// https://stackoverflow.com/a/27669890
	// Apache Commons DbUtils : https://commons.apache.org/proper/commons-dbutils/
	// Gson : https://github.com/google/gson
	Gson gson = new GsonBuilder().serializeNulls().create();

	Map<String, Object> results = new HashMap<>();

	// 본사관리자(ROLE1)와 판매장관리자(ROLE2)만 접근가능
	String requiredRoles = "ROLE1,ROLE2";
%><%@ include file = "../01_sign/auth.jsp" %><%-- 권한체크 --%><%

  // 파라미터
	String no = request.getParameter("no") == null ? "" : request.getParameter("no").trim();

	if("ROLE2".equals(userRoleCd)) {
		// 판매장관리자(ROLE2)이면 해당 판매장만 조회되도록 조건 쿼리 및 파라미터 추가
		Integer userCompanyNo = (Integer)session.getAttribute("userCompanyNo");

		if(no.equals(userCompanyNo.toString())) {
			// 접근가능
		} else {
			// 접근불가능
			results.put("error", "권한이 없습니다.");
			out.print(gson.toJson(results));

			// 응답 (HttpServletResponse) : https://docs.oracle.com/javaee/7/api/javax/servlet/http/HttpServletResponse.html
			response.setStatus(response.SC_FORBIDDEN); // 403		
			return;
		}
	}

 	try {
		QueryRunner queryRunner = new QueryRunner();

		// 특정 관리자 조회
		results.put("data", 
			queryRunner.query(
				conn,
				" SELECT c.VM_CP_NO AS no, c.VM_CP_NAME AS name, " + 
				" c.VM_ADDRESS1 AS address1, c.VM_ADDRESS2 AS address2, " +
				" c.VM_TEL AS tel, " + 
				" c.VM_START_TIME AS startTime, c.VM_END_TIME AS endTime, c.VM_OFF_NOTE AS offNote, " +
				" c.VM_tsf_FG AS tsf, c.VM_delivery_FG AS delivery, c.VM_sales_FG AS sales, " + 
				" DATE_FORMAT(c.VM_LAST_DATE, '%Y-%m-%d') AS lastDate, " + 
				" DATE_FORMAT(c.VM_REG_DATE, '%Y-%m-%d') AS regDate " + 

				" FROM vm_company AS c " +

				" WHERE c.VM_CP_NO = ?",
				new MapHandler(),
				no
			)
		);

	} catch(Exception se) {
		results.put("error", se.getMessage());

	} finally {
		DbUtils.closeQuietly(conn);

	}

	out.print(gson.toJson(results));
%>