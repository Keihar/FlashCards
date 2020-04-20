$.ajax({
    type: "GET",
    url: "PHP/getCurrentAlbum.php",
    data: "",
    success: function (data) {
      console.log("LA sessione è la" + data);
    }
  });