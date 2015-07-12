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

?>