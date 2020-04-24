<?php

    //includo codice per la connessione al DataBase
    include 'DBconnect.php';

    //inizializzo la sessione
    session_start();

    $email = mysqli_real_escape_string($connect, $_POST["email"]);

    //siccome è stato fatto l'"ON DELETE CASCADE" è possibile effettuare la cancellazione dell'utente in questo modo
    $delete_utente_str = "DELETE FROM Utente WHERE email='$email'";
    $delete_utente = mysqli_query($connect, $delete_utente);

?>