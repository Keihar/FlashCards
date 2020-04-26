<?php

    //includo codice per la connessione al DataBase
    include 'DBconnect.php';

    //inizializzo la sessione
    session_start();

    $id_album = mysqli_real_escape_string($connect, $_POST["id_album"]);
    $email = mysqli_real_escape_string($connect, $_POST["email"]);
    
    $result_str = "SELECT * FROM album_salvati WHERE emailUtente = '$email' AND idAlbum = '$id_album')";
    $result = mysqli_query($connect, $result_str);

    while ($row = mysqli_fetch_assoc($result)) {
        $array[] = $row;
    }

    if (mysqli_num_rows($array)==0) { exit("saveExisting"); }

    $insert_saved_str = "INSERT INTO album_salvati(emailUtente, idAlbum) VALUES ('$email', '$id_album')";
    $insert_saved = mysqli_query($connect, $insert_saved_str);

    //se non esiste alcun utente con le credenziali inseritee
    if(!$insert_saved){
        echo "error";
    }
    else{
        echo "success";
    }
    

?>