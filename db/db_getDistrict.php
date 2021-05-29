<?php
include("connect.php");
$link = mysqli_connect($host, $user, $password, $database)
or die("Ошибка " . mysqli_error($link));

if($_POST['id_dist']  != null){
    $district = $_POST['id_dist'];
}else{
    $district = 500;
}
$query ="SELECT name FROM district WHERE id_district =".$district.";";


$result = mysqli_query($link, $query) or die("Ошибка " . mysqli_error($link));



if($result)
{
    while($row = $result->fetch_assoc())// получаем все строки в цикле по одной
    {
        echo '<p>'.$row['name'].'</p>';
    }
}
mysqli_close($link);


?>