const express = require("express"); //Utilisation de la librairie express
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;;
const { send } = require("process");
var path = require("path");
console.log(path);
const app = express();
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, 'public'))); 
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')));
const port = 8102; //Ouvre un port
const server = require("http").createServer(app); // Création du server

var etatButton=0;




app.get("/page", function (req, res) {
    //Si un Bp a changé d'état (bas vers haut) !
  
    res.render("page2.ejs",{ nbbutton: 1, valb: 0});
})


app.get("/chcouleur", function (req, res) {
    //Si un Bp a changé d'état (bas vers haut) !
  
    console.log(req.query.ledrouge);
    console.log(req.query.ledverte);
    console.log(req.query.ledbleu);
    res.sendStatus(200);
    envoi="http://192.168.0.101:80/chcouleur?Red="+req.query.ledrouge+"&Green="+req.query.ledverte+"&Blue="+req.query.ledbleu;

    console.log(envoi);
    const xhr = new XMLHttpRequest();
    xhr.open("GET", envoi);
    xhr.send();
    xhr.responseType = "json";
    xhr.onload = () => {
    if (xhr.readyState == 4 && xhr.status == 200) {
        const data = xhr.response;
        console.log(data);
    } else {
        console.log(`Error: ${xhr.status}`);
    }
    };
    console.log("fin");
})

app.get("/page", function (req, res) {
    //Si un Bp a changé d'état (bas vers haut) !
  
    res.render("page2.ejs",{ nbbutton: 2});
})





app.get("/value", function (req, res) {
    //Si un Bp a changé d'état (bas vers haut) !
  
    res.sendStatus(200);
    console.log("reçoit requête pour récupérer valeur bouton");
    envoi="http://192.168.0.101:80/value";

    reponse="";
    console.log("initialisation reponse");
    const xhr = new XMLHttpRequest();
    xhr.open("GET", envoi);
    xhr.send();
    xhr.responseType = "text/plain";
    console.log("avant onload");
    xhr.onload = () => {
    if (xhr.readyState == 4 && xhr.status == 200) {
        reponse = reponse + xhr.responseText;
        console.log("la reponse est:", reponse);
        res.end(reponse);
    } else {
        console.log(`Error: ${xhr.status}`);
        res.end(reponse);
    }
    };
    
    console.log("fin requete value");
})

server.listen(port, () => console.log(`Listening on port :${port}`));