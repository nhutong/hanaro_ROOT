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
		+ " p.post_no, p.content, a.vm_name, DATE_FORMAT(p.reg_date, '%Y-%m-%d') AS regDate, a.vm_no "
        + " FROM vm_notice AS p "
		+ " inner join vm_user as a "
		+ " on p.reg_no = a.vm_no "
        + " WHERE p.post_type_cd = 'COMMENT' "
		+ " and p.ref_post_no = '"+postNo+"' "
		+ " ORDER BY lst_date DESC ";

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
			
			Integer post_no     = Integer.parseInt(rs.getString("post_no")); 
			String content   = rs.getString("content");     // 판매장번호
			String vm_name   = rs.getString("vm_name");   // 판매장명
			String regDate   = rs.getString("regDate");   // 판매장명
			String vm_no   = rs.getString("vm_no");
			
			JSONObject obj = new JSONObject();
						
			obj.put("post_no", post_no);
			obj.put("content", content);
			obj.put("vm_name", vm_name);
			obj.put("regDate", regDate);
			obj.put("vm_no", vm_no);

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