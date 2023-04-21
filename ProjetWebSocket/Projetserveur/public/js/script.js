var nombresespco=0


const htmlSocket = new WebSocket(
  "ws://localhost:3000"
);

htmlSocket.onmessage=function(ms)
{
  
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
}

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


      


    
}

/*
const departMinutes = 5
let temps = departMinutes * 60

const timerElement = document.getElementById("timer")

setInterval(() => {
  let minutes = parseInt(temps / 60, 10)
  let secondes = parseInt(temps % 60, 10)

  minutes = minutes < 10 ? "0" + minutes : minutes
  secondes = secondes < 10 ? "0" + secondes : secondes

  timerElement.innerText = `${minutes}:${secondes}`
  temps = temps <= 0 ? 0 : temps - 1
}, 1000)
*/


    






function startjeu()
{
  console.log("radio value",document.getElementsByName('jeu').values)
  
  console.log("1");
  const msg = {
    type: "start",
    mode: document.getElementsByName('jeu').values
    
  };

  htmlSocket.send(JSON.stringify(msg)); 
  console.log("2");
  htmlSocket.onmessage = function(event) {
    console.log("jeu commencé");
    document.getElementById('affichagestart').innerHTML = "Jeu commencé";

}
}
function changemode(){


  var p=document.getElementById('pmode');
  console.log("p", p.value);
  if(p.innerHTML=="Lecture"){
    console.log("lecture");
    p.innerHTML="Ecriture";
    p.value="Ecriture";
    console.log(p.value);
    console.log("nb", nombresespco);
    for (let i = 1; i <= nombresespco; i++){
      console.log(i);
      document.getElementById('idledrouge1esp'+i).disabled=false;
      document.getElementById('idledrouge2esp'+i).disabled=false;
      document.getElementById('idledbleu1esp'+i).disabled=false;
      document.getElementById('idledbleu2esp'+i).disabled=false;
      document.getElementById('idledverte1esp'+i).disabled=false;
      document.getElementById('idledverte2esp'+i).disabled=false;
      document.getElementById('boutonsenddatabutton1esp'+i).style.display = 'block';
      document.getElementById('boutonsenddatabutton2esp'+i).style.display = 'block';
      document.getElementById('boutonsenddata2esp'+i).style.display = 'block';
      document.getElementById('boutonsenddata1esp'+i).style.display = 'block';
      document.getElementById('form1esp'+i).disabled=false;
      document.getElementById('form2esp'+i).disabled=false;

  }
}
  else{
    console.log("ecriture");
    p.innerHTML="Lecture";
    p.value="Lecture";
    console.log(p.value);
    for(let i = 1; i <= nombresespco; i++){
      console.log(i);

      document.getElementById('idledrouge1esp'+i).disabled=true;
      document.getElementById('idledrouge2esp'+i).disabled=true;
      document.getElementById('idledbleu1esp'+i).disabled=true;
      document.getElementById('idledbleu2esp'+i).disabled=true;
      document.getElementById('idledverte1esp'+i).disabled=true;
      document.getElementById('idledverte2esp'+i).disabled=true;
      document.getElementById('boutonsenddatabutton1esp'+i).style.display = 'none';
      document.getElementById('boutonsenddatabutton2esp'+i).style.display = 'none';
      document.getElementById('boutonsenddata2esp'+i).style.display = 'none';
      document.getElementById('boutonsenddata1esp'+i).style.display = 'none';
      document.getElementById('form1esp'+i).disabled=true;
      document.getElementById('form2esp'+i).disabled=true;


  }
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

 
  htmlSocket.send(JSON.stringify(msg)); 
 
  
  htmlSocket.onmessage = function(event) {
    response=event.data;
    
   
    response = response.replaceAll('[', '')
    response = response.replaceAll(']', '')
    response = response.replaceAll('"', '')
    response = response.replaceAll(',', '')
   
      nombresespco=response.length;
    for (let i = 0; i < response.length; i++){
      var node = document.createElement('li');
      node.appendChild(document.createTextNode(response[i]));
 
      document.getElementById('ulaffespco').appendChild(node);

      


      
    }
    espdemande=1;
    
}
}



var receive=function(msg)
{ 
    var li=document.createElement('li');
    li.innerHTML=msg;
    document.getElementById('esp').appendChild('li');
  
  
}
