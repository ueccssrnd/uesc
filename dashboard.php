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
        <title>UESC Election | Dashboard</title>
        <link rel="shortcut icon" type="image/x-icon" href="images/favicon.ico" />
        <link rel="stylesheet" type="text/css" href="styles/core.css" />
        <link rel="stylesheet" type="text/css" href="styles/messagebox.css" />
        <link rel="stylesheet" type="text/css" href="styles/dashboard.css" />
    </head>
    <body>
        <noscript>Please enable Javascript on your browser to continue.</noscript>
        <div id="container">
            <div id="header">
                UESC Administration Panel
            </div>
            <span id="subheader">Dashboard</span>
            <span id="corner"></span>
            <div id="sidebar">
                <div class="scrollbar" id="scrollbar"><div class="track"><div class="thumb"><div class="end"></div></div></div></div>
                <div class="viewport">
                    <div class="overview">
                        <a href="javascript:void(0)" class="dark item" id="btnCommandCenter">
                            <span class="icon" id="imgCommand"></span>
                            <span class="caption">Command Center</span>
                        </a>
                        <a href="registration.php" class="light item">
                            <span class="icon" id="imgRegistration"></span>
                            <span class="caption">Voter Registration</span>
                        </a>
                        <a href="reset.php" class="dark item">
                            <span class="icon" id="imgReset"></span>
                            <span class="caption">Voter Reset</span>
                        </a>
                        <?php if(isset($_SESSION['type'])&&$_SESSION['type']=='Administrator'){ ?>
                        <a href="results.php"><span class="light item">
                            <span class="icon" id="imgResults"></span>
                            <span class="caption">Election Results</span>
                        </span></a>
                        <a href="settings.php"><span class="dark item">
                            <span class="icon" id="imgSettings"></span>
                            <span class="caption">System Settings</span>
                        </span></a>
                        <?php } ?>
                        <a href="javascript:void(0)" class="light item" id="btnStatistics">
                            <span class="icon" id="imgStatistics"></span>
                            <span class="caption">Statistics</span>
                        </a>
                        <a href="help.php"><span class="dark item">
                            <span class="icon" id="imgHelp"></span>
                            <span class="caption">Help Center</span>
                        </span></a>
                        <a href="javascript:void(0)" class="light item" id="btnAbout">
                            <span class="icon" id="imgAbout"></span>
                            <span class="caption">About This</span>
                        </a>
                        <a href="javascript:void(0)" class="dark item" id="logout">
                            <span class="icon" id="imgLogout"></span>
                            <span class="caption">Logout</span>
                        </a>
                    </div>
                </div>
            </div>
            <div id="content">
                <div id="commandCenter">
                    <div id="chatBox"></div>
                    <form id="inputBox">
                        <input type="hidden" id="username" value="<?php echo $_SESSION['username']; ?>" />
                        <input id="txtInput" placeholder="What's on your mind?" maxlength="240" type="text" />
                        <a href="javascript:void(0)" id="btnPost" class="small button">Send</a>
                    </form>
                </div>
                <div id="statistics"><div id="loading"></div></div>
                <div id="about">
                    <div>
                        <img src="images/favicon/64x64.png" alt="UESC Election" />
                        <h1>Web-Based University of the East Student Council Election System</h1>
                    </div>
                    <div>
                        This software was developed by UE-CCSS Research &amp; Development Unit,
                        a group of bad ass intellectuals working together to make life easier.
                        Do you have any concerns? Visit our office located at the ground
                        floor of CCSS building.
                    </div>
                </div>
            </div>
            <div id="footer">&copy; Copyright <?php echo date('Y'); ?> UE-CCSS Research &amp; Development Unit 2012</div>
        </div>
        <script type="text/javascript" src="packages/jquery/jquery.js"></script>
        <script type="text/javascript" src="packages/jquery/tinyscrollbar.js"></script>
        <script type="text/javascript" src="js/core.js"></script>
        <script type="text/javascript" src="js/dashboard.js"></script>
    </body>
</html>
<?php
}
else{
    setMessage('Access Denied! You\'re not logged in<br />or the session has expired.','admin.php');
}
ob_end_flush();
?>