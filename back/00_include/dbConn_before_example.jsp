<%@ page import="java.sql.*" %>

<%	

	String dburl = "jdbc:mysql://localhost:3306/hanaro";
	Connection conn = null;
	Statement stmt = null;
	ResultSet rs = null;
	String sql = null;
	PreparedStatement pstmt = null;
	
	try 
	{
		Class.forName("com.mysql.jdbc.Driver");
// 		out.println("드라이버 로딩 성공");
		conn = DriverManager.getConnection(dburl, "root", "kacm3498!");		
		
	}catch(Exception e) 
	{
		e.printStackTrace();
//		out.println("데이터 베이트 연결 오류 :" + e.getMessage());
	};
	
%>