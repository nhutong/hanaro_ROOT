<%@ page contentType = "text/html;charset=utf-8" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="java.net.URLDecoder" %>
<%@ page import="java.util.*" %>
<%@ page import="org.json.simple.*" %>
<%@ page import="java.sql.*" %>
<%@ page import="java.text.*" %>

<%@ include file = "../00_include/dbConn.jsp" %>
<%@ include file = "../00_include/common.jsp" %>


<%	
	String jd_no = (request.getParameter("jd_no")==null)? "0":request.getParameter("jd_no");
	String memberNo = (request.getParameter("memberNo")==null)? "":request.getParameter("memberNo");

	JSONObject bdListJSON = new JSONObject();
	
	try{

		if ( memberNo != "" ){

		sql = " SELECT ab.menu_type_cd, b.jd_prod_con_no, ifnull(d.img_path,'') as img_path, "
		    +" ifnull(b.pd_name,'') as pd_name, ifnull(b.price,'') as price, ifnull(b.card_discount,'') as card_discount, "
			+" b.card_discount_from_date, b.card_discount_end_date, "
			+" ifnull(b.card_info,'') as card_info, ifnull(b.card_restrict,'') as card_restrict, "
			+" ifnull(b.coupon_discount,'') as coupon_discount, ifnull(b.dadaiksun,'') as dadaiksun, ifnull(b.dadaiksun_info,'') as dadaiksun_info, ifnull(b.etc,'') as etc, c.pd_no, c.pd_code, ifnull(e.vmjz_no,'') as vmjz_no "
			+" FROM vm_jundan AS a "
			+" inner join vm_menu as ab "
			+" on a.menu_no = ab.menu_no "
			+" INNER JOIN vm_jundan_prod_content AS b "
			+" ON a.jd_no = b.ref_jd_no "
			+" inner join vm_product AS c "
			+" ON b.ref_pd_no = c.pd_no "
			+" left outer join vm_product_image AS d "
			+" ON b.ref_img_no = d.img_no "
			+" left outer join ( select * from vm_jundan_zzim where no ='"+memberNo+"' ) as e "
			+" on b.jd_prod_con_no = e.jd_prod_con_no "
			+" WHERE a.jd_no = "+jd_no
			+"   and IFNULL(a.show_fg,'N') = 'Y' "
			+" order by cast(b.order_number AS UNSIGNED ) asc limit 0,6";

		}else{

		sql = " SELECT ab.menu_type_cd, b.jd_prod_con_no, ifnull(d.img_path,'') as img_path, "
		    +" ifnull(b.pd_name,'') as pd_name, ifnull(b.price,'') as price, ifnull(b.card_discount,'') as card_discount, "
			+" b.card_discount_from_date, b.card_discount_end_date, "
			+" ifnull(b.card_info,'') as card_info, ifnull(b.card_restrict,'') as card_restrict, "
			+" ifnull(b.coupon_discount,'') as coupon_discount, ifnull(b.dadaiksun,'') as dadaiksun, ifnull(b.dadaiksun_info,'') as dadaiksun_info, ifnull(b.etc,'') as etc, c.pd_no, c.pd_code, '' as vmjz_no "
			+" FROM vm_jundan AS a "
			+" inner join vm_menu as ab "
			+" on a.menu_no = ab.menu_no "
			+" INNER JOIN vm_jundan_prod_content AS b "
			+" ON a.jd_no = b.ref_jd_no "
			+" inner join vm_product AS c "
			+" ON b.ref_pd_no = c.pd_no "
			+" left outer join vm_product_image AS d "
			+" ON b.ref_img_no = d.img_no "
			+" WHERE a.jd_no = "+jd_no
			+"   and IFNULL(a.show_fg,'N') = 'Y' "
			+" order by cast(b.order_number AS UNSIGNED ) asc limit 0,6";


		}
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
			
			String menu_type_cd		   = rs.getString("menu_type_cd");
			String jd_prod_con_no		   = rs.getString("jd_prod_con_no");						  // 전단 상품번호
			String img_path			       = rs.getString("img_path");					              // 전단 상품이미지경로

			String pd_name				   = rs.getString("pd_name");								  // 전단 상품명
			String price				   = rs.getString("price");									  // 전단 판매가
			String card_discount		   = rs.getString("card_discount");							  // 전단 카드할인가격
			
			String card_discount_from_date = "";
			if ( rs.getString("card_discount_from_date") == null ){

			}else{
				card_discount_from_date = rs.getString("card_discount_from_date").substring(5,10); // 전단 카드할인시작일
			}
			
			String card_discount_end_date = "";
			if ( rs.getString("card_discount_end_date") == null ){
				
			}else{
				card_discount_end_date = rs.getString("card_discount_end_date").substring(5,10); // 전단 카드할인시작일
			}

			String card_info			   = rs.getString("card_info");								  // 전단 카드정보
			String card_restrict		   = rs.getString("card_restrict");							  // 전단 카드한정
			String coupon_discount		   = rs.getString("coupon_discount");						  // 전단 쿠폰할인
			String dadaiksun			   = rs.getString("dadaiksun");								  // 전단 다다익선
			String dadaiksun_info		   = rs.getString("dadaiksun_info");						  // 전단 다다익선정보
			String etc					   = rs.getString("etc");									  // 전단 기타정보
			String pd_no				   = rs.getString("pd_no");									  // 전단 매핑상품번호
			String pd_code				   = rs.getString("pd_code");								  // 전단 상품코드
			String vmjz_no				   = rs.getString("vmjz_no");
			
			JSONObject obj = new JSONObject();
						
			obj.put("menu_type_cd", menu_type_cd);
			obj.put("jd_prod_con_no", jd_prod_con_no);
			if (img_path.equals("")){
				obj.put("img_path", "/images/no_thumb.png");
			}else{
				obj.put("img_path", "/upload/"+img_path);
			}
			
			obj.put("pd_name", URLDecoder.decode(pd_name));
			obj.put("price", price);
			obj.put("card_discount", card_discount);
			obj.put("card_discount_from_date", card_discount_from_date);
			obj.put("card_discount_end_date", card_discount_end_date);
			obj.put("card_info", strDecode(card_info));
			obj.put("card_restrict", strDecode(card_restrict));
			obj.put("coupon_discount", coupon_discount);
			obj.put("dadaiksun", strDecode(dadaiksun));
			obj.put("dadaiksun_info", strDecode(dadaiksun_info));
			obj.put("etc", strDecode(etc));
			obj.put("pd_no", pd_no);
			obj.put("pd_code", strDecode(pd_code));
			obj.put("vmjz_no", strDecode(vmjz_no));
			
			if(obj != null){
				arr.add(obj);
			}
		};

		bdListJSON.put("PdContentList", arr);
		out.clear();
		out.print(bdListJSON);
	
	}catch(Exception e){
		out.print("exception error");	
	}finally{
		if(stmt != null) try{ stmt.close(); }catch(SQLException sqle) {};
		if(conn != null) try{ conn.close(); }catch(SQLException sqle) {};
	};
	
%>