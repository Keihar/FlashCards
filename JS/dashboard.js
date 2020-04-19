$(document).ready(function() {
    console.log( "ready!" );
    $.ajax({
        type: "POST",
        url: "PHP/json.php",
        data: "",
        success: function (data) {
            let user = JSON.parse(data); 
            // Set Username
            document.getElementById("welcomeText").innerHTML = "Bentornato, " + user.nome;
            document.getElementById("userCardName").innerHTML = "" + user.nome;
        }
    });
});