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
%><%@ include file = "auth.jsp" %><%-- 권한체크 --%><%

	Integer userNo = (Integer)session.getAttribute("userNo");			

  // 파라미터
	String company_no = request.getParameter("company_no") == null ? "" : request.getParameter("company_no").trim();	
	String round_id = request.getParameter("round_id") == null ? "" : request.getParameter("round_id").trim();		
	String open_flag = request.getParameter("open_flag") == null ? "N" : request.getParameter("open_flag").trim();
	
	if("".equals(company_no)){
		results.put("error", "지점번호가 없습니다.");
		out.print(gson.toJson(results));
		return;
	}

 	try {
		QueryRunner queryRunner = new QueryRunner();
		
		String query =  " UPDATE hanaro.vm_delivery_round " +
						" SET open_flag = ?, lst_no= ?, lst_date=now() " +
						" WHERE company_no = ? AND round_id = ? " ;						

					
		int result = queryRunner.update(
				conn,
				query,				
				open_flag,		
				userNo, 				
				company_no,
				round_id	
			);
		
		results.put("update", result);

	} catch(Exception se) {
		results.put("error", se.getMessage());

	} finally {
		DbUtils.closeQuietly(conn);

	}

	out.print(gson.toJson(results));
%>
