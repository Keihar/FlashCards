<?php

    //includo codice per la connessione al DataBase
    include 'DBconnect.php';

    //inizializzo la sessione
    session_start();
    
    //prendo l'ID della flashcard da cancellare
    $id_flashcard = mysqli_real_escape_string($connect, $_POST["id"]);

    //query per cancellare la suddetta flashcard
    $delete_flashcard_str = "DELETE FROM Flashcard WHERE id=".$id_flashcard."";
    $delete_flashcard = mysqli_query($connect, $delete_flashcard_str);

    //controllo se la query è andata a buon fine per utilizzare l'ajax
    if(!$delete_flashcard){
        echo "error";
    }
    else{
        echo "success";
    }

    //chiudo la connessione
    mysqli_close($connect);
