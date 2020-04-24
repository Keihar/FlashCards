<?php

        //includo codice per la connessione al DataBase
        include 'DBconnect.php';

        //inizializzo la sessione
        session_start();

        $user = mysqli_real_escape_string($connect, $_SESSION['utente']);

        while($row = mysqli_fetch_array($email_array)){
            $email_vecchia = $row["email"];
        }

        $email = mysqli_real_escape_string($connect, $_POST["email"]);
        $nome = mysqli_real_escape_string($connect, $_POST["nome"]);
        $motto = mysqli_real_escape_string($connect, $_POST["motto"]);
        $password = mysqli_real_escape_string($connect, $_POST["password"]);

        //Grazie a ON UPDATE CASCADE è possibile effettuare le modifiche in cascata anche per le altre tabelle
        $modify_user_str = "UPDATE Utente SET email = '$email', nome='$nome', motto='$motto', password='$password' WHERE nome='$user'";
        $modify_user = mysqli_query($connect, $modify_user_str);


?>