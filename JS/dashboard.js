
$(document).ready(function() {
    $.ajax({
        type: "POST",
        url: "PHP/dashboardJSON.php",
        data: "",
        success: function (data) {
            let duser;
            try {
                duser = JSON.parse(data);
                console.table(duser);
                $("#row").html("");
              } 
              catch (error) {
                //window.location.href = "login.html";
              }
              duser.albums.forEach(album => {
                if (album.imgLink == null) {
                  album.imgLink = "images\\albumCovers\\000-icon.svg";
                }
                $("#row").html($("#row").html() + getCard(album.id, album.nome, album.descrizione,
                  album.imgLink, album.username));
              });

              markBtns(user.salvati);
              $("#loadingDashboardCards").hide();
              $("#loadingDashboardNews").hide();
        }
    });
    
});
