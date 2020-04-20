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
    data: { 'id': id},
    success: function (data) {
      if (data != "success") {
        console.log("Errore nella rimozione")
      } 
    }
  });
}