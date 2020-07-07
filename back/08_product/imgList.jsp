<%@ page contentType = "text/html;charset=utf-8" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="java.util.*" %>
<%@ page import="org.json.simple.*" %>
<%@ page import="java.sql.*" %>
<%@ page import="java.text.*" %>

<%@ include file = "../00_include/dbConn.jsp" %>

<%	

	JSONObject bdListJSON = new JSONObject();
	
	try{

	sql = " SELECT a.img_no, a.img_path, a.pd_code, a.group_tag, "
	+ " group_concat(concat(b.pd_name,'(',b.pd_code,')') SEPARATOR ',') as pd_names"
	+ " from vm_product_image AS a "
	+ " left outer JOIN ( SELECT ba.pd_no, ba.pd_name, ba.pd_code from vm_product AS ba ) AS b "
	+ " ON a.pd_code = b.pd_code "
	+ " WHERE a.std_fg <> 'Y' "
	+ " GROUP BY a.img_no; ";
//	+ " limit 0, 20; ";

//		out.print(sql);
		System.out.println(sql);
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
			String img_path   = rs.getString("img_path");     // 판매장번호
			String pd_code   = rs.getString("pd_code");   // 판매장명
			String group_tag   = rs.getString("group_tag");   // 판매장명		
			String pd_names   = rs.getString("pd_names");   // 판매장명		
			
			JSONObject obj = new JSONObject();
						
			obj.put("img_no", img_no);
			obj.put("img_path", img_path);
			obj.put("pd_code", pd_code);
			obj.put("group_tag", group_tag);
			obj.put("pd_names", pd_names);


			if(obj != null){
				arr.add(obj);
			}
		};

		bdListJSON.put("CompanyList", arr);
//		out.clear();
		out.print(bdListJSON);
	
	}catch(Exception e){
//		out.clear();
		out.print("exception error");	
	}finally{
		if(stmt != null) try{ stmt.close(); }catch(SQLException sqle) {};
		if(conn != null) try{ conn.close(); }catch(SQLException sqle) {};
	};
	
%>