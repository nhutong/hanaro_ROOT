<%@ page contentType = "text/html;charset=utf-8" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="java.util.*" %>
<%@ page import="org.json.simple.*" %>
<%@ page import="java.sql.*" %>
<%@ page import="java.text.*" %>

<%@ include file = "../00_include/dbConn.jsp" %>

<%	
	String stdYear = (request.getParameter("stdYear")==null)? "0":request.getParameter("stdYear");
	String vm_cp_no = (request.getParameter("vm_cp_no")==null)? "0":request.getParameter("vm_cp_no");
	String stdMonth = (request.getParameter("stdMonth")==null)? "0":request.getParameter("stdMonth");

	JSONObject bdListJSON = new JSONObject();
	
	try{

        sql = " SELECT aa.db_date, ifnull(ab.tot_cnt,0) as tot_cnt, ifnull(ac.tot_cont_cnt,0) as tot_cont_cnt, ac.stdDay, ac.menu_cd, ac.menu_name, ac.order_number "
			+ " from time_dimension AS aa "
			+ " LEFT OUTER JOIN ( "
			+ " SELECT left(b.reg_date,10) as stdDay, COUNT(b.no) AS tot_cnt "
			+ " from vm_member AS b "
			+ " WHERE left(b.reg_date,4)  = '"+stdYear+"' "
			+ " and substring(b.reg_date,6,2) = '"+stdMonth+"' "
			+ " and b.company_no ='"+vm_cp_no+"' "
			+ " GROUP BY b.company_no, left(b.reg_date,10) "
			+ " ) AS ab "
			+ " ON aa.db_date = ab.stdDay "
			+ " LEFT OUTER JOIN ( "
			+ "SELECT count(a.CONT_NO) AS tot_cont_cnt, left(a.LST_UPDATE_DATE,10) as stdDay, a.menu_cd,"
			+ "						 case when (a.menu_cd = '-1') then '홈' "
			+ "						 	   when (a.menu_cd = '-2') then '쿠폰' "
			+ "						 	   when (a.menu_cd = '-3') then '이벤트' "
			+ "						 	   when (a.menu_cd = '-4') then '장보기' ELSE b.menu_name end as menu_name, "
			+ "						 case when (a.menu_cd = '-1') then  0 "
			+ "						 	   when (a.menu_cd = '-2') then '101' "
			+ "						 	   when (a.menu_cd = '-3') then '102' "
			+ "						 	   when (a.menu_cd = '-4') then '103' ELSE b.order_number end as order_number "
			+ "						 from vm_menu AS b "
			+ "						 RIGHT outer JOIN eb_page_contact_log_front AS a "
			+ "						 ON a.menu_cd = b.menu_no "
			+ "						 WHERE left(a.LST_UPDATE_DATE,4)  = '"+stdYear+"' "
            + "    			 and substring(a.LST_UPDATE_DATE,6,2) = '"+stdMonth+"' "
			+ "						 and a.vm_cp_no = '"+vm_cp_no+"' " 
			+ "						 and a.menu_cd <> '' "			
			+ "						 GROUP BY a.vm_cp_no, left(a.LST_UPDATE_DATE,10), a.menu_cd	"
			+ "						 HAVING menu_name IS NOT null "			
			/*         
			+ " SELECT count(a.CONT_NO) AS tot_cont_cnt, left(a.LST_UPDATE_DATE,10) as stdDay, a.menu_cd, "
			+ " case when (a.menu_cd = '-1') then '홈' "
			+ " 	 when (a.menu_cd = '-2') then '쿠폰' "
			+ " 	  when (a.menu_cd = '-3') then '이벤트'  "
			+ " 	  when (a.menu_cd = '-4') then '장보기' ELSE b.menu_name end as menu_name,  "
			+ " case when (a.menu_cd = '-1') then  0 "
			+ " 	 when (a.menu_cd = '-2') then '101' "
			+ " 	  when (a.menu_cd = '-3') then '102'  "
			+ " 	  when (a.menu_cd = '-4') then '103' ELSE b.order_number end as order_number "
			+ " from vm_menu AS b "
			+ " LEFT OUTER JOIN eb_page_contact_log_front AS a "
			+ " ON a.menu_cd = b.menu_no "
			+ " WHERE left(a.LST_UPDATE_DATE,4)  = '"+stdYear+"' "
			+ " and substring(a.LST_UPDATE_DATE,6,2) = '"+stdMonth+"' "
			+ " and a.vm_cp_no ='"+vm_cp_no+"' " 
			+ " and a.menu_cd <> '' "
			+ " AND b.hide_fg = 'N' "
			+ " GROUP BY a.vm_cp_no, left(a.LST_UPDATE_DATE,10), a.menu_cd "
			+ " UNION "
			+ " SELECT count(a.CONT_NO) AS tot_cont_cnt, left(a.LST_UPDATE_DATE,10) as stdDay, a.menu_cd, "
			+ " case when (a.menu_cd = '-1') then '홈' "
			+ " 	 when (a.menu_cd = '-2') then '쿠폰' "
			+ " 	  when (a.menu_cd = '-3') then '이벤트'  "
			+ " 	  when (a.menu_cd = '-4') then '장보기' ELSE '' end as menu_name,  "
			+ " case when (a.menu_cd = '-1') then  0 "
			+ " 	 when (a.menu_cd = '-2') then '101' "
			+ " 	  when (a.menu_cd = '-3') then '102'  "
			+ " 	  when (a.menu_cd = '-4') then '103' ELSE '' end as order_number "
			+ " from eb_page_contact_log_front AS a "
			+ " WHERE left(a.LST_UPDATE_DATE,4)  = '"+stdYear+"' "
			+ " and substring(a.LST_UPDATE_DATE,6,2) = '"+stdMonth+"' "
			+ " and a.vm_cp_no ='"+vm_cp_no+"' "
			+ " and a.menu_cd IN ('-1','-2','-3','-4') "
			+ " GROUP BY a.vm_cp_no, left(a.LST_UPDATE_DATE,10), a.menu_cd "
			*/			
			+ " ) AS ac "
			+ " ON aa.db_date = ac.stdDay "

			+ " WHERE SUBSTRING(aa.db_date,1,7) = '"+stdYear+"-"+stdMonth+"' "
			+ " order by aa.db_date asc, cast(ac.order_number as unsigned); ";
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
			
			String db_date   = rs.getString("db_date");
			String tot_cnt		= rs.getString("tot_cnt");
			String tot_cont_cnt = rs.getString("tot_cont_cnt");
			String stdDay  = rs.getString("stdDay");
			String menu_cd  = rs.getString("menu_cd");
			String menu_name  = rs.getString("menu_name");
			String order_number  = rs.getString("order_number");
			
			JSONObject obj = new JSONObject();
						
			obj.put("db_date", db_date);
			obj.put("tot_cnt", tot_cnt);
			obj.put("tot_cont_cnt", tot_cont_cnt);
			obj.put("stdDay", stdDay);
			obj.put("menu_cd", menu_cd);
			obj.put("menu_name", menu_name);
			obj.put("order_number", order_number);



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