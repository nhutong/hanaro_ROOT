<%@ page contentType = "text/html;charset=utf-8" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="java.util.*" %>
<%@ page import="org.json.simple.*" %>
<%@ page import="java.sql.*" %>
<%@ page import="java.text.*" %>
<%@ page import="java.io.File,java.util.Date"%>
<%@ page import="java.io.FileInputStream"%>
<%@ page import="org.apache.poi.hssf.usermodel.HSSFCell"%>
<%@ page import="org.apache.poi.hssf.usermodel.HSSFRow"%>
<%@ page import="org.apache.poi.hssf.usermodel.HSSFSheet"%>
<%@ page import="org.apache.poi.hssf.usermodel.HSSFWorkbook"%>
<%@ page import="org.apache.poi.poifs.filesystem.POIFSFileSystem"%>
<%@ page import="org.apache.poi.ss.usermodel.Cell"%>
<%@ page import="org.apache.poi.ss.usermodel.DateUtil"%>
<%@ page import="org.apache.poi.ss.usermodel.Row"%>

<%@ include file = "../00_include/dbConn.jsp" %>
<%@ include file = "../00_include/common.jsp" %>

<%
	String menu_no = (request.getParameter("menu_no")==null)? "0":request.getParameter("menu_no");
	String userCompanyNo = (request.getParameter("userCompanyNo")==null)? "0":request.getParameter("userCompanyNo");
	String jundan_from_date = (request.getParameter("jundan_from_date")==null)? "0":request.getParameter("jundan_from_date");
	String jundan_end_date = (request.getParameter("jundan_end_date")==null)? "0":request.getParameter("jundan_end_date");
	String excel_path = (request.getParameter("excel_path")==null)? "0":request.getParameter("excel_path");
	excel_path = excel_path.trim();
	String menu_type_cd = (request.getParameter("menu_type_cd")==null)? "0":request.getParameter("menu_type_cd");
	menu_type_cd = menu_type_cd.trim();

    Integer new_jd_no = 0;
	String e_msg = "";
	try{

		/* (기간전단)전단기간의 중복여부를 검증, (특가전단)상품append형식이라 Dup처리 없음 */
		if ( menu_type_cd.equals("MENU1") || menu_type_cd.equals("MENU2") || menu_type_cd.equals("MENU3") ){

			// 입력받은 전단기간이 현재 진행중인 전단행사인지 확인한다.
			sql = " SELECT CONCAT('번호:',jd_no,', 기간:',left(from_date,10),'~',SUBSTR(to_date,6,5)) AS jd_no "
			+" FROM vm_jundan AS a "
			+" WHERE a.ref_company_no = "+userCompanyNo
			+" and a.menu_no = '"+menu_no+"' "
			+" AND ((from_date <= '"+jundan_from_date+"' AND to_date >= '"+jundan_from_date+"') "
			+" OR (from_date <= '"+jundan_end_date+"' AND to_date >= '"+jundan_end_date+"')) "
			+" AND not (from_date = '"+jundan_from_date+"' AND to_date = '"+jundan_end_date+"') ; ";

			stmt = conn.createStatement();
			rs = stmt.executeQuery(sql);
				
			rs.last();
			int listCountInt = rs.getRow();
			// 진행중이면, 겹친다는 alert 을 화면에 전달하고 종료한다.
			if(listCountInt != 0){
				out.clear();
				out.print("Dup"+":"+rs.getString("jd_no"));
				return;
			};
			rs.beforeFirst();
		}
		e_msg = "1";
		//===============================================================================================================
        int pos = excel_path .lastIndexOf(".");
        String excel_extension = excel_path.substring(pos + 1);
        int sheetNum = 0;
        HSSFWorkbook workBook  =  new HSSFWorkbook(new FileInputStream(new File(request.getRealPath("/upload/")+excel_path)));
        HSSFSheet sheet    =  null;
        HSSFRow row     =  null;
        HSSFCell cell    =  null;
        sheetNum = workBook.getNumberOfSheets();
        Integer errCount = 0;
		// 엑셀 업로드
        sheet = workBook.getSheetAt(0);
        int rows = sheet.getPhysicalNumberOfRows();
        int col = 0;
        for(int i = 1; i < rows; i++) {
            row = sheet.getRow(i);
            e_msg += "  for(" + Integer.toString(i) + ") ";	

            // 순서
            col = 0;
            cell = row.getCell(col);
            if (cell == null) { cell = row.createCell(col); }
            //String string0 = cell.getStringCellValue().trim().replaceAll(",", "").replaceAll("'", "");
            String string0 = cell.toString().trim().replaceAll(",", "").replaceAll("'", "");

            if ( string0.equals("") ){
                //순서가 존재하지 않으므로 중단한다.
                // out.clear();
                // out.print("order_number_no_exist");
                errCount++;
                continue;
                // return;
            }else{
                string0 = strEncode(string0);
                if ( isNumeric(string0) == true ){
                    string0 = String.valueOf(Math.round(Double.parseDouble(string0)));
                }else{
                    //순서가 숫자가 아니므로 중단한다.
                    // out.clear();
                    // out.print("order_number_not_number");
                    // return;
                    errCount++;
                    continue;
                }
            }
            // 상품코드 ( encode )
            col = 1;
            cell = row.getCell(col);
            if (cell == null) { cell = row.createCell(col); }
            // String string1 = cell.getStringCellValue().trim().replaceAll(",", "").replaceAll("'", "");
            String string1 = cell.toString().trim().replaceAll(",", "").replaceAll("'", "");
            if ( string1.equals("") ){
                //상품코드를 입력하지 않았기 때문에 중단한다.
                // out.clear();
                // out.print("pd_code_no_exist");
                // return;
                errCount++;
                continue;
            }else{
                string1 = strEncode(string1);
                if ( isNumeric(string1) == true ){
                    string1 = String.valueOf(Math.round(Double.parseDouble(string1)));
                }else{
                    //상품코드가 숫자가 아니므로 중단한다.
                    // out.clear();
                    // out.print("pd_code_not_number");
                    // return;
                    errCount++;
                    continue;
                }				
            }

            // 상품명 ( encode )
            col = 2;
            cell = row.getCell(col);
            if (cell == null) { cell = row.createCell(col); }
            String string2 = cell.getStringCellValue().trim().replaceAll("'", "");
            if ( string2.equals("") ){
                //상품명을 입력하지 않았기 때문에 중단한다.
                // out.clear();
                // out.print("pd_name_no_exist");
                // return;
                errCount++;
                continue;
            }else{
                string2 = strEncode(string2);                    
            }

            // 규격(내용량)
            col = 3;
            cell = row.getCell(col);
            if (cell == null) { cell = row.createCell(col); }
            String string15 = cell.getStringCellValue().trim().replaceAll("'", "");
            string15 = strEncode(string15);		
            
            //앱 전단 상품명에 규격을 추가 한 뒤 아래 내용 삭제 필요 - 20200519-김대윤
            string2 = string2 + string15;

            // 판매가
            col = 4;
            cell = row.getCell(col);
            if (cell == null) { cell = row.createCell(col); }
            // String string3 = cell.getStringCellValue().trim().replaceAll(",", "").replaceAll("'", "");
            String string3 = cell.toString().trim().replaceAll(",", "").replaceAll("'", "");
            if ( string3.equals("") ){
                //판매가 존재하지 않으므로 중단한다.
                // out.clear();
                // out.print("price_no_exist");
                // return;
                errCount++;
                continue;
            }else{
                string3 = strEncode(string3);
                if ( isNumeric(string3) == true ){
                    string3 = String.valueOf(Math.round(Double.parseDouble(string3)));
                }else{
                    //판매가가 숫자가 아니므로 중단한다.
                    // out.clear();
                    // out.print("price_not_number");
                    // return;
                    errCount++;
                    continue;
                }
            }

            // 카드할인
            col = 7;
            cell = row.getCell(col);
            if (cell == null) { cell = row.createCell(col); }
            // String string4 = cell.getStringCellValue().trim().replaceAll(",", "").replaceAll("'", "");
            String string4 = cell.toString().trim().replaceAll(",", "").replaceAll("'", "");
            if ( string4.equals("") ){
            }else{
                string4 = strEncode(string4);
                if ( isNumeric(string4) == true ){
                    string4 = String.valueOf(Math.round(Double.parseDouble(string4)));
                }else{
                    //카드할인이 숫자가 아니므로 중단한다.
                    // out.clear();
                    // out.print("card_discount_not_number");
                    // return;
                    errCount++;
                    continue;
                }
            }
            // 카드시작일
            col = 5;
            cell = row.getCell(col);                                
            if (cell == null) { cell = row.createCell(col); }
            //String string5 = cell.getStringCellValue().trim();
            String string5 = "";
            if (cell.getCellType().toString() == "STRING") {
                string5 = cell.getStringCellValue().trim().replaceAll(",", "").replaceAll("'", "");
            } else if (cell.getCellType().toString() == "NUMERIC") {
                string5 = cell.toString().trim().replaceAll(",", "").replaceAll("'", "");
                string5 = String.valueOf(Math.round(Double.parseDouble(string5))); 
            } else if (cell.getCellType().toString() == "BLANK") {
                string5 = "";
            }     
            
            if ( string5.equals("") ){
                string5 = "null";
            }else{
                // 입력받은 카드시작일이 유효한지 검사한다.
                sql = " SELECT id "
                +" FROM time_dimension WHERE db_date = '"+string5+"'";

                stmt = conn.createStatement();
                rs = stmt.executeQuery(sql);
                    
                rs.last();
                int listCountInt_cardStartDate = rs.getRow();
                if(listCountInt_cardStartDate == 0){
                    // out.clear();
                    // out.print("card_discount_from_date_type_error");
                    // return;
                    errCount++;
                    continue;
                };
                rs.beforeFirst();
            }

            // 카드종료일
            col = 6;
            cell = row.getCell(col);
            if (cell == null) { cell = row.createCell(col); }
            //String string6 = cell.getStringCellValue().trim();      
            String string6 = "";
            if (cell.getCellType().toString() == "STRING") {
                string6 = cell.getStringCellValue().trim().replaceAll(",", "").replaceAll("'", "");
            } else if (cell.getCellType().toString() == "NUMERIC") {
                string6 = cell.toString().trim().replaceAll(",", "").replaceAll("'", "");
                string6 = String.valueOf(Math.round(Double.parseDouble(string6))); 
            } else if (cell.getCellType().toString() == "BLANK") {
                string6 = "";
            }

            if ( string6.equals("") ){
                string6 = "null";
            }else{
                // 입력받은 카드시작일이 유효한지 검사한다.
                sql = " SELECT id "
                +" FROM time_dimension WHERE db_date = '"+string6+"'";

                stmt = conn.createStatement();
                rs = stmt.executeQuery(sql);
                    
                rs.last();
                int listCountInt_cardEndDate = rs.getRow();
                if(listCountInt_cardEndDate == 0){
                    // out.clear();
                    // out.print("card_discount_end_date_type_error");
                    // return;
                    errCount++;
                    continue;
                };
                rs.beforeFirst();
            }
            // 카드정보
            col = 8;
            cell = row.getCell(col);
            if (cell == null) { cell = row.createCell(col); }
            String string7 = cell.getStringCellValue().trim().replaceAll("'", "");
            string7 = strEncode(string7);

            // 카드한정
            col = 9;
            cell = row.getCell(col);
            if (cell == null) { cell = row.createCell(col); }
            String string8 = cell.getStringCellValue().trim().replaceAll("'", "");
            string8 = strEncode(string8);

            // 쿠폰할인
            col = 10;
            cell = row.getCell(col);
            if (cell == null) { cell = row.createCell(col); }
            //String string9 = cell.getStringCellValue().trim().replaceAll(",", "").replaceAll("'", "");
            String string9 = cell.toString().trim().replaceAll(",", "").replaceAll("'", "");
            if ( string9.equals("") ){
            }else{
                string9 = strEncode(string9);
                if ( isNumeric(string9) == true ){
                    string9 = String.valueOf(Math.round(Double.parseDouble(string9)));
                }else{
                    //쿠폰할인이 숫자가 아니므로 중단한다.
                    // out.clear();
                    // out.print("coupon_discount_not_number");
                    // return;
                    errCount++;
                    continue;
                }
            }

            // 다다익선
            col = 11;
            cell = row.getCell(col);
            if (cell == null) { cell = row.createCell(col); }
            String string10 = cell.getStringCellValue().trim().replaceAll("'", "");
            string10 = strEncode(string10);

            // 다다익선정보
            col = 12;
            cell = row.getCell(col);
            if (cell == null) { cell = row.createCell(col); }
            String string11 = cell.getStringCellValue().trim().replaceAll("'", "");
            string11 = strEncode(string11);

            // 기타정보
            col = 13;
            cell = row.getCell(col);
            if (cell == null) { cell = row.createCell(col); }
            String string12 = cell.getStringCellValue().trim().replaceAll("'", "");
            string12 = strEncode(string12);

            String string13 = "";
            String string14 = "";
            if ( menu_type_cd.equals("MENU1") || menu_type_cd.equals("MENU2") || menu_type_cd.equals("MENU3") ){
                string13 = "null";
                string14 = "null";
            }else{

                // 특가행사시작일
                col = 14;
                cell = row.getCell(col);
                if (cell == null) { cell = row.createCell(col); }
                string13 = cell.getStringCellValue().trim();
                if ( string13.equals("") ){
                    // 특가행사시작일이 존재하지 않으므로 중단한다.
                    // out.clear();
                    // out.print("oneDay_start_date_no_exist");
                    // return;
                    errCount++;
                    continue;
                }else{
                    // 입력받은 특가행사시작일이 유효한지 검사한다.
                    sql = " SELECT id "
                    +" FROM time_dimension WHERE db_date = '"+string13+"'";

                    stmt = conn.createStatement();
                    rs = stmt.executeQuery(sql);
                        
                    rs.last();
                    int listCountInt_cardStartDate = rs.getRow();
                    if(listCountInt_cardStartDate == 0){
                        // out.clear();
                        // out.print("oneDay_start_date_type_error");
                        // return;
                        errCount++;
                        continue;
                    };
                    rs.beforeFirst();
                }

                // 특가행사종료일
                col = 15;
                cell = row.getCell(col);
                if (cell == null) { cell = row.createCell(col); }
                string14 = cell.getStringCellValue().trim();
                if ( string14.equals("") ){
                    // 특가행사종료일이 존재하지 않으므로 중단한다.
                    // out.clear();
                    // out.print("oneDay_end_date_no_exist");
                    // return;
                    errCount++;
                    continue;
                }else{
                    // 입력받은 특가행사종료일이 유효한지 검사한다.
                    sql = " SELECT id "
                    +" FROM time_dimension WHERE db_date = '"+string14+"'";

                    stmt = conn.createStatement();
                    rs = stmt.executeQuery(sql);
                        
                    rs.last();
                    int listCountInt_cardStartDate = rs.getRow();
                    if(listCountInt_cardStartDate == 0){
                        // out.clear();
                        // out.print("oneDay_end_date_type_error");
                        // return;
                        errCount++;
                        continue;
                    };
                    rs.beforeFirst();

                }
            }

            //========================================================================================
            //입력정보 끝================================================================================
            //========================================================================================

            // 신규입력한 전단상품의 상품번호(내부용)를 select 한다.
            sql = " select pd_no from vm_product "
                + " where pd_code = '"+string1+"'; ";

            stmt = conn.createStatement();
            rs = stmt.executeQuery(sql);
            
            rs.last();

            //pd_no, img_no가 없어도 vm_jundan_prod_content에 insert함!
            //int listCount = rs.getRow();
            //if(listCount == 0){
            //	out.clear();
            //	out.print("NoNPdNo");
            //	return;
            //};

            rs.beforeFirst();
            String pd_no = "";		
            while(rs.next()){
                // 신규 상품번호(내부용)
                pd_no = rs.getString("pd_no");	
            }
            if (pd_no.equals("")){
                pd_no = "";
            }else{
            }
                
            // 신규입력한 전단상품에 매핑할 이미지번호를 select 한다.(상품별 여러 이미지중, 가장 최근에 등록된 이미지를 매핑한다.)
            String img_no = "";
            if (pd_no.equals("")){
                img_no = "";	
            }else{
                /* 2020-02-21 이미지중에 전사 표준이미지 조건을 추가함 */
                //sql = " SELECT img_no from vm_product_image WHERE ref_pd_no = "+pd_no+" and std_fg = 'Y' ORDER BY reg_date DESC LIMIT 0,1 ; ";
                sql =    " SELECT h.img_no "
                        +" FROM ( "
                        +"     SELECT 1 as sq, a.img_no, a.reg_date "
                        +"     from vm_product_image a "
                        +"     WHERE ref_pd_no IN ( "
                        +"         SELECT pd_no "
                        +"         FROM vm_product "
                        +"         WHERE GROUP_tag IN ( "
                        +" 		       SELECT group_tag "
                        +"             FROM vm_product "
                        +"             WHERE pd_no = "+pd_no
                        +"               AND LENGTH(IFNULL(group_tag,'')) >= 2 "
                        +"         ) "
                        +"     ) "
                        +"     and std_fg = 'Y' "
                        +"     union all "
                        +"     SELECT 2 as sq, g.img_no, g.reg_date "
                        +"     from vm_product_image g "
                        +"     WHERE ref_pd_no = "+pd_no
                        +"     and std_fg = 'Y' "
                        +" ) AS h "
                        +" ORDER BY sq, reg_date DESC LIMIT 0,1; ";

                stmt = conn.createStatement();
                rs = stmt.executeQuery(sql);
        
                rs.last();
                rs.beforeFirst();		
        
                while(rs.next()){
                    // 신규 상품에 매핑될 이미지 번호
                    img_no = rs.getString("img_no");	
                }
                if (img_no.equals("")){
                    img_no = "";
                }else{
                }
            }

            //순서가 없으면 어떤 작업도 하지 않는다.
            if(string0 == ""){

            }else{

                // 기간형 전단
                if ( menu_type_cd.equals("MENU1") || menu_type_cd.equals("MENU2") || menu_type_cd.equals("MENU3") ){

                    e_msg = "2(기간형 전단 insert)" + Integer.toString(i);					

                    // 신규전단번호 생성, 두번째 부터는 재활용
                    sql = " SELECT jd_no "
                    +" FROM vm_jundan AS a "
                    +" WHERE a.ref_company_no = "+userCompanyNo
                    +" and a.menu_no = '"+menu_no+"' "
                    +" AND from_date = '"+jundan_from_date+"' "
                    +" AND to_date = '"+jundan_end_date+"' ;";
            
                    

                    stmt = conn.createStatement();
                    rs = stmt.executeQuery(sql);
                            
                    rs.last();
                    int listCountInt1 = rs.getRow();
                    
                    if(listCountInt1 == 0){ //신규 전단번호 생성
    
                        sql = "insert into vm_jundan (ref_company_no, from_date, to_date, menu_no) "
                        +" values( "
                        +"'"+userCompanyNo+"', '"+jundan_from_date+"', '"+jundan_end_date+"', '"+menu_no
                        +"');";						

                        pstmt = conn.prepareStatement(sql);
                        pstmt.executeUpdate();
                
                        sql = " select max(jd_no) as new_jd_no from vm_jundan ";
                
                        stmt = conn.createStatement();
                        rs = stmt.executeQuery(sql);
                                
                        rs.last();
                        int listCount10 = rs.getRow();
                        if(listCount10 == 0){
                            // out.clear();
                            // out.print("NoN0_Type1");
                            // return;
                            errCount++;
                            continue;
                        };
                        rs.beforeFirst();	
                        
                        while(rs.next()){
                            new_jd_no = rs.getInt("new_jd_no");     // 신규 전단번호
                        }
                    
                    }else{  //기존 전단번호 재활용
                        rs.beforeFirst();					
                        while(rs.next()){
                            new_jd_no = rs.getInt("jd_no");     //  기존 전단번호
                        }
                    }

                    //vm_jundan_prod_content가 중복인지 확인한다
                    sql = " SELECT jd_prod_con_no "
                    +" FROM vm_jundan_prod_content AS a "
                    +" WHERE a.ref_jd_no = "+new_jd_no
                    +" and a.pd_code = '"+string1+"' ;";

                    stmt = conn.createStatement();
                    rs = stmt.executeQuery(sql);
                            
                    rs.last();
                    int listCountInt4 = rs.getRow();
                    
                    if(listCountInt4 == 0){ //신규생성
                        // 전달받은 정보를 바탕으로 전단상품을 insert 한다.
                        sql = "insert into vm_jundan_prod_content (ref_jd_no, order_number, ref_pd_no, ref_img_no, pd_name, price, card_discount, card_discount_from_date, card_discount_end_date, "
                            +" card_info, card_restrict, coupon_discount, dadaiksun, dadaiksun_info, etc, oneDay_start_date, oneDay_end_date, pd_code, weight ) "
                            +" values("+new_jd_no+", '"+string0+"', '"+pd_no+"', '"+img_no+"', '"+string2+"', '"+string3+"', '"+string4+"', IF("+string5+" is null,"+string5+",'"+string5+"'), IF("+string6+" is null,"+string6+", '"+string6+"'), "
                            +" '"+string7+"', '"+string8+"', '"+string9+"', '"+string10+"', '"+string11+"', '"+string12+"', IF("+string13+" is null,"+string13+",'"+string13+"'), IF("+string14+" is null,"+string14+",'"+string14+"'), '"+string1+"', '"+string15+"' ); ";
                    }else{
                        sql = "update vm_jundan_prod_content set "
                            +" order_number = '"+string0+"', ref_pd_no = '"+pd_no+"', ref_img_no = '"+img_no+"', pd_name = '"+string2+"', price = '"+string3+"', "
                            +" card_discount = '"+string4+"', card_discount_from_date = IF("+string5+" is null,"+string5+",'"+string5+"'), card_discount_end_date = IF("+string6+" is null,"+string6+",'"+string6+"'), card_info = '"+string7+"', "
                            +" card_restrict = '"+string8+"', coupon_discount = '"+string9+"', dadaiksun = '"+string10+"', dadaiksun_info = '"+string11+"', etc = '"+string12+"', "
                            +" oneDay_start_date = IF("+string13+" is null,"+string13+",'"+string13+"'), oneDay_end_date = IF("+string14+" is null,"+string14+",'"+string14+"'), pd_code = '"+string1+"', weight = '"+string15+"' "
                            +" WHERE ref_jd_no = "+new_jd_no
                            +" and pd_code = '"+string1+"' ;";
                    }

                    //e_msg += "  2(기간형 전단 insert)" + Integer.toString(i) + sql;	

                    pstmt = conn.prepareStatement(sql);
                    pstmt.executeUpdate();

                // 일자형 전단일 경우
                }else{

                    String db_date = "";

                    //e_msg += "2(일자형 전단 insert)" + Integer.toString(i);	

                    sql = " SELECT a.db_date from time_dimension AS a WHERE a.db_date >= left('"+string13+"',10) AND a.db_date <= left('"+string14+"',10) ";

                    ResultSet rs2 = null;					
                    
                    rs2 = stmt.executeQuery(sql);
                
                    rs2.last();
                    rs2.beforeFirst();	
                    
                    //e_msg += "= 일자형Start(" + string1+")" + "sql(" + sql + ") ";
                    e_msg += "=일자형Start(" + string1+")";
                
                    
                    
                    while(rs2.next()){

                        // 특가행사기준일
                        db_date = rs2.getString("db_date");

                        e_msg += ",db_date("+db_date+")";

                        jundan_from_date = db_date;
                        jundan_end_date = db_date;

                        // 신규전단번호 생성, 두번째 부터는 재활용
                        sql = " SELECT jd_no as jd_no "
                        +" FROM vm_jundan AS a "
                        +" WHERE a.ref_company_no = '"+userCompanyNo+"' "
                        +" and a.menu_no = '"+menu_no+"' "
                        +" AND from_date = '"+jundan_from_date+"' "
                        +" AND to_date = '"+jundan_end_date+"' ;";
                
                        stmt = conn.createStatement();
                        rs = stmt.executeQuery(sql);
                                
                        rs.last();

                        int listCountInt3 = rs.getRow();

                        //e_msg += "=("+sql+","+listCountInt3+"), ";
                        
                        if(listCountInt3 == 0){ //신규 전단번호 생성		
                            sql = "insert into vm_jundan (ref_company_no, from_date, to_date, menu_no) "
                            +" values( "
                            +"'"+userCompanyNo+"', '"+jundan_from_date+"', '"+jundan_end_date+"', '"+menu_no
                            +"');";

                            e_msg += ",(insert)";
                    
                            pstmt = conn.prepareStatement(sql);
                            pstmt.executeUpdate();
                    
                            sql = " select max(jd_no) as new_jd_no from vm_jundan ";
                    
                            stmt = conn.createStatement();
                            rs = stmt.executeQuery(sql);
                                    
                            rs.last();
                            int listCount30 = rs.getRow();
                            if(listCount30 == 0){
                                out.clear();
                                out.print("NoN0_Type2");
                                return;
                            };
                            rs.beforeFirst();	
                            
                            while(rs.next()){
                                new_jd_no = rs.getInt("new_jd_no");     // 신규 전단번호
                            }
                        
                        }else{  //기존 전단번호 재활용
                            e_msg += ",(reuse)";
                            rs.beforeFirst();					
                            while(rs.next()){
                                new_jd_no = rs.getInt("jd_no");     //  기존 전단번호
                            }
                        }

                        //vm_jundan_prod_content가 중복인지 확인한다
                        sql = " SELECT jd_prod_con_no "
                        +" FROM vm_jundan_prod_content AS a "
                        +" WHERE a.ref_jd_no = "+new_jd_no
                        +" and a.pd_code = '"+string1+"' ;";

                        stmt = conn.createStatement();
                        rs = stmt.executeQuery(sql);
                                
                        rs.last();
                        int listCountInt4 = rs.getRow();
                        
                        if(listCountInt4 == 0){ //신규생성
                            // 전달받은 정보를 바탕으로 전단상품을 insert 한다.
                            sql = "insert into vm_jundan_prod_content (ref_jd_no, order_number, ref_pd_no, ref_img_no, pd_name, price, card_discount, card_discount_from_date, card_discount_end_date, "
                                +" card_info, card_restrict, coupon_discount, dadaiksun, dadaiksun_info, etc, oneDay_start_date, oneDay_end_date, pd_code ) "
                                +" values("+new_jd_no+", '"+string0+"', '"+pd_no+"', '"+img_no+"', '"+string2+"', '"+string3+"', '"+string4+"', IF("+string5+" is null,"+string5+",'"+string5+"'), IF("+string6+" is null,"+string6+", '"+string6+"'), "
                                +" '"+string7+"', '"+string8+"', '"+string9+"', '"+string10+"', '"+string11+"', '"+string12+"', IF("+db_date+" is null,"+db_date+",'"+db_date+"'), IF("+db_date+" is null,"+db_date+",'"+db_date+"'), '"+string1+"' );";
                        }else{
                            sql = "update vm_jundan_prod_content set "
                                +" order_number = '"+string0+"', ref_pd_no = '"+pd_no+"', ref_img_no = '"+img_no+"', pd_name = '"+string2+"', price = '"+string3+"', "
                                +" card_discount = '"+string4+"', card_discount_from_date = IF("+string5+" is null,"+string5+",'"+string5+"'), card_discount_end_date = IF("+string6+" is null,"+string6+",'"+string6+"'), card_info = '"+string7+"', "
                                +" card_restrict = '"+string8+"', coupon_discount = '"+string9+"', dadaiksun = '"+string10+"', dadaiksun_info = '"+string11+"', etc = '"+string12+"', "
                                +" oneDay_start_date = IF("+db_date+" is null,"+db_date+",'"+db_date+"'), oneDay_end_date = IF("+db_date+" is null,"+db_date+",'"+db_date+"'), pd_code = '"+string1+"' "
                                +" WHERE ref_jd_no = "+new_jd_no
                                +" and pd_code = '"+string1+"' ;";
                        }

                        //e_msg += "=("+sql+"), ";

                        //e_msg += "2(일자형 전단 insert)" + Integer.toString(i) + sql;	
        
                        pstmt = conn.prepareStatement(sql);
                        pstmt.executeUpdate();
                                                
                    //while루프 종료	
                    }
                // 일자형 전단일 분기 끝
                }				
            // 순서여부 분기끝
            }
        // 엑셀 row 루프끝	
        }
        /* 엑셀메모리를 close 한다. */
        // workbook.close();
        
        out.clear();
        //out.print("success msg"+":"+e_msg);
        out.print("success:"+errCount);

	}catch(Exception e){
		out.clear();
		out.print("exception error"+":("+e.getMessage()+")"+e_msg);	
	}finally{
		if(pstmt != null) try{ pstmt.close(); }catch(SQLException sqle) {}
		if(stmt != null) try{ stmt.close(); }catch(SQLException sqle) {}		
		if(conn != null) try{ conn.close(); }catch(SQLException sqle) {}
	};

%>