<%@ page contentType = "text/html;charset=utf-8" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="java.util.*" %>
<%@ page import="org.json.simple.*" %>
<%@ page import="java.sql.*" %>
<%@ page import="java.text.*" %>

<%@ include file = "../00_include/dbConn.jsp" %>

<%	
	
	String bannerOrderStr = (request.getParameter("bannerOrderStr")==null)? "0":request.getParameter("bannerOrderStr");
	String jd_no = (request.getParameter("jd_no")==null)? "0":request.getParameter("jd_no");
	
	try{

		String bannerOrderStr1 = bannerOrderStr.substring(0, bannerOrderStr.length()-1).replaceAll(" ","");;
		String[] afterBannerOrderStr = bannerOrderStr1.split(",");

		for(int i=0;i<afterBannerOrderStr.length;i++){
			String bannerEachstr = afterBannerOrderStr[i];

//			out.print(bannerEachstr);

			String[] bannerEachstrKey = afterBannerOrderStr[i].split(":");
			String jbNo = bannerEachstrKey[0];
			String orderNumber = bannerEachstrKey[1];

//			out.print(jbNo);
//			out.print(orderNumber);

			sql = "update vm_jundan_banner set jb_order_no = '"+orderNumber+"' "
				+" where jb_no = "+jbNo+"";
				
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