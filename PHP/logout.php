<?php

    //distruggo le variabili di sessione
    session_start();
    session_destroy();
    echo "success";

?>