$(function () {

//  var Result = getParameterByName('Test'); // 결과 : 111

	getHeader();
    $(".nav_delivery").addClass("active");

	getLeft();
	getLeftMenu('delivery');
	$("#nh_delivery_manage_order").addClass("active");
	
   
});

function order_popup(){
   window.open('order_popup.html','주문관리','width=640,height=640,location=no,status=no,scrollbars=yes,left=300,top=300')  
}
