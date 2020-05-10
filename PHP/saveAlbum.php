<?php

    //setto la zona di prelevamento data
    date_default_timezone_set('Europe/Rome');

    //includo codice per la connessione al DataBase
    include 'DBconnect.php';

    //inizializzo la sessione
    session_start();

    $id_album = mysqli_real_escape_string($connect, $_POST["id_album"]);
    $user = mysqli_real_escape_string($connect, $_SESSION["utente"]);

    $get_email_query = "SELECT email FROM Utente WHERE nome = '$user'";
    $get_email = mysqli_query($connect, $get_email_query);

    while($row = mysqli_fetch_array($get_email)){
        $email = mysqli_real_escape_string($connect, $row["email"]);
    }

    $result_str = "SELECT id FROM album_salvati WHERE emailUtente = '$email' AND idAlbum = '$id_album'";
    $result = mysqli_query($connect, $result_str);

    if($result){

        while($row = mysqli_fetch_array($result)){
            $salvati = mysqli_real_escape_string($connect, $row["id"]);
        }

    if (mysqli_num_rows($result)!=0) { exit("saveExisting"); }

    else{
        $data = date('Y-m-d H:i:s');

        $insert_saved_str = "INSERT INTO album_salvati(emailUtente, idAlbum, data) VALUES ('$email', '$id_album', '$data')";
        $insert_saved = mysqli_query($connect, $insert_saved_str);
    
        //se non esiste alcun utente con le credenziali inseritee
        if(!$insert_saved){
            echo "error";
        }
        else{
            echo "success";
        }
    }
    }




    

?>