<?php
include './IoOperation.php';
if (isset($_POST["submit"])) {
    $file = $_FILES["fileToUpload"];
    uploadFile($file);
}
else
{
?>

<html>
    <head>
        <title>Upload behavioral file</title>
        
    </head>
    <body>
        <form  method="post" action="uploadBehaviorFile.php" enctype="multipart/form-data">
            <span>Select a JSON file:</span>
            <input name="submit" type="hidden" value="true"/>
            <input name="redirectTo" type="hidden" value="true"/>
            <input type="file" name="fileToUpload"/>
            <button>upload</button>
        </form>
    </body>
</html>
<?php
}
?>