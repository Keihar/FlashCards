<?php
  
    //effettuo l'include per connettermi al DataBase
    include 'DBconnect.php';

    //Ottengo i 3 campi da inserire successivamente nel DB
    $email = mysqli_real_escape_string($connect, $_POST["email"]);
    $imgProfilo = "";
    $nome = mysqli_real_escape_string($connect, $_POST["username"]);
    $motto = mysqli_real_escape_string($connect, $_POST["motto"]);
    $psw = mysqli_real_escape_string($connect, $_POST["password"]);

    //cripto la password
    $psw_criptata = mysqli_real_escape_string($connect, md5($psw));    

    $user_query_str = "SELECT nome FROM Utente WHERE nome='$nome'";
    $user_query = mysqli_query($connect, $user_query_str);

    //controllo se il nome utente esiste già
    if(mysqli_num_rows($user_query) != 0){
        exit("username_taken");
    }
    else{
        //query per inserire nella tabella Utente i campi
        $inserisci_utente_str = "INSERT INTO Utente VALUES ('$email', '$imgProfilo', '$nome', '$motto', '$psw_criptata');";
        $inserisci_utente = mysqli_query($connect, $inserisci_utente_str);

        if(!$inserisci_utente){
        echo "error";
        }
        else{
        echo "success";
        }
    }
    

?>