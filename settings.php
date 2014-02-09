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
        <title>UESC Election | Settings</title>
        <link rel="shortcut icon" type="image/x-icon" href="images/favicon.ico" />
        <link rel="stylesheet" type="text/css" href="styles/core.css" />
        <link rel="stylesheet" type="text/css" href="styles/messagebox.css" />
        <link rel="stylesheet" type="text/css" href="styles/sidebarcontent.css" />
        <link rel="stylesheet" type="text/css" href="styles/settings.css" />
    </head>
    <body>
        <noscript>Please enable Javascript on your browser to continue.</noscript>
        <div id="container">
            <div id="header">
                UESC Administration Panel
                <a href="dashboard.php" class="headericon" id="icoDashboard" title="Dashboard"></a>
            </div>
            <a href="javascript:void(0)" id="subheader">System Settings</a>
            <span id="corner"></span>
            <div id="sidebar">
                <a href="voters.php" class="menu link">Voters</a>
                <a href="candidates.php" class="menu link">Candidates</a>
                <a href="javascript:void(0)" id="partymenu" class="menu"><span id="partyadd" class="add menuicon" title="Add"></span>Parties</a>
                <div id="partysubmenu" class="submenu"></div>
                <a href="javascript:void(0)" id="collegemenu" class="menu"><span id="collegeadd" class="add menuicon" title="Add"></span>Colleges</a>
                <div id="collegesubmenu" class="submenu"></div>
                <a href="javascript:void(0)" id="positionmenu" class="menu"><span id="positionadd" class="add menuicon" title="Add"></span>Positions</a>
                <div id="positionsubmenu" class="submenu"></div>
                <a href="javascript:void(0)" id="accountmenu" class="menu"><span id="accountadd" class="add menuicon" title="Add"></span>Accounts</a>
                <div id="accountsubmenu" class="submenu"></div>
                <a href="javascript:void(0)" id="processmenu" class="menu">Process</a>
                <div id="processsubmenu" class="submenu">
                    <div class="dark" id="divStatus"></div>
                    <a href="javascript:void(0)" class="light" id="aBackup">Data Backup</a>
                    <a href="javascript:void(0)" class="dark" id="aDownload">Download Election Files</a>
                    <a href="javascript:void(0)" class="light" id="aDatabase">Database Settings</a>
                    <a href="javascript:void(0)" class="dark" id="aReset">System Reset</a>
                </div>
            </div>
            <div id="content">
                <div id="light">
                    <div id="frmCollege">
                        <div id="collegeTitle" class="titleBar">Colleges<a href="javascript:void(0)" class="close" id="closeCollege"></a></div>
                        <input type="text" id="collegeName" placeholder="College Name" maxlength="40" class="panelInput" />
                        <input id="collegeMaxYear" placeholder="Max Year" maxlength="2" class="panelInput" />
                        <input type="text" id="collegeAbbr" placeholder="Abbreviation" maxlength="8" class="panelInput" />
                        <input type="text" id="collegeImport" placeholder="Import Value" maxlength="8" class="panelInput" />
                        <div class="buttons">
                            <a href="javascript:void(0)" id="saveCollege" class="small button">Save</a>
                            <a href="javascript:void(0)" id="cancelCollege" class="small button">Cancel</a>
                        </div>
                    </div>
                    <div id="frmAccount">
                        <div id="accountTitle" class="titleBar">Accounts<a href="javascript:void(0)" class="close" id="closeAccount"></a></div>
                        <input id="accountName" maxlength="15" placeholder="Username" class="panelInput" />
                        <select id="accountType" class="panelInput">
                            <option>User Type</option>
                            <option>Administrator</option>
                            <option>Facilitator</option>
                        </select>
                        <a href="javascript:void(0)" id="btnChangePassword">
                            Change Password
                        </a>
                        <div id="changePassword" class="invisible">
                            <input type="password" id="accountOldPassword" maxlength="15" placeholder="Old Password" class="panelInput" />
                            <input type="password" id="accountNewPassword" maxlength="15" placeholder="New Password" class="panelInput" />
                            <input type="password" id="accountRepeatPassword" maxlength="15" placeholder="Repeat Password" class="panelInput" />
                        </div>
                        <div class="buttons">
                            <a href="javascript:void(0)" id="saveAccount" class="small button">Save</a>
                            <a href="javascript:void(0)" id="cancelAccount" class="small button">Cancel</a>
                        </div>
                    </div>
                    <form id="frmBackup">
                        <input type="hidden" id="selectedBackup" name="index" />
                        <div class="titleBar">Data Backup<a href="javascript:void(0)" class="close" id="closeBackup"></a></div>
                        <div id="divBackup">
                            <table cellspacing="0" id="tblBackup"></table>
                        </div>
                        <div class="buttons">
                            <a href="javascript:void(0)" class="small button" id="btnBackup">Backup</a>
                            <a href="javascript:void(0)" class="small button" id="btnDownload">Download</a>
                        </div>
                    </form>
                    <form id="frmDownload">
                        <div class="titleBar">Download System Files<a href="javascript:void(0)" class="close" id="closeDownload"></a></div>
                        <div class="chkDownload" id="All">All Files<input type="checkbox" class="chk" id="chkAll" /></div>
                        <div class="chkDownload" id="XML">XML Files<input type="checkbox" class="chk" name="xml" id="chkXML" /></div>
                        <div class="chkDownload" id="Backup">Backup Files<input type="checkbox" class="chk" name="backup" id="chkBackup" /></div>
                        <div class="chkDownload" id="Image">Candidate Images<input type="checkbox" class="chk" name="candidates" id="chkImage" /></div>
                        <div class="chkDownload" id="Spreadsheet">Uploaded Spreadsheets<input type="checkbox" class="chk" name="spreadsheets" id="chkSpreadsheet" /></div>
                        <div class="chkDownload"  id="PDF">Generated PDF Reports<input type="checkbox" class="chk" name="reports" id="chkPDF" /></div>
                        <div class="buttons"><a href="javascript:void(0)" class="button" id="btnDownloadFiles">Download</a></div>
                    </form>
                    <div id="frmDatabase">
                        <div class="titleBar">Database Settings<a href="javascript:void(0)" class="close" id="closeDatabase"></a></div>
                        <input type="text" placeholder="Host" id="databaseHost" class="panelInput" />
                        <input type="text" placeholder="User" id="databaseUser" class="panelInput" />
                        <input type="password" placeholder="Password" id="databasePassword" class="panelInput" />
                        <input type="text" placeholder="Name" id="databaseName" class="panelInput" />
                        <div class="buttons">
                            <a href="javascript:void(0)" class="small button" id="btnSave">Save</a>
                            <a href="javascript:void(0)" class="small button" id="btnCancel">Cancel</a>
                        </div>
                    </div>
                </div>
            </div>
            <div id="footer">&copy; Copyright <?php echo date('Y'); ?> UE-CCSS Research &amp; Development Unit 2012</div>
        </div>
        <script type="text/javascript" src="packages/jquery/jquery.js"></script>
        <script type="text/javascript" src="js/core.js"></script>
        <script type="text/javascript" src="js/settings.js"></script>
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