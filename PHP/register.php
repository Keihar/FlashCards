<?php
  
    //effettuo l'include per connettermi al DataBase
    include 'DBconnect.php';

    //Ottengo i 3 campi da inserire successivamente nel DB
    $email = $_POST["email"];
    $nome = $_POST["username"];
    $psw = $_POST["password"];

    //cripto la password
    $psw_criptata = sha1($psw);

    //query per inserire nella tabella Utente i campi
    $inserisci_utente_str = "INSERT INTO Utente VALUES ('$email', '$nome', '$psw_criptata');";
    $inserisci_utente = mysqli_query($connect, $inserisci_utente_str);

    if(!$inserisci_utente){
        echo "error";
    }
    else{
        echo "success";
    }
?>