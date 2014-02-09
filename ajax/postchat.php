<?php
if(count($_POST)>0){
    date_default_timezone_set('Asia/Manila');
    define('DS',DIRECTORY_SEPARATOR);
    $filename = '..'.DS.'data'.DS.'activity'.DS.'system.log';
    $stream = fopen($filename,'a+');
    $message = '<div><span>'.$_POST['user'].'</span><span>'.date('g:i:s A')
            .'</span><span>'.htmlspecialchars(trim($_POST['message'])).'</span></div>';
    fwrite($stream, $message);
    fclose($stream);
    echo file_get_contents($filename);
}
?>