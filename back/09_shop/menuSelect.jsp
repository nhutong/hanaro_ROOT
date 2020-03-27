<%@ page contentType = "text/html;charset=utf-8" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="java.util.*" %>
<%@ page import="org.json.simple.*" %>
<%@ page import="java.sql.*" %>
<%@ page import="java.text.*" %>

<%@ include file = "../00_include/dbConn.jsp" %>

<%	

	String rcvCompanyNo = (request.getParameter("userCompanyNo")==null)? "0":request.getParameter("userCompanyNo");

	JSONObject bdListJSON = new JSONObject();
	
	try{

        sql = " SELECT a.menu_no, a.menu_name FROM vm_menu AS a where ref_cp_no = '"+rcvCompanyNo+"' and a.menu_type_cd in ('MENU1','MENU2','MENU3') and a.hide_fg = 'N' "
		+ " order by a.order_number asc "; 
	
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
			
			String menu_no   = rs.getString("menu_no");        // 긴급공지번호
			String menu_name = rs.getString("menu_name");   // 긴급공지내용
			
			JSONObject obj = new JSONObject();
						
			obj.put("menu_no", menu_no);
			obj.put("menu_name", menu_name);

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