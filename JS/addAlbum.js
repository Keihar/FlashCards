$("#addAlbum").submit(function (e) {
    e.preventDefault();
    var form = $(this);
    var url = form.attr('action');

    $.ajax({
      type: "POST",
      url: url,
      data: form.serialize(),
      success: function (data) {
          console.log(data);
        if (data == "success") {
          alert("Album aggiunto correttamente!")
          window.location.href = "albumView.html";
        }
        else {
          alert("Errore nell'aggiunta")
        }
      }
    });
  });