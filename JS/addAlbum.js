$("#addAlbum").submit(function (e) {
    document.getElementById("imgLink").value = document.getElementById('currentIcon').src;
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

var dir = "images/albumCovers";
var fileextension = ".svg";
$.ajax({
    //This will retrieve the contents of the folder if the folder is configured as 'browsable'
    url: dir,
    success: function (data) {
        //List all .png file names in the page
        $(data).find("a:contains(" + fileextension + ")").each(function () {
            var filename = this.href.replace(window.location.host, "").replace("http://", "");
            $("#icons").append(`<img class="img-thumbnail imgList" data-dismiss="modal" src="${dir}${filename}" onclick="changeIcon('${filename}');">`);
        });
    }
});

function changeIcon(filename) {
  document.getElementById('currentIcon').src = dir + filename;
}
