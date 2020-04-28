
$(document).ready(function() {
    $.ajax({
        type: "POST",
        url: "PHP/dashboardJSON.php",
        data: "",
        success: function (data) {
            let user;
            try {
                user = JSON.parse(data);
                console.log("User logged found.");
              } 
              catch (error) {
                //window.location.href = "login.html";
              }
              user.albums.forEach(album => {
                if (album.imgLink == null) {
                  album.imgLink = "images\\albumCovers\\000-icon.svg";
                }
                $("#row").html("" + getCard(album.id, album.nome, album.descrizione,
                  album.imgLink, album.username));
              });
        }
    });
});
