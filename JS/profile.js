const username = (getUrlVars()["user"]);
let profileJson;
$(document).ready(function () {
    $("#editAlert").hide()
    $("#unfollowBtn").hide()
    $.ajax({
        type: "POST",
        url: "PHP/json.php",
        data: { 'username': username },
        success: function (data) {
            try { profileJson = JSON.parse(data) } 
            catch (error) { console.error("Errore nell'ottenimento del profilo") }

            console.table(user);

            // Set Username
            if(user.imgProfilo == undefined || profileJson.imgProfilo == "" || profileJson.imgProfilo == "")
                profileJson.imgProfilo = "images\\profilesCovers\\dog.svg"
            
            $("#profileImage").attr('src', profileJson.imgProfilo);
            $("#currentIcon").attr('src', profileJson.imgProfilo);
            setBackground();

            $("#userCardName").html("" + profileJson.nome);
            $("#mottoCardName").html(`"${profileJson.motto}"`);
            $("#nalbum").html(profileJson.nalbum);
            $("#nflashcard").html(profileJson.nflashcard);

            $("#followBtn").click(function () { follow(profileJson.nome) });
            $("#unfollowBtn").click(function () { unfollow(profileJson.nome) });

            let row = document.getElementById("userCards");
            profileJson.albums.forEach(album => {
                if (album.imgLink == null)
                    album.imgLink = "images\\albumCovers\\000-icon.svg";
                row.innerHTML += "" + getPCard(album.id, album.nome, album.descrizione,
                    album.imgLink, username, profileJson.albums);
            });

            checkLocalProfile();
            markBtns(user.salvati);
        }
    })

    $.ajax({
        type: "POST",
        url: "PHP/getFriends.php",
        data: { 'username': username },
        success: function (data) {
            try { friendsJson = JSON.parse(data) } 
            catch (error) { console.error("Errore nell'ottenimento degli amici")}

            checkForUnfollowBtn(friendsJson.seguaci);

            $("#nfriends").html("" + friendsJson.nAmici);
            friendsJson.amici.forEach(friend => {
                friendsSetter(friend, "friendsUL")
            });

            $("#nfollowers").html("" + friendsJson.nSeguaci);
            friendsJson.seguaci.forEach(friend => {
                friendsSetter(friend, "followersUL")
            });

            $("#nfollowed").html("" + friendsJson.nSeguiti);
            friendsJson.seguiti.forEach(friend => {
                friendsSetter(friend, "followedUL")
            });

            markBtns();
            hideBtns();
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
        `<button onclick='saveAlbum(${id},"${author}")' id="btn${id}" class='btn btn-primary'>Aggiungi ai tuoi Album</button>` +
        `<button onclick='saveAlbum(${id},"${author}")' id="nbtn${id}" class='btn btn-outline-primary' style="display:none;">Aggiunto ai tuoi Album</button>` +
        `<button data-toggle="modal" data-target="#previewModal" onclick='albumPreview(${id}, user.albums)' class='btn btn-secondary ml-1'>Anteprima</button>` +
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
            $("#followBtn").hide();
            $("#unfollowBtn").show();
        }
    })
}

function unfollow(user) {
    $.ajax({
        type: "POST",
        url: "PHP/unfollowPerson.php",
        data: { 'username': user },
        success: function () {
            $("#unfollowBtn").hide();
            $("#followBtn").show();
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
            window.location.href = "profile.html?user=" + $("#name").val();
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

function hideBtns() {
    if (username == sessionUsername)
        $('.card').find('button').hide();
}