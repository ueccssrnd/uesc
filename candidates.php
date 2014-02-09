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
        <title>UESC Election | Candidates</title>
        <link rel="shortcut icon" type="image/x-icon" href="images/favicon.ico" />
        <link rel="stylesheet" type="text/css" href="styles/core.css" />
        <link rel="stylesheet" type="text/css" href="styles/messagebox.css" />
        <link rel="stylesheet" type="text/css" href="styles/sidebarinput.css" />
        <link rel="stylesheet" type="text/css" href="styles/candidates.css" />
    </head>
    <body>
        <noscript>Please enable Javascript on your browser to continue.</noscript>
        <div id="container">
            <div id="header">
                UESC Administration Panel
                <a href="settings.php" class="headericon" id="icoSettings" title="Settings"></a>
                <a href="dashboard.php" class="headericon" id="icoDashboard" title="Dashboard"></a>
            </div>
            <a href="javascript:void(0)" id="subheader">Candidates</a>
            <span id="corner"></span>
            <div id="sidebar">
                <div class="fieldDescription">Category</div>
                <select id="cboCategory" class="sidebarInputField"></select>
                <div class="fieldDescription">Position</div>
                <select id="cboPosition" class="sidebarInputField"></select>
                <div id="buttonSet">
                    <a href="javascript:void(0)" class="small button" id="btnAdd">Add</a>
                    <a href="javascript:void(0)" class="small button" id="btnDelete">Delete</a>
                    <a href="javascript:void(0)" class="small button" id="btnEdit">Edit</a>
                </div>
            </div>
            <div id="content">
                <div id="candidates"></div>
            </div>
            <div id="light">
                <div id="candidatePanel">
                    <div class="upload" id="uploading"><span class="icoUpload"></span>Uploading..</div>
                    <a href="javascript:void(0)" class="upload" id="upload"><span class="icoUpload"></span>Upload Photo</a>
                    <div class="titleBar"><span id="panelTitle">Candidate</span>
                    <a href="javascript:void(0)" class="close" id="closePanel"></a></div>
                    <img src="images/uesilhouette.png" class="avatar" id="image" />
                    <div id="panelLabel">Candidate Details</div>
                    <input type="text" id="lastName" class="panelInput" placeholder="Last Name" />
                    <input type="text" id="firstName" class="panelInput" placeholder="First Name" />
                    <input type="text" id="middleInitial" class="panelInput" maxlength="2" placeholder="MI" />
                    <select id="category" class="panelInput" disabled="disabled">
                        <option>USC</option>
                        <option>CSC</option>
                    </select>
                    <select id="position" class="panelInput" disabled="disabled"></select>
                    <select id="party" class="panelInput">
                        <option>Party</option>
                    </select>
                    <select id="college" class="panelInput">
                        <option value="0">College</option>
                    </select>
                    <input type="text" id="major" maxlength="10" class="panelInput" placeholder="Major" />
                    <select id="yearLevel" class="panelInput">
                        <option>Year Level</option>
                    </select>
                </div>
            </div>
            <div id="footer">&copy; Copyright <?php echo date('Y'); ?> UE-CCSS Research &amp; Development Unit 2012</div>
        </div>
        <script type="text/javascript" src="packages/jquery/jquery.js"></script>
        <script type="text/javascript" src="packages/plupload/plupload.js"></script>
        <script type="text/javascript" src="packages/plupload/plupload.flash.js"></script>
        <script type="text/javascript" src="packages/plupload/plupload.html4.js"></script>
        <script type="text/javascript" src="packages/plupload/plupload.html5.js"></script>
        <script type="text/javascript" src="js/core.js"></script>
        <script type="text/javascript" src="js/candidates.js"></script>
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