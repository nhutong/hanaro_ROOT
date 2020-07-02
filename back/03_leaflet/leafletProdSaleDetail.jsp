<%@ page contentType = "text/html;charset=utf-8" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="java.util.*" %>
<%@ page import="org.json.simple.*" %>
<%@ page import="java.sql.*" %>
<%@ page import="java.text.*" %>

<%@ include file = "../00_include/dbPoolingConn.jsp" %>
<%@ include file = "../00_include/common.jsp" %>

<%	
	String jd_prod_con_no = (request.getParameter("jd_prod_con_no")==null)? "0":request.getParameter("jd_prod_con_no");
	jd_prod_con_no = jd_prod_con_no.trim();

	JSONObject bdListJSON = new JSONObject();
	
	try{

	    sql = " SELECT ifnull(card_discount,'') as card_discount, "
		    +" left(ifnull(card_discount_from_date,''),10) as card_discount_from_date, "
		    +" left(ifnull(card_discount_end_date,''),10) as card_discount_end_date, "
			+" ifnull(card_info,'') as card_info, ifnull(card_restrict,'') as card_restrict, " 
			+" ifnull(coupon_discount,'') as coupon_discount, " 
			+" ifnull(dadaiksun,'') as dadaiksun, " 
			+" ifnull(dadaiksun_info,'') as dadaiksun_info, "
			+" ifnull(etc,'') as etc "			
			+" FROM vm_jundan_prod_content "
			+" WHERE jd_prod_con_no = '"+jd_prod_con_no+"' ;";
	
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
			
			String card_discount   = rs.getString("card_discount");						// 카드할인
			String card_discount_from_date = rs.getString("card_discount_from_date");   // 카드할인 시작일
			String card_discount_end_date = rs.getString("card_discount_end_date");     // 카드할인 시작일
			String card_info = rs.getString("card_info");   // 카드할인 시작일
			String card_restrict = rs.getString("card_restrict");   // 카드할인 시작일
			String coupon_discount = rs.getString("coupon_discount");   // 카드할인 시작일
			String dadaiksun = rs.getString("dadaiksun");   // 카드할인 시작일
			String dadaiksun_info = rs.getString("dadaiksun_info");   // 카드할인 시작일
			String etc = rs.getString("etc");   // 카드할인 시작일			
			
			JSONObject obj = new JSONObject();
						
			obj.put("card_discount", card_discount);
			obj.put("card_discount_from_date", card_discount_from_date);
			obj.put("card_discount_end_date", card_discount_end_date);
			obj.put("card_info", strDecode(card_info));
			obj.put("card_restrict", strDecode(card_restrict));
			obj.put("coupon_discount", coupon_discount);
			obj.put("dadaiksun", strDecode(dadaiksun));
			obj.put("dadaiksun_info", strDecode(dadaiksun_info));
			obj.put("etc", strDecode(etc));

			if(obj != null){
				arr.add(obj);
			}
		};

		bdListJSON.put("saleList", arr);
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