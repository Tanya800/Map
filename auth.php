<?php
if($_SERVER['REQUEST_METHOD'] == 'POST') {
    $auth = 0;
    $login = $_POST['login'];
    $password= $_POST['password'];

    if($login =="admin" && $password =="12345") {
        echo "Режим администратора.";
        $auth = 1;
    }else{
        echo "Не соответсвующие логин или пароль.";
    }

}
?>
