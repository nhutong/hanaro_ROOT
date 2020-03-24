<%@ page contentType = "text/html;charset=utf-8" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="java.util.*" %>
<%@ page import="org.json.simple.*" %>
<%@ page import="java.sql.*" %>
<%@ page import="java.text.*" %>

<%@ include file = "../00_include/dbConn.jsp" %>
<%@ include file = "../00_include/common.jsp" %>

<%	
	String jd_prod_con_no = (request.getParameter("jd_prod_con_no")==null)? "0":request.getParameter("jd_prod_con_no");
	String card_discount = (request.getParameter("card_discount")==null)? "":request.getParameter("card_discount");
	String card_discount_from_date = (request.getParameter("card_discount_from_date")==null)? "":request.getParameter("card_discount_from_date");
	String card_discount_end_date = (request.getParameter("card_discount_end_date")==null)? "":request.getParameter("card_discount_end_date");
	String card_info = (request.getParameter("card_info")==null)? "":request.getParameter("card_info");
	String card_restrict = (request.getParameter("card_restrict")==null)? "":request.getParameter("card_restrict");
	String coupon_discount = (request.getParameter("coupon_discount")==null)? "":request.getParameter("coupon_discount");
	String dadaiksun = (request.getParameter("dadaiksun")==null)? "":request.getParameter("dadaiksun");
	String dadaiksun_info = (request.getParameter("dadaiksun_info")==null)? "":request.getParameter("dadaiksun_info");
	
	try{

		sql = "update vm_jundan_prod_content set card_discount = '"+card_discount+"', ";
		
		if (card_discount_from_date.equals("")){
			sql = sql +" ";
		}else{
			sql = sql +" card_discount_from_date = '"+strEncode(card_discount_from_date)+"', ";
		}
		
		if (card_discount_end_date.equals("")){
			sql = sql +" ";
		}else{
			sql = sql +" card_discount_end_date = '"+strEncode(card_discount_end_date)+"', ";
		}
		
		sql = sql +" card_info = '"+strEncode(card_info)+"', ";
		sql = sql +" card_restrict = '"+strEncode(card_restrict)+"', ";
		sql = sql +" coupon_discount = '"+coupon_discount+"', ";
		sql = sql +" dadaiksun = '"+strEncode(dadaiksun)+"', ";
		sql = sql +" dadaiksun_info = '"+strEncode(dadaiksun_info)+"' ";
		sql = sql +" where jd_prod_con_no = "+jd_prod_con_no+"; ";
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