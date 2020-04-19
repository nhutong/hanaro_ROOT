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
	String requiredRoles = "ROLE1,ROLE2";
%><%@ include file = "../01_sign/auth.jsp" %><%-- 권한체크 --%><%
	
	//int userCompanyNo = (Integer)session.getAttribute("userCompanyNo");
    //페이징 
	int pageSize = 8;
	int pageNumber = 1;
    String eventNo = "";
    String userCompanyNo = "";
    String menuNo = "";
	
	try {
		pageNumber = Integer.parseInt(request.getParameter("pageNumber") == null ? "1" : request.getParameter("pageNumber").trim(), 10);
		pageSize = Integer.parseInt(request.getParameter("pageSize") == null ? "8" : request.getParameter("pageSize").trim(), 10);
        eventNo = request.getParameter("eventNo") == null ? "" : request.getParameter("eventNo");	
		userCompanyNo = request.getParameter("userCompanyNo") == null ? "" : request.getParameter("userCompanyNo").trim();
        menuNo = request.getParameter("menuNo") == null ? "" : request.getParameter("menuNo").trim();        	    
	} catch(NumberFormatException nfe) {
	}

	int offset = pageSize * (pageNumber - 1);
	int rowCount = pageSize;
 
 	try {
		QueryRunner queryRunner = new QueryRunner();

		// 전체 건수 조회 (일반 게시물)
		String queryTotal =
			 " SELECT COUNT(*) AS count "
            +"   FROM vm_jundan "
            +"  WHERE ref_company_no = "+userCompanyNo
            +"    AND menu_no ="+menuNo+"; ";
			//("ROLE1".equals(userRoleCd) ? " WHERE 1=1" : "WHERE company = " + userCompanyNo ) +	
			//("".equals(eventNo) ? "" : " AND event_no = " + eventNo ) ;

		results.put("total", 
			queryRunner.query(
				conn,
				queryTotal,
				new ScalarHandler<Integer>()				
			)
		);

		// 리스트 조회 
		String queryList = " select a.jd_no, concat(date_format(a.from_date,'%y/%m/%d'),' ~ ',date_format(a.to_date,'%m/%d')) AS period "
            +" , ( SELECT count(d.jb_no) FROM vm_jundan_banner AS d where a.jd_no = d.ref_jd_no AND d.visible_fg = 'Y' ) AS banner_cnt "
            +" , ( SELECT count(e.jd_prod_con_no) FROM vm_jundan_prod_content AS e where a.jd_no = e.ref_jd_no ) AS prod_content_cnt "
            +" , ifnull(shorten_url,'') as shorten_url "
            +" FROM vm_jundan as a "
            +" inner join vm_menu AS b on a.menu_no = b.menu_no "
            +" inner join vm_company AS c ON a.ref_company_no = c.vm_cp_no "
            +" WHERE a.ref_company_no = "+userCompanyNo
            +" AND a.menu_no = "+menuNo
            +" AND a.from_date >= date_add(now(), INTERVAL -2 WEEK) "
            +" AND a.to_date <= date_add(now(), INTERVAL 2 WEEK) "
            +" ORDER BY a.from_date "
			+" limit ?,? ; ";

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
