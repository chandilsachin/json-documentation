<?php

include 'db.php';

$target_dir = "uploads/";

$target_file = $target_dir . basename($_FILES["fileToUpload"]["name"]);
$uploadOk = 1;
$imageFileType = pathinfo($target_file, PATHINFO_EXTENSION);
// Check if image file is a actual image or fake image
if (isset($_POST["submit"])) {
    $check = getimagesize($_FILES["fileToUpload"]["tmp_name"]);
    if ($check !== false) {
        echo "File is an image - " . $check["mime"] . ".";
        $uploadOk = 1;
    } else {
        echo "File is not an image.";
        $uploadOk = 0;
    }
}
// Check if file already exists
/* if (file_exists($target_file)) {
  echo "Sorry, file already exists.";
  $uploadOk = 0;
  } */
// Check file size
if ($_FILES["fileToUpload"]["size"] > 500000) {
    echo "Sorry, your file is too large.";
    $uploadOk = 0;
}
// Allow certain file formats
if ($imageFileType != "json" && $imageFileType != "txt") {
    echo "Sorry, only txt, & JSON files are allowed.";
    $uploadOk = 0;
}
// Check if $uploadOk is set to 0 by an error
if ($uploadOk == 0) {
    echo "Sorry, your file was not uploaded.";
// if everything is ok, try to upload file
} else {
    if (move_uploaded_file($_FILES["fileToUpload"]["tmp_name"], $target_file)) {
        echo "The file " . basename($_FILES["fileToUpload"]["name"]) . " has been uploaded.";
        flushData();
        extractKeys($target_file);
        //extractKeys($target_file,false);
    } else {
        echo "Sorry, there was an error uploading your file.";
    }
}

// $keyList = array();
function extractKeys($filePath) {
    $fileContent = file_get_contents($filePath); //fread($file, filesize($filePath));
    $jsonObject = json_decode($fileContent, true);
    browseNode(insertKey("root"), $jsonObject, 0);
}

function browseNode($parent, $jsonObject, $level) {
    if (!is_array($jsonObject))
        return;
    $level++;
    foreach ($jsonObject as $row => $val) {
        //echo $row;
        if (!is_int($row)) {

            $child_id = insertKey($row,  gettype($val));
            echo "<br/> " . $child_id . "-" . $row . "<br/>";
            if (is_array($val))
                makeAssoc($parent, $child_id, 0, $level);
            else
                makeAssoc($parent, $child_id, 1, $level);

            browseNode($child_id, $val, $level);
        }
    }
}

// echo getKeyId("appCommonUI");
?>