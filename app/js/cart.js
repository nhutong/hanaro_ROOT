$(function(){

		getHeader();
		getLeft();

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
	
	setTimeout(function(){ getCpName(vm_cp_no); }, 500);
	cartList(localStorage.getItem("tel"));
})


function getCpName(vm_cp_no){

	$.ajax({
        url:'/back/02_app/mLeafletCpName.jsp?random=' + (Math.random()*99999), 
        data : {vm_cp_no: vm_cp_no},
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

//장바구니 리스트 불러오기
	function cartList(rcvTel) {

    $.ajax({
        url:'/back/02_app/mLeafletCart.jsp?random=' + (Math.random()*99999), 
        data : {tel: rcvTel, vm_cp_no: vm_cp_no},
        method : 'GET' 
    }).done(function(result){

		var text = "";
        console.log("noticeList=========================================");
        if(result.trim() == 'NoN' || result == 'list error' || result == 'empty'){
            console.log(result);

			text +='<div class="list_no_item">장바구니에 상품이 없습니다.</div>'

			$("#cartListWrap").empty();
			$("#cartListWrap").append(text);
			$(".cart_submit").hide();
        }else{
            console.log("============= notice callback ========================");
            console.log(result);
            var data = JSON.parse(result);
			var price_tot = 0;

            data['PdContentList'].forEach(function(item, index){    

			    text += '<div class="figure figure3">';
			    text += '	<div class="thumb_wrap">';
			    text += '		   <a href="#">';
				text += '        	<img src="..'+item['img_path']+'" alt="'+item['pd_name']+'">';
				text += '       	</a>';
				text += '	<div class="product_detail">';
				text += '			<a href="#" class="product">'+item['pd_name']+'</a>';
				text += '			<a href="#" class="price">'+comma(item['price'])+'</a>'; //2020-05-07 원 삭제 - 미솔
				text += '           <input type="hidden" id="itemPrice_'+item['jd_prod_con_no']+'" value="'+item['price']+'">';
				text += '			<div class="cart_val"><div id="minus_'+item['jd_prod_con_no']+'" class="minus"><img src="../images/minus.png" alt="갯수빼기"></div><input type="text" id="inputValue_'+item['jd_prod_con_no']+'" value="'+item['jang_cnt']+'"><div id="plus_'+item['jd_prod_con_no']+'" class="plus"><img src="../images/plus.png" alt="갯수더하기"></div>';
				text += '			</div>';
				text += '	</div>';
				text += '</div>';
                text += '</div>';

				price_tot = Number(price_tot) + (Number(item['price']) * Number(item['jang_cnt']));
            });

			$("#total_price").empty();
			$("#total_price").append(comma(price_tot));
		
			$("#cartListWrap").empty();
			$("#cartListWrap").append(text);

			data['PdContentList'].forEach(function(item, index){ 
	
				$("#plus_"+item['jd_prod_con_no']).click(function () {
					if ($("#inputValue_"+item['jd_prod_con_no']).val() < 100) {

						/* 현재 셋팅되어 토탈가격에 반영되어 있는 값을 마이너스 한다. */
						price_tot = Number(price_tot) - (Number($("#itemPrice_"+item['jd_prod_con_no']).val()) * Number($("#inputValue_"+item['jd_prod_con_no']).val()));

						/* 새롭게 더할 값을 셋팅한다. */
						var new_val_plus = Number($("#inputValue_"+item['jd_prod_con_no']).val()) + 1;
						$("#inputValue_"+item['jd_prod_con_no']).val(new_val_plus);

						plusMinusBtn(item['jd_prod_con_no'], new_val_plus);

						/* 새롭게 셋팅한 값을 토탈가격에 반영한다. */
						price_tot = Number(price_tot) + (Number($("#itemPrice_"+item['jd_prod_con_no']).val()) * Number($("#inputValue_"+item['jd_prod_con_no']).val()));

						$("#total_price").empty();
						$("#total_price").append(comma(price_tot));
					}
				});
				$("#minus_"+item['jd_prod_con_no']).click(function () {
					if ($("#inputValue_"+item['jd_prod_con_no']).val() > 0) {

						/* 현재 셋팅되어 토탈가격에 반영되어 있는 값을 마이너스 한다. */
						price_tot = Number(price_tot) - (Number($("#itemPrice_"+item['jd_prod_con_no']).val()) * Number($("#inputValue_"+item['jd_prod_con_no']).val()));

						/* 새롭게 플러스할 값을 셋팅한다. */
						var new_val_minus = Number($("#inputValue_"+item['jd_prod_con_no']).val()) - 1;
						$("#inputValue_"+item['jd_prod_con_no']).val(new_val_minus);

						plusMinusBtn(item['jd_prod_con_no'], new_val_minus);

						/* 새롭게 셋팅한 값을 토탈가격에 반영한다. */
						price_tot = Number(price_tot) + (Number($("#itemPrice_"+item['jd_prod_con_no']).val()) * Number($("#inputValue_"+item['jd_prod_con_no']).val()));

						$("#total_price").empty();
						$("#total_price").append(comma(price_tot));
					}
				});

			});

        }
    });
}

/* +,- 버튼클릭시, 상품별 신규로 셋팅된 갯수를 저장한다. 20191229 */
function plusMinusBtn(rcvProdConNo, rcvJangCnt){
	$.ajax({
		url:'/back/02_app/mLeafletJangPrdUpdate.jsp?random=' + (Math.random()*99999), 
		data : {tel: localStorage.getItem("tel"), jd_prod_con_no: rcvProdConNo, vm_cp_no: vm_cp_no, jang_cnt: rcvJangCnt},
		method : 'GET' 
	}).done(function(result){
			
		console.log("noticeList=========================================");
		if(result == 'dup'){
			console.log(result);
		}else if(result == 'exception error'){
			console.log(result);
		}else{
			console.log("============= notice callback ========================");
			console.log(result);
		}
	});
}