<?php
session_start();
if(isset($_SESSION['agent'])&&$_SESSION['agent']==md5($_SERVER['HTTP_USER_AGENT'])&&isset($_SESSION['type'])&&($_SESSION['type']=='Administrator'||$_SESSION['type']=='Facilitator')){
    if(count($_POST)>0){
        require('../includes/connectdb.php');
        require('../packages/phpexcel/PHPExcel.php');
        ini_set('max_execution_time',3600);

        class Filter implements PHPExcel_Reader_IReadFilter 
        {
            private $_columns = array();

            public function __construct($a,$b,$c){
                $this->_columns = array($a,$b,$c);
            }

            public function readCell($column, $row, $worksheetName = ''){
                if($column==$this->_columns[0]||
                  $column==$this->_columns[1]||
                  $column==$this->_columns[2]){
                    return true;
                }
                return false; 
            } 
        }

        $errors = array();
        $recordsAdded = 0;
        $recordsIgnored = 0;
        $xml = simplexml_load_file('../data/xml/colleges.xml');
        $imports = array();
        $colleges = array();
        for($i=0;$i<$xml->count();$i++){
            array_push($colleges,(string)$xml->college[$i]['abbr']);
            array_push($imports,(string)$xml->college[$i]['import']);
        }
        $file = '..'.DIRECTORY_SEPARATOR.'data'.DIRECTORY_SEPARATOR.'spreadsheets'.
                    DIRECTORY_SEPARATOR.$_POST['filename'];
        
        $filter = new Filter($_POST['studentNo'],$_POST['college'],$_POST['yearLevel']);
        $type = PHPExcel_IOFactory::identify($file);
        $reader = PHPExcel_IOFactory::createReader($type);
        $reader->setReadDataOnly(true);
        $reader->setReadFilter($filter);
        $phpexcel = $reader->load($file);
        
        foreach($phpexcel->getWorksheetIterator() as $worksheet){
            foreach($worksheet->getRowIterator() as $row){
                $value = 'null';
                $cellIterator = $row->getCellIterator();
                $cellIterator->setIterateOnlyExistingCells(true);
                $field = 0;
                $valid = true;
                $query = "INSERT INTO voter (voterid,college,yearlevel) VALUES(";
                foreach($cellIterator as $cell){
                    if(!is_null($cell)){
                        $value = trim((string)$cell->getCalculatedValue());
                        if(strlen($value)==0){
                            $errors[] = array($row->getRowIndex(),$value,'Null Cell Data');
                            $recordsIgnored++;
                            $valid = false;
                            break;
                        }
                        if($field%2==0){
                            if(is_numeric($value)){
                                if($field==0)
                                    $query .= $value.',';
                                else
                                    $query .= $value.')';
                                $field++;
                            }
                            else{
                                $errors[] = array($row->getRowIndex(),$value,'Data Type Mismatch');
                                $recordsIgnored++;
                                $valid = false;
                                break;
                            }
                        }
                        else{
                            $index = array_search($value, $imports);
                            if($index!==false){
                                $query .= "'".$colleges[$index]."',";
                                $field++;
                            }
                            else{
                                $errors[] = array($row->getRowIndex(),$value,'College Not Found');
                                $recordsIgnored++;
                                $valid = false;
                                break;
                            }
                        }
                    }
                    else{
                        $errors[] = array($row->getRowIndex(),$value,'Null Cell Data');
                        $recordsIgnored++;
                        $valid = false;
                        break;
                    }
                }
                if($valid){
                    if(@mysql_real_escape_string(mysql_query ($query))){
                        $recordsAdded++;
                    }
                    else{
                        $errors[] = array($row->getRowIndex(),$value,'Bad Cell Data');
                        $recordsIgnored++;
                        $valid = false;
                    }
                }
            }
        }
        logActivity(number_format($recordsAdded).' voters have been recorded successfully.');
        echo '{"added":"'.number_format($recordsAdded).
                '","error":"'.number_format($recordsIgnored).
                '","errorList":'.json_encode($errors).'}';
    }
    else{
        
        include '../includes/utilities.php';
        setMessage('Access Denied! You\'re not allowed to execute AJAX<br />files directly. Please login to continue.','../admin.php');
    }
}
else{
    
    include '../includes/utilities.php';
    setMessage('Access Denied! You\'re not logged in<br />or the session has expired.','../admin.php');
}
?>