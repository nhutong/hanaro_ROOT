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
	String encodedS = java.net.URLEncoder.encode(s);
	return encodedS;
}

public String strDecode(String s){
	String decodedS = java.net.URLDecoder.decode(s);
	return decodedS;
}

%>