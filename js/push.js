
$(function () {

	//  var Result = getParameterByName('Test'); // 결과 : 111

	pageNo = getParameterByName('pageNo');
	if (pageNo == "")
	{
	    pageNo = 1;
	}

	getLeft();
	

	getLeftMenu('push');
	$("#nh_push_push").addClass("active");
	
	getHeader();
	$(".nav_push").addClass("active");

	/* 현재로그인한 유저의 판매장번호 정보를 정보를 담는다. */
	CuserCompanyNo = getCookie("userCompanyNo");

	/* 우상단 선택된 판매장번호 정보를 담는다. */
	onSelectCompanyNo = getCookie("onSelectCompanyNo");

	targetCompanyNo = "";
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
	
	$("#btnSearch").on("click",function(){
		prodList(pageNo, getCookie("onSelectCompanyNo"));
	});

	/*input box 일자 기본값 셋팅*/
	var today = new Date();
	var year = today.getFullYear();
	var month = leadingZeros(today.getMonth()+1,2);
	var sday = leadingZeros(today.getDate()-10,2);
	var eday = leadingZeros(today.getDate(),2);

	// $("#excel_start_date").val(year+'-'+month+'-'+sday);
	// $("#excel_end_date").val(year+'-'+month+'-'+eday);		

	$("#push_start_date").val(year+'-'+month+'-'+sday);
	$("#push_end_date").val(year+'-'+month+'-'+eday);	
	
	prodList(pageNo, targetCompanyNo);
	// prodList_paging(pageNo, targetCompanyNo);

});

function searchEnter(e) {
	if (e.keyCode == 13) {
		prodList(pageNo, getCookie("onSelectCompanyNo"));
	}
}
// 상품리스트를 가져온다
function prodList(rcvPageNo, rcvCompanyNo) {
	const s_date = $("#push_start_date").val();
	const e_date = $("#push_end_date").val();
	const category = $(".search_select").val();
	const keyword = $("#keyword2").val();
	const status = $("#show_flag_status").val();

	$.ajax({
        url:'/back/10_push/postList.jsp?random=' + (Math.random()*99999), 
        data : {pageNo: rcvPageNo ,companyNo: rcvCompanyNo, s_date: s_date, e_date: e_date, category: category, keyword: keyword, status: status},
        method : 'POST' 
    }).done(function(result){
		var resultSplit = result.trim().split(",");
        //console.log("noticeList=========================================");
        if(resultSplit[0] == ('NoN') || resultSplit[0] == 'list error' || resultSplit[0] == 'empty'){
            //console.log(resultSplit);
			$("#pushList").empty();
        }else{
            $("#tab1_table").html("");
            //console.log("============= notice callback ========================");
            //console.log(result);
            var data = JSON.parse(result);
			var text = "";
			var re=/(\n|\r\n)/g
			
            data['CompanyList'].forEach(function(item, index){                        

				text +='<tr>';
				text +='	<td>'+decodeURIComponent(item['pm_no'])+'</td>';
				//text +='    <td>'+item['ms_content'].replace(re,"<br>")+'</td>';
				// text +='    <td><a href="push_send.html?pm_no='+decodeURIComponent(item['pm_no'])+'">'+item['ms_content'].replace(re,"<br>")+'</a></td>';
				// text +='    <td class="might-overflow"><a href="push_send.html?pm_no='+decodeURIComponent(item['pm_no'])+'">'+item['ms_content'].replace(re,"<br>").replace("[광고]","").replace("수신거부 | 메뉴>설정>동의 해제","")+'</a></td>';
				text +='    <td class="might-overflow"><a href="push_send.html?pm_no='+decodeURIComponent(item['pm_no'])+'">'+item['ms_content'].replace("[광고]","").replace("수신거부 | 메뉴>설정>동의 해제","")+'</a></td>';
				text +='    <td>'+decodeURIComponent(item['vm_cp_name'])+'</td>';
                text +='    <td>'+decodeURIComponent(item['pm_type']).replace("reserve","예약").replace("realtime","즉시")+'</td>';																
				text +='    <td>'+decodeURIComponent(item['pm_from_date'])+'~'+decodeURIComponent(item['pm_to_date'])+'<br>'+decodeURIComponent(item['pm_hour'])+'시'+decodeURIComponent(item['pm_min'])+'분</td>';
				text +='    <td>'+decodeURIComponent(item['pm_interval']).replace("월,화,수,목,금,토,일","매일").replace("토,일","주말").replace("월,화,수,목,금","평일")+'</td>';	
				text +='    <td class="might-overflow">'+decodeURIComponent(item['target_cnt'])+'</td>';				
				text +='    <td class="might-overflow">'+decodeURIComponent(item['send_cnt'])+'</td>';
				text +='    <td>'+decodeURIComponent(item['del_fg'])+'</td>';				
				text +='    <td>'+decodeURIComponent(item['pm_status'])+'</td>';								
                text +='</tr>';
			});
			$("#pushList").empty();
			$("#pushList").append(text);
		}
		prodList_paging(rcvPageNo, targetCompanyNo);
    });

}
function changePageing(rcvPageNo) {
	prodList(rcvPageNo, getCookie("onSelectCompanyNo"));
}
// 상품리스트 페이징를 가져온다
function prodList_paging(rcvPageNo, rcvCompanyNo) {
	const s_date = $("#push_start_date").val();
	const e_date = $("#push_end_date").val();
	const category = $(".search_select").val();
	const keyword = $("#keyword2").val();
	const status = $("#show_flag_status").val();

	$.ajax({
        url:'/back/10_push/postList_paging.jsp?random=' + (Math.random()*99999), 
        data : {pageNo: rcvPageNo ,companyNo: rcvCompanyNo, s_date: s_date, e_date: e_date, category: category, keyword: keyword, status: status},
        method : 'GET' 
    }).done(function(result){

        console.log("noticeList=========================================");
        if(result == ('NoN') || result == 'list error' || result == 'empty'){
            console.log(result);
        }else{
            $("#pagination").html("");
            console.log("============= notice callback ========================");
            console.log(result);
            var data = JSON.parse(result);

			var paging_init_num = parseInt(data.CompanyList[0].paging_init_num);
			var paging_end_num = parseInt(data.CompanyList[0].paging_end_num);
			var total_paging_cnt = parseInt(data.CompanyList[0].total_paging_cnt);
			var pre_no = parseInt(rcvPageNo) - 6;
			var next_no = parseInt(rcvPageNo) + 6;

			var text = "";

           if (total_paging_cnt == 0 || total_paging_cnt == 1 || pre_no == -5)
			{
			}else if(total_paging_cnt < 5 || pre_no < 1){
				text += '<li class="page-item"><a class="page-link" href="javascript:void(0);" onclick="javascript:changePageing(1)">«</a></li>';
			}else{
				text += '<li class="page-item"><a class="page-link" href="javascript:void(0);" onclick="javascript:changePageing('+pre_no+')">«</a></li>';
			}

			for( var k = paging_init_num; k <= paging_end_num; k++){
				if (parseInt(rcvPageNo) == k)
				{
					console.log(k + " : " + parseInt(rcvPageNo) + " : this page info");
					text += '<li class="page-item active"><a class="page-link" href="javascript:void(0);" onclick="javascript:changePageing('+k+')">'+k+'</a></li>';
				}else{
					text += '<li class="page-item"><a class="page-link" href="javascript:void(0);" onclick="javascript:changePageing('+k+')">'+k+'</a></li>';
				}
			}
			if (total_paging_cnt == 0 || total_paging_cnt == 1 || parseInt(rcvPageNo) >= total_paging_cnt)
			{
			}else{
				if (next_no > total_paging_cnt) {
					text += '<li class="page-item"><a class="page-link" href="javascript:void(0);" onclick="javascript:changePageing('+total_paging_cnt+')">»</a></li>';
				} else {
					text += '<li class="page-item"><a class="page-link" href="javascript:void(0);" onclick="javascript:changePageing('+next_no+')">»</a></li>';
				}
			}
			$('#pagination').empty();
			$('#pagination').append(text);	
        }
    });
}

// // 게시물 등록
// function createPost() {

// 	var post_title = $("#post_title").val();
// 	var post_content = $("#post_content").val();
// 	var notice_fg = $("#notice_fg").val();

// 	if ( post_title == null || chrLen(post_title) == 0)
// 	{
// 		alert("제목을 입력하시기 바랍니다.");
// 		return false;
// 	}

// 	if ( post_content == null || chrLen(post_content) == 0)
// 	{
// 		alert("내용을 입력하시기 바랍니다.");
// 		return false;
// 	}

// 	$.ajax({
//         url:'/back/10_push/postInsert.jsp?random=' + (Math.random()*99999),
// 		data : {post_title: post_title, post_content: post_content, reg_no: getCookie("userNo"), noticeFg: notice_fg},
//         method : 'GET' 
//     }).done(function(result){

//         console.log("noticeList=========================================");
//         if(result == ('NoN') || result == 'exception error' || result == 'empty'){
//             console.log(result);
//         }else{
//             console.log("============= notice callback ========================");
//             console.log(result);
//             alert("등록이 완료되었습니다.");
// 			home();
//         }
//     });
// }