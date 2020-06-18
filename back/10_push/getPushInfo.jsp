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

	// 본사관리자(ROLE1), 판매장관리자(ROLE2) 접근가능
	String requiredRoles = "ROLE1,ROLE2";
%><%@ include file = "../01_sign/auth.jsp" %><%-- 권한체크 --%><%
	
	String pm_no = request.getParameter("pm_no") == null ? "" : request.getParameter("pm_no");
 
 	try {
		QueryRunner queryRunner = new QueryRunner();

		// 리스트 조회 
        String queryList =
            " select pm_no, ms_content, vm_cp_no, event_no, reg_no, reg_date, LPAD(pm_hour,2,'0') as pm_hour, LPAD(pm_min,2,'0') as pm_min, pm_img_path, DATE_FORMAT(pm_from_date,'%Y-%m-%d') as pm_from_date, DATE_FORMAT(pm_to_date,'%Y-%m-%d') as pm_to_date, pm_interval, pm_target, pm_type, del_fg "+
            " from vm_push_message "+
            " where pm_no = ? ;";

		Object[] paramList = new Object[]{ pm_no } ;

		results.put("list", 
			queryRunner.query(
				conn,
				queryList,
				new MapListHandler(),
				paramList
			)
        );
        
		// 리스트 조회 
        String queryTotal =
            " select count(pmt_no) as pmt_no_cnt "+
            " from vm_push_message_target "+
            " where pm_no = ? ;";

        //Object[] paramList = new Object[]{ pm_no } ;

        results.put("total", 
            queryRunner.query(
                conn,
                queryTotal,
                new ScalarHandler<Integer>(),
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
