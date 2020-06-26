<%@ page contentType = "text/html;charset=utf-8" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="java.util.*" %>
<%@ page import="org.json.simple.*" %>
<%@ page import="java.sql.*" %>
<%@ page import="java.text.*" %>

<%@ include file = "../00_include/dbConn.jsp" %>

<%	
	String vm_cp_no = (request.getParameter("vm_cp_no")==null)? "0":request.getParameter("vm_cp_no");
	String pageNo = (request.getParameter("pageNo")==null)? "":request.getParameter("pageNo");
	Integer pageNo_new;

	//mariadb의 페이징 시작 쿼리를 위해 1을 뺀다.
	pageNo_new = Integer.parseInt(pageNo) - 1;
	pageNo_new = pageNo_new * 10;

	JSONObject bdListJSON = new JSONObject();
	
	try{
        sql = " SELECT a.nt_no, a.nt_title, a.nt_content, left(a.reg_date,10) as reg_date "
			+ " FROM vm_company_notice AS a " 
			+ " where vm_cp_no = '" + vm_cp_no + "' "
			+" order by a.reg_date desc "
			+ " LIMIT "+pageNo_new+" , 10; ";

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
			
			JSONObject obj = new JSONObject();
						
			obj.put("nt_no", nt_no);
			obj.put("nt_title", nt_title);
			obj.put("nt_content", nt_content);
			obj.put("reg_date", reg_date);

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