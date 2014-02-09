<?php
ob_start();
session_start();
include('includes/utilities.php');
if(isset($_SESSION['agent'])&&$_SESSION['agent']==md5($_SERVER['HTTP_USER_AGENT'])&&isset($_SESSION['type'])&&($_SESSION['type']=='Administrator'||$_SESSION['type']=='Facilitator')){
?>
<!--
    Title:              UESC Election System
    Lead Developer:     Aaron Noel De Leon
    Date:               May 2012
    Version:            1.0.0
-->
<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>UESC Election | Registration</title>
        <link rel="shortcut icon" type="image/x-icon" href="images/favicon.ico" />
        <link rel="stylesheet" type="text/css" href="styles/core.css" />
        <link rel="stylesheet" type="text/css" href="styles/messagebox.css" />
        <link rel="stylesheet" type="text/css" href="styles/status.css" />
        <link rel="stylesheet" type="text/css" href="styles/sidebarfield.css" />
        <link rel="stylesheet" type="text/css" href="styles/sidebarinput.css" />
    </head>
    <body>
        <noscript>Please enable Javascript on your browser to continue.</noscript>
        <div id="container">
            <div id="header">
                UE Student Council Election <?php echo date('Y'); ?>
                <a href="dashboard.php" class="headericon" id="icoDashboard" title="Dashboard"></a>
            </div>
            <div id="subheader">Voter Registration</div>
            <span id="corner"></span>
            <div id="sidebar">
                <div class="fieldDescription">Student No.</div>
                <input type="text" class="sidebarInputField" id="studentNo" maxlength="11" />
                <a href="javascript:void(0)" class="sidebarButton button" id="btnRegister">Register</a>
            </div>
            <div id="content"></div>
            <div id="footer">&copy; Copyright <?php echo date('Y'); ?> UE-CCSS Research &amp; Development Unit 2012</div>
        </div>
        <script type="text/javascript" src="packages/jquery/jquery.js"></script>
        <script type="text/javascript" src="js/core.js"></script>
        <script type="text/javascript" src="js/registration.js"></script>
    </body>
</html>
<?php
}
else{
    setMessage('Access Denied! You\'re not logged in<br />or the session has expired.','admin.php');
}
ob_end_flush();
?>