if( localStorage.getItem("pw") == "asdf12345" || isapp() ){
    //header
    function home(){window.location.href="../home/main.html"} // 홈
    function m_leaflet(){window.location.href="../m_leaflet/m_leaflet.html"} // 전단행사
    function shop(){window.location.href="../shop/shop.html"} // 전단행사
    function search(){window.location.href="../home/search.html"} // 검색
    function cart(){window.location.href="../cart/cart.html"} // 장바구니
    function cart_submit(){window.location.href="../cart/cart_submit.html"} // 장바구니
    function my_info(){window.location.href="../mypage/my_info.html"} // 나의정보
    function my_coupon(){window.location.href="../mypage/my_coupon.html"} // 나의쿠폰
    function my_del(){window.location.href="../mypage/my_del.html"} // 배송
    function my_stamp(){window.location.href="../mypage/stamp.html"} // 스탬프
    function login(){window.location.href="../login/login.html"} // 로그인
    function setting(){window.location.href="../home/setting.html"} // 세팅
    function tos(){window.location.href="../home/tos.html"} // 이용약관
    function notice(){window.location.href="../home/notice.html"} // 공지사항
    function qna(){window.location.href="../home/qna.html"}//1:1문의
    function qna_create(){window.location.href="../home/qna_create.html"}//1:1문의_새글
    function zzim(){window.location.href="../home/zzim.html"}//찜하기

    /* 20200103 수정 */
    function qna_detail(ntNo){window.location.href="../home/qna_detail.html?nt_no="+ntNo}//1:1문의_세부

    function push(){window.location.href="../home/push.html"}//푸시알림
    function offline(){window.location.href="../home/offline.html"}//매장찾기
    function coupon(){window.location.href="../home/coupon.html"}//쿠폰
    function events(){window.location.href="../home/event.html"}//이벤트
}else{
    //header
    function home(){window.location.href="../home/main.html"} // 홈
    function m_leaflet(){window.location.href="../m_leaflet/m_leaflet.html"} // 전단행사
    function shop(){alert('모바일앱에서만 이용 가능합니다.');} // 전단행사
    function search(){window.location.href="../home/search.html"} // 검색
    function cart(){alert('모바일앱에서만 이용 가능합니다.');} // 장바구니
    function cart_submit(){alert('모바일앱에서만 이용 가능합니다.');} // 장바구니
    function my_info(){alert('모바일앱에서만 이용 가능합니다.');} // 나의정보
    function my_coupon(){alert('모바일앱에서만 이용 가능합니다.');} // 나의쿠폰
    function my_del(){alert('모바일앱에서만 이용 가능합니다.');} // 배송
    function my_stamp(){alert('모바일앱에서만 이용 가능합니다.');} // 스탬프
    function login(){alert('모바일앱에서만 이용 가능합니다.');} // 로그인
    function setting(){alert('모바일앱에서만 이용 가능합니다.');} // 세팅
    function tos(){alert('모바일앱에서만 이용 가능합니다.');} // 이용약관
    function notice(){window.location.href="../home/notice.html"} // 공지사항
    function qna(){alert('모바일앱에서만 이용 가능합니다.');}//1:1문의
    function qna_create(){alert('모바일앱에서만 이용 가능합니다.');}//1:1문의_새글
    function zzim(){alert('모바일앱에서만 이용 가능합니다.');}//찜하기

    /* 20200103 수정 */
    function qna_detail(){alert('모바일앱에서만 이용 가능합니다.');}//1:1문의_세부

    function push(){alert('모바일앱에서만 이용 가능합니다.');}//푸시알림
    // 2020.05.22 심규문 매장변경 활성화
    //function offline(){alert('모바일앱에서만 이용 가능합니다.');}//매장찾기
    function offline(){window.location.href="../home/offline.html"}//매장찾기

    //function coupon(){window.location.href="../home/coupon.html"}//쿠폰
    function coupon(){alert('모바일앱에서만 이용 가능합니다.');}//쿠폰

    function events(){window.location.href="../home/event.html"}//이벤트
}