<%@ page contentType = "text/html;charset=utf-8" %>
<%@ page import="java.sql.*" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="java.util.*" %>
<%@ page import="org.json.simple.*" %>
<%@ page import="java.text.*" %>
<%@ include file = "../00_include/dbPoolingConn.jsp" %>

<%	

	String memberNo = request.getParameter("memberNo")==null? "":request.getParameter("memberNo"); // 이름

	if( memberNo == "" || memberNo.equals("null") ) {
        out.clear();
        out.print("param empty");
		return;
	}

    JSONObject bdListJSON = new JSONObject();

	try
	{
		sql = "select tel, usim from vm_member where no = '"+memberNo+"' ; ";

		stmt = conn.createStatement();
		rs = stmt.executeQuery(sql);
		rs.last(); 
		int listCount = rs.getRow(); // 현재 커서의 row Index값을 저장 
		if(listCount == 0){
			out.clear();
			out.print("NoN");
			return;
        }
        
		rs.beforeFirst();
		
        JSONArray arr = new JSONArray();
        		
		while(rs.next()){
			
			String usim   = rs.getString("usim");   // 회원번호
			String tel = rs.getString("tel");   // 회원전화번호
			
			JSONObject obj = new JSONObject();
						
			obj.put("usim", usim);
			obj.put("tel", tel);

			if(obj != null){
				arr.add(obj);
			}
		};

		bdListJSON.put("memberList", arr);
		out.clear();
		out.print(bdListJSON);

	}	
	catch(Exception e)
	{		
		out.println("ERROR");		
		//out.println(e.getMessage());
		return;
	}
	finally
	{	
	 	if(stmt != null) try { stmt.close(); } catch(SQLException sqle) {}
   		if(conn != null) try { conn.close(); } catch(SQLException sqle) {}
	}

%>
