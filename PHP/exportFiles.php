<?php

//includo codice per la connessione al DataBase
include 'DBconnect.php';

//inizializzo la sessione
session_start();

    $id_album = mysqli_real_escape_string($connect, $_SESSION['currentAlbum']);
    $ext = mysqli_real_escape_string($connect, $_POST['ext']);

    $getFlashcards_query = "SELECT fronte, retro FROM flashcard WHERE id_album=".$id_album."";
    $getFlashcards = mysqli_query($connect, $getFlashcards_query);

    if($ext == "json"){

    $response = array();
    $flashcards = array();

    while($row=mysqli_fetch_array($getFlashcards)){
        
        $fronte=$row['fronte'];
        $retro=$row['retro'];

        array_push($flashcards, array(
            'fronte' => $fronte,
            'retro' => $retro
        ));

    }

    array_push($response, array(

        'flashcard' => $flashcards,

    ));


    $ourfile = "album".$id_album.".json";

    $fp = fopen($ourfile, 'w');
    fwrite($fp, json_encode($response, JSON_PRETTY_PRINT));
    fclose($fp);
}
else if($ext == "csv"){
    
    $response = array();
    $flashcards = array();

    while($row=mysqli_fetch_array($getFlashcards)){
        
        $fronte=$row['fronte'];
        $retro=$row['retro'];

        array_push($flashcards, array(
            'fronte' => $fronte,
            'retro' => $retro
        ));

    }

    array_push($response, array(

        'flashcard' => $flashcards,

    ));

    $fp = fopen('persons.csv', 'w');
    foreach($flashcards as $fields){
        fputcsv($fp, $fields);
    }

    fclose($fp);

}

?>