<?php

header('Content-type: application/json');

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

		$st->bind_result($result->username, $result->email, $result->lesson);

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

	if($st = $connection->prepare("SELECT username, password, email, lesson FROM users WHERE username=?"))
	{
		$st->bind_param("s", $username);

		$st->execute();

		$st->bind_result($result->username, $result->password, $result->email, $result->lesson);

		if($st->fetch() == null)
			return null;

		if(!password_verify($password, $result->password))
			return null;

		$result->password = null;


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
	switch($_POST['action'])
	{
		case "login":
			if(!array_key_exists("username", $_POST) || !array_key_exists("password", $_POST))
			{
				$response->success = false;
				$response->reason = "Bad syntax";
			}
			else
			{
				$username = $_POST['username'];
				$password = $_POST['password'];

				$user = db_get_user_password($username, $password);

				if($user == null)
				{
					$response->success = false;
					$response->reason = "Login failed";
				}
				else
				{
					$_SESSION['username'] = $user->username;
					$_SESSION['lesson'] = $user->lesson;

					$response->success = true;
					$response->username = $user->username;
					$response->lesson = $user->lesson;
				}
			}
			break;

		case "logout":
			$_SESSION = array();
			if (ini_get("session.use_cookies")) 
			{
			    $params = session_get_cookie_params();
			    setcookie(session_name(), '', time() - 42000,
			        $params["path"], $params["domain"],
			        $params["secure"], $params["httponly"]
			    );
			}
			
			session_destroy();
			$response->success = true;
			break;

		case "register":
			if(!array_key_exists("username", $_POST) || !array_key_exists("password", $_POST) || !array_key_exists("lesson", $_POST))
			{
				$response->success = false;
				$response->reason = "Bad syntax";
			}

			if(!array_key_exists("email", $_POST))
				$_POST['email'] = null;

			$result = db_create_user($_POST['username'], $_POST['password'], $_POST['email'], $_POST['lesson']);

			if($result === true)
			{
				$response->success = true;
				$response->username = $_POST['username'];
			}
			else
			{
				$response->success = false;
				$response->reason = $result;
			}
			break;

		case "forgot":
			break;
	}


}

echo(json_encode($response));