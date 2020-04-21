$("#loginForm").submit(function (e) {
    let emailAlert = document.getElementById("emailHelp");
    e.preventDefault();
    var form = $(this);
    var url = form.attr('action');

    $.ajax({
      type: "POST",
      url: url,
      data: form.serialize(),
      success: function (data) {
        if (data != "success") {
          emailAlert.style.display = "block";
        } 
        else {
          window.location.href = "dashboard.html";
        }
      }
    });
  });