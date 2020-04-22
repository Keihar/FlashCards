var cards = [];
var currentIndex = 0;
var sessionConcluded = false;

function flip() {
    document.querySelector("#myCard").classList.toggle("flip")
    document.getElementById("backCard").innerHTML = "" + cards[currentIndex].retro;
    $('#nextBtn').prop('disabled', false);
}

function nextCard() {
    if (document.querySelector("#myCard").classList.contains("flip")) {
        flip();
    }
    $('#nextBtn').prop('disabled', true);
    currentIndex++;
    if (currentIndex == cards.length) {
        sessionConcluded = true;
        $('#exampleModal').modal('show');
    }
    document.getElementById("backCard").innerHTML = "";
    document.getElementById("frontCard").innerHTML = "" + cards[currentIndex].fronte;
}

function exit() {
    window.location.href = "albumList.html";
}

$(window).on('beforeunload', function () {
    if (!sessionConcluded) { 
        return "Are you sure you want to exit this page?";
    }
});

$(document).ready(function() {
    $.ajax({
        type: "POST",
        url: "PHP/getCurrentAlbum.php",
        data: "",
        success: function (data) {
            console.log(data);
            try {
                let user = JSON.parse(data);
                console.log(user.flashcards[0].fronte);
                cards = user.flashcards;
                document.getElementById("albumTitle").innerHTML = "" + user.nome;
                document.getElementById("frontCard").innerHTML = "" + cards[0].fronte;
            } 
            catch (error) {}
        }
    });
});