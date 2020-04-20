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
                            `<a href='#' onclick='deleteAlbum(${album.id})' class='btn btn-outline-danger ml-1'>Elimina</a>` +                        
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

function deleteAlbum(id) {
    
}

