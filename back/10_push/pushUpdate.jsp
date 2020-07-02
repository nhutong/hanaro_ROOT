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

<%@ include file = "../00_include/dbPoolingConn.jsp" %>

<%	
	// https://stackoverflow.com/a/27669890
	// Apache Commons DbUtils : https://commons.apache.org/proper/commons-dbutils/
	// Gson : https://github.com/google/gson
	Gson gson = new GsonBuilder().serializeNulls().create();

	Map<String, Object> results = new HashMap<>();

	// 본사관리자(ROLE1), 판매장관리자(ROLE2) 만 접근가능
	String requiredRoles = "ROLE1,ROLE2";
%><%@ include file = "../01_sign/auth.jsp" %><%-- 권한체크 --%><%

	Integer userNo = (Integer)session.getAttribute("userNo");			

        
    // 파라미터	  	
    String pm_no = request.getParameter("pm_no") == null ? "" : request.getParameter("pm_no").trim();

	String pushTopTxt = request.getParameter("pushTopTxt") == null ? "" : request.getParameter("pushTopTxt").trim();
	String vm_cp_no = request.getParameter("vm_cp_no") == null ? "" : request.getParameter("vm_cp_no").trim();	
	String event_no = request.getParameter("event_no") ==  null ? "" : request.getParameter("event_no").trim();
	String reg_no = request.getParameter("reg_no") == null ? "" : request.getParameter("reg_no").trim();
	String pushSendHr = request.getParameter("pushSendHr") == null ? "" : request.getParameter("pushSendHr").trim();
	String pushSendMin = request.getParameter("pushSendMin") == null ? "" : request.getParameter("pushSendMin").trim();
	String pm_img_path = request.getParameter("pm_img_path") == null ? "" : request.getParameter("pm_img_path").trim();
	String pushSendFromDate = request.getParameter("pushSendFromDate") == null ? "" : request.getParameter("pushSendFromDate").trim();
	String pushSendToDate = request.getParameter("pushSendToDate") == null ? "" : request.getParameter("pushSendToDate").trim();
	String pushInterval = request.getParameter("pushInterval") == null ? "" : request.getParameter("pushInterval").trim();
	String pushTarget = request.getParameter("pushTarget") == null ? "" : request.getParameter("pushTarget").trim();
	String pushType = request.getParameter("pushType") == null ? "" : request.getParameter("pushType").trim();
    String pushDel = request.getParameter("pushDel") == null ? "N" : request.getParameter("pushDel").trim();
    String pushStatus = request.getParameter("pushStatus") == null ? "N" : request.getParameter("pushStatus").trim();

 	try {
		QueryRunner queryRunner = new QueryRunner();

		// 관리자 등록 (insert)
		String query = "  UPDATE vm_push_message " + 
					   " SET ms_content= ?, vm_cp_no= ? , event_no=?, reg_no= ? ,  " +
					   " reg_date= now(), pm_hour= ?, pm_min= ?, pm_img_path= ?,  " +
					   " pm_from_date= ? , pm_to_date= ? , pm_interval= ?, pm_target= ? , pm_type = ?, del_fg = ?, pm_status = ? " +
					   "  WHERE pm_no= ? " ;
				
		int result = queryRunner.update(
                    conn,
                    query,		            
                    pushTopTxt,
                    vm_cp_no,						
                    event_no,
                    reg_no,
                    pushSendHr,						
                    pushSendMin,
                    pm_img_path,
                    pushSendFromDate,
                    pushSendToDate, 
                    pushInterval, 
                    pushTarget, 
                    pushType, 
                    pushDel, 
                    pushStatus,
                    pm_no
					);

		results.put("update", result);

	} catch(Exception se) {
		results.put("error", se.getMessage());

	} finally {
		DbUtils.closeQuietly(conn);

	}

	out.print(gson.toJson(results));
%>
