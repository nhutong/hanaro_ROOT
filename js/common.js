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

function setCookie1(name,value,days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else var expires = "";
	document.cookie = name+"="+value+"; path=/";
}

function getHeader(){
	
	if(getCookie("userNo") == ""){
		// 로그인 전 //
		$("#nav_header").append('<div class="top_menu_bg"><div class="top_menu"><h1><img src="../images/logo.png" onclick="login();" class="logo_img"></h1><p class="logout"></p></div></div>');
		
	}else{
		// 로그인 후
		$("#nav_header").append('<div class="top_menu_bg"><div class="top_menu"><h1><img src="../images/logo.png" onclick="home();" class="logo_img"></h1><ul class="tabs myplanb_tab"></ul><p class="logout"><span class="admin_btn" onclick="deleteAllCookies();login();">로그아웃</span></p></div></div>');

		// 권한코드 가져오기
		var userRoleCd = getCookie('userRoleCd');

		// 메뉴 추가
		var $ul = $("#nav_header ul.myplanb_tab");
		$ul.append('<li rel="tab1" class="nav_home" onclick="home();">홈</li>');
		$ul.append('<li rel="tab2" class="nav_leaflet" onclick="leaflet();">행사/전단</li>');
		$ul.append('<li rel="tab3" class="nav_event" onclick="event_list();">이벤트/쿠폰</li>');
//		$ul.append('<li rel="tab4" class="nav_shop_manage" onclick="shop_manage();">장보기</li>');
		$ul.append('<li rel="tab5" class="nav_product" onclick="prod_master();">상품</li>');
//		$ul.append('<li rel="tab6" class="nav_delivery" onclick="delivery();">배송</li>');
		$ul.append('<li rel="tab7" class="nav_push" onclick="push();">푸시</li>');
		
        // $ul.append('<li rel="tab7" class="nav_pop">종이전단/POP</li>');
		$ul.append('<li rel="tab8" class="nav_detail" onclick="menunotice();">공지/문의</li');
		if(userRoleCd === 'ROLE1'){ 
			// 본사관리자의 경우 운영 메뉴 추가 (관리자 페이지로 이동)
			$ul.append('<li rel="tab9" class="nav_manage" onclick="manage();">운영</li>');
		} else if(userRoleCd === 'ROLE2'){ 
			// 판매장관리자의 경우 운영 메뉴 추가 (판매장 페이지로 이동)
			$ul.append('<li rel="tab9" class="nav_manage" onclick="shop();">운영</li>');
		} else if(userRoleCd === 'ROLE3'){
			$ul.empty();
			$ul.append('<li rel="tab1" class="nav_home" onclick="home();">홈</li>');
			$ul.append('<li rel="tab6" class="nav_delivery" onclick="manage_order();">배송</li>');
		}
		$ul.append('<li><a href="../download/admin_manual.pdf" target="_blank" style="color:#fff;text-decoration:none;">매뉴얼</a><span style="font-size:12px;background-color:#55b190;padding:0.1px 6px;border-radius:50%;cursor:pointer;margin-left:4px;">?</span></li');
	}    
}

// function getHeader(){
	// var url;
	// if(getCookie("userNo") == ""){
	// 	url = '../include/header_login.html'
	// 	$.ajax({
	// 		url:url,
	// 		type:'GET',
	// 		async:false
	// 	}).done(function(result){ 
	// 		$("#nav_header").append(result);
	// 	});
	// }else{
	// 	url = '../include/header.html'
	// 	$.ajax({
	// 		url:url,
	// 		type:'GET',
	// 		async:false
	// 	}).done(function(result){
	// 		$("#nav_header").append(result);
	// 	});	
	// }
// }

function getLeft(){
	if(getCookie("userNo") == ""){

	}else{
		$("#my_data").append('<li><img src="../images/nh_icon_user.png" alt="회원정보" width="31px" height="37px"></li><li class="user_name">'+getCookie("userName")+'님</li><li class="user_email">'+getCookie("usercellPhone")+'</li><li class="startup_fg">'+getCookie("userRoleName")+'('+getCookie("userCompanyName")+')</li>');
		$("#my_data").click(function(){
			user_update();
		});
	}
}

function getLeftMenu(menu) {
	// 권한코드 가져오기
	var userRoleCd = getCookie('userRoleCd');

	var $leftmenu = $('#myplanb_menu');

	switch(menu) {
		case 'manage':
			if(userRoleCd === 'ROLE1'){ 
				// 본사관리자만 표시
                $leftmenu.empty();
				$leftmenu.append('<li id="myplanb_menu_manage" onclick="manage();">관리자</li>');
				$leftmenu.append('<li id="myplanb_menu_log_list" onclick="log_list();">로그</li>');
			}
			$leftmenu.append('<li id="myplanb_menu_shop" onclick="shop();">판매장</li>');
			$leftmenu.append('<li id="myplanb_menu_user" onclick="user();">회원</li>');
			$leftmenu.append('<li id="myplanb_menu_statistics_cu" onclick="statistics_cu();">누적 통계</li>');
			$leftmenu.append('<li id="myplanb_menu_statistics_pe" onclick="statistics_pe();">기간 통계</li>');
			break;

		case 'home':
			if(userRoleCd === 'ROLE3'){ 
				// 배송관리자 표시 안 함
				$leftmenu.empty();
				$leftmenu.append('<li id="nh_home_home" onclick="home();">홈화면</li>');
			}else{
				$leftmenu.empty();
				$leftmenu.append('<li id="nh_home_home" onclick="home();">홈화면</li>');
				$leftmenu.append('<li id="nh_home_notice" onclick="home_notice();">긴급공지</li>');
				$leftmenu.append('<li id="nh_home_swipe" onclick="swipe_banner();">스와이프 배너</li>');
				$leftmenu.append('<li id="nh_home_popup" onclick="popup();">팝업</li>');
				if(userRoleCd === 'ROLE1'){ 
					// 본사관리자만 표시
					$leftmenu.append('<li id="nh_home_menu_create" onclick="menu_create();">메뉴생성</li>');
				}
				$leftmenu.append('<li id="nh_home_menu_edit" onclick="menu_update();">메뉴관리</li>');
			}
			break;
			
		case 'event':
			$leftmenu.empty();
			$leftmenu.append('<li id="nh_event_list" onclick="event_list();">이벤트</li>');
			$leftmenu.append('<li id="nh_event_coupon" onclick="coupon();">쿠폰</li>');
			$leftmenu.append('<li id="nh_event_coupon_history" onclick="coupon_history();">- 쿠폰히스토리</li>');
			// $leftmenu.append('<li id="nh_event_stamp" onclick="stamp();">스탬프</li>');
			// $leftmenu.append('<li id="nh_event_stamp_num" onclick="stamp_num();">- 스탬프 확인번호</li>');
			// $leftmenu.append('<li id="nh_event_stamp_history" onclick="stamp_history();">- 스탬프 히스토리</li>');
			break;

		case 'product':
			$leftmenu.empty();
			$leftmenu.append('<li id="nh_product_prodmaster" onclick="prod_master();">상품마스터</li>');
			if(userRoleCd === 'ROLE1'){ 
				// 본사관리자만 표시
				$leftmenu.append('<li id="nh_product_imgmaster" onclick="img_master();">이미지마스터</li>');
			}
			$leftmenu.append('<li id="nh_product_storeimgmaster" onclick="store_imgmaster();">판매장 상품이미지</li>');
			break;

		case 'delivery':
			$leftmenu.empty();
			$leftmenu.append('<li id="nh_delivery_delivery" onclick="delivery();">기본배송정보</li>');
			$leftmenu.append('<li id="nh_delivery_delivery_time" onclick="delivery_time();">실시간 회차</li>');
			$leftmenu.append('<li id="nh_delivery_manage_order" onclick="manage_order();">주문관리</li>');
			if(userRoleCd === 'ROLE3'){ 
				$leftmenu.empty();
				$leftmenu.append('<li id="nh_delivery_manage_order" onclick="manage_order();">주문관리</li>');
			}
			break;

		case 'push':
			$leftmenu.empty();
			$leftmenu.append('<li id="nh_push_push" onclick="push();">PUSH</li>');
			break;
            
        case 'managemenu':
			$leftmenu.empty();
			$leftmenu.append('<li id="nh_manage_menu" onclick="menunotice();">공지사항 관리</li>');
			$leftmenu.append('<li id="nh_manage_qna" onclick="menuqna();">1:1문의</li>');
			break;


	}
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
  document.cookie = 'onSelectCompanyNo' + "= " + "; expires=" + expireDate.toGMTString() + "; path=/";
  document.cookie = 'VM_delivery_FG' + "= " + "; expires=" + expireDate.toGMTString() + "; path=/";
  document.cookie = 'VM_sales_FG' + "= " + "; expires=" + expireDate.toGMTString() + "; path=/";
  document.cookie = 'delivery_id' + "= " + "; expires=" + expireDate.toGMTString() + "; path=/";

  localStorage.clear();
  sessionStorage.clear();

  location.href="../index.html";
 }

/*공통 업로드 파일*/
function Upload(targetInput, complete){
	var uploadFiles = targetInput.files[0];
    var reader = new FileReader();
    try{var fileName = uploadFiles.name;}catch(e){alert('파일을 선택해주시기 바랍니다.');return;};
	reader.onload = function(evt) {
		var url = '/back/00_include/fileUpload.jsp';
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

/*공통 업로드 파일*/
function UploadImgGroup(targetInput, complete){
	var uploadFiles = targetInput.files[0];
    var reader = new FileReader();
    try{var fileName = uploadFiles.name;}catch(e){alert('파일을 선택해주시기 바랍니다.');return;};
	reader.onload = function(evt) {
		var url = '/back/00_include/fileUploadImgGroup.jsp';
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

// 숫자 체크
function Tcheck(target) {
	var i;
	var t = target.value;
	var k = '0123456789.';
	var flag = false;
	for (i = 0; i < t.length; i++) {
		if (k.indexOf(t.substring(i, i + 1)) < 0) {
			flag = true;
		}
	}
	if (flag) {
		alert("숫자만 입력할 수 있습니다..");
		target.value = '';
		return;
	}
	if (t.indexOf('.') != -1) { // '.' 이 포함되어 있다면..
		var t_length = t.substring(t.indexOf('.') + 1);
		if (t_length.length > 2) {
		alert('소수점 2자리까지만 입력됩니다.');
		target.value = '';
		return;
		}
	}
	return flag;
}

//전부바꾸기
function replaceAll(str, searchStr, replaceStr) {
  return str.split(searchStr).join(replaceStr);
}

// 숫자앞에 0 추가하기
function leadingZeros(n, digits) {
  var zero = '';
  n = n.toString();

  if (n.length < digits) {
    for (var i = 0; i < digits - n.length; i++)
      zero += '0';
  }
  return zero + n;
}

// 우상단 판매장을 리스팅한다.
function getManagerList(rcvCompanyNo, rcvTargetCompanyNo) {

    $.ajax({
        url:'/back/03_leaflet/leafletManagerList.jsp?random=' + (Math.random()*99999),
		data : {userCompanyNo: rcvCompanyNo},
        method : 'GET' 
    }).done(function(result){

        console.log("getManagerList=========================================");
        if(result == ('NoN') || result == 'list error' || result == 'empty'){
            console.log(result);
        }else{
            $("#noticeList").html("");
            console.log("============= getManagerList callback ========================");
            console.log(result);
            var data = JSON.parse(result);

            data['CompanyList'].forEach(function(item, index){
				if (rcvTargetCompanyNo == decodeURIComponent(item['VM_CP_NO']))
				{
					$("#sort_select").append('<option value="'+decodeURIComponent(item['VM_CP_NO']).replace(/\+/g,' ')+'" selected>'+decodeURIComponent(item['VM_CP_NAME']).replace(/\+/g,' ')+'</option>');
				}else{
					$("#sort_select").append('<option value="'+decodeURIComponent(item['VM_CP_NO']).replace(/\+/g,' ')+'">'+decodeURIComponent(item['VM_CP_NAME']).replace(/\+/g,' ')+'</option>');
				}
//                $("#sort_select").append('<option value="'+decodeURIComponent(item['VM_CP_NO']).replace(/\+/g,' ')+'">'+decodeURIComponent(item['VM_CP_NAME']).replace(/\+/g,' ')+'</option>');
            });
			if (getCookie("userRoleCd") == "ROLE2" )
			{
				setCookie1("onSelectCompanyNo",$("#sort_select").val());
				localStorage.setItem("vm_cp_no",$("#sort_select").val());
				if( $("#nh_main").length > 0 ){
					document.getElementById("nh_main").src = "../app/home/main.html?vm_cp_no="+$("#sort_select").val();
				}
			}
        }
    });
}