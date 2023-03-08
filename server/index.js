const express = require("express"); //Utilisation de la librairie express
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;;
const { send } = require("process");
const app = express();
app.set("view engine", "ejs");
const port = 8102; //Ouvre un port
const server = require("http").createServer(app); // Création du server

class ESP  //On transforme chaque ESP en objet comme ça on peut accéder à leur ip facilement
{
    ip;
    buttons = ["bp1", "bp2"];
    leds = ["led1", "led2"];
    constructor(ip)
    {
        this.ip = ip;
    }
}

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
        sendGetRequest(listEsp[this.randEsp].ip + "Led="+ this.randLed + "&Red=" + 0);
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
        sendGetRequest(listEsp[this.randEsp].ip + "Led="+ this.randLed + "&Red=" + 0);
    }

    #endGameGagne()
    {
        console.log("Vous avez gagne !")
        this.GameLaunch = false;
        sendGetRequest(listEsp[this.randEsp].ip + "Led="+ this.randLed + "&Red=" + 0);
    }

    #loopGame()
    {
        this.randEsp = this.#getRandomInt(listEsp.length);
        this.randLed = this.#getRandomInt(2) + 1;
        sendGetRequest(listEsp[this.randEsp].ip + "Led="+ this.randLed + "&Red=" + 1);
        this.timer = setTimeout(function() {game.endGameLose()}, 5000);
    }
}

function sendGetRequest(getRequest)
{
    const xhr = new XMLHttpRequest();
    const req = getRequest;
    xhr.open("GET", req);
    xhr.send();
    xhr.responseType = "json";
    xhr.onload = () => {
    if (xhr.readyState == 4 && xhr.status == 200) {
        const data = xhr.responseText;
    } else {
        console.log(`Error: ${xhr.status}`);
    }
    };
}

var game = new Game();

var EspIP = ["http://192.168.0.101:80/?"];
var listEsp = []

app.get("/bp", function (req, res) {
    //Si un Bp a changé d'état (bas vers haut) !
    
    let led = parseInt(req.query.bp);
    let esp = parseInt(req.query.esp) - 1;
    console.log(`Led to switch off ${led}`);
    
    res.sendStatus(200);
    console.log("La partie est lance :" + game.getGameLaunch());
    if(game.getGameLaunch())
    {   
        console.log("L'esp pris est : " + esp + " = " + game.getRandEsp());
        if(esp == game.getRandEsp())
        {
            if(led == game.getRandLed())
            {
                //clearTimeout(timeOut); //Permet de clear le timer de la fonction game() quand le bon bouton est appuye
                //numberButtonPressed += 1;   
                game.cutTimer();
                /*Il suffit de reprendre la boucle Game() donc il faut enlever les variables qui 
                ne doivent pas être modifiées et les mettre dans la fonction /start
                Il faut juste relancer la fonction game() jusqu'à avoir numberButtonPressed à 10*/
            }

        }
    }
});

app.get("/", function (req, res) {
    //Si un Bp a changé d'état (bas vers haut) !
  
    res.render("page2.ejs");
});

app.get("/start", function (req, res)
{
    res.sendStatus(200);
    if(!game.getGameLaunch())
    {
        listEsp = [];
        EspIP.forEach(function(ip){
            listEsp.push(new ESP(ip));
        });
        console.log("Nombre ESP = " + listEsp.length);
        game = new Game()
        game.startGame();
    }
});

server.listen(port, () => console.log(`Listening on port :${port}`));

