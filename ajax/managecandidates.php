<?php
function renameFile($old,$new){
    $dot = strrpos($old, '.');
    $ext = substr($old,$dot);
    $file = '../images/candidates/'.$new.$ext;
    rename('../'.$old,$file);
    return $new.$ext;
}

function deleteTempImages(){
    $_POST['blackhole'] = explode(',', $_POST['blackhole']);
    foreach ($_POST['blackhole'] as $file){
        $dot = strrpos($file, '.');
        $ext = substr($file,$dot);
        $name = substr($file,0,$dot);
        if(strlen($file)>0&&file_exists('../'.$file)){
            @chmod('../'.$file, 0774);
            @unlink('../'.$file);
        }
        $count = 1;
	while (file_exists('../'.$name.'_'.$count.$ext)){
            @unlink('../'.$name.'_'.$count.$ext);
            $count++;
        }
    }
}

session_start();
include '../includes/utilities.php';
if(isset($_SESSION['agent'])&&$_SESSION['agent']==md5($_SERVER['HTTP_USER_AGENT'])&&isset($_SESSION['type'])&&($_SESSION['type']=='Administrator'||$_SESSION['type']=='Facilitator')){
    if(isset($_POST['action'])){
        $candidates = simplexml_load_file('../data/xml/candidates.xml');
        if($_POST['action']=='addcandidate'){
            for($i=0;$i<$candidates->count();$i++){
                if((string)$candidates->category[$i]['name']==$_POST['category']){
                    $id = date('U');
                    $candidate = $candidates->category[$i]->addChild('candidate');
                    $candidate->addAttribute('id',$id);
                    $candidate->addAttribute('image',  renameFile($_POST['image'], $id));
                    $candidate->addAttribute('lastname',htmlentities($_POST['lastName']));
                    $candidate->addAttribute('firstname',htmlentities($_POST['firstName']));
                    $candidate->addAttribute('middleinitial',htmlentities($_POST['middleInitial']));
                    $candidate->addAttribute('position',$_POST['position']);
                    $candidate->addAttribute('party',$_POST['party']);
                    $candidate->addAttribute('college',$_POST['college']);
                    $candidate->addAttribute('major',htmlentities($_POST['major']));
                    $candidate->addAttribute('yearlevel',$_POST['yearLevel']);
                    $candidates->asXML('../data/xml/candidates.xml');
                    break;
                }
            }
            deleteTempImages();
        }
        else if($_POST['action']=='editcandidate'){
            deleteTempImages();
            for($i=0;$i<$candidates->count();$i++){
                $category = $candidates->category[$i];
                if((string)$category['name']==$_POST['category']){
                    for($j=0;$j<$category->count();$j++){
                        if((string)$category->candidate[$j]['id']==$_POST['id']){
                            $candidate = $category->candidate[$j];
                            $candidate['image'] = renameFile($_POST['image'], (string)$candidate['id']);
                            $candidate['lastname'] = htmlentities($_POST['lastName']);
                            $candidate['firstname'] = htmlentities($_POST['firstName']);
                            $candidate['middleinitial'] = htmlentities($_POST['middleInitial']);
                            $candidate['position'] = $_POST['position'];
                            $candidate['party'] = $_POST['party'];
                            $candidate['college'] = $_POST['college'];
                            $candidate['major'] = htmlentities($_POST['major']);
                            $candidate['yearlevel'] = $_POST['yearLevel'];
                            $candidates->asXML('../data/xml/candidates.xml');
                            break;
                        }
                    }
                    break;
                }
            }
        }
        else if($_POST['action']=='deletecandidate'){
            for($i=0;$i<$candidates->count();$i++){
                $category = $candidates->category[$i];
                if((string)$category['name']==$_POST['category']){
                    for($j=0;$j<$category->count();$j++){
                        if((string)$category->candidate[$j]['id']==$_POST['id']){
                            unset($category->candidate[$j]);
                            $candidates->asXML('../data/xml/candidates.xml');
                            if(file_exists('../'.$_POST['image']))
                               @unlink('../'.$_POST['image']);
                            break;
                        }
                    }
                    break;
                }
            }
        }
        else if($_POST['action']=='refreshcandidates'){
            for($i=0;$i<$candidates->count();$i++){
                if($candidates->category[$i]['name']==$_POST['category']){
                    $category = $candidates->category[$i];
                    $xml = new SimpleXMLElement('<candidates></candidates>');
                    for($j=0;$j<$category->count();$j++){
                        $can = $category->candidate[$j];
                        if($can['position']==$_POST['position']){
                            if($_POST['position']!='Representative'||
                              ($_POST['position']=='Representative'&&
                               $can['yearlevel']==$_POST['yearLevel'])){
                                    $candidate = $xml->addChild('candidate');
                                    $candidate->addAttribute('id', $can['id']);
                                    $candidate->addAttribute('lastname', $can['lastname']);
                                    $candidate->addAttribute('firstname', $can['firstname']);
                                    $candidate->addAttribute('middleinitial', $can['middleinitial']);
                                    $candidate->addAttribute('image', $can['image']);
                                    $candidate->addAttribute('position', $can['position']);
                                    $candidate->addAttribute('party', $can['party']);
                                    $candidate->addAttribute('college', $can['college']);
                                    $candidate->addAttribute('major', $can['major']);
                                    $candidate->addAttribute('yearlevel', $can['yearlevel']);
                            }
                        }
                    }
                    echo $xml->asXML();
                    break;
                }
            }
        }
        else if($_POST['action']=='deletetempimages'){
            deleteTempImages();
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