$(function () {

	//  var Result = getParameterByName('Test'); // 결과 : 111
		getHeader();
		$(".nav_event").addClass("active");


		getLeft();
		getLeftMenu('event');
		$("#nh_event_list").addClass("active");


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

		
	
		/* 배너 이미지 업로드*/
		$('#inputImgUpload').on('change', function(evt){
			var inputFile = document.getElementById('inputImgUpload');
			new Upload(inputFile, function(result){			
				$("#imgPreview").attr("src", "/upload/"+result.trim());
				//alert("업로드 완료 - 등록하기 버튼을 눌러주세요.");
			});
		});

		/* 상세 이미지 업로드*/
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
			
			if(imgUrl == "../images/image_unknown.png"){
				alert('배너이미지 없이 등록할 수 없습니다.');
				return;
			}	

			if(detailImgUrl == "../images/image_unknown2.png"){
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
		
	});



	function getEventInfo(eventNo){

		$.get('/back/05_event/event.jsp?eventNo='+eventNo,	
		function(result) {
			console.log(result);
			var info = result.list[0];			
			
			$('#imgPreview').attr('src',info.img_url);
			$('#detailImgPreview').attr('src',info.detail_img_url);			
			$('#eventTitle').val(info.event_title);
			$('#event_start_date').val(info.start_date);
			$('#event_end_date').val(info.end_date);
			$('#company').text(info.company_name);
			$('#activated').val(info.activated);
			$('#linkUrl').val(info.link_url);

			if (info.eventLink == "Y")
			{
				$('input:checkbox[id="eventLink"]').prop("checked", true);
			}else{
				$('input:checkbox[id="eventLink"]').prop("checked", false);
			}
		});
	}


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

	
