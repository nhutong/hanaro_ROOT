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
        String queryList = " SELECT replace(concat(mid(b.start_date,6,5),'~',mid(b.end_date,6,5)),'-','/') as cp_date, "
            + " date_format( case when ifnull(a.staff_cert_fg,'N') = 'Y' then staff_cert_date ELSE a.reg_date END ,'%Y/%m/%d %H:%i:%S') AS std_date, "
			+ " c.VM_CP_NAME, d.tel, d.`no` AS mem_no, b.coupon_code, ifnull(a.staff_cert_fg,'N') as staff_cert_fg "
			+ " from vm_member_coupon AS a "
			+ " INNER JOIN vm_coupon AS b "
			+ " ON a.coupon_no = b.coupon_no "
			+ " INNER JOIN vm_company AS c "
			+ " ON b.company_no = c.VM_CP_NO "
			+ " left outer JOIN vm_member AS d "
			+ " ON a.member_no = d.`no` "
			+ " where c.vm_cp_no = ? "
			//+ "   and ( left(b.start_date,10) <= left( ? , 10) AND left(b.end_date,10) >= left( ? , 10) ) "
			// 조회조건 변경 20200612 김중백
			+ "   and (( left(b.start_date,10) >= left( ? , 10) AND left(b.start_date,10) <= left( ? , 10) ) "
			+ "   or ( left(b.end_date,10) >= left( ? , 10) AND left(b.end_date,10) <= left( ? , 10) )) "
            + " order by a.reg_date desc "
            + " LIMIT ?, ? ; ";
                        
		//Object[] paramList = new Object[]{ keyword1, keyword2, keyword3, offset, rowCount}; 조회조건 변경 20200612
		Object[] paramList = new Object[]{ keyword1, keyword2, keyword3, keyword2, keyword3, offset, rowCount};

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
