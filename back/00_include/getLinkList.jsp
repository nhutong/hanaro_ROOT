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
    
    String companyNo = request.getParameter("companyNo") == null ? "" : request.getParameter("companyNo").trim();
	
 	try {
		QueryRunner queryRunner = new QueryRunner();
		
        String query =  " SELECT concat(b.menu_name, ' ', date_format(a.from_date,'%y/%m/%d'),' ~ ',date_format(a.to_date,'%m/%d')) AS select_name, "
                       +" CONCAT('m_leaflet/m_leaflet.html?vm_cp_no=',a.ref_company_no,'&menu_no=',a.menu_no,'&jd_no=',a.jd_no) AS select_value "
                       +" FROM vm_jundan as a "
                       +" inner join vm_menu AS b on a.menu_no = b.menu_no "
                       +" inner join vm_company AS c ON a.ref_company_no = c.vm_cp_no "
                       +" WHERE a.ref_company_no = "+companyNo
					   +" AND a.to_date >= curdate()"
					   // 2020.07.01 심규문 
                       //+" AND a.from_date >= date_add(now(), INTERVAL -2 WEEK) "
                       //+" AND a.to_date <= date_add(now(), INTERVAL 2 WEEK) "
                       +" ORDER BY select_name; ";

		results.put("list", 
			queryRunner.query(
				conn,
				query, 
                new MapListHandler()
			)
        );
        

	} catch(Exception se) {
		results.put("error", se.getMessage());

	} finally {
		DbUtils.closeQuietly(conn);
        out.print(gson.toJson(results));
	}
%>
