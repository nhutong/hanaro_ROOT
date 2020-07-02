<%@ page contentType = "text/html;charset=utf-8" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="java.util.*" %>
<%@ page import="org.json.simple.*" %>
<%@ page import="java.sql.*" %>
<%@ page import="java.text.*" %>

<%@ include file = "../00_include/dbPoolingConn.jsp" %>

<%	
	String vm_cp_no = (request.getParameter("vm_cp_no")==null)? "0":request.getParameter("vm_cp_no");

	JSONObject bdListJSON = new JSONObject();
	
	try{

        sql = " SELECT count(a.jd_prod_con_no)+1 as pdorder_tot from vm_shop_jundan_prod_content as a "
		    + " inner join vm_shop_jundan as b on a.ref_jd_no = b.jd_no " 
		    + " WHERE b.ref_company_no = "+vm_cp_no ;

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
			
			String pdorder_tot   = rs.getString("pdorder_tot");           // 전체상품건수 +1
			
			JSONObject obj = new JSONObject();
						
			obj.put("pdorder_tot", pdorder_tot);

			if(obj != null){
				arr.add(obj);
			}
		};

		bdListJSON.put("PdOrderList", arr);
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