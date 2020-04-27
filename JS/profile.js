const username = (getUrlVars()["user"]);
var user;

$(document).ready(function () {
    $("#editAlert").hide()
    //$("#unfollowBtn").hide()
    $.ajax({
        type: "POST",
        url: "PHP/json.php",
        data: { 'username': username },
        success: function (data) {
            try { user = JSON.parse(data) } 
            catch (error) { console.error("Errore nell'ottenimento del profilo")}

            console.table(data);

            // Set Username
            if(user.imgProfilo == undefined || user.imgProfilo == "" || user.imgProfilo == "")
                user.imgProfilo = "images\\profilesCovers\\dog.svg"
            
            document.getElementById("profileImage").src = user.imgProfilo;
            document.getElementById("currentIcon").src = user.imgProfilo;
            setBackground();

            $("#userCardName").html("" + user.nome);
            $("#mottoCardName").html(`"${user.motto}"`);
            $("#nalbum").html(user.nalbum);
            $("#nflashcard").html(user.nflashcard);

            $("#followBtn").click(function () { follow(user.nome) });
            $("#unfollowBtn").click(function () { unfollow(user.nome) });

            let row = document.getElementById("userCards");
            user.albums.forEach(album => {
                if (album.imgLink == null)
                    album.imgLink = "images\\albumCovers\\000-icon.svg";
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
            try { fuser = JSON.parse(data) } 
            catch (error) { console.error("Errore nell'ottenimento degli amici")}

            checkForUnfollowBtn(fuser.seguaci);

            $("#nfriends").html("" + fuser.nAmici);
            fuser.amici.forEach(friend => {
                friendsSetter(friend, "friendsUL")
            });

            $("#nfollowers").html("" + fuser.nSeguaci);
            fuser.seguaci.forEach(friend => {
                friendsSetter(friend, "followersUL")
            });

            $("#nfollowed").html("" + fuser.nSeguiti);
            fuser.seguiti.forEach(friend => {
                friendsSetter(friend, "followedUL")
            });
        }
    })
});

function friendsSetter(friend, ULName) {
    if(friend.imgProfilo == undefined || friend.imgProfilo == "" || friend.imgProfilo == "") 
        friend.imgProfilo = "images\\profilesCovers\\dog.svg"

    let img = document.createElement('img');
    img.className += "listIcon";
    img.setAttribute('src', friend.imgProfilo)

    let a = document.createElement('a');
    a.href = "profile.html?user=" + friend.nome;
    a.id = ULName + friend.nome;

    addUL(ULName, document.getHTML(img) + "&nbsp;" + document.getHTML(a))
    $("#" + a.id).html("" + friend.nome);
}

function checkForUnfollowBtn(array) {
    
    if (username == sessionUsername) {
        return;
    }
    array.forEach(friend => {
        if (friend.nome == sessionUsername) {
            $("#followBtn").hide();
            $("#unfollowBtn").show();
            return;
        }
    });
}

function getPCard(id, name, description, imgLink, author) {

    //  Truncate strings that exceeds the max length
    var descMaxLength = 32;
    if (description.length > descMaxLength) {
        description = description.substring(0, descMaxLength) + "...";
    }

    //  Personalized info in own profile
    author = author != sessionUsername ? author : "te";

    //  Returns the formatted HTML
    return `<div class="card mb-3 mx-auto singleCard"> <div class="row no-gutters"> <div class="col-md-4">` +
        `<img src="${imgLink}" id="cardImg"> </div> <div class="col-md-8"> <div class="card-body"> <h5 class="card-title">${name}</h5> ` +
        `<p class="card-text">${description}</p><p class="card-text">` +
        `<button onclick='saveAlbum(${id})' class='btn btn-primary'> <i class="fa fa-plus"></i> Aggiungi ai tuoi Albums</button>` +
        `<button data-toggle="modal" data-target="#exampleModal" onclick='albumPreview(${id})' class='btn btn-secondary ml-1'><i class="fa fa-pencil"></i> Anteprima</button>` +
        `</p> <p class="card-text text-secondary">Creato da ${author}</p> </div> </div> </div> </div>`;
}

//  Adapt the page depending on the user
function checkLocalProfile() {
    if (username != sessionUsername) {
        $("#followBtn").show();
        $("#messageBtn").show();
    }
    else{
        $("#editBtn").show();
        setProfileImages();
        $("#name").val(user.nome);
        $("#motto").val(user.motto);
    }
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
    img.addEventListener('load', function () {
        var vibrant = new Vibrant(img);
        var swatches = vibrant.swatches()
        document.getElementById("coverImg").style.background = swatches["Vibrant"].getHex();
    });
}

function changeIcon(dir, filename) {
    document.getElementById('currentIcon').src = dir + filename;
}

function addUL(parent, str) {
    var ul = document.getElementById(parent);
    var li = document.createElement("li");
    $(li).addClass("list-group-item d-flex align-items-left");
    $(li).html(str);
    ul.appendChild(li);
}

function follow(user) {
    $.ajax({
        type: "POST",
        url: "PHP/followPerson.php",
        data: { 'username': user },
        success: function () {
            location.reload();
        }
    })
}

function unfollow(user) {
    $.ajax({
        type: "POST",
        url: "PHP/unfollowPerson.php",
        data: { 'username': user },
        success: function () {
            location.reload();
        }
    })
}

$("#modifyUser").submit(function (e) {
    e.preventDefault();
    var form = $(this);
    var url = form.attr('action');
    $("#imgLink").val(document.getElementById("currentIcon").src);

    if ($("#psw1").val() != $("#psw2").val()) {
        editAlert("Le due nuove password non combaciano")
        return;
    }

    $.ajax({
        type: "POST",
        url: url,
        data: form.serialize(),
        success: function (data) {
            console.log(data)
            if (data.trim() == "wrongPassword") {
                editAlert("La password inserita è incorretta")
                return;
            }
            window.location.reload();
        }
    });
});

function editAlert(str) {
    $("#editAlert").html(str)
    $("#editAlert").show()
}

document.getHTML = function (who, deep) {
    if (!who || !who.tagName) return '';
    var txt, ax, el = document.createElement("div");
    el.appendChild(who.cloneNode(false));
    txt = el.innerHTML;
    if (deep) {
        ax = txt.indexOf('>') + 1;
        txt = txt.substring(0, ax) + who.innerHTML + txt.substring(ax);
    }
    el = null;
    return txt;
}