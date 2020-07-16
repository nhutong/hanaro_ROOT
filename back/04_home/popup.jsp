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
	String popupNo = "";
	String company = "";
	String s_date = request.getParameter("s_date") ==  null ? "2019-01-01" : request.getParameter("s_date").trim();
	String e_date = request.getParameter("e_date") ==  null ? "2999-12-31" : request.getParameter("e_date").trim();
	String category = request.getParameter("category") ==  null ? "" : request.getParameter("category").trim();
	String keyword = request.getParameter("keyword") ==  null ? "" : request.getParameter("keyword").trim();
	String status = request.getParameter("status") ==  null ? "" : request.getParameter("status").trim();
	
	try {
		pageNumber = Integer.parseInt(request.getParameter("pageNumber") == null ? "1" : request.getParameter("pageNumber").trim(), 10);
		pageSize = Integer.parseInt(request.getParameter("pageSize") == null ? "8" : request.getParameter("pageSize").trim(), 10);
		company = request.getParameter("company") == null ? "" : request.getParameter("company");
		popupNo = request.getParameter("popupNo") == null ? "" : request.getParameter("popupNo");
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
			" FROM vm_popup AS p WHERE " +
			("0".equals(company) || "".equals(company) ? "  1=1" : " company = " + userCompanyNo ) +	
			("".equals(popupNo) ? "" : " AND popup_no = " + popupNo ) +
			("".equals(s_date) || "".equals(e_date) ? "" : " AND ((('" + s_date + "' <= end_date AND end_date <= '" + e_date + "') OR ('" + s_date + "' <= start_date AND start_date <= '" + e_date + "') OR (start_date <= '"+ s_date +"' AND '"+ e_date +"' <= end_date )) OR ( period_type = 1 )) ") +
			("".equals(keyword) ? "" : " AND " + acategory + " LIKE '%" + keyword + "%'") +
			("".equals(status) ? "" : " AND show_flag LIKE '" + status + "' ");
		results.put("total", 
			queryRunner.query(
				conn,
				queryTotal,
				new ScalarHandler<Integer>()				
			)
		);
		// 리스트 조회 
		String queryList =
			" SELECT popup_no, popup_title, img_url, "+ 
			" 		 (SELECT VM_CP_NAME FROM vm_company c WHERE c.VM_CP_NO = p.company) as company_name, " +
			"		 company, reg_no, reg_date, lst_no, lst_date, " +
			"		 (SELECT u.VM_NAME FROM vm_user u WHERE u.VM_NO = p.reg_no) as reg_name, " +
			"		 (SELECT u.VM_NAME FROM vm_user u WHERE u.VM_NO = p.lst_no) as lst_name, " +
			"		 period_type, " + 
			"		 DATE_FORMAT(start_date, '%Y-%m-%d') AS start_date, " +
			"		 DATE_FORMAT(end_date, '%Y-%m-%d')  AS end_date, " +
			"		 CASE WHEN period_type = 1 THEN '계속' ELSE CONCAT(DATE_FORMAT(start_date, '%Y-%m-%d'), ' ~ ', DATE_FORMAT(end_date, '%Y-%m-%d')) END AS period, " +
			" 		 show_flag, link_url" +
			" FROM hanaro.vm_popup p WHERE " +			
			("0".equals(company) || "".equals(company) ? "1=1" : "company = " + userCompanyNo ) +
			("".equals(popupNo) ? "" : " AND popup_no = " + popupNo ) +
			("".equals(s_date) || "".equals(e_date) ? "" : " AND ((('" + s_date + "' <= end_date AND end_date <= '" + e_date + "') OR ('" + s_date + "' <= start_date AND start_date <= '" + e_date + "') OR (start_date <= '"+ s_date +"' AND '"+ e_date +"' <= end_date )) OR ( period_type = 1 )) ") +
			("".equals(keyword) ? "" : " AND " + acategory + " LIKE '%" + keyword + "%'") +
			("".equals(status) ? "" : " AND show_flag LIKE '" + status + "' ") +
			" ORDER BY popup_no desc " +
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
