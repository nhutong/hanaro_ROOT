<%@ page contentType = "text/html;charset=utf-8" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="java.util.*" %>
<%@ page import="org.json.simple.*" %>
<%@ page import="java.sql.*" %>
<%@ page import="java.text.*" %>

<%@ include file = "../00_include/dbConn.jsp" %>

<%	
	String postNo = (request.getParameter("postNo")==null)? "0":request.getParameter("postNo");

	JSONObject bdListJSON = new JSONObject();
	
	try{

	sql = " SELECT "
		+ " p.post_no, p.title, p.content, a.vm_name, DATE_FORMAT(p.reg_date, '%Y-%m-%d') AS regDate, p.view_count, a.vm_no, p.post_type_cd "
        + " FROM vm_notice AS p "
		+ " inner join vm_user as a "
		+ " on p.reg_no = a.vm_no "
        + " WHERE p.post_no = '"+postNo+"' ";   

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

		Integer view_count = 0;
		Integer post_no_new = 0;
		String title = "";
		String vm_name = "";
		String regDate = "";
		String content = "";
		Integer vm_no = 0;
		String post_type_cd = "";

		JSONArray arr = new JSONArray();		
		while(rs.next()){
			
			post_no_new     = Integer.parseInt(rs.getString("post_no")); 
			title   = rs.getString("title");     // 판매장번호
			vm_name   = rs.getString("vm_name");   // 판매장명
			regDate   = rs.getString("regDate");   // 판매장명
			content   = rs.getString("content");   // 판매장명
			view_count   = Integer.parseInt(rs.getString("view_count"))+1; 
			vm_no     = Integer.parseInt(rs.getString("vm_no"));
			post_type_cd   = rs.getString("post_type_cd"); 

			JSONObject obj = new JSONObject();
						
			obj.put("post_no", post_no_new);
			obj.put("title", title);
			obj.put("vm_name", vm_name);
			obj.put("regDate", regDate);
			obj.put("content", content);
			obj.put("vm_no", vm_no);
			obj.put("post_type_cd", post_type_cd);

			if(obj != null){
				arr.add(obj);
			}
		};

		bdListJSON.put("CompanyList", arr);
		out.clear();
		out.print(bdListJSON);
	
		
		sql = "update vm_notice set view_count = "+view_count+" where post_no = "+post_no_new;
	
		pstmt = conn.prepareStatement(sql);
		pstmt.executeUpdate();



	}catch(Exception e){
		out.clear();
		out.print("exception error");	
	}finally{
		if(stmt != null) try{ stmt.close(); }catch(SQLException sqle) {};
		if(conn != null) try{ conn.close(); }catch(SQLException sqle) {};
	};
	
%>