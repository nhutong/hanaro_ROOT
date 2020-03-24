$(function () {

	//  var Result = getParameterByName('Test'); // 결과 : 111
		getHeader();
		$(".nav_event").addClass("active");

		getLeft();
		getLeftMenu('event');
		$("#nh_event_list").addClass("active");


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

		$('#companyAddBtn').on('click', function(){
			var companyNo = $('#company').val();
			var companyName = $('#company').find('option[value='+companyNo+']').text().trim();
			if($('#cp'+companyNo).length) return;
			$('#companyAddBtn').parent().append('<div data-no="'+companyNo+'" id="cp'+companyNo+'" class="selected_option">'+ companyName +'</div>');
			$('.selected_option').on('click', function(){
				$(this).remove();
			});
		});
	
		$('#btneventCreate').on('click', function(){				
			var imgUrl =$('#imgPreview').attr('src');
			var detailImgUrl =$('#detailImgPreview').attr('src');
			var eventTitle = $('#eventTitle').val();			
			var eventStartDate = $('#event_start_date').val();
			var eventEndDate = $('#event_end_date').val();
			//var company = $('#company').val();
			var activated = $('#activated').val();
			var linkUrl = $('#linkUrl').val();
			var userEmail = $('.user_email').text().trim();

			var eventLink = "";
			
			if ( $('input:checkbox[id="eventLink"]').is(":checked") == true )
			{
				eventLink = "Y";
			}else{
				eventLink = "N";
			}
			
			if(eventTitle == "") {
				alert('이벤트 제목을 넣어주세요.');
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
			
			var company = '';
			$('.selected_option').each( function (idx, item) {
				if(idx === 0 ) company += $(item).data('no');
				else company += ',' + $(item).data('no');
			    
			});

			var formData = {
				imgUrl : imgUrl,
				detailImgUrl : detailImgUrl,
				eventTitle : eventTitle ,				
				eventStartDate : eventStartDate ,
				eventEndDate : eventEndDate ,
				company : company,
				activated : activated,
				linkUrl : linkUrl,
				eventLink : eventLink
			} ;

			console.log(formData);
			createEvent(formData);
		});
	
	
		
	});

	function createEvent(formData){
		$.post( '/back/05_event/eventCreate.jsp',
			formData, 			
			function(resultJSON){
				if(resultJSON['insert'] > 0){
//					alert('등록되었습니다');
					//location.href ='/event/event_list.html';
				}else {
//					alert(resultJSON['error']);
					alert("판매장을 추가해주세요.");
				}
			}
		);
	}

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
	
	function setCompanyOptions(companyList){
		var options = '';
		$(companyList).each( function (idx, company) {
			options += '<option value=' + company.VM_CP_NO + '>' +company.VM_CP_NAME + '</option>' ;
		});
		$('#company').append(options);
	}
	