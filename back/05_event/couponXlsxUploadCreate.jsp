<%@ page contentType = "text/html;charset=utf-8" %>
<%@ page trimDirectiveWhitespaces="true" %>
<%@ page import="java.net.URLEncoder" %>
<%@ page import="java.util.*" %>
<%@ page import="org.json.simple.*" %>
<%@ page import="java.sql.*" %>
<%@ page import="java.text.*" %>
<%@ page import="java.io.File,java.util.Date"%>
<%@ page import="java.io.FileInputStream"%>
<%@ page import="org.apache.poi.poifs.filesystem.POIFSFileSystem"%>
<%@ page import="org.apache.poi.ss.usermodel.Cell"%>
<%@ page import="org.apache.poi.ss.usermodel.DateUtil"%>
<%@ page import="org.apache.poi.ss.usermodel.Row"%>
<%@ page import="org.apache.poi.xssf.usermodel.XSSFCell"%>
<%@ page import="org.apache.poi.xssf.usermodel.XSSFRow"%>
<%@ page import="org.apache.poi.xssf.usermodel.XSSFSheet"%>
<%@ page import="org.apache.poi.xssf.usermodel.XSSFWorkbook"%>
<%@ page import="org.apache.commons.dbutils.DbUtils" %>
<%@ page import="org.apache.commons.dbutils.QueryRunner" %>
<%@ page import="org.apache.commons.dbutils.handlers.MapHandler" %>
<%@ page import="org.apache.commons.dbutils.handlers.MapListHandler" %>
<%@ page import="com.google.gson.Gson" %>
<%@ page import="com.google.gson.GsonBuilder" %>

<%@ include file = "../00_include/dbConn.jsp" %>
<%@ include file = "../00_include/common.jsp" %>


<%	
	// https://stackoverflow.com/a/27669890
	// Apache Commons DbUtils : https://commons.apache.org/proper/commons-dbutils/
	// Gson : https://github.com/google/gson
	Gson gson = new GsonBuilder().serializeNulls().create();

	Map<String, Object> results = new HashMap<>();

	// 본사관리자(ROLE1), 판매장관리자(ROLE2) 만 접근가능
	String requiredRoles = "ROLE1,ROLE2";
%>
<%@ include file = "../01_sign/auth.jsp" %>

<%

	Integer userNo = (Integer)session.getAttribute("userNo");	
	String excel_path = (request.getParameter("excel_path")==null)? "0":request.getParameter("excel_path");	

	try{	

		//===============================================================================================================
		
		// 엑셀 업로드
		XSSFWorkbook workBook  =  new XSSFWorkbook(new FileInputStream(new File("D:/Tomcat 8.5/webapps/ROOT/upload/"+excel_path)));   //운영서버
		//XSSFWorkbook workBook  =  new XSSFWorkbook(new FileInputStream(new File("C:/HANAROAPP/webapps/ROOT/upload/"+excel_path)));    //로컬서버

		int col = 0;
		XSSFSheet sheet = workBook.getSheetAt(0);
        XSSFRow row;
        XSSFCell cell;
		int rows = sheet.getPhysicalNumberOfRows();

		QueryRunner queryRunner = new QueryRunner();
		int result = 0;
		String query = "";

		for(int i = 1; i < rows; i++) {
			row = sheet.getRow(i);
			// 순서
		    col = 0;
		    cell = row.getCell(col);
            if (cell == null) { cell = row.createCell(col); }
			String string0 = "";
			//엑셀 column 입력 데이터타입형별로 분기처리
            if (cell.getCellType().toString() == "STRING") {
                string0 = cell.getStringCellValue().trim().replaceAll(",", "").replaceAll("'", "");
            } else if (cell.getCellType().toString() == "NUMERIC") {
                string0 = cell.toString().trim().replaceAll(",", "").replaceAll("'", "");
                string0 = String.valueOf(Math.round(Double.parseDouble(string0))); 
            } else if (cell.getCellType().toString() == "BLANK") {   
                //string0 = "";         
				//NULL 예외처리
                out.clear();
				out.print("order_number_no_exist");
				return;				
            }
			//숫자형 예외처리
            if ( isNumeric(string0) != true){
                out.clear();
				out.print("order_number_not_number");
				return;
            }
			/*
		    //String string0 = cell.getStringCellValue().trim();
			String string0 = cell.toSting().trim().replaceAll("'","").replaceAll(",","");

			if ( "".equals(string0) ){
				//순서가 존재하지 않으므로 중단한다.
				out.clear();
				out.print("order_number_no_exist");
				return;
			}else{
				string0 = strEncode(string0);
				if ( isNumeric(string0) == true ){
					string0 = String.valueOf(Math.round(Double.parseDouble(string0)));
                    System.out.println(string0);
				}else{
					//순서가 숫자가 아니므로 중단한다.
					out.clear();
					out.print("order_number_not_number");
					return;
				}
			}
			*/

			// 지점명 ( encode )
		    col = 1;
		    cell = row.getCell(col);
            if (cell == null) { cell = row.createCell(col); }
		    String company_name = cell.getStringCellValue().trim();
			String company_no = "";
			out.print(company_name);			
			if ( "".equals(company_name) ){
				//지점명 입력하지 않았기 때문에 중단한다.
				out.clear();
				out.print("company_name_not_exist");
				return;
			}else{
				// 지점명으로 지점 번호를 확인한다. 				
				sql = " SELECT vm_cp_no FROM vm_company WHERE VM_CP_NAME = '"+company_name+"'; ";

				stmt = conn.createStatement();
				rs = stmt.executeQuery(sql);
				
				rs.last();
				rs.beforeFirst();				
				while(rs.next()){
					company_no = rs.getString("vm_cp_no");     // 지점번호
				}
				
				if ("".equals(company_no)){					
					//잘못된 상품코드이기 때문에 중단한다.
					out.clear();
					out.print("company_name_not_correct");
					return;
				}				
				out.print(company_no);
				out.print(company_name);				
			}
			

			// 상품코드 ( encode )
			col = 2;
		    cell = row.getCell(col);
            if (cell == null) { cell = row.createCell(col); }
            String product_code = "";
			//엑셀 column 입력 데이터타입형별로 분기처리
            if (cell.getCellType().toString() == "STRING") {
                product_code = cell.getStringCellValue().trim().replaceAll(",", "").replaceAll("'", "");
            } else if (cell.getCellType().toString() == "NUMERIC") {
                product_code = cell.toString().trim().replaceAll(",", "").replaceAll("'", "");
                product_code = String.valueOf(Math.round(Double.parseDouble(product_code))); 
            } else if (cell.getCellType().toString() == "BLANK") {   
                //product_code = "";   
				//NULL 예외처리      
                out.clear();
				out.print("pd_code_no_exist");
				return;				
            }
			//숫자형 예외처리
            if ( isNumeric(product_code) != true){
                out.clear();
				out.print("pd_code_not_number");
				return;
            }
			/*
		    //String product_code = cell.getStringCellValue().trim();
			String product_code = cell.toString().trim().replaceAll("'","").replaceAll(",","");
			if ( "".equals(product_code) ){
				//상품코드를 입력하지 않았기 때문에 중단한다.
				out.clear();
				out.print("product_code_not_exist");
				return;
			}else{
				product_code = strEncode(product_code);
				 if ( isNumeric(product_code) == true ){
                        product_code = String.valueOf(Math.round(Double.parseDouble(product_code)));
                        System.out.println(product_code);
                    }else{
                        //상품코드가 숫자가 아니므로 중단한다.
                        out.clear();
                        out.print("pd_code_not_number");
                        return;
                    }				 
				// 신규입력한 전단상품의 상품번호(내부용)를 select 한다.
				//sql = " select pd_no from vm_product "
				//	+ " where pd_code = '"+product_code+"'; ";

				//stmt = conn.createStatement();
				//rs = stmt.executeQuery(sql);
				
				//rs.last();
				//rs.beforeFirst();
				//String pd_no = "";		
				//while(rs.next()){
				//	pd_no = rs.getString("pd_no");     // 신규 상품번호(내부용)	
				//}
				
				//if ("".equals(pd_no)){
				//	pd_no = "";
				//	//잘못된 상품코드이기 때문에 중단한다.
				//	out.clear();
				//	out.print("pd_code_not_correct");
				//} 
				
			}
			*/
			// 쿠폰코드
			col = 3;
		    cell = row.getCell(col);
            if (cell == null) { cell = row.createCell(col); }
			//엑셀 column 입력 데이터타입형별로 분기처리
			String coupon_code = "";
            if (cell.getCellType().toString() == "STRING") {
                coupon_code = cell.getStringCellValue().trim().replaceAll(",", "").replaceAll("'", "");
            } else if (cell.getCellType().toString() == "NUMERIC") {
                coupon_code = cell.toString().trim().replaceAll(",", "").replaceAll("'", "");
                coupon_code = String.valueOf(Math.round(Double.parseDouble(coupon_code))); 
            } else if (cell.getCellType().toString() == "BLANK") {   
                //coupon_code = "";         
				//NULL 예외처리
                out.clear();
				out.print("coupon_code_no_exist");
				return;				
            }
			//숫자형 예외처리
            if ( isNumeric(coupon_code) != true){
                out.clear();
				out.print("coupon_code_not_exist");
				return;
            }
			/*
		    //String coupon_code = cell.getStringCellValue().trim();
			String coupon_code = cell.toString().trim().replaceAll(",","").replaceAll("'","");
			if ( "".equals(coupon_code) ){
				//쿠폰코드가 존재하지 않으므로 중단한다.
				out.clear();
				out.print("coupon_code_not_exist");
				return;
			} else {
					coupon_code = strEncode(coupon_code);
				 if ( isNumeric(coupon_code) == true ){
                        coupon_code = String.valueOf(Math.round(Double.parseDouble(coupon_code)));
                        System.out.println(coupon_code);
                    }else{
                        //상품코드가 숫자가 아니므로 중단한다.
                        out.clear();
                        out.print("pd_code_not_number");
                        return;
                    }			
			}
			*/

			// 쿠폰 할인가
			col = 4;
		    cell = row.getCell(col);
            if (cell == null) { cell = row.createCell(col); }
			String discount_price = "";
			//엑셀 column 입력 데이터타입형별로 분기처리
            if (cell.getCellType().toString() == "STRING") {
                discount_price = cell.getStringCellValue().trim().replaceAll(",", "").replaceAll("'", "");
            } else if (cell.getCellType().toString() == "NUMERIC") {
                discount_price = cell.toString().trim().replaceAll(",", "").replaceAll("'", "");
                discount_price = String.valueOf(Math.round(Double.parseDouble(discount_price))); 
            } else if (cell.getCellType().toString() == "BLANK") {   
                //discount_price = "";     
				//NULL 예외처리    
                out.clear();
				out.print("discount_price_no_exist");
				return;				
            }
			//숫자형 예외처리
            if ( isNumeric(discount_price) != true){
                out.clear();
				out.print("discount_price_not_exist");
				return;
            }
			/*
		    //String discount_price = cell.getStringCellValue().trim();
			String discount_price = cell.toString().trim().replaceAll("'","").replaceAll(",","");
			if ( "".equals(discount_price) ){
				//쿠폰할인가가 존재하지 않으므로 중단한다.
				out.clear();
				out.print("discount_price_not_exist");
				return;
			}else{
				discount_price = strEncode(discount_price);
				if ( isNumeric(discount_price) == true ){
					discount_price = String.valueOf(Math.round(Double.parseDouble(discount_price)));
                    System.out.println(discount_price);                    
				}else{
					//쿠폰할인가가 숫자가 아니므로 중단한다.
					out.clear();
					out.print("discount_price_not_number");
					return;
				}
			}
			*/

			// 쿠폰시작일
			col = 5;
		    cell = row.getCell(col);
            if (cell == null) { cell = row.createCell(col); }
			String start_date = "";
			//엑셀 column 입력 데이터타입형별로 분기처리
            if (cell.getCellType().toString() == "STRING") {
                start_date = cell.getStringCellValue().trim().replaceAll(",", "").replaceAll("'", "");
            } else if (cell.getCellType().toString() == "NUMERIC") {
                start_date = cell.toString().trim().replaceAll(",", "").replaceAll("'", "");
                start_date = String.valueOf(Math.round(Double.parseDouble(start_date))); 
            } else if (cell.getCellType().toString() == "BLANK") {
                start_date = "";
            }
			if (start_date.equals("")){	
				start_date = "null";			
			}
			else {
				sql = " SELECT id "
				+" FROM time_dimension WHERE db_date = '"+start_date+"'";

				stmt = conn.createStatement();
				rs = stmt.executeQuery(sql);
					
				rs.last();
				int startDateCount = rs.getRow();
				if(startDateCount == 0){
					out.clear();
					out.print("coupon_start_date_type_error : " + start_date );
					return;
				};
				rs.beforeFirst();
			}
			/*
		    String start_date = cell.getStringCellValue().trim();
			if ( !"".equals(start_date) ){
				// 입력받은 카드시작일이 유효한지 검사한다.
				sql = " SELECT id "
				+" FROM time_dimension WHERE db_date = '"+start_date+"'";

				stmt = conn.createStatement();
				rs = stmt.executeQuery(sql);
					
				rs.last();
				int startDateCount = rs.getRow();
				if(startDateCount == 0){
					out.clear();
					out.print("coupon_start_date_type_error : " + start_date );
					return;
				};
				rs.beforeFirst();
			}
			*/

			// 쿠폰 종료일
			col = 6;
		    cell = row.getCell(col);
            if (cell == null) { cell = row.createCell(col); }
			String end_date = "";
			//엑셀 column 입력 데이터타입형별로 분기처리
            if (cell.getCellType().toString() == "STRING") {
                end_date = cell.getStringCellValue().trim().replaceAll(",", "").replaceAll("'", "");
            } else if (cell.getCellType().toString() == "NUMERIC") {
                end_date = cell.toString().trim().replaceAll(",", "").replaceAll("'", "");
                end_date = String.valueOf(Math.round(Double.parseDouble(end_date))); 
            } else if (cell.getCellType().toString() == "BLANK") {
                end_date = "";
            }
			if (end_date.equals("")){	
				end_date = "null";			
			}
			else {
				sql = " SELECT id "
				+" FROM time_dimension WHERE db_date = '"+end_date+"'";

				stmt = conn.createStatement();
				rs = stmt.executeQuery(sql);
					
				rs.last();
				int startDateCount = rs.getRow();
				if(startDateCount == 0){
					out.clear();
					out.print("coupon_end_date_type_error : " + end_date );
					return;
				};
				rs.beforeFirst();
			}
			/*
		    String end_date = cell.getStringCellValue().trim();
			if ( !"".equals(end_date) ){
				// 입력받은 카드시작일이 유효한지 검사한다.
				sql = " SELECT id "
				+" FROM time_dimension WHERE db_date = '"+end_date+"'";

				stmt = conn.createStatement();
				rs = stmt.executeQuery(sql);
					
				rs.last();
				int listCountInt_cardStartDate = rs.getRow();
				if(listCountInt_cardStartDate == 0){
					out.clear();
					out.print("coupon_end_date_type_error");
					return;
				};
				rs.beforeFirst();
			}
			*/
			// 제한 수량
			col = 7;			
		    cell = row.getCell(col);
            if (cell == null) { cell = row.createCell(col); }
			String limit_qty = "";
			//엑셀 column 입력 데이터타입형별로 분기처리
            if (cell.getCellType().toString() == "STRING") {
                limit_qty = cell.getStringCellValue().trim().replaceAll(",", "").replaceAll("'", "");
            } else if (cell.getCellType().toString() == "NUMERIC") {
                limit_qty = cell.toString().trim().replaceAll(",", "").replaceAll("'", "");
                limit_qty = String.valueOf(Math.round(Double.parseDouble(limit_qty))); 
            } else if (cell.getCellType().toString() == "BLANK") {   
                //limit_qty = "";     
				//NULL 예외처리    
                out.clear();
				out.print("limit_qty_no_exist");
				return;				
            }
			//숫자형 예외처리
            if ( isNumeric(limit_qty) != true){
                out.clear();
				out.print("limit_qty_not_exist");
				return;
            }
			/*
		    //String limit_qty = cell.getStringCellValue().trim();
			String limit_qty = cell.toString().trim().replaceAll("'","").replaceAll(",","");			
			if ( "".equals(limit_qty) ){
				//제한 수량이 존재하지 않으므로 중단한다.
				out.clear();
				out.print("max_qty_not_exist");
				return;
			}else{
				limit_qty = strEncode(limit_qty);
				if ( isNumeric(limit_qty) == true ){
					limit_qty = String.valueOf(Math.round(Double.parseDouble(limit_qty)));
                    System.out.println(limit_qty);                    				
				}else{
					//쿠폰할인가가 숫자가 아니므로 중단한다.
					out.clear();
					out.print("limit_qty_not_number");
					return;
				}
			}
			*/

			// 쿠폰명
			col = 8;			
		    cell = row.getCell(col);
            if (cell == null) { cell = row.createCell(col); }
		    String coupon_name = cell.getStringCellValue().trim();
			if ( "".equals(coupon_name) ){
				//쿠폰명이 존재하지 않으므로 중단한다.
				out.clear();
				out.print("coupon_name_not_exist");
				return;
			}

			// 상품명
			col = 9;			
		    cell = row.getCell(col);
            if (cell == null) { cell = row.createCell(col); }
		    String product_name = cell.getStringCellValue().trim();
			if ( "".equals(product_name) ){
				//쿠폰명이 존재하지 않으므로 중단한다.
				out.clear();
				out.print("pd_name_no_exist");
				return;
			}


			//========================================================================================
			//입력정보 끝================================================================================
			//========================================================================================

			String coupon_detail = "[쿠폰 사용시 유의사항]\n"
								+ "-앱쿠폰은 하나로마트 회원만 사용 가능합니다.\n"
								+ "-쿠폰을 다운받으신 매장에서만 사용 가능합니다.\n"
								+ "-매장 계산대에서 본 쿠폰을 제시해주세요.\n"
								+ "-할인 조건은 최종결제금액 기준으로 적용됩니다.\n"
								+ "-일부 쿠폰과 중복사용이 불가합니다.\n"
								+ "-쿠폰의 상품 및 사용조건은 변동될 수 있습니다.\n"
								+ "-현금과 교환되지 않으며 양도가 불가능 합니다.\n"
								+ "-사용하신 쿠폰은 즉시 소멸됩니다.\n"
								+ "-재결제 시에는 쿠폰적용이 불가합니다.\n"
								+ "-일부품목은 적용이 제외됩니다.\n"
								+ "-쿠폰 적용 시, 타 영수증과 합산불가하며 한 개의 영수증을 분할하여 사용할 수 없습니다.\n"
								+ "-식자재매장, 임대매장, 일부코너 상품은 사용이 불가합니다.";			
	
			//순서가 없으면 어떤 작업도 하지 않는다.
			if(string0 == ""){
			}else{
				
				// 쿠폰 등록 (insert)
				query = "  INSERT INTO hanaro.vm_coupon " + 
							" (coupon_name, coupon_type, coupon_code, reg_no, reg_date, lst_no, lst_date, " + 
							"  start_date, end_date, product_code, product_name, discount_price, limit_qty, extra, company_no, status_cd, coupon_detail) " + 
							" VALUES(?, 'PRODUCT', ?, ?, now(), ?, now(), "+
							"		 (case when ? = '' then now() else ? end), (case when ? = '' then '2099-12-31' else ? end), ?, ?, ?, ?, '', ?, 'NOAPPLY', ?) " ;
						
				result += queryRunner.update(
								conn,
								query,
								coupon_name,								
								coupon_code,
								userNo,
								userNo,
								start_date,
								start_date,
								end_date,
								end_date,
								product_code, 	
								product_name, 
								discount_price, 
								limit_qty, 								
								company_no,
								coupon_detail
							);	
				results.put("insert", result);
			}

		 }
				 
		// workbook.close();
		
		out.clear();
//		out.print("success"+ result);
		out.print("success");

	}catch(Exception e){
		out.clear();
		out.print("exception error");
		out.println(e.getMessage());
	}finally{
		if(pstmt != null) try{ pstmt.close(); }catch(SQLException sqle) {}
		if(conn != null) try{ conn.close(); }catch(SQLException sqle) {}
	};


%>
