<%@ page contentType = "text/html;charset=utf-8" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="java.util.*" %>
<%@ page import="org.json.simple.*" %>
<%@ page import="java.sql.*" %>
<%@ page import="java.text.*" %>
<%@ page import="java.io.File,java.util.Date,jxl.*"%>

<%@ include file = "../00_include/dbConn.jsp" %>
<%@ include file = "../00_include/common.jsp" %>

<%

    String pushTopTxt = (request.getParameter("pushTopTxt")==null)? "0":request.getParameter("pushTopTxt");
	String vm_cp_no = (request.getParameter("vm_cp_no")==null)? "0":request.getParameter("vm_cp_no");
	String reg_no = (request.getParameter("reg_no")==null)? "0":request.getParameter("reg_no");
	String event_no = (request.getParameter("event_no")==null)? "0":request.getParameter("event_no");
	String pushSendHr = (request.getParameter("pushSendHr")==null)? "0":request.getParameter("pushSendHr");
	String pushSendMin = (request.getParameter("pushSendMin")==null)? "0":request.getParameter("pushSendMin");
	String pm_img_path = (request.getParameter("pm_img_path")==null)? "0":request.getParameter("pm_img_path");

	String pushSendFromDate = (request.getParameter("pushSendFromDate")==null)? "":request.getParameter("pushSendFromDate");
	String pushSendToDate = (request.getParameter("pushSendToDate")==null)? "":request.getParameter("pushSendToDate");
	String pushInterval = (request.getParameter("pushInterval")==null)? "":request.getParameter("pushInterval");
	String pushTarget = (request.getParameter("pushTarget")==null)? "":request.getParameter("pushTarget");
	
	
	try{

		pushSendFromDate = pushSendFromDate.replaceAll("-", "");
		pushSendToDate = pushSendToDate.replaceAll("-", "");
				
		// 전달받은 정보를 바탕으로 전단상품을 insert 한다.
		sql = " insert into vm_push_message (ms_content, vm_cp_no, event_no, reg_no, reg_date, pm_hour, pm_min, pm_img_path, pm_from_date, pm_to_date, pm_interval, pm_target) "
			+ " values('[광고] "+pushTopTxt+" 수신거부 | 메뉴>설정>동의 해제', '"+vm_cp_no+"', '"+event_no+"', '"+reg_no+"', now(), '"+pushSendHr+"', '"+pushSendMin+"', '"+pm_img_path+"', '"+pushSendFromDate+"', '"+pushSendToDate+"', '"+pushInterval+"', '"+pushTarget+"'); ";
        //out.print(sql);
		pstmt = conn.prepareStatement(sql);
		pstmt.executeUpdate();

		out.clear();
		out.print("success"+","+sql);

	}catch(Exception e){
		out.clear();
		out.print("exception error"+","+sql+","+e);	
	}finally{
		if(pstmt != null) try{ pstmt.close(); }catch(SQLException sqle) {}
		if(conn != null) try{ conn.close(); }catch(SQLException sqle) {}
	};


%>