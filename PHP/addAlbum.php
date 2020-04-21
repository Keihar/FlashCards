<?php

    //effettuo l'include per connettermi al DataBase
    include 'DBconnect.php';
    
    session_start();

    $nome_album = mysqli_real_escape_string($connect, $_POST['nome_album']);
    $descrizione = mysqli_real_escape_string($connect, $_POST['descrizione']);
    

    //Prendo l'utente
    $user = mysqli_real_escape_string($connect, $_SESSION['utente']);
    
    //query per ottenere l'email
    $get_email_query = "SELECT email FROM Utente WHERE nome='$user'";
    $email_arr = mysqli_query($connect, $get_email_query);

    while($row = mysqli_fetch_array($email_arr)){
        $email = mysqli_real_escape_string($connect, $row["email"]);
    }

    //inserisco nuovo album
    $insert_album_query = "INSERT INTO Album(nome, descrizione, email) VALUES ('$nome_album', '$descrizione', '$email')";
    $insert_album = mysqli_query($connect, $insert_album_query);


    if(!$insert_album){
        echo "error";
    }
    else{
        $album_id_str = "SELECT id FROM Album WHERE nome='$nome_album' AND descrizione='$descrizione' AND email='$email'";
        $album_id_query = mysqli_query($connect, $album_id_str);

        while($row = mysqli_fetch_array($album_id_query)){
            $album_id = $row["id"];
        }

        $_SESSION['currentAlbum'] = $album_id;
        echo "success";
    }

    //chiudo la connessione
    mysqli_close($connect);
