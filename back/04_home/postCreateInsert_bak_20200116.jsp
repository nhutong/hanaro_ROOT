<%@ page contentType = "application/json;charset=utf-8" %>
<%@ page trimDirectiveWhitespaces="true" %>
<%@ page import="java.util.*" %>
<%@ page import="org.apache.commons.dbutils.DbUtils" %>
<%@ page import="org.apache.commons.dbutils.QueryRunner" %>
<%@ page import="org.apache.commons.dbutils.handlers.MapHandler" %>
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
%><%@ include file = "auth.jsp" %><%-- 권한체크 --%><%

	Integer userNo = (Integer)session.getAttribute("userNo");
	String userName = (String)session.getAttribute("userName");
	Integer cpNo = (Integer)session.getAttribute("userCompanyNo");
	String cpName = (String)session.getAttribute("userCompanyName");

  // 파라미터
	String refPostNo = request.getParameter("refPostNo") == null ? null : request.getParameter("refPostNo").trim(); // 관련 게시물 번호
	String refCpNo = request.getParameter("refCpNo") == null ? cpNo.toString() : request.getParameter("refCpNo").trim(); // 관련 판매장 번호

	String postTypeCd = request.getParameter("postTypeCd") == null ? "POST" : request.getParameter("postTypeCd").trim(); // 게시물 유형코드
	String postTypeSeq = request.getParameter("postTypeSeq") == null ? "100" : request.getParameter("postTypeSeq").trim(); // 게시물 유형별 순서

	String postStatusCd = "NORMAL"; // 게시물 상태코드 : 정상(NORMAL)

	String title = request.getParameter("title") == null ? "" : request.getParameter("title").trim();
	String content = request.getParameter("content") == null ? "" : request.getParameter("content").trim();

 	try {
		QueryRunner queryRunner = new QueryRunner();

		// 게시물 등록 (insert)
		results.put("insert", 
			queryRunner.insert(
				conn,
				" INSERT INTO vm_post_user " +
				" (ref_post_no, ref_cp_no, post_type_cd, post_type_seq, post_status_cd, " +
				" title, content, " +
				" reg_no, reg_date, reg_name, reg_ref_cp_no, reg_ref_cp_name, " +
				" lst_no, lst_date, lst_name, lst_ref_cp_no, lst_ref_cp_name) " +
				" VALUES (?, ?, ?, ?, ?, " +
				" ?, ?, " +
				" ?, SYSDATE(), ?, ?, ?, " +
				" ?, SYSDATE(), ?, ?, ?) ",
				new MapHandler(),
				refPostNo, refCpNo, postTypeCd, postTypeSeq, postStatusCd, 
				title, content,
				userNo, userName, cpNo, cpName,
				userNo, userName, cpNo, cpName
			)
		);

	} catch(Exception se) {
		results.put("error", se.getMessage());

	} finally {
		DbUtils.closeQuietly(conn);

	}

	out.print(gson.toJson(results));
%>