var fuser;
var user;

$(document).ready(function() {
    $.ajax({
        type: "POST",
        url: "PHP/getFriends.php",
        data: {'username' : user.nome},
        success: function (data) {
            console.log(data);
            try { fuser = JSON.parse(data) }
            catch (error) { console.error("Errore nel ricevimento degli amici"); return; }   

            fuser.amici.forEach(friend => {
                let box = $("#suggestedBox").clone();
                $(box).removeClass("d-none");

                $($(box).find("#username")[0]).html(friend.nome);
                $($(box).find("#motto")[0]).html("\"" + friend.motto + "\"");
                $($(box).find("#profile")[0]).attr("src", friend.imgProfilo);
                $($(box).find("#visit")[0]).attr("href", "profile.html?user=" + friend.nome);

                $(box).prependTo("#row");
            });

            $("#spinner").remove();
        }
    });
})