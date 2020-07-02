<%@ page contentType = "text/html;charset=utf-8" %>
<%@ page import="java.sql.*" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="java.util.*" %>
<%@ page import="org.json.simple.*" %>
<%@ page import="java.text.*" %>
<%@ include file = "../00_include/dbPoolingConn.jsp" %>


<%	

    String tel = request.getParameter("tel")==null? "":request.getParameter("tel");

    JSONObject bdListJSON = new JSONObject();

    try{

        sql = "select no, name, tel, company_no, agree_privacy, agree_push, agree_location, reg_date, "
            + " last_date, member_status_cd, usim, memo, address1, address2, push_agree_date, "
            + " push_disagree_date, push_token, push_user_agent, mem_resign_date, mem_resign_fg "
            + " from vm_member where tel = '"+tel+"' ; ";

        stmt = conn.createStatement();
        rs = stmt.executeQuery(sql);
        rs.last(); 
        int listCount = rs.getRow(); // 현재 커서의 row Index값을 저장 
        
        if(listCount == 0){
            out.clear();
            out.print("unmember");
            return;
        }
        rs.beforeFirst();
            
        JSONArray arr = new JSONArray();		
        while(rs.next()){
            
            String no = rs.getString("no");
            String name = rs.getString("name");
            //String tel = rs.getString("tel");
            String company_no = rs.getString("company_no");
            String agree_privacy = rs.getString("agree_privacy");
            String agree_push = rs.getString("agree_push");
            String agree_location = rs.getString("agree_location");
            String reg_date = rs.getString("reg_date");
            String last_date = rs.getString("last_date");
            String member_status_cd = rs.getString("member_status_cd");
            String usim = rs.getString("usim");
            String memo = rs.getString("memo");
            String address1 = rs.getString("address1");
            String address2 = rs.getString("address2");
            String push_agree_date = rs.getString("push_agree_date");
            String push_disagree_date = rs.getString("push_disagree_date");
            String push_token = rs.getString("push_token");
            String push_user_agent = rs.getString("push_user_agent");
            String mem_resign_date = rs.getString("mem_resign_date");
            String mem_resign_fg = rs.getString("mem_resign_fg");

            JSONObject obj = new JSONObject();

            obj.put("no", no);
            obj.put("name", name);
            //obj.put("tel", tel);
            obj.put("company_no", company_no);
            obj.put("agree_privacy", agree_privacy);
            obj.put("agree_push", agree_push);
            obj.put("agree_location", agree_location);
            obj.put("reg_date", reg_date);
            obj.put("last_date", last_date);
            obj.put("member_status_cd", member_status_cd);
            obj.put("usim", usim);
            obj.put("memo", memo);
            obj.put("address1", address1);
            obj.put("address2", address2);
            obj.put("push_agree_date", push_agree_date);
            obj.put("push_disagree_date", push_disagree_date);
            obj.put("push_token", push_token);
            obj.put("push_user_agent", push_user_agent);
            obj.put("mem_resign_date", mem_resign_date);
            obj.put("mem_resign_fg", mem_resign_fg);
            
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
		out.clear();
		out.println("ERROR");		
		return;
	}
	finally
	{	
	 	if(pstmt != null) try { pstmt.close(); } catch(SQLException sqle) {}
   		if(conn != null) try { conn.close(); } catch(SQLException sqle) {}
	}

%>
