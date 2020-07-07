<%@ page contentType = "text/html;charset=utf-8" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="java.util.*" %>
<%@ page import="org.json.simple.*" %>
<%@ page import="java.sql.*" %>
<%@ page import="java.text.*" %>

<%@ include file = "../00_include/dbConn.jsp" %>
<%@ include file = "../00_include/common.jsp" %>

<%	
	String rcvTitle = (request.getParameter("rcvTitle")==null)? "0":request.getParameter("rcvTitle");
	String rcvContent = (request.getParameter("rcvContent")==null)? "0":request.getParameter("rcvContent");
	String vm_cp_no = (request.getParameter("vm_cp_no")==null)? "0":request.getParameter("vm_cp_no");
	String userNo = (request.getParameter("userNo")==null)? "0":request.getParameter("userNo");
	String rcv_nt_no = (request.getParameter("nt_no")==null)? "0":request.getParameter("nt_no");

	try{

		sql = "insert into vm_company_qna(nt_title, nt_content, vm_cp_no, reg_no, reg_date) "
			+" values('"+java.net.URLDecoder.decode(rcvTitle,"UTF-8")+"', '"+java.net.URLDecoder.decode(rcvContent,"UTF-8")+"', '"+vm_cp_no+"', '"+userNo+"', now()); ";
	
		pstmt = conn.prepareStatement(sql);
		pstmt.executeUpdate();

		sql = " SELECT a.nt_no "
		    + " FROM vm_company_qna AS a " 
			+ " order by a.reg_date desc limit 0,1 "; 
	
		stmt = conn.createStatement();
		rs = stmt.executeQuery(sql);
	
		String nt_no ="";

		while(rs.next()){
			
			nt_no   = rs.getString("nt_no");

		};

		sql = "update vm_company_qna set "
			+" ref_nt_no = '"+nt_no+"' "
			+" where nt_no = '"+rcv_nt_no+"'; ";
	
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