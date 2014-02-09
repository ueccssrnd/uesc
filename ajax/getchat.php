<?php
define('DS',DIRECTORY_SEPARATOR);
$filename = '..'.DS.'data'.DS.'activity'.DS.'system.log';
if(file_exists($filename)){
    echo file_get_contents($filename);
}
else{
    fopen($filename, 'a+');
}
?>
