<%@ page contentType = "text/html;charset=utf-8" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="java.util.*" %>
<%@ page import="org.json.simple.*" %>
<%@ page import="java.sql.*" %>
<%@ page import="java.text.*" %>

<%@ include file = "../00_include/dbConn.jsp" %>

<%	
	String userCompanyNo = (request.getParameter("userCompanyNo")==null)? "0":request.getParameter("userCompanyNo");
	String memberNo = (request.getParameter("memberNo")==null)? "":request.getParameter("memberNo");

	JSONObject bdListJSON = new JSONObject();
	
	try{
		
		sql = " SELECT a.stamp_no, left(a.start_date,10) as start_date, left(a.end_date,10) as end_date, b.ms_no "
			+" FROM vm_stamp AS a "
			+" left outer JOIN ( select ms_no, stamp_no from vm_member_stamp where no = '"+memberNo+"' ) AS b "
			+" ON a.stamp_no = b.stamp_no "
			+" WHERE a.company_no = "+userCompanyNo
			+" and a.status = 'Y' "
			+" and left(a.start_date,10) <= left(now(),10) and left(a.end_date,10) >= left(now(),10); ";

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
			
			String stamp_no = rs.getString("stamp_no");   // 전단 번호
			String start_date = rs.getString("start_date");   // 전단배너 번호
			String end_date = rs.getString("end_date");   // 전단배너 번호
			String ms_no = rs.getString("ms_no");   // 전단배너 번호
			
			JSONObject obj = new JSONObject();
						
			obj.put("stamp_no", stamp_no);
			obj.put("start_date", start_date);
			obj.put("end_date", end_date);
			obj.put("ms_no", ms_no);
			
			if(obj != null){
				arr.add(obj);
			}
		};

		bdListJSON.put("BannerList", arr);
		out.clear();
		out.print(bdListJSON);
	
	}catch(Exception e){
		out.print("exception error");	
	}finally{
		if(stmt != null) try{ stmt.close(); }catch(SQLException sqle) {};
		if(conn != null) try{ conn.close(); }catch(SQLException sqle) {};
	};
	
%>