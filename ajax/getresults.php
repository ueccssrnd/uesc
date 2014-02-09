<?php
session_start();
if(isset($_SESSION['agent'])&&$_SESSION['agent']==md5($_SERVER['HTTP_USER_AGENT'])&&isset($_SESSION['type'])&&($_SESSION['type']=='Administrator'||$_SESSION['type']=='Facilitator')){
    if(isset($_POST['action'])&&$_POST['action']=='getresults'){
        require '../includes/connectdb.php';
        $xml = simplexml_load_file('../data/xml/candidates.xml');
        for($i=0;$i<$xml->count();$i++){
            for($j=0;$j<$xml->category[$i]->count();$j++){
                $candidate = $xml->category[$i]->candidate[$j];
                $resultset = getResults((string)$xml->category[$i]['name'],(string)$candidate['id'],
                (string)$candidate['position']=='Representative'?(int)$candidate['yearlevel']:0);
                $candidate->addAttribute('count', $resultset['count']);
                $candidate->addAttribute('total', $resultset['total']);
                $candidate->addAttribute('percentage', $resultset['percentage']);
            }
        }
        echo $xml->asXML();
    }
    else{
        include '../includes/utilities.php';
        setMessage('Access Denied! You\'re not allowed to execute AJAX<br />files directly. Please login to continue.','../admin.php');
    }
}
else{
    include '../includes/utilities.php';
    setMessage('Access Denied! You\'re not logged in<br />or the session has expired.','../admin.php');
}
?>