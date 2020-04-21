<?php

        //includo codice per la connessione al DataBase
        include 'DBconnect.php';

        //inizializzo la sessione
        session_start();
    
        //catcho la variabile di sessione
        $id_album = mysqli_real_escape_string($connect, $_POST['id']);

        //query per cancellare il suddetto album
        $delete_album_str = "DELETE FROM Album WHERE id=".$id_album."";
        $delete_album = mysqli_query($connect, $delete_album_str);

        //controllo se la query è andata a buon fine per utilizzare l'ajax
        if(!$delete_album){
            echo "error";
        }
        else{
            echo "success";
        }

?>