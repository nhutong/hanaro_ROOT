<%@ page contentType = "text/html;charset=utf-8" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="java.net.URLDecoder" %>
<%@ page import="java.util.*" %>
<%@ page import="org.json.simple.*" %>
<%@ page import="java.sql.*" %>
<%@ page import="java.text.*" %>

<%@ include file = "../00_include/dbPoolingConn.jsp" %>
<%@ include file = "../00_include/common.jsp" %>


<%	
	String vm_cp_no = (request.getParameter("vm_cp_no")==null)? "0":request.getParameter("vm_cp_no");

	JSONObject bdListJSON = new JSONObject();
	
	try{

		sql = " SELECT a.round_id, delivery_start_time, delivery_end_time  "
		    +" FROM vm_delivery_round AS a "
			+" WHERE a.open_flag ='Y' and a.company_no = "+vm_cp_no+" order by delivery_start_time asc; ";

//	out.print(sql);
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

			String round_id				   = rs.getString("round_id");
			String delivery_start_time	   = rs.getString("delivery_start_time");
			String delivery_end_time	   = rs.getString("delivery_end_time");
			
			JSONObject obj = new JSONObject();
						
			obj.put("round_id", strDecode(round_id));
			obj.put("delivery_start_time", strDecode(delivery_start_time));
			obj.put("delivery_end_time", strDecode(delivery_end_time));
			
			if(obj != null){
				arr.add(obj);
			}
		};

		bdListJSON.put("PdContentList", arr);
		out.clear();
		out.print(bdListJSON);
	
	}catch(Exception e){
		out.print("exception error");	
	}finally{
		if(stmt != null) try{ stmt.close(); }catch(SQLException sqle) {};
		if(conn != null) try{ conn.close(); }catch(SQLException sqle) {};
	};
	
%>