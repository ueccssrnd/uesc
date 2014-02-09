<?php
session_start();
$_SESSION = array();
session_destroy();
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
        <title>UESC Election <?php echo date('Y') ?></title>
        <link rel="shortcut icon" type="image/x-icon" href="images/favicon.ico" />
        <link rel="stylesheet" type="text/css" href="styles/core.css" />
        <link rel="stylesheet" type="text/css" href="styles/messagebox.css" />
        <link rel="stylesheet" type="text/css" href="styles/sidebarfield.css" />
        <link rel="stylesheet" type="text/css" href="styles/sidebarinput.css" />
    </head>
    <body>
        <noscript>Please enable Javascript on your browser to continue.</noscript>
        <div id="container">
            <div id="header">UE Student Council Election <?php echo date('Y'); ?></div>
            <div id="subheader">Voter Login</div>
            <span id="corner"></span>
            <div id="sidebar">
                <form method="post" class="sidebarForm" id="frmLogin" action="election.php">
                    <input type="hidden" id="category" name="category" value="USC" />
                </form>
                    <div class="fieldDescription">Student No.</div>
                    <input type="text" class="sidebarInputField" id="studentNo" maxlength="11" />
                    <a href="javascript:void(0)" class="sidebarButton button" id="btnLogin">Login</a>
            </div>
            <div id="content">
                <?php
                if (isset($_POST['message']))
                    echo '<input type="hidden" id="message" value="' . $_POST['message'] . '" />';
                else
                    echo '<input type="hidden" id="message" value="" />';
                ?>
            </div>
            <div id="footer">&copy; Copyright <?php echo date('Y'); ?> UE-CCSS Research &amp; Development Unit 2012</div>
        </div>
        <script type="text/javascript" src="packages/jquery/jquery.js"></script>
        <script type="text/javascript" src="js/core.js"></script>
        <script type="text/javascript" src="js/login.js"></script>
    </body>
</html>