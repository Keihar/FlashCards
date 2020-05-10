<?php

    date_default_timezone_set('Europe/Rome');

    //includo codice per la connessione al DataBase
    include 'DBconnect.php';

    //inizializzo la sessione
    session_start();

    $user = mysqli_real_escape_string($connect, $_SESSION["user"]);

    $testo = mysqli_real_escape_string($connect, $_POST['testo']);
    
    $data = date('Y-m-d H:i:s');

    $preleva_email_str = "SELECT email FROM Utente WHERE Utente.nome='$user'";
    $preleva_email = mysqli_query($connect, $preleva_email_str);
    $usermail = null;
    while ($row = mysqli_fetch_array($preleva_email)) {
        $usermail = mysqli_real_escape_string($connect, $row["email"]);
    }

    $insert_idea_query = "INSERT INTO idea (autore,testo,data) VALUES ('$user', '$testo', '$data')";
    $insert_idea = mysqli_query($connect, $insert_idea_query);

    mysqli_close($connect);


?>