<?php
//Restituisco gli ultimi 6 album creati dagli utenti che seguo (utente di sess)
//Restituisco gli stessi dati degli album come searchquery.php e limito a 6

//includo codice per la connessione al DataBase
include 'DBconnect.php';

//inizializzo la sessione
session_start();

//prelevo l'utente di sessione
$user = $_SESSION["utente"];

//prelevo gli album degli utenti seguiti dall'utente di sessione limitandoli a 6
$album_seguiti_query = "SELECT album.id AS id, album.nome AS nome, album.descrizione AS descrizione, album.data AS data, album.imgLink AS imgLink, u.nome AS nome_seguito, u.imgProfilo AS profilo_seguito FROM Utente INNER JOIN follow f ON (f.seguente=Utente.email) INNER JOIN Utente u ON (u.email=f.seguito) INNER JOIN Album ON (album.email = u.email) WHERE Utente.nome='$user' AND privato=0 ORDER BY data DESC LIMIT 6";
$album_seguiti  = mysqli_query($connect, $album_seguiti_query);


$json_album_array = array();

while ($row = mysqli_fetch_assoc($album_seguiti)) {
    $json_album_array[] = $row;
}

//istanzio l'array per creare la matrice
$albums = array();

//ciclo che assegna per ogni array i campi
foreach ($json_album_array as &$rows) {
    unset($flashcards);
    $flashcards = array();
    unset($json_flashcard_array);
    $json_flashcard_array = array();

    $id_album = $rows['id'];

    $preleva_flashcard_query = "SELECT * FROM Flashcard WHERE id_album = " . $id_album . "";
    $preleva_flashcard = mysqli_query($connect, $preleva_flashcard_query);


    while ($riga = mysqli_fetch_assoc($preleva_flashcard)) {
        $json_flashcard_array[] = $riga;
    }

    //ciclo che assegna per ogni array i campi
    foreach ($json_flashcard_array as &$righe) {
        array_push($flashcards, array(
            'id_album' => $righe['id_album'],
            'id_flashcard' => $righe['id'],
            'fronte' => $righe['fronte'],
            'retro' => $righe['retro']
        ));
    }

    $autore = array(
        'username' => $rows['nome_seguito'],
        'imgProfilo' => $rows['profilo_seguito'],
    );
    
    //inserimento nell'array finale dei campi
    array_push($albums, array(
        'id' => $rows['id'],
        'nome' => $rows['nome'],
        'descrizione' => $rows['descrizione'],
        'data' => $rows['data'],
        'imgLink' => $rows['imgLink'],
        'autore' => $autore,
        'flashcards' => $flashcards
    ));
}

//array di array
$post_data = array(
    'albums' => $albums
);

//codifica in json
$output = json_encode($post_data);

echo $output;

//chiudo la connessione
mysqli_close($connect);
