<%@ page contentType = "text/html;charset=utf-8" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="java.util.*" %>
<%@ page import="org.json.simple.*" %>
<%@ page import="java.sql.*" %>
<%@ page import="java.text.*" %>

<%@ include file = "../00_include/dbConn.jsp" %>

<%	
	String memberNo = (request.getParameter("memberNo")==null)? "":request.getParameter("memberNo");
	String agree_push = (request.getParameter("agree_push")==null)? "0":request.getParameter("agree_push");
	
	try{

		sql = "update vm_member set agree_push = '"+agree_push+"' "
		    +" where no = '"+memberNo+"'";
				
		pstmt = conn.prepareStatement(sql);
		pstmt.executeUpdate();

		if ( agree_push != "Y" ){

			sql = "update vm_member set push_disagree_date = now() where no = '"+memberNo+"'; ";

			pstmt = conn.prepareStatement(sql);	
			pstmt.executeUpdate();

		}else{
			
			sql = "update vm_member set push_agree_date = now() where no = '"+memberNo+"'; ";

			pstmt = conn.prepareStatement(sql);	
			pstmt.executeUpdate();

		}

	}catch(Exception e){
		out.clear();
		out.print("exception error");	
	}finally{
//		out.print("success");
		if(pstmt != null) try{ pstmt.close(); }catch(SQLException sqle) {}
		if(conn != null) try{ conn.close(); }catch(SQLException sqle) {}
	};
	
%>