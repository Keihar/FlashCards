//  Variable that memorizes the JSON avaible for all functions
var user;
var spinner = `<div class="d-flex justify-content-center w-100"><div class="spinner-border" role="status"><span class="sr-only">Loading...</span></div></div>`;

// Search
function search() {
  var query = document.getElementById("searchBar").value;
  // If the user doesn't type something returns
  if (query == "") {
    return;
  }
  //  Charging text
  let row = document.getElementById("row");
  row.innerHTML = spinner;
  //  Ajax request
  $.ajax({
    type: "POST",
    url: "PHP/searchQuery.php",
    data: { 'query': query },
    success: function (data) {
      try {
        user = JSON.parse(data);
        //  Zero results
        if (user.albums.length == 0) {
          row.innerHTML = "<div class='mb-3 col'> Nessun risultato.</div>"
        }
        else {
          row.innerHTML = "";
        }
        //  Print every album
        console.table(user);
        user.albums.forEach(album => {
          if (album.imgLink == null) {
            album.imgLink = "images\\albumCovers\\000-icon.svg";
          }
          row.innerHTML += "" + getCard(album.id, album.nome, album.descrizione,
            album.imgLink, album.nomeutente);
        });
      }
      //  Prints the eventual errors 
      catch (error) {
        console.error(data);
        row.innerHTML = "<div class='mb-3 col'> Errore nella ricerca.</div>"
      }
    }
  });
}

//  Card formatter
function getCard(id, name, description, imgLink, author) {

  //  Truncate strings that exceeds the max length
  var descMaxLength = 32;
  if (description.length > descMaxLength) {
    description = description.substring(0, descMaxLength) + "...";
  }
  let localAuth = author != letUserName ?  author : "te";
  //  Returns the formatted HTML
  return `<div class="card mb-3 ml-3" id="singleCard"> <div class="row no-gutters"> <div class="col-md-4">` +
    `<img src="${imgLink}" id="cardImg"> </div> <div class="col-md-8"> <div class="card-body"> <h5 class="card-title">${name}</h5> ` +
    `<p class="card-text">${description}</p><p class="card-text">` +
    `<a href='#' onclick='saveAlbum(${id},${user.nome})' class='btn btn-primary'> <i class="fa fa-plus"></i> Aggiungi ai tuoi Albums</a>` +
    `<button data-toggle="modal" data-target="#exampleModal" onclick='albumPreview(${id})' class='btn btn-secondary ml-1'><i class="fa fa-pencil"></i> Anteprima</button>` +
    `</p> <p class="card-text"><a href="profile.html?user=${author}" class="text-secondary"">Creato da ${localAuth}</a></p> </div> </div> </div> </div>`;
}

//  Album Preview
function albumPreview(id) {
  user.albums.forEach(album => {
    if (album.id == id) {
      //  Setting default image if its's null
      album.imgLink = album.imgLink == null ? "images\\albumCovers\\000-icon.svg": album.imgLink;

      //  Setting title and description
      document.getElementById("modal-title").innerHTML = "" + album.nome;
      document.getElementById("modal-body").innerHTML = "" + album.descrizione;

      //  Adds backs and fronts to the table
      let tableBody = document.getElementById("tableBody");
      tableBody.innerHTML = "";
      console.table(album.flashcards);
      album.flashcards.forEach(flashcard => {
          tableBody.innerHTML += "<tr>" +
            `<td>${flashcard.fronte.replace('\\', '')}</td>` +
            `<td>${flashcard.retro.replace('\\', '')}</td>` +
            "</tr>";
      });
    }
  });
}

//  Album Preview
function saveAlbum(id, email = user.richiedente) {
  //  Ajax request
  $.ajax({
    type: "POST",
    url: "PHP/saveAlbum.php",
    data: { 'id_album': id, 'email': email },
    success: function (data) {
      switch (data) {
        case "success":
          alert("Album Salvato");
          break;
      
        case "saveExisting":
          alert("L'album è già presente");
          break;

        default:
          console.error(data) 
          break;
      }
    }
  })
}


//  Enter shortcut for search bar
$(function () {
  $("#searchBar").keypress(function (e) {
    if ((e.which && e.which == 13) || (e.keyCode && e.keyCode == 13)) {
      $('#searchBtn').click();
      return false;
    } else {
      return true;
    }
  });
});