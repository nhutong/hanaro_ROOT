$(function () {

	vm_cp_no = getParameterByName('vm_cp_no');   // 판매장번호
	menu_no  = getCookie('menu_no');    // 메뉴 번호

	if (vm_cp_no == "")
	{
		//로그인한 판매장의 판매장번호를 로그인한 쿠키정보에서 가져온다.
		vm_cp_no = getCookie("userCompanyNo");
	}

	/* 공통부분 시작======================================================================== */
	/* 좌상단 로그인 유저의 정보를 바인딩한다. */
	getHeader();
	

	/* 좌측 메뉴를 바인딩한다. */
	getLeft();
	//getLeftMenu('home');
	$("#nh_home_menu_create").addClass("active");
	
	
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

	/*판매장 변경시, */
	
	$("#sort_select").on("change",function(){
		if ($("#sort_select").val() == "" )
		{
		}else{
			// 1. 현재 선택한 판매장 정보를 쿠키에 저장한다.
			setCookie1("onSelectCompanyNo",$("#sort_select").val());
			getLeftNav(getCookie("onSelectCompanyNo"));
			localStorage.setItem("vm_cp_no",$("#sort_select").val());			
			setCookie1("menu_no","");

			// 2. 저장된 쿠키정보를 이용하여 메뉴정보를 바인딩한다. 
			//c_univ_list(getCookie("onSelectCompanyNo"));
			getLeftNav(getCookie("onSelectCompanyNo"), menu_no);
			
			// 3. iframe 내부 모바일웹의 판매장셋팅을 위해, 로컬스토리지에 판매장번호를 셋팅한다.
//			localStorage.setItem("vm_cp_no",$("#sort_select").val());

			// 4. 선택한 판매장번로를 이용하여 iframe reload 한다.
//			document.getElementById("nh_main").src="../app/home/main.html?vm_cp_no="+$("#sort_select").val();
		}
	});
	/* 공통부분 종료======================================================================== */
	

	/* 최초 로딩를 고려하여, 현재 로그인한 유저의 판매장번호로 긴급공지정보를 바인딩한다. */
	//c_univ_list(CuserCompanyNo);
	getLeftNav(targetCompanyNo, menu_no);

    $(".nav_leaflet").addClass("active");

	if (getCookie("menu_type_cd") == "MENU4" || getCookie("menu_type_cd") == "MENU5" || getCookie("menu_type_cd") == "MENU6")
	{
		$("#leaflet_create_date").hide();
		$("#attachFile").append('<a href="/download/oneDay_jundan_contents.xls">oneDay_jundan_contents.xls</a>');
	}else{
		$("#attachFile").append('<a href="/download/jundan_contents.xls">jundan_contents.xls</a>');
	}
});

/*엑셀파일 업로더*/
var enterUpload = document.getElementById('jundan_excel_btn');
enterUpload.addEventListener('click', function(evt){
	var inputFile = document.getElementById('uploadFile');
	new Upload(inputFile, function(result){
		$("#excel_path").val(result);
//		$("#airtel_thumnail_path_img").attr("src", "/upload/"+result);
		alert("업로드 완료 - 등록하기 버튼을 눌러주세요.");
	});
});

function history_back(){
	history.back();
}

/*common2에도 있어서 주석처리함 200106 김나영*/
// 판매장을 리스팅한다.
//function getManagerList(rcvVmCpNo) {
//
//    $.ajax({
//        url:'/back/03_leaflet/leafletManagerList.jsp?random=' + (Math.random()*99999),
//		data : {userCompanyNo: rcvVmCpNo},
//        method : 'GET' 
//    }).done(function(result){
//
//        console.log("판매장리스트=========================================");
//        if(result == ('NoN') || result == 'list error' || result == 'empty'){
//            console.log(result);
//        }else{
//            console.log("============= 판매장리스트 callback ========================");
//            console.log(result);
//            var data = JSON.parse(result);
//
//            data['CompanyList'].forEach(function(item, index){                        
//                $("#sort_select").append('<option value="'+decodeURIComponent(item['VM_CP_NO']).replace(/\+/g,' ')+'">'+decodeURIComponent(item['VM_CP_NAME']).replace(/\+/g,' ')+'</option>');
//            });
//        }
//    });
//}

// 좌측 메뉴리스트를 가져온다
function getLeftNav(rcv_vm_cp_no, rcv_menu_no) {

    $.ajax({
        url:'/back/03_leaflet/leafletUserMenu.jsp?random=' + (Math.random()*99999), 
        data : {userCompanyNo: rcv_vm_cp_no},
        method : 'GET' 
    }).done(function(result){

        console.log("좌측메뉴리스트=========================================");
        if(result == ('NoN') || result == 'list error' || result == 'empty'){
            console.log(result);
			$('#myplanb_menu').empty();
        }else{
            console.log("============= 좌측메뉴리스트 callback ========================");
            console.log(result);
            var data = JSON.parse(result);
			
			$('#myplanb_menu').empty();
            data['myplanb_menu'].forEach(function(item, index){                        
				
				// 해당메뉴에 매핑된 최초전단(일일특가)을 설정한다.
				if ( rcv_menu_no == "" ){
					if ( index == "0")
					{
						$('#myplanb_menu').append('<li class="active">'+decodeURIComponent(item['menu_name']).replace(/\+/g,' ')+'</li>');
						setCookie1("menu_no",decodeURIComponent(item['menu_no']));
						setCookie1("menu_type_cd",decodeURIComponent(item['menu_type_cd']));
					}else{
						$('#myplanb_menu').append('<li onclick="getLeftNav('+rcv_vm_cp_no+', '+decodeURIComponent(item['menu_no'])+');">'+decodeURIComponent(item['menu_name']).replace(/\+/g,' ')+'</li>');
					}
				/* 행사/전단 메뉴를 통해서 정산적 접근의 경우, 최초, 하기 else 문으로 처리된다. */
				}else{
					if ( rcv_menu_no == decodeURIComponent(item['menu_no']))
					{
						$('#myplanb_menu').append('<li class="active">'+decodeURIComponent(item['menu_name']).replace(/\+/g,' ')+'</li>');
						setCookie1("menu_no",decodeURIComponent(item['menu_no']));
						setCookie1("menu_type_cd",decodeURIComponent(item['menu_type_cd']));
					}else{
						$('#myplanb_menu').append('<li onclick="getLeftNav('+rcv_vm_cp_no+', '+decodeURIComponent(item['menu_no'])+');">'+decodeURIComponent(item['menu_name']).replace(/\+/g,' ')+'</li>');
					}
				}

				var menu_type_cd_selected = getCookie("menu_type_cd");

//				if(menu_type_cd_selected == "MENU1" || menu_type_cd_selected == "MENU2" || menu_type_cd_selected == "MENU3"){
//					$("#leaflet_create_date").show();
//					$("#leaflet_create_date_one").hide();
//				}else{
//					$("#leaflet_create_date").hide();
//					$("#leaflet_create_date_one").show();
//				}
			});
        }
    });
}

/*신규등록하기 버튼 클릭시, 신규전단을 등록한다.*/
$("#jundan_excel_new").on("click",function(){

	var menu_no = getCookie("menu_no");
	var userCompanyNo = getCookie("onSelectCompanyNo");
	var jundan_from_date = encodeURIComponent($("#jundan_from_date").val());
	var jundan_end_date = encodeURIComponent($("#jundan_end_date").val());
	var excel_path = $("#excel_path").val();

	if ( getCookie("menu_type_cd") == "MENU4" || getCookie("menu_type_cd") == "MENU5" || getCookie("menu_type_cd") == "MENU6" ){

		jundan_from_date = "2020-01-01";
		jundan_end_date = "2020-01-01";

	}else{

		if ( jundan_from_date == null || chrLen(jundan_from_date) == 0)
		{
			alert("전단 시작일을 입력하시기 바랍니다.");
			return false;
		}

		if ( jundan_end_date == null || chrLen(jundan_end_date) == 0)
		{
			alert("전단 종료일을 입력하시기 바랍니다.");
			return false;
		}

	//	if ( getCookie("menu_type_cd") == "MENU4" || getCookie("menu_type_cd") == "MENU5" || getCookie("menu_type_cd") == "MENU6" )
	//	{
	//		if (jundan_from_date == jundan_end_date){
	//		}
	//		else{
	//			alert("특가 전단의 경우, 행사시작일과 행사종료일을 동일하게 입력하시기 바랍니다.");
	//			return false;
	//		}
	//	}

		var jandanFromNum = Number(replaceAll(jundan_from_date,"-",""));
		var jandanEndNum =  Number(replaceAll(jundan_end_date,"-",""));

		var d = new Date();
		var nowDate = d.getFullYear()+leadingZeros((Number(d.getMonth())+1),2)+d.getDate();

		if (nowDate - jandanFromNum > 0)
		{
			alert("과거 날짜를 시작일로 등록하실수 없습니다.");
			return false;
		}

		if (jandanFromNum - jandanEndNum > 0)
		{
			alert("전단 종료일은 전단 시작일 이후 날짜여야만 합니다.");
			return false;
		}
	}

	if ( excel_path == null || chrLen(excel_path) == 0)
	{
		alert("파일을 업로드하시기 바랍니다.");
		return false;
	}

	$.ajax({
        url:'/back/03_leaflet/leafletConProdInsert.jsp?random=' + (Math.random()*99999),
		data : {menu_no: menu_no, userCompanyNo: userCompanyNo, jundan_from_date: jundan_from_date, jundan_end_date: jundan_end_date, excel_path: excel_path, menu_type_cd: getCookie("menu_type_cd")},
        method : 'GET' 
    }).done(function(result){

        console.log("noticeList=========================================");
        if(result == ('NoN') || result == 'exception error' || result == 'empty'){
            console.log(result);
			alert("전단 양식에 맞는 파일로 업로드하시기 바랍니다.");
        }else if(result == ('Dup')){
			alert("중복된 전단기간이 존재합니다. 전단기간을 수정해주시기 바랍니다.");
		}else if(result == ('NoN0')){
			alert("신규 전단번호가 생성되지 못하였습니다. 다시한번 시도해보시기 바랍니다.");
		}else if(result == ('order_number_no_exist')){
			alert("엑셀파일에서 순서가 입력되지 않은 행이 존재합니다.");
		}else if(result == ('order_number_not_number')){
			alert("엑셀파일에서 순서가 숫자가 아닌 행이 존재합니다.");
		}else if(result == ('pd_code_no_exist')){
			alert("엑셀파일에서 상품코드가 입력되지 않은 행이 존재합니다.");
		}else if(result == ('pd_name_no_exist')){
			alert("엑셀파일에서 상품명이 입력되지 않은 행이 존재합니다.");
		}else if(result == ('price_no_exist')){
			alert("엑셀파일에서 판매가격이 입력되지 않은 행이 존재합니다.");
		}else if(result == ('price_not_number')){
			alert("엑셀파일에서 판매가격이 숫자가 아닌 행이 존재합니다.");
		}else if(result == ('card_discount_not_number')){
			alert("엑셀파일에서 카드할인이 숫자가 아닌 행이 존재합니다.");
		}else if(result == ('card_discount_from_date_type_error')){
			alert("엑셀파일에서 카드시작일이 날짜형식이 아닌 행이 존재합니다. ex. 2019-10-01");
		}else if(result == ('card_discount_end_date_type_error')){
			alert("엑셀파일에서 카드종료일이 날짜형식이 아닌 행이 존재합니다. ex. 2019-10-01");
		}else if(result == ('coupon_discount_not_number')){
			alert("엑셀파일에서 쿠폰할인이 숫자가 아닌 행이 존재합니다.");
//		}else if(result == ('NoNPdNo')){
//			alert("엑셀파일에서 매핑되지 않는 상품코드가 입력된 행이 존재합니다.");
		}else if(result == ('NoNImgNo')){
			alert("엑셀파일에서 입력하신 상품코드와 매핑되는 이미지가 없는 행이 존재합니다.");
		}else if(result == ('oneDay_start_date_no_exist')){
			alert("행사시작일이 입력되지 않은 행이 존재합니다.");
		}else if(result == ('oneDay_start_date_type_error')){
			alert("행사시작일이 잘못입력된 행이 존재합니다.");
		}else if(result == ('oneDay_end_date_no_exist')){
			alert("행사종료일이 입력되지 않은 행이 존재합니다.");
		}else if(result == ('oneDay_end_date_type_error')){
			alert("행사종료일이 잘못입력된 행이 존재합니다.");
		}else if(result == ('oneDay_date_diff')){
			alert("행사시작일과 행사종료일이 다르게 입력된 행이 존재합니다.");
		}else{
            console.log("============= notice callback ========================");
            console.log(result);
            alert("등록이 완료되었습니다.");
			location.href="/leaflet/leaflet.html";
        }
    });
});

//function c_univ_list(rcvCompanyNo){
	//$.ajax({
        //url:'../back/03_leaflet/menuSelect.jsp?random=' + (Math.random()*99999),
		//data : {userCompanyNo: rcvCompanyNo},
        //method : 'GET' 
    //}).done(function(result){
		//var text = "";
		//if(result == 'no_result'){                    
			//console.log('메뉴 정보가 없습니다.');
		//}else if(result == 'NoN'){
			////location.href='/login.html';
        //}else{
			//var jsonResult = JSON.parse(result);
			
			//var jsonResult_menu = jsonResult.CompanyList

            //for(var i in jsonResult_menu){
				//text += '<option value="'+jsonResult_menu[i].menu_no+'">'+jsonResult_menu[i].menu_name+'</option>';
            //}
        //};	
		//$('#menuList').empty();
		//$('#menuList').append(text);		
	//});
//};