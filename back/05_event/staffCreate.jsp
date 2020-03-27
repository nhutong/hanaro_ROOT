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
%><%@ include file = "auth.jsp" %><%-- 권한체크 --%><%

	Integer userNo = (Integer)session.getAttribute("userNo");			

  // 파라미터	
	String company_no = request.getParameter("company_no") == null ? "" : request.getParameter("company_no").trim();	
	String staff_name = request.getParameter("staff_name") == null ? "" : request.getParameter("staff_name").trim();	
	String stamp_pw = request.getParameter("stamp_pw") ==  null ? "" : request.getParameter("stamp_pw").trim();	
	
 	try {

		sql = " SELECT a.staff_no FROM vm_staff AS a where company_no = '"+company_no+"' and stamp_pw = '"+stamp_pw+"' "; 	
		stmt = conn.createStatement();
		rs = stmt.executeQuery(sql);
		
		rs.last();
		int listCount = rs.getRow();
		if(listCount > 0){
			out.clear();
//			out.print("exist");
			results.put("insert", 0);
			out.print(gson.toJson(results));
			return;
		};
		rs.beforeFirst();

		QueryRunner queryRunner = new QueryRunner();
	
		// 관리자 등록 (insert)
		String query = " INSERT INTO vm_staff " + 
					  " (company_no, staff_name, stamp_pw, reg_no, reg_date, lst_no, lst_date ) " + 
					 " VALUES(?, ?, ?, ?, now(), ?, now()) " ;

		int result = queryRunner.update(
						conn,
						query,
						company_no,
						staff_name,
						stamp_pw,
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
