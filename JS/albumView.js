var albumID = "";

$.ajax({
  type: "GET",
  url: "PHP/getCurrentAlbum.php",
  data: "",
  success: function (data) {
    let album = JSON.parse(data);
    albumID = album.id;
    document.getElementById("albumName").value = album.nome;
    document.getElementById("albumDescription").innerHTML = album.descrizione;
    let tableBody = document.getElementById("tableBody");
    album.flashcards.forEach(flashcard => {
      tableBody.innerHTML += "<tr>" +
        `<td>${flashcard.fronte}</td>` +
        `<td>${flashcard.retro}</td>` +
        `<td> <button type="button" onclick="modifyRow(this, ${flashcard.id})" class="btn btn-outline-secondary btn-sm">Modifica</button></td>` +
        `<td> <button type="button" onclick="deleteRow(this, ${flashcard.id})" class="btn btn-outline-danger btn-sm">Rimuovi</button></td>` +
        "</tr>";
    });
  }
});

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
  let row = $(btn).parent().parent()[0];
  let cols = $(row).children();
  // Fronte
  cols[0].innerHTML = `<div class="input-group input-group-sm"><div class="input-group-prepend"><span class="input-group-text" id="inputGroup-sizing-sm">Nuovo Fronte</span></div><input type="text" value="${cols[0].innerHTML}" class="form-control w-3" aria-label="Small" aria-describedby="inputGroup-sizing-sm"></div>`;
  // Retro
  cols[1].innerHTML = `<div class="input-group input-group-sm"><div class="input-group-prepend"><span class="input-group-text" id="inputGroup-sizing-sm">Nuovo Retro</span></div><input type="text" value="${cols[1].innerHTML}" class="form-control w-3" aria-label="Small" aria-describedby="inputGroup-sizing-sm"></div>`;
  // Save
  cols[2].innerHTML = `<button class="btn btn-secondary btn-sm w" onclick="saveNewRow(${id})"><i class="far fa-save"></i> Salva</button>`;
}

function saveNewRow(id) {
  
}

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
