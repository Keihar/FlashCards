<?php

//faccio partire la sessione
session_start();

if (!$_SESSION['valid']) {
    echo "session_error";
} else {

    //includo codice per connessione al DataBase
    include 'DBconnect.php';

    //attribuisco a $user la variabile di sessione che identifica l'utente
    $user = $_SESSION['utente'];

    //query per prelevamento dei campi dell'album
    $sql = "SELECT id, Album.nome, descrizione FROM Album INNER JOIN Utente ON (utente.email = Album.email) WHERE Utente.nome = '$user'";
    $result = mysqli_query($connect, $sql);

    //istanzio array che mi servirà per splittare le righe
    $json_array = array();

    //splitto le righe che ottengo dalla query
    while ($row = mysqli_fetch_assoc($result)) {
        $json_array[] = $row;
    }

    //istanzio l'array per creare la matrice
    $albums = array();

    //ciclo che assegna per ogni array i campi
    foreach ($json_array as &$rows) {
        array_push($albums, array(
            'id' => $rows['id'],
            'nome' => $rows['nome'],
            'descrizione' => $rows['descrizione']
        ));
    }

    //array di array
    $post_data = array(
        'nome' => $_SESSION['utente'],
        'albums' => $albums
    );

    //codifica in json
    $output = json_encode($post_data);

    echo $output;
}
