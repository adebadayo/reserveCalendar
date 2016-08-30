<?php

include 'connect.php';

try {
	// connect
	$db = connectDB();
	$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

	$stmt = $db->query("select * from reserve_data");
	$reserve = $stmt->fetchALL(PDO::FETCH_ASSOC);

	$res['data'] = $reserve;

	header("Content-type: application/json");
	echo json_encode($res);
	exit;

} catch(PDOException $e){
	echo $e->getMessage();
	exit;
}
?>