<%@ page contentType = "text/html;charset=utf-8" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="java.util.*" %>
<%@ page import="org.json.simple.*" %>
<%@ page import="java.sql.*" %>
<%@ page import="java.text.*" %>

<%@ include file = "../00_include/dbConn.jsp" %>

<%	
	String longtitude = (request.getParameter("longtitude")==null)? "0":request.getParameter("longtitude");
    String latitude = (request.getParameter("latitude")==null)? "0":request.getParameter("latitude");
	String userRoleCd = (String)session.getAttribute("userRoleCd");

	double lati = Double.parseDouble(latitude);
	double longti = Double.parseDouble(longtitude);

	JSONObject bdListJSON = new JSONObject();
	
	try{

		if ( longtitude.equals("0") ){
			sql = " SELECT a.VM_CP_NO, a.VM_CP_NAME, a.VM_TEL, a.lat, a.lng, a.VM_delivery_FG, a.VM_START_TIME, a.VM_END_TIME, a.VM_OFF_NOTE, concat(a.vm_address1, a.vm_address2) as vm_address "
			     +" FROM vm_company AS a WHERE a.VM_CP_NO <> 0 "
				 + "ROLE1".equals(userRoleCd) ? "" : " AND a.VM_CP_NO <> 25 "
				 +" and a.VM_sales_FG = 'Y' order by a.vm_cp_name asc ; "; 
		}else{
			sql = " SELECT a.VM_CP_NO, a.VM_CP_NAME, a.VM_TEL, a.lat, a.lng, a.VM_delivery_FG, a.VM_START_TIME, a.VM_END_TIME, a.VM_OFF_NOTE, concat(a.vm_address1, a.vm_address2) as vm_address "
			     +"FROM vm_company AS a WHERE a.VM_CP_NO <> 0 and a.VM_sales_FG = 'Y' "
				 + "ROLE1".equals(userRoleCd) ? "" : " AND a.VM_CP_NO <> 25 "
			     +" order by ((a.lng - "+longti+")*(a.lng - "+longti+") + (a.lat - "+lati+")*(a.lat - "+lati+")) asc, a.vm_cp_name asc ; ";
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
			
			String VM_CP_NO   = rs.getString("VM_CP_NO");        // 긴급공지번호
			String VM_CP_NAME = rs.getString("VM_CP_NAME");   // 긴급공지내용
			String VM_TEL = rs.getString("VM_TEL");   // 긴급공지내용
			String lat = rs.getString("lat");   // 긴급공지내용
			String lng = rs.getString("lng");   // 긴급공지내용
			String VM_delivery_FG = rs.getString("VM_delivery_FG"); 

			String VM_START_TIME = rs.getString("VM_START_TIME");
			String VM_END_TIME = rs.getString("VM_END_TIME");
			String VM_OFF_NOTE = rs.getString("VM_OFF_NOTE");
			String VM_ADDRESS = rs.getString("vm_address");
			
			JSONObject obj = new JSONObject();
						
			obj.put("VM_CP_NO", VM_CP_NO);
			obj.put("VM_CP_NAME", VM_CP_NAME);
			obj.put("VM_TEL", VM_TEL);
			obj.put("lat", lat);
			obj.put("lng", lng);
			obj.put("VM_delivery_FG", VM_delivery_FG);

			obj.put("VM_START_TIME", VM_START_TIME);
			obj.put("VM_END_TIME", VM_END_TIME);
			obj.put("VM_OFF_NOTE", VM_OFF_NOTE);
			obj.put("VM_ADDRESS", VM_ADDRESS);

			if(obj != null){
				arr.add(obj);
			}
		};

		bdListJSON.put("CompanyList", arr);
		out.clear();
		out.print(bdListJSON);
	
	}catch(Exception e){
		out.clear();
		out.print("'exception error");	
	}finally{
		if(stmt != null) try{ stmt.close(); }catch(SQLException sqle) {};
		if(conn != null) try{ conn.close(); }catch(SQLException sqle) {};
	};
	
%>