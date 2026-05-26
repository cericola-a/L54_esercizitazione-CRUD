// ========================================
// LEZIONE 54 - ESERCIZIO CRUD
// fetch + json-server@0.17.4
// ========================================
// Obiettivo:
// leggere, creare, modificare ed eliminare dati usando fetch.
//
// Prima di iniziare:
// 1. Apri il terminale nella cartella L54.
// 2. Esegui: npm install
// 3. Esegui: npm run server
// 4. Apri index.html con Live Server.
//
// Regole importanti:
// - Vietato usare location.reload() o altri reload della pagina.
// - Vietato usare setTimeout per aspettare le risposte del server.
// - Per aggiornare la pagina dopo POST, PUT e DELETE usa .then() e richiama caricaLibri().
// ========================================

const API_URL = "http://localhost:3000/libri";

const titoloInput = document.querySelector("#titolo");
const autoreInput = document.querySelector("#autore");
const lettoSelect = document.querySelector("#letto");
const salvaBtn = document.querySelector("#salvaBtn");
const caricaBtn = document.querySelector("#caricaBtn");
const messaggio = document.querySelector("#messaggio");
const listaLibri = document.querySelector("#listaLibri");


// =============================
// ESERCIZIO 1 - READ
// =============================
// Completa la funzione caricaLibri().
//
// Requisiti:
// 1. Fai una richiesta GET a API_URL.
// 2. Converti la risposta in JSON.
// 3. Svuota listaLibri.
// 4. Per ogni libro ricevuto, crea un elemento <li>.
// 5. Dentro ogni <li> mostra:
//    - titolo
//    - autore
//    - stato: "letto" oppure "da leggere"
//    - un bottone "Cambia stato"
//    - un bottone "Elimina"

function caricaLibri() {
    messaggio.innerText = 'Caricamento in corso...'
    listaLibri.innerHTML = "";
    
    fetch(API_URL)
        .then(response => {
            if (!response.ok) throw new Error(response.statusText);
            return response.json()
        })
        .then(libri => {
            messaggio.innerText = '';

            libri.forEach(l => {
                const li = document.createElement('li');
                const stato = l.letto ? 'Letto' : 'Da leggere'
                li.innerHTML = `<strong>${l.titolo}</strong> - ${l.autore}. Stato: ${stato}`

                const btnCambia = document.createElement("button");
                btnCambia.textContent = "Cambia stato";
                btnCambia.addEventListener("click", () =>  cambiaStato(l));

                const btnElimina = document.createElement("button");
                btnElimina.textContent = "Elimina";
                btnElimina.addEventListener("click", () => eliminaLibro(l.id))

                li.append(btnCambia, btnElimina);
                listaLibri.append(li)
            })

        })
}


// =============================
// EXTRA - CARICAMENTO IN CORSO
// =============================
// Mostra il testo "Caricamento in corso..." mentre aspetti la risposta del server.
//
// Suggerimento:
// 1. Prima della fetch, scrivi il messaggio dentro messaggio.innerText.
// 2. Quando i dati arrivano, svuota messaggio.innerText.
// 3. Non usare setTimeout: il messaggio deve sparire dentro il .then().


// =============================
// ESERCIZIO 2 - CREATE
// =============================
// Completa la funzione creaLibro().
//
// Requisiti:
// 1. Leggi titolo, autore e letto dagli input.
// 2. Crea un oggetto nuovoLibro.
// 3. Fai una richiesta POST a API_URL.
// 4. Usa gli header corretti per inviare JSON.
// 5. Dopo il salvataggio, richiama caricaLibri().

function creaLibro() {
    const nuovoLibro = {
        titolo: titoloInput.value,
        autore: autoreInput.value,
        letto: lettoSelect.value === true
    }

    fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuovoLibro)
    })
    .then(response => {
            if (!response.ok) throw new Error(response.statusText);
            return response.json()
        })
        .then(caricaLibri)
}


// =============================
// ESERCIZIO 3 - UPDATE
// =============================
// Completa la funzione cambiaStato(libro).
//
// Requisiti:
// 1. Crea una copia del libro ricevuto.
// 2. Inverti il valore della proprieta' letto.
// 3. Fai una richiesta PUT a API_URL + "/" + libro.id.
// 4. Dopo la modifica, richiama caricaLibri().

function cambiaStato(libro) {
    const libroCopia = { ...libro, letto: !libro.letto };

    fetch(API_URL + "/" + libro.id, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(libroCopia)
    })
    .then(() => caricaLibri());
}


// =============================
// ESERCIZIO 4 - DELETE
// =============================
// Completa la funzione eliminaLibro(id).
//
// Requisiti:
// 1. Fai una richiesta DELETE a API_URL + "/" + id.
// 2. Dopo l'eliminazione, richiama caricaLibri().

function eliminaLibro(id) {
    fetch(API_URL + "/" + id, {
        method: "DELETE"
    })
    .then(response => {
        if (!response.ok) throw new Error(response.statusText);
    })
    .then(caricaLibri);
}


// =============================
// EVENTI
// =============================
salvaBtn.addEventListener("click", creaLibro);
caricaBtn.addEventListener("click", caricaLibri);

caricaLibri();
