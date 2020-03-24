$(function () {

//  var Result = getParameterByName('Test'); // 결과 : 111

	/* 공통부분 시작======================================================================== */
	/* 좌상단 로그인 유저의 정보를 바인딩한다. */
	getHeader();
	$(".nav_event").addClass("active");

	/* 좌측 메뉴를 바인딩한다. */
	getLeft();
	getLeftMenu('event');
	$("#nh_event_coupon_history").addClass("active");

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
			noticeCont(getCookie("onSelectCompanyNo"));
			localStorage.setItem("vm_cp_no",$("#sort_select").val());
		}
	});
	/* 공통부분 종료======================================================================== */

	/*판매장 변경시, */
	$("#btnUserSearch").on("click",function(){
		noticeCont(onSelectCompanyNo);
	});

	noticeCont(targetCompanyNo);

});

// 공지사항 리스트를 불러온다.
function noticeCont(rcvonSelectCompanyNo){

		var keyword = encodeURIComponent($("#keyword").val());
		var text = '';

		$.ajax({
			url:'/back/05_event/coupon_history.jsp?random=' + (Math.random()*99999),
			data : {vm_cp_no: rcvonSelectCompanyNo, rcvKeyword: keyword },
			method : 'GET' 
		}).done(function(result){
			if(result == "NoN"){
					text +='      <tr>';
					text +='			 <td colspan="6">등록된 사항이 없습니다.</td>';
					text +='       </tr>';
			}else{
				var jsonResult = JSON.parse(result);
				console.log(jsonResult);

				var jsonResult_notice = jsonResult.CompanyList
				
				for(var i in jsonResult_notice){
					
					text +='      <tr>';
					text +='			 <td>'+jsonResult_notice[i].std_date+'</td>';
					text +='			 <td>'+jsonResult_notice[i].VM_CP_NAME+'</td>';
					text +='			 <td>'+jsonResult_notice[i].tel+'</td>';
					text +='			 <td>'+jsonResult_notice[i].mem_no+'</td>';
					text +='			 <td>'+jsonResult_notice[i].coupon_code+'</td>';
					text +='			 <td>'+jsonResult_notice[i].staff_cert_fg+'</td>';
					text +='       </tr>';
				}
			}
				$("#tab1_table").empty();
				$("#tab1_table").append(text);		

	})

}