<%@ page contentType = "application/json;charset=utf-8" %>
<%@ page trimDirectiveWhitespaces="true" %>

<%@ page import="java.net.URLEncoder" %>
<%@ page import="java.net.URLDecoder" %>
<%@ page import="org.json.simple.*" %>

<%@ page import="java.util.*" %>
<%@ page import="org.apache.commons.dbutils.DbUtils" %>
<%@ page import="org.apache.commons.dbutils.QueryRunner" %>
<%@ page import="org.apache.commons.dbutils.handlers.MapListHandler" %>
<%@ page import="org.apache.commons.dbutils.handlers.ScalarHandler" %>
<%@ page import="com.google.gson.Gson" %>
<%@ page import="com.google.gson.GsonBuilder" %>

<%@ include file = "../00_include/dbPoolingConn.jsp" %>
<%@ include file = "../00_include/common.jsp" %>

<%
	// https://stackoverflow.com/a/27669890
	// Apache Commons DbUtils : https://commons.apache.org/proper/commons-dbutils/
	// Gson : https://github.com/google/gson
	Gson gson = new GsonBuilder().serializeNulls().create();

	Map<String, Object> results = new HashMap<>();
	
	int userCompanyNo = (Integer)session.getAttribute("userCompanyNo");

	String rs_no = request.getParameter("rs_no") == null ? "0" : request.getParameter("rs_no");
	String company_no = request.getParameter("company_no") == null ? "0" : request.getParameter("company_no");
 
 	try {
		QueryRunner queryRunner = new QueryRunner();

		// 주문 조회 
		String queryList =
			" SELECT rs_no, rs_status_cd, ref_member_no, rs_address1, rs_address2, order_price, r.company_no, delivery_round_id, delivery_manager, "+ 			
			"		 customer_request, comment, payment_type, cash_receipt_flag, cash_receipt_no, " +
			"		 m.name , m.tel, " + 			
			"		 DATE_FORMAT(r.rs_std_date, '%Y-%m-%d %H:%i:%s') AS rs_std_date, " +
			"		 DATE_FORMAT(r.reg_date, '%Y-%m-%d %H:%i:%s') AS reg_date, " +
			"		 DATE_FORMAT(r.lst_date, '%Y-%m-%d %H:%i:%s') AS lst_date, " +
			"		 DATE_FORMAT(rs_std_date, '%Y-%m-%d') AS order_date, " +
			"		(SELECT u.VM_NAME FROM vm_user u WHERE u.VM_NO = r.delivery_manager AND u.VM_ROLE_CD = 'ROLE3') as delivery_manager_name, " + 
			" 		(SELECT c.CODE_NAME FROM vm_code c WHERE c.CODE_GROUP = 'ORDER_STATUS' AND c.CODE = r.rs_status_cd) order_status, " + 
			"       (SELECT concat(delivery_start_time,'-' ,delivery_end_time) FROM vm_delivery_round d WHERE d.round_id = r.delivery_round_id AND d.company_no = r.company_no ) as delivery_time" + 
			" FROM hanaro.vm_reserve r " +
			" LEFT OUTER JOIN vm_member m ON (r.ref_member_no = m.no) " + 
			" WHERE r.company_no = " + company_no + 
			" AND rs_no = " + rs_no ;

		results.put("list", 
			queryRunner.query(
				conn,
				queryList,
				new MapListHandler()
			)
		);

		//results.put("queryList", queryList);

		// 주문 아이템 리스트 조회
		String queryItemList =
			" SELECT @rownum:=@rownum+1 AS rownum, aa.delivery_round_id, aa.round_id "
			+" from "
			+" (SELECT a.rs_no, a.delivery_round_id, b.round_id "
			+" FROM vm_reserve AS a "
			+" INNER join vm_delivery_round AS b "
			+" on a.company_no = b.company_no "
			+" WHERE a.rs_no = "+rs_no+" ) AS aa "
			+" INNER JOIN (SELECT @rownum:=0) T2 "
			+" WHERE aa.delivery_round_id=aa.round_id; ";

		results.put("rs_no_list", 
			queryRunner.query(
				conn,
				queryItemList,
				new MapListHandler()
			)
		);


		JSONObject bdListJSON = new JSONObject();

		sql = " SELECT item_no, rs_no, item_pd_code, item_pd_name, item_qty, item_price, item_amount, reg_no, reg_date, lst_no, lst_date" +
 			" FROM vm_reserve_item " +
			" WHERE rs_no = " + rs_no ;
		stmt = conn.createStatement();
		rs = stmt.executeQuery(sql);
		
		JSONArray arr = new JSONArray();		
		while(rs.next()){
			
			String item_no   = rs.getString("item_no");        // 긴급공지번호
			String set_rs_no = rs.getString("rs_no");   // 긴급공지내용
			String item_pd_code = rs.getString("item_pd_code");   // 긴급공지내용
			String item_pd_name = rs.getString("item_pd_name");   // 긴급공지내용
			String item_qty = rs.getString("item_qty");   // 긴급공지내용
			String item_price = rs.getString("item_price");   // 긴급공지내용
			String item_amount = rs.getString("item_amount");
			String reg_no = rs.getString("reg_no");
			String reg_date = rs.getString("reg_date");
			String lst_no = rs.getString("lst_no");
			String lst_date = rs.getString("lst_date");
			
			JSONObject obj = new JSONObject();
						
			obj.put("item_no", item_no);
			obj.put("rs_no", set_rs_no);
			obj.put("item_pd_code", item_pd_code);
//			obj.put("item_pd_name", java.net.URLDecoder.decode(item_pd_name,"UTF-8"));
			obj.put("item_pd_name", strDecode(item_pd_name));
			obj.put("item_qty", item_qty);
			obj.put("item_price", item_price);
			obj.put("item_amount", item_amount);
			obj.put("reg_no", reg_no);
			obj.put("reg_date", reg_date);
			obj.put("lst_no", lst_no);
			obj.put("lst_date", lst_date);

			if(obj != null){
				arr.add(obj);
			}
		};

		results.put("item_list", arr);
//		out.clear();
//		out.print(bdListJSON);




		String queryDeliveryManagerList =
			" SELECT vm_no, vm_name FROM vm_user u " +
			" WHERE u.VM_ROLE_CD = 'ROLE3' " +
			" AND u.VM_REF_COMPANY_NO =  " + company_no;

		results.put("delivery_manager_list", 
			queryRunner.query(
				conn,
				queryDeliveryManagerList,
				new MapListHandler()
			)
		);

	} catch(Exception se) {
		results.put("error", se.getMessage());

	} finally {
		DbUtils.closeQuietly(conn);

	}

	out.print(gson.toJson(results));
%>
