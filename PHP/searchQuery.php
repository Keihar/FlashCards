<?php

    include 'DBconnect.php';

    session_start();


    $stringa = $_POST['query'];

    $search_for_string_query = "SELECT * FROM Album WHERE nome LIKE '%$stringa%' AND privato=0";
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
            'email' => $rows['email']
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