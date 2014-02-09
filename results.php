<?php
ob_start();
session_start();
include('includes/utilities.php');
if(isset($_SESSION['agent'])&&$_SESSION['agent']==md5($_SERVER['HTTP_USER_AGENT'])&&isset($_SESSION['type'])&&($_SESSION['type']=='Administrator'||$_SESSION['type']=='Facilitator')){
    if($_SESSION['type']=='Administrator'){
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
        <title>UESC Election | Results</title>
        <link rel="shortcut icon" type="image/x-icon" href="images/favicon.ico" />
        <link rel="stylesheet" type="text/css" href="styles/core.css" />
        <link rel="stylesheet" type="text/css" href="styles/sidebarinput.css" />
        <link rel="stylesheet" type="text/css" href="styles/messagebox.css" />
        <link rel="stylesheet" type="text/css" href="styles/results.css" />
    </head>
    <body>
        <noscript>Please enable Javascript on your browser to continue.</noscript>
        <div id="container">
            <div id="header">
                UESC Administration Panel
                <a target="blank" href="reports.php?category=ALL" class="headericon" id="icoPrintAll" title="Generate PDF for ALL"></a>
                <a target="blank" href="reports.php?category=USC" class="headericon" id="icoPrint" title="Generate PDF for USC"></a>
                <a href="dashboard.php" class="headericon" id="icoDashboard" title="Dashboard"></a>
            </div>
            <a href="javascript:void(0)" id="subheader">Election Results</a>
            <span id="corner"></span>
            <div id="sidebar">
                <div class="fieldDescription">Category</div>
                <select id="cboCategory" class="sidebarInputField"></select>
                <div class="fieldDescription">Position</div>
                <select id="cboPosition" class="sidebarInputField"></select>
            </div>
            <div id="content">
                <div id="candidates"></div>
            </div>
            <div id="footer">&copy; Copyright <?php echo date('Y'); ?> UE-CCSS Research &amp; Development Unit 2012</div>
        </div>
        <script type="text/javascript" src="packages/jquery/jquery.js"></script>
        <script type="text/javascript" src="js/core.js"></script>
        <script type="text/javascript" src="js/results.js"></script>
    </body>
</html>
<?php
    }
    else{
        setMessage('Access Denied! Privilege not granted.<br />Please login to continue.','admin.php');
    }
}
else{
    setMessage('Access Denied! You\'re not logged in<br />or the session has expired.','admin.php');
}
ob_end_flush();
?>