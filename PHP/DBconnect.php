<?php

    //definisco i parametri per la connessione al DataBase
    $hostname = "localhost";
    $username = "root";
    $password = "root";
    $databaseName = "flashcards";

    //effettuo la connessione
    $connect = mysqli_connect($hostname, $username, $password, $databaseName);

?>