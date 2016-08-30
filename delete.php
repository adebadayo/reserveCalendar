<?php

include 'connect.php';

// postされたデータを取得
$date = $_POST['date'];

// nullチェック
if (empty($date)) {
		header('HTTP/1.1 500 Internal Server Error');
		exit;
	}

try {
	// connect
	$db = connectDB();
	$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);


	$stmt = $db->prepare("update reserve_data set 
							member     = NULL,
							timezone   = NULL,
							purpose    = NULL
							where date = :date");
	$stmt->execute(array(
		':date'     => $date
		));
	
} catch(PDOException $e){
	echo $e->getMessage();
	exit;
}

