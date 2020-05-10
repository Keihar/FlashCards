<?php

//mi passa nome utente e devo ritornare un json contenente tre array: 
//1. Amici (mutuals)
//2. Seguaci
//3. Seguiti
//Passo una variabile Namici, Nseguaci, Nseguiti
//Di ogni amico e seguace e seguito devo passare username e il link dell'immagine di profilo

//includo codice per la connessione al DataBase
include 'DBconnect.php';

//inizializzo la sessione
session_start();

$username = mysqli_escape_string($connect, $_POST["username"]);

//prendo email utente
$get_email_str = "SELECT email FROM utente WHERE Utente.nome = '$username'";
$get_email = mysqli_query($connect, $get_email_str);
$email = null;

while ($row = mysqli_fetch_array($get_email)) {
    $email = mysqli_real_escape_string($connect, $row["email"]);
}

//prendo amici
$checkFollowing_query = "SELECT u.nome AS nome_seguito, u.motto as motto, u.imgProfilo AS profilo_seguito FROM Utente INNER JOIN follow f ON (f.seguente=Utente.email) INNER JOIN Utente u ON (u.email=f.seguito) WHERE Utente.email='$email'";
$checkFollowing = mysqli_query($connect, $checkFollowing_query);

$conta_seguiti_query = "SELECT COUNT(*) AS nSeguiti FROM Utente INNER JOIN follow f ON (f.seguente=Utente.email) INNER JOIN Utente u ON (u.email=f.seguito) WHERE Utente.email='$email'";
$conta_seguiti = mysqli_query($connect, $conta_seguiti_query);

while ($row = mysqli_fetch_array($conta_seguiti)) {
    $nSeguiti = mysqli_real_escape_string($connect, $row["nSeguiti"]);
}

//istanzio array che mi servirà per splittare le righe
$json_array_seguiti = array();

//splitto le righe che ottengo dalla query
while ($row = mysqli_fetch_assoc($checkFollowing)) {
    $json_array_seguiti[] = $row;
}

//istanzio l'array per creare la matrice
$seguiti = array();

//ciclo che assegna per ogni array i campi
foreach ($json_array_seguiti as &$rows) {
    array_push($seguiti, array(
        'nome' => $rows["nome_seguito"],
        'imgProfilo' => $rows["profilo_seguito"],
        'motto_seguito' => $rows["motto"]
    ));
}

$checkFollowers_query = "SELECT u.nome AS nome_seguente, u.motto as motto, u.imgProfilo AS profilo_seguente FROM Utente INNER JOIN follow f ON (f.seguito=Utente.email) INNER JOIN Utente u ON (u.email=f.seguente) WHERE Utente.email='$email'";
$checkFollowers = mysqli_query($connect, $checkFollowers_query);

$conta_seguaci_query = "SELECT COUNT(*) AS nSeguaci FROM Utente INNER JOIN follow f ON (f.seguito=Utente.email) INNER JOIN Utente u ON (u.email=f.seguente) WHERE Utente.email='$email'";
$conta_seguaci = mysqli_query($connect, $conta_seguaci_query);

while ($row = mysqli_fetch_array($conta_seguaci)) {
    $nSeguaci = mysqli_real_escape_string($connect, $row["nSeguaci"]);
}

//istanzio array che mi servirà per splittare le righe
$json_array_seguaci = array();

//splitto le righe che ottengo dalla query
while ($row = mysqli_fetch_assoc($checkFollowers)) {
    $json_array_seguaci[] = $row;
}

//istanzio l'array per creare la matrice
$seguaci = array();

//ciclo che assegna per ogni array i campi
foreach ($json_array_seguaci as &$rows) {
    array_push($seguaci, array(
        'nome' => $rows["nome_seguente"],
        'imgProfilo' => $rows["profilo_seguente"],
        'motto_seguace' => $rows["motto"]
    ));
}

$checkFriends_query = "SELECT uf.nome AS nome_amico, uf.imgProfilo AS profilo_amico, uf.motto AS motto FROM Utente u INNER JOIN follow f ON (f.seguente=u.email) INNER JOIN follow ff ON (ff.seguito,ff.seguente) = (f.seguente,f.seguito) INNER JOIN Utente uf ON (uf.email = f.seguito) WHERE u.email = '$email'";
$checkFriends = mysqli_query($connect, $checkFriends_query);

$conta_amici_query = "SELECT COUNT(*) AS nAmici FROM Utente u INNER JOIN follow f ON (f.seguente=u.email) INNER JOIN follow ff ON (ff.seguito,ff.seguente) = (f.seguente,f.seguito) INNER JOIN Utente uf ON (uf.email = f.seguito) WHERE u.email = '$email'";
$conta_amici = mysqli_query($connect, $conta_amici_query);

while ($row = mysqli_fetch_array($conta_amici)) {
    $nAmici = mysqli_real_escape_string($connect, $row["nAmici"]);
}

//istanzio array che mi servirà per splittare le righe
$json_array_amici = array();

//splitto le righe che ottengo dalla query
while ($row = mysqli_fetch_assoc($checkFriends)) {
    $json_array_amici[] = $row;
}

//istanzio l'array per creare la matrice
$amici = array();

//ciclo che assegna per ogni array i campi
foreach ($json_array_amici as &$rows) {
    array_push($amici, array(
        'nome' => $rows["nome_amico"],
        'imgProfilo' => $rows["profilo_amico"],
        'motto_amico' => $rows["motto"]
    ));
}

//array di array
$post_data = array(
    'nome' => $username,
    'nSeguiti' => $nSeguiti,
    'nSeguaci' => $nSeguaci,
    'nAmici' => $nAmici,
    'seguiti' => $seguiti,
    'seguaci' => $seguaci,
    'amici' => $amici
);

//codifica in json
$output = json_encode($post_data);

echo $output;

//chiudo la connessione
mysqli_close($connect);
