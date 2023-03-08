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
app.get("/bp", function (req, res) {
    //Si un Bp a changé d'état (bas vers haut) !
  
    console.log(req.query.pressed);
    res.sendStatus(200);
    if(etatButton==1)
    {
        etatButton = 0;
    }
    else
    {
        etatButton = 1;
    }

    const xhr = new XMLHttpRequest();
    xhr.open("GET", "http://192.168.0.100:80/?Blue="+etatButton);
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
})



app.get("/page", function (req, res) {
    //Si un Bp a changé d'état (bas vers haut) !
  
    res.render("page2.ejs",{ nbbutton: 10});
})


app.get("/chcouleur", function (req, res) {
    //Si un Bp a changé d'état (bas vers haut) !
  
    console.log(req.query.ledrouge);
    console.log(req.query.ledverte);
    console.log(req.query.ledbleu);
    res.sendStatus(200);
    envoi="http://192.168.0.100:80/chcouleur?Red="+req.query.ledrouge+"&Green="+req.query.ledverte+"&Blue="+req.query.ledblue;

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
})

app.get("/page", function (req, res) {
    //Si un Bp a changé d'état (bas vers haut) !
  
    res.render("page2.ejs",{ nbbutton: 10});
})


app.get("/chboutons", function (req, res) {
    //Si un Bp a changé d'état (bas vers haut) !
  
    console.log(req.query.list);
    res.sendStatus(200);
    envoi="http://192.168.0.100:80/chboutons?Red="+req.query.ledrouge+"&Green="+req.query.ledverte+"&Blue="+req.query.ledblue;

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
})

server.listen(port, () => console.log(`Listening on port :${port}`));