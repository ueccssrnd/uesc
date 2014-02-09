<?php
require('../includes/connectdb.php');

function editCandidateProperty($property,$old,$new){
    $xml = simplexml_load_file('../data/xml/candidates.xml');
    for($i=0;$i<$xml->count();$i++){
        for($j=0;$j<$xml->category[$i]->count();$j++){
            if((string)$xml->category[$i]->candidate[$j][$property]==$old){
                $xml->category[$i]->candidate[$j][$property] = $new;
            }
        }
    }
    $xml->asXML('../data/xml/candidates.xml');
}

function deleteCandidateProperty($property,$value){
    $imgDir = '..'.DIRECTORY_SEPARATOR.'images'.DIRECTORY_SEPARATOR.
            'candidates'.DIRECTORY_SEPARATOR;
    $xml = simplexml_load_file('../data/xml/candidates.xml');
    $new = new SimpleXMLElement('<candidates></candidates>');
    for($i=0;$i<$xml->count();$i++){
        $category = $new->addChild('category');
        $category->addAttribute ('name', (string)$xml->category[$i]['name']);
        for($j=0;$j<$xml->category[$i]->count();$j++){
            if((string)$xml->category[$i]->candidate[$j][$property]!=$value){
                $candidate = $category->addChild('candidate');
                $candidate->addAttribute('id', (string)$xml->category[$i]->candidate[$j]['id']);
                $candidate->addAttribute('image', (string)$xml->category[$i]->candidate[$j]['image']);
                $candidate->addAttribute('lastname', (string)$xml->category[$i]->candidate[$j]['lastname']);
                $candidate->addAttribute('firstname', (string)$xml->category[$i]->candidate[$j]['firstname']);
                $candidate->addAttribute('middleinitial', (string)$xml->category[$i]->candidate[$j]['middleinitial']);
                $candidate->addAttribute('position', (string)$xml->category[$i]->candidate[$j]['position']);
                $candidate->addAttribute('party', (string)$xml->category[$i]->candidate[$j]['party']);
                $candidate->addAttribute('college', (string)$xml->category[$i]->candidate[$j]['college']);
                $candidate->addAttribute('major', (string)$xml->category[$i]->candidate[$j]['major']);
                $candidate->addAttribute('yearlevel', (string)$xml->category[$i]->candidate[$j]['yearlevel']);
            }
            else if(file_exists($imgDir.(string)$xml->category[$i]->candidate[$j]['image'])){
                @unlink($imgDir.(string)$xml->category[$i]->candidate[$j]['image']);
            }
        }
    }
    echo $new->asXML('../data/xml/candidates.xml');
}

function backUpDatabase(){
    $backUpDir = '..'.DIRECTORY_SEPARATOR.'data'.DIRECTORY_SEPARATOR.'backup';
    if(!file_exists($backUpDir))
        @mkdir($backUpDir);
    $iStream = fopen($backUpDir.DIRECTORY_SEPARATOR.date('Y-m-d,H-i-s ').md5(microtime()).'.sql','w');
    fwrite($iStream,'DELETE FROM voter;'.PHP_EOL);
    $result = mysql_query('SELECT * FROM voter');
    while($row = mysql_fetch_assoc($result)){
        fwrite($iStream,"INSERT INTO voter (voterid,college,yearlevel,status) VALUES(".
        $row['voterid'].",'".$row['college']."',".$row['yearlevel'].",".$row['status'].");".PHP_EOL);
    }
    fwrite($iStream,'TRUNCATE TABLE vote;'.PHP_EOL);
    $result = mysql_query('SELECT * FROM vote');
    while($row = mysql_fetch_assoc($result)){
        fwrite($iStream,"INSERT INTO vote (voterid,candidateid) VALUES(".
                $row['voterid'].",".$row['candidateid'].");".PHP_EOL);
    }
    fclose($iStream);
}

function resetSystem(){
    $srcDir = '..'.DIRECTORY_SEPARATOR.'data'.DIRECTORY_SEPARATOR.'scheme'.DIRECTORY_SEPARATOR;
    $destDir = '..'.DIRECTORY_SEPARATOR.'data'.DIRECTORY_SEPARATOR.'xml'.DIRECTORY_SEPARATOR;
    $directories = array(
        '..'. DIRECTORY_SEPARATOR."images".DIRECTORY_SEPARATOR."candidates",
        '..'. DIRECTORY_SEPARATOR."data".DIRECTORY_SEPARATOR."reports",
        '..'. DIRECTORY_SEPARATOR."data".DIRECTORY_SEPARATOR."spreadsheets",
        '..'. DIRECTORY_SEPARATOR."data".DIRECTORY_SEPARATOR."backup"
    );
    
    file_put_contents($destDir.'colleges.xml', file_get_contents($srcDir.'colleges.xml'));
    file_put_contents($destDir.'positions.xml', file_get_contents($srcDir.'positions.xml'));
    file_put_contents($destDir.'parties.xml', file_get_contents($srcDir.'parties.xml'));
    file_put_contents($destDir.'candidates.xml', file_get_contents($srcDir.'candidates.xml'));
    
    mysql_query('TRUNCATE TABLE vote');
    mysql_query('DELETE FROM voter');
    
    foreach($directories as $dir){
        deleteDirectoryContents($dir);
    }
    
    file_put_contents('..'.DIRECTORY_SEPARATOR.'data'.DIRECTORY_SEPARATOR.'activity'.DIRECTORY_SEPARATOR.'system.log', '');
    file_put_contents('..'.DIRECTORY_SEPARATOR.'data'.DIRECTORY_SEPARATOR.'activity'.DIRECTORY_SEPARATOR.'error.log', '');
    logActivity('Welcome to the Command Center! System activities and facilitator messages will be posted here.');
}

function deleteDirectoryContents($directory){
    if(file_exists($directory)){
        $dir = scandir($directory);
        foreach($dir as $file){
            if($file!='.'&&$file!='..'&&$file!='index.php')
                @unlink($directory.DIRECTORY_SEPARATOR.$file);
        }
    }
}

function countEntity($entity){
    switch($entity){
        case 'college':
            $xml = simplexml_load_file('../data/xml/colleges.xml');
            return $xml->count();
        case 'position':
            $xml = simplexml_load_file('../data/xml/positions.xml');
            return $xml->count();
        case 'candidate':
            $count = 0;
            $xml = simplexml_load_file('../data/xml/candidates.xml');
            for($i=0;$i<$xml->count();$i++){
                $count += $xml->category[$i]->count();
            }
            return $count;
        case 'party':
            $xml = simplexml_load_file('../data/xml/parties.xml');
            return $xml->count();
        case 'voter':
            $count = 'SELECT COUNT(voterid) FROM voter';
            $result = mysql_query($count);
            $count = mysql_fetch_row($result);
            return $count[0];
        default:
            return -1;
    }
}

session_start();
if(isset($_SESSION['agent'])&&$_SESSION['agent']==md5($_SERVER['HTTP_USER_AGENT'])&&isset($_SESSION['type'])&&$_SESSION['type']=='Administrator'){
    if(isset($_POST['action'])){
        if($_POST['action']=='countentity'){
            echo countEntity($_POST['entity']);
        }
        else if($_POST['action']=='getcolleges'){
            $xml = simplexml_load_file('../data/xml/colleges.xml');
            echo $xml->asXML();
        }
        else if($_POST['action']=='getpositions'){
            $xml = simplexml_load_file('../data/xml/positions.xml');
            echo $xml->asXML();
        }
        else if($_POST['action']=='getparties'){
            $xml = simplexml_load_file('../data/xml/parties.xml');
            echo $xml->asXML();
        }
        else if($_POST['action']=='getaccounts'){
            $xml = simplexml_load_file('../data/xml/accounts.xml');
            echo $xml->asXML();
        }
        else if($_POST['action']=='editposition'){
            $xml = simplexml_load_file('../data/xml/positions.xml');
            for($i=0;$i<$xml->count();$i++){
                if((string)$xml->position[$i]['name']==$_POST['oldData']){
                    if($_POST['newData']=='Representative'){
                        for($j=$i;$j<$xml->count()-1;$j++){
                            $xml->position[$j]['name'] = (string)$xml->position[$j+1]['name'];
                        }
                        $xml->position[$j]['name'] = 'Representative';
                    }
                    else{
                        $xml->position[$i]['name'] = $_POST['newData'];
                    }
                    $xml->asXML('../data/xml/positions.xml');
                    break;
                }
            }
            editCandidateProperty('position', $_POST['oldData'], $_POST['newData']);
        }
        else if($_POST['action']=='editparty'){
            $xml = simplexml_load_file('../data/xml/parties.xml');
            for($i=0;$i<$xml->count();$i++){
                if((string)$xml->party[$i]['name']==$_POST['oldData']){
                    $xml->party[$i]['name'] = $_POST['newData'];
                    $xml->asXML('../data/xml/parties.xml');
                    break;
                }
            }
            editCandidateProperty('party', $_POST['oldData'], $_POST['newData']);
        }
        else if($_POST['action']=='deleteposition'){
            $xml = simplexml_load_file('../data/xml/positions.xml');
            $position = (string)$xml->position[(int)$_POST['index']]['name'];
            unset($xml->position[(int)$_POST['index']]);
            $xml->asXML('../data/xml/positions.xml');
            deleteCandidateProperty('position', $position);
        }
        else if($_POST['action']=='deleteparty'){
            $xml = simplexml_load_file('../data/xml/parties.xml');
            $name = (string)$xml->party[(int)$_POST['index']]['name'];
            unset($xml->party[(int)$_POST['index']]);
            $xml->asXML('../data/xml/parties.xml');
            editCandidateProperty('party', $name, 'None');
        }
        else if($_POST['action']=='addparty'){
            $xml = simplexml_load_file('../data/xml/parties.xml');
            $xml->addChild('party')->addAttribute('name',htmlspecialchars($_POST['value']));
            $xml->asXML('../data/xml/parties.xml');
        }
        else if($_POST['action']=='addposition'){
            $xml = simplexml_load_file('../data/xml/positions.xml');
            for($i=0;$i<$xml->count();$i++){
                if((string)$xml->position[$i]['name']=='Representative')
                    break;
            }
            if($i==$xml->count()){
                $xml->addChild('position')->addAttribute('name',$_POST['value']);
            }
            else{
                $xml->position[$i]['name'] = $_POST['value'];
                $xml->addChild('position')->addAttribute('name','Representative');
            }
            $xml->asXML('../data/xml/positions.xml');
        }
        else if($_POST['action']=='editcollege'){
            $xml = simplexml_load_file('../data/xml/colleges.xml');
            $name = (string)$xml->college[(int)$_POST['index']]['abbr'];
            $xml->college[(int)$_POST['index']]['abbr'] = $_POST['abbr'];
            $xml->college[(int)$_POST['index']]['import'] = $_POST['importname'];
            $xml->college[(int)$_POST['index']]['maxyear'] = $_POST['maxyear'];
            $xml->college[(int)$_POST['index']]['name'] = $_POST['name'];
            $xml->asXML('../data/xml/colleges.xml');
            editCandidateProperty('college', $name, $_POST['abbr']);
            $candidates = simplexml_load_file('../data/xml/candidates.xml');
            for($i=0;$i<$candidates->count();$i++){
                if((string)$candidates->category[$i]['name']==$name){
                    $candidates->category[$i]['name'] = $_POST['abbr'];
                    break;
                }
            }
            $candidates->asXML('../data/xml/candidates.xml');
            mysql_query("UPDATE voter SET college='".
                htmlentities(mysql_real_escape_string($_POST['abbr']))
                ."' WHERE college='".$name."'");
        }
        else if($_POST['action']=='addcollege'){
            $xml = simplexml_load_file('../data/xml/colleges.xml');
            $newCollege = $xml->addChild('college');
            $newCollege->addAttribute('abbr',$_POST['abbr']);
            $newCollege->addAttribute('import',$_POST['importname']);
            $newCollege->addAttribute('maxyear',$_POST['maxyear']);
            $newCollege->addAttribute('name',$_POST['name']);
            $candidates = simplexml_load_file('../data/xml/candidates.xml');
            $candidates->addChild('category')->addAttribute('name',$_POST['abbr']);
            $candidates->asXML('../data/xml/candidates.xml');
            $xml->asXML('../data/xml/colleges.xml');
        }
        else if($_POST['action']=='deletecollege'){
            $xml = simplexml_load_file('../data/xml/colleges.xml');
            $name = (string)$xml->college[(int)$_POST['index']]['abbr'];
            unset($xml->college[(int)$_POST['index']]);
            $xml->asXML('../data/xml/colleges.xml');
            deleteCandidateProperty('college', $name);
            $candidates = simplexml_load_file('../data/xml/candidates.xml');
            for($i=0;$i<$candidates->count();$i++){
                if((string)$candidates->category[$i]['name']==$name){
                    unset($candidates->category[$i]);
                    break;
                }
            }
            $candidates->asXML('../data/xml/candidates.xml');
            mysql_query("DELETE FROM voter WHERE college='".$name."'");
        }
        else if($_POST['action']=='editaccount'){
            $xml = simplexml_load_file('../data/xml/accounts.xml');
            if($_POST['changePassword']=='true'){
                if((string)$xml->account[(int)$_POST['index']]['password']==md5($_POST['oldPassword'])){
                    $xml->account[(int)$_POST['index']]['username'] = $_POST['name'];
                    $xml->account[(int)$_POST['index']]['type'] = $_POST['type'];
                    $xml->account[(int)$_POST['index']]['password'] = md5($_POST['newPassword']);
                    echo 'true';
                }
                else
                    echo 'false';
            }
            else{
                $xml->account[(int)$_POST['index']]['username'] = $_POST['name'];
                $xml->account[(int)$_POST['index']]['type'] = $_POST['type'];
                echo 'true';
            }
            $xml->asXML('../data/xml/accounts.xml');
        }
        else if($_POST['action']=='addaccount'){
            $xml = simplexml_load_file('../data/xml/accounts.xml');
            $newAccount = $xml->addChild('account');
            $newAccount->addAttribute('username',$_POST['name']);
            $newAccount->addAttribute('password',md5($_POST['password']));
            $newAccount->addAttribute('type',$_POST['type']);
            $xml->asXML('../data/xml/accounts.xml');
        }
        else if($_POST['action']=='deleteaccount'){
            $xml = simplexml_load_file('../data/xml/accounts.xml');
            unset($xml->account[(int)$_POST['index']]);
            $xml->asXML('../data/xml/accounts.xml');
        }
        else if($_POST['action']=='resetsystem'){
            resetSystem();
        }
        else if($_POST['action']=='backupdatabase'){
            backUpDatabase();
        }
        else if($_POST['action']=='getstatus'){
            $xml = simplexml_load_file('../data/xml/settings.xml');
            for($i=0;$i<$xml->count();$i++){
                if((string)$xml->setting[$i]['name']=='status'){
                    echo (string)$xml->setting[$i]['value'];
                    break;
                }
            }
        }
        else if($_POST['action']=='updatestatus'){
            $xml = simplexml_load_file('../data/xml/settings.xml');
            for($i=0;$i<$xml->count();$i++){
                if((string)$xml->setting[$i]['name']=='status'){
                    if($_POST['value']=='0'){
                        backUpDatabase();
                        $xml->setting[$i]['value'] = $_POST['value'];
                        logActivity('The election process has stopped.');
                        echo '{"success":"true"}';
                    }
                    else if($_POST['value']=='2'){
                        if(countEntity('college')<1){
                            echo '{"success":"false","error":"There are no colleges available."}';
                        }
                        else if(countEntity('position')<1){
                            echo '{"success":"false","error":"There are no positions available."}';
                        }
                        else if(countEntity('candidate')<1){
                            echo '{"success":"false","error":"There are no candidates available."}';
                        }
                        else if(countEntity('voter')<1){
                            echo '{"success":"false","error":"There are no voters available."}';
                        }
                        else{
                            if((string)$xml->setting[$i]['value']=='0'){
                                backUpDatabase();
                                mysql_query('UPDATE voter SET status=0');
                                mysql_query('TRUNCATE TABLE vote');
                                logActivity('The election process has started.');
                            }
                            else{
                                logActivity('The election process has resumed.');
                            }
                            $xml->setting[$i]['value'] = $_POST['value'];
                            echo '{"success":"true"}';
                        }
                    }
                    else if($_POST['value']=='1'){
                        backUpDatabase();
                        $xml->setting[$i]['value'] = $_POST['value'];
                        logActivity('The election process has paused.');
                        echo '{"success":"true"}';
                    }
                    break;
                }
            }
            $xml->asXML('../data/xml/settings.xml');
        }
        else if($_POST['action']=='listbackupfiles'){
            $backupDir = '..'.DIRECTORY_SEPARATOR.'data'.DIRECTORY_SEPARATOR.'backup';
            if(file_exists($backupDir)){
                $dir = scandir($backupDir,1);
                $files = array();
                for($i=0;$i<count($dir);$i++){   
                    if($dir[$i]!='.'&&$dir[$i]!='..'&&$dir[$i]!='index.php'){
                        array_push($files, array(substr($dir[$i],20,31),round(filesize($backupDir.DIRECTORY_SEPARATOR.$dir[$i])/1000,2).' KB',date('h:i:s A',filemtime($backupDir.DIRECTORY_SEPARATOR.$dir[$i])),$i));
                    }
                }
                echo '{"exists":"true","files":'.json_encode($files).'}';
            }
            else{
                echo '{"exists":"false"}';
            }
        }
        else if($_POST['action']=='getdbconfig'){
            $configXML = simplexml_load_file('../data/xml/settings.xml');
            echo '{"host":"'.$configXML->setting[1]['value'].
                    '","user":"'.$configXML->setting[2]['value'].
                    '","password":"'.base64_decode($configXML->setting[3]['value']).
                    '","name":"'.$configXML->setting[4]['value'].'"}';
        }
        else if($_POST['action']=='setdbconfig'){
            $configXML = simplexml_load_file('../data/xml/settings.xml');
            $configXML->setting[1]['value'] = $_POST['host'];
            $configXML->setting[2]['value'] = $_POST['user'];
            $configXML->setting[3]['value'] = $_POST['password'];
            $configXML->setting[4]['value'] = $_POST['name'];
            $configXML->asXML('../data/xml/settings.xml');
        }
    }
    else{
        setMessage('Access Denied! You\'re not allowed to execute AJAX<br />files directly. Please login to continue.','../admin.php');
    }
}
else{
    setMessage('Access Denied! You\'re not logged in<br />or the session has expired.','../admin.php');
}
?>