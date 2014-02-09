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
        <title>UESC Election | Help Center</title>
        <link rel="shortcut icon" type="image/x-icon" href="images/favicon.ico" />
        <link rel="stylesheet" type="text/css" href="styles/core.css" />
        <link rel="stylesheet" type="text/css" href="styles/messagebox.css" />
        <link rel="stylesheet" type="text/css" href="styles/sidebarcontent.css" />
        <link rel="stylesheet" type="text/css" href="styles/help.css" />
    </head>
    <body>
        <noscript>Please enable Javascript on your browser to continue.</noscript>
        <div id="container">
            <div id="header">
                UESC Administration Panel
                <a href="dashboard.php" class="headericon" id="icoDashboard" title="Dashboard"></a>
            </div>
            <a href="javascript:void(0)" id="subheader">Help Center</a>
            <span id="corner"></span>
            <div id="sidebar">
                <a href="javascript:void(0)" id="introductionmenu" class="menu">Introduction</a>
                <div id="introductionsubmenu" class="submenu">
                    <div class="dark">Title Page</div>
                    <div class="light" onclick="$('#content').scrollTo('#preface',400)">Preface</div>
                    <div class="dark" onclick="$('#content').scrollTo('#tableofcontents',400)">Table of Contents</div>
                </div>
                <a href="javascript:void(0)" id="installationmenu" class="menu">Installation</a>
                <div id="installationsubmenu" class="submenu">
                    <div class="dark">System Requirements</div>
                    <div class="light">Setting up the Admin Account</div>
                    <div class="dark">Setting up the Database</div>
                    <div class="light">Configuring Installation</div>
                </div>
                <a href="javascript:void(0)" id="administrationmenu" class="menu">Administration</a>
                <div id="administrationsubmenu" class="submenu">
                    <div class="dark">Admin Login</div>
                    <div class="light">Panel</div>
                    <div class="dark">Voters</div>
                    <div class="light">Candidates</div>
                    <div class="dark">Parties</div>
                    <div class="light">Colleges</div>
                    <div class="dark">Positions</div>
                    <div class="light">Results Presentation</div>
                    <div class="dark">A Load of Settings</div>
                    <div class="light">System Logs</div>
                </div>
                <a href="javascript:void(0)" id="electionmenu" class="menu">Election</a>
                <div id="electionsubmenu" class="submenu">
                    <div class="dark">Registration</div>
                    <div class="light">Voter Login</div>
                    <div class="dark">Election Proper</div>
                    <div class="light">Voter Reset</div>
                </div>
                <a href="javascript:void(0)" id="moremenu" class="menu">More</a>
                <div id="moresubmenu" class="submenu">
                    <div class="dark">Security</div>
                    <div class="light">Resources</div>
                    <div class="dark">Recommendations</div>
                </div>
            </div>
            <div id="content">
                <h1 id="preface">Preface</h1>
                <p><strong>Student Council</strong> plays an important role in moulding the students to be better citizens of the country especially in the aspect of having integrity when choosing for the right leaders.</p>
                <p>Student Council Election serves as training ground for students as voters and even for the students who run for positions. In this event, the students are given the chance to practice their rights and to decide for the student officers of their school. This is one of the many reasons why universities give importance to student council election.</p>
                <p>The Election System in universities, just like in our country, is vulnerable. The customary manual voting system that the schools implement for years has a lot of deficiencies and defectives.  More than those blunders, the system do not provide high-security and reliability. In solution to these, an Automated Voting System will answer all the problems in election.</p>
                <p>The UESC Automated Election System is a system developed to automate the process of election in the University of the East from the voting process to the counting and tabulation of results.
                The system aims to aid the university in conducting a highly secured, reliable, fast and accurate election.</p>
                <div class="pagefooter"><strong>Introduction</strong> | Preface</div>
                <h1 id="tableofcontents">Table of Contents</h1>
                <div class="leftcolumn">
                <h2>Introduction</h2>
                <ul>
                    <li>Title Page</li>
                    <li>Preface</li>
                    <li>Table of Contents</li>
                </ul>
                <h2>Installation</h2>
                <ul>
                    <li>System Requirements</li>
                    <li>Setting Up the Admin Account</li>
                    <li>Setting Up the Database</li>
                    <li>Configuring Installation</li>
                </ul>
                <h2>Administration</h2>
                <ul>
                    <li>Admin Login</li>
                    <li>Panel</li>
                    <li>Voters</li>
                    <li>Candidates</li>
                </ul>
                </div>
                <div class="rightcolumn">
                <ul>
                    <li>Parties</li>
                    <li>Colleges</li>
                    <li>Positions</li>
                    <li>Results Presentation</li>
                    <li>A Load of Settings</li>
                    <li>System Logs</li>
                </ul>
                <h2>Election</h2>
                <ul>
                    <li>Registration</li>
                    <li>Voter Login</li>
                    <li>Election Proper</li>
                    <li>Voter Reset</li>
                </ul>
                <h2>More</h2>
                <ul>
                    <li>Security</li>
                    <li>Resources</li>
                    <li>Extras</li>
                </ul>
                </div>
                <div class="pagefooter"><strong>Introduction</strong> | Table of Contents</div>
                <h1>System Requirements</h1>
                <h2>Hardware</h2>
                <ul>
                    <li>None</li>
                </ul>
                <div class="pagefooter"><strong>Installation</strong> | System Requirements</div>
            </div>
            <div id="footer">&copy; Copyright <?php echo date('Y'); ?> UE-CCSS Research &amp; Development Unit 2012</div>
        </div>
        <script type="text/javascript" src="packages/jquery/jquery.js"></script>
        <script type="text/javascript" src="packages/jquery/scrollto.js"></script>
        <script type="text/javascript" src="js/core.js"></script>
        <script type="text/javascript" src="js/help.js"></script>
    </body>
</html>
<?php
}
else{
    setMessage('Access Denied! You\'re not logged in<br />or the session has expired.','admin.php');
}
ob_end_flush();
?>