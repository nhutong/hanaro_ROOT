<%@ page contentType = "text/html;charset=utf-8" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="java.util.*" %>
<%@ page import="org.json.simple.*" %>
<%@ page import="java.sql.*" %>
<%@ page import="java.text.*" %>

<%@ include file = "../00_include/dbConn.jsp" %>

<%	
	String pd_name = (request.getParameter("pd_name")==null)? "0":request.getParameter("pd_name");
	String pd_code = (request.getParameter("pd_code")==null)? "0":request.getParameter("pd_code");
	String group_tag = (request.getParameter("group_tag")==null)? "0":request.getParameter("group_tag");
	
//	String rcvImgPath = imgPath.trim();
//	String rcvPdNo = pdNo.replaceAll(" ","");
//	String rcvPdCode = pdCode.replaceAll(" ","");

	sql = " SELECT a.pd_no from vm_product AS a where a.pd_code = '"+pd_code+"'; ";
	
	stmt = conn.createStatement();
	rs = stmt.executeQuery(sql);
		
	rs.last();
	int listCount_exist = rs.getRow();
	if(listCount_exist == 0){
	}else{
		//순서가 숫자가 아니므로 중단한다.
		out.clear();
		out.print("exist");
		return;	
	};
	rs.beforeFirst();
				
	try{

		sql = "insert into vm_product(pd_name, pd_code, group_tag) "
			+" values('"+pd_name+"', '"+pd_code+"', '"+group_tag+"'); ";
	
		pstmt = conn.prepareStatement(sql);
		pstmt.executeUpdate();

		sql = " SELECT max(a.pd_no) as new_pd_no from vm_product AS a ";
	
		stmt = conn.createStatement();
		rs = stmt.executeQuery(sql);
		
		rs.last();
		int listCount = rs.getRow();
		if(listCount == 0){
			out.print("NoN");
			return;
		};
		rs.beforeFirst();
				
		while(rs.next()){
			
			String new_pd_no   = rs.getString("new_pd_no");     // 신규 이미지번호

			out.clear();
			out.print(new_pd_no);
		};

	}catch(Exception e){
		out.clear();
		out.print("'exception error");	
	}finally{
//		out.print("success");
		if(pstmt != null) try{ pstmt.close(); }catch(SQLException sqle) {}
		if(conn != null) try{ conn.close(); }catch(SQLException sqle) {}
	};
	
%>