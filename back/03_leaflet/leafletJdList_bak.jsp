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
        sql = " select a.jd_no, concat(date_format(a.from_date,'%y/%m/%d'),' ~ ',date_format(a.to_date,'%m/%d')) AS period "
            +" , ( SELECT count(d.jb_no) FROM vm_jundan_banner AS d where a.jd_no = d.ref_jd_no AND d.visible_fg = 'Y' ) AS banner_cnt "
            +" , ( SELECT count(e.jd_prod_con_no) FROM vm_jundan_prod_content AS e where a.jd_no = e.ref_jd_no ) AS prod_content_cnt "
            +" , ifnull(shorten_url,'') as shorten_url, ifnull(a.show_fg,'N') as show_fg "
            +" FROM vm_jundan as a "
            +" inner join vm_menu AS b on a.menu_no = b.menu_no "
            +" inner join vm_company AS c ON a.ref_company_no = c.vm_cp_no "
            +" WHERE a.ref_company_no = "+userCompanyNo
            +" AND a.menu_no = "+menuNo
            +" AND ifnull(a.del_fg,'N') != 'Y' "
            +" AND a.from_date >= date_add(now(), INTERVAL -2 WEEK) "
            +" AND a.to_date <= date_add(now(), INTERVAL 2 WEEK) "
            +" ORDER BY a.from_date; ";
	

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
                
            String jd_no            = rs.getString("jd_no");            
            String period           = rs.getString("period");           
            String banner_cnt       = rs.getString("banner_cnt");        
            String prod_content_cnt = rs.getString("prod_content_cnt"); 
            String shorten_url      = rs.getString("shorten_url");                

            JSONObject obj = new JSONObject();
                        
            obj.put("jd_no", jd_no);
            obj.put("period", period);
            obj.put("banner_cnt", banner_cnt);
            obj.put("prod_content_cnt", prod_content_cnt);
            obj.put("shorten_url", shorten_url);            

            if(obj != null){
                arr.add(obj);
            }
        };
    
        bdListJSON.put("leaflet_list", arr);
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

