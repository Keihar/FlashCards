<?php

//faccio partire la sessione
session_start();

//includo codice per connessione al DataBase
include 'DBconnect.php';

$user = "";

if (isset($_POST["username"])) {

    $user = $_POST["username"];

}    
else if ($_SESSION['valid']) {

    //attribuisco a $user la variabile di sessione che identifica l'utente
    $user = mysqli_real_escape_string($connect, $_SESSION['utente']);


}
else{
    exit("error");
}

    //query per prelevamento dei campi dell'album
    
    /*$sql = "SELECT id, Album.nome, descrizione, imgLink FROM Album INNER JOIN Utente ON (utente.email = Album.email) WHERE Utente.nome = '$user'";
    $result = mysqli_query($connect, $sql);*/

    $sql = "SELECT Album.id AS id, Album.nome, descrizione, imgLink, Utente.nome AS username FROM Album INNER JOIN Utente ON (utente.email = Album.email) INNER JOIN album_salvati ON (album_salvati.idAlbum = Album.id) WHERE Utente.nome = '$user' OR  Album.email = emailUtente";
    $result = mysqli_query($connect, $sql);

    $creatore_query = "SELECT Utente.nome AS creatore FROM Album INNER JOIN Utente ON (Utente.email = Album.email) INNER JOIN album_salvati ON (album_salvati.idAlbum = Album.id) WHERE Album.email = emailUtente";

    $preleva_motto_str = "SELECT motto FROM Utente WHERE Utente.nome='$user'";
    $preleva_motto = mysqli_query($connect, $preleva_motto_str);

    while($row = mysqli_fetch_array($preleva_motto)){
        $motto = mysqli_real_escape_string($connect, $row["motto"]);
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
            //restituisco username creatore!
            'username' => $rows['username']
        ));
    }

    //array di array
    $post_data = array(
        'nome' => $user,
        'motto' => $motto,
        'albums' => $albums
    );

    //codifica in json
    $output = json_encode($post_data);

    echo $output;
