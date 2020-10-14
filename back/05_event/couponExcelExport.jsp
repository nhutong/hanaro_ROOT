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
	Gson gson = new GsonBuilder().serializeNulls().create();

	Map<String, Object> results = new HashMap<>();

	// 본사관리자(ROLE1)와 판매장관리자(ROLE2)만 접근가능
	String requiredRoles = "ROLE1,ROLE2";

%><%@ include file = "../01_sign/auth.jsp" %><%-- 권한체크 --%><%    
	
	String coupon_no = "";
	String coupon_code = "";
	String company = "";
	String s_date = request.getParameter("s_date") ==  null ? "2019-01-01" : request.getParameter("s_date").trim();
	String e_date = request.getParameter("e_date") ==  null ? "2999-12-31" : request.getParameter("e_date").trim();
	String category = request.getParameter("category") ==  null ? "" : request.getParameter("category").trim();
	String keyword = request.getParameter("keyword") ==  null ? "" : request.getParameter("keyword").trim();
	String status = request.getParameter("status") ==  null ? "" : request.getParameter("status").trim();
	
	try {		
		coupon_no = request.getParameter("coupon_no") == null ? "" : request.getParameter("coupon_no");
		coupon_code = request.getParameter("coupon_code") == null ? "" : request.getParameter("coupon_code");
		company = request.getParameter("company") == null ? "" : request.getParameter("company");
	} catch(NumberFormatException nfe) {
	}   	
	
	int userCompanyNo = "".equals(company) ? 0 : Integer.parseInt(company);

	try {
		QueryRunner queryRunner = new QueryRunner();
		
		String acategory = "";
		if ("reg_name".equals(category)) {
			acategory = " (SELECT u.VM_NAME FROM vm_user u WHERE u.VM_NO = p.reg_no) ";
		} else {
			acategory = category;
		}
        // 리스트 조회
        String queryList =
            " SELECT coupon_no," +
			" case when coupon_type = 'PRODUCT' then '상품할인' else '결제할인' end as coupon_type_name, " +
			" coupon_name, " + 
			" product_code, " + 
			" (SELECT VM_CP_NAME FROM vm_company c WHERE c.VM_CP_NO = p.company_no) as company_name, " +
			" status_cd ," +
			" concat(DATE_FORMAT(start_date, '%Y-%m-%d') , '~' , DATE_FORMAT(end_date, '%Y-%m-%d')) as date1 ," +
			//" DATE_FORMAT(start_date, '%Y-%m-%d') ||" + "~" +"|| DATE_FORMAT(end_date, '%Y-%m-%d')  AS date, " +				
			" (SELECT u.VM_NAME FROM vm_user u WHERE u.VM_NO = p.reg_no) as reg_name, " +
			" DATE_FORMAT(reg_date, '%Y-%m-%d %H:%i:%s') AS reg_date " +
			"   FROM hanaro.vm_coupon p " +	
			"   left outer join ( SELECT g.img_path, g.pd_code, MAX(g.reg_date) from vm_product_image AS g GROUP BY g.pd_code ) as b " +
			"   on p.product_code = b.pd_code "
			("0".equals(company) || "".equals(company) ? " WHERE 1=1" : " WHERE company_no = " + userCompanyNo ) +
			("".equals(coupon_no) ? "" : "   AND coupon_no = " + coupon_no )+
			("".equals(coupon_code) ? "" : " AND coupon_code = '" + coupon_code +"'") +
			//("".equals(s_date) ? "" : " AND '" + s_date + "' <= end_date ") +
			//("".equals(e_date) ? "" : " AND end_date <= '" + e_date + "' ") +
			("".equals(s_date) || "".equals(e_date) ? "" : " AND (('" + s_date + "' <= end_date AND end_date <= '" + e_date + "') OR ('" + s_date + "' <= start_date AND start_date <= '" + e_date + "') OR (start_date <= '"+ s_date +"' AND '"+ e_date +"' <= end_date ))") +
			("".equals(keyword) ? "" : " AND " + acategory + " LIKE '%" + keyword + "%'") +
			("".equals(status) ? "" : " AND status_cd LIKE '" + status + "' ") +
			" ORDER BY p.reg_date desc ";		
                        
		//Object[] paramList = new Object[]{ offset, rowCount } ;

		results.put("list", 
			queryRunner.query(
				conn,
				queryList,
				new MapListHandler()
				//paramList
			)
		);

	} catch(Exception e) {
		results.put("exception error", e.getMessage());

	} finally {
		DbUtils.closeQuietly(conn);

	}

	out.print(gson.toJson(results));
%>
