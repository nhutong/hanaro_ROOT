<%@ page contentType = "text/html;charset=utf-8" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="java.util.*" %>
<%@ page import="org.json.simple.*" %>
<%@ page import="java.sql.*" %>
<%@ page import="java.text.*" %>

<%@ include file = "../00_include/dbConn.jsp" %>

<%	
	String groupTag = (request.getParameter("groupTag")==null)? "0":request.getParameter("groupTag");
	String pdCode = (request.getParameter("pdCode")==null)? "0":request.getParameter("pdCode");

	JSONObject bdListJSON = new JSONObject();
	
	try{

	if ( groupTag == "" ){
		sql = " select a.img_no, a.img_path from vm_product_image as a "
	     +" where a.pd_code = '"+pdCode+"' and a.std_fg = 'Y' ";
	}else{
		sql = " select a.img_no, a.img_path from vm_product_image as a "
	     +" where a.group_tag = '"+groupTag+"' and a.std_fg = 'Y' "
		 +" union "
		 +" select a.img_no, a.img_path from vm_product_image as a "
	     +" where a.pd_code = '"+pdCode+"' and a.std_fg = 'Y' ";
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
			
			Integer img_no     = Integer.parseInt(rs.getString("img_no")); 
			String img_path      = rs.getString("img_path"); 
			
			JSONObject obj = new JSONObject();
						
			obj.put("img_no", img_no);
			obj.put("img_path", img_path);

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