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

	// 본사관리자(ROLE1), 판매장관리자(ROLE2) 만 접근가능
	String requiredRoles = "ROLE1,ROLE2";
%><%@ include file = "../01_sign/auth.jsp" %><%-- 권한체크 --%><%

	Integer userNo = (Integer)session.getAttribute("userNo");			

  // 파라미터	
  	String popupNo = request.getParameter("popupNo") == null ? "" : request.getParameter("popupNo").trim();

	if("".equals(popupNo)){
		results.put("error", "popup no 가 없습니다.");
	}

	String popupTitle = request.getParameter("popupTitle") == null ? "" : request.getParameter("popupTitle").trim();
	String imgUrl = request.getParameter("imgUrl") == null ? "" : request.getParameter("imgUrl").trim();
	String periodType = request.getParameter("popupDateType") == null ? "" : request.getParameter("popupDateType").trim();
	String startDate = request.getParameter("popupDateFrom") ==  null ? "2019-01-01" : request.getParameter("popupDateFrom").trim();
	String endDate = request.getParameter("popupDateEnd") == null ? "2025-12-31" : request.getParameter("popupDateEnd").trim();
	String company = request.getParameter("company") == null ? "" : request.getParameter("company").trim();
	String showFlag = request.getParameter("showFlag") == null ? "" : request.getParameter("showFlag").trim();
	String popuplink = request.getParameter("popuplink") == null ? "" : request.getParameter("popuplink").trim();
	String linkUrl = request.getParameter("linkUrl") == null ? "" : request.getParameter("linkUrl").trim();


 	try {
		QueryRunner queryRunner = new QueryRunner();

		// 관리자 등록 (insert)
		String query =  " UPDATE hanaro.vm_popup " + 
						" SET popup_title = ?, " +
						" 	  img_url = ?, " + 
						" 	  company = ?, " + 
						" 	  lst_no = ?, " + 
						" 	  lst_date = now() , "+ 
						" 	  start_date = ? ," +
						" 	  end_date = ? ," +
						" 	  period_type = ? ," +
						" 	  show_flag = ? ," +
						" 	  popuplink = ? ," +
						" 	  link_url = ? " +
						" WHERE popup_no = ?" ;
				
		int result = queryRunner.update(
				conn,
				query,
				popupTitle,
				imgUrl,
				company,
				userNo,
				startDate,
				endDate,
				periodType,
				showFlag,
				popuplink,
				linkUrl,
				popupNo 				
			);
		results.put("update", result);

	} catch(Exception se) {
		results.put("error", se.getMessage());

	} finally {
		DbUtils.closeQuietly(conn);

	}

	out.print(gson.toJson(results));
%>
