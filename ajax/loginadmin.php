<?php
include '../includes/utilities.php';
if(isset($_POST['username'])&&isset($_POST['password'])){
    $xml = simplexml_load_file('../data/xml/accounts.xml');
    $found = false;
    for($i=0;$i<$xml->count();$i++){
        if((string)$xml->account[$i]['username']==htmlentities($_POST['username'])){
            $found = true;
            break;
        }
    }
    if($found){
        $admin = $xml->account[$i];
        if((string)$admin['password']==md5($_POST['password'])){
            session_start();
            $_SESSION['username'] = (string)$admin['username'];
            $_SESSION['password'] = (string)$admin['password'];
            $_SESSION['type'] = (string)$admin['type'];
            $_SESSION['agent'] = md5($_SERVER['HTTP_USER_AGENT']);
            session_set_cookie_params(24*60);
            logActivity($_SESSION['username'].' logged in.');
            echo '{"title":"Login Successful","message":"You will now proceed to the Admin Panel."}';
        }
        else{
            echo '{"focus":"password","title":"Access Denied","message":"Password didn&#039;t match."}';
        }
    }
    else{
        echo '{"focus":"username","title":"Access Denied","message":"User not found."}';
    }
}
else{
    setMessage('Access Denied! You\'re not allowed to execute AJAX<br />files directly. Please login to continue.','../admin.php');
}
?>
