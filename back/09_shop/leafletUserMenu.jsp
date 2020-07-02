<%@ page contentType = "text/html;charset=utf-8" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="java.util.*" %>
<%@ page import="org.json.simple.*" %>
<%@ page import="java.sql.*" %>
<%@ page import="java.text.*" %>

<%@ include file = "../00_include/dbPoolingConn.jsp" %>

<%	
	String userCompanyNo = (request.getParameter("userCompanyNo")==null)? "0":request.getParameter("userCompanyNo");

	JSONObject bdListJSON = new JSONObject();
	
	try{

//        sql = " SELECT menu_no, menu_name, menu_type_cd from vm_menu "
//	    +" WHERE ref_cp_no = "+userCompanyNo
//		+" and hide_fg = 'N' "
//		+" order by order_number asc ;" ;

		sql = " SELECT a.menu_no, a.menu_name, a.menu_type_cd, b.jd_no "
		+" from vm_menu AS a "
		+" left outer JOIN ( SELECT jd_no, menu_no from vm_jundan " 
//		+" 						where left(from_date,10) >= left(NOW(),10) "
//		+"						AND ref_company_no = '"+userCompanyNo+"' "

		+" 						where ref_company_no = '"+userCompanyNo+"' "

		//+"				GROUP BY menu_no "
		//+"				ORDER BY from_date asc "
		//+"				limit 0,1  
		+" ) AS b "
		+" ON a.menu_no = b.menu_no "
		+" WHERE ref_cp_no = "+userCompanyNo
		+" and hide_fg = 'N'  "
		+" order by order_number asc  ;" ;

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
			
			String menu_no   = rs.getString("menu_no");           // 메뉴번호
			String menu_name = rs.getString("menu_name");         // 메뉴명
			String menu_type_cd = rs.getString("menu_type_cd");   // 메뉴타입코드
			String jd_no = rs.getString("jd_no");                 // 전단번호
			
			JSONObject obj = new JSONObject();
						
			obj.put("menu_no", menu_no);
			obj.put("menu_name", menu_name);
			obj.put("menu_type_cd", menu_type_cd);
			obj.put("jd_no", jd_no);

			if(obj != null){
				arr.add(obj);
			}
		};

		bdListJSON.put("myplanb_menu", arr);
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