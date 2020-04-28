<?php

    include 'DBconnect.php';

    session_start();

    $stringa = mysqli_real_escape_string($connect, $_POST["query"]);
    $user = $_SESSION["utente"];
    $scope = mysqli_real_escape_string($connect, $_POST["scope"]);

    if($scope == "album"){

    $search_for_string_query = "SELECT id, Album.nome AS nome, descrizione, imgLink, privato, Album.email AS email, Utente.nome AS username FROM Album INNER JOIN Utente ON (Album.email = Utente.email) WHERE (Album.nome LIKE '%$stringa%') AND privato=0 AND Album.email = Utente.email AND Utente.nome != '$user' LIMIT 10";
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
        $preleva_flashcard_str = "SELECT * FROM Flashcard WHERE id_album = ".$rows["id"]." LIMIT 10";
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

    $tname = $_SESSION["utente"];
    $get_email_query = "SELECT email FROM Utente WHERE nome = '$tname'";
    $get_email = mysqli_query($connect, $get_email_query);
    $email = null;
    while ($row = mysqli_fetch_assoc($get_email)) {
        $email = $row;
    }

    //array di array
    $post_data = array(
        'richiedente' => $email["email"],
        'albums' => $albums
    );    

}
else if($scope == "user"){

    $search_for_string_query = "SELECT nome, imgProfilo, motto FROM Utente WHERE (nome LIKE '%$stringa%') AND Utente.nome != '$user' LIMIT 10";
    $search_for_string = mysqli_query($connect, $search_for_string_query);

    $json_utenti_array = array();

    while ($row = mysqli_fetch_assoc($search_for_string)) {
        $json_utenti_array[] = $row;
    }

    //istanzio l'array per creare la matrice
    $users = array();

    foreach ($json_utenti_array as &$rows) {
        array_push($users, array(
            'nome' => $rows['nome'],
            'imgProfilo' => $rows['imgProfilo'],
            'motto' => $rows['motto']
        ));        
    }   

    $post_data = array(
        'users' => $users
    );

}

    //codifica in json
    $output = json_encode($post_data);

    echo $output;