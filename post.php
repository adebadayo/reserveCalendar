<?php

include 'connect.php';

// postされたデータを取得
$member = $_POST['member'];
$timeZone = $_POST['timeZone'];
$purpose = $_POST['purpose'];
$date = $_POST['date'];

// nullチェック
if (empty($member)   ||
	empty($timeZone) ||
	empty($purpose)  ||
	empty($date)) {
		header('HTTP/1.1 500 Internal Server Error');
		exit;
	}

try {
	// connect
	$db = connectDB();
	$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

	//insert
	// $db->exec("insert into users (name, score) value ('taguchi', 55)"); 
	// echo "user added!";

	// update 
	$stmt = $db->prepare("update reserve_data set 
							member     = :member,
							timezone   = :timezone,
							purpose    = :purpose
							where date = :date");
	$stmt->execute(array(
		':member'   => $member, 
		':timezone' => $timeZone,
		':purpose'  => $purpose,
		':date'     => $date
		));
	
	// $stmt = $db->query("select * from users");
	// $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

	// foreach($users as $user){
	// 	var_dump($user);
	// }

	// echo $stmt->rowCount() . "records found.";
	// // disconnect

	//main
	$res = array();
	$data = array();

	$data[] = array("name"=>"sato","age"=>"44");
	$data[] = array("name"=>"ito","age"=>"22");
	$data[] = array("name"=>"tanaka","age"=>"33");
	$data[] = array("name"=>"suzuki","age"=>"55");

	$res['status'] = "OK";
	$res['data'] = $data;
	
	header("Content-type: application/json");
	echo json_encode($res);
	exit;

	// header("Access-Control-Allow-Origin: *"); // クロスドメイン通信の許可
	// $json = file_get_contents('./sample.json'); // 読み込むJSONファイルを指定
	// header('Content-Type: text/javascript; charset=utf-8');
	// echo $_GET['callback'] . '('. $json .')';

} catch(PDOException $e){
	echo $e->getMessage();
	exit;
}

