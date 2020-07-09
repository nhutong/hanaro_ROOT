<%@ page contentType = "text/html;charset=utf-8" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="java.util.*" %>
<%@ page import="org.json.simple.*" %>
<%@ page import="java.sql.*" %>
<%@ page import="java.text.*" %>

<%@ include file = "../00_include/dbConn.jsp" %>

<%	
	String img_no = (request.getParameter("img_no")==null)? "0":request.getParameter("img_no");
	String ispdNo;
	String pd_no;
	String pd_code;
	String query;

	try{
		ispdNo = "SELECT * FROM vm_product_image "
			+ "WHERE img_no = " + img_no;

		stmt = conn.createStatement();
		rs = stmt.executeQuery(ispdNo);
		
		rs.last();
		int listCount = rs.getRow();
		if(listCount != 0){
			rs.beforeFirst();
			while(rs.next()){
				pd_no   = rs.getString("ref_pd_no");
				pd_code = rs.getString("pd_code");
				System.out.println(pd_no);
				if (!pd_no.equals("")) {
					System.out.println("NULL 아님");
					sql = "update vm_product_image set std_fg = 'Y' "
						+" where img_no = '"+img_no+"'; ";

					pstmt = conn.prepareStatement(sql);
					pstmt.executeUpdate();
				} else {
					System.out.println("NULL 임");
					sql = "SELECT * FROM vm_product WHERE pd_code = " + pd_code;
					stmt = conn.createStatement();
					rs = stmt.executeQuery(sql);
					rs.beforeFirst();
					while(rs.next()){
						pd_no = rs.getString("pd_no");
						query = "UPDATE vm_product_image SET std_fg = 'Y' "
							+ ", ref_pd_no = " + pd_no
							+ " WHERE img_no = " + img_no;
						pstmt = conn.prepareStatement(query);
						pstmt.executeUpdate();
					}
				}
			}
		}
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