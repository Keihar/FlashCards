<?php

    //effettuo l'include per connettermi al DataBase
    include 'DBconnect.php';


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
    //se esiste un utente con le credenziali inserite
    else{
        $row = mysqli_fetch_array($preleva_utente);
        $username = $row['nome'];
        session_start();
        $_SESSION['utente'] = $username;
        mysqli_close($connect);

        echo "success";
    }

    //PER LOGOUT (NOTA A SCOPO DI RICORDARSI): session_destroy(); header("location: index.html");

?>