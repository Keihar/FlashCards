<?php

    session_start();

    $id = $_GET['id'];

    $_SESSION['currentAlbum'] = $id;

    echo "success";

?>