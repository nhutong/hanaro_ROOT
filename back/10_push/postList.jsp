<%@ page contentType = "text/html;charset=utf-8" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="java.util.*" %>
<%@ page import="org.json.simple.*" %>
<%@ page import="java.sql.*" %>
<%@ page import="java.text.*" %>

<%@ include file = "../00_include/dbConn.jsp" %>

<%	
	String companyNo = (request.getParameter("companyNo")==null)? "0":request.getParameter("companyNo");
	String pageNo = (request.getParameter("pageNo")==null)? "0":request.getParameter("pageNo");
	Integer pageNo_new;

//	mariadb의 페이징 시작 쿼리를 위해 1을 뺀다.
	pageNo_new = Integer.parseInt(pageNo) - 1;
	pageNo_new = pageNo_new * 6;

	JSONObject bdListJSON = new JSONObject();
	
	try{

	
		sql = " SELECT " 
		+ "  p.pm_no, p.ms_content, p.event_no as event_title, a.vm_cp_name, p.pm_hour, p.pm_min, b.send_cnt, p.reg_date "
        + "  FROM vm_push_message AS p " 
		+ "  inner join vm_company as a " 
		+ "  on p.vm_cp_no = a.vm_cp_no "
		+ "  left outer join ( select pm_no, count(ifnull(pmis_no,0)) as send_cnt from vm_push_message_indi_send where push_token <> '' group by pm_no ) as b "
		+ "  on p.pm_no = b.pm_no ";

		if ( companyNo.equals("0") ){
			sql = sql + " "; 	
		}else{
			sql = sql + "  WHERE p.vm_cp_no = '"+companyNo+"' "; 
		}
	    
		sql = sql + " ORDER BY p.reg_date desc "
	              + " LIMIT "+pageNo_new+" ,6; ";

//		out.print(sql);

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

		JSONArray arr = new JSONArray();		
		while(rs.next()){
			
			Integer pm_no     = Integer.parseInt(rs.getString("pm_no")); 
			String ms_content   = rs.getString("ms_content");     // 판매장번호
			String event_title   = rs.getString("event_title");   // 판매장명
			String vm_cp_name   = rs.getString("vm_cp_name");   // 판매장명
			String pm_hour   = rs.getString("pm_hour");
			String pm_min   = rs.getString("pm_min");
			String send_cnt   = rs.getString("send_cnt");
			String reg_date   = rs.getString("reg_date");
			
			JSONObject obj = new JSONObject();
						
			obj.put("pm_no", pm_no);
			obj.put("ms_content", ms_content);
			obj.put("event_title", event_title);
			obj.put("vm_cp_name", vm_cp_name);
			obj.put("pm_hour", pm_hour);
			obj.put("pm_min", pm_min);
			obj.put("send_cnt", send_cnt);
			obj.put("reg_date", reg_date);

			if(obj != null){
				arr.add(obj);
			}
		};

		bdListJSON.put("CompanyList", arr);
		out.clear();
		out.print(bdListJSON);
	
	}catch(Exception e){
		out.clear();
		out.print("exception error");	
	}finally{
		if(stmt != null) try{ stmt.close(); }catch(SQLException sqle) {};
		if(conn != null) try{ conn.close(); }catch(SQLException sqle) {};
	};
	
%>