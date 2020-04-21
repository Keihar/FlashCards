<?php
  
    //effettuo l'include per connettermi al DataBase
    include 'DBconnect.php';

    //Ottengo i 3 campi da inserire successivamente nel DB
    $email = mysqli_real_escape_string($connect, $_POST["email"]);
    $nome = mysqli_real_escape_string($connect, $_POST["username"]);
    $motto = mysqli_real_escape_string($connect, $_POST["motto"]);
    $psw = mysqli_real_escape_string($connect, $_POST["password"]);

    //cripto la password
    $psw_criptata = mysqli_real_escape_string($connect, sha1($psw));

    //query per inserire nella tabella Utente i campi
    $inserisci_utente_str = "INSERT INTO Utente VALUES ('$email', '$nome', '$motto', '$psw_criptata');";
    $inserisci_utente = mysqli_query($connect, $inserisci_utente_str);

    if(!$inserisci_utente){
        echo "error";
    }
    else{
        echo "success";
    }
?>