<%@ page contentType = "text/html;charset=utf-8" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="java.util.*" %>
<%@ page import="org.json.simple.*" %>
<%@ page import="java.sql.*" %>
<%@ page import="java.text.*" %>

<%@ include file = "../00_include/dbConn.jsp" %>

<%	
	String userCompanyNo = (request.getParameter("userCompanyNo")==null)? "0":request.getParameter("userCompanyNo");
	String rcv_show_fg = (request.getParameter("rcv_show_fg")==null)? "":request.getParameter("rcv_show_fg");

	
	JSONObject bdListJSON = new JSONObject();
	
	try{

		// 해당 판매장의 메뉴를 리스팅한다..

		sql = " SELECT a.menu_no, a.menu_name, a.menu_type_cd, a.order_number, ifnull(max(b.jd_no),'') AS jd_no "
		+" from vm_menu AS a "
		+" inner join vm_company as c "
		+ " on a.ref_cp_no = c.vm_cp_no "
		+" left outer JOIN ( SELECT jd_no, menu_no from vm_jundan " 
		+" 					 where ref_company_no = '"+userCompanyNo+"' and ifnull(del_fg,'N') != 'Y' "
		+"                    and IFNULL(show_fg,'N') in ( " + rcv_show_fg + " )" 
		+" ) AS b "
		+" ON a.menu_no = b.menu_no "
		+" WHERE ref_cp_no = "+userCompanyNo
		+" and ifnull(a.hide_fg,'') <> 'Y'  "
		+" GROUP BY a.menu_no, a.menu_name, a.menu_type_cd, a.order_number "
		+" order by order_number asc, a.reg_date asc  ;" ;

		//out.print(sql);

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
			
			String menu_no			 = rs.getString("menu_no");          // 메뉴번호
			String menu_name         = rs.getString("menu_name");        // 메뉴명
			String menu_type_cd      = rs.getString("menu_type_cd");     // 메뉴타입코드
			String order_number      = rs.getString("order_number");	 // 정렬순서
			String jd_no             = rs.getString("jd_no");	 // 정렬순서
			
			JSONObject obj = new JSONObject();
			
			obj.put("menu_no", menu_no);
			obj.put("menu_name", menu_name);
			obj.put("menu_type_cd", menu_type_cd);
			obj.put("order_number", order_number);
			obj.put("jd_no", jd_no);
			
			if(obj != null){
				arr.add(obj);
			}
		};

		bdListJSON.put("DateCategoryList", arr);
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