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

?>