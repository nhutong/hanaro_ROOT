<%@ page contentType = "text/html;charset=utf-8" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="java.util.*" %>
<%@ page import="org.json.simple.*" %>
<%@ page import="java.sql.*" %>
<%@ page import="java.text.*" %>

<%@ include file = "../00_include/dbPoolingConn.jsp" %>

<%	
	String tel = (request.getParameter("tel")==null)? "0":request.getParameter("tel");
	String jd_prod_con_no = (request.getParameter("jd_prod_con_no")==null)? "0":request.getParameter("jd_prod_con_no");
	String vm_cp_no = (request.getParameter("vm_cp_no")==null)? "0":request.getParameter("vm_cp_no");

	//중복 체크
	sql = "select vmjz_no from vm_shop_jundan_zang where tel = '"+tel+"' and jd_prod_con_no = '"+jd_prod_con_no+"'; ";

	stmt = conn.createStatement();
	rs = stmt.executeQuery(sql);

	rs.last();
	int listCount = rs.getRow();
	if(listCount > 0){
		out.clear();
		out.print("dup");
		return;
	};
	rs.beforeFirst();

//	JSONArray arr = new JSONArray();		
//	while(rs.next()){
//			
//		String event_no = rs.getString("event_no");   // 전단 번호
//			
//		JSONObject obj = new JSONObject();
//						
//		obj.put("event_no", event_no);
//	
//		if(obj != null){
//			arr.add(obj);
//		}
//	};

	try{

		sql = " insert into vm_shop_jundan_zang (jd_prod_con_no, vm_cp_no, tel, reg_date, jang_cnt) "
			 +" values ('"+jd_prod_con_no+"', '"+vm_cp_no+"', '"+tel+"', now(), 1)";
				
		pstmt = conn.prepareStatement(sql);
		pstmt.executeUpdate();

	}catch(Exception e){
		out.clear();
		out.print("exception error");	
	}finally{
		out.print("success");
		if(pstmt != null) try{ pstmt.close(); }catch(SQLException sqle) {}
		if(conn != null) try{ conn.close(); }catch(SQLException sqle) {}
	};
	
%>