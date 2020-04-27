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

	JSONObject bdListJSON = new JSONObject();
	
	try{

		// 현재 진행중인 전단번호를 추출한다.
		sql = " SELECT jd_no "
		+" FROM vm_jundan AS a "
		+" WHERE a.ref_company_no = "+userCompanyNo
        +" and a.menu_no = "+menuNo
		+" AND (left(from_date,10) <= left(now(),10) AND left(to_date,10) >= left(now(),10)); ";

		stmt = conn.createStatement();
		rs = stmt.executeQuery(sql);
			
		rs.last();
		int listCountInt = rs.getRow();

		// 현재 진행되는 전단행사가 없으면 오늘날짜 행사 추가
		if(listCountInt == 0){		
			sql = " SELECT jd_no, from_date, menu_type_cd, from_date_weekday, to_date, to_date_weekday, today_fg "
			+" FROM ( "
			+" 		SELECT a.jd_no, a.from_date, b.menu_type_cd, " 
			+" 			case weekday(a.from_date) "
			+" 			when '0' then '월요일' "
			+" 				when '1' then '화요일' "
			+" 				when '2' then '수요일' "
			+" 				when '3' then '목요일' "
			+" 				when '4' then '금요일' "
			+" 				when '5' then '토요일' "
			+" 				when '6' then '일요일' "
			+" 			END AS from_date_weekday, " 
			+" 			a.to_date, "
			+" 			case weekday(a.to_date) "
			+" 			when '0' then '월요일' "
			+" 				when '1' then '화요일' "
			+" 				when '2' then '수요일' "
			+" 				when '3' then '목요일' "
			+" 				when '4' then '금요일' "
			+" 				when '5' then '토요일' "
			+" 				when '6' then '일요일' "
			+" 			END AS to_date_weekday, "
			+"          'N' AS today_fg "
			+" 		FROM vm_jundan as a "
			+" 		inner join vm_menu as b "
			+" 		on a.menu_no = b.menu_no "
			+" 		WHERE a.ref_company_no = "+userCompanyNo
			+" 		AND a.menu_no = "+menuNo
			+"      AND a.from_date <= date_add(now(), INTERVAL 4 WEEK) "
			//+"    AND a.from_date >= date_add(now(), INTERVAL -1 WEEK) "
			//+"    AND a.to_date <= date_add(now(), INTERVAL 1 WEEK) "
			+" 		UNION ALL "
			+" 		SELECT '-1' as jd_no, NOW() AS from_date, "
			+" 		    ( SELECT b.menu_type_cd FROM vm_menu AS b WHERE b.menu_no = "+menuNo+" ) AS menu_type_cd, "
			+" 			case weekday(NOW()) "
			+" 			   when '0' then '월요일' "
			+" 				when '1' then '화요일' "
			+" 				when '2' then '수요일' "
			+" 				when '3' then '목요일' "
			+" 				when '4' then '금요일' "
			+" 				when '5' then '토요일' "
			+" 				when '6' then '일요일' "
			+" 			END AS from_date_weekday, "
			+" 			NOW() as to_date, "
			+" 			case weekday(NOW()) "
			+" 		   	when '0' then '월요일' "
			+" 				when '1' then '화요일' "
			+" 				when '2' then '수요일' "
			+" 				when '3' then '목요일' "
			+" 				when '4' then '금요일' "
			+" 				when '5' then '토요일' "
			+" 				when '6' then '일요일' "
			+" 			END AS to_date_weekday, "
			+"          'Y' AS today_fg "
			+"     ) as c "
			+" order by c.from_date asc ;";
		}else{
			sql = " SELECT "
			+" a.jd_no, a.from_date, b.menu_type_cd, " 
			+" 	case weekday(a.from_date) "
			+" 	    when '0' then '월요일' "
			+" 		when '1' then '화요일' "
			+" 		when '2' then '수요일' "
			+" 		when '3' then '목요일' "
			+" 		when '4' then '금요일' "
			+" 		when '5' then '토요일' "
			+" 		when '6' then '일요일' "
			+" 	END AS from_date_weekday, " 
			+" 	a.to_date, "
			+" 	case weekday(a.to_date) "
			+" 	when '0' then '월요일' "
			+" 		when '1' then '화요일' "
			+" 		when '2' then '수요일' "
			+" 		when '3' then '목요일' "
			+" 		when '4' then '금요일' "
			+" 		when '5' then '토요일' "
			+" 		when '6' then '일요일' "
			+" 	END AS to_date_weekday, "
			+" case when left(CURDATE(),10) >= left(a.from_date,10) AND left(CURDATE(),10) <= left(a.to_date,10) then 'Y' ELSE 'N' END AS today_fg "
			+" FROM vm_jundan as a "
			+" inner join vm_menu as b "
			+" on a.menu_no = b.menu_no "
			+" WHERE a.ref_company_no = "+userCompanyNo
			+" AND a.menu_no = "+menuNo
			+" AND a.from_date <= date_add(now(), INTERVAL 4 WEEK) "
			//+" AND a.from_date >= date_add(now(), INTERVAL -1 WEEK) "
			//+" AND a.to_date <= date_add(now(), INTERVAL 1 WEEK) "
			+" order by a.from_date asc ;";
		}

		rs.beforeFirst();

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
			
			String jd_no			 = rs.getString("jd_no");                     // 전단 번호
			String from_date         = rs.getString("from_date").substring(5,10); // 전단 시작일자
			String to_date           = rs.getString("to_date").substring(5,10);   // 전단 종료일자
			String from_date_origin  = rs.getString("from_date").substring(0,10);				  // 전단 시작일자 오리진
			String to_date_origin    = rs.getString("to_date").substring(0,10);                   // 전단 종료일자 오리진			
			String from_date_weekday = rs.getString("from_date_weekday").substring(0,1); // 전단 시작요일
			String to_date_weekday   = rs.getString("to_date_weekday").substring(0,1);   // 전단 종료요일
			String menu_type_cd      = rs.getString("menu_type_cd");
			String today_fg          = rs.getString("today_fg");			
			
			JSONObject obj = new JSONObject();
			
			obj.put("jd_no", jd_no);
			obj.put("from_date", from_date);
			obj.put("to_date", to_date);
			obj.put("from_date_origin", from_date_origin);
			obj.put("to_date_origin", to_date_origin);			
			obj.put("from_date_weekday", from_date_weekday);
			obj.put("to_date_weekday", to_date_weekday);
			obj.put("menu_type_cd", menu_type_cd);
			obj.put("today_fg", today_fg);			
			
			if(obj != null){
				arr.add(obj);
			}
		};

		bdListJSON.put("DateCategoryList", arr);
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