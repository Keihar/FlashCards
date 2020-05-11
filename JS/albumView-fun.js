var dir = "images/albumCovers";

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
var fr = new FileReader();
function handleFileSelect() {
    if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
        alert('The File APIs are not fully supported in this browser.');
        return;
    }

    var input = document.getElementById('fileToUpload');
    if (!input.files) {
        alert("This browser doesn't seem to support the `files` property of file inputs.");
    }
    else if (!input.files[0]) {
        alert("Please select a file before clicking 'Load'");
    }
    else {
        var file = input.files[0];
        fr.readAsText(file);
        fr.onload = receivedText;
    }
}

//  Activated when the file is read
function receivedText() {
    let txt = String(fr.result);
    let ext = $("#fileToUpload").val().split('.').pop();

    //  Validates the file through the PHP
    $.ajax({
        type: "POST",
        url: "PHP/importFiles.php",
        data: { 'file': txt, 'ext': ext },
        success: function (data) {
            var json;
            if (data == "extensionError") {
                $("#fileAlert").html("L'estensione del file non è valida.");
                $("#fileAlert").show();
                return;
            }
            else if (data == "nColumnsError") {
                $("#fileAlert").html("Il file non è formattato correttamente.");
                $("#fileAlert").show();
                return;
            }
            else {
                try { json = JSON.parse(data) }
                catch (error) {
                    $("#fileAlert").html("Errore nella conversione del file.");
                    $("#fileAlert").show();
                    return;
                }
                $("#fileAlert").hide();
                $("#importBtn").html(
                    `<div class="spinner-border spinner-border-sm text-light" role="status" ` +
                    `style="margin-bottom: 0.15em"><span class="sr-only">Loading...</span>` +
                    `</div> Caricamento...`
                );

                json.forEach(row => {
                    let front = row[0];
                    let back = row[1];
                    $.ajax({
                        type: "POST",
                        url: "PHP/addFlashcard.php",
                        data: { 'fronte': front, 'retro': back },
                        success: function (data) {
                            //  Verify the integrity of the received data 
                            if (isNaN(data)) { alert("Errore nell'aggiunta della Flashcard."); console.error(data); return; }

                            //  Take to received id to set the funztions later
                            let id = String(data);

                            //  Adds the row to the table
                            flashToTable(front, back, id);
                            $('#uploadModal').modal('toggle')
                            $("#importBtn").html("Importa");
                        }
                    });
                });
            }
        }
    });
}

function flashToTable(front, back, id) {
    $("#tableList").find('tbody').append(
        `<tr>` +
        `<td>${front}</td>` +
        `<td>${back}</td>` +
        `<td> <button type="button" onclick="modifyRow(this, ${id})" class="btn btn-outline-secondary btn-sm">Modifica</button></td>` +
        `<td> <button type="button" onclick="deleteRow(this, ${id})" class="btn btn-outline-danger btn-sm">Rimuovi</button></td>` +
        `</tr>`
    );
}


