<?php

    //includo codice per la connessione al DataBase
    include 'DBconnect.php';

    //inizializzo la sessione
    session_start();

    //prendo i campi da inserire nel database
    $fronte_flashcard = $_POST["fronte"];
    $retro_flashcard = $_POST["retro"];
    $id_album = $_POST["albumid"];

    //query per aggiungere la flashcard
    $aggiungi_flashcard_str = "INSERT INTO Flashcard(fronte, retro, id_album) VALUES ('$fronte_flashcard', '$retro_flashcard', ".$id_album.")";
    $aggiungi_flashcard = mysqli_query($connect, $aggiungi_flashcard_str);

    //controllo se la query è andata a buon fine per utilizzare l'ajax
    if(!$aggiungi_flashcard){
        echo "error";
    }
    else{
        echo "success";
    }

    mysqli_close($connect);

?>