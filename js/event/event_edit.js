$(function () {

	//  var Result = getParameterByName('Test'); // 결과 : 111
		getHeader();
		$(".nav_event").addClass("active");


		getLeft();
		getLeftMenu('event');
		$("#nh_event_list").addClass("active");
		//getCompanyList();

		var eventNo = location.search.split('=')[1];
		getEventInfo(eventNo);
	
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
			$("#event_start_date").datepicker();
			$("#event_end_date").datepicker();
		});	

    	//2020.08.127 심규문 외부 내부링크 분기처리 
		$("#eventLink").on("change",function(){
			if ( $('input:checkbox[id="eventLink"]').is(":checked") == true ) {
				$("#btn_layer_popup_link_open").prop('disabled', true);
				$("#linkUrl").prop('disabled', false);												
			}else{
				$("#btn_layer_popup_link_open").prop('disabled', false);
				$("#linkUrl").prop('disabled', true);															
			}			
		});	
	
		// 배너 이미지 업로드
		$('#inputImgUpload').on('change', function(evt){
			var inputFile = document.getElementById('inputImgUpload');
			new Upload(inputFile, function(result){			
				$("#imgPreview").attr("src", "/upload/"+result.trim());
				//alert("업로드 완료 - 등록하기 버튼을 눌러주세요.");
			});
		});

		// 상세 이미지 업로드
		$('#inputDetailImgUpload').on('change', function(evt){
			var inputFile = document.getElementById('inputDetailImgUpload');
			new Upload(inputFile, function(result){			
				$("#detailImgPreview").attr("src", "/upload/"+result.trim());				
				//alert("업로드 완료 - 등록하기 버튼을 눌러주세요.");
			});
		});
	
		$('#btnEventUpdate').on('click', function(){			

			var imgUrl =$('#imgPreview').attr("src");	
			var detailImgUrl =$('#detailImgPreview').attr("src");
			var eventTitle = $('#eventTitle').val();			
			var eventStartDate = $('#event_start_date').val();
			var eventEndDate = $('#event_end_date').val();			
			var activated = $('#activated').val();
			var company = $('#company').val();
			var linkUrl = $('#linkUrl').val();			
			var eventLink = "";			
			if ( $('input:checkbox[id="eventLink"]').is(":checked") == true )
			{
				eventLink = "Y";
			}else{
				eventLink = "N";
			}
			
			if(!eventTitle) {
				alert('이벤트명을 넣어주세요.');
				return;
			}

			if(!eventStartDate) {
				alert('이벤트 시작일을 넣어주세요.');
				return;
			}

			if(!eventEndDate) {
				alert('이벤트 종료일을 넣어주세요.');
				return;
			}

			if(eventStartDate > eventEndDate){
				alert('이벤트 종료일은 시작일보다 빠를 수 없습니다.');
				return;
			}

			// 200609 김수경 상세이미지 없이 등록할 경우 알럿	
			if(detailImgUrl == ""){
				alert('이벤트 상세이미지 없이 등록할 수 없습니다.');
				return;
			}
			var formData = {
				eventNo : eventNo,
				imgUrl : imgUrl,
				detailImgUrl : detailImgUrl,
				eventTitle : eventTitle ,				
				eventStartDate : eventStartDate ,
				eventEndDate : eventEndDate ,				
				activated : activated,
				linkUrl : linkUrl,
				company : company,
				eventLink : eventLink
			} ;

			console.log(formData);

			if(!confirm('수정하시겠습니까?')) return;
			updateEvent(formData);
		});

		$('#btnEventDelete').on('click', function(){							
			if(!confirm("삭제하시겠습니까?")) return;
			var formData = {
				eventNo :eventNo
			}
			deleteEvent(formData);		
		});

	function updateEvent(formData){
		$.post( '/back/05_event/eventUpdate.jsp',
			formData, 			
			function(resultJSON){
				if(resultJSON['update'] > 0){
					alert('수정되었습니다');
					location.href ='/event/event_list.html';
				}else {
					alert(resultJSON['error']);
				}
			}
		);
	}

	function deleteEvent(formData){
		$.post( '/back/05_event/eventDelete.jsp',
			formData, 			
			function(resultJSON){
				if(resultJSON['delete'] > 0){
					alert('삭제되었습니다');
					location.href ='/event/event_list.html';
				}else {
					alert(resultJSON['error']);
				}
			}
		);
	}

		// 200609 김수경 링크 기능 추가
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
     /*
	//핀매장 리스트 가져오기
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
	*/
	// 판매장 리스트 셋업
	function setCompanyOptions(companyList){
		var options = '';
		$(companyList).each( function (idx, company) {
			if(company.VM_CP_NO == 0 ) return;
			options += '<option value=' + company.VM_CP_NO + '>' +company.VM_CP_NAME + '</option>' ;
		});
		$('#company').append(options);
	}

	function getEventInfo(eventNo){
		$.get('/back/05_event/event.jsp?eventNo='+eventNo,	
		function(result) {
			console.log(result);
			var info = result.list[0];			
			setCompanyOptions({
				VM_CP_NO: result.list[0].company,
				VM_CP_NAME: result.list[0].company_name				
			})

			//$('#company').val(info.company_name);			
			$('#imgPreview').attr('src',info.img_url);
			$('#detailImgPreview').attr('src',info.detail_img_url);			
			$('#eventTitle').val(info.event_title);
			$('#event_start_date').val(info.start_date);
			$('#event_end_date').val(info.end_date);			
			$('#company').val(info.company);
			$('#activated').val(info.activated);
			$('#linkUrl').val(info.link_url);
			if (info.eventLink == "Y")
			{				
				$('#eventLink').prop( 'checked',true);
				$("#btn_layer_popup_link_open").prop('disabled', true);
				$("#linkUrl").prop('disabled', false);								

			}else{			
				$('#eventLink').prop( 'checked',false);
				$("#btn_layer_popup_link_open").prop('disabled', false);
				$("#linkUrl").prop('disabled', true);								
			}
		});
	}


	function getLinkList(){
		var companyNo = $("#company").val();
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

