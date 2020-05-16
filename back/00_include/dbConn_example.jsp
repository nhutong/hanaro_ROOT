<%@ page import="java.sql.*" %>

<%	

	String dburl = "jdbc:maridb://localhost:3306/hanaro";
	Connection conn = null;
	Statement stmt = null;
	ResultSet rs = null;
	String sql = null;
	PreparedStatement pstmt = null;
	
	try 
	{
		Class.forName("org.mariadb.jdbc.Driver");
 		//out.println("드라이버 로딩 성공");
		conn = DriverManager.getConnection(dburl, "root", "asdf1234");		

	}catch(Exception e) 
	{
		e.printStackTrace();
		//out.println("데이터 베이스 연결 오류 :" + e.getMessage());
	}finally{

		
		String userNoInsert = "";
		if (session.getAttribute("userNo") == null){

		}else{
			userNoInsert = session.getAttribute("userNo").toString();
		}

		if (userNoInsert.equals("")){
			
		}else{
		
			//중복 로그인 방지를 위한 cont_no 발급
			String sessionid = userNoInsert; // 회원 번호
			String addressIp = request.getRemoteAddr(); // 접속자 ip
			
			String pageUrl = request.getRequestURL().toString(); // 요청 url
			String browseOs = request.getHeader("User-Agent");

			//contact 번호 생성
			sql = "SELECT EBGA_PAGE_CONTACT_LOG ('"+addressIp+"', '"+sessionid+"', '"+pageUrl+"') as cont_no_max";
			stmt = conn.createStatement();
			// out.print(sql);
			
			rs = stmt.executeQuery(sql);
			rs.next(); // 커서 위치 제일 뒤로 이동. last 함수 호출시 rs 초기화가 됨.
			String contMax = rs.getString("cont_no_max");
		}
	};
	
%>