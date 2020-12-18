var dbPromise = idb.open("manutd_app_db", 1, function(upgradeDb) {
  if (!upgradeDb.objectStoreNames.contains("favorite_players")) {
    var players = upgradeDb.createObjectStore("favorite_players", {
      keyPath: "id"
    });
    players.createIndex("position", "position", { unique: false });
    players.createIndex("shirtNumber", "shirtNumber", { unique: false });
    players.createIndex("name", "name", { unique: false });
    players.createIndex("nationality", "nationality", { unique: false });
    players.createIndex("countryOfBirth", "countryOfBirth", {
      unique: false
    });
    players.createIndex("dateOfBirth", "dateOfBirth", { unique: false });
  }
});

function addFavoritePlayer(
  id,
  position,
  shirtNumber,
  name,
  nationality,
  countryOfBirth,
  dateOfBirth,
  elementId
) {
  dbPromise
    .then(function(db) {
      var tx = db.transaction("favorite_players", "readwrite");
      var store = tx.objectStore("favorite_players");
      var item = {
        id: id,
        position: position,
        shirtNumber: shirtNumber,
        name: name,
        nationality: nationality,
        countryOfBirth: countryOfBirth,
        dateOfBirth: dateOfBirth
      };
      return store.put(item);
    })
    .then(function(e) {
      document.getElementById(elementId).setAttribute("data-player-id", e);
      M.toast({ html: "Added to Favorites" });
    })
    .catch(function(error) {
      M.toast({ html: "Error: " + error });
    });
}

function getFavoritePlayers() {
  dbPromise
    .then(function(db) {
      var tx = db.transaction("favorite_players", "readonly");
      var store = tx.objectStore("favorite_players");
      return store.getAll();
    })
    .then(function(players) {
      iterateFavoritePlayers(players, "favorite-players");
    })
    .catch(function(error) {
      console.log(error);
    });
}

function isFavorite(id, elementId) {
  dbPromise
    .then(function(db) {
      var tx = db.transaction("favorite_players", "readonly");
      var store = tx.objectStore("favorite_players");
      return store.get(id);
    })
    .then(function(player) {
      if (player != null) {
        var id = document.getElementById(elementId);
        id.setAttribute("data-player-id", player.id);
        id.innerHTML = "favorite";
      }
    })
    .catch(function(error) {
      console.log(error);
    });
}

function deleteFavoritePlayer(id) {
  dbPromise
    .then(function(db) {
      var tx = db.transaction("favorite_players", "readwrite");
      var store = tx.objectStore("favorite_players");
      store.delete(id);
      return tx.complete;
    })
    .then(function() {
      M.toast({ html: "Deleted from Favorites" });
      getFavoritePlayers();
    })
    .catch(function(error) {
      M.toast({ html: "Error: " + error });
    });
}
