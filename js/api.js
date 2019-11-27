var base_url = "https://api.football-data.org/v2/";
var progressBar = document.querySelector(".progress");
function status(response) {
  if (response.status !== 200) {
    console.log("Error: " + response.status);
    console.log("Error: " + response.message);

    return Promise.reject(new Error(response.error));
  } else {
    return Promise.resolve(response);
  }
}

function json(response) {
  return response.json();
}

function error(error) {
  console.log("Error: " + error);
}

function convertDate(date, withTime) {
  date = new Date(date);
  year = date.getFullYear();
  month = date.getMonth() + 1;
  dt = date.getDate();
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ];

  if (withTime) {
    var dateTime = new Date(
      year +
        "-" +
        month +
        "-" +
        dt +
        " " +
        date.getHours() +
        ":" +
        date.getMinutes() +
        ":" +
        date.getSeconds()
    );
    return (
      monthNames[dateTime.getMonth()] +
      " " +
      dateTime.getDate() +
      " " +
      dateTime.getFullYear() +
      " | " +
      dateTime.getHours() +
      ":" +
      dateTime.getMinutes()
    );
  } else {
    return monthNames[month] + " " + dt + " " + year;
  }
}

function filterPlayer(filter, response) {
  return response.squad.filter(a => a.position == filter);
}

function iteratePlayers(data, id, index) {
  var playersHTML = "";
  var position = index;
  data.forEach(function(player) {
    playersHTML += `
    <div class="col s12 m6 l4">
        <div class="card responsive-img">
            <div class="card-image waves-effect waves-block waves-light">
                <img class="activator jersey" src="${
                  player.position === "Goalkeeper"
                    ? "src/images/jerseys/manutd-goalkeeper-home.webp"
                    : "src/images/jerseys/manutd-home.webp"
                }" />
            </div>
            <div class="card-content">
                <h5 class="subheading grey-text bold">${
                  player.shirtNumber !== null ? player.shirtNumber : 0
                }</h5>
                <span class="card-title grey-text text-darken-4 truncate">
                ${player.name}
                <i class="material-icons right favorite red-text" id="favorite-${position}" onclick="toggleFavoritePlayer('${
      player.position
    }', '${player.shirtNumber}', '${player.name}', '${player.nationality}', '${
      player.countryOfBirth
    }', '${player.dateOfBirth}', 'favorite-${position}')">favorite_border</i>
                <i class="material-icons right hide-on-med-and-down activator">more_vert</i>
                </span>
            </div>
            <div class="card-reveal">
                <span class="card-title grey-text text-darken-4">${
                  player.name
                }<i class="material-icons right">close</i></span>
                <blockquote>
                <span>Fullname: </span>
                <span><b>${player.name}</b></span>
                </blockquote>
                <blockquote>
                <span>Nationality: </span>
                <span><b>${player.nationality}</b></span>
                </blockquote>
                <blockquote>
                <span>Date of Birth: </span>
                <span><b> ${player.countryOfBirth}, ${convertDate(
      player.dateOfBirth,
      false
    )}</b></span>
                </blockquote>
            </div>
        </div>
    </div>`;
    position++;
    return (document.getElementById(id).innerHTML = playersHTML);
  });
}

function iterateFavoritePlayers(data, id) {
  var playersHTML = "";
  if (data.length > 0) {
    document.getElementById("no-data").setAttribute("style", "display: none");
    data.forEach(function(player) {
      playersHTML += `
    <div class="col s12 m6 l4">
        <div class="card responsive-img">
            <div class="card-image waves-effect waves-block waves-light">
                <img class="activator jersey" src="${
                  player.position === "Goalkeeper"
                    ? "src/images/jerseys/manutd-goalkeeper-home.webp"
                    : "src/images/jerseys/manutd-home.webp"
                }" />
            </div>
            <div class="card-content">
                <h5 class="subheading grey-text bold">${
                  player.shirtNumber !== null ? player.shirtNumber : 0
                }</h5>
                <span class="card-title grey-text text-darken-4 truncate">
                ${player.name}
                <i class="material-icons right favorite red-text" id="favorite-${
                  player.id
                }" onclick="deleteFavoritePlayer(${player.id})">favorite</i>
                <i class="material-icons right hide-on-med-and-down activator">more_vert</i>
                </span>
            </div>
            <div class="card-reveal">
                <span class="card-title grey-text text-darken-4">${
                  player.name
                }<i class="material-icons right">close</i></span>
                <blockquote>
                <span>Fullname: </span>
                <span><b>${player.name}</b></span>
                </blockquote>
                <blockquote>
                <span>Nationality: </span>
                <span><b>${player.nationality}</b></span>
                </blockquote>
                <blockquote>
                <span>Date of Birth: </span>
                <span><b> ${player.countryOfBirth}, ${convertDate(
        player.dateOfBirth,
        false
      )}</b></span>
                </blockquote>
            </div>
        </div>
    </div>`;
      return (document.getElementById(id).innerHTML = playersHTML);
    });
  } else {
    document.getElementById("no-data").setAttribute("style", "display: block");
    return (document.getElementById(id).innerHTML = "");
  }
}

function getPlayers() {
  progressBar.setAttribute("style", "display: block");
  if ("caches" in window) {
    caches.match(base_url + "teams/66").then(function(response) {
      if (response) {
        upcoming;
        response.json().then(function(data) {
          var goalKeepers = filterPlayer("Goalkeeper", data);
          var defenders = filterPlayer("Defender", data);
          var midfielders = filterPlayer("Midfielder", data);
          var attackers = filterPlayer("Attacker", data);

          iteratePlayers(goalKeepers, "goal-keepers", 0);
          iteratePlayers(defenders, "defenders", goalKeepers.length);
          iteratePlayers(
            midfielders,
            "midfielders",
            goalKeepers.length + defenders.length
          );
          iteratePlayers(
            attackers,
            "attackers",
            goalKeepers.length + defenders.length + midfielders.length
          );
          progressBar.setAttribute("style", "display: none");
        });
      }
    });
  }

  var request = new Request(base_url + "teams/66", {
    headers: new Headers({
      "X-Auth-Token": "38fcd73e5f814b95911042c012e2126b"
    })
  });

  fetch(request)
    .then(status)
    .then(json)
    .then(function(data) {
      var goalKeepers = filterPlayer("Goalkeeper", data);
      var defenders = filterPlayer("Defender", data);
      var midfielders = filterPlayer("Midfielder", data);
      var attackers = filterPlayer("Attacker", data);

      iteratePlayers(goalKeepers, "goal-keepers", 0);
      iteratePlayers(defenders, "defenders", goalKeepers.length);
      iteratePlayers(
        midfielders,
        "midfielders",
        goalKeepers.length + defenders.length
      );
      iteratePlayers(
        attackers,
        "attackers",
        goalKeepers.length + defenders.length + midfielders.length
      );
      progressBar.setAttribute("style", "display: none");
    })
    .catch(function(error) {
      console.log(error);
      progressBar.setAttribute("style", "display: none");
    });
}

function iterateMatches(data, id) {
  var matchesHTML = "";

  data.forEach(function(match) {
    if (id === "upcoming-matches") {
      matchesHTML += `
        <li>
        <div class="collapsible-header">
          <div class="row">
            <div class="col s12 center-align">
              <i class="material-icons">sports_soccer</i>
              <span class="icon-side">${match.competition.name} : Matchday ${
        match.matchday
      }</span>
            </div>
            <h5 class="col m4 s12 center-align">${match.homeTeam.name}</h5>
            <h5 class="col m1 offset-s4"></h5>
            <h5 class="col m2 center-align">vs</h5>
            <h5 class="col m1"></h5>
            <h5 class="col m4 s12 center-align">${match.awayTeam.name}</h5>
          </div>
        </div>
        <div class="collapsible-body">
          <p class="subheading center-align grey-text">Date</p>
          <div class="divider"></div>
          <p class="subheading center-align">${convertDate(
            match.utcDate,
            true
          )}</p>
          <div class="divider"></div>
        </div>
      </li>`;
    } else {
      matchesHTML += `<li>
      <div class="collapsible-header">
        <div class="row">
          <div class="col s12 center-align">
            <i class="material-icons">sports_soccer</i>
            <span class="icon-side">${match.competition.name} : Matchday ${
        match.matchday
      }</span>
          </div>
          <h5 class="col m4 s12 center-align ${
            match.score.fullTime.homeTeam > match.score.fullTime.awayTeam
              ? "text-bold"
              : ""
          }">${match.homeTeam.name}</h5>
          <h5 class="col m1 offset-s4 ${
            match.score.fullTime.homeTeam > match.score.fullTime.awayTeam
              ? "text-bold"
              : ""
          }">${match.score.fullTime.homeTeam}</h5>
          <h5 class="col m2 center-align">:</h5>
          <h5 class="col m1 ${
            match.score.fullTime.homeTeam < match.score.fullTime.awayTeam
              ? "text-bold"
              : ""
          }">${match.score.fullTime.awayTeam}</h5>
          <h5 class="col m4 s12 center-align ${
            match.score.fullTime.homeTeam < match.score.fullTime.awayTeam
              ? "text-bold"
              : ""
          }">${match.awayTeam.name}</h5>
        </div>
      </div>
      <div class="collapsible-body">
        <p class="subheading center-align grey-text">First Half</p>
        <div class="divider"></div>
        <p class="subheading center-align">${match.score.halfTime.homeTeam} : ${
        match.score.halfTime.awayTeam
      }</p>
        <div class="divider"></div>
        <p class="subheading center-align grey-text">Referees</p>
        <div class="divider"></div>
        <div class="row">
          <p class="col m3 s6 center-align">
            <i class="material-icons">emoji_people</i> 
            ${match.referees[0].name !== null ? match.referees[0].name : "-"}
          </p>
          <p class="col m3 s6 center-align">
            <i class="material-icons">flag</i> 
            ${match.referees[1].name !== null ? match.referees[0].name : "-"}
          </p>
          <p class="col m3 s6 center-align">
            <i class="material-icons">flag</i> 
            ${match.referees[2].name !== null ? match.referees[0].name : "-"}
          </p>
          <p class="col m3 s6 center-align">
            <i class="material-icons">directions_walk</i> 
            ${match.referees[3].name !== null ? match.referees[0].name : "-"}
          </p>
        </div>
      </div>
    </li>`;
    }
    return (document.getElementById(id).innerHTML = matchesHTML);
  });
  var collapsible = document.querySelectorAll(".collapsible");
  M.Collapsible.init(collapsible);
}

function getUpcomingMatches() {
  progressBar.setAttribute("style", "display: block");
  if ("caches" in window) {
    caches
      .match(base_url + "teams/66/matches?status=SCHEDULED")
      .then(function(response) {
        if (response) {
          response.json().then(function(data) {
            iterateMatches(data.matches, "upcoming-matches");
            progressBar.setAttribute("style", "display: none");
          });
        }
      });
  }

  var request = new Request(base_url + "teams/66/matches?status=SCHEDULED", {
    headers: new Headers({
      "X-Auth-Token": "38fcd73e5f814b95911042c012e2126b"
    })
  });
  fetch(request)
    .then(status)
    .then(json)
    .then(function(data) {
      iterateMatches(data.matches, "upcoming-matches");
    })
    .catch(function(error) {
      console.log(error);
    });
}

function getFinishedMatches() {
  if ("caches" in window) {
    caches
      .match(base_url + "teams/66/matches?status=FINISHED")
      .then(function(response) {
        if (response) {
          response.json().then(function(data) {
            iterateMatches(data.matches.reverse(), "finished-matches");
          });
        }
      });
  }
  var request = new Request(base_url + "teams/66/matches?status=FINISHED", {
    headers: new Headers({
      "X-Auth-Token": "38fcd73e5f814b95911042c012e2126b"
    })
  });
  fetch(request)
    .then(status)
    .then(json)
    .then(function(data) {
      iterateMatches(data.matches.reverse(), "finished-matches");
      progressBar.setAttribute("style", "display: none");
    })
    .catch(function(error) {
      console.log(error);
      progressBar.setAttribute("style", "display: none");
    });
}

function toggleFavoritePlayer(
  position,
  shirtNumber,
  fullName,
  nationality,
  countryOfBirth,
  dateOfBirth,
  id
) {
  var icon = document.getElementById(id);
  if (icon.innerHTML === "favorite_border") {
    icon.innerHTML = "favorite";
    addFavoritePlayer(
      position,
      shirtNumber !== "null" ? shirtNumber : 0,
      fullName,
      nationality,
      countryOfBirth,
      dateOfBirth,
      id
    );
  } else {
    icon.innerHTML = "favorite_border";
    var playerId = document.getElementById(id).getAttribute("data-player-id");
    deleteFavoritePlayer(parseInt(playerId));
  }
}
