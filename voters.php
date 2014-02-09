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
        <title>UESC Election | Voters</title>
        <link rel="shortcut icon" type="image/x-icon" href="images/favicon.ico" />
        <link rel="stylesheet" type="text/css" href="styles/core.css" />
        <link rel="stylesheet" type="text/css" href="styles/messagebox.css" />
        <link rel="stylesheet" type="text/css" href="styles/sidebarinput.css" />
        <link rel="stylesheet" type="text/css" href="styles/voters.css" />
    </head>
    <body>
        <noscript>Please enable Javascript on your browser to continue.</noscript>
        <div id="container">
            <div id="header">
                UESC Administration Panel
                <span id="headericonset">
                    <a href="javascript:void(0)" class="headericon" id="icoMenu" title="More"></a>
                    <a href="javascript:void(0)" class="headericon" id="icoImport" title="Import Voter List"></a>
                    <a href="settings.php" class="headericon" id="icoSettings" title="Settings"></a>
                    <a href="dashboard.php" class="headericon" id="icoDashboard" title="Dashboard"></a>
                </span>
            </div>
            <a href="javascript:void(0)" id="subheader">Voters</a>
            <span id="corner"></span>
            <div id="sidebar">
                <div class="fieldDescription">Student No.</div>
                <input id="txtStudentNo" disabled="disabled" type="text" maxlength="11" class="sidebarInputField" />
                <div class="fieldDescription">College</div>
                <select id="cboCollege" disabled="disabled" class="sidebarInputField"></select>
                <div class="fieldDescription">Yr. Level</div>
                <select id="cboYearLevel" disabled="disabled" class="sidebarInputField"></select>
                <a href="javascript:void(0)" class="small button" id="btnAdd">Add</a>
                <a href="javascript:void(0)" class="small button" id="btnDelete">Delete</a>
                <a href="javascript:void(0)" class="small button" id="btnEdit">Edit</a>
            </div>
            <div id="topMenu">
                <input type="text" id="txtSearch" maxlength="13" value="Search" />
                <a href="javascript:void(0)" id="btnSearch"><img src="images/search.png" /></a>
                <span id="pagination">
                    <span id="paginationLabel">Page</span>
                    <input type="number" value="1" min="1" id="pageNo" />
                    <a href="javascript:void(0)" id="jumpToPage">Go</a>
                </span>
            </div>
            <div id="content"></div>
            <div id="light">
                <div id="importDialog">
                    <div class="titleBar">Import Voter List<span class="close" id="closePanel"></span></div>
                    <div id="importPane">
                        <span id="fileInput">Select File to be Uploaded..</span>
                        <span id="fileHelp" class="tooltip">
                            <span>Valid file formats include MS Excel 2003-2010 Spreadsheets (.xls,.xlsx).</span>
                        </span>
                        <span id="columnHelp" class="tooltip">
                            <span>Input column letters of cells corresponding to the Student No., College and Year Level fields, respectively.</span>
                        </span>
                        <div id="divColumns">
                            Columns
                            <span id="columns">
                                <input id="importStudentNo" type="text" class="txtCol" maxlength="1" />
                                <input id="importCollege" type="text" class="txtCol" maxlength="1" />
                                <input id="importYearLevel" type="text" class="txtCol" maxlength="1" />
                            </span>
                        </div>
                        <a href="javascript:void(0)" class="small button" id="btnImport">Import</a>
                        <a href="javascript:void(0)" class="small button" id="btnClose">Cancel</a>
                        <div id="importStatus"></div>
                    </div>
                </div>
                <div id="importOngoing">
                    <div class="titleBar" id="importTitle"></div>
                    <div id="importImage"></div>
                    <div id="importMessage"></div>
                    <div id="importErrorList">
                        <table cellspacing="0" id="tblErrors"></table>
                    </div>
                    <div id="importButtons" class="buttons">
                        <a id="importOkay" href="javascript:void(0)" class="small button">Okay</a>
                    </div>
                    <div id="importLoading"></div>
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
        <script type="text/javascript" src="js/voters.js"></script>
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