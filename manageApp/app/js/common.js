$(function(){

	header_notice();
	
	// 전역변수 파라미터 ( 판매장이 보낸 문자링크때 주로 사용된다. )	
	menu_no = getParameterByName('menu_no');   // 메뉴 번호
	vm_cp_no = getParameterByName('vm_cp_no');


	/* 웹에서는 iframe 안의 앱의 로그인한 사람 tel 과 vm_cp_no 를 알수 없으므로 tel은 임의로 지정하고, vm_cp_no 는 하기와 같이 지정한다. */
	var tel = localStorage.getItem("tel");
//	tel = "01023998512";
//	localStorage.setItem("tel","01023998512");

	var isInIFrame = ( window.location != window.parent.location );
	if (isInIFrame == true)
	{ 
		tel = "01023998512";
		localStorage.setItem("tel","01023998512");
        var userCompanyNo = getCookie("userCompanyNo");
	}else{ 
		
	}

	if (getCookie("userRoleCd") == "ROLE2")
	{
		var userCompanyNo = getCookie("userCompanyNo");
	}else{
		var userCompanyNo = getCookie("userCompanyNo");
	}

//	zzimCount(tel, vm_cp_no);
//	pushCount(tel);

})

// 파라미터를 받는 공통 함수
function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function getCookie(cookieName) {
   cookieName = cookieName + '=';
   var cookieData = document.cookie;
   var start = cookieData.indexOf(cookieName);
   var cookieValue = '';
   if(start != -1){
      start += cookieName.length;
      var end = cookieData.indexOf(';', start);
      if(end == -1)end = cookieData.length;
      cookieValue = cookieData.substring(start, end);
   }
   return unescape(cookieValue);
}

function getHeader(rcVm_p_no){
	
	var result = '';
	 
	// result += '	<div id="share_btn" onclick="share_btn();">	';		// 20200408 + 버튼 숨김
	// result += '		<div class="share_btn_inner">	';
	// result += '			<img src="../images/share_btn.png" alt="공유하기">';
	// result += '		</div>';
	// result += '	</div>';
	result += '	<div id="share_list">';  
	result += '	   <ul>';
	result += '		   <li class="share_inner_btn"><a href="#"><img src="../images/share.png" alt="공유하기">공유하기</a></li>';
//	result += '		   <li><a href="../mypage/my_coupon.html"><img src="../images/coupon.png" alt="쿠폰">쿠폰</a></li>';
//	result += '		   <li><a href="../mypage/stamp.html"><img src="../images/stamps.png" alt="스탬프">스탬프</a></li>';
	result += '		   <li><a href="#" onclick="alert(\'모바일앱을 설치하여 사용하시기 바랍니다.\');"><img src="../images/coupon.png" alt="쿠폰">쿠폰</a></li>';
	result += '		   <li><a href="#" onclick="alert(\'모바일앱을 설치하여 사용하시기 바랍니다.\');"><img src="../images/stamps.png" alt="스탬프">스탬프</a></li>';
	result += '	   </ul>';
	result += '	</div>';
	result += '	<div id="aside">';
	result += '		<div id="aside_black"></div>';
	result += '		<div id="aside_wrap">';
	result += '			<div class="close_button"><img src="../images/close_btn.png" alt="닫기"></div>';
	result += '			<div class="aside_login">';
	result += '	<a href="#">홈</a>';
		
	
	result += '				</div>';
	result += '			<div class="aside_mypage nullHide"><a href="#">마이페이지<img src="../images/down.png" alt="메뉴 내리기"></a>';
	result += '			<ul class="nullHide">';
	result += '				<li><a href="#" onclick="my_info();">나의 정보</a></li>';
	result += '				<li><a href="#" onclick="my_coupon();">쿠폰</a></li>';
	result += '				<li><a href="#" onclick="my_stamp();">스탬프</a></li>';
	result += '				<li><a href="#" onclick="my_del();">주문/배송</a></li>';
	result += '			</ul></div>';
	result += '			<div class="aside_category">';
	result += '				<ul>';
	result += '					<li><a href="#" onclick="cart();" class="nullHide">장바구니</a></li>';
	result += '					<li><a href="#" onclick="notice();">공지사항</a></li>';
	result += '					<li><a href="#" onclick="qna();" class="nullHide">1:1문의하기</a></li>';
	result += '					<li><a href="#" onclick="offline();">매장변경</a></li>';
	result += '					<li><a href="#" onclick="setting();">설정</a></li>';
	result += '				</ul>';
	result += '			</div>   '; 
	result += '			 <div id="aside_tos"><a href="#" onclick="tos();">이용약관 및<br>개인정보처리방침</a></div>';		
	result += '		</div>';
	result += '	</div>';


	result += '	<header>';  // 20200408 헤더 메뉴 제거
	// result += '		<h1>';
	// result += '			<a href="#">';
	// result += '				<img src="../images/logo.png" alt="하나로마트">';
	// result += '				<span class="store_name" id="cpName"></span>';
	// result += '			</a>';
	// result += '		</h1>';
	// result += '		<div class="aside_btn">';
	// result += '			<a href="#"> <img src="../images/menu.png" alt="네비게이션 열기"> </a>';
	// result += '		</div>';
	// result += '		<div id="header_inner_wrap">';
	// result += '			<div id="cart">';
	// result += '				<a href="#"> <img src="../images/like.png" alt="찜하기"> </a>';

	// result += '			</div><div ';
	// result += '			id="alert">';
	// result += '				<a href="#"> <img src="../images/alert.png" alt="알림창"> </a>';
	// result += '			</div><div ';
	// result += '			id="search">';
	// result += '				<a href="#"> <img src="../images/search.png" alt="검색"> </a>';
	// result += '			</div>';
	// result += '		</div>';
	result += '		<nav>';
	result += '			<ul id="headerMenuArea">     ';  // 20200408 헤더 메뉴 제거


	// //result += '				<li><a href="#" class="home">홈</a></li>';
	// //result += '				<li><a href="#">전단행사</a></li>';
	// //result += '				<li><a href="#">MENU3</a></li>';
	// //result += '				<li><a href="#">MENU4</a></li>';
	// //result += '				<li><a href="#">MENU5</a></li>';
	// //result += '				<li><a href="#">MENU6</a></li>';
	// //result += '				<li><a href="#">장보기</a></li>';					


	result += '			</ul>';  // 20200408 헤더 메뉴 제거
	result += '		</nav>';		
	result += '	</header>';
	
	
	$("#nav_header").append(result);

	getHeaderMenu(rcVm_p_no);
	
	if (localStorage.getItem("tel") == null){
		$(".nullHide").hide();
	}else{
		$(".nullHide").show();
	}

	$(".share_inner_btn").click(function(){
		alert("모바일 앱을 통해서만 사용할 수 있습니다.");
	})	
}

// header menu를 셋팅한다.
function getHeaderMenu(ff_vm_cp_no) { 
    $.ajax({
		url:'https://www.nhhanaromart.com/back/02_app/mLeafletHeaderMenu.jsp?random=' + (Math.random()*99999), 
        data : {userCompanyNo: ff_vm_cp_no},
        method : 'GET' 
    }).done(function(result){
		
        console.log("dataCategoryList=========================================");
        if(result == ('NoN') || result == 'list error' || result == 'empty'){
            console.log(result);
        }else{
            console.log("============= dataCategoryList callback ========================");
            console.log(result);
            var data = JSON.parse(result);

			var text = '<li id="headerHome"><a href="#" class="home">홈</a></li>';

            data['DateCategoryList'].forEach(function(item, index){                        
                $("#title_anibox").append('<li class="date_item" id="CT_'+decodeURIComponent(item['jd_no'])+'" data-jd_no="'+decodeURIComponent(item['jd_no'])+'" onclick="getDateThree('+decodeURIComponent(item['jd_no'])+', \''+decodeURIComponent(item['from_date_origin']).replace(/\+/g,' ')+'\', \''+decodeURIComponent(item['to_date_origin']).replace(/\+/g,' ')+'\')">'+decodeURIComponent(item['from_date']).replace(/\+/g,' ')+'('+decodeURIComponent(item['from_date_weekday']).replace(/\+/g,' ')+')~ '+decodeURIComponent(item['to_date']).replace(/\+/g,' ')+'('+decodeURIComponent(item['to_date_weekday']).replace(/\+/g,' ')+')</li>');

                text += '<li id="header'+decodeURIComponent(item['menu_no'])+'" onclick="leafletLink('+decodeURIComponent(item['jd_no'])+', '+decodeURIComponent(item['menu_no']).replace(/\+/g,' ')+', '+ff_vm_cp_no+', \''+decodeURIComponent(item['menu_type_cd'])+'\');" data-menu_type_cd="'+decodeURIComponent(item['menu_type_cd'])+'"><a href="../m_leaflet/m_leaflet.html?vm_cp_no='+ff_vm_cp_no+'&menu_no='+decodeURIComponent(item['menu_no'])+'&jd_no='+decodeURIComponent(item['jd_no'])+'">'+decodeURIComponent(item['menu_name'])+'</a></li>'
				
				if (index == 0)
				{
					initMenuNo = decodeURIComponent(item['menu_no']);
					localStorage.setItem("initMenuNo",initMenuNo);
				}
			});


			//text += '<li id="headerCoupon"><a href="#" onclick="coupon();">쿠폰</a></li>';
			//text += '<li id="headerEvent"><a href="#" onclick="events();">이벤트</a></li>';
			//text += '<li id="headerShop"><a href="#" onclick="shop();">장보기</a></li>';
        }
		
		$("#headerMenuArea").empty();
		$("#headerMenuArea").append(text);

		getMenuListDefault(ff_vm_cp_no);

		//var ofLength = $("#headerMenuArea li").length;
		
		//$("#headerMenuArea").width(90*ofLength);
		
		var isInIFrame = ( window.location != window.parent.location );
		if (isInIFrame == true){
			$('html').removeClass('hide-scrollbar');
		}else{
			$('html').addClass('hide-scrollbar');
		}

//        var locHeader = location.pathname,
//            headerHome = locHeader.includes('main'),
//            headerCoupon = locHeader.includes('coupon'),
//            headerShop = locHeader.includes('shop'),
//			headerLeaflet = locHeader.includes('leaflet'),
//            headerEvent = locHeader.includes('event');
//
//        
//
//        if(headerHome == true){
//            $("#headerHome").addClass("headerActive");
//        }else if(headerCoupon == true){
//            $("#headerCoupon").addClass("headerActive");
//        }else if(headerShop == true){
//            $("#headerShop").addClass("headerActive");    
//        }else if(headerEvent == true){
//            $("#headerEvent").addClass("headerActive");
//        }else if(headerLeaflet == true){
//			$("#header"+menu_no).addClass("headerActive");
//        }else{
//		
//		}

    });
}


/* 이벤트, 쿠폰, 장보기 숨기기여부를 바인딩한다. */
function getMenuListDefault(rcvCompanyNo) {

    $.ajax({
		url:'https://www.nhhanaromart.com/back/04_home/menuCreateSelectDefault.jsp?random=' + (Math.random()*99999),
		data : {userCompanyNo: rcvCompanyNo},
        method : 'GET' 
    }).done(function(result){

		var text = "";
				   
        console.log("menuList=========================================");
        if(result == ('NoN') || result == 'list error' || result == 'empty'){
            console.log(result);
			if (rcvCompanyNo == 0)
			{
			}else{

				text += '<li id="headerCoupon"><a href="#" onclick="coupon();">쿠폰</a></li>';
				text += '<li id="headerEvent"><a href="#" onclick="events();">이벤트</a></li>';
				text += '<li id="headerShop"><a href="#" onclick="shop();">장보기</a></li>';

				$("#headerMenuArea").append(text);
			}
		
        }else{

            console.log("============= notice callback ========================");
            console.log(result);
            var data = JSON.parse(result);
			
			var jsonResult_menu = data.CompanyList

			for(var i in jsonResult_menu){
					if ( jsonResult_menu[i].coupon_fg == "N" )
				   {
						text += '<li id="headerCoupon"><a href="#" onclick="coupon();">쿠폰</a></li>';
				   }else{
				   }		

					if ( jsonResult_menu[i].event_fg == "N" )
				   {
						text += '<li id="headerEvent"><a href="#" onclick="events();">이벤트</a></li>';
				   }else{
				   }

					if ( jsonResult_menu[i].jang_fg == "N" )
				   {
						text += '<li id="headerShop"><a href="#" onclick="shop();">장보기</a></li>';
				   }else{
				   }
			}

			$("#headerMenuArea").append(text);
			
        }

		var ofLength = $("#headerMenuArea li").length;
		$("#headerMenuArea").width(90*ofLength);

		var locHeader = location.pathname;
            
        var arSplitUrl   = locHeader.split("/");    //   "/" 로 전체 url 을 나눈다
        var nArLength     = arSplitUrl.length;
        var arFileName         = arSplitUrl[nArLength-1];   // 나누어진 배열의 맨 끝이 파일명이다
        var arSplitFileName     = arFileName.split(".");   // 파일명을 다시 "." 로 나누면 파일이름과 확장자로 나뉜다
        var sFileName = arSplitFileName[0];         // 파일이름


        var headerHome = sFileName == 'main',
            headerCoupon = sFileName == 'coupon',
            headerShop = sFileName == 'shop',
			headerLeaflet = sFileName == 'm_leaflet',
            headerEvent = sFileName == 'event';

        

        if(headerHome == true){
            $("#headerHome").addClass("headerActive");
        }else if(headerCoupon == true){
            $("#headerCoupon").addClass("headerActive");
        }else if(headerShop == true){
            $("#headerShop").addClass("headerActive");    
        }else if(headerEvent == true){
            $("#headerEvent").addClass("headerActive");
        }else if(headerLeaflet == true){
			$("#header"+menu_no).addClass("headerActive");
        }else{
		
		}

		//누른 메뉴가 가장 오른쪽에 오게하기
		var headerW = $("#headerMenuArea").width();
		var indexOf = $("#headerMenuArea li.headerActive").index();
		var countIndex = 90*(indexOf-1);
		if(countIndex >= headerW){
			$("nav").scrollLeft(headerW - 270);
		}else{
			$("nav").scrollLeft(countIndex);
		}

    });
}


//aside 불러오기
function getLeft(){

    var isInIFrame = ( window.location != window.parent.location );

	if (isInIFrame == true)
	{
		$("#aside").hide()
        $(".aside_btn").click(function(){
             $("#aside").css("display","none");
            alert("관리자모드에서는 사용할 수 없습니다.");
         })

	}else{

        $("#aside").hide();
		$(".aside_btn").click(function(){
             $("#aside").show();
             $("#aside_wrap").stop(1500).animate({left : "0"});
         })
         $(".close_button, #aside_black").click(function(){ 
             $("#aside").hide();
             $("#aside_wrap").stop(1500).animate({left : "-100%"});
         })
     
        $(".aside_mypage>a").click(function(){
            $(".aside_mypage ul").toggleClass("active");
            $(this).find("img").toggleClass("active");
        })
         
	}


}


// 값의 길이 체크
function chrLen(str){
	var strLength = str.length;
	return strLength;
}

// 콤마 찍기
function comma(str) {
  str = String(str);
  return str.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
}

// 콤마 풀기
function uncomma(str) {
  str = String(str);
  return str.replace(/[^\d]+/g, '');
}
// 시간 콤마 찍기
function timeComma(str) {
    str = String(str);
    return str.replace(/(\d)(?=(?:\d{2})+(?!\d))/g, '$1:')

}
function setCookie1(name,value,days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else var expires = "";
	document.cookie = name+"="+value+"; path=/";
}

/*배너 업로드 파일*/
function bannerUpload(targetInput, complete){
	var uploadFiles = targetInput.files[0];
    var reader = new FileReader();
    try{var fileName = uploadFiles.name;}catch(e){alert('파일을 선택해주시기 바랍니다.');return;};
	reader.onload = function(evt) {
		var url = '/back/00_include/fileUploadBanner.jsp';
        var xhr = new XMLHttpRequest() || new window.XDomainRequest();
        xhr.onreadystatechange = function(){
        if(xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
			var result = xhr.responseText;
            complete(result);
			};
		};

		var formData = new FormData();
		formData.append('uploadFile[]', uploadFiles, fileName);
		xhr.open("POST", url, false);
		xhr.send(formData);
   };
   reader.readAsArrayBuffer(uploadFiles);
};

//헤더 아래 돌아가는 공지사항

function header_notice(){
	
    
    var sliderLength = $("#noticeAniBox li").length;
    
    //슬라이드가 하나일 때 돌아가지 않게 한다.
    if( sliderLength == 0 ){
       
        $("#noticeAniBox").css("margin-top","0");
        
     //슬라이드가 여러개일 때 애니메이션이 작동한다.  
       }else{
       
        	var dir = -1 ;
            function roll(a){
                var aniH = $(".header_notice_wrap").height();
                $(".notice_ani_box").stop(true, true).animate({"marginTop":a*aniH+parseInt($(".notice_ani_box").css("margin-top"))},700,function(){
                 
                    if(a==-1){
                        
                        $(">li:first-child",this).appendTo($(this));
                       
                       }else{
                        $(">li:last-child",this).prependTo($(this));
                       }
                    $(".notice_ani_box").css("margin-top",-aniH);
                })
          
            }
            
            
            var autoRoll = setInterval(function(){roll(-1);},4000);
            
            $(".header_notice_wrap").on("mouseenter",function(){
                clearInterval(autoRoll);
            }).on("mouseleave",function(){
                autoRoll = setInterval(function(){roll(-1);},4000);
            })
       
       }
    



}

/*  해더 우상단 찜 카운트 select */
function zzimCount(rcvTel, rcv_vm_cp_no){

    $.ajax({
        url:'https://www.nhhanaromart.com/back/04_home/zzim.jsp?random=' + (Math.random()*99999), 
        data : {tel: rcvTel, vm_cp_no: rcv_vm_cp_no},
        method : 'GET' 
    }).done(function(result){

		var text = "";
        console.log("noticeList=========================================");
        if(result.trim() == 'NoN' || result == 'list error' || result == 'empty'){
            console.log(result);
        }else{
            console.log("============= notice callback ========================");
            console.log(result);
            var data = JSON.parse(result);
		
			data['PdContentList'].forEach(function(item, index){ 

				text += '<a href="#"> <img src="../images/like.png" alt="찜하기"> </a>';
				if(item['zzim_cnt'] == 0){

               }else{
                   text += '<span class="header_alert" id="zzimCount">'+item['zzim_cnt']+'</span>';
                }
			
			});
		
			$("#cart").empty();
			$("#cart").append(text);

        }
    });
}

// 미완임.
function pushCount(rcvTel){

    $.ajax({
        url:'https://www.nhhanaromart.com/back/04_home/push.jsp?random=' + (Math.random()*99999), 
        data : {tel: rcvTel},
        method : 'GET' 
    }).done(function(result){

		var text = "";
        console.log("noticeList=========================================");
        if(result.trim() == 'NoN' || result == 'list error' || result == 'empty'){
            console.log(result);

        }else{
            console.log("============= notice callback ========================");
            console.log(result);
            var data = JSON.parse(result);

			text += '<span class="header_alert" id="pushCount">'+ data['PdContentList'].length +'</span>';

			$("#alert").empty();
			$("#alert").append(text);

        }
    });


}

function deleteAllCookies()
 {
  var expireDate = new Date();
  //어제 날짜를 쿠키 소멸 날짜로 설정한다.
  expireDate.setDate( expireDate.getDate() - 1 );
  document.cookie = 'userNo' + "= " + "; expires=" + expireDate.toGMTString() + "; path=/";
  document.cookie = 'userToken' + "= " + "; expires=" + expireDate.toGMTString() + "; path=/";
  document.cookie = 'contNo' + "= " + "; expires=" + expireDate.toGMTString() + "; path=/";
  document.cookie = 'contToken' + "= " + "; expires=" + expireDate.toGMTString() + "; path=/";
  document.cookie = 'userCompanyNo' + "= " + "; expires=" + expireDate.toGMTString() + "; path=/";
  document.cookie = 'userCompanyName' + "= " + "; expires=" + expireDate.toGMTString() + "; path=/";
  document.cookie = 'userEmail' + "= " + "; expires=" + expireDate.toGMTString() + "; path=/";
  document.cookie = 'usercellPhone' + "= " + "; expires=" + expireDate.toGMTString() + "; path=/";
  document.cookie = 'userRoleCd' + "= " + "; expires=" + expireDate.toGMTString() + "; path=/";
  document.cookie = 'userRoleName' + "= " + "; expires=" + expireDate.toGMTString() + "; path=/";
  document.cookie = 'userEmpNo' + "= " + "; expires=" + expireDate.toGMTString() + "; path=/";
  document.cookie = 'jd_prod_con_no' + "= " + "; expires=" + expireDate.toGMTString() + "; path=/";
  document.cookie = 'userName' + "= " + "; expires=" + expireDate.toGMTString() + "; path=/";
  document.cookie = 'jd_no' + "= " + "; expires=" + expireDate.toGMTString() + "; path=/";
  for (i=0;i <= 100 ; i++){
	document.cookie = 'curJd'+i+ "= " + "; expires=" + expireDate.toGMTString() + "; path=/";
  }
  document.cookie = 'jd_prod_con_no' + "= " + "; expires=" + expireDate.toGMTString() + "; path=/";	
  document.cookie = 'menu_no' + "= " + "; expires=" + expireDate.toGMTString() + "; path=/";	
  document.cookie = 'menu_type_cd' + "= " + "; expires=" + expireDate.toGMTString() + "; path=/";	
  location.href="../index.html";
 }

  function getCpName(vm_cp_no){

	$.ajax({
        url:'https://www.nhhanaromart.com/back/02_app/mLeafletCpName.jsp?random=' + (Math.random()*99999), 
        data : {vm_cp_no: vm_cp_no},
        method : 'GET' 
    }).done(function(result){

        console.log("CompanyName=========================================");
        if(result == ('NoN') || result == 'list error' || result == 'empty'){
            console.log(result);
        }else{
            $("#cpName").empty();
            console.log("============= notice callback ========================");
            console.log(result);
            var data = JSON.parse(result);
            
			data['CompanyName'].forEach(function(item, index){ 
				$("#cpName").append(decodeURIComponent(item['vm_cp_name']).replace(/\+/g,' '));
			});
			
        }
    });
}

/*  로그 insert하기 20200103*/
function logInsert(rcvTel, rcv_vm_cp_no, rcv_menu_no){

    $.ajax({
        url:'https://www.nhhanaromart.com/back/00_include/logInsert.jsp?random=' + (Math.random()*99999), 
        data : {stel: rcvTel, svm_cp_no: rcv_vm_cp_no, srcv_menu_no: rcv_menu_no, pageName: window.location.pathname},
        method : 'GET' 
    }).done(function(result){

        console.log("noticeList=========================================");
        if(result.trim() == 'NoN' || result == 'list error' || result == 'empty'){
            console.log(result);
        }else{
            console.log("============= notice callback ========================");
            console.log(result);
        }
    });
}