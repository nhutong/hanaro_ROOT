<%@ page contentType = "text/html;charset=utf-8" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="java.util.*" %>
<%@ page import="org.json.simple.*" %>
<%@ page import="java.sql.*" %>
<%@ page import="java.text.*" %>

<%@ include file = "../00_include/dbConn.jsp" %>

<%	
	String stampNo = (request.getParameter("stampNo")==null)? "0":request.getParameter("stampNo");
	String memberNo = (request.getParameter("memberNo")==null)? "0":request.getParameter("memberNo");
	String pw = (request.getParameter("pw")==null)? "0":request.getParameter("pw");
	String rcvCompanyNo = (request.getParameter("rcvCompanyNo")==null)? "0":request.getParameter("rcvCompanyNo");
	String stamped = (request.getParameter("stamped")==null)? "0":request.getParameter("stamped");

	sql = " SELECT staff_no from vm_staff where company_no = '"+rcvCompanyNo+"' "
	    + " and stamp_pw = '"+pw+"'; ";

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
	
	try{

		if ( stamped.equals("N") ){

			sql = " insert into vm_member_stamp (stamp_no, no, std_date, pw) "
				 +" values ("+stampNo+", '"+memberNo+"', now(), '"+pw+"')";
				
			pstmt = conn.prepareStatement(sql);
			pstmt.executeUpdate();

		}else{

			sql = " delete from vm_member_stamp "
     			 +" where ms_no = '"+stamped+"'; ";
				
			pstmt = conn.prepareStatement(sql);
			pstmt.executeUpdate();
			
		}

		sql = " SELECT no as member_no from vm_member where no = '"+memberNo+"' ";

		stmt = conn.createStatement();
		rs = stmt.executeQuery(sql);
			
		rs.last();
		int listCount2 = rs.getRow();
		if(listCount2 == 0){
			out.clear();
			out.print("NoN");
			return;
		};
		rs.beforeFirst();
		
		String member_no = "";
		while(rs.next()){
			
			member_no = rs.getString("member_no");   // 전단 번호
		
		};

		
		sql = " SELECT count(ms_no) as ms_cnt from vm_member_stamp where stamp_no = '"+stampNo+"' and no = '"+memberNo+"'; ";

		stmt = conn.createStatement();
		rs = stmt.executeQuery(sql);
			
		rs.last();
		int listCount1 = rs.getRow();
		if(listCount1 == 0){
			out.clear();
			out.print("NoN");
			return;
		};
		rs.beforeFirst();
		
		String ms_cnt = "0";
		while(rs.next()){
			
			ms_cnt = rs.getString("ms_cnt");   // 전단 번호
		
		};
//out.print(ms_cnt);
		if ( ms_cnt.equals("10") ){

			sql = " insert into vm_member_coupon (coupon_no, member_no, reg_date) "
				 +" select b.coupon_no, '"+member_no+"', now() from vm_stamp as a "
				 +" inner join vm_coupon as b on a.coupon_code = b.coupon_code "
				 +" where a.stamp_no = '"+stampNo+"' and b.stamp_fg = 'Y'; ";
//out.print(sql);				
			pstmt = conn.prepareStatement(sql);
			pstmt.executeUpdate();

			out.clear();
			out.print("complete");
			return;

		}

		out.clear();
		out.print("success");

	}catch(Exception e){
		out.clear();
		out.print("exception error");	
	}finally{
//		out.clear();
//		out.print("success");
		if(pstmt != null) try{ pstmt.close(); }catch(SQLException sqle) {}
		if(conn != null) try{ conn.close(); }catch(SQLException sqle) {}
	};
	
%>