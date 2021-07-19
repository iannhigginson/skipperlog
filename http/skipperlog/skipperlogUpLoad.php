<?php // Errors

 error_reporting(E_ALL);
 ini_set('display_errors', 1);

?>

<?php // Time zone

 date_default_timezone_set("Africa/Johannesburg");

?>

<?php

 $n = file_get_contents("php://input");

 $pre = date("d-m-Y");
 $myFile = $pre . "-skipperlog.json";
 $fh = fopen($myFile, 'w') or die("can't open file");
 fwrite($fh, $n);
 fclose($fh);
 
 echo "Done!";

?>