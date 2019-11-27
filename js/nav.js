document.addEventListener("DOMContentLoaded", function() {
  const elems = document.querySelector(".sidenav");
  M.Sidenav.init(elems);
  loadNav();

  var page = window.location.hash.substr(1);
  window.onhashchange = function() {
    this.console.log("Validated");
    validatePage(page);
  };

  validatePage(page);

  function loadNav() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4) {
        if (this.status != 200) return;

        document.querySelectorAll(".topnav, .sidenav").forEach(function(elm) {
          elm.innerHTML = xhttp.responseText;
        });

        document
          .querySelectorAll(".sidenav a, .topnav a")
          .forEach(function(elm) {
            elm.addEventListener("click", function(event) {
              var sidenav = document.querySelector(".sidenav");
              M.Sidenav.getInstance(sidenav).close();

              page = event.target.getAttribute("href").substr(1);
              loadPage(page);
            });
          });
      }
    };

    xhttp.open("GET", "nav.html", true);
    xhttp.send();
  }

  function loadPage(page) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4) {
        var content = document.querySelector("#body-content");
        if (this.status == 200) {
          content.innerHTML = xhttp.responseText;
          loadApi(page);
        } else if (this.status == 404) {
          content.innerHTML = "<p> Halaman tidak ditemukan </p>";
        } else {
          content.innerHTML = "<p> Ups.. halaman tidak dapat diakses </p>";
        }
      }
    };
    xhttp.open("GET", "pages/" + page + ".html", true);
    xhttp.send();
  }

  function validatePage(page) {
    if (page === ""){
      page = "home"
    }else if (page === "matches") {
      loadTab(page);
    } else {
      document.getElementById("tab").innerHTML = "";
    }

    loadPage(page);
    // loadApi(page);
  }

  function loadTab(page) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4) {
        var content = document.querySelector("#tab");
        if (this.status == 200) {
          content.innerHTML = xhttp.responseText;
          var tabs = document.querySelector("ul.tabs");
          M.Tabs.init(tabs);
          toggleTab();
        } else if (this.status == 404) {
          content.innerHTML = "<p> Halaman tidak ditemukan </p>";
        } else {
          content.innerHTML = "<p> Ups.. halaman tidak dapat diakses </p>";
        }
      }
    };
    xhttp.open("GET", "pages/tabs/" + page + ".html", true);
    xhttp.send();
  }
});

function toggleTab() {
  var link = document.querySelectorAll(".tabs .tab a");
  link[0].addEventListener("click", function() {
    document.getElementById("upcoming").setAttribute("class", "active");
    document.getElementById("upcoming").setAttribute("style", "display: block");
    document.getElementById("finished").setAttribute("style", "display: none");
  });
  link[1].addEventListener("click", function() {
    document.getElementById("finished").setAttribute("class", "active");
    document.getElementById("finished").setAttribute("style", "display: block");
    document.getElementById("upcoming").setAttribute("style", "display: none");
  });
}

function loadApi(page) {
  switch (page) {
    case "players":
      getPlayers();
      break;
    case "matches":
      getUpcomingMatches();
      getFinishedMatches();
      break;
    case "favorites":
      getFavoritePlayers();
      break;
    default:
      break;
  }
}
