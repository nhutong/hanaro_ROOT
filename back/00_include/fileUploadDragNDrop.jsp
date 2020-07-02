<%@ page language="java" contentType="text/html; charset=UTF-8" %>
 
<%@page import="com.oreilly.servlet.MultipartRequest" %>
<%@page import="com.oreilly.servlet.multipart.DefaultFileRenamePolicy" %>
<%@page import="java.io.*" %>
<%@page import="java.util.*" %>
<%@page import="java.text.SimpleDateFormat" %>

<%@ page import="java.sql.*" %>
<%@ include file = "dbPoolConn.jsp" %>

<%@ include file = "../00_include/imgResize.jsp" %>
 
<%
    request.setCharacterEncoding("UTF-8");

    //영문 + 숫자 난수 만들기
	Random rnd =new Random();
	
	StringBuffer ran =new StringBuffer();
		
	for( int i = 0 ; i < 10 ; i++ ){
	    if(rnd.nextBoolean()){
	        ran.append((char)((int)(rnd.nextInt(26))+97));
	    }else{
	        ran.append((rnd.nextInt(10))); 
	    }
	}

    // 1000Mbyte(1GB) 제한
    int maxSize  = 1024*1024*1000;       
 
    // 웹서버 컨테이너 경로
    String root = request.getRealPath("/upload/");
    String savePath = root;

	// 임시저장될 temp 경로
	String temp = request.getRealPath("/temp/");
    String tempPath = temp;

    // 업로드 파일명
    String uploadFile = "";
 
    // 실제 저장할 파일명
    String newFileName = "";
 
    int read = 0;
    byte[] buf = new byte[1024];
    FileInputStream fin = null;
    FileOutputStream fout = null;
    long currentTime = System.currentTimeMillis(); 
    SimpleDateFormat simDf = new SimpleDateFormat("yyyyMMddHHmmss"); 
 	
    try{
 
		
		MultipartRequest multi = new MultipartRequest(request, savePath, maxSize, "UTF-8" ); //파일명이 겹칠 경우 덮어쓰기
		//MultipartRequest multi = new MultipartRequest(request, savePath, maxSize, "UTF-8", new DefaultFileRenamePolicy()); //파일명이 겹칠 경우 숫자를 붙임
         
        // 전송받은 parameter의 한글깨짐 방지
        //String title = multi.getParameter("title");
        //title = new String(title.getBytes("8859_1"), "UTF-8");

		String stringfileCnt = multi.getParameter("fileCnt");
		Integer fileCnt = Integer.parseInt(stringfileCnt);

		String pdCode = multi.getParameter("pdCode");

		for (int i=0;i< fileCnt;i++){

			// 파일업로드
			uploadFile = multi.getFilesystemName("file_"+i);

			//파일명에 난수 붙이지 않도록 수정
			//newFileName = simDf.format(new java.util.Date(currentTime))+"_"+ uploadFile;
			newFileName = uploadFile;

			/* 파일 확장자 추출하여 jpg 또는 jpeg 일경우 이미지 resize 한다. */
			String filePath = savePath + newFileName;
			int pos = filePath.lastIndexOf( "." );
			String fileExt = filePath.substring( pos + 1 );

			if ( fileExt.equals("jpg") || fileExt.equals("jpeg")  || fileExt.equals("gif") || fileExt.equals("png") ){
				// 업로드된 파일 객체 생성
				File oldFile = new File(savePath + uploadFile);
	 
				// 실제 저장될 파일 객체 생성
				File newFile = new File(savePath + newFileName);

				out.print("newFile("+newFile+")");												

				// 파일명 rename
				if(!oldFile.renameTo(newFile)){
		 
					// rename이 되지 않을경우 강제로 파일을 복사하고 기존파일은 삭제
		 
					buf = new byte[1024];
					fin = new FileInputStream(oldFile);
					fout = new FileOutputStream(newFile);
					read = 0;
					while((read=fin.read(buf,0,buf.length))!=-1){
						fout.write(buf, 0, read);
					}
									
					fin.close();
					fout.close();
					oldFile.delete();
				}

			/* zip 파일인 경우, temp로 옮겨 압축을 unzip할 준비를 한다. */
			}else{

				// 업로드된 파일 객체 생성
				File oldFile = new File(savePath + uploadFile);

				// 실제 저장될 파일 객체 생성
				/* 파일명에 뛰워쓰기가 있는 경우 unzip 에러발생로 난수 생성하여 파일명을 만든다. */
				double dValue = Math.random();
				int iValue = (int)(dValue * 10000);

				File newFile = new File(tempPath + Integer.toString(iValue) + "." + fileExt);
				newFileName = Integer.toString(iValue) + "." + fileExt;	

				// 파일명 rename
				if(!oldFile.renameTo(newFile)){
		 
					// rename이 되지 않을경우 강제로 파일을 복사하고 기존파일은 삭제
		 
					buf = new byte[1024];
					fin = new FileInputStream(oldFile);
					fout = new FileOutputStream(newFile);
					read = 0;
					while((read=fin.read(buf,0,buf.length))!=-1){
						fout.write(buf, 0, read);
					}
									
					fin.close();
					fout.close();
					oldFile.delete();
				}

			}

			///* 파일 확장자 추출하여 jpg 또는 jpeg 일경우 이미지 resize 한다. */	
			if ( fileExt.equals("jpg") || fileExt.equals("jpeg") || fileExt.equals("gif") || fileExt.equals("png") ){

				if( pdCode.equals("") ){				

					String fileName_img = filePath.substring( 1, pos );
					fileName_img = fileName_img.substring(fileName_img.length()-13, fileName_img.length());			
				
					// 신규입력한 전단상품의 전단번호를 temp 테이블에서 select 한다.
					sql = " select pd_code as ref_pd_code, pd_no as ref_pd_no from vm_product where pd_code =  '" + fileName_img + "' limit 0,1; " ;

					//out.print("("+sql+")");

					stmt = conn.createStatement();
					rs = stmt.executeQuery(sql);
					
					rs.last();
					int listCount0 = rs.getRow();
					String ref_pd_code = "";
					String ref_pd_no = "";					
					if(listCount0 == 0){
					}else{
						rs.beforeFirst();	
	
						while(rs.next()){
							ref_pd_code = rs.getString("ref_pd_code");
							ref_pd_no = rs.getString("ref_pd_no");							
						}
					}
					
					sql = "insert into vm_product_image (img_path, ref_pd_no, pd_code, group_tag, std_fg, reg_date) "
					+" values('" + newFileName.trim() + "', '" + ref_pd_no + "', '" + ref_pd_code + "', '', 'N', now()); ";					

				}else{
					sql = "insert into vm_product_image(img_path, ref_pd_no, pd_code, group_tag, std_fg, reg_no, reg_date, lst_no, lst_date) "
					+" select '"+newFileName.trim()+"', pd_no, pd_code, group_tag, 'Y', reg_no, now(), lst_no, lst_date from vm_product where pd_code = '"+pdCode+"' limit 0,1; ";
				}

				pstmt = conn.prepareStatement(sql);
				pstmt.executeUpdate();

				createThumbnail(filePath,filePath,360);
				createThumbnail(filePath,savePath +"180_"+ newFileName,180);
				createThumbnail(filePath,savePath +"90_"+ newFileName,90);
				createThumbnail(filePath,savePath +"720_"+ newFileName,720);
				createThumbnail(filePath,savePath +"45_"+ newFileName,45);
				createThumbnail(filePath,savePath +"1440_"+ newFileName,1440);

			/* zip 파일이면 unzip 후 작업해준다. */
			}else{
				String cmd = "cmd /c \" bandizip x -y -aou "+tempPath+newFileName;

				Runtime rt = Runtime.getRuntime();
				Process p = rt.exec( cmd );
				p.waitFor();
				p.destroy();

				String fileDir = "/temp/"; //파일을 보여줄 디렉토리
				String filePath_unzip = request.getRealPath(fileDir); //파일이 존재하는 실제경로

				File f = new File(filePath_unzip);
				File [] files = f.listFiles(); //파일의 리스트를 대입

				File asisFile = null;
				File tobeFile = null;

				String filePath1 = "";
				int pos_unzip = 0;
				String fileExt1 = "";

			  for ( int j = 0; j < files.length; j++ ) {
				if ( files[j].isFile()){

					asisFile = new File(tempPath + files[j].getName());
					tobeFile = new File(savePath + files[j].getName());

					// 파일명 rename
					if(!asisFile.renameTo(tobeFile)){
						// rename이 되지 않을경우 강제로 파일을 복사하고 기존파일은 삭제
			 
						buf = new byte[1024];
						fin = new FileInputStream(asisFile);
						fout = new FileOutputStream(tobeFile);
						read = 0;
						while((read=fin.read(buf,0,buf.length))!=-1){
							fout.write(buf, 0, read);
						}
										
						fin.close();
						fout.close();
						asisFile.delete();
					}

					/* 파일 확장자 추출하여 jpg 또는 jpeg 일경우 이미지 resize 한다. */
					filePath1 = savePath + files[j].getName();
					pos_unzip = filePath1.lastIndexOf( "." );
					fileExt1 = filePath1.substring( pos_unzip + 1 );
					
					if ( fileExt1.equals("jpg") || fileExt1.equals("jpeg") || fileExt.equals("gif") || fileExt.equals("png") ){

						if( pdCode.equals("") ){
				
							String fileName_img_zip = filePath1.substring( 1, pos_unzip );
							fileName_img_zip = fileName_img_zip.substring(fileName_img_zip.length()-13, fileName_img_zip.length());			
						
							// 신규입력한 전단상품의 전단번호를 temp 테이블에서 select 한다.
							sql = " select pd_code as ref_pd_code, pd_no as ref_pd_no from vm_product where pd_code =  '" + fileName_img_zip + "' limit 0,1; " ;
		
							stmt = conn.createStatement();
							rs = stmt.executeQuery(sql);
							
							rs.last();
							int listCount0 = rs.getRow();
							String ref_pd_code_zip = "";
							String ref_pd_no_zip = "";					
							if(listCount0 == 0){
							}else{
								rs.beforeFirst();	
			
								while(rs.next()){
									ref_pd_code_zip = rs.getString("ref_pd_code");
									ref_pd_no_zip = rs.getString("ref_pd_no");							
								}
							}
							
							sql = "insert into vm_product_image (img_path, ref_pd_no, pd_code, group_tag, std_fg, reg_date) "
							+" values('" + newFileName.trim() + "', '" + ref_pd_no_zip + "', '" + ref_pd_code_zip + "', '', 'N', now()); ";					
		
						}else{
							sql = "insert into vm_product_image(img_path, ref_pd_no, pd_code, group_tag, std_fg, reg_no, reg_date, lst_no, lst_date) "
							+" select '"+newFileName.trim()+"', pd_no, pd_code, group_tag, 'Y', reg_no, now(), lst_no, lst_date from vm_product where pd_code = '"+pdCode+"' limit 0,1; ";
						}
		
						pstmt = conn.prepareStatement(sql);
						pstmt.executeUpdate();

						createThumbnail(filePath1,filePath1,360);
						createThumbnail(filePath1,savePath +"180_"+ files[j].getName(),180);
						createThumbnail(filePath1,savePath +"90_"+ files[j].getName(),90);
						createThumbnail(filePath1,savePath +"720_"+ files[j].getName(),720);
						createThumbnail(filePath1,savePath +"45_"+ files[j].getName(),45);
						createThumbnail(filePath1,savePath +"1440_"+ files[j].getName(),1440);
					}else{
					}
				}
			  }
			}
			//out.print(newFileName.trim()); 
		}
		//out.print("pdCode:"+pdCode);
    }catch(Exception e){
		out.clear();
    	out.print("upload error,"+e);
    } 
%>