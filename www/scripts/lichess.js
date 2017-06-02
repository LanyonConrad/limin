// This file implements the Lichess API
gamify = 0;
// looks for onGame in the users games
function lichessOnGame() {
    console.log("lichessOnGame called");
    window.games = JSON.parse(superdd).nowPlaying;

    document.getElementById("gameList").innerHTML = "";

    for (var i = 0; i < games.length; i++) {
        id = games[i].fullId;
        $("#gameList").append("<div onclick='if(socket !=null) socket.close(); openGame(\"" + id + "\"," + i + ")' id='" + games[i].gameId + "' data-gameid='" + games[i].fullId + "' style='width: 100%; margin: auto; background-color:transparent; text-align: center; overflow: hidden'><p style='color: #ffffff; text-shadow: none'>" + games[i].opponent.username + " /" + games[i].gameId + "</p></div>");

    }
    $("#gameList").append("<div onclick='launchApp()' style='width: 100%; margin: auto; background-color:transparent; text-align: center; overflow: hidden'><p style='color: #ffffff; text-shadow: none'>Open lichess App</p></div>");
    // so if it looped through all unsuccessfully, if successful it would make gamify 101
    if (gamify == games.length) {
        console.log("You're not on a game!");
        gamify = 0;
        //if (foreground)
        //    launchApp();
    }
    else if (gamify < games.length)
        tryy(games[gamify].fullId);
    else
        gamify = 0;










}

function openGame(id,i) {
    
    if (socket != null) {
        
        setTimeout(function () { openGame(id, i) }, 250);
        return false;
    }




    // ---------------- Store Game Info ----------------- //

    var xhttp = new XMLHttpRequest();
    var url = "https://en.lichess.org/" + id;
    var bustCache = '?' + new Date().getTime();
    xhttp.open("GET", url + bustCache, true);


    xhttp.setRequestHeader("Accept", "application/vnd.lichess.v1+json");
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {

            gameInfo = JSON.parse(xhttp.responseText);

            console.log("Active Game Found!");
            console.log("ongame with " + games[i].fullId);
            var writeTargetInit;
            if (games[i].lastMove != "")
                writeTargetInit = squares.indexOf(games[i].lastMove.slice(2, 4));
            else lastMove = null;
            var data = new Uint8Array(1);
            data[0] = writeTargetInit;
            ble.write(device_id, service_id, characteristic_id, data.buffer);
            window.currentGame = games[i].fullId;

            gameConnect(gameInfo);




        }
    };
    xhttp.send();

    // -------------------------------------------------- //

}


function tryy(id) {

    if (socket != null) {

        setTimeout(function () { tryy(id) }, 250);
        return false;
    }

    // ---------------- Store Game Info ----------------- //

    var xhttp = new XMLHttpRequest();
    var url = "https://en.lichess.org/" + id;
    var bustCache = '?' + new Date().getTime();
    xhttp.open("GET", url + bustCache, true);


    xhttp.setRequestHeader("Accept", "application/vnd.lichess.v1+json");
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {

            gameInfo = JSON.parse(xhttp.responseText);
            if (gameInfo.player.onGame) {
                console.log("Active Game Found!");
                console.log("ongame with " + games[gamify].fullId);
                var writeTargetInit;
                if (games[gamify].lastMove != "")
                    writeTargetInit = squares.indexOf(games[gamify].lastMove.slice(2, 4));
                else lastMove = null;
                var data = new Uint8Array(1);
                data[0] = writeTargetInit;
                ble.write(device_id, service_id, characteristic_id, data.buffer);
                window.currentGame = games[gamify].fullId;
                gamify = 100;
                //launchApp();

                gameConnect(gameInfo);

            }
            else
                console.log("not ongame with " + games[gamify].fullId);


            gamify++;
            lichessOnGame();

        }
    };
    xhttp.send();

    // -------------------------------------------------- //

}

function loadLobbySocket() {
    clientId = Math.random().toString(36).substring(2);
    var socketUrl = 'wss://socket.lichess.org/socket?sri=' + clientId;

    window.lobbySocket = new WebSocket(socketUrl);

    lobbySocket.onopen = function () {

        window.pinger = setInterval(function () {

            ping();

        }, 2000);

    };

    lobbySocket.onmessage = function (event) {


        console.log(event.data);

        var eventData = JSON.parse(event.data);

        if (eventData.hasOwnProperty("t")) {
            if (eventData.t == "following_onlines") {
                if (socket != null)
                    socket.close();
                lichessLogin();

            }
        }
    };

    lobbySocket.onerror = function () {
        console.log('error occurred!');
    };

    lobbySocket.onclose = function (event) {
        clearInterval(pinger);
        pinger = null;
        clearInterval(writer);
        writeSource = null;
        writeTarget = null;
        console.log("lobbySocketClosed!");
        if (socket != null)
            socket.close();


        document.getElementById("connectInfo").style.display = "initial";
        document.getElementById("logoutInfo").style.display = "none";
        document.getElementById("connectedInfo").style.display = "none";


        lobbySocket = null;

    };

}

lobbySocket = null;

// Login to Lichess
function lichessLogin() {

    console.log("lichessLogin called");

    var xhttp = new XMLHttpRequest();
    var url = "https://en.lichess.org/login";
    var bustCache = '?' + new Date().getTime();
    var params = "username=" + $('#user').val() + "&password=" + $('#password').val();
    xhttp.open("POST", url + bustCache, true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    // send the proper header information along with the request
    xhttp.setRequestHeader("Accept", "application/vnd.lichess.v1+json");
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {

            console.log(xhttp.responseText);
            document.getElementById("loginInfo").style.display = "none";
            document.getElementById("connectInfo").style.display = "none";
            document.getElementById("logoutInfo").style.display = "initial";
            document.getElementById("connectedInfo").style.display = "initial";
            document.getElementById("username").innerText = JSON.parse(xhttp.responseText).username;

            if (lobbySocket == null)
                loadLobbySocket();

            superdd = xhttp.responseText;

            console.log("Searching for Active Game...");
            lichessOnGame();
        }
        else if (this.readyState == 4 && this.status != 200)
            document.getElementById('loginInfo').style.display = 'initial';
    };
    xhttp.send(params);
}

// Logout from Lichess
function lichessLogout() {
    var xhttp = new XMLHttpRequest();
    var url = "https://en.lichess.org/logout";
    xhttp.open("GET", url, true);

    // send the proper header information along with the request
    xhttp.setRequestHeader("Accept", "application/vnd.lichess.v1+json");
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log(xhttp.responseText);
            $('#user').val("");

        }
    };
    xhttp.send();
}

function createMachineGame() {
    console.log("game with machine requested");
}

function createOTBGame() {
    console.log("otb game requested");
}

writer = null;

pinger = null;

lastMove = null;

latestMove = null;

version = 0;

function gameConnect(gameInfo) {




    version = 0;

    window.gameId = gameInfo.game.id;

    

    console.log("connecting to game " + gameId);

    console.log("Connecting to Game " + gameId + "...");

    dests = gameInfo.possibleMoves;

    player = gameInfo.game.player;
    myColor = gameInfo.player.color;

    var baseUrl = gameInfo.url.socket; // obtained from game creation API (`url.socket`)
    clientId = Math.random().toString(36).substring(2); // created and stored by the client

    var socketUrl = 'wss://socket.lichess.org' + baseUrl + '?sri=' + clientId;

    window.awaitingAck = false;

    window.sentMove = null;

    window.socket = new WebSocket(socketUrl);

    socket.onopen = function () {

        console.log("Connected to " + gameId);

        
        document.getElementById(gameId).style.backgroundColor = "#86f442";

        latestMove = null;

    };

    socket.onmessage = function (event) {


        console.log(event.data);

        if (event.data.includes("end"))
            socket.close();

        var eventData = JSON.parse(event.data);

        if (eventData.hasOwnProperty("t")) {
            if (eventData.t == "b") {
                for (var i = 0; i < eventData.d.length; i++)
                    digestMSG(eventData.d[i]);
            }
            else
                digestMSG(eventData);
        }
    };

    socket.onerror = function () {
        console.log('error occurred!');
    };

    socket.onclose = function (event) {

        socket = null;

        console.log("socketClosed!");

        clearInterval(writer);

        writeSource = null;
        writeTarget = null;

        for (var j = 0; j < games.length; j++) {
            document.getElementById(games[j].gameId).style.backgroundColor = "transparent";
        }

    };

    try {
        syncFEN();
    }
    catch (err) {
    }


}




let dests = new Object();

var writeSource;
var writeTarget;

var squares = ["a1", "b1", "c1", "d1", "e1", "f1", "g1", "h1",
                "a2", "b2", "c2", "d2", "e2", "f2", "g2", "h2",
                "a3", "b3", "c3", "d3", "e3", "f3", "g3", "h3",
                "a4", "b4", "c4", "d4", "e4", "f4", "g4", "h4",
                "a5", "b5", "c5", "d5", "e5", "f5", "g5", "h5",
                "a6", "b6", "c6", "d6", "e6", "f6", "g6", "h6",
                "a7", "b7", "c7", "d7", "e7", "f7", "g7", "h7",
                "a8", "b8", "c8", "d8", "e8", "f8", "g8", "h8", ];

var data2 = new Uint8Array(1);

var lightLED = function () {
    if (data2[0] == writeSource)
        data2[0] = writeTarget;
    else
        data2[0] = writeSource;
    //console.log("I should be writing " + data2[0] + " to: " + device_id + " and service_id: " + service_id + " and with char_id: " + characteristic_id);

    ble.write(device_id, service_id, characteristic_id, data2.buffer);
}

function sendMove(source, target) {

    var move = {
        t: 'move',
        d: {
            from: source,
            to: target
        }
    };

    window.sentMove = source + target;

    sentMove = source + target;

    socket.send(JSON.stringify(move));
    console.log("move sent to lichess!");
    window.awaitingAck = true;

    window.sendSource = null;
    window.sendTarget = null;

}



function syncFEN() {
    var xhttp = new XMLHttpRequest();
    var url = "https://en.lichess.org/" + currentGame;
    xhttp.open("GET", url, true);

    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    // send the proper header information along with the request
    xhttp.setRequestHeader("Accept", "application/vnd.lichess.v1+json");
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var currentFEN = JSON.parse(xhttp.responseText).game.fen;
            version = JSON.parse(xhttp.responseText).player.version;
            console.log(currentFEN);
        }
    };
    xhttp.send();
}

socket = null;

function ping() {

    if (socket != null)
        socket.send(JSON.stringify({
            t: 'p',
            v: version
        }));



    lobbySocket.send(JSON.stringify({
        t: 'p',
    }));

    console.log(JSON.stringify({
        t: 'p',
        v: version
    }));

}

function digestMSG(eventData) {

    if (eventData.t != "n") {

        if (awaitingAck && eventData.t != "ack") {
            console.log("resending move...");
            sendMove();
        }
        else if (awaitingAck && eventData.t == "ack") {

            awaitingAck = false;
        }
        if (eventData.t == "resync") {
            console.log("resync message received!");
            syncFEN();

        }
        else if (eventData.t == "move") {

            latestMove = eventData.d.uci;

            dests = eventData.d.dests;

            player = (eventData.d.ply % 2 == 1) ? 'black' : 'white';

        }

        else if (eventData.t == "reload")
            syncFEN();

        if (eventData.hasOwnProperty("v")) {
            version = eventData.v;
        }
        if (latestMove != null)
            if (player == myColor) {

                if (clearInterval(writer)); // make sure cleared before setting
                writer = setInterval(lightLED, 250);

                writeSource = squares.indexOf(latestMove.slice(0, 2));
                writeTarget = squares.indexOf(latestMove.slice(2, 4));
            }
    }

}

function launchApp() {

    if(device.platform == "Android")
    try {
        startApp.set({
            "application": "org.lichess.mobileapp"
        }).start(function () { /* success */
            console.log("launched!");
        }, function (error) { /* fail */
            console.log(error);
        });
    }
    catch (err){}

    if(device.platform == "iOS")
    try{
        startApp.set("lichess://").start(function () { /* success */
            console.log("launched!");
        }, function (error) { /* fail */
            console.log(error);
        });
    }
    catch(err){}

}