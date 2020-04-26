<?php
//includo codice per la connessione al DataBase
        include 'DBconnect.php';

        //inizializzo la sessione
        session_start();
    
        //catcho la variabile di sessione
        $id_album = mysqli_real_escape_string($connect, $_POST['id']);

        //prendo l'user che ha salvato l'album
        $user = $_SESSION["utente"];

        //prendo email utente
    $get_email_str = "SELECT email FROM Utente WHERE nome='$user'";
    $get_email = mysqli_query($connect, $get_email_str);

    while($row = mysqli_fetch_array($get_email)){
        $email = mysqli_real_escape_string($connect, $row["email"]);
    }

    $remove_album_query = "DELETE FROM album_salvati WHERE emailUtente='$email' AND idAlbum=".$id_album."";
    $remove_album = mysqli_query($connect, $remove_album_query);

    if(!$remove_album){
        echo "error";
    }
    else{
        echo "success";
    }
