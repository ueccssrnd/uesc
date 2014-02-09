<?php
session_start();
require '../includes/connectdb.php';
if(isset($_SESSION['agent'])&&$_SESSION['agent']==md5($_SERVER['HTTP_USER_AGENT'])&&isset($_SESSION['type'])&&$_SESSION['type']=='Administrator'){
    if(isset($_POST['action'])){
        if($_POST['action']=='loadvoters'){
            $search = mysql_real_escape_string(trim($_POST['search']));
            $query = 'SELECT * FROM voter';
            if($search!=''){
                if(is_numeric($search))
                    $query .= " WHERE voterid LIKE '".$search."%'
                           OR yearlevel=".$search.
                        " OR status=".$search;
                else
                    $query .= " WHERE college LIKE '".$search."'";
            }
            $query .= ' ORDER BY '.$_POST['orderBy'].' '.$_POST['order'].' LIMIT '.$_POST['limit'];
            $result = mysql_query($query);
            echo '<table cellspacing="0" id="listview">
                    <tr>
                        <th width="30%" onclick="sortVotersList(\'voterid\');">Student No.</th>
                        <th width="20%" onclick="sortVotersList(\'college\');">College</th>
                        <th width="20%" onclick="sortVotersList(\'yearlevel\');">Year</th>
                        <th width="30%" onclick="sortVotersList(\'status\');">Status</th>
                    </tr>';
            if($result!==false){
                $i = 0;
                while($row = mysql_fetch_assoc($result)){
                    if($i%2==0)
                        echo '<tr class="lightrow" id="row'.++$i.'" onclick="selectRow('.$i.');">';
                    else
                        echo '<tr class="darkrow" id="row'.++$i.'" onclick="selectRow('.$i.');">';
                    echo '<td>'.$row['voterid'].'</td>';
                    echo '<td>'.$row['college'].'</td>';
                    echo '<td>'.$row['yearlevel'].'</td>';
                    switch($row['status']){
                        case 0:
                            echo '<td>Recorded</td>';
                            break;
                        case 1:
                            echo '<td>Registered</td>';
                            break;
                        case 2:
                            echo '<td>Voted for USC</td>';
                            break;
                        case 3:
                            echo '<td>Voted for CSC</td>';
                            break;
                    }
                    echo '</tr>';
                }
                if($i==0)
                    echo '<tr><td colspan="4">Oops! Your query returned 0 results.</td></tr>';
            }
            else{
                echo '<tr><td colspan="4">Oops! Your query returned 0 results.</td></tr>';
            }
            echo '</table>';
        }
        else if($_POST['action']=='addvoter'){
            $query = "INSERT INTO voter(voterid,college,yearlevel)
                VALUES(".mysql_real_escape_string(htmlentities($_POST['studentNo'])).",'".
                    mysql_real_escape_string($_POST['college'])."',".
                    mysql_real_escape_string($_POST['yearlevel']).")";
            mysql_query($query);
        }
        else if($_POST['action']=='editvoter'){
            $query = "UPDATE voter SET college='".
                    mysql_real_escape_string($_POST['college'])
                    ."', yearlevel=".mysql_real_escape_string($_POST['yearlevel']).
                    " WHERE voterid=".$_POST['studentNo'];
            mysql_query($query);
        }
        else if($_POST['action']=='deletevoter'){
            $query = "DELETE FROM voter WHERE voterid=".
                    mysql_real_escape_string($_POST['studentNo']);
            mysql_query($query);
            $query = "DELETE FROM vote WHERE voterid=".
                mysql_real_escape_string($_POST['studentNo']);
            mysql_query($query);
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