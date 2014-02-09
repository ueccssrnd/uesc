<?php
ob_start();
require '../includes/connectdb.php';

if(isset($_POST['studentNo'])){
    $query = "SELECT * FROM voter WHERE voterid='".mysql_real_escape_string(htmlentities($_POST['studentNo']))."'";
    $result = mysql_query($query,$dbc);
    $voter = mysql_fetch_assoc($result);
    if($voter!==false){
        switch($voter['status']){
            case 0:
                echo '{"focus":"studentNo","title":"Access Denied","message":"User not registered."}';
                break;
            case 1:
                echo '{"status":1,"title":"Login Successful","message":"You will now proceed to USC Election."}';
                break;
            case 2:
                echo '{"status":2,"title":"Login Successful","message":"You&#039;ve already voted for USC.<br />You will now proceed to CSC Election.","college":"'.$voter['college'].'"}';
                break;
            case 3:
                echo '{"focus":"studentNo","title":"Access Denied","message":"User has already voted."}';
                break;
            default:
                echo '{"focus":"studentNo","title":"Access Denied","message":"User not recognized."}';
        }
        if($voter['status']==1||$voter['status']==2){
            session_start();
            $_SESSION['voterid'] = $voter['voterid'];
            $_SESSION['college'] = $voter['college'];
            $_SESSION['yearlevel'] = $voter['yearlevel'];
            $_SESSION['agent'] = md5($_SERVER['HTTP_USER_AGENT']);
            session_set_cookie_params(3*60);
        }
    }
    else{
        echo '{"focus":"studentNo","title":"Access Denied","message":"User not found."}';
    }
}
else{
    setMessage('Access Denied! You\'re not allowed to execute AJAX<br />files directly. Please login to continue.','../admin.php');
}
ob_end_flush();

?>
