const username = (getUrlVars()["user"]);
$(document).ready(function () {
    $.ajax({
        type: "POST",
        url: "PHP/json.php",
        data: { 'username': username },
        success: function (data) {
                user = JSON.parse(data);
                console.table(user);

                let row = document.getElementById("userCards");
                user.albums.forEach(album => {
                    if (album.imgLink == null) {
                        album.imgLink = "images\\albumCovers\\000-icon.svg";
                    }
                    row.innerHTML += "" + getPCard(album.id, album.nome, album.descrizione,
                        album.imgLink, username, user.albums);
                });
            // }
            // catch {
            //     alert("Errore nell'ottenimento del profilo")
            // }
        }
    })
});

function getPCard(id, name, description, imgLink, author) {

    //  Truncate strings that exceeds the max length
    var descMaxLength = 32;
    if (description.length > descMaxLength) {
      description = description.substring(0, descMaxLength) + "...";
    }
  
    //  Returns the formatted HTML
    return `<div class="card mb-3 ml-3 singleCard"> <div class="row no-gutters"> <div class="col-md-4">` +
      `<img src="${imgLink}" id="cardImg"> </div> <div class="col-md-8"> <div class="card-body"> <h5 class="card-title">${name}</h5> ` +
      `<p class="card-text">${description}</p><p class="card-text">` +
      `<a href='#' onclick='playAlbum(${id})' class='btn btn-primary'> <i class="fa fa-plus"></i> Aggiungi ai tuoi Albums</a>` +
      `<button data-toggle="modal" data-target="#exampleModal" onclick='albumPreview(${id})' class='btn btn-secondary ml-1'><i class="fa fa-pencil"></i> Anteprima</button>` +
      `</p> <p class="card-text"><a href="#" class="text-secondary" onclick="setCurrentUser(${author})">Creato da ${author}</a></p> </div> </div> </div> </div>`;
  }
