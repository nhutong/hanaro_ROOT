<%@ page contentType = "text/html;charset=utf-8" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="java.util.*" %>
<%@ page import="org.json.simple.*" %>
<%@ page import="org.json.simple.parser.JSONParser" %>
<%@ page import="java.sql.*" %>
<%@ page import="java.text.*" %>

<%@ include file = "../00_include/dbConn.jsp" %>
<%@ include file = "../00_include/common.jsp" %>

<%@ page import="java.io.BufferedReader" %>
<%@ page import="java.io.InputStreamReader" %>
<%@ page import="java.net.HttpURLConnection" %>
<%@ page import="java.net.URL" %>

<%	
    String jd_no = (request.getParameter("jd_no")==null)? "0":request.getParameter("jd_no");

    String newURL = "https://www.nhhanaromart.com";
    String newURLParameter = "";
    String rcvText = "";

	String clientId = "rMDZmUFsQSwgRorvvckY";//애플리케이션 클라이언트 아이디값";
    String clientSecret = "bP_8wzN4Oq";//애플리케이션 클라이언트 시크릿값";

    String vm_cp_no = "";
    String menu_no = "";      
    String shorten_url = "";

	try{

        sql = " SELECT jd_no, menu_no, ref_company_no AS vm_cp_no, ifnull(length(trim(shorten_url)),0) as shorten_url "
             +" FROM vm_jundan AS a "
             +" WHERE a.jd_no = "+jd_no+" ; ";
     
        stmt = conn.createStatement();
        rs = stmt.executeQuery(sql);
     
        while(rs.next()){

            //해당 전단 있는지 체크
			if (rs.getString("jd_no") == null){
				out.clear();
				out.print("NoN");
				return;
            }

            //중복체크
			if (rs.getInt("shorten_url") <= 10){ // http://... 최소 10자리
            }else{
                out.clear();
				out.print("Dup");
				return;
            }
                        
            vm_cp_no = rs.getString("vm_cp_no");   // 전단 번호
            menu_no = rs.getString("menu_no");   // 전단 번호            
            shorten_url = rs.getString("shorten_url");   // 전단 번호    
        }

        newURLParameter = "?vm_cp_no="+vm_cp_no+"&menu_no="+menu_no+"&jd_no="+jd_no; 
        rcvText = strEncode( newURL + newURLParameter );
     
		String apiURL = "https://openapi.naver.com/v1/util/shorturl?url=" + rcvText;
        URL url = new URL(apiURL);
        HttpURLConnection con = (HttpURLConnection)url.openConnection();
        con.setRequestMethod("GET");
        con.setRequestProperty("X-Naver-Client-Id", clientId);
        con.setRequestProperty("X-Naver-Client-Secret", clientSecret);
        int responseCode = con.getResponseCode();
        BufferedReader br;

        if(responseCode==200) { // 정상 호출
            br = new BufferedReader(new InputStreamReader(con.getInputStream()));
        } else {  // 에러 발생
            br = new BufferedReader(new InputStreamReader(con.getErrorStream()));
        }

        String inputLine;
        StringBuffer responses = new StringBuffer();

        while ((inputLine = br.readLine()) != null) {
            responses.append(inputLine);
            //out.print("inputLine:"+inputLine);
        }

        br.close();

        //new_shorten_url = responses.toString();

        //out.print("new_shorten_url:"+new_shorten_url);
        //
        //{
        //    "result":{
        //        "url":"http://me2.do/5k30NOpo",
        //        "hash":"5k30NOpo",
        //        "orgUrl":"https://www.nhhanaromart.com?vm_cp_no=2&menu_no=4&jd_no=27"},
        //        "message":"ok",
        //        "code":"200"
        //}

        StringBuffer jsonString = responses;

        Object object = JSONValue.parse(jsonString.toString());
        JSONObject jsonObject = (JSONObject)object;
        Object objectResult = jsonObject.get("result");
        JSONObject jsonObjectResult = (JSONObject)objectResult;
        Object objectUrl = jsonObjectResult.get("url");

        String new_shorten_url = (String) jsonObjectResult.get("url");

        //out.println("------------1:"+object);
        //out.println("------------2:"+jsonObject);
        //out.println("------------3:"+objectResult);
        //out.println("------------4:"+jsonObjectResult);
        //out.println("------------5:"+objectUrl);
        //out.println("------------6:"+new_shorten_url);

        ///////////////////update실행
        sql = " Update vm_jundan set shorten_url = '"+new_shorten_url+"' "
             +" WHERE jd_no = "+jd_no+" ; ";

        //out.println("------------7:"+sql);

		pstmt = conn.prepareStatement(sql);
		pstmt.executeUpdate();

        out.clear();
        out.print("success");
	
	}catch(Exception e){
		out.clear();
		out.print("exception error");	
	}finally{
		if(stmt != null) try{ stmt.close(); }catch(SQLException sqle) {};
		if(conn != null) try{ conn.close(); }catch(SQLException sqle) {};
	};
	
%>