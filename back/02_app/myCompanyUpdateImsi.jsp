<%@ page contentType = "text/html;charset=utf-8" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="java.util.*" %>
<%@ page import="org.json.simple.*" %>
<%@ page import="java.sql.*" %>
<%@ page import="java.text.*" %>

<%@ include file = "../00_include/dbConn.jsp" %>

<%	
	String memberNo = (request.getParameter("memberNo")==null)? "":request.getParameter("memberNo");
	String company_no = (request.getParameter("company_no")==null)? "0":request.getParameter("company_no");
	
	try{

		sql = "update vm_member set company_no = '"+company_no+"' "
			+" where no = '"+memberNo+"' and ( company_no is null or company_no = 0 ); ";
//out.prin t(sql);	
		pstmt = conn.prepareStatement(sql);
		pstmt.executeUpdate();

		sql = " select ifnull(VM_delivery_FG,'N') as VM_delivery_FG from vm_company where vm_cp_no = '"+company_no+"' ";

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
		
		String VM_delivery_FG = "";		
		while(rs.next()){
			
			VM_delivery_FG = rs.getString("VM_delivery_FG");   // 전단 번호

		};

//		out.clear();
		out.print(VM_delivery_FG);

	}catch(Exception e){
		out.clear();
		out.print("exception error");	
	}finally{
//		out.clear();
//		out.print("success");
		if(pstmt != null) try{ pstmt.close(); }catch(SQLException sqle) {}
		if(conn != null) try{ conn.close(); }catch(SQLException sqle) {}
	};
	
%>