<%@ page contentType = "text/html;charset=utf-8" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="java.util.*" %>
<%@ page import="org.json.simple.*" %>
<%@ page import="java.sql.*" %>
<%@ page import="java.text.*" %>

<%@ include file = "../00_include/dbConn.jsp" %>

<%	
	String companyNo = (request.getParameter("companyNo")==null)? "0":request.getParameter("companyNo");
	String pageNo = (request.getParameter("pageNo")==null)? "0":request.getParameter("pageNo");
	Integer pageNo_new = Integer.parseInt(pageNo);

//	페이징 - 한페이지에 리스팅 row 갯수
	Integer list_size = 6;

//	페이징 - 총 페이징 사이즈 ( 페이징 리스트에 보여줄 페이징 숫자의 갯수 )
	Integer paging_cnt_num = 6;

	JSONObject bdListJSON = new JSONObject();
	
	try{

		sql = "SELECT " 
		+ "  count(p.pm_no) as pd_cnt "
        + "  FROM vm_push_message AS p " 
		+ "  inner join vm_company as a " 
		+ "  on p.vm_cp_no = a.vm_cp_no ";
//		+ "  inner join vm_event as b "
//		+ "  on p.event_no = b.event_no ";
        
		if ( companyNo.equals("0") ){
			sql = sql + " "; 	
		}else{
			sql = sql + "  WHERE p.vm_cp_no = '"+companyNo+"' "; 
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
			
			//전체 Row 갯수
			Integer row_cnt_num   = Integer.parseInt(rs.getString("pd_cnt"));

			//	페이징수를 계산한다.
			Integer total_paging_cnt = (int)(( row_cnt_num - 1) / list_size) + 1;

			//	페이징번호 구하기 ( 시작과 끝)
			Integer paging_init_num = ( (int)(( pageNo_new - 1) / paging_cnt_num)) * paging_cnt_num + 1;
			Integer paging_end_num = paging_init_num + paging_cnt_num - 1;

			if ( total_paging_cnt <= paging_end_num){
				paging_end_num = total_paging_cnt;
			}

			JSONObject obj = new JSONObject();
						
			obj.put("total_paging_cnt", total_paging_cnt);
			obj.put("paging_init_num", paging_init_num);
			obj.put("paging_end_num", paging_end_num);

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