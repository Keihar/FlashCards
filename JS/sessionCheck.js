var sessionUsername;
var user;

//  Enables PopOvers
$(function () {
  $('[data-toggle="popover"]').popover()
})

//  Enables Tooltips
$(function () {
  $('[data-toggle="tooltip"]').tooltip()
});

$(document).ready(function () {
  // Blocks breaks in TextAreas
  $("textarea").keypress(function (event) {
    if (event.which == '13') {
      return false;
    }
  });

  if(getUrlVars()["user"] != undefined || getUrlVars()["user"] != "")
  {
    $.ajax({
      type: "POST",
      url: "PHP/json.php",
      data: "",
      success: function (data) {
        try {
          user = JSON.parse(data);
          console.log("User logged found.");
        }
        catch (error) {
          console.error(data);
        }
        document.getElementById("welcomeText").innerHTML = "Bentornato, " + user.nome;
        sessionUsername = user.nome;
        document.getElementById("profileNavBtn").href = "profile.html?user=" + user.nome;
      }
    });
  }

  $(".banBadChar").each(function (index) {
    $(this).keypress(function (e) {
      var keyCode = e.keyCode || e.which;

      //Regex for Valid Characters i.e. Alphabets and Numbers.
      var regex = /[^\w\d\s\']/gi;

      //Validate TextBox value against the Regex.
      var isValid = regex.test(String.fromCharCode(keyCode));
      if (isValid) {
        $(this).popover('show')

      }
      else {
        $(this).popover('hide')
      }
      return !isValid;
    });

    $(this).click(function (e) {
      $(this).popover('hide')
    });
  })

});

function logout() {
  $.ajax({
    type: "POST",
    url: "PHP/logout.php",
    data: "",
    success: function (data) {
      console.log(data)
      if (data != "success") {
        alert("Errore nel logout!");
      }
      else {
        window.location.href = "login.html";
      }
    }
  });
}

function viewAlbum(id) {
  $.ajax({
    type: "GET",
    url: "PHP/setCurrentAlbum.php",
    data: { 'id': id },
    success: function (data) {
      if (data != "success") {
        console.log("Errore nell'impostare la variabile di sessione")
      }
      else {
        window.location.href = "albumView.html";
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
        console.log("Errore nell'impostare la variabile di sessione")
      }
      else {
        window.location.href = "playGarden.html";
      }
    }
  });
}


function getUrlVars() {
  var vars = [], hash;
  var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
  for (var i = 0; i < hashes.length; i++) {
    hash = hashes[i].split('=');

    if ($.inArray(hash[0], vars) > -1) {
      vars[hash[0]] += "," + hash[1];
    }
    else {
      vars.push(hash[0]);
      vars[hash[0]] = hash[1];
    }
  }

  return vars;
}

function markBtns(salvati) {
  console.time("MarkBtn");
  if (salvati == undefined) {
    console.error("Error while retrieving saved albums");
    return;
  }

  $('div').find('button:contains("Aggiungi album")').each(function () {
    salvati.forEach(num => {
      if ($(this).attr('id') == ("btn" + String(num.id))) {
        $(this).html(`<i class="fas fa-minus"></i> Rimuovi album`);
        $(this).removeClass("btn-primary").addClass("btn-outline-primary");
        $(this).attr("onclick", `removeAlbum(${num.id})`)
      }
    });
  });

  console.timeEnd("MarkBtn");
}


function removeAlbum(id) {
  $.ajax({
    type: "POST",
    url: "PHP/removeAlbum.php",
    data: { 'id': id },
    success: function (data) {
      if (data != "success") {
        console.error("Errore nella rimozione")
      }
      else {
        window.location.reload();
      }
    }
  });
}

//  Album Preview
function albumPreview(id, array) {
  array.forEach(album => {
    if (album.id == id) {
      //  Setting default image if its's null
      album.imgLink = album.imgLink == null ? "images\\albumCovers\\000-icon.svg": album.imgLink;

      //  Setting title and description
      $("#modal-title").html("" + album.nome);
      $("#modal-body").html("" + album.descrizione);

      //  Adds backs and fronts to the table
      let tableBody = document.getElementById("tableBody");
      tableBody.innerHTML = "";
      console.table(album.flashcards);

      if (album.flashcards.length < 1) {
        $("#noflashcards").show();
        $("#tableList").hide();
        return;
      }
      else {
        $("#noflashcards").hide();
        $("#tableList").show();
      }
      album.flashcards.forEach(flashcard => {
          tableBody.innerHTML += "<tr>" +
            `<td>${flashcard.fronte.replace('\\', '')}</td>` +
            `<td>${flashcard.retro.replace('\\', '')}</td>` +
            "</tr>";
      });
    }
  });
}
