//<![CDATA[

$(function() {

	   if (localStorage.getItem("userNo") != "")
	   {
		 if ( localStorage.getItem("userRoleCd") == "ROLE2")
			{
				if ( localStorage.getItem("delivery_id") == "" && localStorage.getItem("VM_sales_FG") == "Y" && localStorage.getItem("VM_delivery_FG") == "Y" )
				{
					alert("장보기가 활성화되어 있습니다.\n(필수)관리자웹에서 배송정보와 회차정보를 입력해주시기 바랍니다.");
					leaflet();
				}else{
					leaflet();
				}
			}else if( localStorage.getItem("userRoleCd") == "ROLE3" ){
				manage_order();
			}
	   }
	
       $("#user_pw").keypress(function (e) {
        if (e.which == 13){
                   pb_login();  // 실행할 이벤트
        }
    });

});

function setCookie1(name,value,days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else var expires = "";
	document.cookie = name+"="+value+"; path=/";
}
function setCookie2(cookie_name, value, days) {
  var exdate = new Date();
  exdate.setDate(exdate.getDate() + days);
  // 설정 일수만큼 현재시간에 만료값으로 지정

  var cookie_value = escape(value) + ((days == null) ? '' : ';    expires=' + exdate.toUTCString());
  document.cookie = cookie_name + '=' + cookie_value+"; path=/";
}

function pb_login(){
	var user_number = $("#user_number").val();
	var user_pw = $("#user_pw").val();

	if(user_number == ""){
		alert("사번을 입력해주세요");
		return;
	}
	if(user_pw == ""){
		alert("비밀번호를 입력해주세요");
		return;
	}
	$.post("/back/01_sign/login.jsp",{
		user_number : user_number,
		user_pw : SHA256(user_pw)
	},function(result){
		console.log(result);
		if(result == "unuser"){
			alert("등록된 사번이 아니거나, 승인된 사번이 아닙니다.")
		}else if(result == "unmatch"){
			alert("비밀번호가 일치하지 않습니다.")
		}else{
		var userLoginData = JSON.parse(result);
			setCookie1("userNo",userLoginData[0]['userNo'], 1);
			setCookie1("userToken",userLoginData[0]['userToken'], 1);
			setCookie1("contNo",userLoginData[0]['contNo'], 1);
			setCookie1("contToken",userLoginData[0]['contToken'], 1);
			setCookie1("userName",userLoginData[0]['userName'], 1);
			setCookie1("userCompanyNo",userLoginData[0]['userCompanyNo'], 1);
			setCookie1("userCompanyName",userLoginData[0]['userCompanyName'], 1);
			setCookie1("userEmail",userLoginData[0]['userEmail'], 1);
			setCookie1("usercellPhone",userLoginData[0]['usercellPhone'], 1);
			setCookie1("userRoleCd",userLoginData[0]['userRoleCd'], 1);
			setCookie1("userRoleName",userLoginData[0]['userRoleName'], 1);
			setCookie1("userEmpNo",userLoginData[0]['userEmpNo'], 1);
			setCookie1("delivery_id",userLoginData[0]['delivery_id'], 1);
			setCookie1("VM_delivery_FG",userLoginData[0]['VM_delivery_FG'], 1);
			setCookie1("VM_sales_FG",userLoginData[0]['VM_sales_FG'], 1);

			/* 20200310 자동로그인을 위한 코드추가 */
			localStorage.setItem("userNo",userLoginData[0]['userNo']);
			localStorage.setItem("userRoleCd",userLoginData[0]['userRoleCd']);
			localStorage.setItem("delivery_id",userLoginData[0]['delivery_id']);
			localStorage.setItem("VM_sales_FG",userLoginData[0]['VM_sales_FG']);
			localStorage.setItem("VM_delivery_FG",userLoginData[0]['VM_delivery_FG']);

			if ( userLoginData[0]['userRoleCd'] == "ROLE2")
			{
				if ( userLoginData[0]['delivery_id'] == "" && userLoginData[0]['VM_sales_FG'] == "Y" && userLoginData[0]['VM_delivery_FG'] == "Y" )
				{
					alert("장보기가 활성화되어 있습니다.\n(필수)관리자웹에서 배송정보와 회차정보를 입력해주시기 바랍니다.");
					leaflet();
				}else{
					leaflet();
				}
			}else if( userLoginData[0]['userRoleCd'] == "ROLE3" ){
				manage_order();
			}

		}
	});
};