<?php
    include 'utilities.php';
    $configFile = '../data/xml/settings.xml';
    if(file_exists($configFile)){
        $configXML = simplexml_load_file($configFile);
        $host = (string)$configXML->setting[1]['value'];
        $user = (string)$configXML->setting[2]['value'];
        $password = base64_decode((string)$configXML->setting[3]['value']);
        $name = (string)$configXML->setting[4]['value'];
        
        $dbc = mysql_connect($host,$user,$password);
        if($dbc){
            if(!mysql_select_db($name,$dbc)){
                $filename = '..'.DIRECTORY_SEPARATOR.'data'.DIRECTORY_SEPARATOR
                    .'scheme'.DIRECTORY_SEPARATOR.'database.sql';
                if(!mysql_query(file_get_contents($filename),$dbc))
                    setMessage('Oops! The server is temporarily down.<br />Please try again.');
            }
        }
        else
            setMessage('Oops! The server is temporarily down.<br />Please try again.');
    }
    else{
        setMessage('Oops! The configuration file does not exist or is not accessible.');
    }
?>