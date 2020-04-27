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
            var user;
            try {
                user = JSON.parse(data);
                console.log("User logged found.");
              } 
              catch (error) {
                //window.location.href = "login.html";
              }
              document.getElementById("welcomeText").innerHTML = "Bentornato, " + user.nome;
              document.getElementById("profileNavBtn").href = "profile.html?user=" + user.nome;
        }
    });
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


function getUrlVars()
{
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');

        if($.inArray(hash[0], vars)>-1)
        {
            vars[hash[0]]+=","+hash[1];
        }
        else
        {
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
    }

    return vars;
}