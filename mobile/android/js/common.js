$(function(){

	header_notice();
	
	// 전역변수 파라미터 ( 판매장이 보낸 문자링크때 주로 사용된다. )	
	menu_no = getParameterByName('menu_no');   // 메뉴 번호
	vm_cp_no = getParameterByName('vm_cp_no');

	var memberNo = localStorage.getItem("memberNo");
	zzimCount(memberNo, localStorage.getItem("vm_cp_no"));

	jd_no = getParameterByName('jd_no');

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

function getShare(){

	var rowURL = window.location.href;

	if (jd_no == "")
	{
        /*var shareURLK = "https://www.nhhanaromart.com/app"+rowURL.substring(25,rowURL.length)+"?vm_cp_no="+vm_cp_no+"&menu_no="+menu_no;*/
        var shareURLK = "https://www.nhhanaromart.com/app/home/main.html?vm_cp_no="+vm_cp_no;
	console.log(shareURLK);
	}else{
		var shareURLK = "https://www.nhhanaromart.com/app"+rowURL.substring(25,rowURL.length);
	console.log(shareURLK);
	}

	var result = '';
	 
	result += '	<div id="share_btn" onclick="share_btn();">	';		
	result += '		<div class="share_btn_inner">	';
	result += '			<img src="../images/share_btn.png" alt="공유하기">';
	result += '		</div>';
	result += '	</div>';
	result += '	<div id="share_list">';  
	result += '	   <ul>';
//	result += '		   <li><a href="#" onclick="window.plugins.socialsharing.share(\'국산대표! 가장 빠르게 만나는 하나로마트 행사 소식\', \'하나로마트 쿠폰&amp;전단\', \'https://www.nhhanaromart.com/app/images/Icon-512.png\', \''+shareURLK+'\')"><img src="../images/share.png" alt="공유하기">공유하기</a></li>';
	result += '		   <li><a href="#" onclick="window.plugins.socialsharing.share(null, null, null, \''+shareURLK+'\')"><img src="../images/share.png" alt="공유하기">공유하기</a></li>';
	result += '		   <li><a href="../mypage/my_coupon.html"><img src="../images/coupon.png" alt="쿠폰">my 쿠폰</a></li>';
//	result += '		   <li><a href="../mypage/stamp.html"><img src="../images/stamps.png" alt="스탬프">스탬프</a></li>'; // 스탬프 숨김 200401
	result += '	   </ul>';
	result += '	</div>';    
    
    //nav_header 유무로 공유버튼 붙이기 20200110 김나영
    if($("#nav_header").length == 0){
        $(".inner_box").append(result);
    }else{
        $("#nav_header").append(result);
    }

}

function getHeader(rcVm_p_no){
	
    var result = '';
	 	
		result += '	<div id="aside">';
	result += '		<div id="aside_black"></div>';
	result += '		<div id="aside_wrap">';
	result += '			<div class="close_button"><img src="../images/close_btn.png" alt="닫기"></div>';
	result += '			<div class="aside_login">';
//	result += '	<a href="../home/main.html">홈</a>';
    result += '				</div>';
    
    //메뉴 내리기
    // result += '			<div class="aside_mypage nullHide"><div><a href="#">마이페이지<img src="../images/down.png" alt="메뉴 내리기"></a></div>';
	// result += '			<ul class="nullHide">';
	// result += '				<li><a href="#" onclick="my_info();">나의 정보</a></li>';
	// result += '				<li><a href="#" onclick="my_coupon();">쿠폰</a></li>';
	// result += '				<li><a href="#" onclick="my_stamp();">스탬프</a></li>'; // 스탬프 숨김 200401
	// result += '				<li><a href="#" onclick="my_del();">주문/배송</a></li>';
    // result += '			</ul></div>';
    //메뉴 내리기
	result += '			<div class="aside_category">';
	result += '				<ul>';
    //result += '				<li><a href="#" onclick="cart();">장바구니</a></li>';
    result += '		     		<li><a href="#" onclick="my_coupon();">My쿠폰</a></li>';
    result += '					<li><a href="#" onclick="offline();">매장변경</a></li>';    
	result += '					<li><a href="#" onclick="zzim();" style="color: #fff;font-size: 13px;">찜하기</a></li>';            
    result += '					<li><a href="#" onclick="qna();" style="color: #fff;font-size: 13px;">1:1 문의하기</a></li>';
    result += '					<li><a href="#" onclick="notice();" style="color: #fff;font-size: 13px;">공지사항</a></li>';    
	result += '					<li><a href="#" onclick="my_info();" style="color: #fff;font-size: 13px;">나의정보</a></li>';        
    //result += '				<li><a href="#" onclick="setting();">설정</a></li>';
	result += '				</ul>';
	result += '			</div>   '; 
	result += '			<div id="aside_tos"><a href="#" onclick="tos();">이용약관 및 개인정보처리방침</a></div>';		
    result += '<div id="aside_icons"><ul><li class="aside_cart" onclick="zzim();"><img src="../images/icon.png" alt="장바구니"><span>찜하기</span></li>';
    result += '<li class="aside_notice" onclick="notice();"><img src="../images/notice.png" alt="공지사항"><span>공지사항</span></li>';
    result += '<li class="aside_setting" onclick="setting();"><img src="../images/edit.png" alt="환경설정"><span>환경설정</span></li>';
    result += '</ul></div><span id="aside_copyright">Copyrightⓒ 2020. 농협유통</span>';
	result += '		</div>';
	result += '	</div>';
	result += '	<header>';
	result += '		<h1>';
	result += '			<a href="../home/main.html">';
	result += '				<img src="../images/logo.png" alt="하나로마트">';
	result += '				<span class="store_name" id="cpName"></span>';
	result += '			</a>';
	result += '		</h1>';
	result += '		<div class="aside_btn">';
	result += '			<a href="#"> <img src="../images/menu.png" alt="네비게이션 열기"> </a>';
	result += '		</div>';
	result += '		<div id="header_inner_wrap">';
	result += '			<div id="cart">';
	result += '				<a href="../home/zzim.html"> <img src="../images/like.png" alt="찜하기"> </a>';
	result += '				<span class="header_alert" id="zzimCount"></span>';
	result += '			</div><div ';
	result += '			id="alert">';
	result += '				<a href="../home/push.html"> <img src="../images/alert.png" alt="알림창"> </a>';
//	result += '				<span class="header_alert" id="pushCount">1</span>';
    result += '			</div>';
	// result += '			</div><div ';
	// result += '			id="search">';
	// result += '				<a href="../home/search.html"> <img src="../images/search.png" alt="검색"> </a>';
	// result += '			</div>';
	result += '		</div>';
	result += '		<nav>';
	result += '			<ul id="headerMenuArea">     ';
	//result += '				<li><a href="#" class="home">홈</a></li>';
	//result += '				<li><a href="#">전단행사</a></li>';
	//result += '				<li><a href="#">MENU3</a></li>';
	//result += '				<li><a href="#">MENU4</a></li>';
	//result += '				<li><a href="#">MENU5</a></li>';
	//result += '				<li><a href="#">MENU6</a></li>';
	//result += '				<li><a href="#">장보기</a></li>';					
	result += '			</ul>';
	result += '		</nav>';		
	result += '	</header>';
	
	
	$("#nav_header").append(result);

	getHeaderMenu(rcVm_p_no);
	
	if (localStorage.getItem("memberNo") == null){
		$(".nullHide").hide();
	}else{
		$(".nullHide").show();
	}
}

// header menu를 셋팅한다. https://www.nhhanaromart.com
function getHeaderMenu(ff_vm_cp_no) {

    ////////관리자 페이지에서는 숨긴 전단도 보여줌!
 var isInIFrame = ( window.location != window.parent.location );
 if (isInIFrame == true){
     var rcv_show_fg = "'Y','N'";
 }else{
     var rcv_show_fg = "'Y'";
 }
 ////////관리자 페이지에서는 숨긴 전단도 보여줌!

 $.ajax({
     url:'https://www.nhhanaromart.com/back/02_app/mLeafletHeaderMenuCount.jsp?random=' + (Math.random()*99999), 
     data : {userCompanyNo: ff_vm_cp_no, rcv_show_fg: rcv_show_fg},
     method : 'GET' 
 }).done(function(result){

     console.log("getHeaderMenu========================================="+result);
     if(result == ('NoN') || result == 'exception error' || result == 'empty'){
         console.log("getHeaderMenu"+result);
     }else{
         console.log("============= getHeaderMenu callback ========================");
         console.log("getHeaderMenu callback"+result);
         var data = JSON.parse(result);

         var text = '<li id="headerHome"><a href="#" onclick="home();" class="home">홈</a></li>';

         data['DateCategoryList'].forEach(function(item, index){                        
             if (decodeURIComponent(item['prod_cont_count']) >= 1){
                 text += '<li id="header'+decodeURIComponent(item['menu_no'])+'" data-menu_type_cd="'+decodeURIComponent(item['menu_type_cd'])+'"><a href="../m_leaflet/m_leaflet.html?vm_cp_no='+ff_vm_cp_no+'&menu_no='+decodeURIComponent(item['menu_no'])+'&jd_no='+decodeURIComponent(item['jd_no'])+'">'+decodeURIComponent(item['menu_name'])+'</a><span class="nav_menu_alert" id="prod_cont_count">'+decodeURIComponent(item['prod_cont_count'])+'</span></li>'
             }else{
                 text += '<li id="header'+decodeURIComponent(item['menu_no'])+'" data-menu_type_cd="'+decodeURIComponent(item['menu_type_cd'])+'"><a href="../m_leaflet/m_leaflet.html?vm_cp_no='+ff_vm_cp_no+'&menu_no='+decodeURIComponent(item['menu_no'])+'&jd_no='+decodeURIComponent(item['jd_no'])+'">'+decodeURIComponent(item['menu_name'])+'</a></li>'
             }                
             
             if (index == 0){
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
     
        $(".aside_mypage>div").click(function(){
            $(".aside_category ul li:first-child").toggleClass("active");
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
function zzimCount(rcvNo, rcv_vm_cp_no){

    $.ajax({
        url:'https://www.nhhanaromart.com/back/04_home/zzim.jsp?random=' + (Math.random()*99999), 
        data : {memberNo: rcvNo, vm_cp_no: rcv_vm_cp_no},
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
				
				text += '<a href="../home/zzim.html"> <img src="../images/like.png" alt="찜하기"> </a>';
                
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

			text +='0'

			$("#pushCount").empty();
			$("#pushCount").append(text);
        }else{
            console.log("============= notice callback ========================");
            console.log(result);
            var data = JSON.parse(result);
			
			text +=''+ data['PdContentList'].length +''
		
			$("#pushCount").empty();
			$("#pushCount").append(text);

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
function logInsert(rcvNo, rcv_vm_cp_no, rcv_menu_no){

    $.ajax({
        url:'https://www.nhhanaromart.com/back/00_include/logInsert.jsp?random=' + (Math.random()*99999), 
        data : {stel: rcvNo, svm_cp_no: rcv_vm_cp_no, srcv_menu_no: rcv_menu_no, pageName: window.location.pathname},
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