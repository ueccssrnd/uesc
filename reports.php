<?php
session_start();
include 'includes/utilities.php';
$configFile = 'data/xml/settings.xml';
if(file_exists($configFile)){
    $configXML = simplexml_load_file($configFile);
    $host = (string)$configXML->setting[1]['value'];
    $user = (string)$configXML->setting[2]['value'];
    $password = base64_decode((string)$configXML->setting[3]['value']);
    $name = (string)$configXML->setting[4]['value'];

    $dbc = mysql_connect($host,$user,$password);
    if($dbc){
        if(!mysql_select_db($name,$dbc)){
            $filename = 'data'.DIRECTORY_SEPARATOR
                .'scheme'.DIRECTORY_SEPARATOR.'database.sql';
            if(!mysql_query(file_get_contents($filename),$dbc))
                setMessage('Oops! The server is temporarily down.<br />Please try again.');
        }
    }
    else{
        setMessage('Oops! The server is temporarily down.<br />Please try again.');
        die;
    }
}
else{
    setMessage('Oops! The configuration file does not exist or is not accessible.');
    die;
}
if(isset($_SESSION['agent'])&&$_SESSION['agent']==md5($_SERVER['HTTP_USER_AGENT'])&&isset($_SESSION['type'])&&($_SESSION['type']=='Administrator'||$_SESSION['type']=='Facilitator')){
    if($_SESSION['type']=='Administrator'){
        require('packages/fpdf/fpdf.php');

        class PDF extends FPDF{
            function Footer(){
                $this->SetY(-15);
                $this->SetFont('Arial','',8);
                $this->AliasNbPages();
                $this->Cell(0,10,'Page '.$this->PageNo().' of {nb}',0,0,'C');
            }
            
            function CountCandidates($category,$position,$represents){
                $candidates = simplexml_load_file('data/xml/candidates.xml');
                for($i=0;$i<$candidates->count();$i++){
                    if((string)$candidates->category[$i]['name']==$category){
                        $counter = 0;
                        for($j=0;$j<$candidates->category[$i]->count();$j++){
                            if($represents>1){
                                if((string)$candidates->category[$i]->
                                    candidate[$j]['position']=='Representative'
                                    &&(int)$candidates->category[$i]->
                                    candidate[$j]['yearlevel']==$represents){
                                        $counter++;
                                }
                            }
                            else if((string)$candidates->category[$i]->
                                candidate[$j]['position']==$position){
                                $counter++;
                            }
                        }
                        return $counter;
                    }
                }
            }

            function PrintResults($category){
                global $found;
                $lineheight = 6;
                $width = array(66,27,27,46,20);
                $maxyear = 4;
                $rep = 1;

                //xml files
                $colleges = simplexml_load_file('data/xml/colleges.xml');
                $positions = simplexml_load_file('data/xml/positions.xml');
                $candidates = simplexml_load_file('data/xml/candidates.xml');

                //metadata
                $this->SetTitle('UESC Election '.date('Y').' Results');
                $this->SetAuthor('UE-CCSS R&D Unit');
                $this->SetCreator('Aaron Noel De Leon');

                //set candidates from category
                for($i=0;$i<$candidates->count();$i++){
                    if((string)$candidates->category[$i]['name']==$category){
                        $candidates = $candidates->category[$i];
                        break;
                    }
                }

                if($candidates->count()>0){
                    
                    //page settings
                    $this->SetFont('Arial','',11);
                    $this->SetTextColor(75);
                    $this->AddPage();
                    $this->Ln(2);
                    $this->SetMargins(15,20,15);
                    $this->SetFont('','B',13);
                    
                    if($category=='USC'){
                        $this->Cell(196,4.5,'University Student Council '.date('Y').' Election Results',0,1,'C');
                        $found = true;
                    }
                    else{
                        for($i=0;$i<$colleges->count();$i++){
                            if((string)$colleges->college[$i]['abbr']==$category){
                                $this->Cell(196,4.5,(string)$colleges->college[$i]['name'].' '.date('Y').' Election Results',0,1,'C');
                                $maxyear = (int)$colleges->college[$i]['maxyear'];
                                $found = true;
                                break;
                            }
                        }
                        if($i==$colleges->count()){
                            $this->SetFont('','B',24);
                            $this->Cell(196,196,'Oops! The specified category was not found.',0,0,'C');
                            return;
                        }
                    }
                    $this->Ln(2);
                    $this->SetFont('','',11);

                    //header style
                    $this->SetDrawColor(100);

                    for($i=0;$i<$positions->count();$i++){
                        $position = (string)$positions->position[$i]['name'];
                        $represents = $position=='Representative';
                        if($this->CountCandidates($category,$position,$rep)!==0){
                            if(($category=='USC'&&!$represents&&$rep<$maxyear)||$category!='USC'){
                                $this->SetTextColor(255);
                                $this->SetFont('','B');
                                $this->SetFillColor(125);
                                $this->Cell(186,7,$represents?toRep($rep):$position,1,1,'C','fill');
                                $this->SetFillColor(150);
                                $this->Cell($width[0],$lineheight,'Candidate',1,0,'C','fill');
                                $this->Cell($width[1],$lineheight,'Party',1,0,'C','fill');
                                $this->Cell($width[2],$lineheight,$category=='USC'?'College':'Year Level',1,0,'C','fill');
                                $this->Cell($width[3],$lineheight,'Votes',1,0,'C','fill');
                                $this->Cell($width[4],$lineheight,'%',1,1,'C','fill');

                                for($j=0;$j<$candidates->count();$j++){
                                    if(($position==(string)$candidates->candidate[$j]['position'])&&
                                      ($represents&&$rep==(int)$candidates->candidate[$j]['yearlevel']||
                                      (!$represents))){
                                        $name = (string)$candidates->candidate[$j]['lastname'].', '.
                                                (string)$candidates->candidate[$j]['firstname'].' '.
                                                (string)$candidates->candidate[$j]['middleinitial'];
                                        $this->SetFont('','');
                                        $this->SetFillColor(255);
                                        $this->SetTextColor(75);
                                        if($category=='USC'){
                                            for($k=0;$k<=$colleges->count();$k++){
                                                $k%2==0?$this->SetFillColor(255):$this->SetFillColor(240);
                                                $k==0?$this->Cell($width[0],$lineheight*($colleges->count()+1),$name,1,0,'C','fill'):
                                                    $this->Cell($width[0],$lineheight,'');
                                                $k==0?$this->Cell($width[1],$lineheight*($colleges->count()+1),(string)$candidates->candidate[$j]['party'],1,0,'C','fill'):
                                                    $this->Cell($width[1],$lineheight,'');
                                                if($k==$colleges->count())
                                                    $this->SetFillColor(255,255,204);
                                                if($k<$colleges->count()){
                                                    $college = (string)$colleges->college[$k]['abbr'];
                                                    $this->Cell($width[2],$lineheight,(string)$colleges->college[$k]['abbr'],1,0,'C','fill');
                                                }
                                                else{
                                                    $college = '';
                                                    $this->Cell($width[2],$lineheight,'Total',1,0,'C','fill');
                                                }
                                                $result = getResults('USC', (string)$candidates->candidate[$j]['id'],0,$college);
                                                $this->Cell($width[3],$lineheight,$result['count'].' / '.$result['total'],1,0,'C','fill');
                                                $this->Cell($width[4],$lineheight,$result['percentage'],1,1,'C','fill');
                                            }
                                        }
                                        else{
                                            for($k=1;$k<=$maxyear+1;$k++){
                                                if($represents){
                                                    $k = $rep;
                                                    $this->Cell($width[0],$lineheight,$name,1,0,'C','fill');
                                                $this->Cell($width[1],$lineheight,(string)$candidates->candidate[$j]['party'],1,0,'C','fill');
                                                }
                                                else{
                                                    $k%2==0?$this->SetFillColor(240):$this->SetFillColor(255);
                                                    $k==1?$this->Cell($width[0],$lineheight*($maxyear+1),$name,1,0,'C','fill'):
                                                        $this->Cell($width[0],$lineheight,'');
                                                    $k==1?$this->Cell($width[1],$lineheight*($maxyear+1),(string)$candidates->candidate[$j]['party'],1,0,'C','fill'):
                                                        $this->Cell($width[1],$lineheight,'');
                                                }
                                                if($k==$maxyear+1||$represents)
                                                    $this->SetFillColor(255,255,204);
                                                if($k<=$maxyear){
                                                    $this->Cell($width[2],$lineheight,$k,1,0,'C','fill');
                                                    $result = getResults($category, (string)$candidates->candidate[$j]['id'],$k,$category);
                                                }
                                                else{
                                                    $this->Cell($width[2],$lineheight,'Total',1,0,'C','fill');
                                                    $result = getResults($category, (string)$candidates->candidate[$j]['id'],0,$category);
                                                }
                                                $this->Cell($width[3],$lineheight,$result['count'].' / '.$result['total'],1,0,'C','fill');
                                                $this->Cell($width[4],$lineheight,$result['percentage'],1,1,'C','fill');
                                                if($represents)
                                                    break;
                                            }
                                        }
                                    }
                                }
                                if($represents){
                                    $i--;
                                    $rep++;
                                }
                                if($rep==$maxyear)
                                    $i = $positions->count();
                            }
                        }
                    }
                }
                else{
                    $this->SetFont('Arial','B',24);
                    $this->SetTextColor(75);
                    $this->AddPage();
                    $this->Ln(2);
                    $this->SetMargins(15,20,15);
                    $this->Cell(196,196,'Oops! There are no '.$category.' candidates.',0,0,'C');
                    return;
                }
            }
        }
        
        $found = false;
        if(!isset($_GET['category'])){
            $_GET['category']='ALL';
        }
        else{
            if(strtoupper($_GET['category'])=='USC')
                $_GET['category'] = 'USC';
            else if(strtoupper($_GET['category'])=='ALL')
                $_GET['category'] = 'ALL';
            else{
                $xml = simplexml_load_file('data/xml/colleges.xml');
                for($a=0;$a<$xml->count();$a++){
                    if(strtoupper($_GET['category'])==strtoupper((string)$xml->college[$a]['abbr'])){
                        $_GET['category'] = (string)$xml->college[$a]['abbr'];
                        break;
                    }
                }
            }
        }

        $pdf = new PDF('P','mm','Letter');

        if(!file_exists('data/reports/'))
            @mkdir('data/reports/');
        
        if($_GET['category']=='ALL'){
            $categories = simplexml_load_file('data/xml/colleges.xml');
            $pdf->PrintResults('USC');
            for($c=0;$c<$categories->count();$c++)
                $pdf->PrintResults((string)$categories->college[$c]['abbr']);
        }else{
            $pdf->PrintResults($_GET['category']);
        }
        if($found){
            $pdf->Output('data/reports/'.$_GET['category'].'.pdf');
        }
        $pdf->Output();
    }
    else{
        setMessage('Access Denied! Privilege not granted.<br />Please login to continue.','admin.php');
    }
}
else{
    setMessage('Access Denied! You\'re not logged in<br />or the session has expired.','admin.php');
}
?>