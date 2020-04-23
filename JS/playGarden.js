//  Local variables
var cards = [];
var currentIndex = 0;
var sessionConcluded = false;

//  Flip
function flip() {
    document.querySelector("#myCard").classList.toggle("flip")
    document.getElementById("backCard").innerHTML = "" + cards[currentIndex].retro;
    $('#nextBtn').prop('disabled', false);
}

//  Next Card
function nextCard() {
    // Remove focus from clicked button
    $('input, textarea, select').focus(function() {
        this.blur();
    });
    // Turns the card if it's currently in the back
    if (document.querySelector("#myCard").classList.contains("flip")) {
        flip();
    }
    // Disables the btn until the card is flipped
    $('#nextBtn').prop('disabled', true);
    currentIndex++;
    //Concludes the session if the cards are finished
    if (currentIndex == cards.length) {
        sessionConcluded = true;
        $('#exampleModal').modal('show');
    }
    document.getElementById("backCard").innerHTML = "";
    document.getElementById("frontCard").innerHTML = "" + cards[currentIndex].fronte;
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

$(document).keypress(function(event) {
    if(event.which == '32') {
        flip();
        return false;
    }
    if(event.which == '13') {
        nextCard();
        return false;
    }
});

