<%@ page contentType = "text/html;charset=utf-8" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="java.util.*" %>
<%@ page import="org.json.simple.*" %>
<%@ page import="java.sql.*" %>
<%@ page import="java.text.*" %>

<%@ include file = "../00_include/dbConn.jsp" %>

<%	
	String pageNo = (request.getParameter("pageNo")==null)? "0":request.getParameter("pageNo");
    String cp_no = (request.getParameter("vm_cp_no")==null)? "0":request.getParameter("vm_cp_no");
	Integer pageNo_new = Integer.parseInt(pageNo);
	String s_date = request.getParameter("s_date") ==  null ? "2019-01-01" : request.getParameter("s_date").trim();
	String e_date = request.getParameter("e_date") ==  null ? "2999-12-31" : request.getParameter("e_date").trim();
	String category = request.getParameter("category") ==  null ? "" : request.getParameter("category").trim();
	String keyword = request.getParameter("keyword") ==  null ? "" : request.getParameter("keyword").trim();
	String status = request.getParameter("status") ==  null ? "" : request.getParameter("status").trim();

//	페이징 - 한페이지에 리스팅 row 갯수
	Integer list_size = 15;

//	페이징 - 총 페이징 사이즈 ( 페이징 리스트에 보여줄 페이징 숫자의 갯수 )
	Integer paging_cnt_num = 10;

	JSONObject bdListJSON = new JSONObject();
	
	try{

		sql = " SELECT COUNT(*) AS pd_cnt "
	+ " from vm_product_image AS a "
	+ " left outer JOIN ( SELECT ba.pd_no, ba.pd_name, ba.pd_code from vm_product AS ba ) AS b "
	+ " ON a.ref_pd_no = b.pd_no "
	+ " inner join (select * from vm_user where vm_ref_company_no <> 0 and vm_role_cd = 'ROLE2') as c "
	+ " on a.reg_no = c.vm_no "
	+ " inner join vm_company as d "
	+ " on c.vm_ref_company_no = d.vm_cp_no "
	+ " left outer join vm_product_image_deldesc as e "
	+ " on a.img_no = e.img_no "
	+ " where 1=1 " +
	("".equals(s_date) || "".equals(e_date) ? "" : " AND '" + s_date + "' <= left(a.reg_date,10) AND left(a.reg_date,10) <= '" + e_date + "'") +
	("".equals(keyword) ? "" : " AND " + category + " LIKE '%" + keyword + "%'");

	if (cp_no.equals("0")){
		sql = sql + "";
	}else{
		sql = sql + " and d.vm_cp_no = "+cp_no;
	}

	if ("all".equals(status)) {
		sql += "  AND ( a.std_fg IS NULL OR a.std_fg = ('N' OR 'S') ) ";
	} else if ("null".equals(status)) {
		sql += " AND a.std_fg IS NULL ";
	} else {
		sql += " AND a.std_fg LIKE '" + status + "' ";
	}

	
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
			
			//전체 Row 갯수
			Integer row_cnt_num   = Integer.parseInt(rs.getString("pd_cnt"));

			//	페이징수를 계산한다.
			Integer total_paging_cnt = (int)(( row_cnt_num - 1) / list_size) + 1;

			//	페이징번호 구하기 ( 시작과 끝)
			Integer paging_init_num = ( (int)(( pageNo_new - 1) / paging_cnt_num)) * paging_cnt_num + 1;
			Integer paging_end_num = paging_init_num + paging_cnt_num - 1;

			if ( total_paging_cnt <= paging_end_num){
				paging_end_num = total_paging_cnt;
			}

			JSONObject obj = new JSONObject();
						
			obj.put("total_paging_cnt", total_paging_cnt);
			obj.put("paging_init_num", paging_init_num);
			obj.put("paging_end_num", paging_end_num);
            obj.put("paging", row_cnt_num);

			if(obj != null){
				arr.add(obj);
			}
		};

		bdListJSON.put("CompanyList", arr);
		out.clear();
		out.print(bdListJSON);
	
	}catch(Exception e){
		out.clear();
		out.print("'exception error");	
	}finally{
		if(stmt != null) try{ stmt.close(); }catch(SQLException sqle) {};
		if(conn != null) try{ conn.close(); }catch(SQLException sqle) {};
	};
	
%>