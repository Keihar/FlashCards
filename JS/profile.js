const username = (getUrlVars()["user"]);
var user;

$(document).ready(function () {
    $.ajax({
        type: "POST",
        url: "PHP/json.php",
        data: { 'username': username },
        success: function (data) {
                user = JSON.parse(data);
                console.table(user);

                // Set Username
                document.getElementById("userCardName").innerHTML = "" + user.nome;
                document.getElementById("motto").innerHTML = `"${user.motto}"`;
                document.getElementById("nalbum").innerHTML = "" + user.albums[0].nalbum;
                document.getElementById("nflashcard").innerHTML = "" + user.albums[0].nflashcard;

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
    return `<div class="card mb-3 mx-auto singleCard"> <div class="row no-gutters"> <div class="col-md-4">` +
      `<img src="${imgLink}" id="cardImg"> </div> <div class="col-md-8"> <div class="card-body"> <h5 class="card-title">${name}</h5> ` +
      `<p class="card-text">${description}</p><p class="card-text">` +
      `<button onclick='saveAlbum(${id})' class='btn btn-primary'> <i class="fa fa-plus"></i> Aggiungi ai tuoi Albums</button>` +
      `<button data-toggle="modal" data-target="#exampleModal" onclick='albumPreview(${id})' class='btn btn-secondary ml-1'><i class="fa fa-pencil"></i> Anteprima</button>` +
      `</p> <p class="card-text text-secondary">Creato da ${author}</p> </div> </div> </div> </div>`;
  }