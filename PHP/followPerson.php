<?php
    //Passo username e l'utente di sessione lo segue

    //faccio partire la sessione
    session_start();

    //includo codice per connessione al DataBase
    include 'DBconnect.php';

    $user = $_SESSION["utente"];
    $follow = mysqli_real_escape_string($connect, $_POST["username"]);

    $seguente_query_str = "SELECT email FROM Utente WHERE nome='$user'";
    $seguente_query = mysqli_query($connect, $seguente_query_str);

    while($row = mysqli_fetch_array($seguente_query)){
        $email_seguente = mysqli_real_escape_string($connect, $row["email"]);
    }


    $seguito_query_str = "SELECT email FROM Utente WHERE nome='$follow'";
    $seguito_query = mysqli_query($connect, $seguito_query_str);

    while($row = mysqli_fetch_array($seguito_query)){
        $email_seguito = mysqli_real_escape_string($connect, $row["email"]);
    }

    $follow_query_str = "INSERT INTO follow (seguente, seguito) VALUES ('$email_seguente', '$email_seguito')";
    $follow_query = mysqli_query($connect, $follow_query_str);

    if(!$follow_query){
        echo "error";
    }
    else{
        echo "success";
    }







?>