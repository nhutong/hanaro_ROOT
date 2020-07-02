<%@ page contentType = "text/html;charset=utf-8" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="java.util.*" %>
<%@ page import="org.json.simple.*" %>
<%@ page import="java.sql.*" %>
<%@ page import="java.text.*" %>

<%@ include file = "../00_include/dbPoolingConn.jsp" %>

<%	
	String userCompanyNo = (request.getParameter("userCompanyNo")==null)? "0":request.getParameter("userCompanyNo");
	String memberNo = (request.getParameter("memberNo")==null)? "0":request.getParameter("memberNo");

	JSONObject bdListJSON = new JSONObject();
	
	try{
		sql = " SELECT a.coupon_no, a.coupon_name, a.discount_price, case when min(c.img_path) IS NULL then min(cc.img_path) ELSE min(c.img_path) end as img_path, " 
			+" a.coupon_type, date_format(a.start_date,'%m-%d') as start_date, date_format(a.end_date,'%m-%d') AS end_date, ifnull(a.product_name,'') as pd_name, a.min_price, "
			+" a.limit_qty, (a.limit_qty - ifnull(d.coupon_save_cnt,0)) AS asisCnt, (case when e.mc_no is NULL then 'N' ELSE 'Y' END) AS mc_get_fg, IFNULL(e.staff_cert_fg,'N') AS staff_cert_fg, "
			+" e.mc_no, a.coupon_detail, a.coupon_code "
			+" from vm_coupon AS a "
			+" LEFT outer JOIN vm_product AS b "
			+" ON a.product_code = b.pd_code "
			+" LEFT OUTER JOIN ( select * from vm_product_image where std_fg = 'Y') AS c "
			+" ON b.pd_code = c.pd_code "
			+" LEFT OUTER JOIN ( select * from vm_product_image where std_fg = 'Y') AS cc " 
			+" ON b.group_tag = cc.group_tag and length(ifnull(b.group_tag,'')) > 1 "
			+" LEFT OUTER JOIN ( SELECT coupon_no, ifnull(count(mc_no),0) AS coupon_save_cnt FROM vm_member_coupon GROUP BY coupon_no ) AS d "
			+" ON a.coupon_no = d.coupon_no "
			+" LEFT outer JOIN vm_member_coupon AS e "
			+" ON a.coupon_no = e.coupon_no and e.member_no = "+memberNo			
			+" WHERE a.company_no = "+userCompanyNo
			+" AND a.status_cd = 'APPLY' "
			+" AND ifnull(a.stamp_fg,'N') = 'N' "
			+" and left(a.end_date,10) >= left(now(),10) "
			+"                                           "
			+" GROUP BY a.coupon_no, a.coupon_name, a.discount_price, a.coupon_type, date_format(a.start_date,'%m-%d'), date_format(a.end_date,'%m-%d'), a.product_name, "
			+" a.limit_qty, (a.limit_qty - ifnull(d.coupon_save_cnt,0)), a.min_price, (case when e.mc_no is NULL then 'N' ELSE 'Y' END), IFNULL(e.staff_cert_fg,'N'), "
			+" e.mc_no, a.coupon_detail, a.coupon_code "
			+" order by a.lst_date desc, a.coupon_no ";

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

			if (rs.getString("coupon_no") == null){
				out.clear();
				out.print("NoN");
				return;
			}
			
			String coupon_no = rs.getString("coupon_no");   // 전단 번호
			String coupon_name = rs.getString("coupon_name");   // 전단배너 번호
			String discount_price = rs.getString("discount_price");   // 전단배너 번호
			String img_path = rs.getString("img_path");   // 전단배너 번호
			String coupon_type = rs.getString("coupon_type");   // 전단배너 번호
			String start_date = rs.getString("start_date");   // 전단배너 번호
			String end_date = rs.getString("end_date");   // 전단배너 번호
			String limit_qty = rs.getString("limit_qty");   // 전단배너 번호
			String asisCnt = rs.getString("asisCnt");   // 전단배너 번호
			String pd_name = rs.getString("pd_name");   // 전단배너 번호
			String min_price = rs.getString("min_price");
			String mc_get_fg = rs.getString("mc_get_fg"); //받았는지
			String staff_cert_fg = rs.getString("staff_cert_fg"); //사용했는지
			String mc_no = rs.getString("mc_no"); //사용했는지
			String coupon_detail = rs.getString("coupon_detail"); //사용했는지
			String coupon_code = rs.getString("coupon_code"); //사용했는지

			JSONObject obj = new JSONObject();
						
			obj.put("coupon_no", coupon_no);
			obj.put("coupon_name", coupon_name);
			obj.put("discount_price", discount_price);
			obj.put("img_path", img_path);
			obj.put("coupon_type", coupon_type);
			obj.put("start_date", start_date);
			obj.put("end_date", end_date);
			obj.put("limit_qty", limit_qty);
			obj.put("asisCnt", asisCnt);
			obj.put("pd_name", pd_name);
			obj.put("min_price", min_price);
			obj.put("mc_get_fg", mc_get_fg);
			obj.put("staff_cert_fg", staff_cert_fg);
			obj.put("mc_no", mc_no);
			obj.put("coupon_detail", coupon_detail);
			obj.put("coupon_code", coupon_code);
			
			if(obj != null){
				arr.add(obj);
			}
		};

		bdListJSON.put("BannerList", arr);
		out.clear();
		out.print(bdListJSON);
	
	}catch(Exception e){
		out.print("'exception error");	
	}finally{
		if(stmt != null) try{ stmt.close(); }catch(SQLException sqle) {};
		if(conn != null) try{ conn.close(); }catch(SQLException sqle) {};
	};
	
%>