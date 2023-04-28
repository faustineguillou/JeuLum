var bodyParser = require("body-parser");
const express = require('express'); //express framework to have a higher level of methods
const app = express(); //assign app variable the express class/method
var http = require('http');
var path = require("path");
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;;
const { send } = require("process");
app.use(express.static(path.join(__dirname, 'public'))); 
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')))
const server = http.createServer(app);//create a server


//***************this snippet gets the local ip of the node.js server. copy this ip to the client side code and add ':3000' *****
//****************exmpl. 192.168.0.100---> var sock =new WebSocket("ws://192.168.0.100:3000");*************************************
require('dns').lookup(require('os').hostname(), function (err, add, fam) {
    console.log('addr: '+add);
})
/**********************websocket setup**************************************************************************************/
//var expressWs = require('express-ws')(app,server);
const WebSocket = require('ws');
const s = new WebSocket.Server({ server });
/*********************************************GAME CLASS **************************************************/
class GameReflex  //Création de la class gameReflex qui contrôle la boucle du jeu
{
    GameLaunch;
    randEsp;
    randLed;
    numberButtonPressed;
    timer;

    //CONSTRUCTEUR DE LA CLASS GAME
    constructor()
    {
        this.GameLaunch = false;
    }

    //GET DE GameLaunch
    getGameLaunch()
    {
        return this.GameLaunch;
    }

    //GET DE randEsp
    getRandEsp()
    {
        return this.randEsp;
    }

    //GET DE randLed
    getRandLed()
    {
        return this.randLed;
    }

    //FONCTION QUI RETURN UN RANDOM ENTRE 0 ET max
    #getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }

    //PERMET DE CLEAR LE TIMER, VERIFIE ENSUITE SI BESOIN DE RELANCER LA MAIN LOOP OU SI JEU TERMINE
    cutTimer()
    {
        clearTimeout(this.timer);
        this.numberButtonPressed = this.numberButtonPressed + 1;
        var request = '{"type" : "server", "for" : "esp", "esp" : ' + this.randEsp + 
            ', "led" : ' + this.randLed+ ', "action" : 0}';
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

    //LANCE LE JEU, SET LE GameLaunch A TRUE ET INIT numberButtonPressed A ZERO, LANCE LA LOOP ENSUITE
    startGame()
    {
        console.log("La partie se lance");
        this.GameLaunch = true;
        this.numberButtonPressed = 0;
        this.#loopGame();
    }

    //SI JAMAIS LA PARTIE EST PERDUE CETTE FONCTION SE LANCE ET VA REINITIALISER LA PARTIE
    endGameLose()
    {
        console.log("Vous avez perdu !");
        this.GameLaunch = false;
        var request = '{"type" : "server", "for" : "esp", "esp" : ' + this.randEsp + 
            ', "led" : ' + this.randLed+ ', "action" : 0}';
        sendMessage(request)
        this.finish()
    }

    //SI JAMAIS LA PARTIE EST GAGNE, FAIS LE CONTRAIRE DE LA FONCTION PERDRE
    #endGameGagne()
    {
        var request = '{"type" : "server", "for" : "esp", "end" : 1}';
        sendMessage(request)
        console.log("Vous avez gagne !")
        this.GameLaunch = false;
        this.finish()
    }

    finish()
    {
        this.GameLaunch = false;
        var request = '{"type" : "server", "for" : "esp", "end" : 1}';
        sendMessage(request)
    }

    //PERMET DE DETERMINER LE RANDESP, RANDLED, ENVOIE LE MESSAGE EN JSON A TOUS LES ESP, SET UN TIMER
    #loopGame()
    {
        this.randEsp = this.#getRandomInt(nbEsp) + 1;
        this.randLed = this.#getRandomInt(2) + 1;
        var request = '{"type" : "server", "for" : "esp", "esp" : ' + this.randEsp + 
            ', "led" : ' + this.randLed+ ', "action" : 1}';
        sendMessage(request)
        this.timer = setTimeout(function() {gameReflex.endGameLose()}, 20000);
    }
}

class GameMemory
{
    listLed;
    GameLaunch;
    timer;
    counter;

    constructor()
    {
        this.listLed = [];
        this.GameLaunch = false;
        this.timer = null;
        this.counter = 0;
    }

    getGameLaunch()
    {
        return this.GameLaunch;
    }

    #getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }

    startGame()
    {
        console.log("La partie se lance");
        this.GameLaunch = true;
        this.#pickRandomLed();
    }

    #pickRandomLed()
    {
        var led = this.#getRandomInt(nbEsp * 2) + 1;
        this.listLed.push(led);
        this.#loopShowLed();
    }

    #loopShowLed()
    {
        var request = '{"type" : "server", "for" : "esp", "led" : ' + this.listLed[this.counter] + ', "action" : 1, "color" : "blue"}';
        sendMessage(request)
        this.timer = setTimeout(function() {gameMemory.switchOff()}, 500);
    }

    switchOff()
    {
        var request = '{"type" : "server", "for" : "esp", "led" : ' + this.listLed[this.counter] + ', "action" : 0, "color" : "blue"}';
        sendMessage(request)
        this.counter = this.counter + 1;
        if(this.counter < this.listLed.length)
        {
            this.#loopShowLed();
        }
        else
        {
            this.counter = 0;
            console.log("You're turn to play !");
        }
    }

    checkGuess(led)
    {
        if(led == this.listLed[this.counter])
        {
            var request = '{"type" : "server", "for" : "esp", "led" : ' + led + ', "action" : 1, "color" : "green"}';
            sendMessage(request)
            this.timer = setTimeout(function() {gameMemory.switchOffCheckGuess()}, 500);
        }
        else
        {
            var request = '{"type" : "server", "for" : "esp", "led" : ' + led + ', "action" : 1, "color" : "red"}';
            sendMessage(request)
            this.timer = setTimeout(function() {gameMemory.endGameLose(led)}, 500);
        }
    }

    switchOffCheckGuess()
    {
        var request = '{"type" : "server", "for" : "esp", "led" : ' + this.listLed[this.counter] + ', "action" : 0, "color" : "green"}';
        sendMessage(request)
        this.counter = this.counter + 1;
        if(this.counter == this.listLed.length)
        {
            this.counter = 0;
            this.#pickRandomLed();
        }
    }

    endGameLose(led)
    {
        console.log("Vous avez perdu !");
        console.log("Compteur = " + this.counter)
        //PROBLEME ICI AVEC LE COMPTEUR, IL FAUT AUSSI REUSSIR A REINIT game = 0 SUR LES CPP
        var request = '{"type" : "server", "for" : "esp", "led" : ' + led + ', "action" : 0, "color" : "red"}';
        sendMessage(request)
        this.timer = setTimeout(function() {gameMemory.finish()}, 500);
    }

    finish()
    {
        this.GameLaunch = false;
        var request = '{"type" : "server", "for" : "esp", "end" : 1}';
        sendMessage(request)
    }
}

//PERMET D'ENVOYER UN MESSAGE A TOUS LES CLIENTS CONNECTES A LA WEBSOCKET
function sendMessage(message)
{
    console.log("Sending : " + message);
    s.clients.forEach(function(client){ //broadcast incoming message to all clients (s.clients)
        client.send(message)
    });
}
//CREATE GAME
var gameReflex = new GameReflex();
var gameMemory = new GameMemory();
//NE PAS OUBLIER D'ACTUALISER LE NOMBRE D'ESP EN FONCTION DU NOMBRE D'ESP CONNECTE AU PROJET
var nbEsp = 0;
//when browser sends get request, send html file to browser
// viewed at http://localhost:3000
app.get('/', function(req, res) {
    console.log('Hello world');
});

app.get('/page', function(req, res) {
    res.render("page2.ejs",{ nbEsp: nbEsp});
});

var arrayEspCo = [];

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
        //RECUPERE LA MESSAGE JSON
        const messageJson = JSON.parse(message);
        if(messageJson.type == "esp") //VERIFIE QUE LE MESSAGE VIENT D'UN ESP
        {
            if(messageJson.game == 0 && !gameReflex.getGameLaunch() && messageJson.esp == 1) //CONDITION PERMETTANT DE LANCER LA PARTIE
            {
                console.log("Nombre ESP : " + nbEsp);
                gameReflex = new GameReflex();
                gameReflex.startGame();
                //gameMemory = new GameMemory();
                //gameMemory.startGame();
            }
            else if(messageJson.game == 1 && gameReflex.getGameLaunch() && messageJson.esp == gameReflex.getRandEsp()
                && messageJson.bp == gameReflex.getRandLed()) //CONDITION PERMETTANT DE VERIFIER SI LE BON BOUTON A ETE APPUYE
            {
                gameReflex.cutTimer();
            }
            else if(messageJson.game == 2 && gameMemory.getGameLaunch())
            {
                gameMemory.checkGuess(messageJson.led);
            }
        }
        else if(messageJson.type== "espweb")
        {
            if(messageJson.appui == 1)
            {
                
                var espval=String(messageJson.esp);
                var bpval=String(messageJson.bp);
                console.log("bp", bpval);
                
                
                  console.log("server a recu message on a appuyé sur bp1");

                  var espval=String(messageJson.esp);
                  var bpval=String(messageJson.bp);
                  
                  const msg = {
                      type: "boutonweb",
                      esp: espval,
                      bp : bpval,
                      value : 1,
                      
                    };
                  
  
  
                    sendMessage(JSON.stringify(msg));
                  //sendMessage(request);
            }
            else if(messageJson.appui == 0 )
            {
                var espval=String(messageJson.esp);
                var bpval=String(messageJson.bp);
                var request = '{"type" : "boutonweb", "esp" : '+ espval+',"bp" : '+bpval+',"value" : 0}';
                const msg = {
                    type: "boutonweb",
                    esp: espval,
                    bp : bpval,
                    value : 0,
                    
                  };
                


                  sendMessage(JSON.stringify(msg));


                //sendMessage(request);
            }
        }

        else if(messageJson.type== "chlum")
        {
            if(messageJson.appui == 1)
            {
                var espval=String(messageJson.esp);
                var pinval=String(messageJson.pin);
                var request = '{"type" : "lumweb", "esp" : '+ espval+',"pin" : '+pinval+',"value" : 1}';
                
                const msg = {
                    type: "lumweb",
                    esp: espval,
                    pin : pinval,
                    value : 1,
                    
                  };
                


                  sendMessage(JSON.stringify(msg));
                  console.log("ok 1");
            }
            else if(messageJson.appui == 0 )
            {

                var espval=String(messageJson.esp);
                var pinval=String(messageJson.pin);
                var request = '{"type" : "lumweb", "esp" : '+ espval+',"pin" : '+pinval+',"value" : 0}';
                
                const msg = {
                    type: "lumweb",
                    esp: espval,
                    pin : pinval,
                    value : 0,
                    
                  };

                  sendMessage(JSON.stringify(msg));
                  console.log("ok 0");
            }
        }

        else if(messageJson.type== "chledforesp")
        {
            sendMessage(JSON.stringify(messageJson));
        }
        else if(messageJson.type== "espco")
        {
            if(messageJson.co == 1)
            {

                arrayEspCo.push(messageJson.esp);
                nbEsp+=1;


            }
            else if(messageJson.co == 0 )
            {

                for(let i=0;i<arrayEspCo.length;i++){
                    if(arrayEspCo[i]==messageJson.esp)
                    {
                        arrayEspCo.splice(pos, 1);
                        nbEsp=nbEsp-1;
                    }
                }
                
            }
        }
        else if(messageJson.type == "start")
        {
            if(messageJson.mode=="Memoire")
            {
                const msg = {
                    type: "serveur",
                    for : "esp",
                    launch : "true",
                    game : 2,
                  };
                sendMessage(JSON.stringify(msg));
                game = new GameMemory();
                game.startGame();
                
                console.log("jeu mémoire lancé par page web");
            }
            else{
                const msg = {
                    type: "serveur",
                    for : "esp",
                    launch : "true",
                    game : 1,
                  };
                sendMessage(JSON.stringify(msg));
                
                console.log("jeu réflexe lancé par page web");
            }

        }

        else if(messageJson.type == "getespco")
        {
            const msg = {
                type: "espcoweb",
                array: arrayEspCo,
                
              };
              sendMessage(JSON.stringify(msg));

        }
        else{console.log("esle if focntionne pas");}
// ws.send("From Server only to sender: "+ message); //send to client where message is from
    });

    ws.on('close', function(){
        console.log("lost one client");
    });

//ws.send("new client connected");
    console.log("new client connected");
});

server.listen(3000);
