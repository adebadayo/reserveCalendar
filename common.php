<?php 
// common.php

function connectDB(){
	define('DB_DATABASE', 'reserve_car');
	define('DB_USERNAME', 'dbuser');
	define('DB_DPASSWORD', '7191kkkk');
	define('PDO_DSN', 'mysql:dbhost=localhos;dbname=' . DB_DATABASE);	

	try {
		return new PDO(PDO_DSN, DB_USERNAME, DB_DPASSWORD);
	} catch(PDOException $e){
		echo $e->getMessage();
		exit;
	}
}

 ?>

