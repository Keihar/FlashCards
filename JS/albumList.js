var selectedAlbum = "";
var tooltipShow = false;

$(document).ready(function () {
  $(function () {
    $('[data-toggle="tooltip"]').tooltip()
  })

  $.ajax({
    type: "POST",
    url: "PHP/json.php",
    data: "",
    success: function (data) {
      console.log(data);
      try {
        let user = JSON.parse(data);
        let row = document.getElementById("row");
        row.innerHTML = "";
        console.table(user);

        user.albums.forEach(album => {
          if (album.imgLink == null) {
            album.imgLink = "images\\albumCovers\\000-icon.svg";
          }
          let HTMLString = getCard(album.id, album.nome, album.descrizione, album.imgLink,
            album.username);
          row.innerHTML += "" + HTMLString;
          if (album.username != sessionUsername) {
            $("#viewAlbum" + album.id).html(`<i class="fas fa-search"></i> Anteprima`)
              .attr("onclick", `albumPreview(${album.id}, user.albums)`)
              .attr("data-toggle", `modal`)
              .attr("data-target", `#exampleModal`);
            $("#deleteAlbum" + album.id).attr("onclick", `removeAlbum(${album.id})`)
              .attr("data-toggle", ``);
          }
        });
      }
      catch (error) {
        //window.location.href = "login.html";
      }

    }
  });

  $('body').on('click', function (e) {
    $('[data-toggle=popover]').each(function () {
      if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
        $(this).popover('hide');
      }
    });
    
  });
});

function getCard(id, name, description, imgLink, author) {

  //  Truncate the description if it's too long
  var descMaxLength = 32;
  if (description.length > descMaxLength) {
    description = description.substring(0, descMaxLength) + "...";
  }
  let localAuth = author != sessionUsername ? author : "te";
  //  
  let str = `<div class="card mb-3 ml-3" style="min-width: 35rem; width: 35rem"> <div class="row no-gutters"> <div class="col-md-4">` +
    `<img src="${imgLink}" alt="" class="listImg"> </div> <div class="col-md-8"> <div class="card-body clearfix"> <h5 class="card-title">${name}` +
    `<button id="deleteAlbum${id}" onclick='deleteAlbumConfirm(${id})' class='btn btn-link ml-1 pt-0 float-right text-danger' data-toggle="modal" data-target="#deleteModal"><i class="fa fa-times"></i></button></h5> ` +
    `<p class="card-text">${description}</p><p class="card-text" id="p${id}">` +
    `<button id="playAlbum${id}" onclick='playAlbum(${id})' class='btn btn-primary' data-container="body" data-toggle="popover" data-placement="bottom" data-content="L'` +
    `album deve contenere almeno due flashcards!"> <i class="fa fa-arrow-right"></i> Avvia</button>` +
    `<button id="viewAlbum${id}" onclick='viewAlbum(${id})' class='btn btn-outline-secondary ml-1'><i class="fa fa-pencil"></i> Modifica</button>` +
    `</p> <a class="card-text text-secondary"href="profile.html?user=${author}"> Creato da ${localAuth}</a> </div> </div> </div> </div>`;
  return str;
}

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
        console.error("Errore nell'eliminazione")
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
          $('#playAlbum' + id).popover('show');
        }
        else {
          window.location.href = "playGarden.html";
        }
      }
      catch (error) { }
    }
  });
}
