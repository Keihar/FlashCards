<?php

    //distruggo le variabili di sessione
    session_destroy();

    //reindirizzo l'utente alla pagina di login
    header("location: ..\login.html");

    echo "success";

?>