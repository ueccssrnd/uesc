<?php
include '../includes/utilities.php';
if(isset($_POST['action'])&&$_POST['action']=='getpositions'){
    $xml = simplexml_load_file('../data/xml/positions.xml');
    echo $xml->asXML();
}
else if(isset($_POST['category'])){
    $xmlCandidates = simplexml_load_file('../data/xml/candidates.xml');
    if($_POST['category']=='ALL'){
        echo $xmlCandidates->asXML();
    }
    else{
        $found = false;
        for($i=0;$i<$xmlCandidates->count();$i++){
            if($xmlCandidates->category[$i]['name']==$_POST['category']
               && $xmlCandidates->category[$i]->count()>0){
                echo $xmlCandidates->category[$i]->asXML();
                $found = true;
                break;
            }
        }
        if(!$found){
            echo '<candidate id="null" />';
        }
    }
}
else{
    setMessage('Access Denied! You\'re not allowed to execute AJAX<br />files directly. Please login to continue.','../admin.php');
}
?>