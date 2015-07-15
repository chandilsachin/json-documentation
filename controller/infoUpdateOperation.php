<?php
include 'controller/db.php';
function getModules()
{
	$res = getModulesList();
	return $res;
}

function getChildren($module_id)
{
	$res = getChildrenList($module_id);
	return $res;
}

function getChildrenOf($parent_id,$child_id)
{
	$res = getChildrenListOf($parent_id,$child_id);
	return $res;
}

function saveDesc($child_id,$desc)
{
	$res = setDesc($child_id,$desc);
	return $res;
}

function doSearch($tag)
{
	$res = search($tag);
	return $res;
}

function fetchDesc($id)
{
	$res = getDesc($id);
	return $res;
}

function addKey($parent_id,$key_name)
{
	return saveKey($parent_id, $key_name);
}

function fetchKeyId($key_name)
{
	$id = getKeyId($key_name);
	$res = "{";
	if($id != -1)
		$res .= "\"success\":true,\"keyId\":".$id;
	else 
		$res .= "\"success\":false";
	$res .= "}";
	return $res;
}

?>