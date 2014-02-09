<?php
ob_start();
session_start();
include 'includes/utilities.php';
$configFile = 'data/xml/settings.xml';
if(file_exists($configFile)){
    $configXML = simplexml_load_file($configFile);
    $host = (string)$configXML->setting[1]['value'];
    $user = (string)$configXML->setting[2]['value'];
    $password = base64_decode((string)$configXML->setting[3]['value']);
    $name = (string)$configXML->setting[4]['value'];

    $dbc = mysql_connect($host,$user,$password);
    if($dbc){
        if(!mysql_select_db($name,$dbc)){
            $filename = 'data'.DIRECTORY_SEPARATOR
                .'scheme'.DIRECTORY_SEPARATOR.'database.sql';
            if(!mysql_query(file_get_contents($filename),$dbc))
                setMessage('Oops! The server is temporarily down.<br />Please try again.');
        }
    }
//    else
//        setMessage('Oops! The server is temporarily down.<br />Please try again.');
//}
//else{
//    setMessage('Oops! The configuration file does not exist or is not accessible.');
}
?>
<!--
    Title:              UESC Election System
    Lead Developer:     Aaron Noel De Leon
    Date:               May 2012
    Version:            1.0.0
-->
<!DOCTYPE html>
<?php
function displayForm(){    
?>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>UESC Election | <?php echo $_POST['category'] ?></title>
        <link rel="shortcut icon" type="image/x-icon" href="images/favicon.ico" />
        <link rel="stylesheet" type="text/css" href="styles/core.css" />
        <link rel="stylesheet" type="text/css" href="styles/dropdown.css" />
        <link rel="stylesheet" type="text/css" href="styles/messagebox.css" />
        <link rel="stylesheet" type="text/css" href="styles/election.css" />
    </head>
    <body>
        <noscript>Please enable Javascript on your browser to continue.</noscript>
        <form method="post" id="votes">
        <div id="container">
            <div id="header">
                <?php
                if($_POST['category']=='USC'){
                    echo 'University Student Council';
                }
                else{
                    $xml = simplexml_load_file('data/xml/colleges.xml');
                    for($i=0;$i<$xml->count();$i++){
                        if($xml->college[$i]['abbr']==$_POST['category']){
                            echo $xml->college[$i]['name'];
                            break;
                        }
                    }
                }
                echo '<input type="hidden" value="'.
                        $_POST['category'].'" id="current" />';
                echo '<input type="hidden" name="category" value="';
                if($_SESSION['college']==$_POST['category'])
                    echo 'null';
                else {
                    echo $_SESSION['college'];
                }
                echo '" id="category" />';
                echo '<input type="hidden" name="yearlevel" value="'.
                        ($_SESSION['yearlevel']).'" id="yearlevel" />';
                ?>
            </div>
            <a href="javascript:void(0)" id="subheader">
                <span id="dropdownIndicator"></span>
            </a>
            <span id="corner"></span>
            <div id="sidebar"></div>
            <div id="dropdown"></div>
            <a href="javascript:void(0)" id="up"><span id="arrowUp"></span></a>
            <a href="javascript:void(0)" id="down"><span id="arrowDown"></span></a>
            <div id="content">
                <div id="candidates"></div>
            </div>
            <div id="controls"><a href="javascript:void(0)" id="prev" class="button">Prev</a><a href="javascript:void(0)" id="next" class="button">Next</a><a href="javascript:void(0)" id="submit" class="button">Submit</a></div>
            <div id="footer">&copy; Copyright <?php echo date('Y'); ?> UE-CCSS Research &amp; Development Unit 2012</div>
        </div>
        </form>
        <script type="text/javascript" src="packages/jquery/jquery.js"></script>
        <script type="text/javascript" src="js/core.js"></script>
        <script type="text/javascript" src="js/election.js"></script>
    </body>
</html>
<?php
}

if(isset($_SESSION['voterid'])&&isset($_SESSION['agent'])&&$_SESSION['agent']==md5($_SERVER['HTTP_USER_AGENT'])){
    if((count($_POST)>0)){
        $vs = getVoterStatus();
        if($_POST['category']=='USC'){
            if($vs==1)
                displayForm();
            else
                setMessage('Your vote has been interrupted.<br />Please login to continue.');
        }
        else if($_POST['category']==$_SESSION['college']){
            if($vs==1){
                recordVotes();
                setVoterStatus(2);
            }
            else if($_SERVER['HTTP_REFERER']=='http://'.$_SERVER['SERVER_NAME'].'/uesc/election.php'||$_SERVER['HTTP_REFERER']=='https://'.$_SERVER['SERVER_NAME'].'/uesc/election.php')
                setMessage('Oops! It seems like you&#039;ve already voted for USC.<br />Your votes were not resubmitted.');
            displayForm();
        }
        else if($_POST['category']=='null'){
            if($vs==2){
                recordVotes();
                setVoterStatus(3);
                header('Location: ajax/logout.php');
            }
            else
                setMessage('Oops! It seems like you&#039;ve already finished voting.<br />Your votes were not resubmitted.');
        }
    }else
        setMessage('Your vote has been interrupted.<br />Please login to continue.');
}
else
    setMessage('You&#039;re not logged in or the session has expired.<br />Please login to continue.');

ob_end_flush();
?>