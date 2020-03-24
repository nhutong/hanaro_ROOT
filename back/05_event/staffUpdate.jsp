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
  	String staff_no = request.getParameter("staff_no") == null ? "" : request.getParameter("staff_no").trim();	
	String stamp_pw = request.getParameter("stamp_pw") == null ? "" : request.getParameter("stamp_pw").trim();	
	
 	try {

		sql = " SELECT a.company_no FROM vm_staff AS a where a.staff_no = '"+staff_no+"' "; 	
		stmt = conn.createStatement();
		rs = stmt.executeQuery(sql);
		
		rs.last();
		int listCount = rs.getRow();
		if(listCount == 0){
			out.clear();
//			out.print("exist");
			results.put("noCom", 0);
			out.print(gson.toJson(results));
			return;
		};
		rs.beforeFirst();

		String company_no = "";
		while(rs.next()){
			
			company_no   = rs.getString("company_no");

		};

		sql = " SELECT a.staff_no FROM vm_staff AS a where company_no = '"+company_no+"' and stamp_pw = '"+stamp_pw+"' "; 	
		stmt = conn.createStatement();
		rs = stmt.executeQuery(sql);
		
		rs.last();
		int listCount1 = rs.getRow();
		if(listCount1 > 0){
			out.clear();
//			out.print("exist");
			results.put("insert", 0);
			out.print(gson.toJson(results));
			return;
		};
		rs.beforeFirst();


		QueryRunner queryRunner = new QueryRunner();

		String query = "  UPDATE vm_staff " + 
					  "  SET stamp_pw = ?, lst_no = ?, lst_date = now()" + 
					 " WHERE staff_no = ? " ;
				
		int result = queryRunner.update(
						conn,
						query,
						stamp_pw,										
						userNo,						
						staff_no
					);
	 	
		results.put("update", result);		

	} catch(Exception se) {
		results.put("error", se.getMessage());

	} finally {
		DbUtils.closeQuietly(conn);
	}

	out.print(gson.toJson(results));
%>
