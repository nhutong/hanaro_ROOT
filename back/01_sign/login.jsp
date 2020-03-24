<%@ page contentType = "text/html;charset=utf-8" %>
<%@ page import="java.sql.*" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="java.util.*" %>
<%@ page import="org.json.simple.*" %>
<%@ include file = "../00_include/dbConn_before.jsp" %>

<% 
	String user_number = request.getParameter("user_number")==null? "":request.getParameter("user_number"); // 이메일
	String pw		   = request.getParameter("user_pw")==null? "":request.getParameter("user_pw"); // 패스워드

	// 받은 값이 없는 경우, empty를 반환한다.
	if(user_number.equals("") || pw.equals("")){
		 out.clear();
	     out.print("empty");
	     return;
	};

	// 패스워드 암호화.
	sql = "SELECT EBGA_CREATE_PW_SHA('"+pw+"')as shaPw";

	stmt = conn.createStatement();
	rs = stmt.executeQuery(sql);
	rs.next(); // 하나의 데이터라도 next 함수 이용
	String shaPw = rs.getString("shaPw");
	out.print(shaPw);

	// 로그인 정보 확인
	sql = "select vm_no from vm_user where VM_EMP_NO = '"+user_number+"' and VM_USER_STATUS_CD = 'APPROVED' ";

	stmt = conn.createStatement();
	rs = stmt.executeQuery(sql);
	rs.last(); // 커서 위치 제일 뒤로 이동. last 함수 호출시 rs 초기화가 됨.
	int listCount = rs.getRow(); // 현재 커서의 row Index값을 저장 
	if(listCount == 0){
		out.clear();
		out.print("unuser");
		return;
	}
	
	//패스워드 확인
	sql = "SELECT a.VM_NO, a.VM_NAME, b.VM_CP_NO, b.VM_CP_NAME, a.VM_ROLE_CD, " 
		  +" vm_email, vm_cellphone, c.code_name, VM_EMP_NO, ifnull(d.id,'') as delivery_id, ifnull(b.VM_delivery_FG,'N') as VM_delivery_FG, ifnull(b.VM_sales_FG,'') as VM_sales_FG "
		  +" FROM vm_user as a"
		  +" left outer join vm_company as b"
		  +" on a.VM_REF_COMPANY_NO = b.VM_CP_NO"
		  +" inner join vm_code as c"
		  +" on a.VM_ROLE_CD = c.CODE"
		  +" left outer join vm_delivery_master as d"
		  +" on b.vm_cp_no = d.company_no "
		  +" WHERE VM_EMP_NO = '"+user_number+"' AND vm_pw = '"+shaPw+"'";

    // out.print(sql);
	stmt = conn.createStatement();

	rs = stmt.executeQuery(sql);
	rs.last(); // 커서 위치 제일 뒤로 이동. last 함수 호출시 rs 초기화가 됨.
	listCount = rs.getRow(); // 현재 커서의 row Index값을 저장 
	if(listCount == 0){
		out.clear();
		out.print("unmatch");
		return;
	};
	rs = stmt.executeQuery(sql);
	int userNo = 0;					// 관리자 번호
	String userName = null;			// 관리자 명
	int	   userCompanyNo = 0;		// 관리자 판매장번호
	String userCompanyName = null;  // 관리자 판매장명
	String userEmail = "";  		// 관리자 이메일
	String usercellPhone = "";		// 관리자 핸드폰번호
	String userRoleCd = "";			// 관리자 역할코드
	String userRoleName = null;		// 관리자 역할명	
	String userEmpNo = null;		// 관리자 사번
	String delivery_id = null;		// 배송 번호
	String VM_delivery_FG = null;
	String VM_sales_FG = null;
	
	while(rs.next()){ // 하나의 데이터라도 next 함수 이용
		userNo			= rs.getInt("VM_NO");
		userName		= rs.getString("VM_NAME");
		userCompanyNo   = rs.getInt("VM_CP_NO");
		userCompanyName = rs.getString("VM_CP_NAME");
		userEmail		= rs.getString("VM_EMAIL");
		usercellPhone	= rs.getString("vm_cellphone");
		userRoleCd		= rs.getString("VM_ROLE_CD");
		userRoleName	= rs.getString("code_name");
		userEmpNo	    = rs.getString("VM_EMP_NO");
		delivery_id	    = rs.getString("delivery_id");
		VM_delivery_FG	    = rs.getString("VM_delivery_FG");
		VM_sales_FG	    = rs.getString("VM_sales_FG");
	};

	//중복 로그인 방지를 위한 cont_no 발급
	int sessionid = userNo; // 회원 번호
	String addressIp = request.getRemoteAddr(); // 접속자 ip
	String pageUrl = request.getRequestURL().toString(); // 요청 url
	String browseOs = request.getHeader("User-Agent");

	//contact 번호 생성
	sql = "SELECT EBGA_PAGE_CONTACT_LOG ('"+addressIp+"', "+sessionid+", '"+pageUrl+"') as cont_no_max";
	stmt = conn.createStatement();
	// out.print(sql);
	
	rs = stmt.executeQuery(sql);
	rs.next(); // 커서 위치 제일 뒤로 이동. last 함수 호출시 rs 초기화가 됨.
	String contMax = rs.getString("cont_no_max");
	
	//cont_token 발급
	sql = "select "+contMax+" as cont_no, EBGA_CREATE_SHA("+contMax+") as cont_token";
	stmt = conn.createStatement();
	rs = stmt.executeQuery(sql);
	rs.next();
	String contToken = rs.getString("cont_token");
	
	//local Storage(ex.쿠키)로 가지고 다닐 개인정보(token) 반환
	sql = "select "+userNo+" as cont_no, EBGA_CREATE_SHA("+userNo+") as token";
	stmt = conn.createStatement();
	rs = stmt.executeQuery(sql);
	rs.next();
	String userToken = rs.getString("token");

	try{
		//userName = URLEncoder.encode(userName, "UTF-8");
		//userCompany = URLEncoder.encode(userCompany, "UTF-8");
		//userDepart = URLEncoder.encode(userDepart, "UTF-8");
		//avatarPath = URLEncoder.encode(avatarPath, "UTF-8");
				
		JSONArray arr = new JSONArray();
		
		JSONObject obj = new JSONObject();
		obj.put("userNo", userNo); // 회원 번호
		obj.put("userName", userName);
		obj.put("userCompanyNo", userCompanyNo);
		obj.put("userCompanyName", userCompanyName);
		obj.put("userEmail", userEmail);
		obj.put("usercellPhone", usercellPhone);
		obj.put("userRoleCd", userRoleCd);
		obj.put("userRoleName", userRoleName);
		obj.put("userEmpNo", userEmpNo);
		obj.put("contNo", contMax);		
		obj.put("contToken", contToken);
		obj.put("userToken", userToken);
		obj.put("delivery_id", delivery_id);
		obj.put("VM_delivery_FG", VM_delivery_FG);
		obj.put("VM_sales_FG", VM_sales_FG);
				
		if(obj != null)
			arr.add(obj);			
		
		out.clear();
		out.print(arr);

		// 서버 세션 (HttpSession)에 저장하기 : https://docs.oracle.com/javaee/7/api/javax/servlet/http/HttpSession.html , https://tomcat.apache.org/tomcat-8.5-doc/index.html
		session.setAttribute("userNo", userNo);
		session.setAttribute("userName", userName);
		session.setAttribute("userCompanyNo", userCompanyNo);
		session.setAttribute("userCompanyName", userCompanyName);
		session.setAttribute("userEmail", userEmail);
		session.setAttribute("usercellPhone", usercellPhone);
		session.setAttribute("userRoleCd", userRoleCd);
		session.setAttribute("userRoleName", userRoleName);
		session.setAttribute("userEmpNo", userEmpNo);
		session.setAttribute("contNo", contMax);
		session.setAttribute("contToken", contToken);
		session.setAttribute("userToken", userToken);
		session.setAttribute("delivery_id", delivery_id);
		session.setAttribute("VM_delivery_FG", VM_delivery_FG);
		session.setAttribute("VM_sales_FG", VM_sales_FG);

		// (예시) 서버 세션에서 꺼내오기 
		// session.getAttribute("userRoleCd");

		// (예시) 로그아웃시 서버 세션 초기화
		// session.invalidate();

	}
	catch(Exception e)
	{		
		out.clear();
		out.print("login error");
		return;
	}
	finally
	{	
		
	 	if(stmt != null) try { stmt.close(); } catch(SQLException sqle) {}
		if(conn != null) try { conn.close(); } catch(SQLException sqle) {}
	};
	
%>