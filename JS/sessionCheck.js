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

$(document).ready(function() {
    // Blocks breaks in TextAreas
    $("textarea").keypress(function(event) {
      if(event.which == '13') {
        return false;
      }
    });
    $.ajax({
        type: "POST",
        url: "PHP/json.php",
        data: "",
        success: function (data) {
            try {
                let user = JSON.parse(data);
                console.log("User logged found.");

                document.getElementById("welcomeText").innerHTML = "Bentornato, " + user.nome;
                var albumBox = document.getElementById("recentAlbums");
                user.albums.forEach(album => {
                    albumBox.innerHTML += "<li class='nav-item'>" +
                    "<a class='nav-link' href='#' onclick='return playAlbum("+ album.id +");'>" +
                    "<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='feather feather-file-text'><path d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z'></path><polyline points='14 2 14 8 20 8'></polyline><line x1='16' y1='13' x2='8' y2='13'></line><line x1='16' y1='17' x2='8' y2='17'></line><polyline points='10 9 9 9 8 9'></polyline></svg>" +
                    "&nbsp;" + album.nome +
                    "</a>" +
                  "</li>";
                });
            } 
            catch (error) {
                window.location.href = "login.html";
            }
        }
    });
});
