// 쿠폰리스트 템플릿
var tpl_tr_tab1_table = _.template('<tr id="coupon<%- coupon_no %>" data-no="<%- coupon_no %>">'+
	'<td><%- coupon_no %></td>' +
	'<td><%- coupon_type_name %></td>' +
	'<td><a href="coupon_edit.html?coupon_no=<%- coupon_no %>" ><%- coupon_name %></a></td>' +
	'<td><%- product_code %></td>' +	
	'<td><%- company_name %></td>' +	
	'<td><%- status_name %></td>' +	
	'<td><%- start_date %> ~ <%- end_date %></td>' +
	'<td><%- reg_name %> </td>' +
	'<td><%- reg_date %> </td>' +
	'<td><button id="cp_<%- coupon_no %>" class="coupon_pop_btn" onclick="coupon_popup(<%- coupon_no %>);">출력</button></td>'
	);

$(function () {
	getHeader();
	$(".nav_event").addClass("active");

	getLeft();
	getLeftMenu('event');
	$("#nh_event_coupon").addClass("active");

	// 권한코드 가져오기
	var userRoleCd = getCookie('userRoleCd');
	
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
	/*input box 일자 기본값 셋팅*/
	var today = new Date();
	var year = today.getFullYear();
	var month = leadingZeros(today.getMonth()+1,2);
	var sday = leadingZeros(today.getDate()-2,2);
	var eday = leadingZeros(today.getDate(),2);

	// $("#excel_start_date").val(year+'-'+month+'-'+sday);
	// $("#excel_end_date").val(year+'-'+month+'-'+eday);		

	$("#coupon_start_date").val(year+'-'+month+'-'+sday);
	$("#coupon_end_date").val(year+'-'+month+'-'+eday);	

	$("#sort_select").on("change",function(){
		if ($("#sort_select").val())
		{
			setCookie1("onSelectCompanyNo",$("#sort_select").val());
			//noticeCont(getCookie("onSelectCompanyNo"));
			getCouponList(getCookie("onSelectCompanyNo"));
			localStorage.setItem("vm_cp_no",$("#sort_select").val());
		}
	});

	$("#btnSearch").on("click",function(){
		getCouponList(getCookie("onSelectCompanyNo"));
	});
	$("#show_flag_status").on("change", function() {
		getCouponList(getCookie("onSelectCompanyNo"));
	});
	getCouponList();
});

function searchEnter(e) {
	getCouponList(getCookie("onSelectCompanyNo"));
}

function getCouponList(compNo){
	if (!compNo) compNo = getCookie("onSelectCompanyNo");
	const s_date = $("#coupon_start_date").val();
	const e_date = $("#coupon_end_date").val();
	const category = $(".search_select").val();
	const keyword = $("#keyword2").val();
	const flag = $("#show_flag_status").val();
	let dataSourceUrl = '/back/05_event/coupon.jsp?company='+compNo+'&s_date='+s_date+'&e_date='+e_date+'&category='+category+'&keyword='+keyword;
	dataSourceUrl += "&status="+flag;
	console.log(dataSourceUrl);
	$('#pagination').pagination({
		dataSource: dataSourceUrl,
		locator: 'list',
		totalNumberLocator: function(data) {
			return data.total;
		},
		pageSize: 8,
		className: 'paginationjs-theme-green paginationjs-big',
		callback: function(list, pagination) {
			console.log(list);
			var $tbody = $('#couponList').empty();
			_.forEach(list,
				function(item) {
					$tbody.append(tpl_tr_tab1_table(item));
					console.log(item.coupon_type);
					if (item.coupon_type == 'BILLING')
					{
						$("#cp_"+item.coupon_no).hide();
					}
				}
			);
		},
		formatAjaxError: function(jqXHR) {
			alert(jqXHR.responseJSON.error);
//			window.history.back();

			deleteAllCookies();
			login();
		}
	});
}


/*엑셀파일 업로더*/
function coupon_file_upload(){
	var inputFile = document.getElementById('uploadFile');
	new Upload(inputFile, function(result){
		$("#excel_path").val(result);
		alert("업로드 완료 - 등록하기 버튼을 눌러주세요.");
	});
}


/*신규등록하기 버튼 클릭시, 신규전단을 등록한다.*/
function coupon_upload_create(){

	var menu_no = getCookie("menu_no");
	var userCompanyNo = getCookie("userCompanyNo");	
	var excel_path = $("#excel_path").val().trim();

	if ( excel_path == null || chrLen(excel_path) == 0)	{
		alert("파일을 업로드하시기 바랍니다.");
		return ;
	}
	const extension = excel_path.split(".")[1];
	const baseUrl = (extension == "xls") ? "couponXlsUploadCreate.jsp" : (extension == "xlsx") ? "couponXlsxUploadCreate.jsp" : "null";

	$.ajax({
        url:'/back/05_event/'+baseUrl+'?random=' + (Math.random()*99999),
		data : { excel_path: excel_path},
        method : 'GET' 
    }).done(function(result){

		console.log(result);
//		alert(result);
        console.log("noticeList=========================================");
        if(result == ('NoN') || result == 'exception error' || result == 'empty'){
            console.log(result);
			alert("양식 파일이 올바르지 않거나 공백이 존재합니다. 양식의 하단 빈 공간을 모두 선택한 뒤 삭제하고 업로드해주세요!");
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
		}else if(result == ('company_name_not_correct')){
			alert("엑셀파일에서 존재하지 않는 판매장명이 존재합니다.");
		}else if(result == ('NoNImgNo')){
			alert("엑셀파일에서 입력하신 상품코드와 매핑되는 이미지가 없는 행이 존재합니다.");
		}else{
            console.log("============= notice callback ========================");
            console.log(result);
            alert("등록이 완료되었습니다.");
			location.href="/event/coupon.html";
        }
    });
}

function coupon_popup(rcvCouponNum){
	location.href="/event/coupon_print.html?coupon_no="+rcvCouponNum;
	//window.open('coupon_print.html?coupon_no='+rcvCouponNum+'',"pop출력창",'location=no,status=no,scrollbars=yes,left=300,top=300, width = 1350, height = 800')  
}