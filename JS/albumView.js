//Global Variables
var albumID = "";
var modifyingRow = false;
var profilePicDir = "images/albumCovers";
var fileextension = ".svg";

$(document).ready(function() {
  //Get Current Album (Session)
  $.ajax({
    type: "GET",
    url: "PHP/getCurrentAlbum.php",
    data: "",
    success: function (data) {
      //  Verify the integrity of the received data
      let album;
      try { album = JSON.parse(data) } 
      catch (error) { console.error("Errore nell'ottenimento dell'album di sessione.") }

      //  Sets file global variable
      albumID = album.id;

      //  Place the sanitized title and description
      $("#albumName").val(album.nome.replace('\\',''));
      $("#albumDescription").html(album.descrizione.replace('\\',''));
      $("privateCheck").prop('checked', album.privato == 1);
      
      //  Set a default image if the received is null
      if (album.imgLink == null || album.imgLink == "")
        album.imgLink = "images\\albumCovers\\000-icon.svg";
      
      //  Sets the icon
      $("#currentIcon").attr('src', album.imgLink);
      
      //  Places the FlashCards into the table
      let tableBody = document.getElementById("tableBody");
      album.flashcards.forEach(flashcard => {
        tableBody.innerHTML += "<tr>" +
          `<td>${flashcard.fronte.replace('\\','')}</td>` +
          `<td>${flashcard.retro.replace('\\','')}</td>` +
          `<td> <button type="button" onclick="modifyRow(this, ${flashcard.id})" class="btn btn-outline-secondary btn-sm">Modifica</button></td>` +
          `<td> <button type="button" onclick="deleteRow(this, ${flashcard.id})" class="btn btn-outline-danger btn-sm">Rimuovi</button></td>` +
        "</tr>";
      });
    }
  });

  //  Add Flashcard request
  $("#flashcardsForm").submit(function (e) {
    e.preventDefault();
    var form = $(this);
    var url = form.attr('action');

    $.ajax({
      type: "POST",
      url: url,
      data: form.serialize(),
      success: function (data) {
        //  Verify the integrity of the received data 
        if (isNaN(data)) { alert("Errore nell'aggiunta della Flashcard."); return;}

        //  Take to received id to set the funztions later
        let id = String(data);

        //  Adds the row to the table
        flashToTable($("#frontCard").val(), $("#frontCard").val(), id)

        //  Flush the textareas
        $("#frontCard").val("")
        $("#backCard").val("");
      }
    });
  });

  //  Modify Album
  $("#modifyAlbum").submit(function (e) {

    //  Set the hidden input value equals to the chosen img
    $("#imgLink").val($("#currentIcon").attr('src'));

    e.preventDefault();
    var form = $(this);
    var url = form.attr('action');

    $.ajax({
      type: "POST",
      url: url,
      data: form.serialize(),
      success: function (data) {
        //  Verify the response of the received data 
        if (data != "success") { alert("Errore nella modifica") }
        else { window.location.href = "albumList.html"; }
      }
    });
  });

  //  Fills the profile icon-list-modal's images
  $.ajax({
    //  Retrieve the contents of the folder
    url: profilePicDir,
    success: function (data) {
        $(data).find("a:contains(" + fileextension + ")").each(function () {
            var filename = this.href.replace(window.location.host, "").replace("http://", "");
            $("#icons").append(
              `<img src="${profilePicDir}${filename}" onclick="changeIcon('${filename}')" class="img-thumbnail imgList" data-dismiss="modal">`
            );
        });
    }
  });

  //  Label changer when file is chosen
  $('#fileToUpload').on('change',function(){
    //  Get the file name
    let fileName = $(this).val();;

    //  Remove the path
    try {
      myVal = fileName.split('\\');
      fileName = myVal[myVal.length - 1]
    } catch(e){}
    
    //Replace the "Scegli un file" label
    $(this).next('.custom-file-label').html(fileName);
  })

})

/*  ---End of the OnReady---  */

