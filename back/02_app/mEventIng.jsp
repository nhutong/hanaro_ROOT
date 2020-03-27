<%@ page contentType = "text/html;charset=utf-8" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="java.util.*" %>
<%@ page import="org.json.simple.*" %>
<%@ page import="java.sql.*" %>
<%@ page import="java.text.*" %>

<%@ include file = "../00_include/dbConn.jsp" %>

<%	
	String userCompanyNo = (request.getParameter("userCompanyNo")==null)? "0":request.getParameter("userCompanyNo");

	JSONObject bdListJSON = new JSONObject();
	
	try{
	
		sql = " SELECT a.event_no, a.event_title, a.img_url, left(a.start_date,10) AS start_date, "
             +" left(a.end_date,10) AS end_date, a.detail_img_url, a.link_url, ifnull(a.eventLink,'N') as eventLink FROM vm_event AS a WHERE a.activated = 'Y' "
			 +" and left(a.start_date,10) <= left(now(),10) "
			 +" and left(a.end_date,10) >= left(now(),10) "
			 +" and a.company = "+userCompanyNo+" order by a.end_date desc ";

		stmt = conn.createStatement();
		rs = stmt.executeQuery(sql);
		
		rs.last();
		int listCount = rs.getRow();
		if(listCount == 0){
			out.clear();
			out.print("NoN");
			return;
		};
		rs.beforeFirst();
		
		JSONArray arr = new JSONArray();		
		while(rs.next()){
			
			String event_no = rs.getString("event_no");   // 전단 번호
			String event_title = rs.getString("event_title");   // 전단배너 번호
			String img_url = rs.getString("img_url");   // 전단배너 번호
			String start_date = rs.getString("start_date");   // 전단배너 번호
			String end_date = rs.getString("end_date");   // 전단배너 번호
			String detail_img_url = rs.getString("detail_img_url");   // 전단배너 번호
			String link_url = rs.getString("link_url");   // 전단배너 번호
			String eventLink = rs.getString("eventLink"); 
			
			JSONObject obj = new JSONObject();
						
			obj.put("event_no", event_no);
			obj.put("event_title", event_title);
			obj.put("img_url", img_url);
			obj.put("start_date", start_date);
			obj.put("end_date", end_date);
			obj.put("detail_img_url", detail_img_url);
			obj.put("link_url", link_url);
			obj.put("eventLink", eventLink);
			
			if(obj != null){
				arr.add(obj);
			}
		};

		bdListJSON.put("BannerList", arr);
		out.clear();
		out.print(bdListJSON);
	
	}catch(Exception e){
		out.print("'exception error");	
	}finally{
		if(stmt != null) try{ stmt.close(); }catch(SQLException sqle) {};
		if(conn != null) try{ conn.close(); }catch(SQLException sqle) {};
	};
	
%>