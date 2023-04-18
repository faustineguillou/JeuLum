var nombresespco=0



const htmlSocket = new WebSocket(
  "ws://localhost:3000"
);

ws.on('message', function(message){
  console.log("Received: "+message);
  /*s.clients.forEach(function(client){ //broadcast incoming message to all clients (s.clients)
      if(client!=ws && client.readyState ){ //except to the same client (ws) that sent this message
          client.send("broadcast: " +message);
      }
  });*/
  const messageJson = JSON.parse(message);
  if(messageJson.type == "boutonweb")
        {
          var esp=messageJson.esp;
          var bp=messageJson.bp;
          var value=messageJson.value;
          if(bp==1){
            document.getElementById('form1'+esp).value=value;
          }
          else{
            document.getElementById('form2'+esp).value=value;
          }
         

        }

  if(messageJson.type == "lumweb")
    {
          var esp=messageJson.esp;
          var pin=messageJson.pin;
          var value=messageJson.value;
          if(pin=="Red1"){
            document.getElementById('idledrouge1esp'+esp).value=value;
          }
          else if(pin=="Red2"){
            document.getElementById('idledrouge2esp'+esp).value=value;
          }
          else if(pin=="Blue1"){
            document.getElementById('idledbleu1esp'+esp).value=value;
          }
          else if(pin=="Blue2"){
            document.getElementById('idledbleu2esp'+esp).value=value;
          }
          else if(pin=="Green1"){
            document.getElementById('idledverte1esp'+esp).value=value;
          }
          else{
            document.getElementById('idledgreenesp'+esp).value=value;
          }
          
         

        }
})

function voirrgb(id)
{
    
    choixrgb = document.getElementById('rgb');
    nbled=document.getElementById('nbledform');
    nbled.value=id;
    visible=choixrgb.style.display;
    
    
    if (visible == 'none')
    {
        choixrgb.style.display = 'block';
        
    }
    else{
        choixrgb.style.display='none';
    }
        
    
}
function changercouleur(couleur)
{
    test=document.getElementById('test');
    test.style.color=couleur;
}



function senddata(ledrouge,ledverte,ledbleu)
{
    
    var valledrouge=document.getElementById(ledrouge).value;
    console.log(valledrouge);

    var valledverte=document.getElementById(ledverte).value;
    console.log(valledverte);

    var valledbleu=document.getElementById(ledbleu).value;
    console.log(valledbleu);

    const exampleSocket = new WebSocket(
        "wss://www.example.com/socketserver",
        "protocolOne"
      );
      

    const msg = {
        type: "web",
        red: valledrouge,
        green: valledverte,
        blue: valledbleu,
        id: clientID,
        
      };
    
      // Send the msg object as a JSON-formatted string.
      exampleSocket.send(JSON.stringify(msg));


      exampleSocket.onmessage = function(event) {
        
        var text = "";
        var msg = JSON.parse(event.data);
        var time = new Date(msg.date);
        var timeStr = time.toLocaleTimeString();
      
        switch(msg.type) {
          
          case "red":
            text = "<b>User <em>" + msg.name + "</em> signed in at " + timeStr + "</b><br>";
            break;
          case "message":
            text = "(" + timeStr + ") <b>" + msg.name + "</b>: " + msg.text + "<br>";
            break;
          case "rejectusername":
            text = "<b>Your username has been set to <em>" + msg.name + "</em> because the name you chose is in use.</b><br>"
            break;
          case "userlist":
            var ul = "";
            for (i=0; i < msg.users.length; i++) {
              ul += msg.users[i] + "<br>";
            }
            document.getElementById("userlistbox").innerHTML = ul;
            break;
        }
      
        if (text.length) {
          f.write(text);
          document.getElementById("chatbox").contentWindow.scrollByPages(1);
        }
      };


    
}



function askvaluebouton()
{
    
    req="http://127.0.0.1:8102/value"
    console.log("askvaluebutton");
    const xhr = new XMLHttpRequest();
    xhr.open("GET", req);
    xhr.send();
    xhr.responseType = "text";
    xhr.onload = () => {
    if (xhr.readyState == 4 && xhr.status == 200) {
        console.log("on veut la réponse stp");
        console.log(xhr.responseText);
        document.getElementById(1).value = xhr.responseText;
    } else {
        console.log(`Error: ${xhr.status}`);
    }
    };
    

}


function sendGetRequest(getRequest)
{
    const xhr = new XMLHttpRequest();
    const req = getRequest;
    xhr.open("GET", req);
    xhr.send();
    xhr.responseType = "";
    xhr.onload = () => {
    if (xhr.readyState == 4 && xhr.status == 200) {
        const data = xhr.responseText;
    } else {
        console.log(`Error: ${xhr.status}`);
    }
    };
}


function startjeu()
{
  console.log("radio value",document.getElementsByName('jeu').values)
  
  console.log("1");
  const msg = {
    type: "start",
    mode: document.getElementsByName('jeu').values
    
  };

  /*htmlSocket.onopen = () => */
  htmlSocket.send(JSON.stringify(msg)); 
  // waiting for the socket connection to be opened to send the msg object as a JSON-formatted string.
  console.log("2");
  htmlSocket.onmessage = function(event) {
    console.log("jeu commencé");
    document.getElementById('affichagestart').innerHTML = "Jeu commencé";

}
}
function changemode(){


  var p=document.getElementById('pmode');
  var r=document.getElementById('idledrouge');
  var b=document.getElementById('idledbleu');
  var v=document.getElementById('idledverte');
  var bouton=document.getElementById('boutonsenddata');
  var bouton2=document.getElementById('boutonsenddata2');
  var textb=document.getElementsByName('button1');
  console.log("p", p.value);
  if(p.innerHTML=="Lecture"){
    console.log("lecture");
    p.innerHTML="Ecriture";
    p.value="Ecriture";
    p.value="Lecture";
    r.disabled=false;
    b.disabled=false;
    v.disabled=false;
    textb.disabled=false;
    bouton.style.display = 'block';
    bouton2.style.display = 'block';
  }
  else{
    console.log("ecriture");
    p.innerHTML="Lecture";
    p.value="Lecture";
    r.disabled=true;
    b.disabled=true;
    v.disabled=true;
    textb.disabled=true;
    bouton.style.display = 'none';
    bouton2.style.display = 'none';


  }
}


var espdemande=0;
function getesp(){

  var ul = document.getElementById("list");
  if (espdemande==1){
    for (let i = 0; i < ul.length; i++){
      
      ul.remove(i);
      
    }
  }
  const msg = {
    type: "getespco"
    
  };

  /*htmlSocket.onopen = () => */
  htmlSocket.send(JSON.stringify(msg)); 
  // waiting for the socket connection to be opened to send the msg object as a JSON-formatted string.
  
  htmlSocket.onmessage = function(event) {
    response=event.data;
    
    /*
    liste=list(response)
    liste.remove('"')
    liste.remove(',')
    liste.remove('[')
    liste.remove(']')
    print(liste)*/
    
/*
    document.getElementById('affichageespco').innerHTML += "\n";*/
    response = response.replaceAll('[', '')
    response = response.replaceAll(']', '')
    response = response.replaceAll('"', '')
    response = response.replaceAll(',', '')
    /*
    for (let i = 0; i < response.length; i++){
      console.log(response[i]);
      document.getElementById('affichageespco').innerHTML += response[i];
      document.getElementById('affichageespco').innerHTML += "\n";*/
      nombresespco=response.length;
    for (let i = 0; i < response.length; i++){
      var node = document.createElement('li');
      node.appendChild(document.createTextNode(response[i]));
 
      document.getElementById('ulaffespco').appendChild(node);

      var newDiv = document.createElement("div");
      // et lui donne un peu de contenu
  var newContent = document.createTextNode('Hi there and greetings!');
  // ajoute le nœud texte au nouveau div créé
  newDiv.appendChild(newContent);

  // ajoute le nouvel élément créé et son contenu dans le DOM
  var currentDiv = document.getElementById('div1');
  document.body.insertBefore(newDiv, currentDiv);


      
    }
    espdemande=1


    
    
    
    
}
}






var receive=function(msg)
{ 
    var li=document.createElement('li');
    li.innerHTML=msg;
    document.getElementById('esp').appendChild('li');
  
  
}
/*
htmlSocket.onmessage = function(event) {
  var text = "";
  var msg = JSON.parse(event.data);

  switch(msg.type) {
    case "esp":
      msg.list.length
      
      break;
    case "username":
      text = "<b>User <em>" + msg.name + "</em> signed in at " + timeStr + "</b><br>";
      break;
    case "message":
      text = "(" + timeStr + ") <b>" + msg.name + "</b>: " + msg.text + "<br>";
      break;
    case "rejectusername":
      text = "<b>Your username has been set to <em>" + msg.name + "</em> because the name you chose is in use.</b><br>"
      break;
    case "userlist":
      var ul = "";
      for (i=0; i < msg.users.length; i++) {
        ul += msg.users[i] + "<br>";
      }
      document.getElementById("userlistbox").innerHTML = ul;
      break;
  }

  if (text.length) {
    f.write(text);
    document.getElementById("chatbox").contentWindow.scrollByPages(1);
  }
};

*/
  