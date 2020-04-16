<%@ page contentType = "text/html;charset=utf-8" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="java.util.*" %>
<%@ page import="org.json.simple.*" %>
<%@ page import="java.sql.*" %>
<%@ page import="java.text.*" %>

<%@ include file = "../00_include/dbConn.jsp" %>

<%	

	String user_no = (request.getParameter("user_no")==null)? "0":request.getParameter("user_no");
	String pd_order = (request.getParameter("pd_order")==null)? "0":request.getParameter("pd_order");
	String pd_code = (request.getParameter("pd_code")==null)? "0":request.getParameter("pd_code");
	String pd_name = (request.getParameter("pd_name")==null)? "0":request.getParameter("pd_name");
	String pd_price = (request.getParameter("pd_price")==null)? "0":request.getParameter("pd_price");
	String etc_info = (request.getParameter("etc_info")==null)? "0":request.getParameter("etc_info");
	String userCompanyNo = (request.getParameter("userCompanyNo")==null)? "0":request.getParameter("userCompanyNo");

	try{	

		// 신규입력한 전단상품의 전단번호를 temp 테이블에서 select 한다.
		sql = " select jd_no as exist_jd_no from vm_shop_jundan where ref_company_no =  '" + userCompanyNo + "'; " ;

		stmt = conn.createStatement();
		rs = stmt.executeQuery(sql);
			
		rs.last();
		int listCount0 = rs.getRow();
		if(listCount0 == 0){
			out.clear();
			out.print("NoN0");
			return;
		};
		rs.beforeFirst();	
		Integer exist_jd_no = 0;
		while(rs.next()){
			exist_jd_no = rs.getInt("exist_jd_no");     // 신규 전단번호
		}
		
		// 해당 전단에서 전달받은 순서 이상 의 전단컨테츠상품들의 순서를 일과 +1 한다.
		sql = "update vm_shop_jundan_prod_content set order_number = order_number+1  "
			+" where ref_jd_no = "+exist_jd_no+" and order_number >= "+pd_order+" ";

		pstmt = conn.prepareStatement(sql);
		pstmt.executeUpdate();

		// 전달받은 정보를 바탕으로 전단상품을 insert 한다.
		sql = "insert into vm_shop_jundan_prod_content (ref_jd_no, order_number, pd_name, price, etc, reg_no, reg_date ) "
		   +" values( '"
		+exist_jd_no+"', "+pd_order+", '"+pd_name+"', '"+pd_price+"', '"+etc_info+"', '"+user_no+"', now());";

		pstmt = conn.prepareStatement(sql);
		pstmt.executeUpdate();

		// 신규입력한 전단상품의 전단상품번호를 select 한다.
		sql = " select max(jd_prod_con_no) as jd_prod_con_no_last from vm_shop_jundan_prod_content;";
	
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
//	out.print(sql);
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
				sql = "update vm_shop_jundan_prod_content set ref_pd_no = '"+pd_no+"', ref_img_no = '"+ref_img_no+"' "
				+" where jd_prod_con_no = "+jd_prod_con_no_last+"";
		
				pstmt = conn.prepareStatement(sql);
				pstmt.executeUpdate();

			};
			rs.beforeFirst();
					
			while(rs.next()){
				
				String pd_no = rs.getString("pd_no");     // 신규 전단상품의 상품번호(내부관리용)	

				// 신규입력된 전단상품의 매핑상품번호로 update 한다.
				sql = "update vm_shop_jundan_prod_content set ref_pd_no = '"+pd_no+"'  "
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
					+"  AND a.group_tag <> '' "
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
					sql = "update vm_shop_jundan_prod_content set ref_img_no = '"+ref_img_no+"'  "
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