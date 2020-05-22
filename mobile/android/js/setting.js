// cordova device ready
document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
    //	requestReadPermission();
    //	hasReadPermission();
    //	window.plugins.sim.getSimInfo(successCallback, errorCallback);
}
$(function () {
        var memberNo = localStorage.getItem("memberNo");
    
        pushSetting(memberNo);
    
        /*Push 버튼 클릭시 정보 바꾼다.*/
        $("#agreePushSwitch").on("click", function () {
            var pushValue;

			//20200218 아래 2줄 추가
			var d = new Date();
			var currentDate = d.getFullYear() + "년 " + ( d.getMonth() + 1 ) + "월 " + d.getDate() + "일";

            if ($("#agreePush").prop('checked') == true) {
				alert("하나로마트 앱\n"+currentDate+"에 혜택(광고성정보)알림 수신 거부 처리 되었습니다.\n※ 수신동의는 설정메뉴에서 변경가능합니다.");
                pushValue = "N";
                $("#agreePush").prop('checked', "false");
            }
            else {
				alert("하나로마트 앱\n"+currentDate+"에 혜택(광고성정보)알림 수신 동의처리 되었습니다.\n※ 수신동의는 설정메뉴에서 변경가능합니다.");
                pushValue = "Y";
                $("#agreePush").prop('checked', "true");
            }
            $.ajax({
                url: 'https://www.nhhanaromart.com/back/04_home/setting_push.jsp?random=' + (Math.random() * 99999)
                , data: {
                    memberNo: memberNo
                    , agree_push: pushValue
                }
                , method: 'GET'
            }).done(function (result) {
                console.log("noticeList=========================================");
                if (result == ('NoN') || result == 'exception error' || result == 'empty') {
                    console.log(result);
                }
                else {
                    console.log("============= notice callback ========================");
                    console.log(result);
                    pushSetting(memberNo);
                }
            });
        });

        //회원탈퇴 버튼 클릭시 알럿 뜨고 탈퇴처리된다.
        $("#memRe").click(function () {
            memberResign();
        });

        /*위치정보동의 버튼 클릭시 정보 바꾼다.*/
        $("#agreeLocationSwitch").on("click", function () {
            var locationValue;
            if ($("#agreeLocation").prop('checked') == true) {
                locationValue = "N";
                $("#agreeLocation").prop('checked', "false");
            }
            else {
                locationValue = "Y";
                $("#agreeLocation").prop('checked', "true");
            }
            $.ajax({
                url: 'https://www.nhhanaromart.com//back/04_home/setting_location.jsp?random=' + (Math.random() * 99999)
                , data: {
                    memberNo: memberNo
                    , agree_location: locationValue
                }
                , method: 'GET'
            }).done(function (result) {
                console.log("noticeList=========================================");
                if (result == ('NoN') || result == 'exception error' || result == 'empty') {
                    console.log(result);
                }
                else {
                    console.log("============= notice callback ========================");
                    console.log(result);
                    locaSetting(memberNo);
                }
            });
        });
    })

//push Setting
function pushSetting(rcvMemberNo) {

    $.ajax({
        url: 'https://www.nhhanaromart.com/back/04_home/setting.jsp?random=' + (Math.random() * 99999)
        , data: {
            memberNo: rcvMemberNo
        }
        , method: 'GET'
    }).done(function (result) {
        var jsonResult = JSON.parse(result);
        var jsonResult_comp = jsonResult.CompanyList
        if (jsonResult_comp[0].agree_push == "N") {
            $("#agreePush").prop('checked', false);
        }
        else {
            $("#agreePush").prop('checked', true);
        }
    });
}

//location Setting
function locaSetting(rcvMemberNo) {

    $.ajax({
        url: 'https://www.nhhanaromart.com/back/04_home/setting.jsp?random=' + (Math.random() * 99999)
        , data: {
            memberNo: rcvMemberNo
        }
        , method: 'GET'
    }).done(function (result) {
        var jsonResult = JSON.parse(result);

        var jsonResult_comp = jsonResult.CompanyList
        if (jsonResult_comp[0].agree_location == "N") {
            $("#agreeLocation").prop('checked', false);
        }
        else {
            $("#agreeLocation").prop('checked', true);
        }
    });
}

//탈퇴하기
function memberResign() {
    navigator.notification.confirm('모든 혜택( 쿠폰, 스탬프 )과 정보가 사라집니다 ( 1회성 쿠폰의 경우, 탈퇴 후 재가입하셔도 재발행되지 않습니다 ). 정말 탈퇴하시겠습니까?', // message
        function (index) {
            if (index == 1) {
                exitNH();
            }
            else if (index == 2) {
                alert("취소하셨습니다.");
                return false;
            }
        }, '탈퇴안내', // title
		['탈퇴', '취소'] // buttonLabels
    );
}

/* 앱을 닫는다. */
function exitNH() {
    //ajax 탈퇴처리 - 이중호
    $.ajax({
        url: 'https://www.nhhanaromart.com/back/04_home/memberDelete.jsp?random=' + (Math.random() * 99999)
        , data: {
            memberNo: localStorage.getItem("memberNo")
        }
        , method: 'GET'
    }).done(function (result) {
        console.log("noticeList=========================================");
        if (result == ('NoN') || result == 'exception error' || result == 'empty') {
            console.log(result);
        }
        else {
            console.log("============= notice callback ========================");
            console.log(result);
            alert("탈퇴처리 되었습니다. 앱이 종료됩니다.");
            localStorage.clear();
            if (navigator.app) {
                navigator.app.exitApp();
            }
            else if (navigator.device) {
                navigator.device.exitApp();
            }
        }
    });
}

//function exitApp(){
//
//	if(navigator.app){
//	   navigator.app.exitApp();
//	}else if(navigator.device){
//	   navigator.device.exitApp();
//	}
//
//};