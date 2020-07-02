<%@ page contentType = "text/html;charset=utf-8" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="java.util.*" %>
<%@ page import="org.json.simple.*" %>
<%@ page import="java.sql.*" %>
<%@ page import="java.text.*" %>

<%@ include file = "../00_include/dbPoolingConn.jsp" %>

<%	

	String rcvCompanyNo = (request.getParameter("userCompanyNo")==null)? "0":request.getParameter("userCompanyNo");

	JSONObject bdListJSON = new JSONObject();
	
	try{

        sql = " SELECT a.menu_no, a.menu_name, a.menu_type_cd, ref_cp_no, order_number, hide_fg FROM vm_menu AS a where ref_cp_no = '"+rcvCompanyNo+"'  "
		+ " order by a.order_number asc, a.reg_date asc "; 
//out.print(sql);	
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
			String menu_type_cd = rs.getString("menu_type_cd");   // 긴급공지내용
			String ref_cp_no = rs.getString("ref_cp_no");   // 긴급공지내용
			String order_number = rs.getString("order_number");   // 긴급공지내용
			String hide_fg = rs.getString("hide_fg");   // 긴급공지내용
			
			JSONObject obj = new JSONObject();
						
			obj.put("menu_no", menu_no);
			obj.put("menu_name", menu_name);
			obj.put("menu_type_cd", menu_type_cd);
			obj.put("ref_cp_no", ref_cp_no);
			obj.put("order_number", order_number);
			obj.put("hide_fg", hide_fg);

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