<?php
session_start();
include '../includes/utilities.php';
if(isset($_SESSION['agent'])&&$_SESSION['agent']==md5($_SERVER['HTTP_USER_AGENT'])&&isset($_SESSION['type'])&&($_SESSION['type']=='Administrator'||$_SESSION['type']=='Facilitator')){
    if(count($_POST)>0){
        header("Content-Description: File Transfer");
        header("Content-Type: application/force-download");
        header("Content-Disposition: attachment; filename=\"UESCElection".date('Y').".zip\"");

        $dir = array(
            '..'.DIRECTORY_SEPARATOR.'images'.DIRECTORY_SEPARATOR.'candidates',
            '..'.DIRECTORY_SEPARATOR.'data'.DIRECTORY_SEPARATOR.'reports',
            '..'.DIRECTORY_SEPARATOR.'data'.DIRECTORY_SEPARATOR.'spreadsheets',
            '..'.DIRECTORY_SEPARATOR.'data'.DIRECTORY_SEPARATOR.'backup',
            '..'.DIRECTORY_SEPARATOR.'data'.DIRECTORY_SEPARATOR.'xml'
        );

        $zip = new ZipArchive();
        $zip->open('UESCElection'.date('Y').'.zip',ZipArchive::OVERWRITE);

        for($i=0;$i<count($dir);$i++){
            $dirName = substr($dir[$i],strrpos($dir[$i],DIRECTORY_SEPARATOR)+1);
            if(file_exists($dir[$i])&&isset($_POST[$dirName])){
                $folder = scandir($dir[$i]);
                $zip->addEmptyDir($dirName);
                foreach($folder as $file){
                    if($file!='.'&&$file!='..'&&$file!='index.php'){
                        $zip->addFile($dir[$i].DIRECTORY_SEPARATOR.$file, $dirName.DIRECTORY_SEPARATOR.$file);
                    }
                }
            }
        }

        $zip->close();
        logActivity('System files have been downloaded by '.$_SESSION['username'].'.');
        if(readfile('UESCElection'.date('Y').'.zip'))
            @unlink('UESCElection'.date('Y').'.zip');
    }
    else
        setMessage('Access Denied! You\'re not allowed to execute AJAX<br />files directly. Please login to continue.','../admin.php');
}
else{
    setMessage('Access Denied! You\'re not logged in<br />or the session has expired.','../admin.php');
}
?>
