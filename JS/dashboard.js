$(document).ready(function() {
    console.log( "ready!" );
    $.ajax({
        type: "POST",
        url: "PHP/json.php",
        data: "",
        success: function (data) {
            console.log(data);
            try {
                let user = JSON.parse(data); 
                // Set Username
                document.getElementById("userCardName").innerHTML = "" + user.nome;
            } catch{}
        }
    });
});

