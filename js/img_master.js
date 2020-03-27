$(function () {

//  var Result = getParameterByName('Test'); // 결과 : 111
	getHeader();
	$(".nav_product").addClass("active");
	
	getLeft();
	getLeftMenu('product');
	$("#nh_product_imgmaster").addClass("active");

	imgList();

});

/*이미지그룹 업로더*/
var enterUpload1 = document.getElementById('imgGroup_btn');
enterUpload1.addEventListener('click', function(evt){
	var inputFile_img = document.getElementById('uploadFile_img');
	new UploadImgGroup(inputFile_img, function(result){
		$("#imgGroup_path").val(result);
		alert("파일을 업로드하였습니다.");
		location.reload();
	});
});

/*엑셀파일 업로더*/
var enterUpload = document.getElementById('jundan_excel_btn');
enterUpload.addEventListener('click', function(evt){
	var inputFile = document.getElementById('uploadFile');
	new Upload(inputFile, function(result){
		$("#excel_path").val(result);
//		$("#airtel_thumnail_path_img").attr("src", "/upload/"+result);
		alert("업로드 완료 - 등록하기 버튼을 눌러주세요.");
	});
});

// 상품리스트를 가져온다
function imgList() {
	
	var text = "";

	$.ajax({
        url:'/back/08_product/imgList.jsp?random=' + (Math.random()*99999), 
//        data : {pageNo: rcvPageNo},
        method : 'GET' 
    }).done(function(result){

        console.log("noticeList=========================================");
        if(result == ('NoN') || result == 'list error' || result == 'empty'){
            
			console.log(result);

			text +='<tr>';
			text +='<td colspan="6">';
			text +='현재 업로드 된 이미지가 없습니다.';
			text +='</td>';
			text +='</tr>';
			

        }else{
            $("#imgCon").html("");
            console.log("============= notice callback ========================");
            console.log(result);
            var data = JSON.parse(result);

            data['CompanyList'].forEach(function(item, index){                        
				
				text +='<tr id="img_'+item['img_no']+'">';
				text +='	<td><img src="/upload/'+item['img_path']+'" alt="nh_item1.jpg"></td>';
				text +='	<td>'+item['img_path']+'</td>';
				text +='	<td><input type="text" value="'+item['pd_code']+'" id="pdCode_'+item['img_no']+'"></td>';

				text +='	<td><input type="text" value="'+item['group_tag']+'" id="groupTag_'+item['img_no']+'" class="groupTagClass" onkeyup="searchFunc(this);" onblur="focusOut();">';
				
				/* 한번만 붙인다. 나영 위치를 봐주셈! */
//				if (index == 0)
//				{
//					text +='	<div class="search_keyword_wrap">';
//					text +='		<ul id="keywordList">';
//					text +='		</ul>';
//					text +='	</div>';
//				}

				text +='    </td>';

				text +='	<td><span class="prod_name">'+item['pd_names']+'</span></td>';
				text +='	<td>';
				text +='		<div class="img_master_btn">';
				text +='			<button id="imgMasterDel"   onclick="imgDel(\''+item['img_no']+'\');">삭제</button>';
				text +='			<button id="imgMasterSave"  onclick="imgSave(\''+item['img_no']+'\');">저장</button>';
				text +='			<button id="imgMasterAdmit" onclick="imgAppr(\''+item['img_no']+'\');">승인</button>';
				text +='		</div>';
				text +='	</td>';
				text +='</tr>';
			});
        }

		$("#imgCon").empty();
		$("#imgCon").append(text);

		/*검색필터*/
		$(".search_keyword_wrap").hide();

    });

}

function imgDel(rcvImgNo){
	$.ajax({
		url:'/back/08_product/imgDelete.jsp?random=' + (Math.random()*99999),
		data : { img_no: rcvImgNo },
		method : 'GET' 
	}).done(function(result){
		console.log("noticeList=========================================");
		if(result == ('NoN') || result == 'exception error' || result == 'empty'){
			console.log(result);
		}else{
			console.log("============= notice callback ========================");
			console.log(result);
			alert("삭제 완료되었습니다.");
//			location.href="/product/img_master.html";
			$("#img_"+rcvImgNo).empty();
		}
	});
}

function imgAppr(rcvImgNo){
	$.ajax({
		url:'/back/08_product/imgAppr.jsp?random=' + (Math.random()*99999),
		data : { img_no: rcvImgNo },
		method : 'GET' 
	}).done(function(result){
		console.log("noticeList=========================================");
		if(result == ('NoN') || result == 'exception error' || result == 'empty'){
			console.log(result);
		}else{
			console.log("============= notice callback ========================");
			console.log(result);
			alert("승인 완료되었습니다.");
//			location.href="/product/img_master.html";
			$("#img_"+rcvImgNo).empty();
		}
	});
}

function imgSave(rcvImgNo){

		var rcvPdCode = $("#pdCode_"+rcvImgNo).val();
		var rcvGroupTag = $("#groupTag_"+rcvImgNo).val();

	$.ajax({
		url:'/back/08_product/imgSave.jsp?random=' + (Math.random()*99999),
		data : { img_no: rcvImgNo, pd_code: rcvPdCode, group_tag: rcvGroupTag },
		method : 'GET' 
	}).done(function(result){
		console.log("noticeList=========================================");
		if(result == ('NoN') || result == 'exception error' || result == 'empty'){
			console.log(result);
		}else{
			console.log("============= notice callback ========================");
			console.log(result);
			alert("저장 완료되었습니다.");
			location.href="/product/img_master.html";
		}
	});
}

/*신규등록하기 버튼 클릭시, 신규전단을 등록한다.*/
$("#jundan_excel_new").on("click",function(){

	if (getCookie("userRoleCd") == "ROLE2")
	{
		var userCompanyNo = getCookie("userCompanyNo");
	}else{
		var userCompanyNo = getCookie("onSelectCompanyNo");
	}
	
	var excel_path = $("#excel_path").val();

	var d = new Date();
	var nowDate = d.getFullYear()+leadingZeros((Number(d.getMonth())+1),2)+d.getDate();

	if ( excel_path == null || chrLen(excel_path) == 0)
	{
		alert("상품이미지 매핑파일을 업로드하시기 바랍니다.");
		return false;
	}

	$.ajax({
        url:'/back/08_product/imgInsert.jsp?random=' + (Math.random()*99999),
		data : {userCompanyNo: userCompanyNo, excel_path: excel_path, reg_no: getCookie("userNo")},
        method : 'GET' 
    }).done(function(result){

        console.log("noticeList=========================================");
        if(result == ('NoN') || result == 'exception error' || result == 'empty'){
            console.log(result);
			alert("전단컨텐츠 양식에 맞는 파일로 업로드하시기 바랍니다.");
        }else if(result == ('pd_code_no_exist')){
			alert("엑셀파일에서 상품코드가 입력되지 않은 행이 존재합니다.");
		}else if(result == ('pd_name_no_exist')){
			alert("엑셀파일에서 상품명이 입력되지 않은 행이 존재합니다.");
		}else if(result.substr(0,4) == ('NoN0')){
			alert("입력하신 상품의 상품코드("+result.substr(5,result.length)+")가 존재하지 않습니다.");
		}else{
            console.log("============= notice callback ========================");
            console.log(result);
            alert("등록이 완료되었습니다.");
			location.href="/product/img_master.html";
        }
    });
});

//$(".groupTagClass").keyup(function(){console.log(1);
//	searchFunc(); 
//});

function focusOut(){
	$("div.search_keyword_wrap").remove();
}


/*검색 필터 2020-02-02 김나영*/
function searchFunc(obj) {
	$("div.search_keyword_wrap").remove();
	$(obj).parents("td").append('<div class="search_keyword_wrap"><ul id="keywordList"></ul></div>')
	
     $(".search_keyword_wrap").show();
//	 var blankSearch = $("#prodModalKeyword").val();
	 var blankSearch = $(obj).val();

	 if(blankSearch == ""){
		$(".search_keyword_wrap").hide();
	 }else{
		$(".search_keyword_wrap").show();
		keywordList(blankSearch);
	 }
}

// 키워드 리스트를 가져온다
function keywordList(rcvKeyword) {

	$.ajax({
        url:'/back/08_product/keywordList.jsp?random=' + (Math.random()*99999), 
        data : {keyword: rcvKeyword},
        method : 'GET' 
    }).done(function(result){

        console.log("noticeList=========================================");
        if(result == ('NoN') || result == 'list error' || result == 'empty'){
            console.log(result);
			$("#keywordList").empty();
        }else{
            console.log("============= notice callback ========================");
            console.log(result);
            var data = JSON.parse(result);
			var text = "";

            data['CompanyList'].forEach(function(item, index){                        
				
				text +='    <li style="cursor: pointer" onclick="$(\'#prodModalKeyword\').val(\''+decodeURIComponent(item['group_tag'])+'\');$(\'.search_keyword_wrap\').hide();">'+decodeURIComponent(item['group_tag'])+'</li>'; 


			});
			$("#keywordList").empty();
			$("#keywordList").append(text);

        }
    });

}