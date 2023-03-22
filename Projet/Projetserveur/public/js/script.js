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


    req="http://127.0.0.1:8102/chcouleur?ledrouge="+valledrouge+"&ledverte="+valledverte+"&ledbleu="+valledbleu;

    sendGetRequest(req);
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



  