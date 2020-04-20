<?php

    include 'DBconnect.php';

    session_start();

    $id_album = $_SESSION['currentAlbum'];

    $preleva_albumflash = "SELECT nome, descrizione, Flashcard.id AS id, fronte, retro FROM Album INNER JOIN Flashcard ON (Flashcard.id_album = Album.id) WHERE Album.id = ".$id_album."";
    $result = mysqli_query($connect, $preleva_albumflash);

    $json_array = array();

    while ($row = mysqli_fetch_assoc($result)) {
        $json_array[] = $row;
    }

    $flashcards = array();

    $nome = "";
    $descrizione = "";

    foreach ($json_array as &$rows) {
        $nome = $rows['nome'];
        $descrizione = $rows['descrizione'];
        array_push($flashcards, array(
            'id' => $rows['id'],
            'fronte' => $rows['fronte'],
            'retro' => $rows['retro']
        ));
    }
    
    //array di array
    $post_data = array(
        'nome' => $nome,
        'descrizione' => $descrizione,
        'flashcards' => $flashcards
    );

    $output = json_encode($post_data);

    echo $output;
