$(function(){
  var isInIFrame = ( window.location != window.parent.location );
  $(".add_btn").bind('click',function(){
    if (isInIFrame == true) {
      var clickN = $(".add_btn").index($(this))
      $(this).toggleClass("active");
      // $(".add_btn").attr('data-num',clickN);
    }
  })
})