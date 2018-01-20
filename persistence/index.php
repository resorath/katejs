<?php


function db_connect() 
{
	static $connection;
	$config = parse_ini_file('database.ini'); 

	if(isset($connection))
		return $connection;

	$connection = new mysqli($config['hostname'],$config['username'],$config['password'],$config['dbname']);

	if(mysqli_connect_errno())
	{
		$error = new \stdClass();
		$error->status = 500;
		$error->reason = "Can't connect to database";

		header("HTTP/1.1 500 Internal Server Error");

		echo(json_encode($error));

		exit();
	}

	return $connection;
}

function db_get_user_username($username)
{
	$connection = db_connect();

	$result = new \stdClass();

	if($st = $connection->prepare("SELECT username, email, lesson FROM users WHERE username=?"))
	{

		$st->bind_param("s", $username);

		$st->execute();

		$st->bind_result($result->username, $result->email, $result_lesson);

		if($st->fetch() == null)
			return null;
	}

	return $result;
}

function db_get_user_email($email)
{
	$connection = db_connect();

	$result = new \stdClass();

	if($st = $connection->prepare("SELECT username, email, lesson FROM users WHERE email=?"))
	{

		$st->bind_param("s", $email);

		$st->execute();

		$st->bind_result($result->email, $result->email, $result_lesson);

		if($st->fetch() == null)
			return null;
	}

	return $result;
}

function db_get_user_password($username, $password)
{
	$connection = db_connect();

	$result = new \stdClass();

	if($st = $connection->prepare("SELECT username, email, lesson FROM users WHERE username=? AND password=?"))
	{

		$st->bind_param("ss", $username, $password);

		$st->execute();

		$st->bind_result($result->username, $result->email, $result_lesson);

		if($st->fetch() == null)
			return null;
	}

	return $result;
}

function db_create_user($username, $password, $email, $lesson)
{
	if(db_get_user_username($username) != null)
		return "Username already exists";

	if(db_get_user_email($email) != null)
		return "Email already exists";

	$connection = db_connect();


	if($st = $connection->prepare("INSERT INTO users (username, password, email, lesson) VALUES (?,?,?,?)"))
	{
		$pw = password_hash($password, PASSWORD_BCRYPT);
		$st->bind_param("sssi", $username, $pw, $email, $lesson);

		return $st->execute();
	}	
}

session_start();

$response = new \stdClass();

print_r(db_create_user("cat", "dog", "cat@catdog.horse", 1));

if(array_key_exists("username", $_GET))
{
	if(array_key_exists("username", $_SESSION))
	{
		$response->success = true;
		$response->username = $_SESSION['username'];
	}
	else
	{
		$response->success = false;
	}
}

if(array_key_exists("lesson", $_GET))
{
	if(array_key_exists("lesson", $_SESSION))
	{
		$response->success = true;
		$response->username = $_SESSION['lesson'];
	}
	else
	{
		$response->success = false;
	}
}

if(array_key_exists("action", $_POST))
{
	if($_POST['action'] == "login")
	{
		if(!array_key_exists("username", $_POST) || !array_key_exists("password", $_POST))
		{
			$response->success = false;
			$response->reason = "Bad syntax";
		}
		else
		{
			$username = $_POST['username'];
			$password = password_hash($_POST['password'], PASSWORD_BCRYPT);

			$user = db_get_user_password($username, $password);
		}

	}

	else if($_POST['action'] == "logout")
	{

	}

	else if($_POST['action'] == "register")
	{

	}

	else if($_POST['action'] == "forgot")
	{

	}


}

echo(json_encode($response));