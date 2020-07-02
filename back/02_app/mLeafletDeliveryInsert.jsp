<%@ page contentType = "text/html;charset=utf-8" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="java.net.URLDecoder"%>
<%@ page import="java.util.*" %>
<%@ page import="org.json.simple.*" %>
<%@ page import="java.sql.*" %>
<%@ page import="java.text.*" %>

<%@ include file = "../00_include/dbPoolingConn.jsp" %>
<%@ include file = "../00_include/common.jsp" %>

<%	
	String memberNo = (request.getParameter("memberNo")==null)? "":request.getParameter("memberNo");
	String address1 = (request.getParameter("address1")==null)? "0":request.getParameter("address1");
	String address2 = (request.getParameter("address2")==null)? "0":request.getParameter("address2");
	String del_time_select = (request.getParameter("del_time_select")==null)? "0":request.getParameter("del_time_select");
	String vm_cp_no = (request.getParameter("vm_cp_no")==null)? "0":request.getParameter("vm_cp_no");
	String price_total = (request.getParameter("price_total")==null)? "0":request.getParameter("price_total");

	/* 해당날짜의 존재여부 확인 및 날짜 정보 가져옴 20191230 */
	sql = "SELECT a.weekend_flag, a.holiday_flag, a.day_name, a.db_date from time_dimension AS a WHERE db_date = LEFT(NOW(),10); ";

	stmt = conn.createStatement();
	rs = stmt.executeQuery(sql);

	rs.last();
	int listCount = rs.getRow();
	if(listCount == 0){
		out.clear();
		/* 날짜가 존재하지 않음 */
		out.print("NoN");
		return;
	};
	rs.beforeFirst();

	String weekend_flag ="";
	String holiday_flag ="";
	String day_name ="";
	String db_date ="";

	while(rs.next()){
		weekend_flag = rs.getString("weekend_flag");
		holiday_flag = rs.getString("holiday_flag");
		day_name = rs.getString("day_name");
		db_date = rs.getString("db_date");
	};

	/* 해당 판매장의 해당 회차의 정보까지 가져온다. */
	sql = " SELECT ifnull(a.undeliverable_weekend_flag,'') as undeliverable_weekend_flag, ifnull(a.undeliverable_holiday_flag,'') as undeliverable_holiday_flag, ifnull(a.undeliverable_day,'') as undeliverable_day, "
		 +" ifnull(a.undeliverable_date_start,'') as undeliverable_date_start, ifnull(a.undeliverable_date_end,'') as undeliverable_date_end, ifnull(a.min_amount,0) as min_amount, ifnull(b.order_closing_cnt,10000) as order_closing_cnt, "
		 + " (b.delivery_start_time - CONCAT( substring(NOW(),12,2),substring(NOW(),15,2))) as start_after, " 
		 + " (b.delivery_end_time - CONCAT( substring(NOW(),12,2),substring(NOW(),15,2))) as end_after "
		 +" from vm_delivery_master AS a "
		 +" INNER JOIN vm_delivery_round AS b "
		 +" ON a.company_no = b.company_no "
		 +" WHERE a.company_no = " + vm_cp_no
		 +" AND b.round_id = " + del_time_select
		 +" AND b.open_flag = 'Y'; ";
	
	stmt = conn.createStatement();
	rs = stmt.executeQuery(sql);

	rs.last();
	int listCount1 = rs.getRow();
	if(listCount1 == 0){
		out.clear();
		/* 해당판매장의 배송정보가 존재하지 않습니다. */
		out.print("DevNoN");
		return;
	};
	rs.beforeFirst();

	String undeliverable_weekend_flag ="";
	String undeliverable_holiday_flag ="";
	String undeliverable_day ="";
	String undeliverable_date_start ="";
	String undeliverable_date_end ="";
	String min_amount ="0";
	String order_closing_cnt ="";
	String start_after ="";
	String end_after ="";

	while(rs.next()){
		undeliverable_weekend_flag = rs.getString("undeliverable_weekend_flag");
		undeliverable_holiday_flag = rs.getString("undeliverable_holiday_flag");
		undeliverable_day = rs.getString("undeliverable_day");
		undeliverable_date_start = rs.getString("undeliverable_date_start");
		undeliverable_date_end = rs.getString("undeliverable_date_end");
		min_amount = rs.getString("min_amount");
		order_closing_cnt = rs.getString("order_closing_cnt");
		start_after = rs.getString("start_after");
		end_after = rs.getString("end_after");
	};

	if ( undeliverable_weekend_flag == "Y" && weekend_flag == "Y" ){
		/* 해당판매장은 주말배송이 불가하며, 금일은 주말입니다. */
		out.clear();
		out.print("DevWeekendFalse");
		return;	
	}

	if ( undeliverable_holiday_flag == "Y" && holiday_flag == "Y" ){
		/* 해당판매장은 주말배송이 불가하며, 금일은 주말입니다. */
		out.clear();
		out.print("DevHolidayFalse");
		return;	
	}

	if ( !undeliverable_day.equals("") && undeliverable_day == day_name ){
		/* 해당판매장은 해당요일에 배송이 불가합니다. */
		out.clear();
		out.print("DevDayFalse");
		return;	
	}

	if (!undeliverable_date_start.equals("") && !undeliverable_date_end.equals("")){
		if ( db_date.compareTo(undeliverable_date_start) == 1 && undeliverable_date_end.compareTo(db_date) == 1 ){		
		}else{
			/* 해당판매장은 해당기간에 배송이 불가합니다. */
			out.clear();
			out.print("DevDayIntervalFalse");
			return;	
		}
	}

	if ( Integer.parseInt(price_total) >= Integer.parseInt(min_amount) ){		
	}else{
		/* 최소금액 이상만 배송이 가능합니다. */
		out.clear();
		out.print("DevPriceFalse");
		return;	
	}

	/* 해당 판매장의 해당 회차의 정보까지 가져온다. */
	sql = " select count(a.rs_no) as rs_cnt "
		 +" from vm_reserve AS a "
		 +" WHERE a.company_no = " + vm_cp_no
		 +" AND left(a.rs_std_date,10) = left(now(),10); ";
	
	stmt = conn.createStatement();
	rs = stmt.executeQuery(sql);

	String rs_cnt = "0";

	rs.last();
	int listCount2 = rs.getRow();
	if(listCount2 == 0){
		out.clear();
		/* 해당판매장의 배송주문이 없습니다. */
//		out.print("DevNoN");
//		return;
	};
	rs.beforeFirst();

	while(rs.next()){
		rs_cnt = rs.getString("rs_cnt");
	};

	if ( (Integer.parseInt(rs_cnt) > Integer.parseInt(order_closing_cnt)) || Integer.parseInt(start_after) >= 0 || Integer.parseInt(end_after) <= 0 ){		
		/* 금일 배송은 마감되었습니다. */
		out.clear();
		out.print("DevFalse");
		return;	
	}

	try{

		/* 배송주문 마스터에 insert */
		sql = " insert into vm_reserve (rs_status_cd, rs_std_date, ref_member_no, rs_address1, rs_address2, order_price, company_no, delivery_round_id, reg_date ) "
			 +" select '101', now(),  no, '"+java.net.URLDecoder.decode(address1,"UTF-8")+"', '"+java.net.URLDecoder.decode(address2,"UTF-8")+"', "+Integer.parseInt(price_total)+", "+Integer.parseInt(vm_cp_no)+", "+Integer.parseInt(del_time_select)+", now() " 
			 +" from vm_member where no = '"+memberNo+"'; ";
				
		pstmt = conn.prepareStatement(sql);
		pstmt.executeUpdate();

		/* 새롭게 생성된 배송주문번호를 select 한다. */
		sql = " select a.rs_no "
			 +" from vm_reserve AS a "
			 +" inner join vm_member as b "
			 +" on a.ref_member_no = b.no "
			 +" WHERE a.company_no = " + vm_cp_no
			 +" and b.no = '"+memberNo+"' order by rs_no desc limit 0,1 ";
		
		stmt = conn.createStatement();
		rs = stmt.executeQuery(sql);

		String new_rs_no = "0";

		while(rs.next()){
			new_rs_no = rs.getString("rs_no");
		};

		/* 배송주문 마스터 아이템에 insert */
		sql = " insert into vm_reserve_item (rs_no, item_pd_code, item_pd_name, item_qty, item_price, item_amount, reg_date) "
			 +" SELECT "+Integer.parseInt(new_rs_no)+", c.pd_code, b.pd_name, a.jang_cnt, b.price, (a.jang_cnt * b.price) AS item_amount, NOW() "
			 +" from vm_shop_jundan_zang AS a "
			 +" INNER JOIN vm_shop_jundan_prod_content AS b "
			 +" ON a.jd_prod_con_no = b.jd_prod_con_no "
			 +" INNER JOIN vm_product AS c "
			 +" ON b.ref_pd_no = c.pd_no "
			 +" WHERE a.vm_cp_no = "+vm_cp_no
			 +" AND a.no = '"+memberNo+"'; ";
//out.print(sql);				
		pstmt = conn.prepareStatement(sql);
		pstmt.executeUpdate();

		/* 장바구니에 있는 상품 모두 지우기 */
		sql = " delete from vm_shop_jundan_zang  "
			 +" WHERE vm_cp_no = "+vm_cp_no
			 +" AND no = '"+memberNo+"'; ";
				
		pstmt = conn.prepareStatement(sql);
		pstmt.executeUpdate();

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