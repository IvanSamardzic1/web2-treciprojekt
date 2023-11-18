//canvas
var moj_canvas = document.getElementById("mojCanvas");
var moj_kontekst = moj_canvas.getContext("2d");
//postavljanje našeg canvasa na veličinu prozora

moj_canvas.width = window.innerWidth;
moj_canvas.height = window.innerHeight;
//naša struktura napadaci, "asteroidi" koji napadaju našeg igrača
const napadaci = []
//slika za raketu, odnosno igraca
const image = new Image();
image.src = "./raketa.jpg";
//slika za asteroid, odnosno napadace
const image2 = new Image();
image2.src = "./asteroid.jpg";
//zvuk koji se koristi pri sudaru
var audio = new Audio('sudarzvuk.mp3');
//brojac koji ce pomagat pri stvaranju napadaca i koji ce brinit da
//ne stvorimo previse napadaca
let brojac = 0;
//nase najbolje vrijeme, pamti se u localStorage
let najboljeVrijeme = localStorage.getItem("najboljeVrijeme");
//treba nam i pocetnovrijeme i vrijeme koje je proslo kako bi mogli mjeriti
//vrijeme do sudara
let pocetnovrijeme;
let vrijemekojejeproslo;


//dodavanje mog igraca u kojem su sadržanje njegove koordinate
// mora biti točno u sredini, pa kodiramo tako
const moj_igrac = {
    x: moj_canvas.width / 2,
    y: moj_canvas.height / 2,
};

//kretanje igrača pomoću tipki
//kad se klikne određena tipka, tako igrac pomice svoje koordinate
document.addEventListener('keydown', function(event) {
    let oznaka = event.key;
    if (oznaka == "ArrowLeft") moj_igrac.x = moj_igrac.x - 15;
    else if (oznaka == "ArrowUp") moj_igrac.y = moj_igrac.y - 15;
    else if (oznaka == "ArrowRight") moj_igrac.x = moj_igrac.x +15;
    else if (oznaka == "ArrowDown") moj_igrac.y = moj_igrac.y + 15;

   
});

//dodajemo objekte
function dodavanjeobjekata() {
    //dodajemo u napadace sve dok nisu popunjena sva mjesta(35 napadaca)
    if(brojac < 35){
        const napadac = {
            x: Math.random() * moj_canvas.width, //bilo gdje na x koordinati
            y: -50,//stavljamo ovo jer mora bit izvan granica ekrana na početku
            xbrz: Math.floor(Math.random() * (6)) - 3,//stavljamo random brzine, ali da budu i negativne i pozitivne
            ybrz: Math.floor(Math.random() * (6)) - 3
        };
        brojac++;//brojac koji mi broji koliko napadaca smo dodali
        napadaci.push(napadac);//dodajemo napadaca u niz napadaci
    }
    moj_kontekst.shadowBlur=20;//sjena
    moj_kontekst.shadowColor="black";//boja sjene
    moj_kontekst.fillStyle = "red";//vise nije potrebno kad imamo sliku
    moj_kontekst.drawImage(image, moj_igrac.x, moj_igrac.y, 30, 30);//dodavanje na ekran
    for (const napadac of napadaci) {//radim sa svim napadacima
        moj_kontekst.shadowBlur=5;
        moj_kontekst.shadowColor="black";
        moj_kontekst.fillStyle = "gray";//vise nije potrebno kad imam sliku
        moj_kontekst.drawImage(image2, napadac.x, napadac.y, 20, 20);//dodavanje na ekran
    }
    
}

function kretanjenapadaca() {//pomicanje napadaca po ekranu
    for (const napadac of napadaci) {
        napadac.x = napadac.x + napadac.xbrz;
        napadac.y = napadac.y + napadac.ybrz;

        //opet napravio da mi se vraćaju ako odu izvan, jer bi ih onako sve izgubio
        const pomoc1 = moj_canvas.width + napadac.x;
        const pomoc2 = moj_canvas.height + napadac.y;
        napadac.x = pomoc1 % moj_canvas.width;
        napadac.y = pomoc2 % moj_canvas.height;
    
    }
    //nakon svakog pomicanja napadaca provjeravamo je li došlo do sudara
    provjerasudara();
}


function provjerasudara() {//provjeravamo jesu li igrac i asteroid(napadac) u kontaktu
    const napadacwidth = 20;//veličine napadaca
    const napadacheight = 20;
    const igracwidth = 30;//veličine igraca
    const igracheight = 30;
    for (const napadac of napadaci) {//provjeravamo za svakog napadaca
        //usporedujemo njihove koordinate i ako se dodiruju, aktiviramo zvuk i završavamo igru
        const poznapadacx = napadac.x + napadacwidth;
        const poznapadacy = napadac.y + napadacheight;
        const pozigracx = moj_igrac.x + igracwidth;
        const pozigracy = moj_igrac.y + igracheight
        if (poznapadacx > moj_igrac.x && napadac.x < pozigracx &&
            poznapadacy > moj_igrac.y && napadac.y < pozigracy)
            {
                zvuk()
                krajIgre();
            }
    }
}
//funkcija koja emitira zvuk pri sudaru
function zvuk() {
    audio.currentTime = 0;  
    audio.play();
}

//završavanje igre, do ove funkcije dolazi kad dođe do sudara
function krajIgre() {
    while (napadaci.length) {
        napadaci.pop();
    }//izbacujem sve napadace iz svog niza
    brojac = 0;//postavljam brojac opet na nula kako bi se ponovno mogao koristit
    //postavljam koordinate svog igrača opet na sredinu ekrana
    moj_igrac.x = moj_canvas.width / 2;
    moj_igrac.y = moj_canvas.height / 2;

    
    //izračunavam vrijeme koje je prošlo od početka igre
    vrijemekojejeproslo = new Date().getTime() - pocetnovrijeme;
    
    //postavljam pocetno vrijeme na nulu kako bi se opet moglo koristit
    pocetnovrijeme = null;
    // Ažurirajte najbolje vrijeme ako je trenutno vrijeme bolje od najboljeg vremena
    //Ako vidimo razliku u vremenu, znači da je novo vrijeme bolje
    if(najboljeVrijeme){
        let poboljsanje = vrijemekojejeproslo - najboljeVrijeme;
        if(poboljsanje > 0){
            najboljeVrijeme = vrijemekojejeproslo
            localStorage.setItem("najboljeVrijeme", vrijemekojejeproslo)
            console.log(vrijemekojejeproslo);
            console.log(najboljeVrijeme)
        }
    }
    else {
        najboljeVrijeme = vrijemekojejeproslo;
        localStorage.setItem("najboljeVrijeme", vrijemekojejeproslo); 
    }

    //u alertu vidimo formatiranje zadanog vremena, a slično formatiranje je korišteno i dalje u kodu
    //funkcija padStart pretvara u string i zauzme mjesta koliko mi zadamo
    //ako ne popunimo sve, ta funkcija puni s drugim argumentom, u našem slučaju s nulama
    //funkcija toFixed ograničava broj decimala, a to koristimo za sekunde:milisekunde
    alert(`Pogođeni ste!
    Vaše vrijeme: ${(Math.floor(vrijemekojejeproslo / 60000)).toString().padStart(2, '0')}:${ (((vrijemekojejeproslo % 60000) / 1000).toFixed(3)).padStart(6, '0')}
    Najbolje vrijeme: ${`${(Math.floor(najboljeVrijeme / 60000)).toString().padStart(2, '0')}:${(((najboljeVrijeme % 60000) / 1000).toFixed(3)).padStart(6, '0')}`}`);
    //javljamo obavijest da je igra gotova
    
}


function vrijeme() {
    //izračunavam vrijeme koje je prošlo od početka kako bih ga prikazivao na ekranu
    vrijemekojejeproslo = new Date().getTime() - pocetnovrijeme;
    moj_kontekst.font = "16px Arial";//postavke za timere
    moj_kontekst.fillStyle = "black";
    //dodavanje timera na zaslon, u gornji lijevi kut
    //mora se preračunati vrijeme, a to radimo pomoću funkcije pripremazaprikaz
    moj_kontekst.fillText(`Trenutno vrijeme: ${(Math.floor(vrijemekojejeproslo / 60000)).toString().padStart(2, '0')}:${ (((vrijemekojejeproslo % 60000) / 1000).toFixed(3)).padStart(6, '0')}`, 10, 20);
    moj_kontekst.fillText(`Najbolje vrijeme: ${`${(Math.floor(najboljeVrijeme / 60000)).toString().padStart(2, '0')}:${(((najboljeVrijeme % 60000) / 1000).toFixed(3)).padStart(6, '0')}`}`, 10, 40);
}




//pokretanje igre
function pokretanjeIgre() {
    
    moj_kontekst.clearRect(0, 0, moj_canvas.width, moj_canvas.height);
    //generiramo pocetnoVrijeme ako ga nemamo, odnosno ako nije definirano
    if (!pocetnovrijeme) {
            pocetnovrijeme = new Date().getTime();
    }
    //prikaz vremena
    vrijeme();
    
    //pozivanja funkcije za dodavanje elemenata,
    //kretanje napadaca(kretanje igraca ostvarujemo pomocu tipkovnice i strelica)
    //i funkcije za provjeru sudara
    dodavanjeobjekata();
    kretanjenapadaca();
    
    //omogucavanje izvodenje animacija
    requestAnimationFrame(pokretanjeIgre);
}
//pokrecemo igru 
pokretanjeIgre();