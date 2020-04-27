<?php

date_default_timezone_set('Europe/London');

$data = date('Y-m-d H:i:s');

//faccio partire la sessione
session_start();

//includo codice per connessione al DataBase
include 'DBconnect.php';

$user = "";

if (isset($_POST["username"])) {

    $user = $_POST["username"];

    //query per prelevamento dei campi dell'album
    $sql = "SELECT id, Album.nome, descrizione, imgLink, utente.nome as username FROM Album INNER JOIN Utente ON (utente.email = Album.email) WHERE Utente.nome = '$user' AND privato=0";
    $result = mysqli_query($connect, $sql);

}    
else if ($_SESSION['valid']) {

    //attribuisco a $user la variabile di sessione che identifica l'utente
    $user = mysqli_real_escape_string($connect, $_SESSION['utente']);

    $preleva_email_str = "SELECT email FROM Utente WHERE Utente.nome='$user'";
    $preleva_email = mysqli_query($connect, $preleva_email_str);
    $usermail = null;
    while($row = mysqli_fetch_array($preleva_email)){
        $usermail = mysqli_real_escape_string($connect, $row["email"]);
    }

    $sql = "SELECT Album.id, Album.nome, album.descrizione, Album.data, album.imgLink, utente.nome as username FROM album INNER JOIN utente ON (album.email = utente.email) WHERE Utente.nome = '$user' UNION SELECT Album.id, Album.nome, descrizione, Album.data, imgLink, utente.nome as username FROM album_salvati INNER JOIN album ON (album.id = album_salvati.idAlbum) INNER JOIN utente ON (album.email = utente.email) WHERE emailUtente = '$usermail' ORDER BY data DESC";
    $result = mysqli_query($connect, $sql);
}
else{
    exit("error");
}

    $preleva_motto_str = "SELECT motto, imgProfilo FROM Utente WHERE Utente.nome='$user'";
    $preleva_motto = mysqli_query($connect, $preleva_motto_str);

    while($row = mysqli_fetch_array($preleva_motto)){
        $motto = mysqli_real_escape_string($connect, $row["motto"]);
        $imgProfilo = mysqli_real_escape_string($connect, $row["imgProfilo"]);
    }

    //query per conto degli album
    $conta_album_str = "SELECT COUNT(*) AS nalbum FROM Album INNER JOIN Utente ON (utente.email = Album.email) WHERE Utente.nome='$user'";
    $conta_album = mysqli_query($connect, $conta_album_str);

    while($row_conta_album = mysqli_fetch_array($conta_album)){
        $nalbum = mysqli_real_escape_string($connect, $row_conta_album["nalbum"]);
    }

    //query per conto delle flashcards
    $conta_flashcards_str = "SELECT COUNT(*) AS nflashcard FROM flashcard INNER JOIN Album ON (album.id = flashcard.id_album) INNER JOIN Utente ON (utente.email=album.email) WHERE Utente.nome='$user'";
    $conta_flashcards = mysqli_query($connect, $conta_flashcards_str);

    while($row_conta_flashcards = mysqli_fetch_array($conta_flashcards)){
        $nflashcard = mysqli_real_escape_string($connect, $row_conta_flashcards["nflashcard"]);
    }

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
            'nalbum' => $nalbum,
            'nflashcard' => $nflashcard,
            'id' => $rows['id'],
            'nome' => $rows['nome'],
            'descrizione' => $rows['descrizione'],
            'imgLink' => $rows['imgLink'],
            'username' => $rows['username']
        ));
    }

    //array di array
    $post_data = array(
        'nome' => $user,
        'motto' => $motto,
        'imgProfilo' => $imgProfilo,
        'albums' => $albums
    );

    //codifica in json
    $output = json_encode($post_data);

    echo $output;
