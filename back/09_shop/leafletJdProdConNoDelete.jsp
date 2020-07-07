<%@ page contentType = "text/html;charset=utf-8" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="java.util.*" %>
<%@ page import="org.json.simple.*" %>
<%@ page import="java.sql.*" %>
<%@ page import="java.text.*" %>

<%@ include file = "../00_include/dbConn.jsp" %>

<%	
	String jd_prod_con_no = (request.getParameter("jd_prod_con_no")==null)? "0":request.getParameter("jd_prod_con_no");
	
	try{

		sql = " SELECT a.ref_jd_no, a.order_number from vm_shop_jundan_prod_content AS a "
		   +" where jd_prod_con_no = "+jd_prod_con_no; 

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
			int ref_jd_no   = rs.getInt("ref_jd_no");           // ���ܹ�ȣ
			int order_number = rs.getInt("order_number");       // ���ļ���
		
		
		sql = "update vm_shop_jundan_prod_content set order_number = order_number-1  "
			+" where ref_jd_no = "+ref_jd_no+" and order_number > "+order_number+" ";

		pstmt = conn.prepareStatement(sql);
		pstmt.executeUpdate();

		sql = "delete from vm_shop_jundan_prod_content "
			+" where jd_prod_con_no = "+jd_prod_con_no;
	
		pstmt = conn.prepareStatement(sql);
		pstmt.executeUpdate();

		}

	}catch(Exception e){
		out.clear();
		out.print("exception error");	
	}finally{
		out.clear();
		out.print("success");
//		out.print(sql);
		if(pstmt != null) try{ pstmt.close(); }catch(SQLException sqle) {}
		if(conn != null) try{ conn.close(); }catch(SQLException sqle) {}
	};
	
%>