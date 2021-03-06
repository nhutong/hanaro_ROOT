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

	// 본사관리자(ROLE1)와 판매장관리자(ROLE2)만 접근가능
	String requiredRoles = "ROLE1,ROLE2";
%><%@ include file = "../01_sign/auth.jsp" %><%-- 권한체크 --%><%

  // 페이징 
	int pageSize = 8;
	int pageNumber = 1;
	String keyword = "";
	String privacy = "";
	String push = "";
	String location = "";
	String agree_ft = "";
	
	try {
		pageNumber = Integer.parseInt(request.getParameter("pageNumber") == null ? "1" : request.getParameter("pageNumber").trim(), 10);
		pageSize = Integer.parseInt(request.getParameter("pageSize") == null ? "8" : request.getParameter("pageSize").trim(), 10);
		keyword = request.getParameter("keyword") == null ? "%%" : "%" +request.getParameter("keyword").trim() + "%";
//		keyword = java.net.URLDecoder.decode(keyword);
		privacy = request.getParameter("privacy") == null ? "" : request.getParameter("privacy").trim();
		push = request.getParameter("push") == null ? "" : request.getParameter("push").trim();
		location = request.getParameter("location") == null ? "" : request.getParameter("location").trim();
		agree_ft = request.getParameter("agree_ft") == null ? "" : request.getParameter("agree_ft").trim();   //2021.02.08 심규문 14세이상 동의

	} catch(NumberFormatException nfe) {
	}

	int offset = pageSize * (pageNumber - 1);
	int rowCount = pageSize;
 
 	try {
		QueryRunner queryRunner = new QueryRunner();

		// 판매장관리자(ROLE2)이면 해당 판매장만 조회되도록 조건 쿼리 및 파라미터 추가
		Integer userCompanyNo = (Integer)session.getAttribute("userCompanyNo");

		// 전체 건수 조회
		String queryTotal =
			" SELECT COUNT(*) AS count"  +
			" FROM vm_member AS c " +
			" WHERE (name like ?  or tel like ? ) " +						
			(push.length() > 0 ? " AND agree_push = '"+push+"' " : "") +
			(location.length() > 0 ? " AND agree_location = '"+location+"' " : "") +
			(agree_ft.length() > 0 ? " AND agree_ft = '"+agree_ft+"' " : "") +
			("ROLE2".equals(userRoleCd) ? " AND company_no = ? " : "") ;

		Object[] paramTotal = "ROLE2".equals(userRoleCd) ? new Object[]{ keyword, keyword, userCompanyNo } : new Object[]{ keyword, keyword };

		results.put("total", 
			queryRunner.query(
				conn,
				queryTotal,
				new ScalarHandler<Integer>(),
				paramTotal
			)
		);

		// 리스트 조회
		String queryList =
			" SELECT " + 
			" (SELECT vc.VM_CP_NAME FROM vm_company vc WHERE vc.VM_CP_NO = vm.company_no) AS company, tel, name, no, " +
			" IF(agree_privacy = 'Y', '동의', '비동의') AS privacy, " + 
			" DATE_FORMAT(reg_date, '%Y-%m-%d') AS regDate, " + 
			" IF(agree_push = 'Y', '동의', '비동의') AS push , "+ 
			" DATE_FORMAT(push_agree_date, '%Y-%m-%d') AS push_agree_date, " + 
			" DATE_FORMAT(push_disagree_date, '%Y-%m-%d') AS push_disagree_date, " + 
			" IF(agree_location = 'Y', '동의', '비동의') AS location, " + 
			" IF(agree_ft = 'Y', '동의', '비동의') AS agree_ft, " + 
			" DATE_FORMAT(last_date, '%Y-%m-%d') AS lastDate, " + 
			"(SELECT  concat(rs_address1, rs_address2) FROM vm_reserve vr  WHERE vr.ref_member_no = vm.NO ORDER BY NO DESC LIMIT 1 ) address, " +
			"(SELECT count(*) FROM vm_reserve vr WHERE vr.ref_member_no = vm.NO) orderCount, " +
			"(SELECT sum(vr.order_price) FROM vm_reserve vr WHERE vr.ref_member_no = vm.NO) totalOrderPrice, memo " +
			" FROM vm_member AS vm " +
			" WHERE (name like ?  or tel like ? ) " +			
			(push.length() > 0 ? " AND agree_push = '"+push+"' " : "") +
			(location.length() > 0 ? " AND agree_location = '"+location+"' " : "") +
			(agree_ft.length() > 0 ? " AND agree_ft = '"+agree_ft+"' " : "") +         //2021.02.08 심규문 14세이상 동의
			("ROLE2".equals(userRoleCd) ? " AND company_no = ? " : "") + 
			" ORDER BY 1 DESC " +
			" LIMIT ?,? ";

		Object[] paramList = "ROLE2".equals(userRoleCd) ? new Object[]{ keyword, keyword, userCompanyNo, offset, rowCount } : new Object[]{ keyword, keyword, offset, rowCount };

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
