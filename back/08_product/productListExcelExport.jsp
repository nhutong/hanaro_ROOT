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

    int pageNumber = Integer.parseInt(request.getParameter("pageNumber") == null ? "1" : request.getParameter("pageNumber").trim(), 10);
    int pageSize = Integer.parseInt(request.getParameter("pageSize") == null ? "8" : request.getParameter("pageSize").trim(), 10);
    String keyword1 = request.getParameter("keyword1") == null ? "" : request.getParameter("keyword1").trim() ;
    String keyword2 = request.getParameter("keyword2") == null ? "" : request.getParameter("keyword2").trim() ;
    String keyword3 = request.getParameter("keyword3") == null ? "" : request.getParameter("keyword3").trim() ;

	int offset = pageSize * (pageNumber - 1);
	int rowCount = pageSize;
 
 	try {
		QueryRunner queryRunner = new QueryRunner();

        // 리스트 조회
        String queryList = " SELECT a.pd_no, a.pd_name, a.pd_code, a.group_tag, " //a.reg_no, a.reg_date, a.lst_no, a.lst_date, "
            + " ifnull(bb.pd_code_cnt,0) AS pd_code_cnt, ifnull(cc.group_tag_cnt,0) AS group_tag_cnt "
            + " from vm_product a "
            + " LEFT OUTER JOIN ( "
            + "     SELECT b.pd_code, COUNT(b.img_no) pd_code_cnt "
            + "     from vm_product_image AS b "
            + "     WHERE b.pd_code IS NOT NULL "
            + "     AND b.pd_code != '' "
            + "     and b.group_tag IS NOT NULL "
            + "     AND b.group_tag != '' "
            + "     AND b.std_fg = 'Y' "
            + "     GROUP BY b.pd_code "
            + " ) bb ON a.pd_code = bb.pd_code "
            + " LEFT OUTER JOIN ( "
            + "     SELECT c.group_tag, COUNT(c.img_no) as group_tag_cnt "
            + "     FROM vm_product_image c "
            + "     WHERE c.pd_code IS NOT NULL "
            + "     AND c.pd_code != '' "
            + "     and c.group_tag IS NOT NULL "
            + "     AND c.group_tag != '' "
            + "     AND c.std_fg = 'Y' "
            + "     GROUP BY c.group_tag "
            + " ) cc ON a.group_tag = cc.group_tag "
            + " WHERE 1 = 1 "
            + " ORDER BY a.pd_no "
            + " LIMIT ?, ?; ";
     
		Object[] paramList = new Object[]{ offset, rowCount};

		results.put("list", 
			queryRunner.query(
				conn,
				queryList,
				new MapListHandler(),
				paramList
			)
		);

	} catch(Exception e) {
		results.put("exception error", e.getMessage());

	} finally {
		DbUtils.closeQuietly(conn);

	}

	out.print(gson.toJson(results));
%>
