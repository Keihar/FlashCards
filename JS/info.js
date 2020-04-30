$(document).ready(function() {
    $.ajax({
        type: "POST",
        url: "PHP/contactUs.php",
        data: "",
        success: function (data) {
            if (data == "success") {
                console.log("Contact request sent successfully")
            } 
            else {
                console.error(data);
            }
        }
    });
});