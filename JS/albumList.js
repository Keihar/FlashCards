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
                  if (album.imgLink == null) {
                    album.imgLink = "images\\albumCovers\\000-icon.svg";
                  }
                  let HTMLString = getCard(album.id, album.nome, album.descrizione, album.imgLink);
                  row.innerHTML += "" + HTMLString;
                });
            } 
            catch (error) {
                window.location.href = "login.html";
            }
            
        }
    });
});

function getCard(id, name, description, imgLink) {

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
  `</p> <p class="card-text text-secondary">Creato da te</p> </div> </div> </div> </div>`;
  return str;
}
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

function playAlbum(id) {
    $.ajax({
      type: "GET",
      url: "PHP/setCurrentAlbum.php",
      data: { 'id': id },
      success: function (data) {
        if (data != "success") {
          console.log("Errore nell'impostare la variabile di sessione");
          return;
        } 
      }
    });
    $.ajax({
      type: "POST",
      url: "PHP/getCurrentAlbum.php",
      data: "",
      success: function (data) {
          try {
              let user = JSON.parse(data);
              let cards = user.flashcards;
              if (cards.length < 2) {
                alert("L'album deve contenere almeno due FlashCards!")
              }
              else {
                window.location.href = "playGarden.html";
              }
          } 
          catch (error) {}
      }
  });
  }
