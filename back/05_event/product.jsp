<%@ page contentType = "text/html;charset=utf-8" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="java.util.*" %>
<%@ page import="org.json.simple.*" %>
<%@ page import="java.sql.*" %>
<%@ page import="java.text.*" %>

<%@ include file = "../00_include/dbPoolingConn.jsp" %>

<%	
	String product_code = (request.getParameter("product_code")==null)? "0":request.getParameter("product_code");

	JSONObject bdListJSON = new JSONObject();
	
	try{

	sql = " select a.pd_code, a.pd_name "
	    + " from vm_product AS a "
	    + " WHERE a.pd_code = '"+product_code+"'; ";
//		out.print(sql);

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
			
			String pd_code   = rs.getString("pd_code");     // 판매장번호
			String pd_name   = rs.getString("pd_name");   // 판매장명	
			
			JSONObject obj = new JSONObject();

			obj.put("pd_code", pd_code);
			obj.put("pd_name", pd_name);

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