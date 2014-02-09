<?php
function getVoterStatus(){
    if(count($_SESSION)>0){
        $query = "SELECT status FROM voter WHERE voterid=".$_SESSION['voterid'];
        $result = mysql_query($query);
        $voter = mysql_fetch_assoc($result);
        return $voter['status'];
    }
    return false;
}

function toRep($i){
    switch($i){
        case "1": return "2nd Yr. Rep.";
        case "2": return "3rd Yr. Rep.";
        case "3": return "4th Yr. Rep.";
        case "4": return "5th Yr. Rep.";
        default: return $i;
    }
}

function setVoterStatus($value){
    if(count($_SESSION)>0){
        $query = "UPDATE voter SET status=".$value." WHERE voterid=".$_SESSION['voterid'];
        mysql_query($query);
    }
}

function recordVotes(){
    for($i=0;$i<count($_POST['vote']);$i++){
        if($_POST['vote'][$i]!=''){
            $query = "INSERT INTO vote (voterid,candidateid) VALUES(".
                    $_SESSION['voterid'].",".$_POST['vote'][$i].")";
            mysql_query($query);
        }
    }
}

function logActivity($message){
    $filename = '..'.DIRECTORY_SEPARATOR.'data'.DIRECTORY_SEPARATOR.'activity'.DIRECTORY_SEPARATOR.'system.log';
    $stream = fopen($filename,'a+');
    $message = '<div class="system"><span>System Notification</span><span>'.date('g:i:s A')
            .'</span><span>'.$message.'</span></div>';
    flock($stream,LOCK_EX);
    fwrite($stream, $message);
    fclose($stream);
}

function getResults($category,$candidateid,$represents,$college=''){
    $count = 'SELECT COUNT(candidateid) FROM vote,voter WHERE
        voter.voterid=vote.voterid AND vote.candidateid='.$candidateid;
    $total = 'SELECT COUNT(voterid) FROM voter';
    if($category!='USC')
        $total .= " WHERE status>2 AND college='".$category."'";
    else
        $total .= ' WHERE status>1';
    if($represents>0){
        $total .= " AND yearlevel=".$represents;
        $count .= " AND voter.yearlevel='".$represents."'";
    }
    if($college!=''){
        $total .= " AND college='".$college."'";
        $count .= " AND voter.college='".$college."'";
    }
    $result = mysql_query($count);
    $count = mysql_fetch_row($result);
    $count = $count[0];
    $result = mysql_query($total);
    $total = mysql_fetch_row($result);
    $total = $total[0];
    $percentage = 0;
    if($total!=0)
        $percentage = round((double)($count/$total), 4)*100;
    if($percentage>100)
        $percentage = 100;
    $resultset = array('count'=>number_format($count),'total'=>number_format($total),'percentage'=>$percentage.'%');
    return $resultset;
}

function setMessage($message,$path='index.php'){
    echo '<html>
            <head>
                <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
                <title></title>
            </head>
            <body>
                <form id="frmMessage" method="post" action="'.$path.'">
                    <input type="hidden" name="message" value="'.$message.'" />
                </form>
            <script type="text/javascript">
                document.getElementById("frmMessage").submit();
            </script>
            </body>
          </html>';
}

date_default_timezone_set('Asia/Manila');
error_reporting(E_ALL);
ini_set('display_errors','Off');
ini_set('log_errors', 'On');
ini_set('error_log', '..'.DIRECTORY_SEPARATOR.'data'.DIRECTORY_SEPARATOR.'activity'.DIRECTORY_SEPARATOR.'error.log');
?>