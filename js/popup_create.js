$(function () {

//  var Result = getParameterByName('Test'); // 결과 : 111
	getHeader();
	$(".nav_home").addClass("active");

	getLeft();
	getLeftMenu('home');
	$("#nh_home_popup").addClass("active");
	getCompanyList();

	$.datepicker.setDefaults({
		dateFormat: 'yy-mm-dd',
		prevText: '이전 달',
		nextText: '다음 달',
		monthNames: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
		monthNamesShort: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
		dayNames: ['일', '월', '화', '수', '목', '금', '토'],
		dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
		dayNamesMin: ['일', '월', '화', '수', '목', '금', '토'],
		showMonthAfterYear: true,
		yearSuffix: '년'
	});
	$(function() {
		$("#popup_from_date").datepicker();
		$("#popup_end_date").datepicker();
	});

	$("#popupDate").ready(function(){
		$('.popup_date input').attr( "disabled", "disabled" ); 
	})
	$('#popupDate').change(function() {
		if( $(this).val() == 1) {
			$('.popup_date input').attr( "disabled", "disabled" ); 
		} else {       
			$('.popup_date input').removeAttr( "disabled");
		}
	});

    //2020.08.11 심규문 외부 내부링크 분기처리 
	$("#popuplink").on("change",function(){
		if ( $('input:checkbox[id="popuplink"]').is(":checked") == true ) {
			$("#btn_layer_popup_link_open").prop('disabled', true);				
		}else{
			$("#btn_layer_popup_link_open").prop('disabled', false);							
		}			
	});		
	

	/*이미지 업로드*/
	$('#inputImgUpload').on('change', function(evt){
		var inputFile = document.getElementById('inputImgUpload');
		new Upload(inputFile, function(result){			
			$("#imgPreview").attr("src", "/upload/"+result.trim());
			//alert("업로드 완료 - 등록하기 버튼을 눌러주세요.");
		});
	});

	// 2020.06.30 / 심규문 / 다중판매장 등록 
		$('#companyAddBtn').on('click', function(){
			var companyNo = $('#company').val();			
			var companyName = $('#company').find('option[value='+companyNo+']').text().trim();
			if($('#cp'+companyNo).length) return;
			$('#companyAddBtn').parent().append('<div data-no="'+companyNo+'" id="cp'+companyNo+'" class="selected_option">'+ companyName +'</div>');
			$('.selected_option').on('click', function(){
				$(this).remove();
			});
		});
		

	$('#btnPopupCreate').on('click', function(){				
		var imgUrl =$('#imgPreview').attr('src');
		var popupTitle = $('#popupTitle').val();
		var popupDateType = $('#popupDate').val();
		var popupDateFrom = $('#popup_from_date').val();
		var popupDateEnd = $('#popup_end_date').val();		
		//var targetCompany = $('#company').val();
		var showFlag = $('#showFlag').val();
		var linkUrl = $('#linkUrl').val();
		var userEmail = $('.user_email').text().trim();

		var popuplink = "";
			
		if ( $('input:checkbox[id="popuplink"]').is(":checked") == true )
		{
			popuplink = "Y";
		}else{
			popuplink = "N";
		}
		
		if(!popupTitle){
			alert('팝업 제목을 넣어주세요.');
			return;
		}

	    if(imgUrl == "../images/image_unknown2.png"){
				alert('팝업이미지 없이 등록할 수 없습니다.');
				return;
			}	

		if(!popupDateFrom) popupDateFrom = '2019-01-01';
		if(!popupDateEnd) popupDateEnd = '2030-01-01';

		//2020.06.30 / 심규문 / 다중판매장 등록 
		var targetCompany = '';
			$('.selected_option').each( function (idx, item) {
				if(idx === 0 ) targetCompany += $(item).data('no');
				else targetCompany += ',' + $(item).data('no');			    
			});

		var formData = {
			imgUrl : imgUrl,
			popupTitle : popupTitle ,
			popupDateType : popupDateType ,
			popupDateFrom : popupDateFrom ,
			popupDateEnd : popupDateEnd ,
			targetCompany : targetCompany,
			showFlag : showFlag,
			linkUrl : linkUrl,
			popuplink : popuplink,
			userEmail : userEmail
		} ;

		console.log(formData);		
	
		$.post( '/back/04_home/popupCreate.jsp',
			formData, 			
			function(result){
				if(result['insert'] > 0){
					alert('등록되었습니다');
					location.href="popup_list.html";
				}
			}
		);	
	
   });

	$('#layer_popup_link_open button').on('click',function(){
		getLinkList();
		$('#layer_popup_link_wrap').show();
	});	

	$('#layer_popup_link_close button').on('click',function(){
		$('#layer_popup_link_wrap').hide();
	});		

	$(document).on('click','.linkClick',function() {
		$('#linkUrl').val( $(this).text() );		
		$('#layer_popup_link_wrap').hide();
    });		
	
});


//판매장 리스트 가져오기
function getCompanyList(){
	$.get("/back/00_include/getCompanyList.jsp",
		function(resultJSON){						
			//console.log(resultJSON);
			companyList = resultJSON['list'];
			if(companyList.lengh) return;
			setCompanyOptions(companyList);		
		}
	);
}

//판매장 리스트 셋업
function setCompanyOptions(companyList){
	var options = '';	
	$(companyList).each( function (idx, company) {		
		if(company.VM_CP_NO == 0 ) return;
		options += '<option value=' + company.VM_CP_NO + '>' +company.VM_CP_NAME + '</option>' ;		
	});
	$('#company').append(options);	
}


function getLinkList(){	
	//var companyNo = $("#company").val();	
	//2020.07.01 심규문 
	var companyNo = $(".selected_option").eq(0).data('no');
	var companycount = $(".selected_option").length;	
	console.log("companyNo  = "+companyNo);
	console.log("companycount = "+companycount);
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
		if (companycount > 1) {}
		else {
		$(Linklist).each( function (idx, linkeach) {
			text +='    <tr>';
			text +='        <td>' + linkeach.select_name  + '</td>' ;
			text +='        <td class="linkClick">' + linkeach.select_value + '</td>' ;
			text +='    </tr>';
		});
	    }
		$("#layer_popup_link_list").empty();					
		$("#layer_popup_link_list").append(text);				
	});
	
}