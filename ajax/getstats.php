<?php
require '../includes/connectdb.php';

$stats = '';

function getVoterCount($college='',$all=false){
    $total = 'SELECT COUNT(voterid) FROM voter';
    if($college!='')
        $total .= " WHERE college='".$college."'";
    if(!$all){
        if($college!='')
            $total .= ' AND ';
        else
            $total .= ' WHERE ';
        $total .= 'status>0';
    }
    $total = mysql_query($total);
    $total = mysql_fetch_array($total);
    return number_format($total[0]);
}

$colleges = simplexml_load_file('../data/xml/colleges.xml');
for($i=0;$i<$colleges->count();$i++){
    $college = (string)$colleges->college[$i]['abbr'];
    $stats .= '<span><span>'.$college.' Voters</span>'
            .getVoterCount($college).'/'
            .getVoterCount($college,true).'</span>';
}
$stats .= '<span><span>Total Voters</span>'
        .getVoterCount('').'/'
        .getVoterCount('',true).'</span>';

echo $stats;

?>
