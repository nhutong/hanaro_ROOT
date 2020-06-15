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

	String pm_no = (request.getParameter("pm_no")==null)? "0":request.getParameter("pm_no");
	String excel_path = (request.getParameter("excel_path")==null)? "":request.getParameter("excel_path");
	String overwrite = (request.getParameter("overwrite")==null)? "N":request.getParameter("overwrite");
	
	excel_path = excel_path.trim();

	try{

		int resert_cnt = 0;
		int all_cnt = 0;

		// 푸시메시지 있는지 확인
		sql = " SELECT pm_no from vm_push_message	WHERE pm_target = '대상등록' and pm_no = "+pm_no+" ;";
						
		stmt = conn.createStatement();
		rs = stmt.executeQuery(sql);
				
		rs.last();
		int pm_exist = rs.getRow();

		if(pm_exist == 0){
			//등록된 푸시메시지가 없어 중단함
			out.clear();
			out.print("no_pm");
			return;
		}
		rs.beforeFirst();    


		//타깃이 등록되어 있는지 확인
		sql = " SELECT pmt_no from vm_push_message_target where pm_no = "+pm_no+"; "; 

		stmt = conn.createStatement();
		rs = stmt.executeQuery(sql);
				
		rs.last();
		int pmt_exist = rs.getRow();
		if(pmt_exist == 0){
		}else{
			//등록된 대상자가 이미 있음			
			if( overwrite.equals("Y")){
				//삭제하고 계속 진행
				sql = " delete from vm_push_message_target where pm_no = "+pm_no+"; "; 
				pstmt = conn.prepareStatement(sql);
				pstmt.executeUpdate();
			}else{
				//멈춤
				out.clear();
				out.print("pmt_no_dup");
				return;
			}
		}
		rs.beforeFirst();    


		// 엑셀 업로드
		Workbook workbook = Workbook.getWorkbook(new File(request.getRealPath("/upload/")+excel_path)); 
		Sheet sheet = workbook.getSheet(0);
		int row = sheet.getRows();
		int col = 0;
		Cell cell;

		for(int i = 1; i < row; i++) {

			// 전화번호
		    col = 0;
		    cell = sheet.getCell(col,i);
		    String string0 = cell.getContents().trim().replaceAll(",", "").replaceAll("'", "").replaceAll("-", "");

			if ( string0.equals("") ){
				//전화번호가 존재하지 않으므로 중단한다.
				out.clear();
				out.print("no_no_exist"+","+Integer.toString(i));
				return;
			}else{
				if ( isNumeric(string0) == true ){
				}else{
					//전화번호가 숫자가 아니므로 중단한다.
					out.clear();
					out.print("no_not_number"+","+Integer.toString(i));
					return;
				}
			}
		
			sql = " insert into vm_push_message_target(pm_no, no, reg_date, tel) "
		         +" select a.pm_no, b.no, NOW(), b.tel "
		         +"   from vm_push_message a "
		         +"   inner join vm_member b on a.vm_cp_no = b.company_no "
		         +"  where a.pm_target = '대상등록' "
				 +"    and a.pm_no = "+pm_no+"	"
				 +"    and b.tel like '%"+string0+"' ; ";

			resert_cnt = 0;
			pstmt = conn.prepareStatement(sql);
			resert_cnt = pstmt.executeUpdate();

			all_cnt += resert_cnt;
			// 엑셀 row 루프끝
		}

		/* 엑셀메모리를 close 한다. */
		workbook.close();
		
		out.clear();
		out.print("success"+","+Integer.toString(all_cnt)+","+sql);
	}catch(Exception e){
		out.clear();
		out.print("exception error"+","+e);	
	}finally{
		if(pstmt != null) try{ pstmt.close(); }catch(SQLException sqle) {}
		if(stmt != null) try{ stmt.close(); }catch(SQLException sqle) {}		
		if(conn != null) try{ conn.close(); }catch(SQLException sqle) {}
	};

%>