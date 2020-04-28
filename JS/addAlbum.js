$(document).ready(function () {
  //  Ajax AddAlbum
  $("#addAlbum").submit(function (e) {
    $("#imgLink").val($("#currentIcon").attr('src'));
    e.preventDefault();
    var form = $(this);
    var url = form.attr('action');

    $.ajax({
      type: "POST",
      url: url,
      data: form.serialize(),
      success: function (data) {
          console.log(data);
        if (data.trim() == "success") {
          window.location.reload();
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
});

function changeIcon(filename) {
  $("#currentIcon").attr('src', dir + filename); ù
  $("#imgLink").attr('src', dir + filename); 
}
