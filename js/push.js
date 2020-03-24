
$(function () {

	//  var Result = getParameterByName('Test'); // 결과 : 111

	var pageNo = getParameterByName('pageNo');
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
			prodList(pageNo, getCookie("onSelectCompanyNo"));
			prodList_paging(pageNo, getCookie("onSelectCompanyNo"));
			localStorage.setItem("vm_cp_no",$("#sort_select").val());
		}
	});
	
	prodList(pageNo, targetCompanyNo);
	prodList_paging(pageNo, targetCompanyNo);

});

// 상품리스트를 가져온다
function prodList(rcvPageNo, rcvCompanyNo) {

	$.ajax({
        url:'/back/10_push/postList.jsp?random=' + (Math.random()*99999), 
        data : {pageNo: rcvPageNo ,companyNo: rcvCompanyNo},
        method : 'GET' 
    }).done(function(result){

        console.log("noticeList=========================================");
        if(result == ('NoN') || result == 'list error' || result == 'empty'){
            console.log(result);
			$("#pushList").empty();
        }else{
            $("#tab1_table").html("");
            console.log("============= notice callback ========================");
            console.log(result);
            var data = JSON.parse(result);
			var text = "";
			var re=/(\n|\r\n)/g
			
            data['CompanyList'].forEach(function(item, index){                        

				text +='<tr>';
				text +='	<td>'+decodeURIComponent(item['pm_no'])+'</td>';
                text +='    <td>'+item['ms_content'].replace(re,"<br>")+'</td>';
                text +='    <td>'+decodeURIComponent(item['event_title'])+'</td>';
                text +='    <td>'+decodeURIComponent(item['vm_cp_name'])+'</td>';
                text +='    <td>'+decodeURIComponent(item['reg_date'])+'<br>'+decodeURIComponent(item['pm_hour'])+'시'+decodeURIComponent(item['pm_min'])+'분</td>';
                text +='    <td>'+decodeURIComponent(item['send_cnt'])+'</td>';
                text +='</tr>';

			});
			$("#pushList").empty();
			$("#pushList").append(text);
        }
    });

}

// 상품리스트 페이징를 가져온다
function prodList_paging(rcvPageNo, rcvCompanyNo) {

	$.ajax({
        url:'/back/10_push/postList_paging.jsp?random=' + (Math.random()*99999), 
        data : {pageNo: rcvPageNo ,companyNo: rcvCompanyNo},
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
				text += '<li class="page-item"><a class="page-link" href="push.html?pageNo=1&searchText=">«</a></li>';
			}else{
				text += '<li class="page-item"><a class="page-link" href="push.html?pageNo='+pre_no+'&searchText='+encodeURIComponent($("#searchTextbox").val())+'">«</a></li>';
			}

			for( var k = paging_init_num; k <= paging_end_num; k++){
				if (parseInt(rcvPageNo) == k)
				{
					text += '<li class="page-item active"><a class="page-link" href="push.html?pageNo='+k+'&searchText='+encodeURIComponent($("#searchTextbox").val())+'">'+k+'</a></li>';
				}else{
					text += '<li class="page-item"><a class="page-link" href="push.html?pageNo='+k+'&searchText='+encodeURIComponent($("#searchTextbox").val())+'">'+k+'</a></li>';
				}
			}

			if (total_paging_cnt == 0 || total_paging_cnt == 1 || next_no > total_paging_cnt)
			{
			}else{
				text += '<li class="page-item"><a class="page-link" href="push.html?pageNo='+next_no+'&searchText='+encodeURIComponent($("#searchTextbox").val())+'">»</a></li>';
			}
			$('#pagination').empty();
			$('#pagination').append(text);	
        }
    });
}

// 게시물 등록
function createPost() {

	var post_title = $("#post_title").val();
	var post_content = $("#post_content").val();
	var notice_fg = $("#notice_fg").val();

	if ( post_title == null || chrLen(post_title) == 0)
	{
		alert("제목을 입력하시기 바랍니다.");
		return false;
	}

	if ( post_content == null || chrLen(post_content) == 0)
	{
		alert("내용을 입력하시기 바랍니다.");
		return false;
	}

	$.ajax({
        url:'/back/10_push/postInsert.jsp?random=' + (Math.random()*99999),
		data : {post_title: post_title, post_content: post_content, reg_no: getCookie("userNo"), noticeFg: notice_fg},
        method : 'GET' 
    }).done(function(result){

        console.log("noticeList=========================================");
        if(result == ('NoN') || result == 'exception error' || result == 'empty'){
            console.log(result);
        }else{
            console.log("============= notice callback ========================");
            console.log(result);
            alert("등록이 완료되었습니다.");
			home();
        }
    });
}