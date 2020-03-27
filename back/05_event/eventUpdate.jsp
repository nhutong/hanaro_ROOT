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
%><%@ include file = "auth.jsp" %><%-- 권한체크 --%><%

	Integer userNo = (Integer)session.getAttribute("userNo");			

  // 파라미터	
  	
	String eventTitle = request.getParameter("eventTitle") == null ? "" : request.getParameter("eventTitle").trim();
	String imgUrl = request.getParameter("imgUrl") == null ? "" : request.getParameter("imgUrl").trim();
	String detailImgUrl = request.getParameter("detailImgUrl") == null ? "" : request.getParameter("detailImgUrl").trim();	
	String startDate = request.getParameter("eventStartDate") ==  null ? "2019-01-01" : request.getParameter("eventStartDate").trim();
	String endDate = request.getParameter("eventEndDate") == null ? "2025-12-31" : request.getParameter("eventEndDate").trim();
//	String company = request.getParameter("company") == null ? "" : request.getParameter("company").trim();
	String activated = request.getParameter("activated") == null ? "" : request.getParameter("activated").trim();
	String linkUrl = request.getParameter("linkUrl") == null ? "" : request.getParameter("linkUrl").trim();
	String eventLink = request.getParameter("eventLink") == null ? "" : request.getParameter("eventLink").trim();
	String eventNo = request.getParameter("eventNo") == null ? "" : request.getParameter("eventNo");

	if("".equals(eventNo)){
		results.put("error", "event no 가 없습니다.");
		out.print(gson.toJson(results));
		return;
	}

 	try {
		QueryRunner queryRunner = new QueryRunner();
	
		// (update)
		String query =  " UPDATE hanaro.vm_event " + 
						" SET event_title = ? , "+ 
						"     img_url = ? , "+
						"     detail_img_url = ?, " + 
						"     lst_no = ? , " + 
						"     lst_date = now(), "+ 
						"     start_date = ? , " + 
						"     end_date =?, "+ 
						"     activated = ? , " + 
						"	  link_url = ? ," +
						"	  eventLink = ? " +
						" WHERE event_no = ? " ;		
			
		int result = queryRunner.update(
				conn,
				query,
				eventTitle,
				imgUrl,
				detailImgUrl,				
				userNo,				
				startDate,
				endDate,				
				activated,
				linkUrl,
			    eventLink,
				eventNo 				
			);
		
		results.put("update", result);

	} catch(Exception se) {
		results.put("error", se.getMessage());

	} finally {
		DbUtils.closeQuietly(conn);

	}

	out.print(gson.toJson(results));
%>
