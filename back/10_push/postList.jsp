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
	String s_date = request.getParameter("s_date") ==  null ? "" : request.getParameter("s_date").trim();
	String e_date = request.getParameter("e_date") ==  null ? "" : request.getParameter("e_date").trim();
	String category = request.getParameter("category") ==  null ? "" : request.getParameter("category").trim();
	String keyword = request.getParameter("keyword") ==  null ? "" : request.getParameter("keyword").trim();
	String status = request.getParameter("status") ==  null ? "" : request.getParameter("status").trim();

//	mariadb의 페이징 시작 쿼리를 위해 1을 뺀다.
	pageNo_new = Integer.parseInt(pageNo) - 1;
	pageNo_new = pageNo_new * 15;

	JSONObject bdListJSON = new JSONObject();
	
	try{
		sql = " SELECT " 
		+ "  p.pm_no, p.ms_content, p.event_no as event_title, a.vm_cp_name, p.pm_hour, p.pm_min, ifnull(b.send_cnt,0) as send_cnt, ifnull(c.target_cnt,0) as target_cnt, p.reg_date, "
		+ "  case when p.pm_type = 'realtime' and p.pm_from_date is null then substr(p.reg_date,1,10) else substr(p.pm_from_date,1,10) end as pm_from_date, " 
		+ "  case when p.pm_type = 'realtime' and p.pm_to_date is null then substr(p.reg_date,1,10) else substr(p.pm_to_date,1,10) end as pm_to_date, " 
		+ "  p.pm_interval, p.pm_target, p.pm_type, ifnull(p.send_date,'') as send_date, ifnull(p.del_fg,'') as del_fg, pm_status "
        + "  FROM vm_push_message AS p " 
		+ "  inner join vm_company as a " 
		+ "  on p.vm_cp_no = a.vm_cp_no "
		+ "  left outer join ( select pm_no, count(pmis_no) as send_cnt from vm_push_message_indi_send where push_token <> '' group by pm_no ) as b on p.pm_no = b.pm_no "
		+ "  left outer join ( select pm_no, count(pmt_no) as target_cnt from vm_push_message_target where 1=1 group by pm_no ) as c on p.pm_no = c.pm_no ";
		if ( companyNo.equals("0") ){
			sql = sql + " WHERE 1=1 "; 	
		}else{
			sql = sql + "  WHERE p.vm_cp_no = '"+companyNo+"' "; 
		}
	    //sql += ("".equals(s_date) ? "" : " AND '" + s_date + "' <= pm_to_date ");
		//sql += ("".equals(e_date) ? "" : " AND pm_to_date <= '" + e_date + "' ");
		sql += ("".equals(s_date) || "".equals(e_date) ? "" : " AND (('" + s_date + "' <= pm_to_date AND pm_to_date <= '" + e_date + "') OR ('" + s_date + "' <= pm_from_date AND pm_from_date <= '" + e_date + "') OR (pm_from_date <= '"+ s_date +"' AND '"+ e_date +"' <= pm_to_date ) OR (pm_from_date IS NULL AND pm_to_date IS NULL))");
		sql += ("".equals(keyword) ? "" : " AND " + category + " LIKE '%" + keyword + "%'");
		sql += ("".equals(status) ? "" : " AND pm_status LIKE '" + status + "'");
		sql = sql + " ORDER BY p.reg_date desc "
	              + " LIMIT "+pageNo_new+" ,15; ";
		System.out.println("=====sql====");
		System.out.println(sql);

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
			String target_cnt   = rs.getString("target_cnt");			
			String reg_date   = rs.getString("reg_date");
			String pm_from_date   = rs.getString("pm_from_date");
			String pm_to_date   = rs.getString("pm_to_date");
			String pm_interval   = rs.getString("pm_interval");
			String pm_target   = rs.getString("pm_target");			
			String pm_type   = rs.getString("pm_type");			
			String send_date   = rs.getString("send_date");						
			String del_fg   = rs.getString("del_fg");						
			String pm_status   = rs.getString("pm_status");						

			JSONObject obj = new JSONObject();
						
			obj.put("pm_no", pm_no);
			obj.put("ms_content", ms_content);
			obj.put("event_title", event_title);
			obj.put("vm_cp_name", vm_cp_name);
			obj.put("pm_hour", pm_hour);
			obj.put("pm_min", pm_min);
			obj.put("send_cnt", send_cnt);
			obj.put("target_cnt", target_cnt);			
			obj.put("reg_date", reg_date);
			obj.put("pm_from_date", pm_from_date);
			obj.put("pm_to_date", pm_to_date);
			obj.put("pm_interval", pm_interval);
			obj.put("pm_target", pm_target);
			obj.put("pm_type", pm_type);
			obj.put("send_date", send_date);
			obj.put("del_fg", del_fg);			
			obj.put("pm_status", pm_status);			
			
			if(obj != null){
				arr.add(obj);
			}
		};

		bdListJSON.put("CompanyList", arr);
		out.clear();
		out.print(bdListJSON);
	
	}catch(Exception e){
		out.clear();
		out.print("exception error"+","+e);	
	}finally{
		if(stmt != null) try{ stmt.close(); }catch(SQLException sqle) {};
		if(conn != null) try{ conn.close(); }catch(SQLException sqle) {};
	};
	
%>