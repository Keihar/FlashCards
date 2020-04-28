$(document).ready(function() {
  $("#loginForm").submit(function (e) {
    let emailAlert = document.getElementById("alertBox");
    e.preventDefault();
    var form = $(this);
    var url = form.attr('action');

    $.ajax({
      type: "POST",
      url: url,
      data: form.serialize(),
      success: function (data) {
        console.log(data)
        if (data != "success") {
          emailAlert.innerHTML += `<div class="alert alert-danger" role="alert">
          Email o password incorrette
          <button type="button" class="close" aria-label="Close" data-dismiss="alert">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>`
        } 
        else {
          window.location.href = "dashboard.html";
        }
      }
    });
  });
});
