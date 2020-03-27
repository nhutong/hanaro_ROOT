<%@ page contentType = "text/html;charset=utf-8" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="java.util.*" %>
<%@ page import="org.json.simple.*" %>
<%@ page import="java.sql.*" %>
<%@ page import="java.text.*" %>

<%@ include file = "../00_include/dbConn.jsp" %>

<%	
	
	String img_path = (request.getParameter("img_path")==null)? "0":request.getParameter("img_path");
	img_path = img_path.trim();
	String jd_no = (request.getParameter("jd_no")==null)? "0":request.getParameter("jd_no");
	
	try{

			sql = " SELECT ifnull(max(a.jb_order_no),0)+1 as new_order_no from vm_jundan_banner AS a where a.ref_jd_no ="+jd_no;

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
			
			JSONArray arr = new JSONArray();		
			while(rs.next()){
				
				String order_no   = rs.getString("new_order_no");     // 판매장번호

				sql = "insert into vm_jundan_banner (jb_img_path,jb_order_no,ref_jd_no,visible_fg) "
					+" values ('"+img_path+"', "+order_no+", "+jd_no+", 'Y'); ";
					
				pstmt = conn.prepareStatement(sql);
				pstmt.executeUpdate();
			}

	}catch(Exception e){
		out.clear();
		out.print("'exception error");	
	}finally{
//		out.print("success");
		if(pstmt != null) try{ pstmt.close(); }catch(SQLException sqle) {}
		if(conn != null) try{ conn.close(); }catch(SQLException sqle) {}
	};
	
%>