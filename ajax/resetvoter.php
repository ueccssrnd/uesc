<?php
session_start();
require '../includes/connectdb.php';
if(isset($_SESSION['agent'])&&$_SESSION['agent']==md5($_SERVER['HTTP_USER_AGENT'])&&isset($_SESSION['type'])&&($_SESSION['type']=='Administrator'||$_SESSION['type']=='Facilitator')){
    if(isset($_POST['studentNo'])){
        $deleteQuery = "DELETE FROM vote WHERE voterid=".mysql_real_escape_string($_POST['studentNo']);
        $updateQuery = "UPDATE VOTER SET status=1 WHERE voterid=".mysql_real_escape_string($_POST['studentNo']);
        if(mysql_query($deleteQuery)&&mysql_query($updateQuery))
            echo '{"title":"Reset Successful","message":"User&#039;s votes have been reset."}';
        else
            echo '{"title":"Reset Failed","message":"Please try again."}';
    }
    else{
        setMessage('Access Denied! You\'re not allowed to execute AJAX<br />files directly. Please login to continue.','../admin.php');
    }
}
else{
    setMessage('Access Denied! You\'re not logged in<br />or the session has expired.','../admin.php');
}
?>
