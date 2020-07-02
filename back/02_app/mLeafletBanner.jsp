<%@ page contentType = "text/html;charset=utf-8" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="java.util.*" %>
<%@ page import="org.json.simple.*" %>
<%@ page import="java.sql.*" %>
<%@ page import="java.text.*" %>

<%@ include file = "../00_include/dbPoolingConn.jsp" %>

<%	
	//String userCompanyNo = (request.getParameter("userCompanyNo")==null)? "0":request.getParameter("userCompanyNo");
	//String menuNo = (request.getParameter("menuNo")==null)? "0":request.getParameter("menuNo");
	String rcv_jd_no = (request.getParameter("jd_no")==null)? "0":request.getParameter("jd_no");

	JSONObject bdListJSON = new JSONObject();
	
	try{
	
		if(rcv_jd_no == ""){
			out.clear();
			out.print("NoN");
			return;
		};

		sql = " SELECT a.jd_no, a.menu_no, a.ref_company_no as vm_cp_no, b.jb_no, b.jb_img_path, b.jb_order_no, b.visible_fg "
			 +" FROM vm_jundan AS a "
			 +" INNER JOIN vm_jundan_banner AS b "
			 +" ON a.jd_no = b.ref_jd_no "
			 +" where b.ref_jd_no = "+rcv_jd_no 
			 //+" and a.ref_company_no = "+userCompanyNo
			 //+" AND a.menu_no = "+menuNo
			 //+" AND a.to_date >= date_add(now(), INTERVAL -1 week) "
			 +" and b.visible_fg = 'Y' order by jb_order_no; "; 
	
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
			
			String jd_no = rs.getString("jd_no");   // 전단 번호
			String menu_no = rs.getString("menu_no");   // 메뉴번호			
			String vm_cp_no = rs.getString("vm_cp_no");   // 회사코드
			String jb_no = rs.getString("jb_no");   // 전단배너 번호			
			String jb_img_path = "/upload/"+rs.getString("jb_img_path");     // 전단 이미지경로
			String jb_order_no   = rs.getString("jb_order_no");   // 전단 정렬순서
			String visible_fg   = rs.getString("visible_fg");     // 보이기 여부 
			
			JSONObject obj = new JSONObject();
						
			obj.put("jd_no", jd_no);
			obj.put("menu_no", menu_no);
			obj.put("vm_cp_no", vm_cp_no);			
			obj.put("jb_no", jb_no);
			obj.put("jb_img_path", jb_img_path);
			obj.put("jb_order_no", jb_order_no);
			obj.put("visible_fg", visible_fg);
			
			if(obj != null){
				arr.add(obj);
			}
		};

		bdListJSON.put("BannerList", arr);

		out.clear();
		out.print(bdListJSON);
	
	}catch(Exception e){
		out.print("exception error");	
	}finally{
		if(stmt != null) try{ stmt.close(); }catch(SQLException sqle) {};
		if(conn != null) try{ conn.close(); }catch(SQLException sqle) {};
	};
	
%>