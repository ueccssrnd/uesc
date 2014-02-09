<?php
session_start();
require '../includes/connectdb.php';
if(isset($_SESSION['agent'])&&$_SESSION['agent']==md5($_SERVER['HTTP_USER_AGENT'])&&isset($_SESSION['type'])&&($_SESSION['type']=='Administrator'||$_SESSION['type']=='Facilitator')){
    if(isset($_POST['studentNo'])){
        $query = "SELECT voterid,status FROM voter WHERE voterid='".mysql_real_escape_string($_POST['studentNo'])."'";
        $result = mysql_query($query);
        $voter = mysql_fetch_assoc($result);
        if($voter!==false){
            switch($voter['status']){
                case 0:
                    $query = "UPDATE voter SET status=1 WHERE voterid=".$voter['voterid'];
                    if(mysql_query($query))
                        echo '{"title":"Registration Successful","message":"Voter has been registered."}';
                    else
                        echo '{"title":"Registration Failed","message":"Please try again."}';
                    break;
                case 1:
                    echo '{"title":"Registration Failed","message":"Voter already registered."}';
                    break;
                case 2:
                    echo '{"title":"Registration Failed","message":"User has already voted for USC."}';
                    break;
                case 3:
                    echo '{"title":"Registration Failed","message":"User has already voted."}';
                    break;
            }
        }
        else{
            echo '{"title":"Registration Failed","message":"Voter doesn\'t exist."}';
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