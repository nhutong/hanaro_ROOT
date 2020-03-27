<%@ page contentType = "text/html;charset=utf-8" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="java.util.*" %>
<%@ page import="org.json.simple.*" %>
<%@ page import="java.sql.*" %>
<%@ page import="java.text.*" %>

<%@ include file = "../00_include/dbConn.jsp" %>

<%	
	String tel = (request.getParameter("tel")==null)? "0":request.getParameter("tel");
	String jd_prod_con_no = (request.getParameter("jd_prod_con_no")==null)? "0":request.getParameter("jd_prod_con_no");
	String vm_cp_no = (request.getParameter("vm_cp_no")==null)? "0":request.getParameter("vm_cp_no");
	String jang_cnt = (request.getParameter("jang_cnt")==null)? "0":request.getParameter("jang_cnt");

	try{

		sql = " update vm_shop_jundan_zang set jang_cnt = "+Integer.parseInt(jang_cnt)
			 +" where jd_prod_con_no = "+Integer.parseInt(jd_prod_con_no)
			 +" and vm_cp_no = "+Integer.parseInt(vm_cp_no)
			 +" and tel = '"+tel+"'; ";
				
		pstmt = conn.prepareStatement(sql);
		pstmt.executeUpdate();

	}catch(Exception e){
		out.clear();
		out.print("exception error");	
	}finally{
		out.print("success");
		if(pstmt != null) try{ pstmt.close(); }catch(SQLException sqle) {}
		if(conn != null) try{ conn.close(); }catch(SQLException sqle) {}
	};
	
%>