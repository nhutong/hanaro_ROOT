<%@ page contentType = "text/html;charset=utf-8" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="java.util.*" %>
<%@ page import="org.json.simple.*" %>
<%@ page import="java.sql.*" %>
<%@ page import="java.text.*" %>

<%@ include file = "../00_include/dbConn.jsp" %>

<%	

	String vm_cp_no = (request.getParameter("vm_cp_no")==null)? "0":request.getParameter("vm_cp_no");

	JSONObject bdListJSON = new JSONObject();
	
	try{

	sql = " SELECT a.img_no, a.img_path, a.pd_code, a.group_tag, b.pd_name, c.vm_name, left(a.reg_date,10) as reg_date, d.vm_cp_name, "
	+ " case when a.std_fg is null then '승인대기' "
	+"       when a.std_fg = 'N' then concat('삭제-',e.delDesc) end as img_status "
	+ " from vm_product_image AS a "
	+ " INNER JOIN ( SELECT ba.pd_no, ba.pd_name, ba.pd_code from vm_product AS ba ) AS b "
	+ " ON a.ref_pd_no = b.pd_no "
	+ " inner join (select * from vm_user where vm_ref_company_no <> 0 and vm_role_cd = 'ROLE2') as c "
	+ " on a.reg_no = c.vm_no "
	+ " inner join vm_company as d "
	+ " on c.vm_ref_company_no = d.vm_cp_no "
	+ " left outer join vm_product_image_deldesc as e "
	+ " on a.img_no = e.img_no "
	+ " where 1=1 ";

	if (vm_cp_no.equals("0")){
		sql = sql + "";
	}else{
		sql = sql + " and d.vm_cp_no = "+vm_cp_no;
	}
	
	sql = sql + " AND ( a.std_fg IS NULL OR a.std_fg = 'N' ) order by a.reg_date desc ";

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
			
			Integer img_no     = Integer.parseInt(rs.getString("img_no")); 
			String img_path   = rs.getString("img_path");     // 판매장번호
			String pd_code   = rs.getString("pd_code");   // 판매장명
			String group_tag   = rs.getString("group_tag");   // 판매장명		
			String pd_name   = rs.getString("pd_name");   // 판매장명	
			String vm_name   = rs.getString("vm_name");
			String reg_date   = rs.getString("reg_date");
			String vm_cp_name   = rs.getString("vm_cp_name");
			String img_status   = rs.getString("img_status");
			
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


			if(obj != null){
				arr.add(obj);
			}
		};

		bdListJSON.put("CompanyList", arr);
//		out.clear();
		out.print(bdListJSON);
	
	}catch(Exception e){
//		out.clear();
		out.print("exception error");	
	}finally{
		if(stmt != null) try{ stmt.close(); }catch(SQLException sqle) {};
		if(conn != null) try{ conn.close(); }catch(SQLException sqle) {};
	};
	
%>