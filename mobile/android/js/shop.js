$(function(){

	// 전역변수 파라미터 ( 판매장이 보낸 문자링크때 주로 사용된다. )	
	vm_cp_no = getParameterByName('vm_cp_no');   // 판매장번호

	// 해더에 셋팅한다. 셋팅후 메뉴번호가 없을 경우에 대비하여, 최초 로딩할 메뉴번호를 로컬스토리지에 셋팅하고, getDateInterval()을 호출한다.
	if (vm_cp_no == "")
	{
		// 웹에서 로그인을 통한 접근이 아닐경우
		if (localStorage.getItem("vm_cp_no") == "")
		{
			// 일단 양재점으로 셋팅한다.
			vm_cp_no = 1;
		// 웹이나 앱에서 로그인을 통한 정상적인 접근일 경우,
		}else{
			vm_cp_no = localStorage.getItem("vm_cp_no");
		}
	}

	getHeader(vm_cp_no);
	getLeft();
	
	setTimeout(function(){ getCpName(vm_cp_no); }, 100);
	setTimeout(function(){ getPdContent('shopCateAll','전체'); }, 100);
	getJangCnt(localStorage.getItem("memberNo"));

	//카테고리 - 후에 바인딩하고 다시 수정
	var ofLength = $("#shopCategoryArea li").length;
	$("#shopCategoryArea").width(60*ofLength);
	//누른 메뉴가 가장 오른쪽에 오게하기
	var cateW = $("#shopCategoryArea").width();
	var indexOf = $("#shopCategoryArea li.active").index();
	var countIndex = 60*(indexOf-1);
	if(countIndex >= cateW){
		$("#shopCategory").scrollLeft(cateW - 270);
	}else{
		$("#shopCategory").scrollLeft(countIndex);
	}
    
   //장바구니 비로그인시 클릭불가
	$("#cart_btn").click(function(){
		if(localStorage.getItem("memberNo") == ""){
			alert("비로그인시 장보기 기능을 사용하실 수 없습니다.\n로그인 후 이용 부탁드립니다.");
			return false;
		}else{
			cart();
		}
	
	})

	logInsert(localStorage.getItem("memberNo"), vm_cp_no, "-3");
})

function getCpName(rcv_vm_cp_no){

	$.ajax({
        url:'https://www.nhhanaromart.com/back/02_app/mLeafletCpName.jsp?random=' + (Math.random()*99999), 
        data : {vm_cp_no: rcv_vm_cp_no},
        method : 'GET' 
    }).done(function(result){

        console.log("CompanyName=========================================");
        if(result == ('NoN') || result == 'list error' || result == 'empty'){
            console.log(result);
        }else{
            $("#cpName").empty();
            console.log("============= notice callback ========================");
            console.log(result);
            var data = JSON.parse(result);
            
			data['CompanyName'].forEach(function(item, index){ 
				$("#cpName").append(decodeURIComponent(item['vm_cp_name']).replace(/\+/g,' '));
			});
			
        }
    });
}

// 전단 컨텐츠 상품리스트를 불러온다.
function getPdContent(rcvId,rcvCategoryName) {

	$('#shopCategoryArea>li').removeClass("active");
	$('#'+rcvId).addClass('active');

    $.ajax({
        url:'https://www.nhhanaromart.com/back/02_app/mLeafletJang.jsp?random=' + (Math.random()*99999), 
		data : {category_name: rcvCategoryName, vm_cp_no: vm_cp_no},
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
//                text += '		<a onclick="setThumImg('+item['jd_prod_con_no']+', '+item['pd_no']+', \''+item['pd_code']+'\');"><img src="https://www.nhhanaromart.com'+item['img_path']+'" alt="'+item['pd_name']+'"></a>'
				text += '		<a><img src="https://www.nhhanaromart.com'+item['img_path']+'" alt="'+item['pd_name']+'"></a>'
                text += '		<div class="thumb_info">'

				/* 로그인 & 장바구니에 이 물건을 담지 않은 사용자만 상품별 장바구니 추가버튼이 보인다. 20191229*/
				/* 20200127 배송기능미사용일경우, 추가버튼이 보이지 않는다. */
				if (localStorage.getItem("memberNo") != "" && item['vmjz_no'] == "" && item['VM_delivery_FG'] == "Y" )
				{
					if (item['img_path'] == "/upload/blank.png")
					{
					}else{
						text += '			<div class="add_btn" onclick="addJangBtn(\''+localStorage.getItem("memberNo")+'\', \''+item['jd_prod_con_no']+'\');"><img src="../images/share_btn.png" alt="추가"></div>'
					}
				}
                
				text += '		</div>'
                text += '   </div>'
                text += '   <div class="product_detail">'
//                text += '       <a class="product" onclick="setPdName('+item['jd_prod_con_no']+', \''+item['pd_name']+'\');">'+item['pd_name']+'</a>'
				text += '       <a class="product">'+item['pd_name']+'</a>'
				if (item['img_path'] == "/upload/blank.png"){
				}else{
//					text += '       <a class="price"   onclick="setPrice('+item['jd_prod_con_no']+', \''+item['price']+'\');">'+comma(item['price'])+'원</a>'
					text += '       <a class="price">'+comma(item['price'])+'</a>' //2020-05-07 원 삭제 - 미솔
				}

                text += '    </div>'
				text += '</div>'

            });

			$("#item_list_inner_wrap").empty();
			$("#item_list_inner_wrap").append(text);

			//강제로 thumbWidth와 height 맞춘 부분
			var thumbW = $("div#1 .thumb_wrap img").width();
			$(".thumb_wrap").css("height",thumbW)

        }
    });
}

/* 상품별 +버튼을 클릭하여 장바구니에 담는다. 20191229 */
function addJangBtn(rcvMemberNo, rcvProdConNo){
	$.ajax({
		url:'https://www.nhhanaromart.com/back/02_app/mLeafletJangAdd.jsp?random=' + (Math.random()*99999), 
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
			getJangCnt(localStorage.getItem("memberNo"));
            location.reload();
		}
	});
}

/* 로그인 사용자의 장바구니에 담긴 상품의 갯수를 불러온다. 20191229 */
function getJangCnt(rcvMemberNo) {

    $.ajax({
        url:'https://www.nhhanaromart.com/back/02_app/mLeafletJangCount.jsp?random=' + (Math.random()*99999), 
		data : {memberNo: rcvMemberNo, vm_cp_no: vm_cp_no},
        method : 'GET' 
    }).done(function(result){

		var text = "";
        console.log("BannerList=========================================");
        if(result.trim() == 'NoN' || result == 'list error' || result == 'empty'){
            console.log(result);

			$("#cart_item_count").empty();
			$("#cart_item_count").hide();

        }else{
            console.log("============= notice callback ========================");
            console.log(result);
            var data = JSON.parse(result);

            data['BannerList'].forEach(function(item, index){    

				$("#cart_item_count").empty();
				$("#cart_item_count").append(item['vmjz_cnt']);

            });

        }
    });
}