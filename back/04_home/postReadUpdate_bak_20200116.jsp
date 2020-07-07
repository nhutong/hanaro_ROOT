<%@ page contentType = "application/json;charset=utf-8" %>
<%@ page trimDirectiveWhitespaces="true" %>
<%@ page import="java.util.*" %>
<%@ page import="org.apache.commons.dbutils.DbUtils" %>
<%@ page import="org.apache.commons.dbutils.QueryRunner" %>
<%@ page import="org.apache.commons.dbutils.handlers.MapHandler" %>
<%@ page import="org.apache.commons.dbutils.handlers.MapListHandler" %>
<%@ page import="com.google.gson.Gson" %>
<%@ page import="com.google.gson.GsonBuilder" %>
<%@ page import="javax.mail.*" %>
<%@ page import="javax.mail.internet.*" %>

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

	Integer userNo = (Integer)session.getAttribute("userNo");
	String userName = (String)session.getAttribute("userName");
	Integer cpNo = (Integer)session.getAttribute("userCompanyNo");
	String cpName = (String)session.getAttribute("userCompanyName");

  // 파라미터
	String no = request.getParameter("no") == null ? null : request.getParameter("no").trim(); // 게시물 또는 댓글 번호

	String refPostNo = request.getParameter("refPostNo") == null ? null : request.getParameter("refPostNo").trim(); // 관련 게시물 번호
	String refCpNo = request.getParameter("refCpNo") == null ? null : request.getParameter("refCpNo").trim(); // 관련 판매장 번호

	String postTypeCd = request.getParameter("postTypeCd") == null ? null : request.getParameter("postTypeCd").trim(); // 게시물 유형코드
	String postTypeSeq = request.getParameter("postTypeSeq") == null ? "100" : request.getParameter("postTypeSeq").trim(); // 게시물 유형별 순서

	String title = request.getParameter("title") == null ? "" : request.getParameter("title").trim();
	String content = request.getParameter("content") == null ? "" : request.getParameter("content").trim();

 	try {
		QueryRunner queryRunner = new QueryRunner();

		// 특정 게시물 또는 댓글 조회 (delete전)
		Map<String, Object> previous =  
			queryRunner.query(
				conn,
				" SELECT p.post_no AS no, p.ref_post_no AS refPostNo, " +
				" p.ref_cp_no AS refCpNo, c.VM_CP_NAME AS refCpName, " + 
				" p.post_type_cd AS postTypeCd, p.post_type_seq AS postTypeSeq, p.post_status_cd AS postStatusCd, " + 
				" p.title AS title, p.content AS content, " + 
				" p.reg_no AS regNo, p.reg_name AS regName, " + 
				" p.reg_ref_cp_no AS regRefCpNo, p.reg_ref_cp_name as regRefCpName, " + 
				" DATE_FORMAT(p.reg_date, '%Y-%m-%d') AS regDate, " + 
				" p.view_count AS viewCount " + 

				" FROM vm_post_user AS p " +

				" JOIN vm_company AS c " + 
				" ON (c.VM_CP_NO = p.ref_cp_no) " +

				" WHERE p.post_no = ? ",
				
				new MapHandler(),

				no
			);

		// 추가 체크
		if("ROLE2".equals(userRoleCd) || "ROLE3".equals(userRoleCd)) {
			// 판매장관리자(ROLE2), 배송담당자(ROLE3)이면 본인이 작성한 게시물,댓글만 삭제할 수 있도록 조건 쿼리 및 파라미터 추가
			Integer previousRegNo = (Integer)previous.get("regNo");

			if(previousRegNo.equals(userNo)) {
				// 접근가능
			} else {
				// 접근불가능
				results.put("error", "권한이 없습니다.");
				out.print(gson.toJson(results));

				// 응답 (HttpServletResponse) : https://docs.oracle.com/javaee/7/api/javax/servlet/http/HttpServletResponse.html
				response.setStatus(response.SC_FORBIDDEN); // 403		
				return;
			}
		}

		// 특정 관리자 수정 (update)
		results.put("update", 
			queryRunner.update(
				conn,
				" UPDATE vm_post_user SET " +

				" ref_post_no = ?, ref_cp_no = ?, post_type_cd = ?, post_type_seq = ?, " +
				" title = ?, content = ?, " +
				" lst_no = ?, lst_date = SYSDATE(), lst_name = ?, lst_ref_cp_no = ?, lst_ref_cp_name = ? " +
				
				" WHERE post_no = ? ",

				refPostNo,
				refCpNo,
				postTypeCd,
				postTypeSeq,

				title,
				content,

				userNo,
				userName,
				cpNo,
				cpName,

				no
			)
		);

	} catch(Exception se) {
		results.put("error", se.getMessage());

	} finally {
		DbUtils.closeQuietly(conn);

	}

	out.print(gson.toJson(results));
%>