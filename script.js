//localStorage.clear();

//Audio
efekt1 = new Audio('zvok/efekt1.mp3');
efekt2 = new Audio('zvok/efekt2.mp3');
efekt3 = new Audio('zvok/efekt3.mp3');
efekt4 = new Audio('zvok/efekt4.mp3');
efekt5 = new Audio('zvok/efekt5.mp3');
efekt6 = new Audio('zvok/efekt6.mp3');

//Deklaracija spremenljivk
var konecZanke=false;
var runFlag=false;
var ime;
let forma;
let vrstice;
let stolpci;
let tezavnost;

//Klic prve funkcije prednastavi();
document.getElementById("submit").onclick = prednastavi;

function prednastavi(){

  forma = document.querySelector("#nastavitve");
  vrstice = parseInt(document.querySelector("#vrstice").value);
  stolpci = parseInt(document.querySelector("#stolpci").value);
  tezavnost = parseInt(document.querySelector("#tezavnost").value);
  
  //Izpolnite vsa polja
  if(!vrstice || !stolpci || !tezavnost){
    Swal.fire({
      icon: 'warning',
      title: 'Nepravilen vnos',
      text: "Izpolnite vsa polja.",
      confirmButtonText: 'Nazaj'     
    });
    return;
  }

  //Omejitve vhodnih podatkov
  if (vrstice < 3 || vrstice > 10) {
    Swal.fire({
      icon: 'warning',
      title: 'Nepravilen vnos',
      text: "Število vrstic mora biti med 3 in 10.",
      confirmButtonText: 'Nazaj'     
    });
    return;
  }

  if (stolpci < 5 || stolpci > 15) {
    Swal.fire({
      icon: 'warning',
      title: 'Nepravilen vnos',
      text: "Število stolpcev mora biti med 5 in 15.",
      confirmButtonText: 'Nazaj'     
    });
    return;
  }

  if (tezavnost < 1 || tezavnost > 3) {
    Swal.fire({
      icon: 'warning',
      title: 'Nepravilen vnos',
      text: "Težavnost mora biti med 1 in 3.",
      confirmButtonText: 'Nazaj'     
    });
    return;
  }

  

  //Audio
  efekt2.play();
  bgzvok = new Audio('zvok/bgzvok.mp3');
    if (typeof bgzvok.loop == 'boolean'){
      bgzvok.loop = true;
    }else{
        bgzvok.addEventListener('ended', function() {
        this.currentTime = 0;
        this.play();
      }, false);
    }
  bgzvok.play(); 
  
  forma.style.display = "none";
  
  //Navodila igre
  preveri();
  function preveri(){
    Swal.fire({
      backdrop:true,
      allowOutsideClick: false,
      closeOnClickOutside: false,
      icon: 'warning',
      title: "Pravila igre",
      text: "Premikaj plošček s tipkami ← → ali z miško tako, da uničiš planet. Na voljo imaš 5 življenj. Spodaj vnesite svoje ime.",
      input: 'text',
      confirmButtonText: 'Začni'
    }).then((result) => {
      ime=result.value;
      if(!ime || ime.trim() === " "||ime.includes(" "))
        preveri();
      else{
        efekt2.play();
        container.style.display="block"
        document.getElementById("text").innerHTML = "";
        runFlag=true;
        nastavi();
        počakaj(3);
      }  
    });
  }
}

//Funkcija, ki pripravi canvas za začetek igre

var dx = 4;
var dy = 6;
var naslov;
function nastavi(){
  if(runFlag){
    document.getElementById("cas").style.display = "block";
    document.getElementById("tocke").style.display = "block";
    document.getElementById("lives-container").style.display = "block";
    document.getElementById("opisplaneta").style.display = "block";
  }else{
    document.getElementById("cas").style.display = "none";
    document.getElementById("tocke").style.display = "none";
    document.getElementById("lives-container").style.display = "none";
    document.getElementById("opisplaneta").style.display = "none";
  }
}

//Funkcija, ki počaka na tvoj klik preden začne igro
function počakaj(seconds) {
  let counter = seconds;
    
  const interval = setInterval(() => {
    document.getElementById("text").innerHTML = counter;
    counter--;
      
    if (counter < 0 ) {
      clearInterval(interval);
      if(runFlag)
        drawIt(vrstice,stolpci,tezavnost);
      dx=4;
      dy=6;
      
      document.getElementById("text").innerHTML = naslov[3];
      
        
    }
  }, 1000);
}

//Glavna funkcija igre SpaceBreaker
function drawIt(vrstice,stolpci,tezavnost) {
  if(!konecZanke)
  runFlag=false;

  //Deklaracija spremenljivk
  var x = 225;
  var y = 225;
  var WIDTH;
  var HEIGHT;
  var r=10;
  

  var paddlex;
  var paddleh;
  var paddlew;

  var rightDown = false;
  var leftDown = false;

  var ctx;
  var canvasMinX;
  var canvasMaxX;

  var bricks;
  var NROWS;
  var NCOLS;
  var BRICKWIDTH;
  var BRICKHEIGHT;
  var PADDING;

  //Spremenljivke za preverjanje, kolikšna je vrednost 
  var brickFlag1=false;
  var brickFlag2=false;
  var brickFlag3=false;

  var konec=1;

  var tocke;

  var color=getRandomColor();

  var sekunde;
  var sekundeI;
  var minuteI;
  var izpisTimer;
  var start=true;

  //Funkcija za merenje časa
  function timer(){
    if(start==true){
      sekunde++;
      sekundeI = ((sekundeI = (sekunde % 60)) > 9) ? sekundeI : "0"+sekundeI;
      minuteI = ((minuteI = Math.floor(sekunde / 60)) > 9) ? minuteI : "0"+minuteI;
      izpisTimer = minuteI + ":" + sekundeI;
    }else{
      sekunde=0;
    }
    $("#cas").html(izpisTimer);
  }

  //Usmerjanje s tipkami
  $(document).keydown(onKeyDown);
  $(document).keyup(onKeyUp); 
  $(document).mousemove(onMouseMove);
  
  function onKeyDown(evt) {
      if (evt.keyCode == 39)
          rightDown = true;
      else if (evt.keyCode == 37) 
          leftDown = true;
  }

  function onKeyUp(evt) {
      if (evt.keyCode == 39)
          rightDown = false;
      else if (evt.keyCode == 37) 
          leftDown = false;
  }

  //inicializacija opek
  function initbricks() { 
    NROWS = vrstice+2;
    NCOLS = stolpci+2;
    BRICKWIDTH = (WIDTH/NCOLS) - 1;
    BRICKHEIGHT = 15;
    PADDING = 2;
    bricks = new Array(NROWS);
    for (i=0; i < NROWS; i++) {
      bricks[i] = new Array(NCOLS);
      for (j=0; j < NCOLS; j++) {
        if(i<2||j==0||j==NCOLS-1)
        bricks[i][j] = 0;
        else if(i>=NROWS-Math.floor((NROWS-1)/3))
        bricks[i][j] = 1;
        else if(i<=Math.floor((NROWS-2)/3)+1)
        bricks[i][j] = 3;
        else
        bricks[i][j] = 2;
      }
    }
  }

  //Inicializacija ploščka
  function init_paddle() {
      paddlex = WIDTH / 2;
      paddleh = 10;
      paddlew = 75;
    }

  //Inicializacija miške
  function init_mouse() {
    canvasMinX = $("canvas").offset().left+paddlew/2;
    canvasMaxX = canvasMinX + WIDTH-paddlew;
  }

  //Premikanje z miško
  function onMouseMove(evt) {
    if (evt.pageX > canvasMinX && evt.pageX < canvasMaxX) {
      paddlex = evt.pageX - canvasMinX;
    }
  } 
    
  //Inicializacija igre
  function init() {
    ctx = document.getElementById('canvas').getContext('2d');
    WIDTH = $("#canvas").width();
    HEIGHT = $("#canvas").height();
    tocke = 0;
    $("#tocke").html(tocke);
    sekunde = 0;
    izpisTimer = "00:00";
    intTimer = setInterval(timer, 1000);
    return setInterval(draw, 20-tezavnost*3);
  }
  
  //Funkcija za risanje krogle
  function circle(x,y,r) {
    ctx.fillStyle = "rgb(255, 255, 255)"
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI*2, true);
    ctx.closePath();
    ctx.fill();
  }
  
  //Funkcija za risanje pravokotnikov
  function rect(x,y,w,h) {
    ctx.beginPath();
    ctx.rect(x,y,w,h);
    ctx.closePath();

    tab=color.split(' ');
    if(brickFlag3) 
      ctx.fillStyle=tab[0];
    else if(brickFlag2)
      ctx.fillStyle=tab[1];
    else if(brickFlag1)
      ctx.fillStyle=tab[2];
    ctx.fill();
  }
  
  //Funkcija za brisanje opek
  function clear() {
      ctx.clearRect(0, 0, WIDTH, HEIGHT);
  }
  

  //Funkcija, ki na podlagi random števila izbira planet in barvo opek
  function getRandomColor() {
      var color = '';
      switch(Math.floor(Math.random() * 9)){
        case 0:
          color='hsl(60,100%,50%) hsl(60,100%,35%) hsl(60,100%,20%) Sonce';
          document.getElementById("opisplaneta").innerHTML = "V Soncu je zbrane 99,8% vse mase Osončja. Preostanek mase se večinoma nahaja v Jupitru, le majhen del si je delijo vsa ostala nebesna telesa Osončja. Sonce je popolnoma povprečna zvezda tipa G2. Po velikosti sodi med 10% največjih zvezd v naši galaksiji Mlečni stezi, ki je sestavljena iz okrog 100 milijard zvezd. Povprečna velikost zvezd v Mlečni stezi je manj kakor 50% velikosti Sonca.";
          break;
        case 1:
          color='hsl(30,100%,35%) hsl(30,100%,20%) hsl(30,100%,10%) Merkur';
          document.getElementById("opisplaneta").innerHTML = "Merkur je najmanjši in Soncu najbljižji planet.  Sonce obkroži v 88 dneh. Merkur po izgledu spominja na Luno, saj je prepreden s kraterji. Naravnih stelitov in gostejše atmosfere nima. Površinske temperature na planetu znašajo med  -180 °C do 430 °C. Merkur je premajhen, da bi s svojo šibko gravitacijo dlje časa zadržal znatnejšo atmosfero.";
          break;
        case 2:
          color='hsl(45,100%,50%) hsl(45,100%,35%) hsl(45,100%,20%) Venera';
          document.getElementById("opisplaneta").innerHTML = "Venera je notranji in drugi planet od sonca.Venera doseže svojo največjo svetlost malo pred sončnim zahodom ali malo po sončnemu zahodu, zato jo včasih v tem smislu imenujemo (zvezda) »danica« (»jutranjica«). Venera je po velikosti in obsegu zelo podoben Zemlji. Venera ima najgostejšo atmosfero od vseh zemeljskih planetov, ki je sestavljeno večinoma iz ogljikovega dioksida, zračni pritisk na površini pa je 90-krat večji kot na Zemlji.";
          break;
        case 3:
          color='hsl(0,0%,100%) hsl(0,0%,75%) hsl(0,0%,50%) Luna';
          document.getElementById("opisplaneta").innerHTML = "Luna je Zemljin edini naravni satelit. Povprečna oddaljenost Lune od Zemlje je 384.403 km, približno 30,13 Zemljinih ekvatorskih premerov, zato odbita sončna svetloba z njenega površja doseže Zemljo v približno 1,255 sekunde. Premer Lune znaša 3476 km, s čimer je Zemljina Luna peti največji naravni satelit v Osončju, tako po premeru, kot po masi.";
          break;
        case 4:
          color='hsl(0,100%,60%) hsl(0,100%,45%) hsl(0,100%,30%) Mars';
          document.getElementById("opisplaneta").innerHTML = "Mars (tudi Rdeči planet) je četrti planet od Sonca v Osončju in sedmi po velikosti. Imenuje se po rimskem bogu vojne Marsu, zaradi značilne rdeče barve, ki je posledica prisotnosti železovega oksida na njegovem površju. Mars ima dve majhni luni, Fobos in Demos. Na Marsu so skoraj najugodnejši pogoji za življenje poleg Zemlje.";
          break;
        case 5:
          color='hsl(24,100%,60%) hsl(24,100%,45%) hsl(24,100%,30%) Jupiter';
          document.getElementById("opisplaneta").innerHTML = "Jupiter je zunanji, peti planet od Sonca in je največji planet v našem Osončju.Ta plinski velikan je 2,5-krat masivnejši kot vsi planeti skupaj, čeprav ima samo 1/1047 Sončeve mase. Jupiter ima štiri lune Io, Evropa, Ganimed in Kalisto. Ime je dobil po rimskem bogu Jupitru. Ta plinasti orjak je 2,5-krat masivnejši kot vsi planeti skupaj, čeprav ima samo 1/1047 Sončeve mase.";
          break;
        case 6:
          color='hsl(40,100%,80%) hsl(40,100%,65%) hsl(40,100%,50%) Saturn';
          document.getElementById("opisplaneta").innerHTML = "Saturn je zunanji, šesti planet od Sonca v Osončju. Imenuje se po rimskem bogu Saturnu. Je plinski velikan, po velikosti drugi največji za Jupitrom. Poleg Jupitra, Urana in Neptuna spada v skupino jupitrovskih planetov. Že od nekdaj je najbolj znan po svojih značilnih obročih. Njegova luna Titan je druga največja luna v Osončju za Jupitrovo luno Ganimed. Titan je edina luna z gosto atmosfero.";
          break;
        case 7:
          color='hsl(180,100%,70%) hsl(180,100%,55%) hsl(180,100%,40%) Uran';
          document.getElementById("opisplaneta").innerHTML = "Uran je zunanji, sedmi planet od Sonca. Narejen je iz plinov in je tretji največji po premeru in četrti največji po masi.Uran je prvi planet, odkrit v sodobnem času. William Herschel ga je uradno odkril 13. marca 1781. Njegova atmosfera je v Osončju nahladnejša z najnižjo temperaturo 49 K (–224 °C). Notranjost Urana v glavnem sestavljajo ledovi in skale.";
          break;
        case 8:
          color='hsl(204,100%,50%) hsl(204,100%,35%) hsl(204,100%,20%) Neptun';
          document.getElementById("opisplaneta").innerHTML = "Neptun je zunanji po oddaljenosti od Sonca osmi planet v Osončju.Okrog tega modrega planeta so bili odkriti šibki temni obroči, ki pa so manj izdatni kot Saturnovi. Odkrili so ga Urbain-Jean Le Verrier,John Couch Adams, Johann Gottfried Galle 23. septembra 1846. Neptun ima tudi vetrove, ki pihajo s hitrostjo 2000 km/h, v ozračju pa so znatne količine vodika, helija in metana, ki dajejo planetu značilno modro barvo.";
          break;
        case 9:
          color='hsl(0,0%,75%) hsl(0,0%,60%) hsl(0,0%,45%) Pluton';
          document.getElementById("opisplaneta").innerHTML = "Pluton je za Erido drugi največji pritlikavi planet v Osončju in največji znani objekt v Kuiperjevem pasu, verjetno pa tudi največje čezneptunsko telo. Pluton naredi najdaljšo pot v našem Osončju. Odkril ga je Clyde William Tombaugh 18. februarja 1930. Masa Plutona znaša manj kot 0,24 % mase Zemlje, njegov premer pa 2372 km.";
          break;
                    
      }
      naslov=color.split(" ");
      document.getElementById("text").innerHTML = naslov[3];
      return color;
  }

  //Funkcija za risanje
  function draw() {
    clear();

    
    if(!konecZanke)
      circle(x, y, 10);

    if (rightDown&&paddlex<=(WIDTH-75)) 
      paddlex += 10;
    else if (leftDown&&paddlex>=0) 
      paddlex -= 10;

    rect(paddlex, HEIGHT-paddleh, paddlew, paddleh);
      
    //Resetiranje spremenljivke, ki gleda koliko opek je ostalo
    konec=0;
    for (i=0; i < NROWS; i++) {
      for (j=0; j < NCOLS; j++) {
        if (bricks[i][j] != 0) {
          konec++;
          switch(bricks[i][j]){
            case 1:
              brickFlag1=true;
              break;
            case 2:
              brickFlag2=true;
              break;
            case 3:
              brickFlag3=true;
              break;
          }
          rect((j * (BRICKWIDTH + PADDING)) + PADDING, (i * (BRICKHEIGHT + PADDING)) + PADDING,BRICKWIDTH, BRICKHEIGHT);
        
          brickFlag3=false;
          brickFlag2=false;
          brickFlag1=false;
        }
      }
    }
    
    //Če sta pogoja TRUE, je igre konec (Se izvede metoda funkcija end())
    if(konec==0&&!runFlag){
      end();
      return;
    }
      
    rowheight = BRICKHEIGHT + PADDING;
    colwidth = BRICKWIDTH + PADDING;
    row = Math.floor(y/rowheight);
    col = Math.floor(x/colwidth);

    //Ali smo zadeli opeko?
    if (y < NROWS * rowheight && row >= 0 && col >= 0) {
      switch(bricks[row][col]){
        case 3:
          dy = -dy; 
          bricks[row][col] = 2;
          tocke += 3; 
          break;
        case 2:
          dy = -dy; 
          bricks[row][col] = 1; 
          tocke += 2;
          break;
        case 1:
          efekt3.play();
          tocke += bricks[row][col];
          dy = -dy; 
          bricks[row][col] = 0; 
          break;
      }
      $("#tocke").html(tocke);
    }
    
    if(x + dx > WIDTH-r || x + dx < 0+r)
      dx = -dx;
    if(y + dy < 0+r)
      dy = -dy;
    else if (y + dy > HEIGHT-r) {
      if (x > paddlex && x < paddlex + paddlew){
        efekt1.play();
        document.getElementById("cas").style.color = "white";
        dx = 8 * ((x-(paddlex+paddlew/2))/paddlew);
        dy = -dy;
        start=true;
      }else{
        sekunde+=3;
        document.getElementById("cas").style.color = "red";
        end();
         
      }
    }
    x += dx;
    y += dy;
  }
  
  //Funkcija za konec igre
  var st=5;
  var end = (function() {
  return function() {
    
    var a="";
    var b="";
    var c="";
    var niz="";

    var tableA;
    var tableB;
    var tableC;

    let live2 = document.getElementById("2");
    let live3 = document.getElementById("3");
    let live4 = document.getElementById("4");
    let live5 = document.getElementById("5");

    if(konec!=0){

      //Zbijanje življenj
      switch(st){
        case 5:
          efekt5.play();
          live5.style.display="none";
          break;
        case 4:
          efekt5.play();
          live4.style.display="none";
          break;
        case 3:
          efekt5.play();
          live3.style.display="none";
          break;
        case 2:
          efekt5.play();
          live2.style.display="none";
          break;
        case 1:
            efekt4.play();
            dx=0;
            dy=0;
            runFlag=true;
            konecZanke=true;
            start=false;
            container.style.display="none";

            //LocalStorage v akciji
            a=localStorage.getItem("ime");
            b=localStorage.getItem("tocke");
            c=localStorage.getItem("timer");

            localStorage.setItem('ime',a);
            localStorage.setItem('tocke',b);
            localStorage.setItem('timer',c);

            tableA=a.split(" ");
            tableB=b.split(" ");
            tableC=c.split(" ");
            function urediRezultate(){
              var a;
              for(var i=1; i<tableA.length; i++){
                for(var k=tableA.length-1; k>=i;k--)
                  if((tableB[k]>(tableB[k-1]))){
                      a=tableA[k];
                      tableA[k]=tableA[k-1];
                      tableA[k-1]=a;

                      a=tableB[k];
                      tableB[k]=tableB[k-1];
                      tableB[k-1]=a;

                      a=tableC[k];
                      tableC[k]=tableC[k-1];
                      tableC[k-1]=a;
                    }
                  
              }   
            }
            urediRezultate();

            for(var i=1;i<4;i++){
              if(tableA[i]!=null&&tableA[i]!=undefined)
              niz=niz+""+tableA[i]+" "+tableB[i]+"pts "+tableC[i]+"s "+"\n";
            }

            Swal.fire({
              icon: 'error',
              title: "Izgubil si",
              html: 'TOP 3 igralci <pre class="align-left">'+niz+'</pre>',
              confirmButtonText: 'Nazaj'     
            }).then(() => {
              efekt2.play();
              location.reload();
            });
            break;
          default:
            break;
        }
        
        st--;
        x=225;
        y=255;
        dx = 0;
        dy = 0;
        if(!konecZanke)
        počakaj(3);
        
        
      }else if(konec==0&&!runFlag){ 
        konecZanke=true;
        dx=0;
        dy=0;
        //Zmagal
        efekt6.play();
        container.style.display="none";
        runFlag=true;
        
        //LocalStorage v akciji
        a=localStorage.getItem("ime")+" "+ime;
        b=localStorage.getItem("tocke")+" "+tocke;
        c=localStorage.getItem("timer")+" "+izpisTimer;

        localStorage.setItem('ime',a);
        localStorage.setItem('tocke',b);
        localStorage.setItem('timer',c);

        tableA=a.split(" ");
        tableB=b.split(" ");
        tableC=c.split(" ");
        function urediRezultate(){
          var a;
          for(var i=1; i<tableA.length; i++){
            for(var k=tableA.length-1; k>=i;k--)
              if((tableB[k]>(tableB[k-1]))){
                  a=tableA[k];
                  tableA[k]=tableA[k-1];
                  tableA[k-1]=a;

                  a=tableB[k];
                  tableB[k]=tableB[k-1];
                  tableB[k-1]=a;

                  a=tableC[k];
                  tableC[k]=tableC[k-1];
                  tableC[k-1]=a;
                }
              
          }   
        }
        urediRezultate();

        for(var i=1;i<4;i++){
          if(tableA[i]!=null&&tableA[i]!=undefined)
          niz=niz+""+tableA[i]+" "+tableB[i]+"pts "+tableC[i]+"s "+"\n";
        }
        alert(niz);
        Swal.fire({
          icon: 'success',
          title: "Zmagal si",
          html: 'TOP 3 igralci <pre class="align-left">'+niz+'</pre>',
          confirmButtonText: 'Nazaj'     
        }).then(() => {
          efekt2.play();
          location.reload();
        });
      }  
    };
  })
();

  //Klic funkcij, če igre ni še konec
  if(!runFlag){
    init();
    init_paddle();
    init_mouse();
    initbricks();
  }
}