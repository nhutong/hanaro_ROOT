$(function(){
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
     var tel = $("#user_number").val();
     var user_pw = $("#user_pw").val();
 
     if(tel == ""){
         alert("전화번호를 입력해주세요");
         return;
     }
     if(user_pw == ""){
         alert("비밀번호를 입력해주세요");
         return;
     }
     if(user_pw != "asdf1234"){
        alert("비밀번호가 틀립니다");
        return;
    }     

    //  https://www.nhhanaromart.com/back/02_app/mSelectMemberInfo.jsp
    //  /back/02_app/mLoginPc.jsp

    $.ajax({
        url:'/back/02_app/mLoginPc.jsp?random=' + (Math.random()*99999), 
        data: {
            tel : tel
        },
        method : 'GET' 
    }).done(function(result){							
        if(result == ('NoN') || result == 'list error' || result == 'param empty' || result == 'Dup' || result == 'ERROR' ){
            //console.log(result);
        }else{
            //console.log(result);
            var jsonResult = JSON.parse(result);
            var jsonResult_member_info = jsonResult.memberList;

            localStorage.setItem("no", jsonResult_member_info[0].no);
            localStorage.setItem("name", jsonResult_member_info[0].name);
            localStorage.setItem("tel", tel);
            localStorage.setItem("company_no", jsonResult_member_info[0].company_no);
            localStorage.setItem("agree_privacy", jsonResult_member_info[0].agree_privacy);
            localStorage.setItem("agree_push", jsonResult_member_info[0].agree_push);
            localStorage.setItem("agree_location", jsonResult_member_info[0].agree_location);
            localStorage.setItem("reg_date", jsonResult_member_info[0].reg_date);
            localStorage.setItem("last_date", jsonResult_member_info[0].last_date);
            localStorage.setItem("member_status_cd", jsonResult_member_info[0].member_status_cd);
            localStorage.setItem("usim", jsonResult_member_info[0].usim);
            localStorage.setItem("memo", jsonResult_member_info[0].memo);
            localStorage.setItem("address1", jsonResult_member_info[0].address1);
            localStorage.setItem("address2", jsonResult_member_info[0].address2);
            localStorage.setItem("push_agree_date", jsonResult_member_info[0].push_agree_date);
            localStorage.setItem("push_disagree_date", jsonResult_member_info[0].push_disagree_date);
            localStorage.setItem("push_token", jsonResult_member_info[0].push_token);
            localStorage.setItem("push_user_agent", jsonResult_member_info[0].push_user_agent);
            localStorage.setItem("mem_resign_date", jsonResult_member_info[0].mem_resign_date);
            localStorage.setItem("mem_resign_fg", jsonResult_member_info[0].mem_resign_fg);
            
			location.href="../home/main.html";
        }
    });	
};