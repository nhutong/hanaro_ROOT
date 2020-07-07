<%@ page contentType = "text/html;charset=utf-8" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="java.util.*" %>
<%@ page import="org.json.simple.*" %>
<%@ page import="java.sql.*" %>
<%@ page import="java.text.*" %>

<%@ include file = "../00_include/dbConn.jsp" %>

<%	
	String userCompanyNo = (request.getParameter("userCompanyNo")==null)? "0":request.getParameter("userCompanyNo");

	JSONObject bdListJSON = new JSONObject();
	
	try{

		//if (userCompanyNo != "0"){
           //sql = " SELECT a.VM_CP_NO, a.VM_CP_NAME from vm_company AS a "
		   //+" where vm_cp_no = "+userCompanyNo; 
		//}else{
		   //sql = " SELECT a.VM_CP_NO, a.VM_CP_NAME from vm_company AS a ";
		//}

		if (userCompanyNo.equals("0")){
		   sql = " SELECT a.VM_CP_NO, CONCAT(a.VM_CP_NAME,'(',VM_CP_NO,')') as VM_CP_NAME from vm_company AS a "
		   +" order by vm_cp_name; ";
		}else{
		   sql = " SELECT a.VM_CP_NO, CONCAT(a.VM_CP_NAME,'(',VM_CP_NO,')') as VM_CP_NAME from vm_company AS a "
		   +" where vm_cp_no = "+userCompanyNo+" order by vm_cp_name; "; 
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
			
			String VM_CP_NO   = rs.getString("VM_CP_NO");     // 판매장번호
			String VM_CP_NAME = rs.getString("VM_CP_NAME");   // 판매장명
			
			JSONObject obj = new JSONObject();
						
			obj.put("VM_CP_NO", VM_CP_NO);
			obj.put("VM_CP_NAME", VM_CP_NAME);

			if(obj != null){
				arr.add(obj);
			}
		};

		bdListJSON.put("CompanyList", arr);
		//out.clear();
		out.print(bdListJSON);
	
	}catch(Exception e){
		out.clear();
		out.print("'exception error");	
	}finally{
		if(stmt != null) try{ stmt.close(); }catch(SQLException sqle) {};
		if(conn != null) try{ conn.close(); }catch(SQLException sqle) {};
	};
	
%>