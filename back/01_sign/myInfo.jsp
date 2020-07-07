<%@ page contentType = "text/html;charset=utf-8" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="java.util.*" %>
<%@ page import="org.json.simple.*" %>
<%@ page import="java.sql.*" %>
<%@ page import="java.text.*" %>

<%@ include file = "../00_include/dbConn.jsp" %>

<%	
	String memberNo = (request.getParameter("memberNo")==null)? "":request.getParameter("memberNo");

	JSONObject bdListJSON = new JSONObject();
	
	try{

        sql = " SELECT no as member_no, ifnull(a.name,'') as name, ifnull(a.tel,'') as tel, ifnull(a.address1,'') as address1, ifnull(a.address2,'') as address2 FROM vm_member AS a WHERE a.no = "+memberNo; 
	
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
			
			String name   = rs.getString("name");        // 긴급공지번호
			String tel = rs.getString("tel");   // 긴급공지내용
			String address1 = rs.getString("address1");   // 긴급공지내용
			String address2 = rs.getString("address2");   // 긴급공지내용
			String member_no = rs.getString("member_no");   // 긴급공지내용
			
			JSONObject obj = new JSONObject();
						
			obj.put("name", name);
			obj.put("tel", tel);
			obj.put("address1", address1);
			obj.put("address2", address2);
			obj.put("member_no", member_no);

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