<?php

        //includo codice per la connessione al DataBase
        include 'DBconnect.php';

        //inizializzo la sessione
        session_start();

        $user = mysqli_real_escape_string($connect, $_SESSION['utente']);
        $password = mysqli_real_escape_string($connect, $_POST["password"]);

        $check_password_query = "SELECT password FROM Utente WHERE password = '$password' AND nome = '$user'";
        $check_password = mysqli_query($connect, $check_password_query);

        if (mysqli_num_rows($check_password)==0) {
            exit ("wrongPassword");
        }




        $imgProfilo = mysqli_real_escape_string($connect, $_POST["imgProfilo"]);
        $nome = mysqli_real_escape_string($connect, $_POST["nome"]);
        $motto = mysqli_real_escape_string($connect, $_POST["motto"]);

        $new_password = mysqli_real_escape_string($connect, $_POST["newPassword"]);


        //Grazie a ON UPDATE CASCADE è possibile effettuare le modifiche in cascata anche per le altre tabelle
        $modify_user_str = "UPDATE Utente SET imgProfilo='$imgProfilo', nome='$nome', motto='$motto', password='$new_password' WHERE nome='$user'";
        $modify_user = mysqli_query($connect, $modify_user_str);



?>