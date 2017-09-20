<?php
$cus_id = $_POST['cus_id'];
$id = $_POST['id'] . '_' . $cus_id;
$data = $_POST['imgi'];
$img = $id . '.png';
list ($type, $data) = explode(';', $data);
list (, $data) = explode(',', $data);
$data = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $data));
$oldmask = umask(0);
mkdir('customer/' . $cus_id, 0777, true);
umask($oldmask);
$imgurl = 'customer/' . $cus_id . '/' . $img;
file_put_contents($imgurl, $data);
echo $imgurl;
//echo php_uname('n');
?>
