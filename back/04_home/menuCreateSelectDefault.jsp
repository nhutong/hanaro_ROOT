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

        sql = " SELECT ifnull(a.event_fg,'N') as event_fg, ifnull(a.coupon_fg,'N') as coupon_fg, ifnull(a.jang_fg,'N') as jang_fg FROM vm_menu_default AS a where a.vm_cp_no = '"+rcvCompanyNo+"'  "; 
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
			
			String event_fg   = rs.getString("event_fg");        // 긴급공지번호
			String coupon_fg = rs.getString("coupon_fg");   // 긴급공지내용
			String jang_fg = rs.getString("jang_fg");   // 긴급공지내용
			
			JSONObject obj = new JSONObject();
						
			obj.put("event_fg", event_fg);
			obj.put("coupon_fg", coupon_fg);
			obj.put("jang_fg", jang_fg);

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