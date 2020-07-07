<%@ page contentType = "text/html;charset=utf-8" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="java.net.URLDecoder"%>
<%@ page import="java.util.*" %>
<%@ page import="org.json.simple.*" %>
<%@ page import="java.sql.*" %>
<%@ page import="java.text.*" %>

<%@ include file = "../00_include/dbConn.jsp" %>
<%@ include file = "../00_include/common.jsp" %>

<%	

	String vm_cp_no = (request.getParameter("vm_cp_no")==null)? "0":request.getParameter("vm_cp_no");
	String memberNo = (request.getParameter("memberNo")==null)? "":request.getParameter("memberNo");

	JSONObject bdListJSON = new JSONObject();
	
	try{

        sql = " SELECT a.rs_no, d.CODE_NAME, a.rs_std_date, b.item_pd_name, a.order_price, a.rs_address1, a.rs_address2, ifnull(c.name,'') as name, e.rs_item_cnt, "
			+ " b.item_qty, b.item_amount, h.img_path "
			+ " FROM vm_reserve AS a "
			+ " INNER JOIN vm_reserve_item AS b "
			+ " ON a.rs_no = b.rs_no "
			+ " INNER JOIN vm_member AS c "
			+ " ON a.ref_member_no = c.`no` "
			+ " INNER JOIN vm_code AS d "
			+ " ON a.rs_status_cd = d.CODE "
			+ " INNER JOIN ( SELECT aa.rs_no, count(aa.rs_no) AS rs_item_cnt, ac.no "
			+ " FROM vm_reserve AS aa "
			+ " INNER JOIN vm_reserve_item AS ab "
			+ " ON aa.rs_no = ab.rs_no "
			+ " INNER JOIN vm_member AS ac "
			+ " ON aa.ref_member_no = ac.`no` "
			+ " WHERE ac.no = '"+memberNo+"' "
			+ " AND aa.company_no = "+Integer.parseInt(vm_cp_no)+" GROUP BY ac.no, aa.rs_no ) AS e "
			+ " ON c.no = e.no AND a.rs_no = e.rs_no  "
			+ " INNER JOIN vm_product AS f "
			+ " ON b.item_pd_code = f.pd_code "
			+ " INNER join vm_shop_jundan_prod_content AS g "
			+ " ON g.ref_pd_no = f.pd_no "
			+ " left outer JOIN vm_product_image AS h "
			+ " ON g.ref_img_no = h.img_no "
			+ " WHERE c.no = '"+memberNo+"' "
			+ " AND a.company_no = "+Integer.parseInt(vm_cp_no)
			+ " order by a.reg_date desc ; "; 
//	out.print(sql);
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
			
			String rs_no   = rs.getString("rs_no"); 
			String CODE_NAME   = rs.getString("CODE_NAME");        // 긴급공지번호
			String rs_std_date = rs.getString("rs_std_date");   // 긴급공지내용
			String item_pd_name = strDecode(rs.getString("item_pd_name"));
			String order_price = rs.getString("order_price");
			String rs_address1 = rs.getString("rs_address1");
			String rs_address2 = rs.getString("rs_address2");
			String item_qty = rs.getString("item_qty");
			String item_amount = rs.getString("item_amount");
			String img_path = rs.getString("img_path");
			String order_name = rs.getString("name");
			String rs_item_cnt = rs.getString("rs_item_cnt");
			
			JSONObject obj = new JSONObject();
			
			obj.put("rs_no", rs_no);
			obj.put("CODE_NAME", CODE_NAME);
			obj.put("rs_std_date", rs_std_date);
			obj.put("item_pd_name", item_pd_name);
			obj.put("order_price", order_price);
			obj.put("rs_address1", rs_address1);
			obj.put("rs_address2", rs_address2);
			obj.put("item_qty", item_qty);
			obj.put("item_amount", item_amount);
			obj.put("img_path", img_path);
			obj.put("order_name", order_name);
			obj.put("rs_item_cnt", rs_item_cnt);

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