$(document).ready(function() {
    $.ajax({
        type: "POST",
        url: "PHP/dashboardJSON.php",
        data: "",
        success: function (data) {
            try { duser = JSON.parse(data) } 
            catch (error) { console.error("Error while getting the dashboard") }

            $("#row").html("");

            duser.albums.forEach(album => {
              if (album.imgLink == null) {
                album.imgLink = "images\\albumCovers\\000-icon.svg";
              }
              $("#row").html($("#row").html() + getCard(album.id, album.nome, album.descrizione,
                album.imgLink, album.username));
            });

            $(".card").addClass("mx-auto");
            // Set the onclick
            var eles = document.getElementsByClassName('prevBtn');
            for (var i=0; i < eles.length; i++){
              eles[i].removeAttribute("onclick");
              eles[i].setAttribute("onclick", `albumPreview(${eles[i].id.replace('prevBtn','')}, duser.albums)`);
            }

            markBtns(user.salvati);
            $("#loadingDashboardCards").hide();
        }
    });
    
});
