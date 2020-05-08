$(function(){

	// 전역변수 파라미터 ( 판매장이 보낸 문자링크때 주로 사용된다. )	
	vm_cp_no = getParameterByName('vm_cp_no');   // 판매장번호

	// 해더에 셋팅한다. 셋팅후 메뉴번호가 없을 경우에 대비하여, 최초 로딩할 메뉴번호를 로컬스토리지에 셋팅하고, getDateInterval()을 호출한다.
	if (vm_cp_no == "")
	{
		// 웹에서 로그인을 통한 접근이 아닐경우
		if (localStorage.getItem("vm_cp_no") == null)
		{
			// 일단 양재점으로 셋팅한다.
			vm_cp_no = 1;
		// 웹이나 앱에서 로그인을 통한 정상적인 접근일 경우,
		}else{
			vm_cp_no = localStorage.getItem("vm_cp_no");
		}
	}
	
})

// 전단 컨텐츠 상품리스트를 불러온다.
function getPdContent() {

	var search_box_kw = $('#search_box_kw').val();
	var isInIFrame = ( window.location != window.parent.location );

    $.ajax({
        url:'/back/02_app/mLeafletSearch.jsp?random=' + (Math.random()*99999), 
		data : {search_box: search_box_kw, vm_cp_no: vm_cp_no},
        method : 'GET' 
    }).done(function(result){

		var text = "";

        console.log("noticeList=========================================");
        if(result.trim() == 'NoN' || result == 'list error' || result == 'empty'){
            console.log(result);

			text +='<div class="list_no_item">준비중입니다.</div>'

			$("#item_list_inner_wrap").empty();
			$("#item_list_inner_wrap").append(text);
        }else{
            console.log("============= notice callback ========================");
            console.log(result);
            var data = JSON.parse(result);

            data['PdContentList'].forEach(function(item, index){    

				text += '<div class="figure figure3" id='+item['jd_prod_con_no']+'>'
                text += '   <div class="thumb_wrap">'
                text += '		<a ><img src="'+item['img_path']+'" alt="'+item['pd_name']+'"></a>'
                text += '		<div class="thumb_info">'
				/*아이프레임 내부에 있을 경우 보이지 않음 20200102*/
				if(isInIFrame == true){
				
				}else{
					/* 로그인 & 장바구니에 이 물건을 담지 않은 사용자만 상품별 장바구니 추가버튼이 보인다. 20191229*/
					if (localStorage.getItem("tel") != "" && item['vmjz_no'] == "")
					{
						if (item['img_path'] == "/upload/blank.png")
						{
						}else{
							text += '			<div class="add_btn" onclick="addJangBtn(\''+localStorage.getItem("tel")+'\', \''+item['jd_prod_con_no']+'\');"><img src="../images/share_btn.png" alt="추가"></div>'
						}
					}					
				}

				text += '		</div>'
                text += '   </div>'
                text += '   <div class="product_detail">'
                text += '       <a class="product" >'+item['pd_name']+'</a>'
				if (item['img_path'] == "/upload/blank.png"){
				}else{
					text += '       <a class="price" >'+comma(item['price'])+'</a>' //2020-05-07 원 삭제 - 미솔
				}

                text += '    </div>'
				text += '</div>'

            });

			$("#item_list_inner_wrap").empty();
			$("#item_list_inner_wrap").append(text);

        }
    });
}

/* 상품별 +버튼을 클릭하여 장바구니에 담는다. 20191229 */
function addJangBtn(rcvMemberNo, rcvProdConNo){
	$.ajax({
		url:'/back/02_app/mLeafletJangAdd.jsp?random=' + (Math.random()*99999), 
		data : {memberNo: rcvMemberNo, jd_prod_con_no: rcvProdConNo, vm_cp_no, vm_cp_no},
		method : 'GET' 
	}).done(function(result){
			
		console.log("noticeList=========================================");
		if(result == 'dup'){
			alert("장바구니에 중복하여 담을수 없습니다.")
		}else if(result == 'exception error'){
			console.log(result);
		}else{
			console.log("============= notice callback ========================");
			console.log(result);
			alert("장바구니에 추가하였습니다.");
		}
	});
}

//엔터시 검색
function Enter_Check(){

	if(event.keyCode == 13){
		getPdContent();
		return;
	}
}
