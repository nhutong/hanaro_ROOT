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
	String coupon_no = "";
	String coupon_code = "";
	
	try {
		pageNumber = Integer.parseInt(request.getParameter("pageNumber") == null ? "1" : request.getParameter("pageNumber").trim(), 10);
		pageSize = Integer.parseInt(request.getParameter("pageSize") == null ? "8" : request.getParameter("pageSize").trim(), 10);
		coupon_no = request.getParameter("coupon_no") == null ? "" : request.getParameter("coupon_no");
		coupon_code = request.getParameter("coupon_code") == null ? "" : request.getParameter("coupon_code");
	} catch(NumberFormatException nfe) {
	}

	int offset = pageSize * (pageNumber - 1);
	int rowCount = pageSize;
 
 	try {
		QueryRunner queryRunner = new QueryRunner();

		// 전체 건수 조회 (일반 게시물)
		String queryTotal =
			" SELECT COUNT(*) AS count"  +
			" FROM vm_coupon " +
			("ROLE1".equals(userRoleCd) ? " WHERE 1=1" : "WHERE company_no = " + userCompanyNo ) +	
			("".equals(coupon_no) ? "" : " AND coupon_no = " + coupon_no ) +
			("".equals(coupon_code) ? "" : " AND coupon_code = '" + coupon_code +"'") ;

		results.put("total", 
			queryRunner.query(
				conn,
				queryTotal,
				new ScalarHandler<Integer>()				
			)
		);

		// 리스트 조회 
		String queryList =
			" SELECT coupon_no, coupon_name, coupon_type, coupon_code, reg_no, lst_no, product_code, product_name, discount_price, min_price, limit_qty, extra, weight, unit_price, origin, etc_info, "+ 
			"		 (SELECT u.VM_NAME FROM vm_user u WHERE u.VM_NO = p.reg_no) as reg_name, " +
			"		 (SELECT u.VM_NAME FROM vm_user u WHERE u.VM_NO = p.lst_no) as lst_name, " +			
			"		 DATE_FORMAT(reg_date, '%Y-%m-%d %H:%i:%s') AS reg_date, " +
			"		 DATE_FORMAT(lst_date, '%Y-%m-%d %H:%i:%s') AS lst_date, " +
			"		 DATE_FORMAT(start_date, '%Y-%m-%d') AS start_date, " +
			"		 DATE_FORMAT(end_date, '%Y-%m-%d')  AS end_date, " +	
			" 		 (SELECT VM_CP_NAME FROM vm_company c WHERE c.VM_CP_NO = p.company_no) as company_name, " +
			"		 (SELECT g.CODE_NAME FROM vm_code g WHERE g.CODE_GROUP = 'COUPON_STATUS' AND g.code = p.status_cd) as status_name, " +
			"		 p.status_cd, ifnull(p.stamp_fg,'N') as stamp_fg, " +
			" 		 case when coupon_type = 'PRODUCT' then '상품할인' else '결제할인' end as coupon_type_name, ifnull(coupon_detail,'') as coupon_detail, " +
			"        b.img_path as img_path " +
			"   FROM hanaro.vm_coupon p " +	
			"   left outer join ( SELECT g.img_path, g.pd_code, MAX(g.reg_date) from vm_product_image AS g GROUP BY g.pd_code ) as b " +
			"   on p.product_code = b.pd_code " +
			("ROLE1".equals(userRoleCd) ? " WHERE 1=1" : " WHERE company_no = " + userCompanyNo ) +
			("".equals(coupon_no) ? "" : "   AND coupon_no = " + coupon_no )+
			("".equals(coupon_code) ? "" : " AND coupon_code = '" + coupon_code +"'") +
			" ORDER BY p.reg_date desc " +
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
