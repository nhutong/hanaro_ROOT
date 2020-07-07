<%@ page contentType = "text/html;charset=utf-8" %>
<%@ page import="java.sql.*" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="java.util.*" %>
<%@ page import="org.json.simple.*" %>
<%@ page import="java.text.*" %>
<%@ include file = "../00_include/dbConn.jsp" %>


<%	

	String tel = request.getParameter("tel")==null? "":request.getParameter("tel"); // 이름
	String usim = request.getParameter("usim")==null? "":request.getParameter("usim"); // 사번
	String agree_privacy = request.getParameter("agree_privacy")==null? "":request.getParameter("agree_privacy"); // 이메일
	String agree_push = request.getParameter("agree_push")==null? "":request.getParameter("agree_push"); // 전화번호	
	String agree_location = request.getParameter("agree_location")==null? "":request.getParameter("agree_location"); // 비밀번호	
	String company_no = request.getParameter("company_no")==null? "0":request.getParameter("company_no"); // 비밀번호	

	String insertSql = "";

	if( tel == "" || tel.equals("null") ) {
		java.text.SimpleDateFormat formatter = new java.text.SimpleDateFormat("yyyyMMddHHmmss");
		tel = formatter.format(new java.util.Date());
	}

	/* 핸드폰번호와 USIM으로 있는지 중복 체크한다. */
	/* 동일한 핸드폰번호가 있어도, USIM 변경이면 다른 사람으로 인지하여 새로 등록받게끔 한다. */
	sql = "select no from vm_member where tel = '"+tel+"' ; ";

	stmt = conn.createStatement();
	rs = stmt.executeQuery(sql);
	rs.last(); 
	int listCount = rs.getRow(); // 현재 커서의 row Index값을 저장 
	String member_no1 = "";
	if(listCount > 0){
		out.clear();
		member_no1 = rs.getString("no");
		out.print(member_no1);
		return;
	}

	try
	{	
		/* 광고성 푸쉬 동여여부에 따라 인서트한다. */
		if (agree_push.equals("Y")){
			 sql = "insert into vm_member (tel, company_no, agree_privacy, agree_push, agree_location, reg_date, usim, push_agree_date)"+
		    	   "values"+
			       "('"+tel+"', if('"+company_no+"'='',0,'"+company_no+"'), '"+agree_privacy+"', '"+agree_push+"', '"+agree_location+"', now(), '"+usim+"', now() )";

		}else{
			sql = "insert into vm_member (tel, company_no, agree_privacy, agree_push, agree_location, reg_date, usim)"+
		      "values"+
			  "('"+tel+"', if('"+company_no+"'='',0,'"+company_no+"'), '"+agree_privacy+"', '"+agree_push+"', '"+agree_location+"', now(), '"+usim+"')";
		}

		insertSql = sql;

		pstmt = conn.prepareStatement(sql);	
		pstmt.executeUpdate();

		if ( agree_push.equals("Y") ){

			sql = "update vm_member set push_agree_date = now() where tel = '"+tel+"'; ";

			pstmt = conn.prepareStatement(sql);	
			pstmt.executeUpdate();

		}
		
		/* 20200310 키를 memberNo 로 함. 폰변경으로인한 중복 가능성 제거 시작*/
//		out.print("SUCCESS");

		sql = "select no from vm_member where tel = '"+tel+"' ; ";

		stmt = conn.createStatement();
		rs = stmt.executeQuery(sql);
		rs.last(); 
		int listCount1 = rs.getRow(); // 현재 커서의 row Index값을 저장 
		String member_no = "";
		if(listCount1 > 0){
			out.clear();
			member_no = rs.getString("no");
			out.print(member_no);
			return;
		}
		/* 20200310 키를 memberNo 로 함. 폰변경으로인한 중복 가능성 제거 종료*/

	}	
	catch(Exception e)
	{		
		out.clear();
		out.println("ERROR");		
		//out.println(e.getMessage()+"/"+insertSql);
		return;
	}
	finally
	{	
	 	if(pstmt != null) try { pstmt.close(); } catch(SQLException sqle) {}
   		if(conn != null) try { conn.close(); } catch(SQLException sqle) {}
	}

%>
