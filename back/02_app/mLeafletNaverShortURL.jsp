<%@ page contentType = "text/html;charset=utf-8" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="java.util.*" %>
<%@ page import="org.json.simple.*" %>
<%@ page import="java.sql.*" %>
<%@ page import="java.text.*" %>

<%@ page import="java.io.BufferedReader" %>
<%@ page import="java.io.InputStreamReader" %>
<%@ page import="java.net.HttpURLConnection" %>
<%@ page import="java.net.URL" %>

<%	
	String rcvText = (request.getParameter("rcvText")==null)? "0":request.getParameter("rcvText");

	String clientId = "rMDZmUFsQSwgRorvvckY";//애플리케이션 클라이언트 아이디값";
    String clientSecret = "bP_8wzN4Oq";//애플리케이션 클라이언트 시크릿값";
	
	try{
		// rcvText
		//String text = "https://developers.naver.com/notice";
        //String apiURL = "https://openapi.naver.com/v1/util/shorturl?url=" + text;
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
        }
        br.close();

		out.print(responses.toString());
	
	}catch(Exception e){
		out.print("exception error");	
	}finally{

	};
	
%>