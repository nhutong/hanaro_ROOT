$(function () {

	var searchTextbox = getParameterByName('searchText');
	if (searchTextbox == "")
	{
	}else{
	   $("#searchTextbox").val(searchTextbox);
	}

	var pageNo = getParameterByName('pageNo');
	if (pageNo == "")
	{
	    pageNo = 1;
	}

	getHeader();
	$(".nav_product").addClass("active");
	
	getLeft();
	getLeftMenu('product');
	$("#nh_product_prodmaster").addClass("active");

	prodList(pageNo, searchTextbox);
	prodList_paging(pageNo, searchTextbox);

	var input = document.getElementById("searchTextbox");
	input.addEventListener("keyup", function(event) {
		event.preventDefault();
		if (event.keyCode === 13) {
			location.href="prod_master.html?pageNo="+pageNo+"&searchText="+encodeURIComponent($("#searchTextbox").val());
		}
	});
	
	/*검색필터*/
	$(".search_keyword_wrap").hide();

	$("#prodModalSave").click(function(){

		var prodModalCode = $("#prodModalCode").val();
		var prodModalName = $("#prodModalName").val();
		var prodModalKeyword = $("#prodModalKeyword").val();

		if ( prodModalCode == null || chrLen(prodModalCode) == 0)
		{
			alert("상품코드(SKU)를 입력하시기 바랍니다.");
			return false;
		}

		if ( prodModalName == null || chrLen(prodModalName) == 0)
		{
			alert("상품명을 입력하시기 바랍니다.");
			return false;
		}

//		if ( prodModalKeyword == null || chrLen(prodModalKeyword) == 0)
//		{
//			alert("키워드를 입력하시기 바랍니다.");
//			return false;
//		}
		
		if (localStorage.getItem("save_type") == "insert")
		{
			$.ajax({
				url:'/back/08_product/productInsert.jsp?random=' + (Math.random()*99999),
				data : { pd_name: prodModalName, pd_code: prodModalCode, group_tag: prodModalKeyword},
				method : 'GET' 
			}).done(function(result){
				console.log("noticeList=========================================");
				if(result == ('NoN') || result == 'exception error' || result == 'empty'){
					console.log(result);
				}else if(result == 'exist'){
					console.log(result);
					alert("이미 동일한 코드로 등록된 상품이 있습니다. 추가가 취소됩니다.");
					$("#prodModalCode").val("");
					$("#prodModalName").val("");
					$("#prodModalKeyword").val("");
				}else{
					console.log("============= notice callback ========================");
					console.log(result);
					alert("등록이 완료되었습니다.");
					$("#prodModalCode").val("");
					$("#prodModalName").val("");
					$("#prodModalKeyword").val("");
					location.href="/product/prod_master.html?pageNo="+pageNo+"&searchText="+searchTextbox;
				}
			});
		}else{
			$.ajax({
				url:'/back/08_product/productUpdate.jsp?random=' + (Math.random()*99999),
				data : { pd_name: prodModalName, pd_code: prodModalCode, group_tag: prodModalKeyword},
				method : 'GET' 
			}).done(function(result){
				console.log("noticeList=========================================");
				if(result == ('NoN') || result == 'exception error' || result == 'empty'){
					console.log(result);
				}else{
					console.log("============= notice callback ========================");
					console.log(result);
					alert("수정이 완료되었습니다.");
					$("#prodModalCode").val("");
					$("#prodModalName").val("");
					$("#prodModalKeyword").val("");
					location.href="/product/prod_master.html?pageNo="+pageNo+"&searchText="+searchTextbox;
				}
			});
		}

	});

	$("#prodTableDel").click(function(){

		var chk_obj = document.getElementsByName("box_chk");
		var chk_leng = chk_obj.length;

		for(i=0;i<chk_leng;i++){
			if(chk_obj[i].checked==true){
				deleteProd(chk_obj[i].value);
			}
		}
	});

	// 우산단 이미지선택 삭제
	$("#prodSelectDel").click(function(){

		var chk_obj = document.getElementsByName("image_per_prod");
		var chk_leng = chk_obj.length;

		for(i=0;i<chk_leng;i++){
			if(chk_obj[i].checked==true){
				deleteImgPool(chk_obj[i].value);
			}
		}
	});

	// 우산단 이미지선택 다운로드
	$("#prodSelectDown").click(function(){

		var chk_obj = document.getElementsByName("image_per_prod");
		var chk_leng = chk_obj.length;

		for(i=0;i<chk_leng;i++){
			if(chk_obj[i].checked==true){
				downloadImgPool(chk_obj[i].value);
			}
		}
	});

	$("#checkboxAll").click(function(){
		var chk_obj = document.getElementsByName("box_chk");
		var chk_leng = chk_obj.length;
		var chkAgreeAll = $('input:checkbox[id="checkboxAll"]').is(":checked");

		if (chkAgreeAll == true){
			for(var j=0; j < chk_leng; j++) {
				chk_obj[j].checked=true;
			}
		}else{
			for(var j=0; j < chk_leng; j++) {
				chk_obj[j].checked=false;
			}
		}
	});

	$("#droped_zone").hide();
	localStorage.setItem("selectedPdCode","");

	if (getCookie("userRoleCd") == "ROLE2" )
	{
		$("#prodTableDel").hide();
		$("#prodTableAdd").hide();
		$("#prod_upload_wrap").hide();
		$("#prodSelectDel").hide();
	}

	$("#pd_name_asc").click(function(){
		prodList(pageNo, searchTextbox, "asc", "", "");
		prodList_paging(pageNo, searchTextbox, "asc", "", "");
	});
	$("#pd_name_desc").click(function(){
		prodList(pageNo, searchTextbox, "desc", "", "");
		prodList_paging(pageNo, searchTextbox, "desc", "", "");
	});

	$("#key_asc").click(function(){
		prodList(pageNo, searchTextbox, "", "asc", "");
		prodList_paging(pageNo, searchTextbox, "", "asc", "");
	});
	$("#key_desc").click(function(){
		prodList(pageNo, searchTextbox, "", "desc", "");
		prodList_paging(pageNo, searchTextbox, "", "desc", "");
	});

	$("#tag_asc").click(function(){
		prodList(pageNo, searchTextbox, "", "", "asc");
		prodList_paging(pageNo, searchTextbox, "", "", "asc");
	});
	$("#tag_desc").click(function(){
		prodList(pageNo, searchTextbox, "", "", "desc");
		prodList_paging(pageNo, searchTextbox, "", "", "desc");
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



function deleteProd(rcvPdCode){
	$.ajax({
		url:'/back/08_product/productDelete.jsp?random=' + (Math.random()*99999),
		data : { pd_code: rcvPdCode },
		method : 'GET' 
	}).done(function(result){
		console.log("noticeList=========================================");
		if(result == ('NoN') || result == 'exception error' || result == 'empty'){
			console.log(result);
		}else{
			console.log("============= notice callback ========================");
			console.log(result);
			alert("삭제 완료되었습니다.");
			$("#prodModalCode").val("");
			$("#prodModalName").val("");
			$("#prodModalKeyword").val("");
			location.href="/product/prod_master.html";
		}
	});
}

// 우상단 선택삭제 버튼으로 선택된 이미지를 삭제한다.
function deleteImgPool(rcvImgNo){
	$.ajax({
		url:'/back/08_product/imgPoolDelete.jsp?random=' + (Math.random()*99999),
		data : { img_no: rcvImgNo },
		method : 'GET' 
	}).done(function(result){
		console.log("noticeList=========================================");
		if(result == ('NoN') || result == 'exception error' || result == 'empty'){
			console.log(result);
		}else{
			console.log("============= notice callback ========================");
			console.log(result);
//			alert("삭제 완료되었습니다.");
			location.reload();
		}
	});
}

// 우상단 선택다운로드 버튼으로 선택된 이미지를 다운로드한다.
function downloadImgPool(rcvImgNo){
	//$.ajax({
		//url:'/back/08_product/imgDownload.jsp?random=' + (Math.random()*99999),
		//data : { img_no: rcvImgNo },
		//method : 'GET' 
	//}).done(function(result){
		//console.log("noticeList=========================================");
		//if(result == ('NoN') || result == 'exception error' || result == 'empty'){
			//console.log(result);
		//}else{
			//console.log("============= notice callback ========================");
			//console.log(result);
		//}
	//});
	//document.getElementById("main_frame").src = '/back/08_product/imgDownload.jsp?random=' + (Math.random()*99999) + '&img_no=' + rcvImgNo;

	var aIframe = document.createElement("iframe");
	aIframe.src = '/back/08_product/imgDownload.jsp?random=' + (Math.random()*99999) + '&img_no=' + rcvImgNo;
	document.getElementsByTagName("body")[0].appendChild(aIframe);
}

function addModal(){
	$("#prodModalCode").val("");
	$("#prodModalName").val("");
	$("#prodModalKeyword").val("");
    $(".prod_modal_edit_wrap").toggleClass("active");
	localStorage.setItem("save_type","insert");

	document.getElementById('prodModalCode').readOnly = false;
}

function editModal(rcvPdCode, rcvPdName, rcvGroupTag){

	if (localStorage.getItem("selectedPdCode") == rcvPdCode)
	{
		$("#droped_zone").toggle();
	}else{
		$("#droped_zone").hide();
		$("#droped_zone").toggle();
	}
	localStorage.setItem("selectedPdCode",rcvPdCode);

	if (getCookie("userRoleCd") == "ROLE1" )
	{
		$(".prod_modal_edit_wrap").addClass("active");
		localStorage.setItem("save_type","update");

		$("#prodModalCode").val(rcvPdCode);
		$("#prodModalName").val(rcvPdName);
		$("#prodModalKeyword").val(rcvGroupTag);

		document.getElementById('prodModalCode').readOnly = true;

	}else{
		
	}

//    $(".prod_modal_edit_wrap").addClass("active");
//	localStorage.setItem("save_type","update");
//
//	$("#prodModalCode").val(rcvPdCode);
//	$("#prodModalName").val(rcvPdName);
//	$("#prodModalKeyword").val(rcvGroupTag);
//
//	document.getElementById('prodModalCode').readOnly = true;

	//우측 div 에 이미지 썸네일을 바인딩한다. 이중호 20191128
	$.ajax({
        url:'/back/08_product/productImage.jsp?random=' + (Math.random()*99999), 
        data : {
			groupTag: rcvGroupTag,
			pdCode: rcvPdCode
			},
        method : 'GET' 
    }).done(function(result){

        console.log("noticeList=========================================");
        if(result == ('NoN') || result == 'list error' || result == 'empty'){
            console.log(result);
			$("#prod_img_wrap").empty();
        }else{
            console.log("============= notice callback ========================");
            console.log(result);
            var data = JSON.parse(result);
			var text = "";

            data['CompanyList'].forEach(function(item, index){                        
				
				text += ' <div class="prod_img">';
				text += '   <img src="/upload/'+decodeURIComponent(item['img_path'])+'" alt="이미지">';
				text += '   <input type="checkbox" name="image_per_prod" value="'+decodeURIComponent(item['img_no'])+'">';
				text += ' </div>';

			});
			$("#prod_img_wrap").empty();
			$("#prod_img_wrap").append(text);
        }
    });

}

// 상품리스트를 가져온다
function prodList(rcvPageNo, rcvSearchText, rcvPdNameOrder, rcvKeyOrder, rcvTagOrder) {

	$.ajax({
        url:'/back/08_product/productList.jsp?random=' + (Math.random()*99999), 
        data : {pageNo: rcvPageNo ,searchText: rcvSearchText, pdNameOrder: rcvPdNameOrder, keyOrder: rcvKeyOrder, tagOrder: rcvTagOrder},
        method : 'GET' 
    }).done(function(result){

        console.log("noticeList=========================================");
        if(result == ('NoN') || result == 'list error' || result == 'empty'){
            console.log(result);
        }else{
            $("#pdList").html("");
            console.log("============= notice callback ========================");
            console.log(result);
            var data = JSON.parse(result);
			var text = "";

            data['CompanyList'].forEach(function(item, index){                        
				
				text +='<tr>';
				text +='	<td><input type="checkbox" name="box_chk" value="'+decodeURIComponent(item['pd_code'])+'"></td>';
				text +='    <td><span class="prod_code" onclick="editModal(\''+decodeURIComponent(item['pd_code'])+'\', \''+item['pd_name']+'\', \''+decodeURIComponent(item['group_tag'])+'\');">'+decodeURIComponent(item['pd_code'])+'</span></td>';
				text +='    <td>'+item['pd_name']+'</td>';
                text +='    <td>'+decodeURIComponent(item['group_tag'])+'</td>';
                text +='    <td><span id=pdCode_'+decodeURIComponent(item['pd_code'])+'>'+decodeURIComponent(item['img_cnt'])+'</span></td>';
                text +='</tr>';

//				localStorage.setItem("row_"+index+"_pd_code",item['pd_code']);
			});
			$("#pdList").append(text);

//			//여기서 이미지수를 넣는 함수를 0~5 로 6번 루프돌려서 이미지수를 넣는다.
//			prodImageCnt(localStorage.getItem("row_0_pd_code"));
//			prodImageCnt(localStorage.getItem("row_1_pd_code"));
//			prodImageCnt(localStorage.getItem("row_2_pd_code"));
//			prodImageCnt(localStorage.getItem("row_3_pd_code"));
//			prodImageCnt(localStorage.getItem("row_4_pd_code"));
//			prodImageCnt(localStorage.getItem("row_5_pd_code"));
        }
    });

}

//// 상품별 이미지수를 가져온다
//function prodImageCnt(rcvPdCode) {
//
//	$.ajax({
//        url:'/back/08_product/productImageCnt.jsp?random=' + (Math.random()*99999), 
//        data : {pdCode: rcvPdCode},
//        method : 'GET' 
//    }).done(function(result){
//
//        console.log("noticeList=========================================");
//        if(result == ('NoN') || result == 'list error' || result == 'empty'){
//            console.log(result);
//        }else{
//            console.log("============= notice callback ========================");
//            console.log(result);
//            var data = JSON.parse(result);
//			var text = "";
//
//            data['CompanyList'].forEach(function(item, index){                        
//				
//                text +=decodeURIComponent(item['img_cnt']);
//
//			});
//			$("#pdCode_"+rcvPdCode).append(text);
//        }
//    });
//
//}

// 상품리스트 페이징를 가져온다
function prodList_paging(rcvPageNo, rcvSearchText, rcvPdNameOrder, rcvKeyOrder) {

	$.ajax({
        url:'/back/08_product/productList_paging.jsp?random=' + (Math.random()*99999), 
        data : {pageNo: rcvPageNo ,searchText: rcvSearchText, pdNameOrder: rcvPdNameOrder, keyOrder: rcvKeyOrder},
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

           if (total_paging_cnt == 0 || total_paging_cnt == 1 || pre_no == -4)
			{
			}else if(total_paging_cnt < 5 || pre_no < 1){
				text += '<li class="page-item"><a class="page-link" href="prod_master.html?pageNo=1&searchText=">«</a></li>';
			}else{
				text += '<li class="page-item"><a class="page-link" href="prod_master.html?pageNo='+pre_no+'&searchText='+encodeURIComponent($("#searchTextbox").val())+'">«</a></li>';
			}

			for( var k = paging_init_num; k <= paging_end_num; k++){
				if (parseInt(rcvPageNo) == k)
				{
					text += '<li class="page-item active"><a class="page-link" href="prod_master.html?pageNo='+k+'&searchText='+encodeURIComponent($("#searchTextbox").val())+'">'+k+'</a></li>';
//					text += '<li class="page-item" active><a class="page-link" onclick="prodList('+k+', \''+encodeURIComponent($("#searchTextbox").val())+'\')">'+k+'</a></li>';
				}else{
					text += '<li class="page-item"><a class="page-link" href="prod_master.html?pageNo='+k+'&searchText='+encodeURIComponent($("#searchTextbox").val())+'">'+k+'</a></li>';
//					text += '<li class="page-item"><a class="page-link" onclick="prodList('+k+', \''+encodeURIComponent($("#searchTextbox").val())+'\')">'+k+'</a></li>';
				}
			}

			if (total_paging_cnt == 0 || total_paging_cnt == 1 || next_no > total_paging_cnt)
			{
			}else{
				text += '<li class="page-item"><a class="page-link" href="prod_master.html?pageNo='+next_no+'&searchText='+encodeURIComponent($("#searchTextbox").val())+'">»</a></li>';
			}
			$('#pagination').empty();
			$('#pagination').append(text);	
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
		alert("파일을 업로드하시기 바랍니다.");
		return false;
	}

	$.ajax({
        url:'/back/08_product/prodInsert.jsp?random=' + (Math.random()*99999),
		data : {userCompanyNo: userCompanyNo, excel_path: excel_path, reg_no: getCookie("userNo"), update_fg: "N"},
        method : 'GET' 
    }).done(function(result){

        console.log("noticeList=========================================");
        if(result == ('NoN') || result == 'exception error' || result == 'empty'){
            console.log(result);
			alert("전단 양식에 맞는 파일로 업로드하시기 바랍니다.");
        }else if(result == ('pd_code_no_exist')){
			alert("엑셀파일에서 상품코드가 입력되지 않은 행이 존재합니다.");
		}else if(result == ('exist')){
//			alert("상품코드가 중복된 상품이 있습니다. 제거 후 다시 업로드해주세요.");
			var con_test = confirm("상품코드가 중복된 상품이 있습니다. 신규입력할 엑셀정보로 일괄 업데이트 및 신규입력을 진행하시겠습니까?");
			if(con_test == true){
			  console.log(result);
			  excelInsertAndUpdate();
			}else if(con_test == false){
			  alert("취소하셨습니다.");
			}
		}else if(result == ('pd_name_no_exist')){
			alert("엑셀파일에서 상품명이 입력되지 않은 행이 존재합니다.");
		}else{
            console.log("============= notice callback ========================");
            console.log(result);
            alert("등록이 완료되었습니다.");
			location.href="/product/prod_master.html";
        }
    });
});

/*신규등록하기 버튼 클릭시, 신규전단을 등록한다.*/
function excelInsertAndUpdate(){

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
		alert("파일을 업로드하시기 바랍니다.");
		return false;
	}

	$.ajax({
        url:'/back/08_product/prodInsert.jsp?random=' + (Math.random()*99999),
		data : {userCompanyNo: userCompanyNo, excel_path: excel_path, reg_no: getCookie("userNo"), update_fg: "Y"},
        method : 'GET' 
    }).done(function(result){

        console.log("noticeList=========================================");
        if(result == ('NoN') || result == 'exception error' || result == 'empty'){
            console.log(result);
			alert("전단 양식에 맞는 파일로 업로드하시기 바랍니다.");
        }else if(result == ('pd_code_no_exist')){
			alert("엑셀파일에서 상품코드가 입력되지 않은 행이 존재합니다.");
//		}else if(result == ('exist')){
//			alert("상품코드가 중복된 상품이 있습니다. 제거 후 다시 업로드해주세요.");
//			var con_test = confirm("상품코드가 중복된 상품이 있습니다. 신규입력할 엑셀정보로 일괄 업데이트 및 신규입력을 진행하시겠습니까?");
//			if(con_test == true){
//			  console.log(result);
//			}
//			else if(con_test == false){
//			  alert("취소하셨습니다.");
//			}
		}else if(result == ('pd_name_no_exist')){
			alert("엑셀파일에서 상품명이 입력되지 않은 행이 존재합니다.");
		}else{
            console.log("============= notice callback ========================");
            console.log(result);
            alert("등록이 완료되었습니다.");
			location.href="/product/prod_master.html";
        }
    });
}

/*검색 필터 2020-02-02 김나영*/
function searchFunc() {
     $(".search_keyword_wrap").show();
	 var blankSearch = $("#prodModalKeyword").val();

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