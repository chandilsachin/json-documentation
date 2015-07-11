<?php
include 'constants.php';
function insertKey($key) {
	// Create connection
	$servername = "localhost";
	$username = "root";
	$password = "root";
	$dbname = "behavioral_file_db";
	$conn = new mysqli ( Constants::$servername, Constants::$username, Constants::$password, Constants::$dbname );
	// Check connection
	if ($conn->connect_error) {
		die ( "Connection failed: " . $conn->connect_error );
	}
	
	$sql = "INSERT INTO ".Constants::$TABLE_keys."(name) VALUES ('$key')";
	
	if ($conn->query ( $sql ) === TRUE) {
		echo "New record created successfully";
	} else {
		echo "Error: " . $sql . "<br>" . $conn->error;
	}
	
	$conn->close ();
	echo $key . "<br>";
}
function makeAssoc($parent, $child, $leaf, $level) {
	// Create connection
	$servername = "localhost";
	$username = "root";
	$password = "root";
	$dbname = "behavioral_file_db";
	$conn = new mysqli ( Constants::$servername, Constants::$username, Constants::$password, Constants::$dbname );
	// Check connection
	if ($conn->connect_error) {
		die ( "Connection failed: " . $conn->connect_error );
	}
	
	$sql = "INSERT INTO ".Constants::$TABLE_keys_assoc."(parent_key_id,child_key_id,leaf_key,level) VALUES ((select id from ".Constants::$TABLE_keys." where name='$parent'),
(select id from ".Constants::$TABLE_keys." where name='$child'),$leaf,$level)";
	
	if ($conn->query ( $sql ) === TRUE) {
		echo "New record created successfully";
	} else {
		echo "Error: " . $sql . "<br>" . $conn->error;
	}
	
	$conn->close ();
	echo "$parent,$child,$leaf,$level";
}
function getModulesList() {
	// Create connection
	
	$conn = new mysqli ( Constants::$servername, Constants::$username, Constants::$password, Constants::$dbname );
	// Check connection
	if ($conn->connect_error) {
		die ( "Connection failed: " . $conn->connect_error );
	}
	
	$sql = "SELECT * FROM ".Constants::$TABLE_keys." WHERE ".Constants::$KEYS_id." IN (SELECT ".Constants::$KEYS_ASSOC_child_key_id." FROM ".Constants::$TABLE_keys_assoc." WHERE ".Constants::$KEYS_ASSOC_parent_key_id."=(SELECT ".Constants::$KEYS_id." FROM ".Constants::$TABLE_keys." WHERE ".Constants::$KEYS_name."='root'))";
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

	$sql = "SELECT * FROM ".Constants::$TABLE_keys." WHERE ".Constants::$KEYS_id." IN (SELECT ".Constants::$KEYS_ASSOC_child_key_id." FROM ".Constants::$TABLE_keys_assoc." WHERE ".Constants::$KEYS_ASSOC_parent_key_id."=$module_id)";
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
function makeAnEntry($row) {
	return "{\"id\":\"".$row['id']."\",\"name\":\"".$row['name']."\"}";
}
?>