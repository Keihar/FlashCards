<?php

        //includo codice per la connessione al DataBase
        include 'DBconnect.php';

        //inizializzo la sessione
        session_start();

        $user = mysqli_real_escape_string($connect, $_SESSION['utente']);
        $password = mysqli_real_escape_string($connect, $_POST["password"]);

        $password_ = md5($password);

        $check_password_query = "SELECT * FROM Utente WHERE password = '$password_' AND nome = '$user'";
        $check_password = mysqli_query($connect, $check_password_query);
        
        while ($row = mysqli_fetch_assoc($check_password)) {
            $check[] = $row;
        }

        if(mysqli_num_rows($check_password) > 0){
            $imgProfilo = mysqli_real_escape_string($connect, $_POST["imgProfilo"]);
            $nome = mysqli_real_escape_string($connect, $_POST["nome"]);
            $motto = mysqli_real_escape_string($connect, $_POST["motto"]);
    
            $new_password = mysqli_real_escape_string($connect, $_POST["newPassword"]);
    
            if($new_password != ""){

                $new_password_ = md5($new_password);
    

                $modify_user_str = "UPDATE Utente SET imgProfilo='$imgProfilo', nome='$nome', motto='$motto', password='$new_password_' WHERE nome='$user'";
                $modify_user = mysqli_query($connect, $modify_user_str);
            }
            else{

                $modify_user_str = "UPDATE Utente SET imgProfilo='$imgProfilo', nome='$nome', motto='$motto', password='$password_' WHERE nome='$user'";
                $modify_user = mysqli_query($connect, $modify_user_str);
            }

        }
        else{
            exit("wrongPassword");
        }





?>