var albumID = "";
var modifyingRow = false;
var dir = "images/albumCovers";
var fileextension = ".svg";

$(document).ready(function() {
  //GetCurrent
  $.ajax({
    type: "GET",
    url: "PHP/getCurrentAlbum.php",
    data: "",
    success: function (data) {
      let album = JSON.parse(data);
      albumID = album.id;
      $("#albumName").val(album.nome.replace('\\',''));
      $("#albumDescription").html(album.descrizione.replace('\\',''));
  
      document.getElementById("privateCheck").checked = album.privato == 1;
  
      if (album.imgLink == null)
        album.imgLink = "images\\albumCovers\\000-icon.svg";
  
      $("#currentIcon").attr('src', album.imgLink);
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

  
  $("#flashcardsForm").submit(function (e) {
    e.preventDefault();
    var form = $(this);
    var url = form.attr('action');

    $.ajax({
      type: "POST",
      url: url,
      data: form.serialize(),
      success: function (data) {
        console.log(data);
        if (isNaN(data)) {
          alert("Errore nell'aggiunta")
        }
        else {
          let id = "" + data;
          let front = document.getElementById("frontCard");
          let back = document.getElementById("backCard");
          let row = "<tr>" +
            `<td>${front.value}</td>` +
            `<td>${back.value}</td>` +
            `<td> <button type="button" onclick="modifyRow(this, ${id})" class="btn btn-outline-secondary btn-sm">Modifica</button></td>` +
            `<td> <button type="button" onclick="deleteRow(this, ${id})" class="btn btn-outline-danger btn-sm">Rimuovi</button></td>` +
            "</tr>";
          front.value = "";
          back.value = "";
          $(document.getElementById("tableList")).find('tbody').append(row);
        }
      }
    });
  });

  $("#modifyAlbum").submit(function (e) {
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
        if (data != "success") {
          alert("Errore nella modifica")
        }
        else {
          window.location.href = "albumList.html";
        }
      }
    });
  });

  
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
})


function deleteRow(btn, id) {
  var row = btn.parentNode.parentNode;
  row.parentNode.removeChild(row);
  $.ajax({
    type: "POST",
    url: "PHP/deleteFlashcard.php",
    data: { 'id': id },
    success: function (data) {
      if (data != "success") {
        alert("Errore nella rimozione")
      }
    }
  });
}

function modifyRow(btn, id) {
  if (modifyingRow) {
    return;
  }
  else {
    modifyingRow = true;
  }
  let row = $(btn).parent().parent()[0];
  let cols = $(row).children();
  // Fronte
  cols[0].innerHTML = `<div class="input-group input-group-sm"><div class="input-group-prepend"><span class="input-group-text" id="inputGroup-sizing-sm">Nuovo Fronte</span></div><input type="text" value="${cols[0].innerHTML}" id="newFront" class="form-control w-3" aria-label="Small" aria-describedby="inputGroup-sizing-sm"></div>`;
  // Retro
  cols[1].innerHTML = `<div class="input-group input-group-sm"><div class="input-group-prepend"><span class="input-group-text" id="inputGroup-sizing-sm">Nuovo Retro</span></div><input type="text" value="${cols[1].innerHTML}" id="newBack" class="form-control w-3" aria-label="Small" aria-describedby="inputGroup-sizing-sm"></div>`;
  // Save
  cols[2].innerHTML = `<button id="saveRowBtn" class="btn btn-secondary btn-sm w" onclick="saveNewRow(${id})"><i class="far fa-save"></i> Salva</button>`;
}

function saveNewRow(id) {
  let newFront = $("#newFront").val();
  let newBack = $("#newBack").val()

  $.ajax({
    type: "POST",
    url: "PHP/modifyFlashcard.php",
    data: { 'id': id, 'fronte': newFront, 'retro': newBack },
    success: function (data) {
      if (data != "success") {
        alert("Errore nella modifica")
      }
      else {
        let btn = document.getElementById("saveRowBtn");
        let row = $(btn).parent().parent()[0];
        let cols = $(row).children();
        // Fronte
        cols[0].innerHTML = "" + newFront;
        // Retro
        cols[1].innerHTML = "" + newBack;
        // Save
        cols[2].innerHTML = `<button type="button" onclick="modifyRow(this, ${id})" class="btn btn-outline-secondary btn-sm">Modifica</button>`;
        modifyingRow = false;
      }
    }
  });
}

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

