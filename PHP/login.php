<?php

    //effettuo l'include per connettermi al DataBase
    include 'DBconnect.php';

    //prelevo campi dal form
    $email = mysqli_real_escape_string($connect, $_POST['email']);
    $psw = mysqli_real_escape_string($connect, $_POST['password']);
    
    //cripto la password inserita per confrontarla successivamente con quella presente nel DataBase
    $psw_criptata = mysqli_real_escape_string($connect, sha1($psw));

    //confronto i dati inseriti con quelli all'interno del DataBase
    $preleva_utente_str = "SELECT * FROM Utente WHERE email='$email' AND password='$psw_criptata'";
    $preleva_utente = mysqli_query($connect, $preleva_utente_str);
    $count = mysqli_num_rows($preleva_utente);


    $count = mysqli_num_rows($preleva_utente);

    //se non esiste alcun utente con le credenziali inserite
    if($count != 1){
        echo "error";
    }
    //se esiste un utente con le credenziali inserite
    else{
        $row = mysqli_fetch_array($preleva_utente);
        $username = $row['nome'];
        $motto = $row['motto'];
        session_start();
        $_SESSION['utente'] = $username;
        $_SESSION['motto'] = $motto;
        $_SESSION['valid'] = true;
        mysqli_close($connect);

        echo "success";
    }
    


?>