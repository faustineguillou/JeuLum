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

function senddataboutons(idbutton)
{
    
    
        var valbouton=document.getElementById(idbutton).value;
        
    
    


    req="http://127.0.0.1:8102/chboutons?value="+valbouton;

    sendGetRequest(req);
}

function askvaluebouton(idbutton)
{
    
    
        
    
    


    req="http://127.0.0.1:8102/value?button="+

    sendGetRequest(req);
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



  