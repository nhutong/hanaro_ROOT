<%@ page contentType = "text/html;charset=utf-8" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="java.util.*" %>
<%@ page import="org.json.simple.*" %>
<%@ page import="java.sql.*" %>
<%@ page import="java.text.*" %>

<%@ include file = "../00_include/dbConn.jsp" %>

<%	
	String couponNo = (request.getParameter("couponNo")==null)? "0":request.getParameter("couponNo");
	String memberNo = (request.getParameter("memberNo")==null)? "0":request.getParameter("memberNo");
	String telNo    = (request.getParameter("telNo")==null)? "0":request.getParameter("telNo");
	
	String member_no_select = "";
	
	//중복 체크
		sql = "select a.mc_no from vm_member_coupon as a "
			+ " inner join vm_member as b on a.member_no = b.no "
			+ "where b.no = '"+memberNo+"' and a.coupon_no = "+couponNo+" ";

		stmt = conn.createStatement();
		rs = stmt.executeQuery(sql);
		rs.last(); 	
		int listCount = rs.getRow(); // 현재 커서의 row Index값을 저장 
		if(listCount > 0){
			out.clear();
			out.print("dup");
			return;
		}

	//과거 다운이력 체크
		sql = "select a.mc_no from vm_member_coupon as a "
			+ " where a.tel_no = '"+telNo+"' "
			+ "   and a.coupon_no = "+couponNo+" "
			+ "   and a.staff_cert_fg = 'Y' ";

		stmt = conn.createStatement();
		rs = stmt.executeQuery(sql);
		rs.last(); 	
		int rejoinCount = rs.getRow(); // 현재 커서의 row Index값을 저장 
		if(rejoinCount > 0){
			out.clear();
			out.print("dup_rejoin");
			return;
		}		

	// 수량 체크
	    sql = " SELECT a.coupon_no, a.limit_qty, ifnull(count(b.mc_no),0) AS mc_cnt "
	    + " FROM vm_coupon AS a "
	    + " LEFT OUTER JOIN vm_member_coupon AS b "
	    + " ON a.coupon_no = b.coupon_no "
	    + " WHERE a.coupon_no = "+couponNo+" "
	    + " GROUP BY a.coupon_no, a.limit_qty ";

		stmt = conn.createStatement();
		rs = stmt.executeQuery(sql);

		Integer limit_qty = 0;
		Integer mc_cnt = 0;

		while(rs.next()){

			limit_qty = rs.getInt("limit_qty");
			mc_cnt = rs.getInt("mc_cnt");

		}

		if ( limit_qty < 0 ){ //무제한쿠폰
		}else{
			if ( mc_cnt >= limit_qty ){
				out.clear();
				out.print("over");
				return;
			}else{
				
			}
		}

	try{

		sql = "select no from vm_member where no =  '"+memberNo+"'; ";

		stmt = conn.createStatement();
		rs = stmt.executeQuery(sql);

		while(rs.next()){

			member_no_select = rs.getString("no");   // 전단 번호

			sql = " insert into vm_member_coupon (coupon_no, member_no, reg_date, tel_no) "
			 +" values ("+couponNo+", '"+member_no_select+"', now(), '"+telNo+"')";
			
		pstmt = conn.prepareStatement(sql);
		pstmt.executeUpdate();

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