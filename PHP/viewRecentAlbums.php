<?php

    
    include 'DBconnect.php';

    session_start();

    $viewRecents_query = "SELECT * FROM album INNER JOIN Utente ON(Utente.email = album.email) GROUP BY data HAVING privato=0 ORDER BY data DESC LIMIT 10";
    $viewRecents = mysqli_query($connect, $viewRecents_query);

    $json_album = array();

    while ($row = mysqli_fetch_assoc($viewRecents)) {
        $json_album[] = $row;
    }


    //istanzio l'array per creare la matrice
    $albums = array();

    $flashcards = array();

    //ciclo che assegna per ogni array i campi
    foreach ($json_album as &$rows) {
        //prendo le flashcards e le piazzo nell'array
        unset($flashcards); // $foo is gone
        $flashcards = array(); // $foo is here again
        unset($json_flashcards); // $foo is gone
        $json_flashcards = array();
        $preleva_flashcard_str = "SELECT * FROM Flashcard WHERE id_album = ".$rows["id"]." LIMIT 10";
        $preleva_flashcard = mysqli_query($connect, $preleva_flashcard_str);
        while($riga = mysqli_fetch_assoc($preleva_flashcard)){
            $json_flashcards[] = $riga;
        }
        foreach($json_flashcards as &$righe){
            array_push($flashcards, array(
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
            'nomeutente' => $rows['nome'],
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


    //codifica in json
    $output = json_encode($post_data);

    echo $output;


?>