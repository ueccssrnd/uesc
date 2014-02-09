<?php
session_start();
require '../includes/utilities.php';
if(isset($_SESSION['agent'])&&$_SESSION['agent']==md5($_SERVER['HTTP_USER_AGENT'])&&isset($_SESSION['type'])&&($_SESSION['type']=='Administrator'||$_SESSION['type']=='Facilitator')){
    // HTTP headers for no cache
    header("Expires: Sun, 15 May 1994 08:00:00 GMT");
    header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");
    header("Cache-Control: no-store, no-cache, must-revalidate");
    header("Cache-Control: post-check=0, pre-check=0", false);
    header("Pragma: no-cache");

    // Settings
    $targetDir = '..'. DIRECTORY_SEPARATOR."images".DIRECTORY_SEPARATOR."candidates";
    //$targetDir = 'uploads';

    // 5 minutes execution time
    @set_time_limit(5 * 60);

    // Get parameters
    $chunk = isset($_REQUEST["chunk"]) ? intval($_REQUEST["chunk"]) : 0;
    $chunks = isset($_REQUEST["chunks"]) ? intval($_REQUEST["chunks"]) : 0;
    $fileName = isset($_REQUEST["name"]) ? $_REQUEST["name"] : '';

    // Clean the fileName for security reasons
    //$fileName = preg_replace('/[^\w\._]+/', '_', $fileName);

    // Make sure the fileName is unique but only if chunking is disabled
    if ($chunks < 2 && file_exists($targetDir . DIRECTORY_SEPARATOR . $fileName)) {
            $ext = strrpos($fileName, '.');
            $fileName_a = substr($fileName, 0, $ext);
            $fileName_b = substr($fileName, $ext);

            $count = 1;
            while (file_exists($targetDir . DIRECTORY_SEPARATOR . $fileName_a . '_' . $count . $fileName_b))
                    $count++;

            $fileName = $fileName_a . '_' . $count . $fileName_b;
    }

    $filePath = $targetDir . DIRECTORY_SEPARATOR . $fileName;

    // Create target dir
    if (!file_exists($targetDir))
        @mkdir($targetDir);	

    // Look for the content type header
    if (isset($_SERVER["HTTP_CONTENT_TYPE"]))
            $contentType = $_SERVER["HTTP_CONTENT_TYPE"];

    if (isset($_SERVER["CONTENT_TYPE"]))
            $contentType = $_SERVER["CONTENT_TYPE"];

    // Handle non multipart uploads older WebKit versions didn't support multipart in HTML5
    if (strpos($contentType, "multipart") !== false) {
            if (isset($_FILES['file']['tmp_name']) && is_uploaded_file($_FILES['file']['tmp_name'])) {
                    // Open temp file
                    $out = fopen("{$filePath}.part", $chunk == 0 ? "wb" : "ab");
                    if ($out) {
                            // Read binary input stream and append it to temp file
                            $in = fopen($_FILES['file']['tmp_name'], "rb");

                            if ($in) {
                                    while ($buff = fread($in, 4096))
                                            fwrite($out, $buff);
                            } else
                                    die('{"jsonrpc" : "2.0", "error" : {"code": 101, "message": "Failed to open input stream."}, "id" : "id"}');
                            fclose($in);
                            fclose($out);
                            @unlink($_FILES['file']['tmp_name']);
                    } else
                            die('{"jsonrpc" : "2.0", "error" : {"code": 102, "message": "Failed to open output stream."}, "id" : "id"}');
            } else
                    die('{"jsonrpc" : "2.0", "error" : {"code": 103, "message": "Failed to move uploaded file."}, "id" : "id"}');
    } else {
            // Open temp file
            $out = fopen("{$filePath}.part", $chunk == 0 ? "wb" : "ab");
            if ($out) {
                    // Read binary input stream and append it to temp file
                    $in = fopen("php://input", "rb");

                    if ($in) {
                            while ($buff = fread($in, 4096))
                                    fwrite($out, $buff);
                    } else
                            die('{"jsonrpc" : "2.0", "error" : {"code": 101, "message": "Failed to open input stream."}, "id" : "id"}');

                    fclose($in);
                    fclose($out);
            } else
                    die('{"jsonrpc" : "2.0", "error" : {"code": 102, "message": "Failed to open output stream."}, "id" : "id"}');
    }

    // Check if file has been uploaded
    if (!$chunks || $chunk == $chunks - 1) {
            // Strip the temp .part suffix off 
            rename("{$filePath}.part", $filePath);
    }


    // Return JSON-RPC response
    die('{"jsonrpc" : "2.0", "result" : null, "id" : "id"}');
}
else{
    setMessage('Access Denied! You\'re not logged in<br />or the session has expired.','../admin.php');
}
?>