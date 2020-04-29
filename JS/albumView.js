//Global Variables
var albumID = "";
var modifyingRow = false;
var dir = "images/albumCovers";
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
      let tableBody = document.getElementById("tableBody");

      //  Places the FlashCards into the table
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
        $("#tableList").find('tbody').append(
          `<tr>`+
          `<td>${$("#frontCard").val()}</td>`+
          `<td>${$("#backCard").val()}</td>`+
          `<td> <button type="button" onclick="modifyRow(this, ${id})" class="btn btn-outline-secondary btn-sm">Modifica</button></td>`+
          `<td> <button type="button" onclick="deleteRow(this, ${id})" class="btn btn-outline-danger btn-sm">Rimuovi</button></td>`+
          `</tr>`
        );

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

  //  Validate the file through the PHP
  $("#importFiles").submit(function (e) {
    e.preventDefault();
    var form = $(this);
    var url = form.attr('action');
    var file_data = $("#myFile").prop("files")[0];
    var form_data = new FormData();               
    form_data.append("file", file_data) 

    $.ajax({
      type: "POST",
      url: url,
      data: form_data,
      success: function (data) {
        alert(data);
      }
    });
  });

  //  Retrieve the contents of the folder
  $.ajax({
    url: dir,
    success: function (data) {
        //  List all .png file names in the page
        $(data).find("a:contains(" + fileextension + ")").each(function () {
            var filename = this.href.replace(window.location.host, "").replace("http://", "");
            $("#icons").append(
              `<img src="${dir}${filename}" onclick="changeIcon('${filename}')" class="img-thumbnail imgList" data-dismiss="modal">`
            );
        });
    }
  });

  //  Label changer when file is chosen
  $('#myFile').on('change',function(){
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

//  Deletes a row from the table
function deleteRow(btn, id) {
  var row = btn.parentNode.parentNode;
  row.parentNode.removeChild(row);
  $.ajax({
    type: "POST",
    url: "PHP/deleteFlashcard.php",
    data: { 'id': id },
    success: function (data) {
      if (data != "success") { alert("Errore nella rimozione") }
    }
  });
}

//  Modifies row through the table
function modifyRow(btn, id) {
  //  Verifies if a row is being modfied
  if (modifyingRow) { return; }
  else { modifyingRow = true; }

  //  Gets the parent and shows inputs
  let row = $(btn).parent().parent()[0];
  let cols = $(row).children();
  // Front
  cols[0].innerHTML = `<div class="input-group input-group-sm"><div class="input-group-prepend"><span class="input-group-text" id="inputGroup-sizing-sm">Nuovo Fronte</span></div><input type="text" value="${cols[0].innerHTML}" id="newFront" class="form-control w-3" aria-label="Small" aria-describedby="inputGroup-sizing-sm"></div>`;
  // Back
  cols[1].innerHTML = `<div class="input-group input-group-sm"><div class="input-group-prepend"><span class="input-group-text" id="inputGroup-sizing-sm">Nuovo Retro</span></div><input type="text" value="${cols[1].innerHTML}" id="newBack" class="form-control w-3" aria-label="Small" aria-describedby="inputGroup-sizing-sm"></div>`;
  // Save
  cols[2].innerHTML = `<button id="saveRowBtn" class="btn btn-secondary btn-sm w" onclick="saveNewRow(${id})"><i class="far fa-save"></i> Salva</button>`;
}

//  Saves row modified through the table
function saveNewRow(id) {
  //  Gets the values from the inputs
  let newFront = $("#newFront").val();
  let newBack = $("#newBack").val()

  $.ajax({
    type: "POST",
    url: "PHP/modifyFlashcard.php",
    data: { 'id': id, 'fronte': newFront, 'retro': newBack },
    success: function (data) {
      //  Verify the response of the received data 
      if (data != "success") { alert("Errore nella modifica della riga"); return; }

      let row = $("#saveRowBtn").parent().parent()[0];
      let cols = $(row).children();
      // Front
      cols[0].innerHTML = "" + newFront;
      // Back
      cols[1].innerHTML = "" + newBack;
      // Save
      cols[2].innerHTML = `<button type="button" onclick="modifyRow(this, ${id})" class="btn btn-outline-secondary btn-sm">Modifica</button>`;
      modifyingRow = false;
    }
  });
}

//  Icon changer for the icon list modal
function changeIcon(filename) {
  document.getElementById('currentIcon').src = dir + filename;
}

//  Files Support
function handleFileSelect()
{               
  if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
    alert('The File APIs are not fully supported in this browser.');
    return;
  }   

  var input = document.getElementById('fileinput');
  if (!input.files) {
    alert("This browser doesn't seem to support the `files` property of file inputs.");
  }
  else if (!input.files[0]) {
    alert("Please select a file before clicking 'Load'");               
  }
  else {
    var file = input.files[0];
    var fr = new FileReader();
    fr.onload = receivedText;
    //fr.readAsText(file);
    //fr.readAsBinaryString(file); //as bit work with base64 for example upload to server
    fr.readAsDataURL(file);
  }
}

function receivedText() {
  document.getElementById('editor').appendChild(document.createTextNode(fr.result));
}    

