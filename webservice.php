<?php
include 'controller/infoUpdateOperation.php';
require_once ('lib/nusoap.php');
$server = new nusoap_server ();
$server->configureWSDL ( "docOpeRequest", "urn:docOpeRequest" );
$server->register( "getModules", array (), array (
		'return' => 'xsd:string' 
),"urn:docOpeRequest" );

$server->register( "getChildren", array ('parameter' => 'xsd:integer'), array (
		'return' => 'xsd:string'
),"urn:docOpeRequest" );

$server->register( "getChildrenOf", array ('parent_id' => 'xsd:integer','child_id' => 'xsd:integer'), array (
		'return' => 'xsd:string'
),"urn:docOpeRequest" );

$server->register( "saveDesc", array ('child_id' => 'xsd:integer','desc' => 'xsd:string'), array (
		'return' => 'xsd:string'
),"urn:docOpeRequest" );

$server->register( "doSearch", array ('tag' => 'xsd:string'), array (
		'return' => 'xsd:string'
),"urn:docOpeRequest" );

$server->register( "fetchDesc", array ('id' => 'xsd:integer'), array (
		'return' => 'xsd:string'
),"urn:docOpeRequest" );

$HTTP_RAW_POST_DATA = isset ( $HTTP_RAW_POST_DATA ) ? $HTTP_RAW_POST_DATA : '';
$server->service ( $HTTP_RAW_POST_DATA );
?>