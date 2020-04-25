<?php

    include 'DBconnect.php';

    session_start();

    $stringa = mysqli_real_escape_string($connect, $_POST["query"]);
    $user = $_SESSION["utente"];

    $search_for_string_query = "SELECT id, Album.nome AS nome, descrizione, imgLink, privato, Album.email AS email, Utente.nome AS username FROM Album INNER JOIN Utente ON (Album.email = Utente.email) WHERE Album.nome LIKE '%$stringa%' AND privato=0 AND Album.email = Utente.email AND Utente.nome != '$user' LIMIT 10 ";
    $search_for_string = mysqli_query($connect, $search_for_string_query);

    //istanzio array che mi servirà per splittare le righe
    $json_array = array();
    
    $json_array2 = array();

    //splitto le righe che ottengo dalla query
    while ($row = mysqli_fetch_assoc($search_for_string)) {
        $json_array[] = $row;
    }

    //istanzio l'array per creare la matrice
    $albums = array();

    $flashcards = array();

    //ciclo che assegna per ogni array i campi
    foreach ($json_array as &$rows) {
        //prendo le flashcards e le piazzo nell'array
        unset($flashcards); // $foo is gone
        $flashcards = array(); // $foo is here again
        unset($json_array2); // $foo is gone
        $json_array2 = array();
        $preleva_flashcard_str = "SELECT * FROM Flashcard WHERE id_album = ".$rows["id"]."";
        $preleva_flashcard = mysqli_query($connect, $preleva_flashcard_str);
        while($riga = mysqli_fetch_assoc($preleva_flashcard)){
            $json_array2[] = $riga;
        }
        foreach($json_array2 as &$righe){
            array_push($flashcards, array(
                'id_album' => $righe['id_album'], 
                'id_flashcard' => $righe['id'],
                'fronte' => $righe['fronte'],
                'retro' => $righe['retro']
            ));
        }
        array_push($albums, array(
            'id' => $rows['id'],
            'nome' => $rows['nome'],
            'descrizione' => $rows['descrizione'],
            'imgLink' => $rows['imgLink'],
            'privato' => $rows['privato'],
            'email' => $rows['email'],
            'nomeutente' => $rows['username'],
            'flashcards' => $flashcards
        ));
        
    }    



    //array di array
    $post_data = array(
        'albums' => $albums,
        'flashcards' => $flashcards
    );    


    //codifica in json
    $output = json_encode($post_data);

    echo $output;
