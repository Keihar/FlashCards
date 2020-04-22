<?php

    //includo codice per la connessione al DataBase
    include 'DBconnect.php';

    //inizializzo la sessione
    session_start();

    //prendo l'id della flashcard corrente
    $id_flashcard = mysqli_real_escape_string($connect, $_POST["id"]);

    //fronte, retro
    $fronte = mysqli_real_escape_string($connect, $_POST["fronte"]);
    $retro = mysqli_real_escape_string($connect, $_POST["retro"]);

    //query per modificare la sessione
    $update_query = "UPDATE Flashcard SET fronte='$fronte', retro='$retro' WHERE id=".$id_flashcard."";
    $update = mysqli_query($connect, $update_query);

    //controllo se la query è andata a buon fine per utilizzare l'ajax
    if(!$update){
        echo "error";
    }
    else{
        echo "success";
    }
