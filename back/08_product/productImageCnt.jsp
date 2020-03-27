<%@ page contentType = "text/html;charset=utf-8" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="java.util.*" %>
<%@ page import="org.json.simple.*" %>
<%@ page import="java.sql.*" %>
<%@ page import="java.text.*" %>

<%@ include file = "../00_include/dbConn.jsp" %>

<%	
	String pdCode = (request.getParameter("pdCode")==null)? "0":request.getParameter("pdCode");

	JSONObject bdListJSON = new JSONObject();
	
	try{

	sql = " select count(a.img_no) as img_cnt from vm_product_image as a "
		+" where a.pd_code = '"+pdCode+"' and a.std_fg = 'Y'; ";

		//+" where a.group_tag = ( select group_tag from vm_product_image where pd_code = '"+pdCode+"') "
		//+" and a.pd_code = '"+pdCode+"'; ";

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
			
			Integer img_cnt     = Integer.parseInt(rs.getString("img_cnt")); 
			
			JSONObject obj = new JSONObject();
						
			obj.put("img_cnt", img_cnt);

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