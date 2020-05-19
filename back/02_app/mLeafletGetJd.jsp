<%@ page contentType = "text/html;charset=utf-8" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="java.util.*" %>
<%@ page import="org.json.simple.*" %>
<%@ page import="java.sql.*" %>
<%@ page import="java.text.*" %>

<%@ include file = "../00_include/dbConn.jsp" %>

<%	
	String userCompanyNo = (request.getParameter("userCompanyNo")==null)? "0":request.getParameter("userCompanyNo");
    String menuNo = (request.getParameter("menuNo")==null)? "0":request.getParameter("menuNo");
    String rcv_jd_no = (request.getParameter("rcv_jd_no")==null)? "0":request.getParameter("rcv_jd_no");
	String interval = (request.getParameter("interval")==null)? "0":request.getParameter("interval");
	String rcv_show_fg = (request.getParameter("rcv_show_fg")==null)? "0":request.getParameter("rcv_show_fg");

    int itv = Integer.parseInt(interval);

	JSONObject bdListJSON = new JSONObject();

	int listCountInt = 0;
	
	try{

		if( rcv_jd_no.equals("0") ){
			// 오늘짜 전단 조회
			sql = "	SELECT jd_no "
			+"        FROM vm_jundan AS a "
			+"       WHERE a.ref_company_no = "+userCompanyNo
			+"         and a.menu_no = "+menuNo
			+"         and IFNULL(a.show_fg,'N') in ("+rcv_show_fg+")" 
			+"         and ifnull(del_fg,'N') != 'Y' "
			+"         AND (left(from_date,10) <= left(now(),10) AND left(to_date,10) >= left(now(),10)); ";
	
			stmt = conn.createStatement();
			rs = stmt.executeQuery(sql);
				
			rs.last();
			listCountInt = rs.getRow();	

			if(listCountInt == 0){	

				sql = " SELECT '0' AS jd_no, NOW() AS from_date, NOW() AS to_date, 'Y' AS Show_fg, "
				+" 	case weekday(NOW()) when '0' then '월요일' when '1' then '화요일' when '2' then '수요일' when '3' then '목요일' when '4' then '금요일' when '5' then '토요일' when '6' then '일요일' END AS from_date_weekday, "
				+" 	case weekday(NOW()) when '0' then '월요일' when '1' then '화요일' when '2' then '수요일' when '3' then '목요일' when '4' then '금요일' when '5' then '토요일' when '6' then '일요일' END AS to_date_weekday, "
				+"  (select b.menu_type_cd from vm_menu as b where b.menu_no = '"+menuNo+"' ) AS menu_type_cd, 'Y' as today_fg; ";
	
			}else{

				// 현재 진행중인 전단번호를 추출한다.
				sql = " SELECT a.jd_no, a.from_date, a.to_date, a.Show_fg, "
				+" 			case weekday(a.from_date) "
				+" 			    when '0' then '월요일' "
				+" 				when '1' then '화요일' "
				+" 				when '2' then '수요일' "
				+" 				when '3' then '목요일' "
				+" 				when '4' then '금요일' "
				+" 				when '5' then '토요일' "
				+" 				when '6' then '일요일' "
				+" 			END AS from_date_weekday, " 
				+" 			case weekday(a.to_date) "
				+" 			    when '0' then '월요일' "
				+" 				when '1' then '화요일' "
				+" 				when '2' then '수요일' "
				+" 				when '3' then '목요일' "
				+" 				when '4' then '금요일' "
				+" 				when '5' then '토요일' "
				+" 				when '6' then '일요일' "
				+" 			END AS to_date_weekday, " 				
				+"          b.menu_type_cd, "
				+"          case when left(CURDATE(),10) >= left(a.from_date,10) AND left(CURDATE(),10) <= left(a.to_date,10) then 'Y' ELSE 'N' END AS today_fg "
				+" FROM vm_jundan AS a "
				+" left outer join vm_menu as b on ( a.menu_no = b.menu_no ) "
				+" WHERE a.ref_company_no = "+userCompanyNo
				+" and a.menu_no = "+menuNo
				+" and IFNULL(a.show_fg,'N') in ("+rcv_show_fg+")" 
				+" and ifnull(del_fg,'N') != 'Y' "
				+" and (left(from_date,10) <= left(now(),10) AND left(to_date,10) >= left(now(),10)); ";

			}			

		}else{

			sql = " SELECT a.jd_no, a.from_date, a.to_date, a.Show_fg, "
			+" 			case weekday(a.from_date) "
			+" 			    when '0' then '월요일' "
			+" 				when '1' then '화요일' "
			+" 				when '2' then '수요일' "
			+" 				when '3' then '목요일' "
			+" 				when '4' then '금요일' "
			+" 				when '5' then '토요일' "
			+" 				when '6' then '일요일' "
			+" 			END AS from_date_weekday, " 
			+" 			case weekday(a.to_date) "
			+" 			    when '0' then '월요일' "
			+" 				when '1' then '화요일' "
			+" 				when '2' then '수요일' "
			+" 				when '3' then '목요일' "
			+" 				when '4' then '금요일' "
			+" 				when '5' then '토요일' "
			+" 				when '6' then '일요일' "
			+" 			END AS to_date_weekday, " 				
			+"          b.menu_type_cd, "
			+"          case when left(CURDATE(),10) >= left(a.from_date,10) AND left(CURDATE(),10) <= left(a.to_date,10) then 'Y' ELSE 'N' END AS today_fg "
			+" FROM vm_jundan AS a "
			+" left outer join vm_menu as b on ( a.menu_no = b.menu_no ) "
			+" WHERE a.ref_company_no = "+userCompanyNo
			+" and a.menu_no = "+menuNo
			+" and IFNULL(a.show_fg,'N') in ("+rcv_show_fg+")" 
			+" and ifnull(del_fg,'N') != 'Y' ";
	
			if (itv == -1){
				sql +=  " and a.from_date < ( "
					+" SELECT c.from_date "
					+" FROM vm_jundan AS c "
					+" WHERE c.ref_company_no = "+userCompanyNo
					+" and c.menu_no = "+menuNo
					+" and c.jd_no = "+rcv_jd_no
					+" ) "
					+" order by a.from_date desc limit 0,1; ";
			}else if(itv == 1){
				sql +=  " and a.from_date > ( "
					+" SELECT c.from_date "
					+" FROM vm_jundan AS c "
					+" WHERE c.ref_company_no = "+userCompanyNo
					+" and c.menu_no = "+menuNo
					+" and c.jd_no = "+rcv_jd_no
					+" ) "                   
					+" order by a.from_date asc limit 0,1; ";
			}else{
				sql += " and a.jd_no = "+rcv_jd_no+"; ";
			}
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
			
			String jd_no	   	     = rs.getString("jd_no");                     // 전단 번호
			String from_date         = rs.getString("from_date").substring(5,10); // 전단 시작일자
			String to_date           = rs.getString("to_date").substring(5,10);   // 전단 종료일자
			String from_date_origin  = rs.getString("from_date").substring(0,10);				  // 전단 시작일자 오리진
			String to_date_origin    = rs.getString("to_date").substring(0,10);                   // 전단 종료일자 오리진						
			String from_date_weekday = rs.getString("from_date_weekday").substring(0,1); // 전단 시작요일
			String to_date_weekday   = rs.getString("to_date_weekday").substring(0,1);   // 전단 종료요일
			String show_fg           = rs.getString("show_fg");				             // 전단노출여부
            String menu_type_cd      = rs.getString("menu_type_cd");				             // 메뉴타입
			String today_fg          = rs.getString("today_fg");				             // today여부
			
			String prev_jd_no        = "";
			String next_jd_no        = "";
			
			sql = " SELECT jd_no as prev_jd_no FROM vm_jundan as a WHERE a.ref_company_no = '"+userCompanyNo+"' AND a.menu_no = '"+menuNo+"' AND a.from_date < '"+from_date_origin+"' "
			     +" and IFNULL(a.show_fg,'N') in ("+rcv_show_fg+")" 
			     +" and ifnull(del_fg,'N') != 'Y' "
				 +" ORDER BY a.from_date desc LIMIT 1; ";			
				 
			ResultSet rs2 = null;					
			rs2 = stmt.executeQuery(sql);
			rs2.last();
			rs2.beforeFirst();	
			while(rs2.next()){
				prev_jd_no        = rs2.getString("prev_jd_no");				             // prev_jd_no
			}
			
			sql = " SELECT jd_no as next_jd_no FROM vm_jundan as a WHERE a.ref_company_no = '"+userCompanyNo+"' AND a.menu_no = '"+menuNo+"' AND a.from_date > '"+from_date_origin+"' "
			     +" and IFNULL(a.show_fg,'N') in ("+rcv_show_fg+")" 
			     +" and ifnull(del_fg,'N') != 'Y' "			
			     +" ORDER BY a.from_date LIMIT 1; ";
			ResultSet rs3 = null;					
			rs3 = stmt.executeQuery(sql);
			rs3.last();
			rs3.beforeFirst();	
			while(rs3.next()){
				next_jd_no        = rs3.getString("next_jd_no");				             // next_jd_no
			}		

			JSONObject obj = new JSONObject();
			
			obj.put("jd_no", jd_no);
			obj.put("from_date", from_date);
			obj.put("to_date", to_date);
			obj.put("from_date_origin", from_date_origin);
			obj.put("to_date_origin", to_date_origin);			
			obj.put("from_date_weekday", from_date_weekday);
			obj.put("to_date_weekday", to_date_weekday);	
			obj.put("show_fg", show_fg);	
            obj.put("menu_type_cd", menu_type_cd);				
			obj.put("today_fg", today_fg);				
			obj.put("prev_jd_no", prev_jd_no);				
			obj.put("next_jd_no", next_jd_no);				

			obj.put("sql", sql);				
			
			if(obj != null){
				arr.add(obj);
			}
		};

		bdListJSON.put("List", arr);
		out.clear();
		out.print(bdListJSON);
	
	}catch(Exception e){
		out.clear();
		out.print("exception error"+sql);	
	}finally{
		if(stmt != null) try{ stmt.close(); }catch(SQLException sqle) {};
		if(conn != null) try{ conn.close(); }catch(SQLException sqle) {};
	};
	
%>