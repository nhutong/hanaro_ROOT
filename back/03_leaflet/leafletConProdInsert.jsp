<%@ page contentType = "text/html;charset=utf-8" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="java.util.*" %>
<%@ page import="org.json.simple.*" %>
<%@ page import="java.sql.*" %>
<%@ page import="java.text.*" %>
<%@ page import="java.io.File,java.util.Date,jxl.*"%>

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

	try{

		/* 기간형 전단일경우, 전단기간의 중복여부를 검증하고, 임시테이블을 통해 신규로 입력할 전단 1개의 마스터키를 생성한다. */
		if ( menu_type_cd.equals("MENU1") || menu_type_cd.equals("MENU2") || menu_type_cd.equals("MENU3") ){

			// 입력받은 전단기간이 현재 진행중인 전단행사인지 확인한다.
			sql = " SELECT jd_no "
			+" FROM vm_jundan AS a "
			+" WHERE a.ref_company_no = "+userCompanyNo
			+" and a.menu_no = '"+menu_no+"' "
			+" AND ((from_date <= '"+jundan_from_date+"' AND to_date >= '"+jundan_from_date+"') "
			+" OR (from_date <= '"+jundan_end_date+"' AND to_date >= '"+jundan_end_date+"')); ";

			stmt = conn.createStatement();
			rs = stmt.executeQuery(sql);
				
			rs.last();
			int listCountInt = rs.getRow();
			// 진행중이면, 겹친다는 alert 을 화면에 전달하고 종료한다.
			if(listCountInt != 0){
				out.clear();
				out.print("Dup");
				return;
			};
			rs.beforeFirst();
		}

		// 전달받은 정보를 바탕으로 전단마스터를 temp 테이블에 insert 한다.
		/* (특가형전단일경우, from, to 일자를 2020-01-01 로 입력한다.) */
		sql = "insert into vm_jundan_temp (ref_company_no, from_date, to_date, menu_no) "
		+" values( "
		+"'"+userCompanyNo+"', '"+jundan_from_date+"', '"+jundan_end_date+"', '"+menu_no
		+"');";

		pstmt = conn.prepareStatement(sql);
		pstmt.executeUpdate();

		// 신규입력한 전단상품의 전단번호를 temp 테이블에서 select 한다.
		/* 특가형전단일경우, 일단 임시로 하나의 전단을 만든다. 후반부 여러개의 전단이 일자만큼 생성된다. */
		sql = " select max(jd_no) as new_jd_no from vm_jundan_temp ";

		stmt = conn.createStatement();
		rs = stmt.executeQuery(sql);
				
		rs.last();
		int listCount0 = rs.getRow();
		if(listCount0 == 0){
			out.clear();
			out.print("NoN0");
			return;
		};
		rs.beforeFirst();	
		
		Integer new_jd_no = 0;
		while(rs.next()){
			new_jd_no = rs.getInt("new_jd_no");     // 신규 전단번호
		}
		

		//===============================================================================================================
		

		// 엑셀 업로드
		//Workbook workbook = Workbook.getWorkbook(new File("D:/Tomcat 8.5/webapps/ROOT/upload/"+excel_path)); //0326김수경수정
		Workbook workbook = Workbook.getWorkbook(new File(request.getRealPath("/upload/")+excel_path)); 
	
		//System.out.println("aaa");

		Sheet sheet = workbook.getSheet(0);
		int row = sheet.getRows();
		int col = 0;
		Cell cell;

		for(int i = 1; i < row; i++) {

			// 순서
		    col = 0;
		    cell = sheet.getCell(col,i);
		    String string0 = cell.getContents().trim();

			if ( string0.equals("") ){
				//순서가 존재하지 않으므로 중단한다.
				out.clear();
				out.print("order_number_no_exist");
				return;
			}else{
				if ( isNumeric(string0) == true ){
				}else{
					//순서가 숫자가 아니므로 중단한다.
					out.clear();
					out.print("order_number_not_number");
					return;
				}
			}

			// 상품코드 ( encode )
		    col = 1;
		    cell = sheet.getCell(col,i);
		    String string1 = cell.getContents().trim();
			if ( string1.equals("") ){
				//상품코드를 입력하지 않았기 때문에 중단한다.
				out.clear();
				out.print("pd_code_no_exist");
				return;
			}else{
				string1 = URLEncoder.encode(string1);
			}

			// 상품명 ( encode )
			col = 2;
		    cell = sheet.getCell(col,i);
		    String string2 = cell.getContents().trim();
			if ( string2.equals("") ){
				//상품명을 입력하지 않았기 때문에 중단한다.
				out.clear();
				out.print("pd_name_no_exist");
				return;
			}else{
				string2 = URLEncoder.encode(string2);
			}

			// 판매가
			col = 3;
		    cell = sheet.getCell(col,i);
		    String string3 = cell.getContents().trim();
			if ( string3.equals("") ){
				//판매가 존재하지 않으므로 중단한다.
				out.clear();
				out.print("price_no_exist");
				return;
			}else{
				if ( isNumeric(string3) == true ){
				}else{
					//판매가가 숫자가 아니므로 중단한다.
					out.clear();
					out.print("price_not_number");
					return;
				}
			}

			// 카드할인
			col = 4;
		    cell = sheet.getCell(col,i);
		    String string4 = cell.getContents().trim();
			if ( string4.equals("") ){
			}else{
				if ( isNumeric(string4) == true ){
				}else{
					//카드할인이 숫자가 아니므로 중단한다.
					out.clear();
					out.print("card_discount_not_number");
					return;
				}
			}

			// 카드시작일
			col = 5;
		    cell = sheet.getCell(col,i);
		    String string5 = cell.getContents().trim();
			if ( string5.equals("") ){
			}else{
				// 입력받은 카드시작일이 유효한지 검사한다.
				sql = " SELECT id "
				+" FROM time_dimension WHERE db_date = '"+string5+"'";

				stmt = conn.createStatement();
				rs = stmt.executeQuery(sql);
					
				rs.last();
				int listCountInt_cardStartDate = rs.getRow();
				if(listCountInt_cardStartDate == 0){
					out.clear();
					out.print("card_discount_from_date_type_error");
					return;
				};
				rs.beforeFirst();
			}

			// 카드종료일
			col = 6;
		    cell = sheet.getCell(col,i);
		    String string6 = cell.getContents().trim();
			if ( string6.equals("") ){
			}else{
				// 입력받은 카드시작일이 유효한지 검사한다.
				sql = " SELECT id "
				+" FROM time_dimension WHERE db_date = '"+string6+"'";

				stmt = conn.createStatement();
				rs = stmt.executeQuery(sql);
					
				rs.last();
				int listCountInt_cardEndDate = rs.getRow();
				if(listCountInt_cardEndDate == 0){
					out.clear();
					out.print("card_discount_end_date_type_error");
					return;
				};
				rs.beforeFirst();
			}

			// 카드정보
			col = 7;
		    cell = sheet.getCell(col,i);
		    String string7 = cell.getContents().trim();
			string7 = URLEncoder.encode(string7);

			// 카드한정
			col = 8;
		    cell = sheet.getCell(col,i);
		    String string8 = cell.getContents().trim();
			string8 = URLEncoder.encode(string8);

			// 쿠폰할인
			col = 9;
		    cell = sheet.getCell(col,i);
		    String string9 = cell.getContents().trim();
			if ( string9.equals("") ){
			}else{
				if ( isNumeric(string9) == true ){
				}else{
					//쿠폰할인이 숫자가 아니므로 중단한다.
					out.clear();
					out.print("coupon_discount_not_number");
					return;
				}
			}

			// 다다익선
			col = 10;
		    cell = sheet.getCell(col,i);
		    String string10 = cell.getContents().trim();
			string10 = URLEncoder.encode(string10);

			// 다다익선정보
			col = 11;
		    cell = sheet.getCell(col,i);
		    String string11 = cell.getContents().trim();
			string11 = URLEncoder.encode(string11);

			// 기타정보
			col = 12;
		    cell = sheet.getCell(col,i);
		    String string12 = cell.getContents().trim();
			string12 = URLEncoder.encode(string12);

			String string13 = "";
			String string14 = "";

			if ( menu_type_cd.equals("MENU4") || menu_type_cd.equals("MENU5") || menu_type_cd.equals("MENU6") ){

				// 특가행사시작일
				col = 13;
				cell = sheet.getCell(col,i);
				string13 = cell.getContents().trim();
				if ( string13.equals("") ){
					// 특가행사시작일이 존재하지 않으므로 중단한다.
					out.clear();
					out.print("oneDay_start_date_no_exist");
					return;
				}else{
					// 입력받은 특가행사시작일이 유효한지 검사한다.
					sql = " SELECT id "
					+" FROM time_dimension WHERE db_date = '"+string13+"'";

					stmt = conn.createStatement();
					rs = stmt.executeQuery(sql);
						
					rs.last();
					int listCountInt_cardStartDate = rs.getRow();
					if(listCountInt_cardStartDate == 0){
						out.clear();
						out.print("oneDay_start_date_type_error");
						return;
					};
					rs.beforeFirst();
				}

				// 특가행사종료일
				col = 14;
				cell = sheet.getCell(col,i);
			    string14 = cell.getContents().trim();
				if ( string14.equals("") ){
					// 특가행사종료일이 존재하지 않으므로 중단한다.
					out.clear();
					out.print("oneDay_end_date_no_exist");
					return;
				}else{
					// 입력받은 특가행사종료일이 유효한지 검사한다.
					sql = " SELECT id "
					+" FROM time_dimension WHERE db_date = '"+string14+"'";

					stmt = conn.createStatement();
					rs = stmt.executeQuery(sql);
						
					rs.last();
					int listCountInt_cardStartDate = rs.getRow();
					if(listCountInt_cardStartDate == 0){
						out.clear();
						out.print("oneDay_end_date_type_error");
						return;
					};
					rs.beforeFirst();

					/* 2020-02-21 주석처리 */
//					/* 행사시작일과 행사종료일이 동일한지 확인한다. */
//					if (string13.equals(string14)){
//					}else{
//						out.clear();
//						out.print("oneDay_date_diff");
//						return;	
//					}
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
//			int listCount = rs.getRow();
//			if(listCount == 0){
//				out.clear();
//				out.print("NoNPdNo");
//				return;
//			};
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
				sql = " SELECT img_no from vm_product_image WHERE ref_pd_no = "+pd_no+" and std_fg = 'Y' ORDER BY reg_date DESC LIMIT 0,1 ; ";
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
				// 기간 전단형일 경우
				if ( menu_type_cd.equals("MENU1") || menu_type_cd.equals("MENU2") || menu_type_cd.equals("MENU3") ){

					// 전달받은 정보를 바탕으로 전단상품을 insert 한다.
					sql = "insert into vm_jundan_prod_content (ref_jd_no, order_number, ref_pd_no, ref_img_no, pd_name, price, card_discount, ";
					
					// 카드시작일 여부
					if (string5 == ""){
					}else{
						sql = sql +"card_discount_from_date, ";
					}
					// 카드종료일 여부
					if (string6 == ""){
					}else{
						sql = sql +"card_discount_end_date, ";
					}

					sql = sql +" card_info, card_restrict, coupon_discount, dadaiksun, dadaiksun_info, etc ) "
						+" values("+new_jd_no+", '"+string0+"', '"+pd_no+"', '"+img_no+"', '"+string2+"', '"+string3+"', '"+string4+"', '";
					// 카드시작일		
					if (string5 == ""){
					}else{
						sql = sql +string5+"', '";
					}
					// 카드종료일
					if (string6 == ""){
					}else{
						sql = sql +string6+"', '";
					}

					sql = sql +string7+"', '"+string8+"', '"+string9+"', '"+string10+"', '"+string11+"', '"+string12+"');";

					pstmt = conn.prepareStatement(sql);
					pstmt.executeUpdate();

				/* 특가형일 경우, 임시생성된 전단번호, 특가시작일과 특가종료일을 전단상품컨텐츠테이블에 입력한다. */
				}else{

					// 전달받은 정보를 바탕으로 전단상품을 insert 한다.
					sql = "insert into vm_jundan_prod_content (ref_jd_no, order_number, ref_pd_no, ref_img_no, pd_name, price, card_discount, ";
					
					// 카드시작일 여부
					if (string5 == ""){
					}else{
						sql = sql +"card_discount_from_date, ";
					}
					// 카드종료일 여부
					if (string6 == ""){
					}else{
						sql = sql +"card_discount_end_date, ";
					}

					sql = sql +" card_info, card_restrict, coupon_discount, dadaiksun, dadaiksun_info, etc, oneDay_start_date, oneDay_end_date ) "
						+" values("+new_jd_no+", '"+string0+"', '"+pd_no+"', '"+img_no+"', '"+string2+"', '"+string3+"', '"+string4+"', '";
					// 카드시작일		
					if (string5 == ""){
					}else{
						sql = sql +string5+"', '";
					}
					// 카드종료일
					if (string6 == ""){
					}else{
						sql = sql +string6+"', '";
					}

					sql = sql +string7+"', '"+string8+"', '"+string9+"', '"+string10+"', '"+string11+"', '"+string12+"', '"+string13+"', '"+string14+"');";

					pstmt = conn.prepareStatement(sql);
					pstmt.executeUpdate();

				// 전단형태 분기끝
				}
			// 순서여부 분기끝
			}
		 // 엑셀 row 루프끝	
		 }

		 // 기간 전단일 경우
		 if ( menu_type_cd.equals("MENU1") || menu_type_cd.equals("MENU2") || menu_type_cd.equals("MENU3") ){

			 // 실제 전단에 insert 한다.
			 sql = " insert into vm_jundan "
				  +" select * from vm_jundan_temp where jd_no = "+ new_jd_no;

			 pstmt = conn.prepareStatement(sql);
			 pstmt.executeUpdate();
		
		 // 특가형 전단일 경우
		 }else{
			
			/* 등록된 특가일자의 갯수만큼 전단을 생성한다. */
			sql = " SELECT min(left(oneDay_start_date,10)) as oneDay_start_date_min from vm_jundan_prod_content WHERE ref_jd_no = "+new_jd_no;
			stmt = conn.createStatement();
			rs = stmt.executeQuery(sql);
		
			rs.last();
			rs.beforeFirst();		
		
			String oneDay_start_date_min = "";
			while(rs.next()){
				// 특가행사시작일 최소값
				oneDay_start_date_min = rs.getString("oneDay_start_date_min");
			}

			sql = " SELECT max(left(oneDay_end_date,10)) as oneDay_end_date_max from vm_jundan_prod_content WHERE ref_jd_no = "+new_jd_no;
			stmt = conn.createStatement();
			rs = stmt.executeQuery(sql);
		
			rs.last();
			rs.beforeFirst();		
		
			String oneDay_end_date_max = "";
			while(rs.next()){
				// 특가행사종료일 최대값
				oneDay_end_date_max = rs.getString("oneDay_end_date_max");
			}

			sql = " SELECT a.db_date from time_dimension AS a WHERE a.db_date >= '"+oneDay_start_date_min+"' AND a.db_date <= '"+oneDay_end_date_max+"' ";
			stmt = conn.createStatement();
			rs = stmt.executeQuery(sql);
		
			rs.last();
			rs.beforeFirst();		
		
			String db_date = "";
			while(rs.next()){
				// 특가행사기준일
				db_date = rs.getString("db_date");

				/* 임시일자(2020-01-01)를 통해 만든 임시전단번호의 전단으로 실제 특가일 갯수만큼 전단을 생성한다. */
				 sql = " insert into vm_jundan(ref_company_no, from_date, to_date, menu_no) "
					  +" select ref_company_no, '"+db_date+"', '"+db_date+"', menu_no from vm_jundan_temp where jd_no = "+ new_jd_no;
				 pstmt = conn.prepareStatement(sql);
				 pstmt.executeUpdate();
			}

			/* 전단번호를 매핑하여 전단상품컨텐츠임시테이블을 입력한다. */
			sql = " insert into vm_jundan_prod_content_temp "
			    +" (ref_jd_no, order_number, ref_pd_no, ref_img_no, pd_name, price, card_discount, card_discount_from_date, card_discount_end_date, "
				+" card_info, card_restrict, coupon_discount, dadaiksun, dadaiksun_info, etc, reg_no, "
				+" reg_date, lst_no, lst_date, oneDay_start_date, oneDay_end_date) "
			    +" SELECT b.jd_no, a.order_number, a.ref_pd_no, a.ref_img_no, a.pd_name, a.price, "
				+" a.card_discount, a.card_discount_from_date, a.card_discount_end_date, a.card_info, a.card_restrict, "
				+" a.coupon_discount, a.dadaiksun, a.dadaiksun_info, a.etc, a.reg_no, a.reg_date, a.lst_no, a.lst_date, "
				+" a.oneDay_start_date, a.oneDay_end_date "
				+" from vm_jundan_prod_content AS a "
				+" INNER JOIN vm_jundan AS b "
				+" ON a.oneDay_start_date <= b.from_date and a.oneDay_end_date >= b.from_date and a.ref_jd_no = "+ new_jd_no
				+" WHERE b.ref_company_no = '"+userCompanyNo+"' "
				+" AND b.menu_no = '"+menu_no+"'; ";

			pstmt = conn.prepareStatement(sql);
			pstmt.executeUpdate();

			/* 임시전단번호의 전단상품컨텐츠테이블을 삭제한다. */
			sql = " delete from vm_jundan_prod_content where ref_jd_no = "+ new_jd_no;

			pstmt = conn.prepareStatement(sql);
			pstmt.executeUpdate();

			/* 임시전단번호의 전단상품컨텐츠테이블을 삭제한다. */
			sql = " insert into vm_jundan_prod_content "
			    +" (ref_jd_no, order_number, ref_pd_no, ref_img_no, pd_name, price, card_discount, card_discount_from_date, card_discount_end_date, "
				+" card_info, card_restrict, coupon_discount, dadaiksun, dadaiksun_info, etc, reg_no, "
				+" reg_date, lst_no, lst_date, oneDay_start_date, oneDay_end_date) "
			    +" SELECT a.ref_jd_no, a.order_number, a.ref_pd_no, a.ref_img_no, a.pd_name, a.price, "
				+" a.card_discount, a.card_discount_from_date, a.card_discount_end_date, a.card_info, a.card_restrict, "
				+" a.coupon_discount, a.dadaiksun, a.dadaiksun_info, a.etc, a.reg_no, a.reg_date, a.lst_no, a.lst_date, "
				+" a.oneDay_start_date, a.oneDay_end_date "
				+" from vm_jundan_prod_content_temp as a; ";

			pstmt = conn.prepareStatement(sql);
			pstmt.executeUpdate();

			/* 임시전단번호의 전단상품컨텐츠테이블을 삭제한다. */
			sql = " delete from vm_jundan_prod_content_temp; ";

			pstmt = conn.prepareStatement(sql);
			pstmt.executeUpdate();

		}

		/* 임시전단번호의 전단을 삭제한다. */
		sql = " delete from vm_jundan_temp "
		     +" where jd_no = "+ new_jd_no;
		pstmt = conn.prepareStatement(sql);
		pstmt.executeUpdate();

		/* 채번을 위하여 동기화한다. */
		sql = " insert into vm_jundan_temp "
		     +" select * from vm_jundan ORDER BY jd_no DESC LIMIT 0,1; ";
		pstmt = conn.prepareStatement(sql);
		pstmt.executeUpdate();
		 
		/* 엑셀메모리를 close 한다. */
		workbook.close();
		
		out.clear();
		out.print("success");
		
	}catch(Exception e){
		out.clear();
		out.print("exception error");	
	}finally{
		if(pstmt != null) try{ pstmt.close(); }catch(SQLException sqle) {}
		if(conn != null) try{ conn.close(); }catch(SQLException sqle) {}
	};

%>