const username = (getUrlVars()["user"]);
let profileJson;

$(document).ready(function () {
    console.time("Profile Charging");
    $.ajax({
        type: "POST",
        url: "PHP/json.php",
        data: { 'username': username },
        success: function (data) {
            try { profileJson = JSON.parse(data); user = JSON.parse(data); }
            catch (error) { console.error("Errore nell'ottenimento del profilo"); return; }

            console.log("%cProfile JSON", 'background: #222; color: lime')
            console.table(profileJson);
            getFriends();

            if (profileJson.imgProfilo == undefined || profileJson.imgProfilo == "")
                profileJson.imgProfilo = "images\\profilesCovers\\dog.svg"
            $("#profileImage").attr('src', profileJson.imgProfilo);
            $("#currentIcon").attr('src', profileJson.imgProfilo);
            setBackground();

            $("#userCardName").html("" + profileJson.nome);
            $("#mottoCardName").html(`"${profileJson.motto}"`);
            $("#nalbum").html(profileJson.nalbum);
            $("#nflashcard").html(profileJson.nflashcard);

            let row = document.getElementById("userCards");
            profileJson.albums.forEach(album => {
                if (album.imgLink == null)
                    album.imgLink = "images\\albumCovers\\000-icon.svg";
                row.innerHTML += "" + getPCard(album.id, album.nome, album.descrizione,
                    album.imgLink, username, profileJson.albums);
            });
            
            
            markBtns(profileJson.salvati);
            checkLocalProfile();
        }
    })

    $("#modifyUser").submit(function (e) {
        e.preventDefault();
        var form = $(this);
        var url = form.attr('action');
        $("#imgLink").val(document.getElementById("currentIcon").src);

        if ($("#psw1").val() != $("#psw2").val()) {
            $("#psw1").addClass("is-invalid");
            $("#psw2").addClass("is-invalid");
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
                    $("#password").addClass("is-invalid");
                    editAlert("La password inserita è incorretta")
                    return;
                }
                window.location.reload();
            }
        });
    });
});