const username = (getUrlVars()["user"]);
var user;

$(document).ready(function () {
    $.ajax({
        type: "POST",
        url: "PHP/json.php",
        data: { 'username': username },
        success: function (data) {
                user = JSON.parse(data);
                console.table(user);

                // Set Username
                setBackground();
                document.getElementById("userCardName").innerHTML = "" + user.nome;
                document.getElementById("mottoCardName").innerHTML = `"${user.motto}"`;
                document.getElementById("nalbum").innerHTML = "" + user.albums[0].nalbum;
                document.getElementById("nflashcard").innerHTML = "" + user.albums[0].nflashcard;
                $("#followBtn").click(function(){ follow(user.nome) });

                let row = document.getElementById("userCards");
                user.albums.forEach(album => {
                    if (album.imgLink == null) {
                        album.imgLink = "images\\albumCovers\\000-icon.svg";
                    }
                    row.innerHTML += "" + getPCard(album.id, album.nome, album.descrizione,
                        album.imgLink, username, user.albums);
                });

                checkLocalProfile();
        }
    })

    $.ajax({
        type: "POST",
        url: "PHP/getFriends.php",
        data: { 'username': username },
        success: function (data) {
                console.log(data);
                cuser = JSON.parse(data);

                document.getElementById("nfriends").innerHTML = cuser.nAmici;
                document.getElementById("nfollowers").innerHTML = cuser.nSeguaci;
                document.getElementById("nfollowed").innerHTML = cuser.nSeguiti;

                cuser.amici.forEach(friend => {
                    addUL("friendsUL", friend.nome_amico)
                });

                cuser.seguaci.forEach(friend => {
                    addUL("followersUL", friend.nome_seguace)
                });

                cuser.seguiti.forEach(friend => {
                    addUL("followedUL", friend.nome_seguito)
                });

            // }
            // catch {
            //     alert("Errore nell'ottenimento del profilo")
            // }
        }
    })
});

function getPCard(id, name, description, imgLink, author) {

    //  Truncate strings that exceeds the max length
    var descMaxLength = 32;
    if (description.length > descMaxLength) {
      description = description.substring(0, descMaxLength) + "...";
    }
    author = author != letUserName ?  author : "te";
    //  Returns the formatted HTML
    return `<div class="card mb-3 mx-auto singleCard"> <div class="row no-gutters"> <div class="col-md-4">` +
      `<img src="${imgLink}" id="cardImg"> </div> <div class="col-md-8"> <div class="card-body"> <h5 class="card-title">${name}</h5> ` +
      `<p class="card-text">${description}</p><p class="card-text">` +
      `<button onclick='saveAlbum(${id})' class='btn btn-primary'> <i class="fa fa-plus"></i> Aggiungi ai tuoi Albums</button>` +
      `<button data-toggle="modal" data-target="#exampleModal" onclick='albumPreview(${id})' class='btn btn-secondary ml-1'><i class="fa fa-pencil"></i> Anteprima</button>` +
      `</p> <p class="card-text text-secondary">Creato da ${author}</p> </div> </div> </div> </div>`;
}

function checkLocalProfile() {
    if(username != letUserName){ 
        let btns = `<button type="button" class="btn btn-primary" id="followBtn">
            <svg class="bi bi-person-plus-fill textIcon" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zm5-6a3 3 0 100-6 3 3 0 000 6zm7.5-3a.5.5 0 01.5.5v2a.5.5 0 01-.5.5h-2a.5.5 0 010-1H13V5.5a.5.5 0 01.5-.5z" clip-rule="evenodd"/>
            <path fill-rule="evenodd" d="M13 7.5a.5.5 0 01.5-.5h2a.5.5 0 010 1H14v1.5a.5.5 0 01-1 0v-2z" clip-rule="evenodd"/>
            </svg> Segui
        </button>
        <button type="button" class="btn btn-outline-secondary">
            <svg class="bi bi-envelope-fill textIcon" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M.05 3.555L8 8.414l7.95-4.859A2 2 0 0014 2H2A2 2 0 00.05 3.555zM16 4.697l-5.875 3.59L16 11.743V4.697zm-.168 8.108L9.157 8.879 8 9.586l-1.157-.707-6.675 3.926A2 2 0 002 14h12a2 2 0 001.832-1.195zM0 11.743l5.875-3.456L0 4.697v7.046z"/>
            </svg> Messaggio
        </button>`;
        $("#userBtns").html(btns);
        return; 
    }
    let editBtn = `<button type="button" class="btn btn-outline-primary" id="editBtn" data-toggle="modal" data-target="#editProfileModal">
        <svg class="bi bi-gear-fill" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 01-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 01.872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 012.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 012.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 01.872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 01-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 01-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 100-5.86 2.929 2.929 0 000 5.858z" clip-rule="evenodd"/>
    </svg> Modifica Profilo
    </button>`;
    $("#userBtns").html(editBtn);
    setProfileImages();
    $("#name").val(user.nome);
    $("#motto").val(user.motto);
}

function setProfileImages() {
    var dir = "images/profilesCovers";
    var fileextension = ".svg";
    $.ajax({
        //This will retrieve the contents of the folder if the folder is configured as 'browsable'
        url: dir,
        success: function (data) {
            //List all .png file names in the page
            $(data).find("a:contains(" + fileextension + ")").each(function () {
                var filename = this.href.replace(window.location.host, "").replace("http://", "");
                $("#icons").append(`<img class="img-thumbnail imgList" data-dismiss="modal" src="${dir}${filename}" onclick="changeIcon('${dir}','${filename}');">`);
            });
        }
    });
}

function setBackground() {
    var img = document.createElement('img');
    let path = document.getElementById("profileImage").src;
    img.setAttribute('src', path);

    img.addEventListener('load', function() {
        var vibrant = new Vibrant(img);
        var swatches = vibrant.swatches()
        document.getElementById("coverImg").style.background = swatches["Vibrant"].getHex();
        for (var swatch in swatches)
            if (swatches.hasOwnProperty(swatch) && swatches[swatch])
                console.log(swatch, swatches[swatch].getHex())
    
        /*
         * Results into:
         * Vibrant #7a4426
         * Muted #7b9eae
         * DarkVibrant #348945
         * DarkMuted #141414
         * LightVibrant #f3ccb4
         */
    });
}

function changeIcon(dir, filename) {
    document.getElementById('currentIcon').src = dir + filename;
}

function addUL(parent, str) {
    var ul = document.getElementById(parent);
    var li = document.createElement("li");
    $(li).addClass("list-group-item d-flex justify-content-between align-items-center");
    li.appendChild(document.createTextNode(str));
    ul.appendChild(li);
}

function follow(user) {
    //  Ajax request
    $.ajax({
      type: "POST",
      url: "PHP/followPerson.php",
      data: { 'username': user },
      success: function (data) {
        console.log(data)
      }
    })
  }

  