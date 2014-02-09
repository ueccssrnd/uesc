<?php
session_start();
include '../includes/utilities.php';
if(isset($_SESSION['agent'])&&$_SESSION['agent']==md5($_SERVER['HTTP_USER_AGENT'])&&isset($_SESSION['type'])&&($_SESSION['type']=='Administrator'||$_SESSION['type']=='Facilitator')){
    if(isset($_GET['index'])){
        require('../includes/connectdb.php');
        ini_set('max_execution_time',3600);
        $backUpDir = '..'.DIRECTORY_SEPARATOR.'data'.DIRECTORY_SEPARATOR.'backup';
        if(file_exists($backUpDir)){
            $dir = scandir($backUpDir);
            if(file_exists($backUpDir.DIRECTORY_SEPARATOR.$dir[$_GET['index']])){
                $file = fopen($backUpDir.DIRECTORY_SEPARATOR.$dir[$_GET['index']], 'r');
                while(!feof($file)){
                    if(trim(fgets($file))!='')
                        if(@mysql_query(mysql_real_escape_string(fgets($file))))
                            echo fgets($file).'<br />';
                }
            }
        }
    }
    else{
        setMessage('Access Denied! You\'re not allowed to execute AJAX<br />files directly. Please login to continue.','../admin.php');
    }
}
else{
    setMessage('Access Denied! You\'re not logged in<br />or the session has expired.','../admin.php');
}
?>
