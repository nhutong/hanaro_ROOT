<%@ page contentType = "text/html;charset=utf-8" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="java.util.*" %>
<%@ page import="org.json.simple.*" %>
<%@ page import="java.sql.*" %>
<%@ page import="java.text.*" %>

<%@ include file = "../00_include/dbPoolingConn.jsp" %>

<%	
	String jb_no = (request.getParameter("jb_no")==null)? "0":request.getParameter("jb_no");
	
	try{
		// �ű��Է��� ������������ǰ�� ������������ǰ��ȣ�� select �Ѵ�.
		sql = " select visible_fg from vm_jundan_banner where jb_no = "+jb_no+" ;";
	
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

		while(rs.next()){

			String visible_fg = rs.getString("visible_fg");     // �ű� ������������ǰ��ȣ	
	
			if (visible_fg.equals("Y")){

				sql = "update vm_jundan_banner set visible_fg = 'N' "
					+" where jb_no = "+jb_no+"";
				
				pstmt = conn.prepareStatement(sql);
				pstmt.executeUpdate();

			}else{
				
				sql = "update vm_jundan_banner set visible_fg = 'Y' "
					+" where jb_no = "+jb_no+"";
					
				pstmt = conn.prepareStatement(sql);
				pstmt.executeUpdate();
			}


		}

	}catch(Exception e){
		out.clear();
		out.print("'exception error");	
	}finally{
		out.clear();
		out.print("success");
		if(pstmt != null) try{ pstmt.close(); }catch(SQLException sqle) {}
		if(conn != null) try{ conn.close(); }catch(SQLException sqle) {}
	};
	
%>