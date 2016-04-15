<?php
include 'controller/db.php';
function getModules() {
	$res = getModulesList ();
	return $res;
}
function getChildren($module_id) {
	$res = getChildrenList ( $module_id );
	return $res;
}
function getChildrenOf($parent_id, $child_id) {
	$res = getChildrenListOf ( $parent_id, $child_id );
	return $res;
}
function saveDesc($child_id, $desc) {
	$res = setDesc ( $child_id, $desc );
	return $res;
}
function doSearch($tag) {
	$res = search ( $tag );
	return $res;
}
function fetchDesc($id) {
	$res = getDesc ( $id );
	return $res;
}
function addKey($parent_id, $key_name,$data_type) {
	return saveKey ( $parent_id, $key_name, $data_type );
}
function fetchKeyId($key_name) {
	$id = getKeyId ( $key_name );
	$res = "{";
	if ($id != - 1)
		$res .= "\"success\":true,\"keyId\":" . $id;
	else
		$res .= "\"success\":false";
	$res .= "}";
	return $res;
}
function addObject($parent_id, $jsonObject) {
	$json = json_decode ( $jsonObject, true );
	if(json_last_error() != 0)
		return "{\"success\":false,\"reason\":\"".json_last_error_msg()."\"}";
	addNode ( $parent_id, $json, 0 );
	
	return "{\"success\":true}";
}


function deleteKeys($keys)
{
	return dropKeys($keys);
}

function myFunc()
{
return "My name is sachin.";
}
?>
