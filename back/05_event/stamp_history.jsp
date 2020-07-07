<%@ page contentType = "text/html;charset=utf-8" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="java.util.*" %>
<%@ page import="org.json.simple.*" %>
<%@ page import="java.sql.*" %>
<%@ page import="java.text.*" %>

<%@ include file = "../00_include/dbConn.jsp" %>
<%@ include file = "../00_include/common.jsp" %>

<%	

	String rcv_vm_cp_no = (request.getParameter("vm_cp_no")==null)? "0":request.getParameter("vm_cp_no");
	String rcvKeyword = (request.getParameter("rcvKeyword")==null)? "0":request.getParameter("rcvKeyword");

	JSONObject bdListJSON = new JSONObject();
	
	try{

        sql = " SELECT c.vm_cp_no, c.VM_CP_NAME, d.tel, b.stamp_no, left(b.start_date,10) as start_date, left(b.end_date,10) as end_date, count(a.ms_no) as ms_cnt  "
			+ " from vm_member_stamp AS a "
			+ " inner join vm_stamp AS b "
			+ " ON b.stamp_no = a.stamp_no "
			+ " INNER JOIN vm_company AS c "
			+ " ON b.company_no = c.VM_CP_NO "
			+ " inner join vm_member as d "
			+ " on a.no = d.no "
		    + " where c.vm_cp_no = '" + rcv_vm_cp_no + "' and status = 'Y' ";
			
			if (strDecode(rcvKeyword).equals("")){
			}else{
				sql = sql + " and a.tel like '%"+strDecode(rcvKeyword)+"%' ";
			}
			
			sql = sql +" group by c.vm_cp_no, c.VM_CP_NAME, d.tel, b.stamp_no, b.start_date, b.end_date "; 
			sql = sql +" order by c.vm_cp_no desc "; 

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
			
			String vm_cp_no = rs.getString("vm_cp_no");   // 긴급공지내용
			String VM_CP_NAME = rs.getString("VM_CP_NAME");   // 긴급공지내용
			String tel = rs.getString("tel");   // 긴급공지내용
			String ms_cnt = rs.getString("ms_cnt");   // 긴급공지내용
			String stamp_no = rs.getString("stamp_no"); 
			String start_date = rs.getString("start_date"); 
			String end_date = rs.getString("end_date"); 
			
			JSONObject obj = new JSONObject();
						
			obj.put("vm_cp_no", vm_cp_no);
			obj.put("VM_CP_NAME", VM_CP_NAME);
			obj.put("tel", tel);
			obj.put("ms_cnt", ms_cnt);
			obj.put("stamp_no", stamp_no);
			obj.put("start_date", start_date);
			obj.put("end_date", end_date);

			if(obj != null){
				arr.add(obj);
			}
		};

		bdListJSON.put("CompanyList", arr);
		out.clear();
		out.print(bdListJSON);
//	out.print(sql);
	}catch(Exception e){
		out.clear();
		out.print("exception error");	
	}finally{
		if(stmt != null) try{ stmt.close(); }catch(SQLException sqle) {};
		if(conn != null) try{ conn.close(); }catch(SQLException sqle) {};
	};
	
%>