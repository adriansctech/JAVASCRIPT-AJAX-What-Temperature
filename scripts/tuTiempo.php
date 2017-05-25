<?php
header('Content-type: application/xml');
echo file_get_contents("http://xml.tutiempo.net/xml/".$_REQUEST['codigo'].".xml");
?>
