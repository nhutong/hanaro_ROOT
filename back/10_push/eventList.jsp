<%@ page contentType = "text/html;charset=utf-8" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="java.util.*" %>
<%@ page import="org.json.simple.*" %>
<%@ page import="java.sql.*" %>
<%@ page import="java.text.*" %>

<%@ include file = "../00_include/dbPoolingConn.jsp" %>

<%	
	String userCompanyNo = (request.getParameter("userCompanyNo")==null)? "0":request.getParameter("userCompanyNo");

	JSONObject bdListJSON = new JSONObject();
	
	try{

		if (userCompanyNo.equals("0")){
           sql = " SELECT a.event_no, a.event_title, a.company from vm_event AS a ";
		}else{
		   sql = " SELECT a.event_no, a.event_title, a.company from vm_event AS a "
		   +" where company = "+userCompanyNo; 
		}
	
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
			
			String event_no   = rs.getString("event_no");     // 판매장번호
			String event_title = rs.getString("event_title");   // 판매장명
			String company = rs.getString("company");

			JSONObject obj = new JSONObject();
						
			obj.put("event_no", event_no);
			obj.put("event_title", event_title);
			obj.put("company", company);

			if(obj != null){
				arr.add(obj);
			}
		};

		bdListJSON.put("CompanyList", arr);
		//out.clear();
		out.print(bdListJSON);
	
	}catch(Exception e){
		out.clear();
		out.print("'exception error");	
	}finally{
		if(stmt != null) try{ stmt.close(); }catch(SQLException sqle) {};
		if(conn != null) try{ conn.close(); }catch(SQLException sqle) {};
	};
	
%>