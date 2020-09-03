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
	/*input box 일자 기본값 셋팅  2020.09.03 심규문 fromdate 14일 default 셋팅*/	
	var todate = new Date(); 
	var fromdate = new Date();

	//input todate 설정
	var toYear = todate.getFullYear();
	var toMonth = leadingZeros(todate.getMonth() + 1 , 2);
	var toDate = leadingZeros(todate.getDate() , 2);
	//input fromdate 설정
	fromdate.setDate(fromdate.getDate() - 14);
	var fromYear = fromdate.getFullYear();
	var fromMonth = leadingZeros(fromdate.getMonth() + 1 , 2);
	var fromDate = leadingZeros(fromdate.getDate() , 2);

	$("#coupon_start_date").val(fromYear+'-'+fromMonth+'-'+fromDate);
	$("#coupon_end_date").val(toYear+'-'+toMonth+'-'+toDate);		

	$("#sort_select").on("change",function(){
		if ($("#sort_select").val())
		{
			setCookie1("onSelectCompanyNo",$("#sort_select").val());
			localStorage.setItem("vm_cp_no",$("#sort_select").val());
		}
	});

	$("#btnSearch").on("click",function(){
		settingInfo();
	});
	getCouponList();
});

function settingInfo() {
	const s_date = $("#coupon_start_date").val();
	const e_date = $("#coupon_end_date").val();
	const category = $("#searchCategory").val();
	const keyword = $("#keyword").val();
	const flag = $("#show_flag_status").val();
	const params = {
		s_date: s_date,
		e_date: e_date,
		category: category,
		keyword: keyword,
		flag: flag
	}
	localStorage.setItem("couponList", JSON.stringify(params));
	getCouponList(getCookie("onSelectCompanyNo"));
}

function searchEnter(e) {
	if(e.keyCode == 13) {
		settingInfo(getCookie("onSelectCompanyNo"));
	}
}

$(function () {
	getHeader();
	$(".nav_event").addClass("active");

	getLeft();
	getLeftMenu('event');
	$("#nh_event_coupon").addClass("active");

	getCouponList();

});
function getCouponList(compNo){
	if (!compNo) compNo = getCookie("onSelectCompanyNo");
	const s_date = $("#coupon_start_date").val();
	const e_date = $("#coupon_end_date").val();
	const category = $("#searchCategory").val();
	const keyword = $("#keyword").val();
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
		}else if(result == ('company_name_no_exist')){
			alert("엑셀파일에서 지점명이 입력되지 않은 행이 존재합니다.");
		}else if(result == ('company_name_not_correct')){
			alert("엑셀파일에서 지점명이 잘못입력한 행이 존재합니다.");				
		}else if(result == ('pd_code_no_exist')){
			alert("엑셀파일에서 상품코드가 입력되지 않은 행이 존재합니다.");
		}else if(result == ('pd_code_not_number')){
			alert("엑셀파일에서 상품코드가 숫자가 아닌 행이 존재합니다.");	
		}else if(result == ('coupon_code_no_exist')){
			alert("엑셀파일에서 쿠폰코드가 입력되지 않은 행이 존재합니다.");
		}else if(result == ('coupon_code_not_exist')){
			alert("엑셀파일에서 쿠폰코드가 숫자가 아닌 행이 존재합니다.");			
		}else if(result == ('discount_price_no_exist')){
			alert("엑셀파일에서 쿠폰할인가가 입력되지 않은 행이 존재합니다.");
		}else if(result == ('discount_price_not_exist')){
			alert("엑셀파일에서 쿠폰할인가가 숫자가 아닌 행이 존재합니다.");
		}else if(result == ('coupon_start_date_type_error')){
			alert("엑셀파일에서 쿠폰시작일이 날짜형식이 아닌 행이 존재합니다.");		
		}else if(result == ('coupon_end_date_type_error')){
			alert("엑셀파일에서 쿠폰종료일이 날짜형식이 아닌 행이 존재합니다.");		
		}else if(result == ('limit_qty_no_exist')){
			alert("엑셀파일에서 쿠폰수량이 입력되지 않은 행이 존재합니다.");
		}else if(result == ('limit_qty_not_exist')){
			alert("엑셀파일에서 쿠폰수량이 숫자가 아닌 행이 존재합니다.");		
		}else if(result == ('coupon_name_not_exist')){
			alert("엑셀파일에서 쿠폰명이 입력되니 않은 행이 존재합니다.");		
		}else if(result == ('pd_name_no_exist')){
			alert("엑셀파일에서 상품명이 입력되니 않은 행이 존재합니다.");		
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