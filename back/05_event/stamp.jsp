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

	// 본사관리자(ROLE1), 판매장관리자(ROLE2) 접근가능
	String requiredRoles = "ROLE1,ROLE2";
%><%@ include file = "../01_sign/auth.jsp" %><%-- 권한체크 --%><%
	
	int userCompanyNo = (Integer)session.getAttribute("userCompanyNo");
  // 페이징 
	int pageSize = 8;
	int pageNumber = 1;
	String stamp_no = "";
	
	try {
		pageNumber = Integer.parseInt(request.getParameter("pageNumber") == null ? "1" : request.getParameter("pageNumber").trim(), 10);
		pageSize = Integer.parseInt(request.getParameter("pageSize") == null ? "8" : request.getParameter("pageSize").trim(), 10);
		stamp_no = request.getParameter("stamp_no") == null ? "" : request.getParameter("stamp_no");		
	} catch(NumberFormatException nfe) {
	}

	int offset = pageSize * (pageNumber - 1);
	int rowCount = pageSize;
 
 	try {
		QueryRunner queryRunner = new QueryRunner();

		// 전체 건수 조회 (일반 게시물)
		String queryTotal =
			" SELECT COUNT(*) AS count"  +
			" FROM vm_stamp " +
			("ROLE1".equals(userRoleCd) ? " WHERE 1=1" : "WHERE company_no = " + userCompanyNo ) +	
			("".equals(stamp_no) ? "" : " AND stamp_no = " + stamp_no ) ;

		results.put("total", 
			queryRunner.query(
				conn,
				queryTotal,
				new ScalarHandler<Integer>()				
			)
		);

		// 리스트 조회 
		String queryList =
			" SELECT stamp_no, reg_no, lst_no, coupon_code, min_price, company_no, status, "+ 
			" 		 (SELECT VM_CP_NAME FROM vm_company c WHERE c.VM_CP_NO = p.company_no) as company_name, " +
			"		 (SELECT u.VM_NAME FROM vm_user u WHERE u.VM_NO = p.reg_no) as reg_name, " +
			"		 (SELECT u.VM_NAME FROM vm_user u WHERE u.VM_NO = p.lst_no) as lst_name, " +			
			"		 DATE_FORMAT(reg_date, '%Y-%m-%d %H:%i:%s') AS reg_date, " +
			"		 DATE_FORMAT(lst_date, '%Y-%m-%d %H:%i:%s') AS lst_date, " +
			"		 DATE_FORMAT(start_date, '%Y-%m-%d') AS start_date, " +
			"		 DATE_FORMAT(end_date, '%Y-%m-%d')  AS end_date ," +			
			"		 CASE WHEN status = 'Y' THEN '반영'  " +					
			"		      WHEN status = 'N' THEN '미반영' END AS status_name " +
			"   FROM hanaro.vm_stamp p " +						
			("ROLE1".equals(userRoleCd) ? " WHERE 1=1" : " WHERE company_no = " + userCompanyNo ) +
			("".equals(stamp_no) ? "" : "   AND stamp_no = " + stamp_no )+			
			" ORDER BY reg_date desc " +
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
