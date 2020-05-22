<?php

    date_default_timezone_set('Europe/Rome');

    //includo codice per la connessione al DataBase
    include 'DBconnect.php';

    //inizializzo la sessione
    session_start();

    $user = mysqli_real_escape_string($connect, $_SESSION["utente"]);

    $testo = mysqli_real_escape_string($connect, $_POST['testo']);

    $data = date('Y-m-d H:i:s');

    $insert_idea_query = "INSERT INTO idea (autore,testo,data) VALUES ('$user', '$testo', '$data')";
    $insert_idea = mysqli_query($connect, $insert_idea_query);

    mysqli_close($connect);

?>