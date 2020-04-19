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

	// 본사관리자(ROLE1), 판매장관리자(ROLE2), 배송담당자(ROLE3)만 접근가능
	String requiredRoles = "ROLE1,ROLE2,ROLE3";
	%><%@ include file = "../01_sign/auth.jsp" %><%-- 권한체크 --%><%

  // 파라미터
	String no = request.getParameter("no") == null ? "" : request.getParameter("no").trim();
	String refCpNo = request.getParameter("refCpNo") == null ? "" : request.getParameter("refCpNo").trim();
 
 	try {
		QueryRunner queryRunner = new QueryRunner();

		// 특정 게시물 조회
		results.put("post", 
			queryRunner.query(
				conn,
				" SELECT p.post_no AS no, p.ref_post_no AS refPostNo, " +
				" p.ref_cp_no AS refCpNo, c.VM_CP_NAME AS refCpName, " + 
				" p.post_type_cd AS postTypeCd, p.post_type_seq AS postTypeSeq, p.post_status_cd AS postStatusCd, " + 
				" IF(post_status_cd = 'DELETED', '삭제된 게시물입니다.', p.title) AS title, " + 
				" IF(post_status_cd = 'DELETED', '', p.content) AS content, " + 
				" p.reg_no AS regNo, p.reg_name AS regName, " + 
				" p.reg_ref_cp_no AS regRefCpNo, p.reg_ref_cp_name as regRefCpName, " + 
				" DATE_FORMAT(p.reg_date, '%Y-%m-%d') AS regDate, " + 
				" p.view_count AS viewCount " + 

				" FROM vm_post_user AS p " +

				" JOIN vm_company AS c " + 
				" ON (c.VM_CP_NO = p.ref_cp_no) " +

				" WHERE p.post_no = ? AND p.ref_cp_no = ? " +
				" AND (p.post_type_cd = 'NOTICE' OR p.post_type_cd = 'POST')", // 공지사항 또는 일반 게시물
				new MapHandler(),
				no,
				refCpNo
			)
		);

		// 특정 게시물의 댓글 리스트 조회
		results.put("comments", 
			queryRunner.query(
				conn,
				" SELECT p.post_no AS no, p.ref_post_no AS refPostNo, " +
				" p.ref_cp_no AS refCpNo, c.VM_CP_NAME AS refCpName, " + 
				" p.post_type_cd AS postTypeCd, p.post_type_seq AS postTypeSeq, p.post_status_cd AS postStatusCd, " + 
				" p.content AS content, " + 
				" p.reg_no AS regNo, p.reg_name AS regName, " + 
				" p.reg_ref_cp_no AS regRefCpNo, p.reg_ref_cp_name as regRefCpName, " + 
				" DATE_FORMAT(p.reg_date, '%Y-%m-%d') AS regDate, " + 
				" p.view_count AS viewCount " + 

				" FROM vm_post_user AS p " +

				" JOIN vm_company AS c " + 
				" ON (c.VM_CP_NO = p.ref_cp_no) " +

				" WHERE p.post_type_cd = 'COMMENT' " + // 댓글
				" AND p.ref_post_no = ? AND p.ref_cp_no = ? " +
				" AND p.post_status_cd <> 'DELETED' " + // 삭제된 댓글은 제외
				
				" ORDER BY p.post_no DESC ",
				new MapListHandler(),
				no,
				refCpNo
			)
		);

		// 조회수 업데이트
		String hash = (String)session.getAttribute("userToken");
		queryRunner.update(
			conn,
			" UPDATE vm_post_user SET " +

			" view_count = view_count + 1, view_last_hash = ? " +
			
			" WHERE post_no = ? AND (view_last_hash IS NULL OR view_last_hash <> ?) ",

			hash,

			no,
			hash
		);

	} catch(Exception se) {
		results.put("error", se.getMessage());

	} finally {
		DbUtils.closeQuietly(conn);

	}

	out.print(gson.toJson(results));
%>