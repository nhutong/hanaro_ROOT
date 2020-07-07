<%@ page contentType = "text/html;charset=utf-8" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="java.util.*" %>
<%@ page import="org.json.simple.*" %>
<%@ page import="java.sql.*" %>
<%@ page import="java.text.*" %>

<%@ include file = "../00_include/dbConn.jsp" %>
<%@ include file = "../00_include/common.jsp" %>

<%	
	String memberNo = (request.getParameter("memberNo")==null)? "0":request.getParameter("memberNo");
	String jd_prod_con_no = (request.getParameter("jd_prod_con_no")==null)? "0":request.getParameter("jd_prod_con_no");
	String vm_cp_no = (request.getParameter("vm_cp_no")==null)? "0":request.getParameter("vm_cp_no");

	/* 해당 찜정보가 있는지 확인한다. */
	sql = " select vmjz_no from vm_jundan_zzim where no = '"+memberNo+"' and jd_prod_con_no = "+jd_prod_con_no+" and vm_cp_no = "+vm_cp_no;
	
	stmt = conn.createStatement();
	rs = stmt.executeQuery(sql);

	String zzim_prod_con_fg = "N";

	rs.last();
	int listCount1 = rs.getRow();
	if(listCount1 == 0){
//		out.clear();
		/* 해당판매장의 배송정보가 존재하지 않습니다. */
//		out.print("DevNoN");
//		return;
	};
	rs.beforeFirst();

	while(rs.next()){
		zzim_prod_con_fg = "Y";
	};

	try{

		if (zzim_prod_con_fg == "N"){
			/* 배송주문 마스터에 insert */
			sql = " insert into vm_jundan_zzim ( jd_prod_con_no, no, vm_cp_no, reg_date  ) "
			    + " values("+Integer.parseInt(jd_prod_con_no)+", '"+memberNo+"', "+Integer.parseInt(vm_cp_no)+", now() ) "; 
				
			pstmt = conn.prepareStatement(sql);
			pstmt.executeUpdate();
		}else{
			/* 배송주문 마스터에 delete */
			sql = " delete from vm_jundan_zzim "
			 	+ " where no = '"+memberNo+"' and jd_prod_con_no = "+Integer.parseInt(jd_prod_con_no)+" and vm_cp_no = "+Integer.parseInt(vm_cp_no);
				
			pstmt = conn.prepareStatement(sql);
			pstmt.executeUpdate();
		}

	}catch(Exception e){
		out.clear();
		out.print("exception error");	
	}finally{
		out.print("success");
		if(pstmt != null) try{ pstmt.close(); }catch(SQLException sqle) {}
		if(conn != null) try{ conn.close(); }catch(SQLException sqle) {}
	};
	
%>