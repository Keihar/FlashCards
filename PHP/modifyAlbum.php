<?php

    //includo codice per la connessione al DataBase
    include '$DBconnect';

    //inizializzo la sessione
    session_start();

    //prendo l'id dell'album corrente
    $id_album = $_SESSION['currentAlbum'];

    //nome, descrizione
    $nome = $_POST["nome"];
    $descrizione = $_POST["descrizione"];

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