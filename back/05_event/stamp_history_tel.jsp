<%@ page contentType = "text/html;charset=utf-8" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="java.util.*" %>
<%@ page import="org.json.simple.*" %>
<%@ page import="java.sql.*" %>
<%@ page import="java.text.*" %>

<%@ include file = "../00_include/dbPoolingConn.jsp" %>
<%@ include file = "../00_include/common.jsp" %>

<%	

	String rcv_vm_cp_no = (request.getParameter("vm_cp_no")==null)? "0":request.getParameter("vm_cp_no");
	String rcv_tel = (request.getParameter("tel")==null)? "0":request.getParameter("tel");

	JSONObject bdListJSON = new JSONObject();
	
	try{

        sql = " SELECT a.ms_no, a.std_date, d.staff_name  "
			+ " from vm_member_stamp AS a "
			+ " inner join vm_stamp AS b "
			+ " ON b.stamp_no = a.stamp_no "
			+ " INNER JOIN vm_company AS c "
			+ " ON b.company_no = c.VM_CP_NO "
			+ " INNER JOIN vm_staff AS d "
			+ " ON d.company_no = b.company_no and a.pw = d.stamp_pw "
			+ " inner join vm_member as e "
			+ " on a.no = e.no "
		    + " where c.vm_cp_no = '" + rcv_vm_cp_no + "' "
			+ " and e.tel = '"+rcv_tel+"' "
			+ " order by a.std_date desc; "; 

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
			
			String ms_no = rs.getString("ms_no");   // 긴급공지내용
			String std_date = rs.getString("std_date"); 
			String staff_name = rs.getString("staff_name"); 
			
			JSONObject obj = new JSONObject();

			obj.put("ms_no", ms_no);
			obj.put("std_date", std_date);
			obj.put("staff_name", staff_name);

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