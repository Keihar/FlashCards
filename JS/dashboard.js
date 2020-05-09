$(document).ready(function () {

  $.ajax({
    type: "POST",
    url: "PHP/dashboardJSON.php",
    data: "",
    success: function (data) {
      try { duser = JSON.parse(data) }
      catch (error) { console.error("Error while getting the dashboard") }

      duser.albums.forEach(album => {
        $("#row").html($("#row").html() + getDashCard(album.id, album.nome, album.descrizione,
          album.imgLink, album.autore.username, album.data, album.autore.imgProfilo));
      });

      //  Retard the popover to make it visible
      $('.shareLink').popover({
        placement: 'right',
        html: true,
        trigger: 'focus',
        delay: { "show": 10, "hide": 1000 },
        content: function () {
          return $('#content-wrapper1').html();
        }
      });

      $(".card").addClass("mx-auto");
      // Set the onclick
      var eles = document.getElementsByClassName('prevBtn');
      for (var i = 0; i < eles.length; i++) {
        eles[i].removeAttribute("onclick");
        eles[i].setAttribute("onclick", `albumPreview(${eles[i].id.replace('prevBtn', '')}, duser.albums)`);
      }

      markBtns(user.salvati);

      //  Loading Ends
      $("#profile").attr("src", user.imgProfilo)
      $("#ideaPost").show();
      $("#spinner").remove();
    }
  });

});

function getDashCard(id, name, description, imgLink, author, date, authorImg) {

  //Set default image if null
  if (authorImg == undefined) { authorImg = "images\\profilesCovers\\dog.svg" };

  //  Data formatted
  date = getFormattedDatetime(date);

  //  Truncate the description if it's too long
  var descMaxLength = 32;
  if (description.length > descMaxLength) {
    description = description.substring(0, descMaxLength) + "...";
  }
  let localAuth = author != sessionUsername ? author : "te";

  //  

  let str = `<div class="card ${localAuth} mb-4 ml-4" style="min-width: 35rem; width: 35rem"> <div class="row no-gutters"><div class="card-header w-100 clearfix">` +
    `<a class="card-text text-muted align-middle" href="profile.html?user=${author}"> <img alt="" class="profileMiniature" src=${authorImg}> ${localAuth} ha aggiornato:</a>` +
    `<button class="btn btn-link text-muted float-right p-0 shareLink" onclick="copyTo('localhost/dashboard.html')" data-container="body" data-toggle="popover" data-placement="bottom" data-content="Copiato negli appunti!"><i class="fas fa-link"></i></button></div> <div class="col-md-4">` +
    `<img src="${imgLink}" alt="" class="listImg"> </div> <div class="col-md-8">` +
    `<div class="card-body clearfix mt-2"> <h5 class="card-title">${name}</h5> ` +
    `<p class="card-text">${description}</p><p class="card-text" id="p${id}">` +
    `<button id="btn${id}" onclick='saveAlbum(${id},"${sessionUsername}")' class='btn btn-primary'><i class="fas fa-plus"></i> Aggiungi album</button>` +
    `<button id="nbtn${id}" class='btn btn-outline-primary' onclick="removeAlbum(${id})" style="display:none;"><i class="fas fa-minus"></i> Rimuovi album</button>` +
    `<button data-toggle="modal" data-target="#exampleModal" id="prevBtn${id}" onclick='albumPreview(${id}, user.albums)' class='btn btn-outline-secondary ml-1 prevBtn'><i class="fas fa-search"></i> Anteprima</button>` +
    `</p></div> </div>` + //<i class="fas fa-lightbulb"></i>
    `<div class="card-footer w-100 text-center text-muted"> <i class="fas fa-book"></i>&nbsp; <span>${date}</span>  </div></div> </div>`;
  return str;
}