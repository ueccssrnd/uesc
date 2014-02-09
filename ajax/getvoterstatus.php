<?php
require '../includes/connectdb.php';
if(isset($_POST['studentNo'])){
    $query = "SELECT status FROM voter WHERE voterid=".mysql_real_escape_string($_POST['studentNo']);
    $result = mysql_query($query);
    $voter = mysql_fetch_assoc($result);
    if($voter===false)
        echo '{"exists":"false"}';
    else
        echo '{"exists":"true","status":"'.$voter['status'].'"}';
}
else{
    setMessage('Access Denied! You\'re not allowed to execute AJAX<br />files directly. Please login to continue.','../admin.php');
}
?>
