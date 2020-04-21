<?php

    //includo codice per la connessione al DataBase
    include 'DBconnect.php';

    //inizializzo la sessione
    session_start();

    //prendo l'id dell'album corrente
    $id_album = mysqli_real_escape_string($connect, $_SESSION['currentAlbum']);

    //nome, descrizione
    $nome = mysqli_real_escape_string($connect, $_POST["nome"]);
    $descrizione = mysqli_real_escape_string($connect, $_POST["descrizione"]);

    //query per modificare l'album
    $update_query = "UPDATE Album SET nome='$nome', descrizione='$descrizione' WHERE id='$id_album'";
    $update = mysqli_query($connect, $update_query);

    //controllo se la query è andata a buon fine per utilizzare l'ajax
    if(!$update){
        echo "error";
    }
    else{
        echo "success";
    }

?>