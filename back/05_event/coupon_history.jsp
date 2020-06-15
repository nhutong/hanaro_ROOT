<%@ page contentType = "text/html;charset=utf-8" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="java.util.*" %>
<%@ page import="org.json.simple.*" %>
<%@ page import="java.sql.*" %>
<%@ page import="java.text.*" %>

<%@ include file = "../00_include/dbConn.jsp" %>
<%@ include file = "../00_include/common.jsp" %>

<%	

	String vm_cp_no = (request.getParameter("vm_cp_no")==null)? "0":request.getParameter("vm_cp_no");
	String rcvKeyword1 = (request.getParameter("rcvKeyword1")==null)? "0":request.getParameter("rcvKeyword1");
	String rcvKeyword2 = (request.getParameter("rcvKeyword2")==null)? "0":request.getParameter("rcvKeyword2");	
	String cp_start_date = (request.getParameter("cp_start_date")==null)? "0":request.getParameter("cp_start_date");
	String cp_end_date = (request.getParameter("cp_end_date")==null)? "0":request.getParameter("cp_end_date");

	//cp_start_date = cp_start_date.replaceAll("-", "");
	//cp_end_date = cp_end_date.replaceAll("-", "");

	JSONObject bdListJSON = new JSONObject();
	
	try{

        sql = " SELECT case when ifnull(a.staff_cert_fg,'N') = 'Y' then staff_cert_date ELSE a.reg_date END AS std_date, "
			+ " c.VM_CP_NAME, d.tel, d.`no` AS mem_no, b.coupon_code, ifnull(a.staff_cert_fg,'N') as staff_cert_fg, replace(concat(mid(b.start_date,6,5),'~',mid(b.end_date,6,5)),'-','/') as cp_date "
			+ " from vm_member_coupon AS a "
			+ " INNER JOIN vm_coupon AS b "
			+ " ON a.coupon_no = b.coupon_no "
			+ " INNER JOIN vm_company AS c "
			+ " ON b.company_no = c.VM_CP_NO "
			+ " left outer JOIN vm_member AS d "
			+ " ON a.member_no = d.`no` "
			+ " where c.vm_cp_no = '" + vm_cp_no + "' "
			//+ "  and ( left(b.start_date,10) <= left('"+cp_start_date+"',10) AND left(b.end_date,10) >= left('"+cp_end_date+"',10) ) ";
			// 조회조건 변경 20200612 김중백
			+ "  and (( left(b.start_date,10) >= left('"+cp_start_date+"',10) AND left(b.start_date,10) <= left('"+cp_end_date+"',10) ) "
			+ "  or ( left(b.end_date,10) >= left('"+cp_start_date+"',10) AND left(b.end_date,10) <= left('"+cp_end_date+"',10) )) ";
			
			if (strDecode(rcvKeyword1).equals("")){
			}else{
				sql = sql + " and d.tel like '%"+strDecode(rcvKeyword1)+"%' ";
			}

			if (strDecode(rcvKeyword2).equals("")){
			}else{
				sql = sql + " and b.coupon_code like '%"+strDecode(rcvKeyword2)+"%' ";
			}			

			sql = sql +" order by a.reg_date desc "; 

		out.print(sql);			

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
			
			String std_date   = rs.getString("std_date");        // 긴급공지번호
			String VM_CP_NAME = rs.getString("VM_CP_NAME");   // 긴급공지내용
			String tel = rs.getString("tel");   // 긴급공지내용
			String mem_no = rs.getString("mem_no");   // 긴급공지내용
			String coupon_code = rs.getString("coupon_code");
			String staff_cert_fg = rs.getString("staff_cert_fg");
			String cp_date = rs.getString("cp_date");
			
			JSONObject obj = new JSONObject();
						
			obj.put("std_date", std_date);
			obj.put("VM_CP_NAME", VM_CP_NAME);
			obj.put("tel", tel);
			obj.put("mem_no", mem_no);
			obj.put("coupon_code", coupon_code);
			obj.put("staff_cert_fg", staff_cert_fg);
			obj.put("cp_date", cp_date);

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