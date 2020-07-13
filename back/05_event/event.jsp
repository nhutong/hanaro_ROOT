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
	String requiredRoles = "ROLE1,ROLE2";
%><%@ include file = "../01_sign/auth.jsp" %><%-- 권한체크 --%><%
	
	int userCompanyNo = (Integer)session.getAttribute("userCompanyNo");
  // 페이징 
	int pageSize = 8;
	int pageNumber = 1;
	String eventNo = "";
	String s_date = request.getParameter("s_date") ==  null ? "2019-01-01" : request.getParameter("s_date").trim();
	String e_date = request.getParameter("e_date") ==  null ? "2999-12-31" : request.getParameter("e_date").trim();
	String category = request.getParameter("category") ==  null ? "" : request.getParameter("category").trim();
	String keyword = request.getParameter("keyword") ==  null ? "" : request.getParameter("keyword").trim();
	String status = request.getParameter("status") ==  null ? "" : request.getParameter("status").trim();
	String company = "";
	
	try {
		pageNumber = Integer.parseInt(request.getParameter("pageNumber") == null ? "1" : request.getParameter("pageNumber").trim(), 10);
		pageSize = Integer.parseInt(request.getParameter("pageSize") == null ? "8" : request.getParameter("pageSize").trim(), 10);
		eventNo = request.getParameter("eventNo") == null ? "" : request.getParameter("eventNo");
		company = request.getParameter("company") == null ? "" : request.getParameter("company");	
	} catch(NumberFormatException nfe) {
	}

	int offset = pageSize * (pageNumber - 1);
	int rowCount = pageSize;
	userCompanyNo = "".equals(company) ? 0 : Integer.parseInt(company);
 
 	try {
		QueryRunner queryRunner = new QueryRunner();
		String acategory = "";
		if ("reg_name".equals(category)) {
			acategory = " (SELECT u.VM_NAME FROM vm_user u WHERE u.VM_NO = p.reg_no) ";
		} else {
			acategory = category;
		}
		// 전체 건수 조회 (일반 게시물)
		String queryTotal =
			" SELECT COUNT(*) AS count"  +
			" FROM vm_event AS p " +
			("0".equals(company) || "".equals(company) ? " WHERE 1=1" : "WHERE company = " + userCompanyNo ) +	
			("".equals(eventNo) ? "" : " AND event_no = " + eventNo ) +
			("".equals(s_date) ? "" : " AND '" + s_date + "' <= end_date ") +
			("".equals(e_date) ? "" : " AND end_date <= '" + e_date + "' ") +
			("".equals(keyword) ? "" : " AND " + acategory + " LIKE '%" + keyword + "%'") +
			("".equals(status) ? "" : " AND activated LIKE '" + status + "' ");
		results.put("total", 
			queryRunner.query(
				conn,
				queryTotal,
				new ScalarHandler<Integer>()				
			)
		);

		// 리스트 조회 
		String queryList =
			" SELECT event_no, event_title, img_url, detail_img_url, "+ 
			" 		 (SELECT VM_CP_NAME FROM vm_company c WHERE c.VM_CP_NO = p.company) as company_name, " +
			"		 company, reg_no, lst_no, " +
			"		 (SELECT u.VM_NAME FROM vm_user u WHERE u.VM_NO = p.reg_no) as reg_name, " +
			"		 (SELECT u.VM_NAME FROM vm_user u WHERE u.VM_NO = p.lst_no) as lst_name, " +			
			"		 DATE_FORMAT(reg_date, '%Y-%m-%d %H:%i:%s') AS reg_date, " +
			"		 DATE_FORMAT(lst_date, '%Y-%m-%d %H:%i:%s') AS lst_date, " +
			"		 DATE_FORMAT(start_date, '%Y-%m-%d') AS start_date, " +
			"		 DATE_FORMAT(end_date, '%Y-%m-%d')  AS end_date, " +	
			"		 CONCAT(DATE_FORMAT(start_date, '%Y-%m-%d'), ' ~ ', DATE_FORMAT(end_date, '%Y-%m-%d')) AS period, " +	
			" 		 case when activated = 'Y' then '반영' else '미반영' end as activated_status, " +			
			"		 activated, link_url, eventLink " +
			" FROM hanaro.vm_event p " +
			("0".equals(company) || "".equals(company) ? " WHERE 1=1" : "WHERE company = " + userCompanyNo ) +	
			("".equals(eventNo) ? "" : " AND event_no = " + eventNo )+	
			("".equals(s_date) ? "" : " AND '" + s_date + "' <= end_date ") +
			("".equals(e_date) ? "" : " AND end_date <= '" + e_date + "' ") +
			("".equals(keyword) ? "" : " AND " + acategory + " LIKE '%" + keyword + "%'") +
			("".equals(status) ? "" : " AND activated LIKE '" + status + "' ") +
			" ORDER BY event_no desc " +
			" limit ?,? ";
		Object[] paramList = new Object[]{ offset, rowCount } ;

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
