<?php

    $myfile = $_POST["file"];

    $ext = $_POST["ext"];

    $ext = "csv";

    if($ext == "csv"){

        //$csv= file_get_contents($myfile);
        $array = array_map("str_getcsv", explode("\n", $myfile));
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

            echo ($json);
        }

} else if ($ext == "json") {

    //$data = file_get_contents($myfile);
    $data = json_decode($myfile, TRUE);

    $col_count = 0;

    foreach ($data as $row) {
        $col_count = max($col_count, sizeof($row));
    }
    if ($col_count != 2) {
        exit("nColumnsError");
    } else {
        $data = json_encode($data);
        //print_r($data);
        echo $data;
    }
} else {
    exit("extensionError");
}
