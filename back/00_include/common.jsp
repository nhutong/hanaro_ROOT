<%!

// 숫자인지여부 판별 함수
public boolean isNumeric(String s) {
  try {
	  Double.parseDouble(s);
	  return true;
  } catch(NumberFormatException e) {
	  return false;
  }
}

public String strEncode(String s){
	//String encodedS = java.net.URLEncoder.encode(s); //2020-4-21 encode를 사용하지 않기로 함
	String encodedS = s;
	return encodedS;
}

public String strDecode(String s){
	//String decodedS = java.net.URLDecoder.decode(s); //2020-4-21 사용하는 곳 없음
	String decodedS = s;
	return decodedS;
}

%>