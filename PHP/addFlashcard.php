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

    //query per prelevare id flashcard
    $preleva_id_flashcard_str = "SELECT id FROM Flashcard WHERE fronte='$fronte_flashcard' AND retro='$retro_flashcard' AND id_album=".$id_album."";
    $preleva_id_flashcard = mysqli_query($connect, $preleva_id_flashcard_str);

    while($row = mysqli_fetch_array($row)){
        $id_flashcard = $row["id"];
    }

    //controllo se la query è andata a buon fine per utilizzare l'ajax
    if(!$aggiungi_flashcard){
        echo "error";
    }
    else{
        echo $id_flashcard;
    }

    //chiudo la connessione
    mysqli_close($connect);

?>