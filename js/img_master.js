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
// var enterUpload1 = document.getElementById('imgGroup_btn');
// enterUpload1.addEventListener('click', function(evt){
// 	var inputFile_img = document.getElementById('uploadFile_img');
// 	new UploadImgGroup(inputFile_img, function(result){
// 		$("#imgGroup_path").val(result);
// 		alert("파일을 업로드하였습니다.");
// 		location.reload();
// 	});
// });

/*이미지그룹 업로더 드래그앤드랍*/
var enterUpload2 = document.getElementById('imgMulti_btn');
enterUpload2.addEventListener('click', function(evt){
	document.getElementById("spinnerAction").style.display = "block";
	document.scrollingElement.scrollTop = 0;
	document.body.style.overflow = "hidden";
	promiseUploadFile("").then(res => {
		if(res == "cancelButton") {
			// location.reload(true);
			document.getElementById("spinnerAction").style.display = "none";
			document.body.style.overflow = "auto";
		}else if(res[0] != "upload error"){
			alert("업로드 완료");
			location.reload();
		}else{
			alert("업로드 실패");
			location.reload();
		}
	}); //pdcode없이 이미지만 등록
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

function viewBigImage(path) {
	const imgPath = '/upload/' + path;
	document.getElementById("input_img_Data").innerHTML = '<img src="' + imgPath + '" />';
}

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
				text +='	<td data-toggle="modal" data-target="#imgmasterModal" onclick="javascript:viewBigImage(\''+item['img_path']+'\')"><img src="/upload/'+item['img_path']+'" alt="nh_item1.jpg"></td>';
				text +='	<td>'+item['img_path']+'</td>';
				text +='	<td><input type="text" value="'+item['pd_code']+'" id="pdCode_'+item['img_no']+'"></td>';
				text +='	<td><input type="text" value="'+item['group_tag']+'" id="groupTag_'+item['img_no']+'" class="groupTagClass" onkeyup="searchFunc(this);" onblur="focusOut();">';			
				text +='    </td>';
				
				text +='	<td><span class="prod_name">'+item['pd_names']+'</span></td>';
				text +='	<td>';
				text +='		<div>';
				text +='			<i class="fa fa-trash" style="padding:0px 5px 0px 5px; font-size:20px; color:red; cursor:pointer;" onclick="imgDel(\''+item['img_no']+'\');"></i>';
				text +='			<i class="fa fa-save" style="padding:0px 5px 0px 5px; font-size:20px; color:#555; cursor:pointer;" onclick="imgSave(\''+item['img_no']+'\');"></i>';
				text +='			<i class="fa fa-check-circle" style="padding:0px 5px 0px 5px; font-size:20px; color:#55b190; cursor:pointer;" onclick="imgAppr(\''+item['img_no']+'\');"></i>';
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
	const extension = excel_path.split(".")[1];
	const baseUrl = (extension == "xls") ? "imgInsertXls.jsp" : (extension == "xlsx") ? "imgInsertXlsx.jsp" : "null";
	$.ajax({
        url:'/back/08_product/'+baseUrl+'?random=' + (Math.random()*99999),
		data : {userCompanyNo: userCompanyNo, excel_path: excel_path, reg_no: getCookie("userNo")},
        method : 'GET' 
    }).done(function(result){
		var resultSplit = result.trim().split(',');
        console.log(resultSplit);
        if(resultSplit[0] == ('NoN') || resultSplit[0] == 'exception error' || resultSplit[0] == 'empty'){
			alert("양식 파일이 올바르지 않거나 공백이 존재합니다. 양식의 하단 빈 공간을 모두 선택한 뒤 삭제하고 업로드해주세요!");
        }else if(resultSplit[0] == ('pd_code_no_exist')){
			alert("엑셀파일에서 상품코드가 입력되지 않은 행이 존재합니다.");
		}else if(resultSplit[0] == ('pd_name_no_exist')){
			alert("엑셀파일에서 상품명이 입력되지 않은 행이 존재합니다.");
		}else if(resultSplit[0] == ('NoN_pdCode')){
			alert("입력하신 상품의 상품코드(" + resultSplit[1] + ")가 존재하지 않습니다.");
		}else{
            //console.log("============= notice callback ========================");
            //console.log(result);
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