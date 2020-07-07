<%@ page contentType = "text/html;charset=utf-8" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="java.util.*" %>
<%@ page import="org.json.simple.*" %>
<%@ page import="java.sql.*" %>
<%@ page import="java.text.*" %>
<%@ page import="java.io.File,java.util.Date"%>

<%@ include file = "../00_include/dbConn.jsp" %>
<%@ include file = "../00_include/common.jsp" %>

<%

    String pm_no = (request.getParameter("pm_no")==null)? "":request.getParameter("pm_no");
	String push_target_tel = (request.getParameter("push_target_tel")==null)? "":request.getParameter("push_target_tel");    


	try{

        int del_cnt = 0;
		int ins_cnt = 0;        

        sql = " delete from vm_push_message_target where pm_no = "+pm_no+"; "; 
        pstmt = conn.prepareStatement(sql);
        del_cnt = pstmt.executeUpdate();

	
        sql = " insert into vm_push_message_target(pm_no, no, reg_date, tel) "
                +" select a.pm_no, b.no, NOW(), b.tel "
                +"   from vm_push_message a "
                +"   inner join vm_member b on a.vm_cp_no = b.company_no "
                +"  where a.pm_target = '대상등록' "
                +"    and length(b.tel) IN (13, 11) "
                +"    and a.pm_no = "+pm_no+"	"
                +"    and b.tel like '%"+push_target_tel+"' ; ";

        pstmt = conn.prepareStatement(sql);
        ins_cnt = pstmt.executeUpdate();

		out.clear();
		out.print("success"+","+Integer.toString(ins_cnt)+","+Integer.toString(del_cnt)+","+sql);
	}catch(Exception e){
		out.clear();
		out.print("exception error"+","+e);	
	}finally{
		if(pstmt != null) try{ pstmt.close(); }catch(SQLException sqle) {}
		if(stmt != null) try{ stmt.close(); }catch(SQLException sqle) {}		
		if(conn != null) try{ conn.close(); }catch(SQLException sqle) {}
	};

%>