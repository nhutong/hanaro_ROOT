<%@ page contentType = "text/html;charset=utf-8" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="java.util.*" %>
<%@ page import="org.json.simple.*" %>
<%@ page import="java.sql.*" %>
<%@ page import="java.text.*" %>

<%@ include file = "../00_include/dbPoolingConn.jsp" %>

<%	
	String memberNo = (request.getParameter("memberNo")==null)? "0":request.getParameter("memberNo");
	
	try{

		//sql = "delete from vm_member where no = '"+memberNo+"'; ";
		sql = "update vm_member SET tel = concat(date_format(NOW(),'%Y%m%d%H%i%S'),'_',tel), mem_resign_date = now(), mem_resign_fg = 'Y' where no = '"+memberNo+"'; ";
		//out.print(sql);	
		pstmt = conn.prepareStatement(sql);
		pstmt.executeUpdate();

	}catch(Exception e){
		out.clear();
		out.print("exception error");	
	}finally{
		out.clear();
		out.print("success");
		if(pstmt != null) try{ pstmt.close(); }catch(SQLException sqle) {}
		if(conn != null) try{ conn.close(); }catch(SQLException sqle) {}
	};
	
%>