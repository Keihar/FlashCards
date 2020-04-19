<?php

    session_start();

    include 'DBconnect.php';

    $user = $_SESSION['utente'];

    $sql = "SELECT id, Album.nome, descrizione FROM Album INNER JOIN Utente ON (utente.email = Album.email) WHERE Utente.nome = '$user'";
    $result = mysqli_query($connect, $sql);

    if(!$result){
        die('Invalid query: ');
    }

    $json_array = array();

    while($row = mysqli_fetch_assoc($result))
    {
        $json_array[] = $row;
    }

    $albums = array();

    foreach($json_array as &$rows){
        array_push($albums, array(
            'id' => $rows['id'],
            'nome' => $rows['nome'],
            'descrizione' => $rows['descrizione']
        ));
    }

    $post_data = array(
        'nome' => $_SESSION['utente'],
        'albums' => $albums
    );

    $output = json_encode($post_data);

    echo $output;
