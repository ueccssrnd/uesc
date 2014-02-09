<?php
$backupDir = '..'.DIRECTORY_SEPARATOR.'data'.DIRECTORY_SEPARATOR.'backup';
if(file_exists($backupDir)){
    $dir = scandir($backupDir,1);
    $filename = $dir[$_POST['index']];
}
header("Content-Description: File Transfer");
header("Content-Type: application/force-download");
header("Content-Disposition: attachment; filename=\"".$filename."\"");
readfile($backupDir.DIRECTORY_SEPARATOR.$filename);
?>
