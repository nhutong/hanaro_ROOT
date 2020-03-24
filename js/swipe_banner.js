$(function () {

//  var Result = getParameterByName('Test'); // 결과 : 111

	getHeader();
	getLeft();
	getLeftMenu('home');
	$("#nh_home_swipe").addClass("active");
	$(".nav_home").addClass("active");
	getEventList(getCookie("onSelectCompanyNo"));

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
			getEventList(getCookie("onSelectCompanyNo"));
			localStorage.setItem("vm_cp_no",$("#sort_select").val());
		}
	});
	/* 공통부분 종료======================================================================== */ 

	$('#swipeBannerList1').on('change', function(){
		var imgUrl = $(this).children('[value='+ this.value +']').data('img');
		
		if(this.value < 0) { 
			$('#imgBanner1').attr('src', '../images/no_img2.png');
			$('#imgBanner1').attr('src', '../images/no_img2.png');
		}else{
			$('#imgBanner1').attr('src', imgUrl);
		}
	});

	$('#sort_select').on('change', function(){
		getEventList( this.value );
	});

	$('#swipeBannerList2').on('change', function(){
		var imgUrl = $(this).children('[value='+ this.value +']').data('img');
		$('#imgBanner2').attr('src', imgUrl);
		if(this.value < 0) $('#imgBanner2').attr('src', '../images/no_img2.png');
	});

	$('#swipeBannerList3').on('change', function(){
		var imgUrl = $(this).children('[value='+ this.value +']').data('img');
		$('#imgBanner3').attr('src', imgUrl);
		if(this.value < 0) $('#imgBanner3').attr('src', '../images/no_img2.png');
	});
	/*하단 swipeBannerList4,5 추가 2020-01-17 김나영*/
	$('#swipeBannerList4').on('change', function(){
		var imgUrl = $(this).children('[value='+ this.value +']').data('img');
		$('#imgBanner4').attr('src', imgUrl);
		if(this.value < 0) $('#imgBanner4').attr('src', '../images/no_img2.png');
	});
	$('#swipeBannerList5').on('change', function(){
		var imgUrl = $(this).children('[value='+ this.value +']').data('img');
		$('#imgBanner5').attr('src', imgUrl);
		if(this.value < 0) $('#imgBanner5').attr('src', '../images/no_img2.png');
	});

    var previous;
    $('.banner_order').on('focus', function () {
        // 직전 value 를 previous 에 담아 놓기
        previous = this.value;
    }).change(function() {
		var currentOption = this;

		$('.banner_order').each(function(idx, item ){
			//현재 변경된 id 가 아니고 같은 값일 경우 이전 값을 해당 select에 넣어줌
			console.log(item.id, item.value, currentOption.id, currentOption.value);
			if(item.id != currentOption.id && item.value == currentOption.value){
				item.value = previous;
			}
		})

        // 변경시 선택한 값으로 previous 변경
        previous = this.value;
	});
	
});

//function getCompanyList(){
//	$.get("/back/00_include/getCompanyList.jsp",
//		function(resultJSON){						
//			//console.log(resultJSON);
//			companyList = resultJSON['list'];
//			if(companyList.lengh) return;
//			setCompanyOptions(companyList);
//		}
//	);
//}
//
//function setCompanyOptions(companyList){
//	var options = '';	
//	$(companyList).each( function (idx, company) {
//		if(company.VM_CP_NO == 0 ) return;
//		options += '<option value=' + company.VM_CP_NO + '>' +company.VM_CP_NAME + '</option>' ;
//	});
//	$('#sort_select').append(options);
//
//	getEventList($('#sort_select').val());
//}

var eventList;
var bannerList;
function getEventList(companyNo){
	$.get("/back/04_home/swipeBanner.jsp?companyNo=" + companyNo,
		function(resultJSON){						
			console.log(resultJSON);
			eventList = resultJSON['list'];

			var options = '';
			initBanners();
			$(eventList).each( function (idx, event) {										
				options += '<option data-img="'+ event.img_url + '" value=' + event.event_no + '>' + event.event_title+ '</option>' ;
			});

			$('.swipeBannerList').each(function(_, elSelect){
				$(elSelect).empty();
				$(elSelect).append(options);
			});
			
			bannerList = resultJSON['bannerList'];
			$(bannerList).each( function (jdx, banner) {
				orderNo = banner.order_no || 3;
				$('#swipeBannerList'+orderNo).val(banner.event_no);
				$('#swipeOff'+orderNo).prop('checked', true);
				$('#imgBanner'+orderNo).attr('src', banner.img_url);
			});
			
		}
	);
}

//배너 업데이트 하기
function updateBanner(){
	
	if(!confirm('저장하시겠습니까?')) return;

	//데이터 가져오기
	var formData ={
		companyNo : $('#sort_select').val(),
		eventList : getUpdateBannerList().join()
	};

	$.post("/back/04_home/swipeBannerUpdate.jsp",
		formData,
		function(result){
			console.log(result);
			if(result['update'] > 0){
				alert('배너가 반영 되었습니다.');
				location.reload();
			}
		}
	);
}

// 배너 데이터 모으기
function getUpdateBannerList(){
	var bannerList = ['','','']; // 3자리 array 만들기
	$('.swipeBannerList').each( function(idx, el){
		if($($('.bannerCheck')[idx]).prop('checked')){
			var arrayIdx = $($('.banner_order')[idx]).val() - 1;
			bannerList[arrayIdx] = ($(el).val());
			console.log(arrayIdx, bannerList);
		}
	});
	console.log(bannerList);
	return bannerList;
}

function initBanners(){
	$('.swipeBannerList').each(function(idx, el){ $(el).val("-1")});
	$('.bannerCheck').each(function(idx, el){ $(el).prop('checked', false)});
	$('.bannerImg').each(function(idx, el){ $(el).attr('src', '../images/no_img2.png')});
}
