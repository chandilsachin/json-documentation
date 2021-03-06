<?php
include 'constants.php';
function flushData() {
	$conn = new mysqli ( Constants::$servername, Constants::$username, Constants::$password, Constants::$dbname );
	// Check connection
	if ($conn->connect_error) {
		die ( "Connection failed: " . $conn->connect_error );
	}
	
	$sql = "DELETE FROM " . Constants::$TABLE_keys_assoc . "";
	if ($conn->query ( $sql ) === TRUE) {
		echo "Record Deleted successfully (Keys_assoc)<br/>";
	} else {
		echo "Error: " . $sql . "<br>" . $conn->error;
	}
	$sql = "DELETE FROM " . Constants::$TABLE_keys . "";
	if ($conn->query ( $sql ) === TRUE) {
		echo "Record Deleted successfully (Keys)<br/>";
	} else {
		echo "Error: " . $sql . "<br>" . $conn->error;
	}
	
	$conn->close ();
}

function makeProject($project_name,$version)
{
    
}

function insertKey($key,$data_type) {
	// Create connection
	$conn = new mysqli ( Constants::$servername, Constants::$username, Constants::$password, Constants::$dbname );
	// Check connection
	if ($conn->connect_error) {
		die ( "Connection failed: " . $conn->connect_error );
	}
	
	$sql = "INSERT INTO " . Constants::$TABLE_keys . "(" . Constants::$KEYS_name . "," . Constants::$KEYS_data_type . ") VALUES ('$key','$data_type')";
	if ($conn->query ( $sql ) === TRUE) {
		//echo "New record created successfully=$key<br/>";
	} else {
		echo "Error: " . $sql . "<br>" . $conn->error;
	}
	
	$conn->close ();
	return getKeyId ( $key );
}

function deleteKey($key_id) {
	// Create connection
	$conn = new mysqli ( Constants::$servername, Constants::$username, Constants::$password, Constants::$dbname );
	
	$sql = "DELETE " . Constants::$TABLE_keys . " WHERE id = '$key_id'";
	if ($conn->query ( $sql ) === TRUE) {
		echo "record deleted=$key<br/>";
	} else {
		echo "Error: " . $sql . "<br>" . $conn->error;
	}

	$conn->close ();
}

function openDB()
{
	return $conn = new mysqli ( Constants::$servername, Constants::$username, Constants::$password, Constants::$dbname );
}



function getKeyId($key) {
	$conn = new mysqli ( Constants::$servername, Constants::$username, Constants::$password, Constants::$dbname );
	// Check connection
	if ($conn->connect_error) {
		die ( "Connection failed: " . $conn->connect_error );
	}
	$id = - 1;
	$sql = "SELECT id FROM " . Constants::$TABLE_keys . " WHERE name='$key'";
	//echo $sql;
	$res = $conn->query ( $sql );
	
	if ($res->num_rows > 1) {
		$sql = "SELECT id FROM " . Constants::$TABLE_keys . " WHERE name='$key' and id not in (SELECT " . Constants::$KEYS_ASSOC_child_key_id . " FROM " . Constants::$TABLE_keys_assoc . ") and id not in (SELECT " . Constants::$KEYS_ASSOC_parent_key_id . " FROM " . Constants::$TABLE_keys_assoc . ")";
		$res = $conn->query ( $sql );
		//echo "<br/>$sql<br/>".$res->num_rows."#".$key."<br/>";
		if ($res->num_rows > 0) {
			if ($row = $res->fetch_assoc ()) {
				$id = $row ['id'];
			}
		}
	} else {
		
		if ($row = $res->fetch_assoc ()) {
			$id = $row ['id'];
		}
	}
	
	$conn->close ();
	return $id;
}
function makeAssoc($parent, $child, $leaf, $level) {
	// Create connection
	$conn = new mysqli ( Constants::$servername, Constants::$username, Constants::$password, Constants::$dbname );
	// Check connection
	if ($conn->connect_error) {
		die ( "Connection failed: " . $conn->connect_error );
	}
	
	$sql = "INSERT INTO " . Constants::$TABLE_keys_assoc . "(parent_key_id,child_key_id,leaf_key,level) VALUES ($parent,$child,$leaf,$level)";
	
	if ($conn->query ( $sql ) === TRUE) {
		//echo "New record created successfully<br/>";
		$string = true;
	} else {
		echo "Error: " . $sql . "<br>" . $conn->error . "= ($parent,$child,$leaf,$level)  ";
		$string = false;
	}
	
	$conn->close ();
	//echo "$parent,$child,$leaf,$level";
	return $string;
}
function getModulesList() {
	// Create connection
	$conn = new mysqli ( Constants::$servername, Constants::$username, Constants::$password, Constants::$dbname );
	// Check connection
	if ($conn->connect_error) {
		die ( "Connection failed: " . $conn->connect_error );
	}
	
	$sql = "SELECT * FROM " . Constants::$TABLE_keys . " WHERE " . Constants::$KEYS_id . " IN (SELECT " . Constants::$KEYS_ASSOC_child_key_id . " FROM " . Constants::$TABLE_keys_assoc . " WHERE " . Constants::$KEYS_ASSOC_parent_key_id . "=(SELECT " . Constants::$KEYS_id . " FROM " . Constants::$TABLE_keys . " WHERE " . Constants::$KEYS_name . "='root'))";
	$res = $conn->query ( $sql );
	
	$string = "[";
	if ($res->num_rows > 0) {
		if ($row = $res->fetch_assoc ()) {
			$string .= makeAnEntry ( $row );
		}
		while ( $row = $res->fetch_assoc () ) {
			$string .= "," . makeAnEntry ( $row );
		}
	}
	$string .= "]";
	$conn->close ();
	return $string;
}
function getChildrenList($module_id) {
	// Create connection
	$conn = new mysqli ( Constants::$servername, Constants::$username, Constants::$password, Constants::$dbname );
	// Check connection
	if ($conn->connect_error) {
		die ( "Connection failed: " . $conn->connect_error );
	}
	$sql = "SELECT " . Constants::$KEYS_id . "," . Constants::$KEYS_name . "," . Constants::$KEYS_ASSOC_desc . " FROM " . Constants::$TABLE_keys . " inner join " . Constants::$TABLE_keys_assoc . "ka 
on " . Constants::$KEYS_id . " = " . Constants::$KEYS_ASSOC_child_key_id . " and " . Constants::$KEYS_ASSOC_parent_key_id . "=$module_id order by " . Constants::$KEYS_name . "" ;
	//$sql = "SELECT * FROM " . Constants::$TABLE_keys . " WHERE " . Constants::$KEYS_id . " IN (SELECT " . Constants::$KEYS_ASSOC_child_key_id . " FROM " . Constants::$TABLE_keys_assoc . " WHERE " . Constants::$KEYS_ASSOC_parent_key_id . "=$module_id)";
	$res = $conn->query ( $sql );
	
	$string = "[";
	if ($res->num_rows > 0) {
		if ($row = $res->fetch_assoc ()) {
			$string .= makeAnEntry1 ( $row );
		}
		while ( $row = $res->fetch_assoc () ) {
			$string .= "," . makeAnEntry1 ( $row );
		}
	}
	$string .= "]";
	$conn->close ();
	return $string;
}

function setDesc($id,$desc)
{
	$conn = new mysqli ( Constants::$servername, Constants::$username, Constants::$password, Constants::$dbname );
	// Check connection
	if ($conn->connect_error) {
		die ( "Connection failed: " . $conn->connect_error );
	}
	
	$sql = "UPDATE " . Constants::$TABLE_keys_assoc .  " SET " . Constants::$KEYS_ASSOC_desc . "='$desc' where " . Constants::$KEYS_ASSOC_child_key_id . "=$id";
	$res = "{";
	if ($conn->query ( $sql ) === TRUE) {
		$res .= "\"success\":true";
		$res .= ",\"desc\":\"$desc\"";
	} else {
		$res .= "\"success\":false";
		$res .= ",\"desc\":\"" . $sql . "#$id#" . $conn->error . "\"";//echo "Error: " . $sql . "<br>" . $conn->error . "= ($parent,$child,$leaf,$level)  ";
	}
	$res .= "}";
	$conn->close ();
	return $res;
}

function search($tag)
{
	$conn = new mysqli ( Constants::$servername, Constants::$username, Constants::$password, Constants::$dbname );
	// Check connection
	if ($conn->connect_error) {
		die ( "Connection failed: " . $conn->connect_error );
	}
	
	$sql = "SELECT * FROM " . Constants::$TABLE_keys . " WHERE " . Constants::$KEYS_id . " IN 
(SELECT " . Constants::$KEYS_ASSOC_child_key_id . " FROM " . Constants::$TABLE_keys_assoc . " WHERE 
" . Constants::$KEYS_ASSOC_desc . " like '$tag') or " . Constants::$KEYS_name . " like '$tag'";
	//echo $sql;
	$res = $conn->query ( $sql );
	//echo $sql;
	$string = "[";
	if ($res->num_rows > 0) {
		if ($row = $res->fetch_assoc ()) {
			$string .= "{\"id\":".$row['id'].",\"name\":\"".$row['name']."\"}";
		}
		while ( $row = $res->fetch_assoc () ) {
			$string .= ",{\"id\":".$row['id'].",\"name\":\"".$row['name']."\"}";
		}
	}
	$string .= "]";
	$conn->close ();
	return $string;
}

function getDesc($id)
{
	$conn = new mysqli ( Constants::$servername, Constants::$username, Constants::$password, Constants::$dbname );
	// Check connection
	if ($conn->connect_error) {
		die ( "Connection failed: " . $conn->connect_error );
	}
	
	$sql = "SELECT " . Constants::$KEYS_ASSOC_child_key_id . " as id," . Constants::$KEYS_name . "," . Constants::$KEYS_ASSOC_desc . " FROM " . Constants::$TABLE_keys_assoc . " inner join " . Constants::$TABLE_keys . " on (" . Constants::$KEYS_ASSOC_child_key_id . "=$id)and " . Constants::$KEYS_id . "=$id";
	$res = $conn->query ( $sql );
	//echo $sql;
	$string = "{";
	if ($res->num_rows > 0) {
		if ($row = $res->fetch_assoc ()) {
			$string .= "\"success\":true,\"name\":\"".$row['name']."\",\"desc\":\"".$row['desc']."\",\"id\":\"".$row['id']."\"";
		}
		/* while ( $row = $res->fetch_assoc () ) {
			$string .= ",{\"id\":true,\"desc\":\"".$row['desc']."\"}";
		} */
	}
	else
		$string .= "\"success\":false,\"reason\":\"".$sql ."#".$conn->error."\"";
	
	$string .= "}";
	$conn->close ();
	return $string;
}

function getChildrenListOf($parent_id, $child_id) {
	// Create connection
	$conn = new mysqli ( Constants::$servername, Constants::$username, Constants::$password, Constants::$dbname );
	// Check connection
	if ($conn->connect_error) {
		die ( "Connection failed: " . $conn->connect_error );
	}
	
	$sql = "SELECT * FROM " . Constants::$TABLE_keys . " WHERE " . Constants::$KEYS_id . " IN (SELECT " . Constants::$KEYS_ASSOC_child_key_id . " FROM " . Constants::$TABLE_keys_assoc . " WHERE " . Constants::$KEYS_ASSOC_parent_key_id . "=$parent_id and " . Constants::$KEYS_ASSOC_child_key_id . "=$child_id)";
	$res = $conn->query ( $sql );
	
	$string = "[";
	if ($res->num_rows > 0) {
		if ($row = $res->fetch_assoc ()) {
			$string .= makeAnEntry ( $row );
		}
		while ( $row = $res->fetch_assoc () ) {
			$string .= "," . makeAnEntry ( $row );
		}
	}
	$string .= "]";
	$conn->close ();
	return $string;
}


function saveKey($parent_id,$key_name,$data_type)
{
	
/* 	$conn = new mysqli ( Constants::$servername, Constants::$username, Constants::$password, Constants::$dbname );
	
	$conn->autocommit(FALSE);
	
	$sql = "INSERT INTO " . Constants::$TABLE_keys . "(name) VALUES ('$key_name')";
	
	if ($conn->query ( $sql ) === TRUE) {
		$child = getKeyId ( $key_name );
		if($child != -1)
		{
			$sql = "INSERT INTO " . Constants::$TABLE_keys_assoc . "(parent_key_id,child_key_id,leaf_key,level) VALUES ($parent,$child,$leaf,$level)";
			
			if ($conn->query ( $sql ) === TRUE) {
				$conn->commit();
				$string .= "\"success\":true";
			} else {
				
				$conn->rollback();
				$string .= "\"success\":false";
			}
		}
		else 
		{
			
			$conn->rollback();
			$string .= "\"success\":false";
		}
	} else {
		
		$conn->rollback();
		$string .= "\"success\":false";
	}
	
	
	$conn->close (); */
	$string = "{";
	$child_id = insertKey($key_name,$data_type);
	
	if($child_id != -1)
	{
		if(makeAssoc($parent_id, $child_id, 1, 0))
		{
			$string .= "\"success\":true";
		}
		else 
		{
			deleteKey($child_id);
			$string .= "\"success\":false";
		}
	}
	else
		$string .= "\"success\":false";
	$string .= "}";
	return $string;
}

function makeAnEntry($row) {
	return "{\"id\":\"" . $row ['id'] . "\",\"name\":\"" . $row ['name'] . "\"}";
}

function makeAnEntry1($row) {
	return "{\"id\":\"" . $row ['id'] . "\",\"name\":\"" . $row ['name'] . "\",\"desc\":\"" . $row ['desc'] . "\"}";
}

function dropKeys($key_array)
{
	$conn = new mysqli ( Constants::$servername, Constants::$username, Constants::$password, Constants::$dbname );
	// Check connection
	if ($conn->connect_error) {
		die ( "Connection failed: " . $conn->connect_error );
	}
	mysqli_autocommit($conn,FALSE);
	
	$res = "{";
	$sql = "DELETE FROM " . Constants::$TABLE_keys_assoc . " WHERE " . Constants::$KEYS_ASSOC_child_key_id . " in ($key_array) or " . Constants::$KEYS_ASSOC_parent_key_id . " in ($key_array)";
	
	if ($conn->query ( $sql ) === TRUE) {
		} else {
		$res .= "\"success\":false,\"success\":\"$sql = $conn->error\"";
		$res .= "}";
		return $res;
		// 		echo "Error: " . $sql . "<br>" . $conn->error;
	}

	
	
	
	$sql = "DELETE FROM " . Constants::$TABLE_keys . " WHERE " . Constants::$KEYS_id . " in ($key_array)";
	if ($conn->query ( $sql ) === TRUE) {
		$res .= "\"success\":true";
		mysqli_commit($conn);
	} else {
		mysqli_rollback($conn);
		$res .= "\"success\":false,\"success\":\"$sql = $conn->error\"";
// 		echo "Error: " . $sql . "<br>" . $conn->error;
	}
	
	$conn->close ();
	$res .= "}";
	return $res;
}

function addNode($parent,$jsonObject,$level)
{
	$keyList = array();
	if(!is_array($jsonObject))
		return;
	$level++;
	
	foreach($jsonObject as $row => $val)
	{
		//echo $row;
		if(!is_int($row))
		{
				
			$child_id = insertKey($row);
			if(is_array($val))
				makeAssoc($parent, $child_id, 0, $level);
			else
				makeAssoc($parent, $child_id, 1, $level);
				
			addNode($child_id,$val,$level);
		}
			
	}
}
?>