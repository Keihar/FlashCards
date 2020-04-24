function search() {
    var query = document.getElementById("searchBar").value;
    if (query == "") {
        return;
    }
    let row = document.getElementById("row");
    row.innerHTML = "Caricamento...";
    row.innerHTML = "";
    $.ajax({
        type: "POST",
        url: "PHP/searchQuery.php",
        data: { 'query': query },
        success: function (data) {
            try {
                console.log(data);
                let user = JSON.parse(data);
                if (user.albums.length == 0) {
                  row.innerHTML = "<div class='mb-3 col'> Nessun risultato.</div>"
                }
                user.albums.forEach(album => {
                  if (album.imgLink == null) {
                    album.imgLink = "images\\albumCovers\\000-icon.svg";
                  }
                  row.innerHTML += "" + getCard(album.id, album.nome, album.descrizione,
                    album.imgLink, album.nomeutente);
                });
            } 
            catch (error) {
                console.log("Query search failed");
            }
        }
      });
}

function getCard(id, name, description, imgLink, author) {

    var descMaxLength = 32;
    if (description.length > descMaxLength) {
      description = description.substring(0, descMaxLength) + "...";
    }
    
    let str = `<div class="card mb-3 ml-3" style="width: 45%"> <div class="row no-gutters"> <div class="col-md-4">`+
    `<img src="${imgLink}"> </div> <div class="col-md-8"> <div class="card-body"> <h5 class="card-title">${name}</h5> `+
    `<p class="card-text">${description}</p><p class="card-text">`+
    `<a href='#' onclick='playAlbum(${id})' class='btn btn-primary'> <i class="fa fa-arrow-right"></i> Avvia</a>` +
    `<a href='#' onclick='viewAlbum(${id})' class='btn btn-outline-secondary ml-1'><i class="fa fa-pencil"></i> Modifica</a>` +
    `<a href='#' onclick='deleteAlbumConfirm(${id})' class='btn btn-outline-danger ml-1' data-toggle="modal" data-target="#exampleModal"><i class="fa fa-times"></i> Elimina</a>`+
    `</p> <p class="card-text text-secondary">Creato da ${author}</p> </div> </div> </div> </div>`;
    return str;
  }

$(function() {
  $("#searchBar").keypress(function (e) {
      if ((e.which && e.which == 13) || (e.keyCode && e.keyCode == 13)) {
          $('button[type=search]').click();
          return false;
      } else {
          return true;
      }
  });
});