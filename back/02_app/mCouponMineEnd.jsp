<%@ page contentType = "text/html;charset=utf-8" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="java.util.*" %>
<%@ page import="org.json.simple.*" %>
<%@ page import="java.sql.*" %>
<%@ page import="java.text.*" %>

<%@ include file = "../00_include/dbPoolingConn.jsp" %>

<%	
	String userCompanyNo = (request.getParameter("userCompanyNo")==null)? "0":request.getParameter("userCompanyNo");
	String memberNo = (request.getParameter("memberNo")==null)? "":request.getParameter("memberNo");

	JSONObject bdListJSON = new JSONObject();
	
	try{
		
		//sql = " SELECT a.coupon_no, a.discount_price, case when min(c.img_path) IS NULL then min(cc.img_path) ELSE min(c.img_path) end as img_path, a.coupon_type, date_format(a.start_date,'%m-%d') as start_date, date_format(a.end_date,'%m-%d') AS end_date, ifnull(b.pd_name,a.product_name) as pd_name, "
		// my쿠폰에서도 쿠폰명을 쿠폰테이블(기존 상품테이블) 참조하도록 수정 - 20200615 김중백
		sql = " SELECT a.coupon_no, a.discount_price, case when min(c.img_path) IS NULL then min(cc.img_path) ELSE min(c.img_path) end as img_path, a.coupon_type, date_format(a.start_date,'%m-%d') as start_date, date_format(a.end_date,'%m-%d') AS end_date, ifnull(a.product_name,'') as pd_name, "
			+" (a.limit_qty - ifnull(d.coupon_save_cnt,0)) AS asisCnt, s.mc_no, a.coupon_code, a.min_price, a.coupon_detail "
			+" from vm_member_coupon as s "
			+" inner join vm_member as ss "
			+" on s.member_no = ss.no "
			+" inner join vm_coupon AS a "
			+" on a.coupon_no = s.coupon_no "
			+" LEFT outer JOIN vm_product AS b "
			+" ON a.product_code = b.pd_code "
			+" LEFT OUTER JOIN ( select * from vm_product_image where std_fg = 'Y') AS c "
			+" ON b.pd_code = c.pd_code "
			+" LEFT OUTER JOIN ( select * from vm_product_image where std_fg = 'Y') AS cc " 
			+" ON b.group_tag = cc.group_tag "
			+" LEFT OUTER JOIN ( SELECT coupon_no, ifnull(count(mc_no),0) AS coupon_save_cnt FROM vm_member_coupon GROUP BY coupon_no ) AS d "
			+" ON a.coupon_no = d.coupon_no "
			+" WHERE a.company_no = "+userCompanyNo
			+" and ss.no = '"+memberNo+"' "
			+" AND a.status_cd = 'APPLY' "
//			+" and left(a.start_date,10) <= left(now(),10) "
			+" and left(a.end_date,10) >= left(now(),10) "
			+" and a.coupon_type = 'BILLING' "
			+" and ifnull(s.staff_cert_fg,'N') <> 'Y' "
			+" GROUP BY a.coupon_no, a.discount_price, a.coupon_type, date_format(a.start_date,'%m-%d'), date_format(a.end_date,'%m-%d'), b.pd_name, (a.limit_qty - ifnull(d.coupon_save_cnt,0)), s.mc_no, a.coupon_code, a.min_price, a.coupon_detail "
			+" order by a.end_date desc ";

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
			String discount_price = rs.getString("discount_price");   // 전단배너 번호
			String img_path = rs.getString("img_path");   // 전단배너 번호
			String coupon_type = rs.getString("coupon_type");   // 전단배너 번호
			String start_date = rs.getString("start_date");   // 전단배너 번호
			String end_date = rs.getString("end_date");   // 전단배너 번호
			String asisCnt = rs.getString("asisCnt");   // 전단배너 번호
			String pd_name = rs.getString("pd_name");   // 전단배너 번호
			String mc_no = rs.getString("mc_no");   // 전단배너 번호
			String coupon_code = rs.getString("coupon_code");   // 전단배너 번호
			String min_price = rs.getString("min_price");   // 전단배너 번호
			String coupon_detail = rs.getString("coupon_detail");   // 전단배너 번호
			
			JSONObject obj = new JSONObject();
						
			obj.put("coupon_no", coupon_no);
			obj.put("discount_price", discount_price);
			obj.put("img_path", img_path);
			obj.put("coupon_type", coupon_type);
			obj.put("start_date", start_date);
			obj.put("end_date", end_date);
			obj.put("asisCnt", asisCnt);
			obj.put("pd_name", pd_name);
			obj.put("mc_no", mc_no);
			obj.put("coupon_code", coupon_code);
			obj.put("min_price", min_price);
			obj.put("coupon_detail", coupon_detail);
			
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