<%@ page contentType = "text/html;charset=utf-8" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="java.util.*" %>
<%@ page import="org.json.simple.*" %>
<%@ page import="java.sql.*" %>
<%@ page import="java.text.*" %>

<%@ include file = "../00_include/dbConn.jsp" %>

<%	
	String searchText = (request.getParameter("searchText")==null)? "0":request.getParameter("searchText");
	String pageNo = (request.getParameter("pageNo")==null)? "0":request.getParameter("pageNo");
	Integer pageNo_new;

//	mariadb의 페이징 시작 쿼리를 위해 1을 뺀다.
	pageNo_new = Integer.parseInt(pageNo) - 1;
	pageNo_new = pageNo_new * 20;

	JSONObject bdListJSON = new JSONObject();
	
	try{

        sql = " SELECT a.LST_UPDATE_DATE, a.session_id_name, ifnull(b.vm_name, '' ) as name, a.PAGE_NAME "
			+ " from eb_page_contact_log AS a "
			+ " left outer join vm_user as b on a.session_id_name = b.vm_no "
			//+ " WHERE LEFT(a.LST_UPDATE_DATE,10) >= date_add(now(),INTERVAL -14 DAY)
			+ " order by a.LST_UPDATE_DATE desc "
			+ " LIMIT "+pageNo_new+" ,20; "; 
	
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
			
			String LST_UPDATE_DATE   = rs.getString("LST_UPDATE_DATE");        // 긴급공지번호
			String name = rs.getString("name");   // 긴급공지내용
			String PAGE_NAME = rs.getString("PAGE_NAME");   // 긴급공지내용
			String session_id_name = rs.getString("session_id_name");   // 긴급공지내용
			
			JSONObject obj = new JSONObject();
						
			obj.put("LST_UPDATE_DATE", LST_UPDATE_DATE);
			obj.put("name", name);
			obj.put("PAGE_NAME", PAGE_NAME);
			obj.put("session_id_name", session_id_name);

			if(obj != null){
				arr.add(obj);
			}
		};

		bdListJSON.put("CompanyList", arr);
		out.clear();
		out.print(bdListJSON);
	
	}catch(Exception e){
		out.clear();
		out.print("exception error");	
	}finally{
		if(stmt != null) try{ stmt.close(); }catch(SQLException sqle) {};
		if(conn != null) try{ conn.close(); }catch(SQLException sqle) {};
	};
	
%>