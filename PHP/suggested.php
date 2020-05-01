<?php

    //includo codice per la connessione al DataBase
    include 'DBconnect.php';

    //inizializzo la sessione
    session_start();

    $user = mysqli_real_escape_string($connect, $_SESSION["utente"]);

    $getFollowing_query = "SELECT u.nome AS nome_seguito, u.imgProfilo AS profilo_seguito FROM Utente INNER JOIN follow f ON (f.seguente=Utente.email) INNER JOIN Utente u ON (u.email=f.seguito) WHERE Utente.nome = '$user'";
    $getFollowing = mysqli_query($connect, $getFollowing_query);

    $suggested = array();

    while($row = mysqli_fetch_array($getFollowing)){
        $nome_seguito = $row["nome_seguito"];
        $getFollowing2_query = "SELECT u.nome AS nome_seguito2, u.imgProfilo AS profilo_seguito2 FROM Utente INNER JOIN follow f ON (f.seguente=Utente.email) INNER JOIN Utente u ON (u.email=f.seguito) WHERE Utente.nome = '$nome_seguito' AND u.nome != '$user' AND u.nome NOT IN (SELECT u.nome AS nome_seguito FROM Utente INNER JOIN follow f ON (f.seguente=Utente.email) INNER JOIN Utente u ON (u.email=f.seguito) WHERE Utente.nome = '$user') LIMIT 3";
        $getFollowing2 = mysqli_query($connect, $getFollowing2_query);
        
        while($row2 = mysqli_fetch_array($getFollowing2)){
            $nome_seguito2 = $row2["nome_seguito2"];
            $profilo_seguito2 = $row2["profilo_seguito2"];
            array_push($suggested, array(
                'nome_seguito' => $nome_seguito,
                'nome_suggested' => $nome_seguito2,
                'imgProfilo_suggested' => $profilo_seguito2
            ));
        }
    }

    $post_data = array(
        'suggested' => $suggested,
    );
    
    //codifica in json
    $output = json_encode($post_data);
    
    echo $output;

