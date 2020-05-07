<?php

    date_default_timezone_set('Europe/London');

    //includo codice per la connessione al DataBase
    include 'DBconnect.php';

    //inizializzo la sessione
    session_start();

    $id = mysqli_real_escape_string($connect, $_POST['id']);

    $delete_idea_query = "DELETE FROM idea WHERE id='$id'";
    $delete_idea = mysqli_query($connect, $delete_idea_query);

    mysqli_close($connect);

?>