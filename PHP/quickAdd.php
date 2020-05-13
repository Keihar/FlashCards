<?php

    //aggiungere album se non è dell'utente di sessione
    //controllare se c'è una sessione
    //rimandare a una pagina (albumList.html)
    
    //setto la zona di prelevamento data
    date_default_timezone_set('Europe/Rome');
    
    //effettuo l'include per connettermi al DataBase
    include 'DBconnect.php';
    
    //inizializzo la sessione
    session_start();

    $user = $_SESSION["utente"];
    $id_album = mysqli_real_escape_string($connect, $_GET['albumID']);

    $getEmail_query = "SELECT email FROM Utente WHERE nome='$user'";
    $getEmail = mysqli_query($connect, $getEmail_query);

    if($getEmail){
        
        while ($riga = mysqli_fetch_array($getEmail)) {
            $email = mysqli_real_escape_string($connect, $riga["email"]);
        }

        $data = date('Y-m-d H:i:s');

        $add_saved_query = "INSERT INTO album_salvati (emailUtente, idAlbum, data) VALUES ('$email', ".$id_album.", '$data')";
        $add_saved = mysqli_query($connect, $add_saved_query);

        header("Location: ../albumList.html");

    }


?>