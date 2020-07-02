<%@ page contentType = "text/html;charset=utf-8" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="java.util.*" %>
<%@ page import="org.json.simple.*" %>
<%@ page import="java.sql.*" %>
<%@ page import="java.text.*" %>

<%@ include file = "../00_include/dbPoolingConn.jsp" %>

<%	
	String imgPath = (request.getParameter("imgPath")==null)? "0":request.getParameter("imgPath");
	String pdNo = (request.getParameter("pdNo")==null)? "0":request.getParameter("pdNo");
	String pdCode = (request.getParameter("pdCode")==null)? "0":request.getParameter("pdCode");
	
	String rcvImgPath = imgPath.trim();
	String rcvPdNo = pdNo.replaceAll(" ","");
	String rcvPdCode = pdCode.replaceAll(" ","");

	try{

		sql = "insert into vm_product_image(img_path, ref_pd_no, pd_code) "
			+" values('"+rcvImgPath+"', "+rcvPdNo+", '"+rcvPdCode+"'); ";
	
		pstmt = conn.prepareStatement(sql);
		pstmt.executeUpdate();

		sql = " SELECT max(a.img_no) as new_img_no from vm_product_image AS a ";
	
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
			
			String new_img_no   = rs.getString("new_img_no");     // �ű� �̹�����ȣ

			out.clear();
			out.print(new_img_no);
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