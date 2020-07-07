<%@ page contentType = "text/html;charset=utf-8" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="java.util.*" %>
<%@ page import="org.json.simple.*" %>
<%@ page import="java.sql.*" %>
<%@ page import="java.text.*" %>

<%@ include file = "../00_include/dbConn.jsp" %>
<%@ include file = "../00_include/common.jsp" %>

<%	
	String blank_fg = (request.getParameter("blank_fg")==null)? "0":request.getParameter("blank_fg");
	String user_no = (request.getParameter("user_no")==null)? "0":request.getParameter("user_no");
	String jd_no = (request.getParameter("jd_no")==null)? "0":request.getParameter("jd_no");
	String pd_order = (request.getParameter("pd_order")==null)? "0":request.getParameter("pd_order");
	String pd_code = (request.getParameter("pd_code")==null)? "0":request.getParameter("pd_code");
	pd_code = strEncode(pd_code);
	String pd_name = (request.getParameter("pd_name")==null)? "0":request.getParameter("pd_name");
	pd_name = strEncode(pd_name);
	String pd_price = (request.getParameter("pd_price")==null)? "0":request.getParameter("pd_price");
	String card_discount = (request.getParameter("card_discount")==null)? "0":request.getParameter("card_discount");
	String card_startDate = (request.getParameter("card_startDate")=="")? "":request.getParameter("card_startDate");
	String card_endDate = (request.getParameter("card_endDate")=="")? "":request.getParameter("card_endDate");
	String card_info = (request.getParameter("card_info")==null)? "0":request.getParameter("card_info");
	card_info = strEncode(card_info);
	String card_restrict = (request.getParameter("card_restrict")==null)? "0":request.getParameter("card_restrict");
	card_restrict = strEncode(card_restrict);
	String coupon_discount = (request.getParameter("coupon_discount")==null)? "0":request.getParameter("coupon_discount");
	String dadaiksun = (request.getParameter("dadaiksun")==null)? "0":request.getParameter("dadaiksun");
	dadaiksun = strEncode(dadaiksun);
	String dadaiksun_info = (request.getParameter("dadaiksun_info")==null)? "0":request.getParameter("dadaiksun_info");
	dadaiksun_info = strEncode(dadaiksun_info);
	String etc_info = (request.getParameter("etc_info")==null)? "0":request.getParameter("etc_info");
	etc_info = strEncode(etc_info);

	try{	
		
		if ( blank_fg.equals("Y") ){
			pd_code = "blank";
			pd_name = "";
			pd_price = "";
			card_discount = "";
			card_startDate = "";
			card_endDate = "";
			card_info = "";
			card_restrict = "";
			coupon_discount = "";
			dadaiksun = "";
			dadaiksun_info = "";
			etc_info = "";
		}
		
		// 해당 전단에서 전달받은 순서 이상 의 전단컨테츠상품들의 순서를 일과 +1 한다.
		sql = "update vm_jundan_prod_content set order_number = order_number+1  "
			+" where ref_jd_no = "+jd_no+" and order_number >= "+pd_order+" ";

		pstmt = conn.prepareStatement(sql);
		pstmt.executeUpdate();

		if ( card_startDate == "" || card_endDate == "" ){
			// 전달받은 정보를 바탕으로 전단상품을 insert 한다.
			sql = "insert into vm_jundan_prod_content (ref_jd_no, order_number, pd_name, price, card_discount, "
		    +" card_info, card_restrict, coupon_discount, dadaiksun, dadaiksun_info, etc, reg_no, reg_date, pd_code ) "
		    +" values( '"
			+jd_no+"', "+pd_order+", '"+pd_name+"', '"+pd_price+"', '"+card_discount+"', '"
			+card_info+"', '"+card_restrict+"', '"+coupon_discount+"', '"+dadaiksun+"', '"+dadaiksun_info+"', '"
			+etc_info+"', '"+user_no+"', now(), '"+pd_code+"' );";
		}else{
			// 전달받은 정보를 바탕으로 전단상품을 insert 한다.
			sql = "insert into vm_jundan_prod_content (ref_jd_no, order_number, pd_name, price, card_discount, card_discount_from_date, "
		    +" card_discount_end_date, card_info, card_restrict, coupon_discount, dadaiksun, dadaiksun_info, etc, reg_no, reg_date, pd_code ) "
		    +" values( '"
			+jd_no+"', "+pd_order+", '"+pd_name+"', '"+pd_price+"', '"+card_discount+"', '"+card_startDate+"', '"
			+card_endDate+"', '"+card_info+"', '"+card_restrict+"', '"+coupon_discount+"', '"+dadaiksun+"', '"+dadaiksun_info+"', '"
			+etc_info+"', '"+user_no+"', now(), '"+pd_code+"');";
		}

		pstmt = conn.prepareStatement(sql);
		pstmt.executeUpdate();

		// 신규입력한 전단상품의 전단상품번호를 select 한다.
		sql = " select max(jd_prod_con_no) as jd_prod_con_no_last from vm_jundan_prod_content;";
	
		stmt = conn.createStatement();
		rs = stmt.executeQuery(sql);
		
		rs.last();
		int listCount = rs.getRow();
		if(listCount == 0){
			out.print("NoN");
			return;
		};
		rs.beforeFirst();
				
		while(rs.next()){
			
			String jd_prod_con_no_last = rs.getString("jd_prod_con_no_last");     // 신규 전단상품번호	

			// 신규입력받은 상품코드의 상품번호(내부관리용)를 select 한다.
			sql = " SELECT a.pd_no as pd_no FROM vm_product AS a WHERE a.pd_code = '"+pd_code+"';";

			stmt = conn.createStatement();
			rs = stmt.executeQuery(sql);
			
			rs.last();
			int listCount1 = rs.getRow();
			if(listCount1 == 0){
				//out.print("NoN");
				//return;

				String pd_no = "";     // 신규 전단상품의 상품번호(내부관리용)	
				String ref_img_no = "";

				// 신규입력된 전단상품의 매핑상품번호로 update 한다.
				sql = "update vm_jundan_prod_content set ref_pd_no = '"+pd_no+"', ref_img_no = '"+ref_img_no+"' "
				+" where jd_prod_con_no = "+jd_prod_con_no_last+"";
		
				pstmt = conn.prepareStatement(sql);
				pstmt.executeUpdate();

			};
			rs.beforeFirst();
					
			while(rs.next()){
				
				String pd_no = rs.getString("pd_no");     // 신규 전단상품의 상품번호(내부관리용)	

				// 신규입력된 전단상품의 매핑상품번호로 update 한다.
				sql = "update vm_jundan_prod_content set ref_pd_no = '"+pd_no+"'  "
				+" where jd_prod_con_no = "+jd_prod_con_no_last+"";
		
				pstmt = conn.prepareStatement(sql);
				pstmt.executeUpdate();

				// 신규입력된 전단상품의 매핑될 이미지번호를 select 한다.
				sql =" SELECT tot.* FROM ( " 
					+" SELECT aa.* "
					+"	FROM ( "
					+"	SELECT b.img_no "
					+"	FROM vm_product AS a "
					+"	INNER JOIN vm_product_image AS b "
					+"	ON a.group_tag = b.group_tag "
					+"	WHERE a.pd_no = "+pd_no
					+"  AND a.group_tag <> '' and b.std_fg = 'Y' "
					+"	ORDER BY b.reg_date desc "
					+"	LIMIT 0,1 "
					+"	) AS aa "
					+"  "
					+"	UNION "
					+"  "
					+"	SELECT ab.* "
					+"	FROM ( "
					+"	SELECT b.img_no "
					+"	FROM vm_product AS a "
					+"	INNER JOIN vm_product_image AS b "
					+"	ON a.pd_code = b.pd_code "
					+"	WHERE a.pd_no = "+pd_no
					+"  and b.std_fg = 'Y' "
					+"	ORDER BY b.reg_date desc "
					+"	LIMIT 0,1 "
					+"	) AS ab "
					+"  ) as tot order by tot.img_no desc limit 0,1; ";
		
				stmt = conn.createStatement();
				rs = stmt.executeQuery(sql);

				rs.last();
				int listCount2 = rs.getRow();
				if(listCount2 == 0){
					out.clear();
					out.print("NoN");
					return;
				};
				rs.beforeFirst();
						
				String ref_img_no;

				while(rs.next()){
				
					if( pd_no.equals("0") ){
						ref_img_no = "70026";
					}else{
						ref_img_no = rs.getString("img_no");     // 신규 전단상품에 매핑할 이미지번호	
					}

					// 신규입력된 전단상품의 매핑상품번호로 update 한다.
					sql = "update vm_jundan_prod_content set ref_img_no = '"+ref_img_no+"'  "
					+" where jd_prod_con_no = "+jd_prod_con_no_last+"";
			
					pstmt = conn.prepareStatement(sql);
					pstmt.executeUpdate();

				};
			};
		};

	}catch(Exception e){
		out.clear();
		out.print("exception error");	
	}finally{
		out.clear();
		out.print("success");
		if(pstmt != null) try{ pstmt.close(); }catch(SQLException sqle) {}
		if(conn != null) try{ conn.close(); }catch(SQLException sqle) {}
	};
	
%>