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
          $('#exampleModal').modal('show');
        }
        else {
          alert("Errore nell'aggiunta")
        }
      }
    });
  });