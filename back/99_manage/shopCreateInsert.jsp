<%@ page contentType = "application/json;charset=utf-8" %>
<%@ page trimDirectiveWhitespaces="true" %>
<%@ page import="java.util.*" %>
<%@ page import="org.apache.commons.dbutils.DbUtils" %>
<%@ page import="org.apache.commons.dbutils.QueryRunner" %>
<%@ page import="org.apache.commons.dbutils.handlers.MapHandler" %>
<%@ page import="org.apache.commons.dbutils.handlers.MapListHandler" %>
<%@ page import="com.google.gson.Gson" %>
<%@ page import="com.google.gson.GsonBuilder" %>

<%@ include file = "../00_include/dbConn.jsp" %>

<%	
	// https://stackoverflow.com/a/27669890
	// Apache Commons DbUtils : https://commons.apache.org/proper/commons-dbutils/
	// Gson : https://github.com/google/gson
	Gson gson = new GsonBuilder().serializeNulls().create();

	Map<String, Object> results = new HashMap<>();

	// 본사관리자(ROLE1)만 접근가능
	String requiredRoles = "ROLE1";
%><%@ include file = "../01_sign/auth.jsp" %><%-- 권한체크 --%><%

	Integer userNo = (Integer)session.getAttribute("userNo");

  // 파라미터
	String name = request.getParameter("name") == null ? "" : request.getParameter("name").trim();
	String address1 = request.getParameter("address1") == null ? "" : request.getParameter("address1").trim();
	String address2 = request.getParameter("address2") == null ? "" : request.getParameter("address2").trim();
	String tel = request.getParameter("tel") == null ? "" : request.getParameter("tel").trim();
	String startTime = request.getParameter("startTime") == null ? "" : request.getParameter("startTime").trim();
	String endTime = request.getParameter("endTime") == null ? "" : request.getParameter("endTime").trim();
	String tsf = request.getParameter("tsf") == null ? "" : request.getParameter("tsf").trim();
	String offNote = request.getParameter("offNote") == null ? "" : request.getParameter("offNote").trim();
	String delivery = request.getParameter("delivery") == null ? "" : request.getParameter("delivery").trim();
	String sales = request.getParameter("sales") == null ? "" : request.getParameter("sales").trim();

 	try {
		QueryRunner queryRunner = new QueryRunner();

		// 관리자 등록 (insert)
		results.put("insert", 
			queryRunner.insert(
				conn,
				" INSERT INTO vm_company " +
				" (VM_CP_NAME, VM_ADDRESS1, VM_ADDRESS2, VM_TEL, VM_START_TIME, VM_END_TIME, " +
				" VM_OFF_NOTE, VM_tsf_FG, VM_delivery_FG, VM_sales_FG, VM_LAST_NO, VM_LAST_DATE, VM_REG_NO, VM_REG_DATE) " +
				" VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, SYSDATE(), ?, SYSDATE()) ",
				new MapHandler(),
				name,
				address1,
				address2,
				tel,
				startTime,
				endTime,
				offNote,
				tsf,
				delivery,
				sales,
				userNo,
				userNo
			)
		);



		sql = " SELECT max(vm_cp_no) as new_cp_no FROM vm_company ";
		stmt = conn.createStatement();
		rs = stmt.executeQuery(sql);
		
		String new_cp_no = "";		
		
		while(rs.next()){
			new_cp_no   = rs.getString("new_cp_no");
		};


		results.put("insert", 
			queryRunner.insert(
				conn,
				" INSERT INTO vm_sudden_notice ( ref_cp_no ) "
				+" values ('"+new_cp_no+"');",
				new MapHandler()
			)
		);

		results.put("insert", 
			queryRunner.insert(
				conn,
				" INSERT INTO vm_shop_jundan ( ref_company_no ) "
				+" values ('"+new_cp_no+"');",
				new MapHandler()
			)
		);
		
		results.put("insert", 
			queryRunner.insert(
				conn,
				" INSERT INTO vm_menu_default ( vm_cp_no ) "
				+" values ('"+new_cp_no+"');",
				new MapHandler()
			)
		);

		// GENERATED_KEY

	} catch(Exception se) {
		results.put("error", se.getMessage());

	} finally {
		DbUtils.closeQuietly(conn);

	}

	out.print(gson.toJson(results));
%>