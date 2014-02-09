<?php
include '../includes/utilities.php';
if(isset($_SERVER['HTTP_REFERER'])&&($_SERVER['HTTP_REFERER']=='http://'.$_SERVER['SERVER_NAME'].'/uesc/election.php'||$_SERVER['HTTP_REFERER']=='https://'.$_SERVER['SERVER_NAME'].'/uesc/election.php'))
    setMessage('Your vote has been submitted successfully.<br />Thank you for voting.','../');
else{
    if(strpos($_SERVER['HTTP_REFERER'],'dashboard')){
        session_start();
        if(isset($_SESSION['username']))
            logActivity($_SESSION['username'].' logged out.');
    }
    setMessage('Logout successful.<br />It&#039;s now safe to leave the computer.','../admin.php');
}?>