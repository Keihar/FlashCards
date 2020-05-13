<?php

    //setto la zona di prelevamento data
    date_default_timezone_set('Europe/Rome');

//includo codice per la connessione al DataBase
include 'DBconnect.php';

//inizializzo la sessione
session_start();

$data = date('Y-m-d H:i:s');

if($_SESSION['valid']){
 
    $id_album = mysqli_real_escape_string($connect, $_SESSION['currentAlbum']);
    
    /*$update_data_query = "UPDATE album_salvati SET data = '$data' WHERE idAlbum='$id_album'";
    $update_data = mysqli_query($connect, $update_data_query);*/

    $user = $_SESSION["utente"];

    $check_author_query = "SELECT Utente.nome AS nome FROM album INNER JOIN Utente ON (Utente.email = Album.email) WHERE album.id=".$id_album."";
    $check_author = mysqli_query($connect, $check_author_query);

    while ($riga = mysqli_fetch_array($check_author)) {
        $autore = mysqli_real_escape_string($connect, $riga["nome"]);
    }

    if($user == $autore){
        $update_data_query = "UPDATE album SET data = '$data' WHERE id='$id_album'";
        $update_data = mysqli_query($connect, $update_data_query);
    }
    else{
        $update_data_query = "UPDATE album_salvati SET data = '$data' WHERE idAlbum='$id_album'";
        $update_data = mysqli_query($connect, $update_data_query);
    }

}
else{
    exit("error");
}



//query per avere nome e descrizione dell'Album
$preleva_nome_descr = "SELECT nome, descrizione, imgLink, privato FROM Album WHERE id=" . $id_album . "";
$result1 = mysqli_query($connect, $preleva_nome_descr);


while ($riga = mysqli_fetch_array($result1)) {
    $nome = mysqli_real_escape_string($connect, $riga["nome"]);
    $descrizione = mysqli_real_escape_string($connect, $riga["descrizione"]);
    $imgLink = mysqli_real_escape_string($connect, $riga["imgLink"]);
    $privato = mysqli_real_escape_string($connect, $riga["privato"]);
}

//le due query devo splittarle in quanto se facessi tutto in una query univoca nel caso in cui l'utente non avesse flashcards non sarei in grado di passare alla prossima pagina il nome e la descrizione dell'album

//query per avere id, fronte, retro delle flashcards
$preleva_albumflash = "SELECT Flashcard.id AS id, fronte, retro FROM Album INNER JOIN Flashcard ON (Flashcard.id_album = Album.id) WHERE Album.id = " . $id_album . "";
$result = mysqli_query($connect, $preleva_albumflash);

//istanzio array che mi servirà per splittare le righe
$json_array = array();

//splitto le righe che ottengo dalla query
while ($row = mysqli_fetch_assoc($result)) {
    $json_array[] = $row;
}

//istanzio l'array per creare la matrice
$flashcards = array();

//ciclo che assegna per ogni array i campi
foreach ($json_array as &$rows) {
    array_push($flashcards, array(
        'id' => $rows['id'],
        'fronte' => $rows['fronte'],
        'retro' => $rows['retro']
    ));
}

//array di array
$post_data = array(
    'id' => $id_album,
    'nome' => $nome,
    'descrizione' => $descrizione,
    'data' => $data,
    'imgLink' => $imgLink,
    'privato' => $privato,
    'flashcards' => $flashcards
);

//codifica in json
$output = json_encode($post_data);

echo $output;
