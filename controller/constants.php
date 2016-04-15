<?php
class Constants {
	public static $servername = "localhost";
	public static $username = "root";
	public static $password = "root";
	public static $dbname = "behavioral_file_db";
	
	public static $TABLE_keys = "`keys`";
	public static $KEYS_id = "`id`";
	public static $KEYS_name = "`name`";
	public static $KEYS_data_type = "`data_type`";
	public static $TABLE_keys_assoc = "`keys_assoc`";
	public static $KEYS_ASSOC_parent_key_id = "`parent_key_id`";
	public static $KEYS_ASSOC_child_key_id = "`child_key_id`";
	public static $KEYS_ASSOC_desc = "`desc`";
	public static $KEYS_ASSOC_leaf_key = "`leaf_key`";
	public static $KEYS_ASSOC_level = "`level`";
}
?>
