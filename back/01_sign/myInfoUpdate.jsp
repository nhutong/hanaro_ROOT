<%@ page contentType = "text/html;charset=utf-8" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="java.util.*" %>
<%@ page import="org.json.simple.*" %>
<%@ page import="java.sql.*" %>
<%@ page import="java.text.*" %>

<%@ include file = "../00_include/dbPoolingConn.jsp" %>

<%	
	String memberNo = (request.getParameter("memberNo")==null)? "":request.getParameter("memberNo");
	String name = (request.getParameter("name")==null)? "0":request.getParameter("name");
	String address1 = (request.getParameter("address1")==null)? "0":request.getParameter("address1");
	String address2 = (request.getParameter("address2")==null)? "0":request.getParameter("address2");

	sql = " SELECT a.agree_privacy from vm_member AS a where a.no = '"+memberNo+"' and a.agree_privacy = 'Y'; ";
	
	stmt = conn.createStatement();
	rs = stmt.executeQuery(sql);
					
	rs.last();
	int listCount_exist = rs.getRow();
	if(listCount_exist == 0){
		//순서가 숫자가 아니므로 중단한다.
		out.clear();
		out.print("exist");
		return;	
	}else{
		
	};
	rs.beforeFirst();

	try{

		sql = "update vm_member set name = '"+name+"', address1 = '"+address1+"', address2 = '"+address2+"' "
		    +" where no = '"+memberNo+"' ";
				
		pstmt = conn.prepareStatement(sql);
		pstmt.executeUpdate();

	}catch(Exception e){
		out.clear();
		out.print("exception error");	
	}finally{
//		out.print("success");
		if(pstmt != null) try{ pstmt.close(); }catch(SQLException sqle) {}
		if(conn != null) try{ conn.close(); }catch(SQLException sqle) {}
	};
	
%>