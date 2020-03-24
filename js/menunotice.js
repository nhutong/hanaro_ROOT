$(function () {

	/* 공통부분 시작======================================================================== */
	/* 좌상단 로그인 유저의 정보를 바인딩한다. */
	getHeader();
	$(".nav_detail").addClass("active");

	/* 좌측 메뉴를 바인딩한다. */
	getLeft();
	getLeftMenu('managemenu');
	$("#nh_manage_menu").addClass("active");

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


	noticeCont(targetCompanyNo);

});

// 공지사항 리스트를 불러온다.
function noticeCont(rcvonSelectCompanyNo){

		var text = '';

		$.ajax({
			url:'/back/04_home/notice.jsp?random=' + (Math.random()*99999),
			data : {vm_cp_no: rcvonSelectCompanyNo },
			method : 'GET' 
		}).done(function(result){
			if(result == "NoN"){
					text +='      <tr>';
					text +='			 <td colspan="3">등록된 공지사항이 없습니다.</td>';
					text +='       </tr>';
			}else{
				var jsonResult = JSON.parse(result);
				console.log(jsonResult);

				var jsonResult_notice = jsonResult.CompanyList
				
				for(var i in jsonResult_notice){
					
					text +='      <tr>';
					text +='			 <td>'+jsonResult_notice[i].nt_no+'</td>';
					text +='			 <td class="menu_notice_title">';
					text +='			 <a href="#" onclick="menu_post_popup('+jsonResult_notice[i].nt_no+');">'+jsonResult_notice[i].nt_title+'</a></td>';
					text +='			 <td>'+jsonResult_notice[i].reg_date+'</td>';
					text +='       </tr>';
				}
			}
				$("#manageNoticeTable").empty();
				$("#manageNoticeTable").append(text);		

	})

}

function menu_post_popup(rcvNtNo){
	var popupX = (window.screen.width/2) - (400/2);
   window.open('menunotice_pop.html?nt_no='+rcvNtNo+'','공지사항 읽기','width=440,height=400,location=no,status=no,scrollbars=yes,left='+ popupX +',top=200')  
}

   function menu_create_popup(){
	var popupX = (window.screen.width/2) - (400/2);
   window.open('menunotice_create.html','공지사항 등록','width=440,height=400,location=no,status=no,scrollbars=yes,left='+ popupX +',top=200')  
}