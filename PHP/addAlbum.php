<?php

    //effettuo l'include per connettermi al DataBase
    include 'DBconnect.php';
    
    session_start();

    $nome_album = $_POST['nome_album'];
    $descrizione = $_POST['descrizione'];
    
    //Prendo l'email
    $user = $_SESSION['utente'];
    
    //query per ottenere l'email
    $get_email_query = "SELECT email FROM Utente WHERE nome='$user'";
    $email_arr = mysqli_query($connect, $get_email_query);

    while($row = mysqli_fetch_array($email_arr)){
        $email = $row["email"];
    }

    //inserisco nuovo album
    $insert_album_query = "INSERT INTO Album(nome, descrizione, email) VALUES ('$nome_album', '$descrizione', '$email')";
    $insert_album = mysqli_query($connect, $insert_album_query);

    if(!$insert_album){
        echo "error";
    }
    else{
        echo "success";
    }

    //chiudo la connessione
    mysqli_close($connect);
