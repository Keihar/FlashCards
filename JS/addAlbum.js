$("#addAlbum").submit(function (e) {
    e.preventDefault();
    var form = $(this);
    var url = form.attr('action');

    $.ajax({
      type: "POST",
      url: url,
      data: new FormData(form),
      success: function (data) {
          console.log(data);
        if (data == "success") {
          alert("Album aggiunto correttamente!")
          window.location.href = "dashboard.html";
        }
        else {
            alert("Errore nell'aggiunta")
        }
      }
    });
  });