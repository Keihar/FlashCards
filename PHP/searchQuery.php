<?php

    include 'DBconnect.php';

    session_start();

    $stringa = mysqli_real_escape_string($connect, $_POST["query"]);

    $search_for_string_query = "SELECT id, Album.nome AS nome, descrizione, imgLink, privato, Album.email AS email, Utente.nome AS username FROM Album INNER JOIN Utente ON (Album.email = Utente.email) WHERE Album.nome LIKE '%$stringa%' AND privato=0 AND Album.email = Utente.email";
    $search_for_string = mysqli_query($connect, $search_for_string_query);

    //istanzio array che mi servirà per splittare le righe
    $json_array = array();

    //splitto le righe che ottengo dalla query
    while ($row = mysqli_fetch_assoc($search_for_string)) {
        $json_array[] = $row;
    }

    //istanzio l'array per creare la matrice
    $albums = array();

    //ciclo che assegna per ogni array i campi
    foreach ($json_array as &$rows) {
        array_push($albums, array(
            'id' => $rows['id'],
            'nome' => $rows['nome'],
            'descrizione' => $rows['descrizione'],
            'imgLink' => $rows['imgLink'],
            'privato' => $rows['privato'],
            'email' => $rows['email'],
            'nomeutente' => $rows['username']
        ));
    }    


    //array di array
    $post_data = array(
        'albums' => $albums
    );    


    //codifica in json
    $output = json_encode($post_data);

    echo $output;    

?>