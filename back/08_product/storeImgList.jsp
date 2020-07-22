<%@ page contentType = "text/html;charset=utf-8" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="java.util.*" %>
<%@ page import="org.json.simple.*" %>
<%@ page import="java.sql.*" %>
<%@ page import="java.text.*" %>

<%@ include file = "../00_include/dbConn.jsp" %>

<%	

	Integer list_size = 8;
	String vm_cp_no = (request.getParameter("vm_cp_no")==null)? "0":request.getParameter("vm_cp_no");
	System.out.println(vm_cp_no);
	Integer n_page = (request.getParameter("n_page")==null)? 1:Integer.parseInt(request.getParameter("n_page"));
	Integer s_page = (n_page - 1) * list_size;
	String s_date = request.getParameter("s_date") ==  null ? "2019-01-01" : request.getParameter("s_date").trim();
	String e_date = request.getParameter("e_date") ==  null ? "2999-12-31" : request.getParameter("e_date").trim();
	String category = request.getParameter("category") ==  null ? "" : request.getParameter("category").trim();
	String keyword = request.getParameter("keyword") ==  null ? "" : request.getParameter("keyword").trim();
	String status = request.getParameter("status") ==  null ? "" : request.getParameter("status").trim();

	JSONObject bdListJSON = new JSONObject();
	
	try{

	sql = " SELECT a.img_no, a.img_path, a.pd_code, a.group_tag, b.pd_name, c.vm_name, left(a.reg_date,10) as reg_date, d.vm_cp_name, "
	+ " case when a.std_fg is null then '승인대기' "
	+"       when a.std_fg = 'N' then concat('삭제-',ifnull(e.delDesc,'')) "
	+"       when a.std_fg = 'S' then '승인' "
	+"	end as img_status, a.std_fg "
	+ " from vm_product_image AS a "
	+ " left outer JOIN ( SELECT ba.pd_no, ba.pd_name, ba.pd_code from vm_product AS ba ) AS b "
	+ " ON a.ref_pd_no = b.pd_no "
	+ " inner join (select * from vm_user where vm_ref_company_no <> 0 and vm_role_cd = 'ROLE2') as c "
	+ " on a.reg_no = c.vm_no "
	+ " inner join vm_company as d "
	+ " on c.vm_ref_company_no = d.vm_cp_no "
	+ " left outer join vm_product_image_deldesc as e "
	+ " on a.img_no = e.img_no "
	+ " where 1=1" +
	("".equals(s_date) || "".equals(e_date) ? "" : " AND '" + s_date + "' <= left(a.reg_date,10) AND left(a.reg_date,10) <= '" + e_date + "'") +
	("".equals(keyword) ? "" : " AND " + category + " LIKE '%" + keyword + "%'");

	if (vm_cp_no.equals("0")){
		sql = sql + "";
	}else{
		sql = sql + " and d.vm_cp_no = "+vm_cp_no;
	}
	
	// sql = sql + " AND ( a.std_fg IS NULL OR a.std_fg = 'N' ) order by a.reg_date desc";
	sql = sql +	("all".equals(status) ? "  AND ( a.std_fg IS NULL OR a.std_fg = ('N' OR 'S') ) " : "null".equals(status) ? " AND a.std_fg IS NULL " : " AND a.std_fg LIKE '" + status + "' ");
	sql = sql + "order by a.reg_date desc LIMIT "+ s_page +", 8";
		//out.print(sql);
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
			
			Integer img_no     = Integer.parseInt(rs.getString("img_no")); 
			String img_path   = rs.getString("img_path");     // 판매장번호
			String pd_code   = rs.getString("pd_code");   // 판매장명
			String group_tag   = rs.getString("group_tag");   // 판매장명		
			String pd_name   = rs.getString("pd_name");   // 판매장명	
			String vm_name   = rs.getString("vm_name");
			String reg_date   = rs.getString("reg_date");
			String vm_cp_name   = rs.getString("vm_cp_name");
			String img_status   = rs.getString("img_status");
			String std_fg   = rs.getString("std_fg");			

			
			
			JSONObject obj = new JSONObject();
						
			obj.put("img_no", img_no);
			obj.put("img_path", img_path);
			obj.put("pd_code", pd_code);
			obj.put("group_tag", group_tag);
			obj.put("pd_name", pd_name);
			obj.put("vm_name", vm_name);
			obj.put("reg_date", reg_date);
			obj.put("vm_cp_name", vm_cp_name);
			obj.put("img_status", img_status);
			obj.put("std_fg", std_fg);


			if(obj != null){
				arr.add(obj);
			}
		};

		bdListJSON.put("CompanyList", arr);
		out.clear();
		out.print(bdListJSON);
	
	}catch(Exception e){
//		out.clear();
		out.print("exception error");	
	}finally{
		if(stmt != null) try{ stmt.close(); }catch(SQLException sqle) {};
		if(conn != null) try{ conn.close(); }catch(SQLException sqle) {};
	};
	
%>