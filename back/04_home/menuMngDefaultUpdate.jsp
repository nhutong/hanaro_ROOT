<%@ page contentType = "text/html;charset=utf-8" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="java.util.*" %>
<%@ page import="org.json.simple.*" %>
<%@ page import="java.sql.*" %>
<%@ page import="java.text.*" %>

<%@ include file = "../00_include/dbConn.jsp" %>

<%	
	String vm_cp_no = (request.getParameter("vm_cp_no")==null)? "0":request.getParameter("vm_cp_no");
	String event_fg = (request.getParameter("event_fg")==null)? "0":request.getParameter("event_fg");
	String coupon_fg = (request.getParameter("coupon_fg")==null)? "0":request.getParameter("coupon_fg");
	String jang_fg = (request.getParameter("jang_fg")==null)? "0":request.getParameter("jang_fg");
out.print(event_fg);	
	try{

		if ( event_fg.equals("0") ){
		}else{
			sql = "update vm_menu_default set event_fg = '"+event_fg+"' "
				+" where vm_cp_no = "+vm_cp_no+"";
out.print(sql);		
			pstmt = conn.prepareStatement(sql);
			pstmt.executeUpdate();
		}

		if ( coupon_fg.equals("0") ){
		}else{
			sql = "update vm_menu_default set coupon_fg = '"+coupon_fg+"' "
				+" where vm_cp_no = "+vm_cp_no+"";
out.print(sql);			
			pstmt = conn.prepareStatement(sql);
			pstmt.executeUpdate();
		}

		if ( jang_fg.equals("0") ){
		}else{
			sql = "update vm_menu_default set jang_fg = '"+jang_fg+"' "
				+" where vm_cp_no = "+vm_cp_no+"";
out.print(sql);			
			pstmt = conn.prepareStatement(sql);
			pstmt.executeUpdate();
		}

	}catch(Exception e){
		//out.clear();
		out.print("'exception error");	
	}finally{
		//out.clear();
		out.print("success");
		if(pstmt != null) try{ pstmt.close(); }catch(SQLException sqle) {}
		if(conn != null) try{ conn.close(); }catch(SQLException sqle) {}
	};
	
%>