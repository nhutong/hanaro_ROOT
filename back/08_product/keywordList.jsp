<%@ page contentType = "text/html;charset=utf-8" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="java.util.*" %>
<%@ page import="org.json.simple.*" %>
<%@ page import="java.sql.*" %>
<%@ page import="java.text.*" %>

<%@ include file = "../00_include/dbPoolingConn.jsp" %>

<%	
	String keyword = (request.getParameter("keyword")==null)? "0":request.getParameter("keyword");

	JSONObject bdListJSON = new JSONObject();
	
	try{

	sql = " select distinct a.group_tag "
	    + " from vm_product AS a "  
	    + " WHERE a.pd_code IS NOT null "
	    + " AND a.pd_code <> 'blank' ";
		
		if (keyword != ""){
           sql = sql + " and a.group_tag like '%"+keyword+"%' ";
		}else{
		   sql = sql + " ";
		}
	
		sql = sql + " order by a.group_tag asc; ";

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
			
			String group_tag   = rs.getString("group_tag");   // 판매장명		
			
			JSONObject obj = new JSONObject();
						
			obj.put("group_tag", group_tag);

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