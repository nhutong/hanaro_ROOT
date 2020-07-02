<%@ page contentType = "text/html;charset=utf-8" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="java.util.*" %>
<%@ page import="org.json.simple.*" %>
<%@ page import="java.sql.*" %>
<%@ page import="java.text.*" %>

<%@ include file = "../00_include/dbPoolingConn.jsp" %>

<%	
	String searchText = (request.getParameter("searchText")==null)? "0":request.getParameter("searchText");
	searchText = searchText.trim();

	JSONObject bdListJSON = new JSONObject();
	
	try{

	    sql = "SELECT max(k.img_no) as img_no, "
			+" k.img_path "
			+" FROM ( "
			+" SELECT a.img_no, a.img_path "
			+" FROM vm_product_image AS a "
			+" WHERE a.group_tag LIKE '%"+searchText+"%' and a.img_path <> '' and a.std_fg = 'Y' "
			+" union "
			+" SELECT a.img_no, a.img_path "
			+" FROM vm_product_image AS a "
			+" INNER JOIN vm_product AS b "
			+" ON a.ref_pd_no = b.pd_no "
			+" WHERE b.pd_name LIKE '%"+searchText+"%' and a.img_path <> '' and a.std_fg = 'Y' "
			+" ) AS k "
			+" GROUP BY k.img_path; ";
out.print(sql);	
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
			
			String img_no   = rs.getString("img_no");     // 판매장번호
			String img_path = rs.getString("img_path");   // 판매장명
			
			JSONObject obj = new JSONObject();
						
			obj.put("img_no", img_no);
			obj.put("img_path", img_path);

			if(obj != null){
				arr.add(obj);
			}
		};

		bdListJSON.put("imgList", arr);
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