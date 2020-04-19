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

$(document).ready(function() {
    console.log( "ready!" );
    $.ajax({
        type: "POST",
        url: "PHP/json.php",
        data: "",
        success: function (data) {
            console.log(data);
            try {
                let user = JSON.parse(data); 
                console.log("Session found");
            } 
            catch (error) {
                window.location.href = "login.html";
            }
            
        }
    });
});