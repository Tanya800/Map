<?php
$host = 'localhost'; // адрес сервера
$database = 'f0535076_school'; // имя базы данных
$user = 'f0535076_school'; // имя пользователя
$password = 'school'; // пароль



// подключаемся к серверу
$link = mysqli_connect($host, $user, $password, $database)
or die("Ошибка " . mysqli_error($link));

// выполняем операции с базой данных
$query ="SELECT * FROM district";
$result = mysqli_query($link, $query) or die("Ошибка " . mysqli_error($link));
if($result)
{
    echo "Выполнение запроса прошло успешно";
}

// закрываем подключение
mysqli_close($link);
?>