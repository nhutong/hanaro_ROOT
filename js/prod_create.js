$(function () {

	vm_cp_no = getParameterByName('vm_cp_no');   // 판매장번호
	menu_no  = getCookie('menu_no');    // 메뉴 번호

	if (vm_cp_no == "")
	{
		//로그인한 판매장의 판매장번호를 로그인한 쿠키정보에서 가져온다.
		vm_cp_no = getCookie("userCompanyNo");
	}

	//getHeader();
	//getLeft();
	//getLeftNav(vm_cp_no, menu_no);
	//getManagerList();


	/* 공통부분 시작======================================================================== */
	/* 좌상단 로그인 유저의 정보를 바인딩한다. */
	getHeader();
	$(".nav_shop_manage").addClass("active");

	/* 좌측 메뉴를 바인딩한다. */
	getLeft();


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
			localStorage.setItem("vm_cp_no",$("#sort_select").val());
		}
	});
	/* 공통부분 종료======================================================================== */

	/* 최초 로딩를 고려하여, 현재 로그인한 유저의 판매장번호로 긴급공지정보를 바인딩한다. */
	//c_univ_list(CuserCompanyNo);
//	getLeftNav(vm_cp_no, menu_no);
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

				if(menu_type_cd_selected == "MENU1" || menu_type_cd_selected == "MENU2" || menu_type_cd_selected == "MENU3"){
					$(".leaflet_create_date").show();
				}else{
					$(".leaflet_create_date").hide();
				}
			});
        }
    });
}

/*신규등록하기 버튼 클릭시, 신규전단을 등록한다.*/
$("#jundan_excel_new").on("click",function(){

	if (getCookie("userRoleCd") == "ROLE2")
	{
		var userCompanyNo = getCookie("userCompanyNo");
	}else{
		var userCompanyNo = getCookie("onSelectCompanyNo");
	}
	
	var excel_path = $("#excel_path").val();

	var d = new Date();
	var nowDate = d.getFullYear()+leadingZeros((Number(d.getMonth())+1),2)+d.getDate();

	if ( excel_path == null || chrLen(excel_path) == 0)
	{
		alert("파일을 업로드하시기 바랍니다.");
		return false;
	}

	$.ajax({
        url:'/back/09_shop/leafletConProdInsert.jsp?random=' + (Math.random()*99999),
		data : {userCompanyNo: userCompanyNo, excel_path: excel_path},
        method : 'GET' 
    }).done(function(result){

        console.log("noticeList=========================================");
        if(result == ('NoN') || result == 'exception error' || result == 'empty'){
            console.log(result);
			alert("전단 양식에 맞는 파일로 업로드하시기 바랍니다.");
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
		}else if(result == ('NoNImgNo')){
			alert("엑셀파일에서 입력하신 상품코드와 매핑되는 이미지가 없는 행이 존재합니다.");
		}else{
            console.log("============= notice callback ========================");
            console.log(result);
            alert("등록이 완료되었습니다.");
			location.href="/shop_manage/shop_manage.html?jd_no="+result;
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