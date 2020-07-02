<%@ page contentType = "text/html;charset=utf-8" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="java.util.*" %>
<%@ page import="org.json.simple.*" %>
<%@ page import="java.sql.*" %>
<%@ page import="java.text.*" %>

<%@ include file = "../00_include/dbPoolingConn.jsp" %>

<%	
	String stdYear = (request.getParameter("stdYear")==null)? "0":request.getParameter("stdYear");

	JSONObject bdListJSON = new JSONObject();
	
	try{

        sql = " SELECT aa.VM_CP_NAME, ifnull(ab.tot_cnt,0) as tot_cnt, ifnull(ac.tot_cont_cnt,0) as tot_cont_cnt, ifnull(ad.tot_web_cnt,0) as tot_web_cnt, ifnull(ae.tot_app_cnt,0) as tot_app_cnt "
			+ " from vm_company AS aa "
			+ " LEFT OUTER JOIN ( "
			+ " SELECT b.company_no, COUNT(b.no) AS tot_cnt "
			+ " from vm_member AS b "
			+ " WHERE left(b.reg_date,4)  = '"+stdYear+"' "
			+ " GROUP BY b.company_no "
			+ " ) AS ab "
			+ " ON aa.VM_CP_NO = ab.company_no "
			+ " LEFT OUTER JOIN ( "
			+ " SELECT a.vm_cp_no, count(a.CONT_NO) AS tot_cont_cnt "
			+ " from eb_page_contact_log_front AS a "
			+ " WHERE left(a.LST_UPDATE_DATE,4)  = '"+stdYear+"' "
			+ " GROUP BY a.vm_cp_no "
			+ " ) AS ac "
			+ " ON aa.VM_CP_NO = ac.VM_CP_NO "
			+ " LEFT OUTER JOIN ( "
			+ " SELECT a.vm_cp_no, count(a.CONT_NO) AS tot_web_cnt "
			+ " from eb_page_contact_log_front AS a "
			+ " WHERE left(a.LST_UPDATE_DATE,4)  = '"+stdYear+"' "
			+ " AND a.session_id_name = '' and web_fg <> '' "
			+ " GROUP BY a.vm_cp_no "
			+ " ) AS ad "
			+ " ON aa.VM_CP_NO = ad.VM_CP_NO "
			+ " LEFT OUTER JOIN ( "
			+ " SELECT a.vm_cp_no, count(a.CONT_NO) AS tot_app_cnt "
			+ " from eb_page_contact_log_front AS a "
			+ " WHERE left(a.LST_UPDATE_DATE,4)  = '"+stdYear+"' "
			+ " AND a.session_id_name <> '' and web_fg <> '' "
			+ " GROUP BY a.vm_cp_no "
			+ " ) AS ae "
			+ " ON aa.VM_CP_NO = ae.VM_CP_NO "
			+ " WHERE aa.VM_CP_NO <> 0"; 
	
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
			
			String VM_CP_NAME   = rs.getString("VM_CP_NAME");
			String tot_cnt		= rs.getString("tot_cnt");
			String tot_cont_cnt = rs.getString("tot_cont_cnt");
			String tot_web_cnt  = rs.getString("tot_web_cnt");
			String tot_app_cnt  = rs.getString("tot_app_cnt");
			
			JSONObject obj = new JSONObject();
						
			obj.put("VM_CP_NAME", VM_CP_NAME);
			obj.put("tot_cnt", tot_cnt);
			obj.put("tot_cont_cnt", tot_cont_cnt);
			obj.put("tot_web_cnt", tot_web_cnt);
			obj.put("tot_app_cnt", tot_app_cnt);

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