$(function () {

	var pageNo = getParameterByName('pageNo');
	if (pageNo == "")
	{
	    pageNo = 1;
	}
	
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
			//noticeCont(getCookie("onSelectCompanyNo"));
			noticeCont(getCookie("onSelectCompanyNo"), pageNo);
			noticeCont_paging(getCookie("onSelectCompanyNo"), pageNo);
			localStorage.setItem("vm_cp_no",$("#sort_select").val());
		}
	});
	/* 공통부분 종료======================================================================== */

	/*판매장 변경시, */
	$("#btnUserSearch").on("click",function(){
		noticeCont(getCookie("onSelectCompanyNo"), pageNo);
		noticeCont_paging(getCookie("onSelectCompanyNo"), pageNo);
	});

	$('#excel_down_stat').on('click', function(){ 
		getCouponHistoryForExcel(getCookie("onSelectCompanyNo"));
	});	

	/*input box 일자 기본값 셋팅  2020.09.03 심규문 fromdate 14일 default 셋팅*/	
	var todate = new Date();
	var fromdate = new Date();

	//input todate 설정
	var toYear = todate.getFullYear();
	var toMonth = leadingZeros(todate.getMonth() +1 , 2);
	var toDate = leadingZeros(todate.getDate() , 2);
	//input fromdate 설정
	fromdate.setDate(fromdate.getDate() - 14);
	var fromYear = fromdate.getFullYear();
	var fromMonth = leadingZeros(fromdate.getMonth() + 1 , 2);
	var fromDate = leadingZeros(fromdate.getDate(), 2);

	$("#coupon_start_date").val(fromYear+'-'+fromMonth+'-'+fromDate);
	$("#coupon_end_date").val(toYear+'-'+toMonth+'-'+toDate);	

	// noticeCont(targetCompanyNo, pageNo);
	// noticeCont_paging(targetCompanyNo, pageNo);
	noticeCont(getCookie("onSelectCompanyNo"), pageNo);
	noticeCont_paging(getCookie("onSelectCompanyNo"), pageNo);
});

function getCouponHistoryForExcel(rcvonSelectCompanyNo){
	var keyword1 = rcvonSelectCompanyNo;
	// var keyword2 = $('#excel_start_date').val();	
	// var keyword3 = $('#excel_end_date').val();
	var keyword2 = $('#coupon_start_date').val();	
	var keyword3 = $('#coupon_end_date').val();
	var keyword4 = $("#keyword1").val();
	var keyword5 = $("#keyword2").val();

	//데이터 조회 후 엑셀 함수 호출
	$.get('/back/05_event/couponHistoryExcelExport.jsp?keyword1='+keyword1+'&keyword2='+keyword2+'&keyword3='+keyword3+'&keyword4='+keyword4+'&keyword5='+keyword5+'&pageNumber=1&pageSize=99999999',
	function(result){
		if (result == "exception error"){
			alert("exception error"+result);
		}else if ( result.list.length > 0 ){
			//console.log("result: ", result.list);
			var headList = ['쿠폰기간', '받은(사용)일자', '매장명', '전화번호',	'앱회원번호', '쿠폰코드', '사용여부'];
			ExcelExportStart("엑셀다운로드_쿠폰히스토리", headList, result.list);
		}else{
			console.log("result: ", result);
			alert("조회된 내역이 없어 엑셀Exort를 취소합니다.");
		}
	});
}


// 공지사항 리스트를 불러온다.
function noticeCont(rcvonSelectCompanyNo, rcvPageNo) {
		var keyword1 = encodeURIComponent($("#keyword1").val());
		var keyword2 = encodeURIComponent($("#keyword2").val());		
		var cp_start_date = $("#coupon_start_date").val();
		var cp_end_date = $("#coupon_end_date").val();
		var text = '';

		$.ajax({
			url:'/back/05_event/coupon_history.jsp?random=' + (Math.random()*99999),
			data : {vm_cp_no: rcvonSelectCompanyNo, pageNo: rcvPageNo, rcvKeyword1: keyword1, rcvKeyword2: keyword2, cp_start_date: cp_start_date, cp_end_date: cp_end_date},
			method : 'GET' 
		}).done(function(result){
			
			if(result == "NoN"){
					text +='      <tr>';
					text +='			 <td colspan="7">등록된 사항이 없습니다.</td>';
					text +='       </tr>';
			}else{
				$("#tab1_table").html("");
				console.log("============= postlist callback ========================");
				console.log(result);
				var jsonResult = JSON.parse(result);
				var jsonResult_notice = jsonResult.CompanyList;
				for(var i in jsonResult_notice){
					
					text +='      <tr>';
					text +='			 <td>'+jsonResult_notice[i].cp_date+'</td>';
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


// 상품리스트 페이징를 가져온다
function noticeCont_paging(rcvonSelectCompanyNo, rcvPageNo) {
	var keyword1 = encodeURIComponent($("#keyword1").val());
	var keyword2 = encodeURIComponent($("#keyword2").val());		
	var cp_start_date = $("#coupon_start_date").val();
	var cp_end_date = $("#coupon_end_date").val();

	$.ajax({
        url:'/back/05_event/coupon_history_paging.jsp?random=' + (Math.random()*99999), 
        data : {vm_cp_no: rcvonSelectCompanyNo, pageNo: rcvPageNo, rcvKeyword1: keyword1, rcvKeyword2: keyword2, cp_start_date: cp_start_date, cp_end_date: cp_end_date},
        method : 'GET' 
    }).done(function(result){

        console.log("coupon_history_paging=========================================");
        if(result == ('NoN') || result == 'list error' || result == 'empty'){
            console.log(result);
        }else{
            $("#pagination").html("");
            console.log("============= coupon_history_paging callback ========================");
            console.log(result);
			var data = JSON.parse(result);
			//var data = '';
                                                                                                                                                                                                                                                                                                                                                                                    
			var paging_init_num = parseInt(data.CompanyList[0].paging_init_num);
			var paging_end_num = parseInt(data.CompanyList[0].paging_end_num);
			var total_paging_cnt = parseInt(data.CompanyList[0].total_paging_cnt);
			var pre_no = parseInt(rcvPageNo) - 10;
			var next_no = parseInt(rcvPageNo) + 10;

			var text = "";

			if (total_paging_cnt == 0 || total_paging_cnt == 1 || pre_no == -9)
			{
			}else if(total_paging_cnt < 9 || pre_no < 1){
				text += '<li class="page-item"><a class="page-link" onclick="noticeCont('+rcvonSelectCompanyNo+',1), noticeCont_paging('+rcvonSelectCompanyNo+',1);">«</a></li>';
			}else{
				text += '<li class="page-item"><a class="page-link" onclick="noticeCont('+rcvonSelectCompanyNo+', '+pre_no+'), noticeCont_paging('+rcvonSelectCompanyNo+', '+pre_no+');">«</a></li>';  
			}

			for( var k = paging_init_num; k <= paging_end_num; k++){
				if (parseInt(rcvPageNo) == k)
				{
					text += '<li class="page-item active"><a class="page-link" onclick="noticeCont('+rcvonSelectCompanyNo+', '+k+'), noticeCont_paging('+rcvonSelectCompanyNo+', '+k+');">'+k+'</a></li>';
				}else{
					text += '<li class="page-item"><a class="page-link" onclick="noticeCont('+rcvonSelectCompanyNo+', '+k+'), noticeCont_paging('+rcvonSelectCompanyNo+', '+k+');">'+k+'</a></li>';
				}
			}

			if (total_paging_cnt == 0 || total_paging_cnt == 1 || next_no > total_paging_cnt)
			{
			}else{
				console.log(next_no);
				text += '<li class="page-item"><a class="page-link" onclick="noticeCont('+rcvonSelectCompanyNo+', '+next_no+'), noticeCont_paging('+rcvonSelectCompanyNo+', '+next_no+');">»</a></li>';  		
				//text += '<li class="page-item"><a class="page-link" href="coupon_history.html?vm_cp_no='+rcvonSelectCompanyNo+"&pageNo="+next_no+"&rcvKeyword1="+keyword1+"&rcvKeyword2="+keyword2+"&cp_start_date="+cp_start_date+"&cp_end_date="+cp_end_date+'">»</a></li>';		
			}
			$('#pagination').empty();
			$('#pagination').append(text);	
        }
    });
}
