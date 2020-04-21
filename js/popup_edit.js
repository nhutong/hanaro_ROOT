$(function () {

	//  var Result = getParameterByName('Test'); // 결과 : 111
	
	getHeader();
	$(".nav_home").addClass("active");	

	getLeft();
	getLeftMenu('home');
	$("#nh_home_popup").addClass("active");
	getCompanyList();

	var popupNo = location.search.split('=')[1];
	getPopupInfo(popupNo);

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


	/*이미지 업로드*/
	$('#inputImgUpload').on('change', function(evt){
		var inputFile = document.getElementById('inputImgUpload');
		new Upload(inputFile, function(result){	
			console.log(result);
			$("#imgPreview").attr("src", "/upload/"+result.trim());
			//alert("업로드 완료 - 등록하기 버튼을 눌러주세요.");
		});
	});

	$('#popupEdit').on('click', function(){	
		if(!confirm("수정하시겠습니까??")) return; 
		var imgUrl =$('#imgPreview').attr('src');
		var popupTitle = $('#popupTitle').val();
		var popupDateType = $('#popupDate').val();
		var popupDateFrom = $('#popup_from_date').val();
		var popupDateEnd = $('#popup_end_date').val();		
		var company = $('#company').val();
		var showFlag = $('#showFlag').val();
		var linkUrl = $('#linkUrl').val();
		var userEmail = $('.user_email').text().trim();

		if(!popupDateFrom) popupDateFrom = '2019-01-01';
		if(!popupDateEnd) popupDateEnd = '2030-01-01';

		var formData = {
			popupNo :popupNo,
			imgUrl : imgUrl,
			popupTitle : popupTitle ,
			popupDateType : popupDateType ,
			popupDateFrom : popupDateFrom ,
			popupDateEnd : popupDateEnd ,
			company : company,
			showFlag : showFlag,
			linkUrl : linkUrl,
			userEmail : userEmail
		}
		$.post( '/back/04_home/popupUpdate.jsp',
			formData, 			
			function(result){
				if(result['update'] == 1){
					alert('수정되었습니다');
					location.href = '/home/popup_list.html';
				}
			}
		);
	
	});

	$('#popupDel').on('click', function(){							
		if(!confirm("삭제하시겠습니까?")) return;
		var formData = {
			popupNo :popupNo
		}
		$.post( '/back/04_home/popupDelete.jsp',
			formData, 			
			function(result){
				if(result['delete'] == 1){
					alert('삭제되었습니다');
					location.href = '/home/popup_list.html';
				}
			}
		);
	
	});

	$("#layer_popup_link_open").on("click",function(){
		getLinkList();
		$("#layer_popup_link_wrap").show();
	});	

	$("#layer_popup_link_close").on("click",function(){
		$("#layer_popup_link_wrap").hide();
	});	

});

function getCompanyList(){
	$.get("/back/00_include/getCompanyList.jsp",
		function(resultJSON){						
			console.log(resultJSON);
			companyList = resultJSON['list'];
			if(companyList.lengh) return;
			setCompanyOptions(companyList);	
		}
	);
}

function setCompanyOptions(companyList){
	var options = '';	
	$(companyList).each( function (idx, company) {
		if(company.VM_CP_NO == 0 ) return;
		options += '<option value=' + company.VM_CP_NO + '>' +company.VM_CP_NAME + '</option>' ;
	});
	$('#company').append(options);	
}
	

function getPopupInfo(popupNo){

	$.get('/back/04_home/popup.jsp?popupNo='+popupNo,		
		function(result) {
			console.log(result);
			var info = result.list[0];			
			
			$('#imgPreview').attr('src',info.img_url);
			$('#popupTitle').val(info.popup_title);
			$('#popupDate').val(info.period_type);
			if(info.period_type == 2){
				$('#popup_from_date').removeAttr('disabled');
				$('#popup_end_date').removeAttr('disabled');
				$('#popup_from_date').val(info.start_date);
				$('#popup_end_date').val(info.end_date);
			}			
			$('#company').val(info.company);
			$('#showFlag').val(info.show_flag);			
			$('#linkUrl').val(info.link_url);
			
			

		});
}

function getLinkList(){
	var companyNo = $('#company').val();
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
			text +='        <td>HOME</td>' ;
			text +='        <td>home/main.html</td>' ;
			text +='    </tr>';			
			$(Linklist).each( function (idx, linkeach) {
				text +='    <tr>';
				text +='        <td>' + linkeach.select_name  + '</td>' ;
				text +='        <td>' + linkeach.select_value + '</td>' ;
				text +='    </tr>';
			});
			$('#layer_popup_link_list').empty();					
			$('#layer_popup_link_list').append(text);				
		});
}