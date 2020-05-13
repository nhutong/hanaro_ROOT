<%@ page contentType = "text/html;charset=utf-8" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="java.net.URLDecoder" %>
<%@ page import="java.util.*" %>
<%@ page import="org.json.simple.*" %>
<%@ page import="java.sql.*" %>
<%@ page import="java.text.*" %>

<%@ include file = "../00_include/dbConn.jsp" %>
<%@ include file = "../00_include/common.jsp" %>


<%	
	String memberNo = (request.getParameter("memberNo")==null)? "0":request.getParameter("memberNo");
	String vm_cp_no = (request.getParameter("vm_cp_no")==null)? "0":request.getParameter("vm_cp_no");

	JSONObject bdListJSON = new JSONObject();
	
	try{

		//sql = " SELECT count(s.vmjz_no) as zzim_cnt from vm_jundan_zzim as s where vm_cp_no = "+vm_cp_no+" and no = '"+memberNo+"'; ";
		sql = " SELECT count(s.vmjz_no) as zzim_cnt "
		+" from vm_jundan_zzim as s "
		+" left outer join vm_jundan_prod_content as t on s.jd_prod_con_no = t.jd_prod_con_no "
		+" left outer join vm_jundan as u on u.jd_no = t.ref_jd_no "
		+" where s.vm_cp_no = "+vm_cp_no
		+" and s.no = "+memberNo
		+" and left(u.to_date,10) >= left(now(),10) ;";

		stmt = conn.createStatement();
		rs = stmt.executeQuery(sql);

		String zzim_cnt = "0";

		rs.last();
		int listCount = rs.getRow();
		if(listCount == 0){
//			out.clear();
//			out.print("NoN");
//			return;
		};
		rs.beforeFirst();
		
		JSONArray arr = new JSONArray();		
		while(rs.next()){
			
			zzim_cnt		   = rs.getString("zzim_cnt");						  // 전단 상품번호
			
			JSONObject obj = new JSONObject();

			obj.put("zzim_cnt", zzim_cnt);
			
			if(obj != null){
				arr.add(obj);
			}
		};

		bdListJSON.put("PdContentList", arr);
		out.clear();
		out.print(bdListJSON);
	
	}catch(Exception e){
		out.print("exception error");	
	}finally{
		if(stmt != null) try{ stmt.close(); }catch(SQLException sqle) {};
		if(conn != null) try{ conn.close(); }catch(SQLException sqle) {};
	};
	
%>