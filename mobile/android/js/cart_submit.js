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
	cartList(localStorage.getItem("memberNo"));
	deliveryAreaSelect();
	deliveryRound();

	//20200218 추가
	getBasicAddress();

})

/*배송요청버튼 클릭시, 배송요청 한다.*/
$("#delivery_submit_btn").on("click",function(){
	var address1 = encodeURIComponent($("#address1").val());
	var address2 = encodeURIComponent($("#address2").val());
	var del_time_select = encodeURIComponent($("#del_time_select").val());

	if ( address1 == null || chrLen(address1) == 0)
	{
		alert("주소를 입력하시기 바랍니다.");
		return false;
	}

	if ( address2 == null || chrLen(address2) == 0)
	{
		alert("주소를 입력하시기 바랍니다.");
		return false;
	}

	if ( del_time_select == null || del_time_select == 0)
	{
		alert("배송회차를 선택해주시기 바랍니다.");
		return false;
	}

	$.ajax({
        url:'https://www.nhhanaromart.com/back/02_app/mLeafletDeliveryInsert.jsp?random=' + (Math.random()*99999),
		data : {
			memberNo: localStorage.getItem("memberNo"), 
			address1: address1, 
			address2: address2, 
			del_time_select: del_time_select,
			vm_cp_no: vm_cp_no,
			price_total: uncomma($("#total_price").text())
			},
        method : 'GET' 
    }).done(function(result){

        console.log("noticeList=========================================");
        if(result == 'exception error'){
            console.log(result);

        /* 20200103 주문정보에 대한 알림추가 */
        }else if(result == 'NoN'){
			alert('잘못된 날짜주문 되었습니다.');
		}else if(result == 'DevNoN'){
			alert('해당판매장에 현재 배송정보가 설정되어 있지 않습니다.');
		}else if(result == 'DevWeekendFalse'){
			alert('해당판매장은 주말배송이 불가하며, 금일은 주말입니다.');
		}else if(result == 'DevDayFalse'){
			alert('해당판매장은 해당요일에 배송이 불가합니다.');
		}else if(result == 'DevDayIntervalFalse'){
			alert('해당판매장은 해당기간에 배송이 불가합니다.');
		}else if(result == 'DevPriceFalse'){
			alert('최소금액 이상만 배송이 가능합니다.');
		}else if(result == 'DevFalse'){
			alert('금일 배송은 마감되었습니다.');
		}else{
            console.log("============= notice callback ========================");
            console.log(result);
            alert("배송주문요청이 완료되었습니다.");
			location.href="../mypage/my_del.html";
        }
    });
});

function getCpName(vm_cp_no){

	$.ajax({
        url:'https://www.nhhanaromart.com/back/02_app/mLeafletCpName.jsp?random=' + (Math.random()*99999), 
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

// 등록된 주소 가져오기 20200218
function getBasicAddress(){

	$.ajax({
        url:'https://www.nhhanaromart.com/back/02_app/mLeafletBasicAddress.jsp?random=' + (Math.random()*99999), 
        data : {memberNo: localStorage.getItem("memberNo")},
        method : 'GET' 
    }).done(function(result){

        console.log("CompanyName=========================================");
        if(result == ('NoN') || result == 'list error' || result == 'empty'){
            console.log(result);
        }else{
            console.log("============= notice callback ========================");
            console.log(result);
            var data = JSON.parse(result);
            
			data['CompanyName'].forEach(function(item, index){ 
				$("#address1").val(decodeURIComponent(item['address1']).replace(/\+/g,' '));
				$("#address2").val(decodeURIComponent(item['address2']).replace(/\+/g,' '));
			});
			
        }
    });
}

//장바구니 리스트 불러오기
	function cartList(rcvMemberNo) {

    $.ajax({
        url:'https://www.nhhanaromart.com/back/02_app/mLeafletCart.jsp?random=' + (Math.random()*99999), 
        data : {memberNo: rcvMemberNo, vm_cp_no: vm_cp_no},
        method : 'GET' 
    }).done(function(result){

		var text = "";
        console.log("noticeList=========================================");
        if(result.trim() == 'NoN' || result == 'list error' || result == 'empty'){
            console.log(result);

			text +='<div class="list_no_item">결제할 상품이 없습니다.</div>'

			$("#cartListWrap").empty();
			$("#cartListWrap").append(text);
        }else{
            console.log("============= notice callback ========================");
            console.log(result);
            var data = JSON.parse(result);
			var price_tot = 0;

            data['PdContentList'].forEach(function(item, index){    

				if ( item['jang_cnt'] == 0 )
				{
				}else{

					text += '<div class="figure figure3">';
					text += '	<div class="thumb_wrap">';
					text += '		   <a href="#">';
					text += '        	<img src="https://www.nhhanaromart.com'+item['img_path']+'" alt="'+item['pd_name']+'">';
					text += '       	</a>';
					text += '	   <div class="thumb_info">';
					text += '			<div class="add_btn"><span class="cart_count">'+item['jang_cnt']+'</span></div>';
					text += '	</div>';
					text += '	<div class="product_detail">';
					text += '			<a href="#" class="product">'+item['pd_name']+'</a>';
					text += '			<a href="#" class="price">'+comma(item['price'])+'</a>'; //2020-05-07 원 삭제 - 미솔
					text += '	</div>';
					text += '</div>';
                    text += '</div>';

				}

				price_tot = Number(price_tot) + (Number(item['price']) * Number(item['jang_cnt']));
            });

			$("#total_price").empty();
			$("#total_price").append(comma(price_tot));
		
			$("#cartListWrap").empty();
			$("#cartListWrap").append(text);

        }
    });
}

/* 배송가능지역 select 20191229*/
	function deliveryAreaSelect() {

    $.ajax({
        url:'https://www.nhhanaromart.com/back/02_app/mLeafletDelivery.jsp?random=' + (Math.random()*99999), 
        data : {vm_cp_no: vm_cp_no},
        method : 'GET' 
    }).done(function(result){

        console.log("noticeList=========================================");
        if(result.trim() == 'NoN' || result == 'list error' || result == 'empty'){
            console.log(result);

			$("#deliveyArea").empty();
			$("#deliveyArea").append("※배송가능지역이 없습니다.");
        }else{
            console.log("============= notice callback ========================");
            console.log(result);
            var data = JSON.parse(result);
			var price_tot = 0;

            data['PdContentList'].forEach(function(item, index){    

				$("#deliveyArea").empty();
				$("#deliveyArea").append("※배송가능지역은 "+item['dong_list']+" 입니다.");

            });
        }
    });
}

/* 배송회차 select 20191229*/
	function deliveryRound() {

    $.ajax({
        url:'https://www.nhhanaromart.com/back/02_app/mLeafletDeliveryRound.jsp?random=' + (Math.random()*99999), 
        data : {vm_cp_no: vm_cp_no},
        method : 'GET' 
    }).done(function(result){

        console.log("noticeList=========================================");
        if(result.trim() == 'NoN' || result == 'list error' || result == 'empty'){
            console.log(result);

			$("#del_time_select").empty();
        }else{
            console.log("============= notice callback ========================");
            console.log(result);
            var data = JSON.parse(result);
			var text = '<option value="0">선택</option>';

            data['PdContentList'].forEach(function(item, index){    

				index_order = Number(index)+1;
				text += '<option value="'+item['round_id']+'">'+index_order+'회차('+timeComma(item['delivery_start_time'])+' ~ '+timeComma(item['delivery_end_time'])+')</option>';

            });
			
			$("#del_time_select").empty();
			$("#del_time_select").append(text);
		}
    });
}