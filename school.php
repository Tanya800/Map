<?php
if($_SERVER['REQUEST_METHOD'] == 'POST') {
    $fp = fopen("file/district1.txt", "a"); // Открываем файл в режиме записи
    // разделители для полей и для школ
    $sep_info = "๏";
    $sep_school = "๑";

    $school_district = $_POST['school_district'];
    $full_school_name = $_POST['full_school_name'];
    $adress = $_POST['adress'];
    $director = $_POST['director'];
    $director_name = $_POST['director_name'];
    $phone = $_POST['phone'];
    $email = $_POST['email'];
    $website = $_POST['website'];
    $info = $_POST['info'];

    $school_info = (string)$school_district.(string)$sep_info.(string)$full_school_name.(string)$sep_info.(string)$adress.(string)$sep_info.
        (string)$director.(string)$sep_info.(string)$director_name.(string)$sep_info.(string)$phone.(string)$sep_info.(string)$email.
        (string)$sep_info.(string)$website.(string)$sep_info.(string)$info.(string)$sep_school;

    $test = fwrite($fp, $school_info); // Запись в файл

    fclose($fp); //Закрытие файла
    $redirect = isset($_SERVER['HTTP_REFERER'])? $_SERVER['HTTP_REFERER']:'redirect-form.html';
    header("Location: $redirect");
    exit();
}
?>