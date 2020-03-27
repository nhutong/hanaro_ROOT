$(function () {

	/* 공통부분 시작======================================================================== */
	/* 좌상단 로그인 유저의 정보를 바인딩한다. */
	getHeader();
	$(".nav_home").addClass("active");

	/* 좌측 메뉴를 바인딩한다. */
	getLeft();
	getLeftMenu('home');
	$("#nh_home_notice").addClass("active");

	/* 현재로그인한 유저의 판매장번호 정보를 정보를 담는다. */
	CuserCompanyNo = getCookie("userCompanyNo");

	/* 우상단 선택된 판매장번호 정보를 담는다. */
	onSelectCompanyNo = getCookie("onSelectCompanyNo");

	var targetCompanyNo = "";
	if (onSelectCompanyNo != "")
	{
		if (onSelectCompanyNo != CuserCompanyNo)
		{
			targetCompanyNo = onSelectCompanyNo;
		}else{
			targetCompanyNo = CuserCompanyNo;
		}
	}else{
		targetCompanyNo = CuserCompanyNo;
	}

	/* 최초 로그인한 유저번호로 바인딩한다. */
	getManagerList(CuserCompanyNo, targetCompanyNo);

	/*판매장 변경시, 
	1. 현재 선택한 판매장 정보를 쿠키에 저장한다.
	2. 저장된 쿠키정보를 이용하여 긴급공지내용을 바인딩한다. 
	3. iframe 내부 모바일웹의 판매장셋팅을 위해, 로컬스토리지에 판매장번호를 셋팅한다.
	4. 선택한 판매장번로를 이용하여 iframe reload 한다.*/
	$("#sort_select").on("change",function(){
		if ($("#sort_select").val() == "" )
		{
		}else{
			setCookie1("onSelectCompanyNo",$("#sort_select").val());
			getNoticeList(getCookie("onSelectCompanyNo"));
			localStorage.setItem("vm_cp_no",$("#sort_select").val());
			document.getElementById("nh_main").src = "../app/home/main.html?vm_cp_no="+$("#sort_select").val();
		}
	});

	/* 공통부분 종료======================================================================== */



	/* 최초 로딩를 고려하여, 현재 로그인한 유저의 판매장번호로 긴급공지정보를 바인딩한다. */
	getNoticeList(targetCompanyNo);

	/* 긴급공지 수정버튼 - 모달창에서 긴급공지를 수정하기 위한 수정버튼 클릭시 텍스트를 업데이트 한다.*/
    $("#updateBtn").on("click",function(){
		
		var Text1 = $("#Text1").val();
		var sn_no = sessionStorage.getItem("suddenNoticeNo");
		/*textarea 28자 내로 제한 - 20200109 김나영*/
		if(Text1.length > 28) {
			alert("글자수는 28자로 이내로 제한됩니다.");
			Text1.substring(0, 28);
			return false;
		}else if(Text1 == ""){
				/*내용 없을 시 입력 불가 20200109 김나영*/
        		alert("내용이 없습니다. 내용을 입력하세요.");
				return false;
		}		

		if ( CuserCompanyNo == null || chrLen(CuserCompanyNo) == 0)
		{
			alert("로그인후 수정하시기 바랍니다.");
			return false;
		}

		$.ajax({
			url:'/back/04_home/suddenNoticeUpdate.jsp?random=' + (Math.random()*99999),
			data : {sn_no: sn_no, Text1: Text1},
			method : 'GET' 
		}).done(function(result){

			console.log("noticeList=========================================");
			if(result == ('NoN') || result == 'exception error' || result == 'empty'){
				console.log(result);
			}else{
				console.log("============= notice callback ========================");
				console.log(result);
				alert("수정이 완료되었습니다.");
				window.location.reload();
			}
		});
	});

});

// 긴급공지을 리스팅한다.
function getNoticeList(rcvCompanyNo) {
	
	$("#suddenContent").empty();

    $.ajax({
        url:'/back/04_home/suddenNoticeList.jsp?random=' + (Math.random()*99999),
		data : {userCompanyNo: rcvCompanyNo},
        method : 'GET' 
    }).done(function(result){

		var text = "";

        console.log("noticeList=========================================");
        if(result == ('NoN') || result == 'list error' || result == 'empty'){
            console.log(result);
        }else{

            console.log("============= notice callback ========================");
            console.log(result);
            var data = JSON.parse(result);

			

            data['CompanyList'].forEach(function(item, index){                        
                
				text += '<td id="'+item['sn_no']+'">';
				if(item['sn_content'] == null){
					text += '여기를 눌러서 입력하세요.</td>'
				}else{
					text += ''+item['sn_content']+'</td>'
				}
                text += '<td>';
				text += '<select name="noticeToggle" id="noticeToggle">';

				if (item['release_fg'] == "Y")
				{
					text += '<option value="Y" selected>반영</option>';
					text += '<option value="N">미반영</option>';
				}else{
					text += '<option value="Y">반영</option>';
					text += '<option value="N" selected>미반영</option>';
				}

				text += '</select>';
				text += '</td>';
			

				$("#Text1").val(item['sn_content']);
				sessionStorage.setItem("suddenNoticeNo",item['sn_no']);

			});

			$("#suddenContent").append(text);
			$(".home_notice_top table tr td:first-child").click(function(){
				$(".home_notice_modal_wrap").toggleClass("active");
			});
		   $(".home_notice_modal_cls").click(function(){
				$(".home_notice_modal_wrap").removeClass("active");
			})

			/*긴급공지 반영 셀렉트박스*/
			$("#noticeToggle").on("change",function(){

				var release_fg = encodeURIComponent($("#noticeToggle").val());
				var sn_no = sessionStorage.getItem("suddenNoticeNo");

				if ( CuserCompanyNo == null || chrLen(CuserCompanyNo) == 0)
				{
					alert("로그인후 수정하시기 바랍니다.");
					return false;
				}

				$.ajax({
					url:'/back/04_home/suddenNoticeRelaseFgUpdate.jsp?random=' + (Math.random()*99999),
					data : {sn_no: sn_no, release_fg: release_fg},
					method : 'GET' 
				}).done(function(result){

					console.log("noticeList=========================================");
					if(result == ('NoN') || result == 'exception error' || result == 'empty'){
						console.log(result);
					}else{
						console.log("============= notice callback ========================");
						console.log(result);
						alert("수정이 완료되었습니다.");
						window.location.reload();
					}
				});
			});

        }
    });
}

		