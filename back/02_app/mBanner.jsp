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
	
		sql = " SELECT event_no, event_title, img_url, detail_img_url, company, banner_yn FROM vm_event t " +
			  " WHERE banner_yn = 'Y' AND activated = 'Y' AND company = " + userCompanyNo +
			  " AND date_format(end_date , 'Y%m%d%') < date_format(curdate(), 'Y%m%d%')" +   // 2020.06.25 / 심규문 / 스와이프 배너 활성 이벤트 기간 조건 추가
              " AND date_format(lst_date , 'Y%m%d%') >= date_format(curdate(), 'Y%m%d%')" +  // 2020.06.25 / 심규문 / 스와이프 배너 활성 이벤트 기간 조건 추가
			  " order by order_no asc; ";
	
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
			String detail_img_url = rs.getString("detail_img_url");   // 전단배너 번호
			String company = rs.getString("company");   // 전단배너 번호
			String banner_yn = rs.getString("banner_yn");   // 전단배너 번호
			
			JSONObject obj = new JSONObject();
						
			obj.put("event_no", event_no);
			obj.put("event_title", event_title);
			obj.put("img_url", img_url);
			obj.put("detail_img_url", detail_img_url);
			obj.put("company", company);
			obj.put("banner_yn", banner_yn);
			
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