<%@ page language="java" contentType="text/html; charset=UTF-8" %>
 
<%@page import="com.oreilly.servlet.MultipartRequest" %>
<%@page import="com.oreilly.servlet.multipart.DefaultFileRenamePolicy" %>
<%@page import="java.io.*" %>
<%@ page import="java.sql.*" %>
<%@page import="java.util.*" %>
<%@page import="java.text.SimpleDateFormat" %>

<%@ include file = "../00_include/dbConn.jsp" %>
<%@ include file = "../00_include/imgResize.jsp" %>
 
<%
    request.setCharacterEncoding("UTF-8");

    //영문 + 숫자 난수 만들기
	Random rnd =new Random();
	
	StringBuffer ran =new StringBuffer();
		
	for(int i=0;i<10;i++){
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
 
        MultipartRequest multi = new MultipartRequest(request, tempPath, maxSize, "UTF-8", new DefaultFileRenamePolicy());

        // 파일업로드
        uploadFile = multi.getFilesystemName("uploadFile[]");
//        newFileName = simDf.format(new java.util.Date(currentTime))+"_"+ uploadFile;
		newFileName = uploadFile;

//		String pdCode = multi.getParameter("pdCode");

		File oldFile = null;
		File newFile = null;

		// 업로드된 파일 객체 생성
		oldFile = new File(tempPath + uploadFile);
		
		 
		/* mimetype 으로 객체 생성장소를 분기한다. */
		String mimeType = getServletContext().getMimeType(tempPath + newFileName);
		String curr = "";
		if (mimeType == "application/zip"){

			// 실제 저장될 파일 객체 생성
//			newFile = new File(tempPath + newFileName);

			String filePath11 = tempPath + newFileName;
			int pos1 = filePath11.lastIndexOf( "." );
			String fileExt = filePath11.substring( pos1 + 1 );

			double dValue = Math.random();
			int iValue = (int)(dValue * 10000);

			newFile = new File(tempPath + Integer.toString(iValue) + "." + fileExt);
			newFileName = Integer.toString(iValue) + "." + fileExt;	

		}else{
			// 실제 저장될 파일 객체 생성
			curr = simDf.format(new java.util.Date(currentTime))+"_";
			newFile = new File(savePath + curr + newFileName);
		}

		

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
		
        if (mimeType == "application/zip"){

			String cmd = "cmd /c bandizip x -y -aou "+tempPath+newFileName;
   
		   Runtime rt = Runtime.getRuntime();
		   Process p = rt.exec( cmd );
		   p.waitFor();
		   p.destroy();

           String fileDir = "/temp"; //파일을 보여줄 디렉토리
		   String filePath = request.getRealPath(fileDir) + "/"; //파일이 존재하는 실제경로

		   File f = new File(filePath);
		   File [] files = f.listFiles(); //파일의 리스트를 대입

		   File asisFile = null;
		   File tobeFile = null;

		   String filePath1 = "";
		   int pos = 0;
		   String fileName_img_zip = "";
		   String fileExt1 = "";

		   for ( int i = 0; i < files.length; i++ ) {
			 if ( files[i].isFile()){

				asisFile = new File(tempPath + files[i].getName());
				tobeFile = new File(savePath + files[i].getName());

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
				filePath1 = savePath + files[i].getName();
				pos = filePath1.lastIndexOf( "." );
				fileName_img_zip = filePath1.substring( 1, pos );
			    fileName_img_zip = fileName_img_zip.substring(fileName_img_zip.length()-13, fileName_img_zip.length());
				fileExt1 = filePath1.substring( pos + 1 );
				
				if ( fileExt1.equals("jpg") || fileExt1.equals("jpeg") ){
					createThumbnail(filePath1,filePath1,360);
					createThumbnail(filePath1,savePath +"180_"+ files[i].getName(),180);
					createThumbnail(filePath1,savePath +"90_"+ files[i].getName(),90);
					createThumbnail(filePath1,savePath +"720_"+ files[i].getName(),720);
					createThumbnail(filePath1,savePath +"45_"+ files[i].getName(),45);
					createThumbnail(filePath1,savePath +"1440_"+ files[i].getName(),1440);

					/* 이미지마스터에 insert 한다. */

					// 신규입력한 전단컨텐츠상품의 전단번호를 temp 테이블에서 select 한다.
					sql = " select pd_no as ref_pd_no from vm_product where pd_code =  '" + fileName_img_zip + "'; " ;

					stmt = conn.createStatement();
					rs = stmt.executeQuery(sql);
					
					Integer ref_pd_no_zip = 0;
					rs.last();
					int listCount0 = rs.getRow();
					if(listCount0 == 0){
		//				out.clear();
		//				out.print("NoN0_"+string1);
		//				return;
						ref_pd_no_zip = -1;
					};
					rs.beforeFirst();	
					
					while(rs.next()){
						ref_pd_no_zip = rs.getInt("ref_pd_no");     // 신규 전단번호
					}
					
					if ( ref_pd_no_zip == -1 ){
						sql = "insert into vm_product_image (img_path, pd_code, group_tag, std_fg, reg_date) "
							 +" values('"+files[i].getName()+"', '"+fileName_img_zip+"', '', 'N', now()); ";
					}else{
						sql = "insert into vm_product_image (img_path, ref_pd_no, pd_code, group_tag, std_fg, reg_date) "
							 +" values('"+files[i].getName()+"', "+ref_pd_no_zip+", '"+fileName_img_zip+"', '', 'N', now()); ";
					}

					pstmt = conn.prepareStatement(sql);
					pstmt.executeUpdate();

				}else{
				}
			}
		  }

		}else if (mimeType == "image/jpeg" || mimeType == "image/png"){
			/* 파일 확장자 추출하여 jpg 또는 jpeg 일경우 이미지 resize 한다. */
			newFileName = curr + newFileName;
			String filePath_img = savePath + newFileName;
			Integer pos_img = filePath_img.lastIndexOf( "." );
			String fileName_img = filePath_img.substring( 1, pos_img );
			       fileName_img = fileName_img.substring(fileName_img.length()-13, fileName_img.length());
			String fileExt_img = filePath_img.substring( pos_img + 1 );
					
			if ( fileExt_img.equals("jpg") || fileExt_img.equals("jpeg") ){
				createThumbnail(filePath_img,filePath_img,360);
				createThumbnail(filePath_img,savePath +"180_"+ newFileName,180);
				createThumbnail(filePath_img,savePath +"90_"+ newFileName,90);
				createThumbnail(filePath_img,savePath +"720_"+ newFileName,720);
				createThumbnail(filePath_img,savePath +"45_"+ newFileName,45);
				createThumbnail(filePath_img,savePath +"1440_"+ newFileName,1440);
			}else{
			}

			/* 이미지마스터에 insert 한다. */

			// 신규입력한 전단컨텐츠상품의 전단번호를 temp 테이블에서 select 한다.
			sql = " select pd_no as ref_pd_no from vm_product where pd_code =  '" + fileName_img + "'; " ;

			stmt = conn.createStatement();
			rs = stmt.executeQuery(sql);
			
			Integer ref_pd_no = 0;
			rs.last();
			int listCount0 = rs.getRow();
			if(listCount0 == 0){
//				out.clear();
//				out.print("NoN0_"+string1);
//				return;
				ref_pd_no = -1;
			};
			rs.beforeFirst();	
			
			while(rs.next()){
				ref_pd_no = rs.getInt("ref_pd_no");     // 신규 전단번호
			}
			
			if ( ref_pd_no == -1 ){
				sql = "insert into vm_product_image (img_path, pd_code, group_tag, std_fg, reg_date) "
					 +" values('"+newFileName+"', '"+fileName_img+"', '', 'N', now()); ";
			}else{
				sql = "insert into vm_product_image (img_path, ref_pd_no, pd_code, group_tag, std_fg, reg_date) "
					 +" values('"+newFileName+"', "+ref_pd_no+", '"+fileName_img+"', '', 'N', now()); ";
			}

			pstmt = conn.prepareStatement(sql);
			pstmt.executeUpdate();

		}else{

		}

		out.print(newFileName.trim()); 
 
    }catch(Exception e){
        
      	out.println(e.getMessage());
    	out.print("upload error");
//         e.printStackTrace();
    } 
%>