var memberNo = !!localStorage.getItem("memberNo");

function home(){window.location.href="../home/main.html"; return;} // 홈
function m_leaflet(){window.location.href="../m_leaflet/m_leaflet.html"} // 전단행사
function shop(){window.location.href="../shop/shop.html"} // 전단행사
function search(){window.location.href="../home/search.html"} // 검색
function notice(){window.location.href="../home/notice.html"} // 공지사항
function offline(){window.location.href="../home/offline.html"}//매장찾기
function events(){window.location.href="../home/event.html"}//이벤트

function cart(){           if(memberNo)window.location.href="../cart/cart.html";                   else LayerPopup.alert('모바일앱에서만 이용 가능합니다.'); } // 장바구니
function cart_submit(){    if(memberNo)window.location.href="../cart/cart_submit.html";            else LayerPopup.alert('모바일앱에서만 이용 가능합니다.'); } // 장바구니
function my_info(){        if(memberNo)window.location.href="../mypage/my_info.html";              else LayerPopup.alert('모바일앱에서만 이용 가능합니다.'); } // 나의정보
function my_coupon(){      if(memberNo)window.location.href="../mypage/my_coupon.html";            else LayerPopup.alert('모바일앱에서만 이용 가능합니다.'); } // 나의쿠폰
function my_del(){         if(memberNo)window.location.href="../mypage/my_del.html";               else LayerPopup.alert('모바일앱에서만 이용 가능합니다.'); } // 배송
function my_stamp(){       if(memberNo)window.location.href="../mypage/stamp.html";                else LayerPopup.alert('모바일앱에서만 이용 가능합니다.'); } // 스탬프
function login(){          if(memberNo)window.location.href="../login/login.html";                 else LayerPopup.alert('모바일앱에서만 이용 가능합니다.'); } // 로그인
function setting(){        if(memberNo)window.location.href="../home/setting.html";                else LayerPopup.alert('모바일앱에서만 이용 가능합니다.'); } // 세팅
function tos(){            if(memberNo)window.location.href="../home/tos.html";                    else LayerPopup.alert('모바일앱에서만 이용 가능합니다.'); } // 이용약관
function qna(){            if(memberNo)window.location.href="../home/qna.html";                    else LayerPopup.alert('모바일앱에서만 이용 가능합니다.'); }//1:1문의
function qna_create(){     if(memberNo)window.location.href="../home/qna_create.html";             else LayerPopup.alert('모바일앱에서만 이용 가능합니다.'); }//1:1문의_새글
function zzim(){           if(memberNo)window.location.href="../home/zzim.html";                   else LayerPopup.alert('모바일앱에서만 이용 가능합니다.'); }//찜하기
function qna_detail(ntNo){ if(memberNo)window.location.href="../home/qna_detail.html?nt_no="+ntNo; else LayerPopup.alert('모바일앱에서만 이용 가능합니다.'); }//1:1문의_세부
function push(){           if(memberNo)window.location.href="../home/push.html";                   else LayerPopup.alert('모바일앱에서만 이용 가능합니다.'); }//푸시알림
function coupon(){         if(memberNo)window.location.href="../home/coupon.html";                 else LayerPopup.alert('모바일앱에서만 이용 가능합니다.'); }//쿠폰