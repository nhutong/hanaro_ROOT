<%@ page pageEncoding="utf-8" %>
<%@ page import="java.util.Arrays" %>
<%	
	// 권한 체크
	// 서버 세션 (HttpSession)에서 꺼내오기 : https://docs.oracle.com/javaee/7/api/javax/servlet/http/HttpSession.html , https://tomcat.apache.org/tomcat-8.5-doc/index.html	
	String userRoleCd = (String)session.getAttribute("userRoleCd");
	if(Arrays.asList(requiredRoles.split(",")).contains(userRoleCd)) {
		// 접근가능
	} else {
		// 접근불가능
//		results.put("error", "권한이 없습니다.  " + requiredRoles + " : " + userRoleCd);
		results.put("error", "다시한번 로그인해주시기 바랍니다.");
		out.print(gson.toJson(results));
		
		// 응답 (HttpServletResponse) : https://docs.oracle.com/javaee/7/api/javax/servlet/http/HttpServletResponse.html
		response.setStatus(response.SC_FORBIDDEN); // 403
		return;
	}
%>
