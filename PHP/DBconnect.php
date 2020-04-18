<?php

    $hostname = "localhost";
    $username = "root";
    $password = "root";
    $databaseName = "flashcards";

    $connect = mysqli_connect($hostname, $username, $password, $databaseName);

    if(!connect){
        echo "Server non raggiungibile.";
    }

    if(!mysqli_select_db($connect, $databaseName)){
        echo "Errore con il database.";
    }

?>