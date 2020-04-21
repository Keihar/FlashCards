$(document).ready(function() {
    $.ajax({
        type: "POST",
        url: "PHP/json.php",
        data: "",
        success: function (data) {
            console.log(data);
            try {
                let user = JSON.parse(data);
                let row = document.getElementById("row");
                user.albums.forEach(album => {
                    row.innerHTML += "" +
                    "<div class='col-sm-6 mb-4'>" +
                        "<div class='card'>" +
                        "<div class='card-body'>" +
                            `<h5 class='card-title'>${album.nome}</h5>` +
                            `<p class='card-text'>${album.descrizione}</p>` +
                            `<a href='#' onclick='viewAlbum(${album.id})' class='btn btn-primary'>Avvia Lezione</a>` +
                            `<a href='#' onclick='viewAlbum(${album.id})' class='btn btn-outline-secondary ml-1'>Modifica</a>` +
                            `<a href='#' onclick='deleteAlbumConfirm(${album.id})' class='btn btn-outline-danger ml-1' data-toggle="modal" data-target="#exampleModal">Elimina</a>` +                        
                        "</div>" +
                        "</div>" +
                    "</div>";
                });
            } 
            catch (error) {
                window.location.href = "login.html";
            }
            
        }
    });
});

var selectedAlbum = "";

function deleteAlbumConfirm(id) {
    selectedAlbum = id;
}

function deleteAlbum() {
    $.ajax({
        type: "POST",
        url: "PHP/deleteAlbum.php",
        data: { 'id': selectedAlbum },
        success: function (data) {
          if (data != "success") {
            console.log("Errore nell'eliminazione")
          } 
          else {
            window.location.reload();
          }
        }
      });
}

