$(function () {

	pm_no = getParameterByName('pm_no');   // 푸시번호

	if (pm_no == ""){
        $("#pushNo").val('신규등록');
	}else{
        $("#pushNo").val(pm_no);        
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
    //getEventList(CuserCompanyNo, targetCompanyNo);
    
    getPushInfo(pm_no);

	// var today = new Date();
	// var year = today.getFullYear();
	// var month = leadingZeros(today.getMonth()+1,2);
	// var day = leadingZeros(today.getDate(),2);

	// $("#pushSendFromDate").val(year+'-'+month+'-'+day);
	// $("#pushSendToDate").val(year+'-'+month+'-'+day);

	$('#layer_popup_link_open button').on('click',function(){
		getLinkList();
		$('#layer_popup_link_wrap').show();
	});	

	$('#layer_popup_link_close button').on('click',function(){
		$('#layer_popup_link_wrap').hide();
	});	

	$(document).on('click','.linkClick',function() {
		$('#event_no').val( $(this).text() );		
		$('#layer_popup_link_wrap').hide();
	});	
	
	$("#pushType").on("change",function(){
		if ($("#pushType").val() == "realtime" ){
			$("#pushSendFromDate").prop('disabled', true);
			$("#pushSendToDate").prop('disabled', true);

			$("#pushSendHr").prop('disabled', true);
			$("#pushSendMin").prop('disabled', true);
			$("#pushInterval").prop('disabled', true);
		}else{
			$("#pushSendFromDate").prop('disabled', false);
			$("#pushSendToDate").prop('disabled', false);

			$("#pushSendHr").prop('disabled', false);
			$("#pushSendMin").prop('disabled', false);
			$("#pushInterval").prop('disabled', false);	
		}
	});

	$("#pushTarget").on("change",function(){
		if ($("#pushTarget").val() == "대상등록" ){		
			$(".push_target_import_cont").show();
		}else{
			$(".push_target_import_cont").hide();			
		}			
	});		
	

});

function getPushInfo(rcv_pm_no){

    $.get('/back/10_push/getPushInfo.jsp?pm_no='+rcv_pm_no,	
    function(result) {
        console.log(result);
        var info = result.list[0];
        $("#pushTopTxt").val(info.ms_content);
        $("#sort_select").val(info.vm_cp_no);
        $("#event_no").val(info.event_no);
        $("#pushSendHr").val(info.pm_hour);
        $("#pushSendMin").val(info.pm_min);
        $("#push_img_path").attr("src",info.pm_img_path);
        $("#pushSendFromDate").val(info.pm_from_date);
        $("#pushSendToDate").val(info.pm_to_date);
        $("#pushInterval").val(info.pm_interval);
        $("#pushTarget").val(info.pm_target);
        $("#pushType").val(info.pm_type);	
        $("#pushDel").val(info.del_fg);
        $("#excel_path").val(info.excel_path);	

		if ($("#pushType").val() == "realtime" ){
			$("#pushSendFromDate").prop('disabled', true);
			$("#pushSendToDate").prop('disabled', true);

			$("#pushSendHr").prop('disabled', true);
			$("#pushSendMin").prop('disabled', true);
			$("#pushInterval").prop('disabled', true);
		}else{
			$("#pushSendFromDate").prop('disabled', false);
			$("#pushSendToDate").prop('disabled', false);

			$("#pushSendHr").prop('disabled', false);
			$("#pushSendMin").prop('disabled', false);
			$("#pushInterval").prop('disabled', false);	
		}
	
		if ($("#pushTarget").val() == "대상등록" ){		
			$(".push_target_import_cont").show();
		}else{
			$(".push_target_import_cont").hide();			
        }	

        var total = result.total;
        $("#pmt_no_cnt").val(total);	
        $("#pmt_no_cnt_title").text("* 현재 등록된 푸시 대상자 : "+total+"건");	        
                
    });
}

/*파일 업로더*/
var enterUpload = document.getElementById('uploadFile');
enterUpload.addEventListener('change', function(evt){
	var inputFile = document.getElementById('uploadFile');
	new Upload(inputFile, function(result){
//		$("#excel_path").val(result);
		$("#push_img_path").attr("src", "/upload/"+result.trim());
		alert("업로드 완료");
	});
});

// 푸쉬입력
$("#pushSendBtn").on("click",function(e){
    e.preventDefault();

    var pm_no = $("#pushNo").val();

    var formData = {
        pm_no : $("#pushNo").val(),
        ms_content : $("#pushTopTxt").val(),
        vm_cp_no : $('#sort_select').val(),
        event_no : $('#event_no').val(),
        reg_no : getCookie("userNo"),
        pushSendHr : $('#pushSendHr').val(),
        pushSendMin : $('#pushSendMin').val(),
        pm_img_path : $("#push_img_path").attr("src"),
        pushSendFromDate : $('#pushSendFromDate').val(),
        pushSendToDate : $('#pushSendToDate').val(),
        pushInterval : $('#pushInterval').val(),
        pushTarget : $('#pushTarget').val(),
        pushType : $('#pushType').val(),
        pushDel : $('#pushDel').val()
    } ;

    var pmt_no_cnt = $("#pmt_no_cnt").val();
    var excel_path = $("#excel_path").val();

	if ( pushTopTxt == null || chrLen(pushTopTxt) == 0)
	{
		alert("PUSH 내용을 입력하시기 바랍니다.");
		return false;
	}

	if ( pushType == "realtime" ){
	}else{		
		if ( pushType == 'reserve' && ( pushSendFromDate == null || chrLen(pushSendFromDate) == 0 ) ){
			alert("전송시작일자를 입력하시기 바랍니다.");
			return false;
		}	
	
		if ( pushType == 'reserve' && ( pushSendToDate == null || chrLen(pushSendToDate) == 0 ) ){
			alert("전송종료일자를 입력하시기 바랍니다.");
			return false;
		}			
    }
    
    $.post( '/back/10_push/pushUpdate.jsp',
    formData, 			
    function(resultJSON){
        if(resultJSON['update'] > 0){
            alert('변경사항이 수정되었습니다');
            //push();
            getPushInfo(pm_no);
        }else {
            console.log(resultJSON['error']);
            alert("에러가 발생하였습니다.");
        }
    });

    if( excel_path == "" ){
    }else{
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
                            alert("삭제 및 등록이 완료되었습니다. 영향 받은 행:"+resultSplit[1]);
                            getPushInfo(pm_no);
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
                //alert("등록이 완료되었습니다.");
                alert("푸시 대상자 등록이 완료되었습니다(푸시대상 엑셀파일 영향 받은 행:"+resultSplit[1]+")");
                getPushInfo(pm_no);
            }
        });	        
    }
});

/*엑셀파일 업로더*/
//var enterUpload = document.getElementById('push_excel_btn');
//enterUpload.addEventListener('click', function(evt){
var enterUpload = document.getElementById('excelUploadFile');
enterUpload.addEventListener('change', function(evt){	
	var inputFile = document.getElementById('excelUploadFile');
	new Upload(inputFile, function(result){
		$("#excel_path").val(result);
		//alert("업로드 완료 - 등록하기 버튼을 눌러주세요.");
		alert("업로드 완료");
	});
});

function getLinkList(){
	var companyNo = $("#sort_select").val();
	var formData = {
		companyNo: companyNo
	};
	//console.log(companyNo);
	$.get('/back/00_include/getLinkList.jsp',
		formData,
		function(result) {
			//console.log(result);
			var Linklist = result['list'];
			var text = '';	
			text +='    <tr>';
			text +='        <td>홈화면</td>' ;
			text +='        <td class="linkClick">home/main.html</td>' ;
			text +='    </tr>';			
			text +='    <tr>';
			text +='        <td>쿠폰</td>' ;
			text +='        <td class="linkClick">home/coupon.html</td>' ;
			text +='    </tr>';	
			text +='    <tr>';				
			text +='        <td>이벤트</td>' ;
			text +='        <td class="linkClick">home/event.html</td>' ;
			text +='    </tr>';
			text +='    <tr>';
			text +='        <td>공지사항</td>' ;
			text +='        <td class="linkClick">home/notice.html</td>' ;
			text +='    </tr>';								
			$(Linklist).each( function (idx, linkeach) {
				text +='    <tr>';
				text +='        <td>' + linkeach.select_name  + '</td>' ;
				text +='        <td class="linkClick">' + linkeach.select_value + '</td>' ;
				text +='    </tr>';
			});
			$("#layer_popup_link_list").empty();					
			$("#layer_popup_link_list").append(text);				
		});
}