<%@ page contentType = "text/html;charset=utf-8" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="java.util.*" %>
<%@ page import="org.json.simple.*" %>
<%@ page import="java.sql.*" %>
<%@ page import="java.text.*" %>

<%@ include file = "../00_include/dbConn.jsp" %>

<%	
	String memberNo = (request.getParameter("memberNo")==null)? "":request.getParameter("memberNo");
	String jd_prod_con_no = (request.getParameter("jd_prod_con_no")==null)? "0":request.getParameter("jd_prod_con_no");
	String vm_cp_no = (request.getParameter("vm_cp_no")==null)? "0":request.getParameter("vm_cp_no");

	//중복 체크
	sql = "select vmjz_no from vm_shop_jundan_zang where no = '"+memberNo+"' and jd_prod_con_no = '"+jd_prod_con_no+"'; ";

	stmt = conn.createStatement();
	rs = stmt.executeQuery(sql);
	rs.last(); 
	int listCount = rs.getRow(); // 현재 커서의 row Index값을 저장 
	if(listCount > 0){
		out.clear();
		out.print("dup");
		return;
	}

	try{

		sql = " insert into vm_shop_jundan_zang (jd_prod_con_no, vm_cp_no, no, reg_date, jang_cnt) "
			 +" values ('"+jd_prod_con_no+"', '"+vm_cp_no+"', '"+memberNo+"', now(), 1)";
				
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