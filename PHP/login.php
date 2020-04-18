<?php

    //effettuo l'include per connettermi al DataBase
    include 'DBconnect.php';

    //inizializzo la sessione
    session_start();

    //prelevo campi dal form
    $email = $_POST['email'];
    $psw = $_POST['password'];
    
    //cripto la password inserita per confrontarla successivamente con quella presente nel DataBase
    $psw_criptata = sha1($psw);

    //confronto i dati inseriti con quelli all'interno del DataBase
    $preleva_utente_str = "SELECT * FROM Utente WHERE email='$email' AND password='$psw_criptata'";
    $preleva_utente = mysqli_query($connect, $preleva_utente_str);
    $count = mysqli_num_rows($preleva_utente);

    //se non esiste alcun utente con le credenziali inserite
    if($count != 1){
        echo "error";
    }
    else {
        $found = 1;
    }

    if($found === 1){
        echo "success";

        session_start();
        $_SESSION['user'] = $user;


    }

    mysqli_close($connect);

    //PER LOGOUT (NOTA A SCOPO DI RICORDARSI): session_destroy(); header("location: index.html");

?>