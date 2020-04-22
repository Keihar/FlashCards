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
                        `<img class="card-img-top" src="${album.imgLink}" alt="Card image cap"></img>` +
                        "<div class='card'>" +
                        "<div class='card-body'>" +
                            `<h5 class='card-title'>${album.nome}</h5>` +
                            `<p class='card-text'>${album.descrizione}</p>` +
                            `<a href='#' onclick='playAlbum(${album.id})' class='btn btn-primary'> <i class="fa fa-arrow-right"></i> Avvia Lezione</a>` +
                            `<a href='#' onclick='viewAlbum(${album.id})' class='btn btn-outline-secondary ml-1'><i class="fa fa-pencil"></i> Modifica</a>` +
                            `<a href='#' onclick='deleteAlbumConfirm(${album.id})' class='btn btn-outline-danger ml-1' data-toggle="modal" data-target="#exampleModal"><i class="fa fa-times"></i> Elimina</a>` +                        
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
