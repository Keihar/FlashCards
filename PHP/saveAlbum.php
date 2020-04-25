<?php

    //includo codice per la connessione al DataBase
    include 'DBconnect.php';

    //inizializzo la sessione
    session_start();
    

    $id_album = mysqli_real_escape_string($connect, $_POST["id_album"]);
    $email = mysqli_real_escape_string($connect, $_POST["email"]);

    $insert_saved_str = "INSERT INTO album_salvati(emailUtente, idAlbum) VALUES ('$email', '$id_album')";
    $insert_saved = mysqli_query($connect, $insert_saved_str);

    //se non esiste alcun utente con le credenziali inserite
    if(!$insert_saved){
        echo "error";
    }
    else{
        echo "success";
    }
    

?>