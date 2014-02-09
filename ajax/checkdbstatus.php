<?php
require '../includes/connectdb.php';
if(isset($_POST['request'])){
    if($_POST['request']=='checkdbstatus'){
        $xml = simplexml_load_file('../data/xml/settings.xml');
        for($i=0;$i<$xml->count();$i++){
            if((string)$xml->setting[$i]['name']=='status'){
                $status = '{"status":"connected","election":';
                switch((string)$xml->setting[$i]['value']){
                    case "1":
                        $status .= '"paused"}';
                        break;
                    case "2":
                        $status .= '"ongoing"}';
                        break;
                    default:
                        $status .= '"stopped"}';
                        break;
                }
                echo $status;
                break;
            }
        }
    }
}
else{
    setMessage('Access Denied! You\'re not allowed to execute AJAX<br />files directly. Please login to continue.','../admin.php');
}
?>
