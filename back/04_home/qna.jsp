<%@ page contentType = "text/html;charset=utf-8" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="java.util.*" %>
<%@ page import="org.json.simple.*" %>
<%@ page import="java.sql.*" %>
<%@ page import="java.text.*" %>

<%@ include file = "../00_include/dbConn.jsp" %>

<%	
	String memberNo = (request.getParameter("memberNo")==null)? "":request.getParameter("memberNo");
	String vm_cp_no = (request.getParameter("vm_cp_no")==null)? "0":request.getParameter("vm_cp_no");

	JSONObject bdListJSON = new JSONObject();
	
	try{

        sql = " SELECT a.nt_no, a.nt_title, a.nt_content, left(a.reg_date,10) as reg_date, ifnull(ref_nt_no,'') as ref_nt_no FROM vm_company_qna AS a " 
		    + " where a.reg_member_no = '" +memberNo+"' " 
			+ " and  a.vm_cp_no = " + Integer.parseInt(vm_cp_no)
			+ " order by reg_date desc "; 
	
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
			
			String nt_no   = rs.getString("nt_no");        // 긴급공지번호
			String nt_title = rs.getString("nt_title");   // 긴급공지내용
			String nt_content = rs.getString("nt_content");   // 긴급공지내용
			String reg_date = rs.getString("reg_date");   // 긴급공지내용
			String ref_nt_no = rs.getString("ref_nt_no");   // 긴급공지내용
			
			JSONObject obj = new JSONObject();
						
			obj.put("nt_no", nt_no);
			obj.put("nt_title", nt_title);
			obj.put("nt_content", nt_content);
			obj.put("reg_date", reg_date);
			obj.put("ref_nt_no", ref_nt_no);

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