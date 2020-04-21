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
                console.log(user.albums[0].nalbum);
                document.getElementById("nalbum").innerHTML = "" + user.albums[0].nalbum;
                document.getElementById("nflashcard").innerHTML = "" + user.albums[0].nflashcard;
            } catch{}
        }
    });
});

