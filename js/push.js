
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
			prodList(pageNo, getCookie("onSelectCompanyNo"));
			prodList_paging(pageNo, getCookie("onSelectCompanyNo"));
			localStorage.setItem("vm_cp_no",$("#sort_select").val());
		}
	});
	
	prodList(pageNo, targetCompanyNo);
	prodList_paging(pageNo, targetCompanyNo);

	$("#layer_popup_push_wrap").hide();

});

// 상품리스트를 가져온다
function prodList(rcvPageNo, rcvCompanyNo) {

	$.ajax({
        url:'/back/10_push/postList.jsp?random=' + (Math.random()*99999), 
        data : {pageNo: rcvPageNo ,companyNo: rcvCompanyNo},
        method : 'GET' 
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
                text +='    <td>'+item['ms_content'].replace(re,"<br>")+'</td>';
                text +='    <td>'+decodeURIComponent(item['event_title'])+'</td>';
                text +='    <td>'+decodeURIComponent(item['vm_cp_name'])+'</td>';
				text +='    <td>'+decodeURIComponent(item['pm_from_date'])+'<br> ~ '+decodeURIComponent(item['pm_to_date'])+'<br>'+decodeURIComponent(item['pm_hour'])+'시'+decodeURIComponent(item['pm_min'])+'분</td>';
				text +='    <td>'+decodeURIComponent(item['pm_interval'])+'</td>';
                text +='    <td>'+decodeURIComponent(item['pm_target'])+'</td>';								
				text +='    <td>'+decodeURIComponent(item['target_cnt'])+'</td>';				
				if(decodeURIComponent(item['pm_target']) === "대상등록"){
					text +='    <td><button onclick="push_target_import('+decodeURIComponent(item['pm_no'])+')">등록</button></td>';
				}else{
					text +='    <td></td>';
				}
				text +='    <td>'+decodeURIComponent(item['send_cnt'])+'</td>';
                text +='</tr>';

				//pm_from_date, pm_to_date, pm_interval, pm_target


			});
			$("#pushList").empty();
			$("#pushList").append(text);
        }
    });

}

function push_target_import(rcvPmNo){

	$("#layer_popup_push_wrap").show();
	$("#push_message_no").val("  "+rcvPmNo);
	$("#uploadFile").val("");

	// window.parent.document.getElementById("date_jd_no").value = jdNo;
	// window.parent.document.getElementById("from_date_origin").value = startDate;
	// window.parent.document.getElementById("to_date_origin").value = endDate;		
	
	// $(parent.document).find(".leaflet_del").show();

	// //setCookie1("jd_prod_con_no",rcvJdProdConNo, 1);
	// $(parent.document).find("#modify_jd_prod_con_no").text(rcvJdProdConNo);

	// $("#nh_leaflet").contents().find(".thumb_info, .thumb_wrap>a").click(function(){
	//    $(".new_item_wrap").hide();
	//    $(parent.document).find(".leaflet_edit_wrap>div").removeClass("active");
	//    $(parent.document).find(".leaflet_image").toggleClass("active");	

}

function push_target_import_close(){
	$("#layer_popup_push_wrap").hide();
	$("#uploadFile").val("");
}

/*엑셀파일 업로더*/
var enterUpload = document.getElementById('push_excel_btn');
enterUpload.addEventListener('click', function(evt){
	var inputFile = document.getElementById('uploadFile');
	new Upload(inputFile, function(result){
		$("#excel_path").val(result);
		alert("업로드 완료 - 등록하기 버튼을 눌러주세요.");
	});
});

/*신규등록하기 버튼 클릭시, 신규전단을 등록한다.*/
$("#push_excel_new").on("click",function(){

	var excel_path = $("#excel_path").val();
	var pm_no = $("#push_message_no").val();

	if ( excel_path == null || chrLen(excel_path) == 0)
	{
		alert("파일을 업로드하시기 바랍니다.");
		return false;
	}

	if ( pm_no == null || chrLen(pm_no) == 0)
	{
		alert("푸시번호를 알 수 없습니다.");
		return false;
	}	

	$.ajax({
        url:'/back/10_push/pushTargetExcelImport.jsp?random=' + (Math.random()*99999),
		data : {excel_path: excel_path, pm_no: pm_no, overwrite: "N"},
        method : 'GET' 
    }).done(function(result){
		var resultSplit = result.trim().split(",");
		//console.log("leafletConProdInsert=========================================");
		console.log(resultSplit);
		if(resultSplit[0] == 'NoN' || resultSplit[0] == 'exception error' || resultSplit[0] == 'empty'){
			alert("양식 파일이 올바르지 않거나 공백이 존재합니다. 양식의 하단 빈 공간을 모두 선택한 뒤 삭제하고 업로드해주세요!"+resultSplit[1]);
        }else if(resultSplit[0] == 'no_pm'){
			alert(pm_no+"번 푸시메시지는 등록되어 있지 않습니다.");			
        }else if(resultSplit[0] == 'pmt_no_dup'){
			if(confirm('푸시대상이 이미 등록되어 있습니다. 삭제 및 대체하시겠습니까?')) {
				$.ajax({
					url:'/back/10_push/pushTargetExcelImport.jsp?random=' + (Math.random()*99999),
					data : {excel_path: excel_path, pm_no: pm_no, overwrite: "Y"},
					method : 'GET' 
				}).done(function(result){
					var resultSplit = result.trim().split(",");
					if(resultSplit[0] == 'NoN' || resultSplit[0] == 'exception error' || resultSplit[0] == 'empty'){
						alert("양식 파일이 올바르지 않거나 공백이 존재합니다. 양식의 하단 빈 공간을 모두 선택한 뒤 삭제하고 업로드해주세요!"+resultSplit[1]);
					}else if(resultSplit[0] == 'no_pm'){
						alert(pm_no+"번 푸시메시지는 등록되어 있지 않습니다.");			
					}else if(resultSplit[0] == 'pmt_no_dup'){
						alert("푸시대상이 이미 등록되어 있습니다.");
					}else if(resultSplit[0] == 'no_no_exist'){
						alert("회원번호가 없는 행("+resultSplit[1]+")이 존재합니다");
					}else if(resultSplit[0] == 'no_not_number'){
						alert("회원번호가 숫자가 아닌 행("+resultSplit[1]+")이 존재합니다.");			
					}else{
						push_target_import_close();
						alert("삭제 및 등록이 완료되었습니다. 영향 받은 행:"+resultSplit[1]);
						prodList(1, targetCompanyNo);
						prodList_paging(1, targetCompanyNo);
					}
				});
			}else{
			}
		}else if(resultSplit[0] == 'no_no_exist'){
			alert("회원번호가 없는 행("+resultSplit[1]+")이 존재합니다");
		}else if(resultSplit[0] == 'no_not_number'){
			alert("회원번호가 숫자가 아닌 행("+resultSplit[1]+")이 존재합니다.");			
		}else{
            //console.log("============= notice callback ========================");
			//console.log(result);
			push_target_import_close();
            alert("등록이 완료되었습니다. 영향 받은 행:"+resultSplit[1]);
			prodList(1, targetCompanyNo);
			prodList_paging(1, targetCompanyNo);
        }
    });
});

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