var bodyParser = require("body-parser");
const express = require('express'); //express framework to have a higher level of methods
const app = express(); //assign app variable the express class/method
var http = require('http');
var path = require("path");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const server = http.createServer(app);//create a server
//***************this snippet gets the local ip of the node.js server. copy this ip to the client side code and add ':3000' *****
//****************exmpl. 192.168.56.1---> var sock =new WebSocket("ws://192.168.56.1:3000");*************************************
require('dns').lookup(require('os').hostname(), function (err, add, fam) {
    console.log('addr: '+add);
})
/**********************websocket setup**************************************************************************************/
//var expressWs = require('express-ws')(app,server);
const WebSocket = require('ws');
const s = new WebSocket.Server({ server });
/*********************************************GAME CLASS **************************************************/
class Game  //Création de la class game qui contrôle la boucle du jeu
{
    GameLaunch;
    randEsp;
    randLed;
    numberButtonPressed;
    timer;

    constructor()
    {
        this.GameLaunch = false;
    }

    getGameLaunch()
    {
        return this.GameLaunch;
    }

    getRandEsp()
    {
        return this.randEsp;
    }

    getRandLed()
    {
        return this.randLed;
    }

    #getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }

    cutTimer()
    {
        clearTimeout(this.timer);
        this.numberButtonPressed = this.numberButtonPressed + 1;
        var request = '{type = "server", esp = ' + this.randEsp + ', led = ' + this.randLed+ ', action = 0}';
        sendMessage(request)
        if(this.numberButtonPressed == 10)
        {
            this.#endGameGagne();
        }
        else
        {
            this.#loopGame();
        }
    }

    startGame()
    {
        console.log("La partie se lance");
        this.GameLaunch = true;
        this.numberButtonPressed = 0;
        this.#loopGame();
    }

    endGameLose()
    {
        console.log("Vous avez perdu !");
        this.GameLaunch = false;
        var request = '{type = "server", esp = ' + this.randEsp + ', led = ' + this.randLed+ ', action = 0}';
        sendMessage(request)
    }

    #endGameGagne()
    {
        console.log("Vous avez gagne !")
        this.GameLaunch = false;
    }

    #loopGame()
    {
        this.randEsp = this.#getRandomInt(nbEsp) + 1;
        this.randLed = this.#getRandomInt(2) + 1;
        var request = '{type = "server", esp = ' + this.randEsp + ', led = ' + this.randLed+ ', action = 1}';
        sendMessage(request)
        this.timer = setTimeout(function() {game.endGameLose()}, 5000);
    }
}

function sendMessage(message)
{
    s.clients.forEach(function(client){ //broadcast incoming message to all clients (s.clients)
        client.send(message)
    });
}
//CREATE GAME
var game = new Game();
//NE PAS OUBLIER D'ACTUALISER LE NOMBRE D'ESP
var nbEsp = 1;
//when browser sends get request, send html file to browser
// viewed at http://localhost:3000
app.get('/', function(req, res) {
    console.log('Hello world');
});
//*************************************************************************************************************************
//***************************ws chat server********************************************************************************
//app.ws('/echo', function(ws, req) {
s.on('connection',function(ws,req){ //WHEN CLIENT CONNECT TO SERVER
/******* when server receives messsage from client trigger function with argument message *****/
    ws.on('message', function(message){
        console.log("Received: "+message);
        /*s.clients.forEach(function(client){ //broadcast incoming message to all clients (s.clients)
            if(client!=ws && client.readyState ){ //except to the same client (ws) that sent this message
                client.send("broadcast: " +message);
            }
        });*/
        const messageJson = JSON.parse(message);
        if(messageJson.type == "esp")
        {
            /*if(messageJson.game == 0 && !game.GameLaunch())
            {
                if()
                {

                }
            }
            else if(messageJson.game == 1 && game.GameLaunch())
            {

            }*/
        }
        else if(messageJson.type == "web")
        {

        }
// ws.send("From Server only to sender: "+ message); //send to client where message is from
    });

    ws.on('close', function(){
        console.log("lost one client");
    });

//ws.send("new client connected");
    console.log("new client connected");
});

server.listen(3000);
