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

  // 파라미터
	String searchKeyword = request.getParameter("searchKeyword") == null ? "" : request.getParameter("searchKeyword").trim(); // 검색 키워드

  // 페이징 
	int pageSize = 8;
	int pageNumber = 1;
	
	try {
		pageNumber = Integer.parseInt(request.getParameter("pageNumber") == null ? "1" : request.getParameter("pageNumber").trim(), 10);
		pageSize = Integer.parseInt(request.getParameter("pageSize") == null ? "8" : request.getParameter("pageSize").trim(), 10);
	} catch(NumberFormatException nfe) {
	}

	int offset = pageSize * (pageNumber - 1);
	int rowCount = pageSize;
 
 	try {
		QueryRunner queryRunner = new QueryRunner();

		// 전체 건수 조회 (일반 게시물)
		String queryTotal =
			" SELECT COUNT(*) AS count"  +
			" FROM vm_post_user AS p " +
			" WHERE p.post_type_cd = 'POST' " +
			("".equals(searchKeyword) ? "" : " AND (p.title LIKE ? OR p.reg_name LIKE ?) ");

		Object[] paramTotal = "".equals(searchKeyword) ? new Object[]{ } : new Object[]{ "%" + searchKeyword + "%", "%" + searchKeyword + "%" };

		results.put("total", 
			queryRunner.query(
				conn,
				queryTotal,
				new ScalarHandler<Integer>(),
				paramTotal
			)
		);

		// 리스트 조회 (공지사항 + 일반 게시물)
		String queryList =
			" SELECT p.post_no AS no, p.ref_post_no AS refPostNo, " +
			" p.ref_cp_no AS refCpNo, c.VM_CP_NAME AS refCpName, " + 
			" p.post_type_cd AS postTypeCd, p.post_type_seq AS postTypeSeq, p.post_status_cd AS postStatusCd, " + 
			" IF(post_status_cd = 'DELETED', '삭제된 게시물입니다.', p.title) AS title, " + 
			" p.reg_no AS regNo, p.reg_name AS regName, " + 
			" p.reg_ref_cp_no AS regRefCpNo, p.reg_ref_cp_name as regRefCpName, " + 
			" DATE_FORMAT(p.reg_date, '%Y-%m-%d') AS regDate, " + 
			" p.view_count AS viewCount " +

			" FROM ( " +
			" 	(SELECT * FROM vm_post_user WHERE post_type_cd = 'NOTICE' AND post_status_cd = 'NORMAL' ORDER BY post_no DESC) " + 
			"		UNION " +	
			"		(SELECT * FROM vm_post_user WHERE post_type_cd = 'POST' " +

			("".equals(searchKeyword) ? "" : " AND (title LIKE ? OR reg_name LIKE ?) ") +

//			"			ORDER BY post_no DESC LIMIT ?,?) " +
			" ) AS p " + 

			" JOIN vm_company AS c " + 
			" ON (c.VM_CP_NO = p.ref_cp_no) " +
			"			ORDER BY post_no DESC limit ?,? ;  ";

		Object[] paramList = "".equals(searchKeyword) ? new Object[]{ offset, rowCount } : new Object[]{ "%" + searchKeyword + "%", "%" + searchKeyword + "%", offset, rowCount };

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