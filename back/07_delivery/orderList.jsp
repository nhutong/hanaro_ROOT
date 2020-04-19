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
	String requiredRoles = "ROLE1,ROLE2,ROLE3";
%><%@ include file = "../01_sign/auth.jsp" %><%-- 권한체크 --%><%
	
	int userCompanyNo = (Integer)session.getAttribute("userCompanyNo");
  // 페이징 
	int pageSize = 8;
	int pageNumber = 1;
	
	try {
		pageNumber = Integer.parseInt(request.getParameter("pageNumber") == null ? "1" : request.getParameter("pageNumber").trim(), 10);
		pageSize = Integer.parseInt(request.getParameter("pageSize") == null ? "8" : request.getParameter("pageSize").trim(), 10);	
	} catch(NumberFormatException nfe) {
	}

	String order_date = request.getParameter("order_date") == null ? "0" : request.getParameter("order_date");
	String company_no = request.getParameter("company_no") == null ? "0" : request.getParameter("company_no");
	String search = request.getParameter("search") == null ? "" : request.getParameter("search").trim();

	int offset = pageSize * (pageNumber - 1);
	int rowCount = pageSize;
 
 	try {
		QueryRunner queryRunner = new QueryRunner();

		String queryT = ""; 
		if ( search.equals("")){
		}else{
			queryT = " AND ( m.name like '%"+search+"%' or m.tel like '%"+search+"%') ";
		}

		// 전체 건수 조회 (일반 게시물)		
		String queryTotal =
			" SELECT COUNT(*) AS count"  +			
			" FROM vm_reserve r " +
			" left outer JOIN vm_member m ON (r.ref_member_no = m.no) " + 
			" WHERE r.company_no = " + company_no + " AND DATE_FORMAT(rs_std_date, '%Y-%m-%d') = '" +  order_date  + "'" + 
			queryT;

		results.put("total", 
			queryRunner.query(
				conn,
				queryTotal,
				new ScalarHandler<Integer>()				
			)
		);

		// 각 배송상태별 건수 조회
		// 104	배송완료
		// 108	교환완료
		// 111	반품완료
		String queryStatusTotal =
			" SELECT r.rs_status_cd status_code,  count(r.rs_no) order_count " + 
			" FROM vm_reserve r " +
			" left outer JOIN vm_member m ON (r.ref_member_no = m.no) " + 
			" WHERE r.company_no = " + company_no + " AND DATE_FORMAT(rs_std_date, '%Y-%m-%d') = '" +  order_date  + "'" + 
			queryT + 
			" GROUP BY r.rs_status_cd ";

		results.put("status_total", 
			queryRunner.query(
				conn,
				queryStatusTotal,
				new MapListHandler()
			)
		);

		// 리스트 조회 
		String queryList =
			" SELECT rs_no, rs_status_cd, rs_std_date, ref_member_no, rs_address1, rs_address2, order_price, r.company_no, delivery_round_id, delivery_manager, "+ 			
			"		 m.name , m.tel, " + 
			"		 DATE_FORMAT(r.reg_date, '%Y-%m-%d %H:%i:%s') AS reg_date, " +
			"		 DATE_FORMAT(r.lst_date, '%Y-%m-%d %H:%i:%s') AS lst_date, " +
			"		 DATE_FORMAT(rs_std_date, '%Y-%m-%d') AS order_date, " +
			"		(SELECT u.VM_NAME FROM vm_user u WHERE u.VM_NO = r.delivery_manager AND u.VM_ROLE_CD = 'ROLE3') as delivery_manager_name, " + 
			" 		(SELECT c.CODE_NAME FROM vm_code c WHERE c.CODE_GROUP = 'ORDER_STATUS' AND c.CODE = r.rs_status_cd) order_status, " + 
			"       (SELECT concat(left(delivery_start_time,2),':',right(delivery_start_time,2),'-' ,left(delivery_end_time,2),':',right(delivery_end_time,2)) FROM vm_delivery_round d WHERE d.round_id = r.delivery_round_id AND d.company_no = r.company_no ) as delivery_time" + 
			" FROM hanaro.vm_reserve r " +
			" left outer JOIN vm_member m ON (r.ref_member_no = m.no) " + 
			" WHERE r.company_no = ? AND DATE_FORMAT(rs_std_date, '%Y-%m-%d') = ? " +

			queryT +

			" ORDER BY rs_no desc " +
			" limit ?,? ";

		Object[] paramList = new Object[]{ company_no, order_date, offset, rowCount } ;

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
