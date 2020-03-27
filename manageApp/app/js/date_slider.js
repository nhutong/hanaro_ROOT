function date_slider(initNum){ 

	_width = $('.date_item_wrap').width();
    _height = $('.date_item_wrap').attr("data-height");
    _count = $('.date_item_wrap .date_item').length;
          
    $('.date_item_wrap').css({width: _width, height: _height}).find(".title_anibox").css({width: _count * _width, height: _height}).find(".date_item").css({width: _width, height: _height});           
    var currentPage = 0;

	startPage(initNum);
	currentPage = sessionStorage.getItem("currentPage");
	
	var changePage = function(){  
		$(".date_item_wrap > .title_anibox").animate({
			left: -currentPage * _width
		});
    }
	


    $(".btn_rgt").click(function(){  

        if(currentPage < _count-1){
            currentPage = Number(currentPage) + 1;
            changePage();
			new_jd_no = getCookie("curJd"+currentPage);
			setCookie1("jd_no",new_jd_no,1);
			getPdContent(new_jd_no);
			getBanner(new_jd_no);
			setTimeout(function(){ clickEventApp(); }, 1000);
//			parent.getPdOrder();
			
			var isInIFrame = ( window.location != window.parent.location );
			if (isInIFrame == true)
			{
				parent.getPdOrder();
			}else{
			}

        }           
    })
                
    $(".btn_lft").click(function(){    
		
        if(currentPage > 0){
            currentPage = Number(currentPage) - 1;
            changePage();
			new_jd_no = getCookie("curJd"+currentPage);
			setCookie1("jd_no",new_jd_no,1);
			getPdContent(new_jd_no);
			getBanner(new_jd_no);
			setTimeout(function(){ clickEventApp(); }, 1000);
//			parent.getPdOrder();

			var isInIFrame2 = ( window.location != window.parent.location );
			if (isInIFrame2 == true)
			{
				parent.getPdOrder();
			}else{
			}

        }            
    }) 

}

//전단슬라이드를 전달받은 숫자로 이동힌다. ( 0부터 시작 )
function startPage(startNum){
	var currentPage = 0;
	currentPage = Number(currentPage) + Number(startNum);
	$(".date_item_wrap > .title_anibox").animate({
		left: -currentPage * _width
	});
	sessionStorage.setItem("currentPage",currentPage);
   }