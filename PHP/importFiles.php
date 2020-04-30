<?php

    //faccio partire la sessione
    session_start();

    //includo codice per connessione al DataBase
    include 'DBconnect.php';

    $myfile = $_POST["file"];

    //(readfile("test.csv");

    //$myfile = "test.json";


    if ($fh = fopen($myfile, 'r')) {
        while (!feof($fh)) {
            $line = fgets($fh);
        }
        fclose($fh);
    }


    //$myfile = "test.json";

    $file_parts = pathinfo($myfile);

    if($file_parts['extension'] == "csv"){

        $csv= file_get_contents($myfile);
        $array = array_map("str_getcsv", explode("\n", $csv));
        $json = json_encode($array);
        $data_array = json_decode($json, TRUE);
        $col_count = 0;
        foreach($data_array as $row) {
            $col_count = max($col_count, sizeof($row));
        }
        if($col_count != 2){
            exit("nColumnsError");
        }
        else{
            //print_r($json); 
            echo $json;
        }

    }
        
    else if($file_parts['extension'] == "json"){

        $data = file_get_contents($myfile);
        $data = json_decode($data, true);


        $col_count = 0;

        foreach($data as $row) {
            $col_count = max($col_count, sizeof($row));
        }
        if($col_count != 2){
            exit("nColumnsError");
        }
        else{
            $data = json_encode($data);
            //print_r($data);
            echo $data;
        }



    }
    else{
        exit("extensionError");
    }


?>