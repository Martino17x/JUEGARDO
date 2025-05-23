let mazo = [];
let columnas = [[], [], [], [], [], [], []];
let movimientos = 0;
let tiempo = 0;
let intervalo;
let partidasGanadas = parseInt(localStorage.getItem("partidasGanadas")) || 0;

function crearMazo() {
    const palos = ['♠', '♥', '♦', '♣'];
    const valores = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    let nuevoMazo = [];

    for (let palo of palos) {
        for (let valor of valores) {
            nuevoMazo.push({ valor, palo, visible: false });
        }
    }

    return nuevoMazo.sort(() => Math.random() - 0.5);
}

function repartirCartas() {
    columnas = [[], [], [], [], [], [], []];
    for (let i = 0; i < 7; i++) {
        for (let j = 0; j <= i; j++) {
            let carta = mazo.pop();
            if (j === i) carta.visible = true;
            columnas[i].push(carta);
        }
    }
}

function renderizarColumnas() {
    const areaColumnas = document.querySelectorAll(".tableau");
    areaColumnas.forEach((columnaHTML, index) => {
        columnaHTML.innerHTML = '';
        columnas[index].forEach((carta, i) => {
            let cartaDiv = document.createElement("div");
            cartaDiv.className = "carta";
            cartaDiv.classList.add((carta.palo === '♥' || carta.palo === '♦') ? "rojo" : "negro");
            cartaDiv.innerText = carta.visible ? carta.valor + carta.palo : "🂠";
            if (carta.visible && i === columnas[index].length - 1) {
                cartaDiv.setAttribute("draggable", true);
                cartaDiv.ondragstart = (e) => {
                    e.dataTransfer.setData("source-col", index);
                    e.dataTransfer.setData("carta", JSON.stringify(carta));
                };
            }
            columnaHTML.appendChild(cartaDiv);
        });

        columnaHTML.ondragover = (e) => e.preventDefault();
        columnaHTML.ondrop = (e) => {
            e.preventDefault();
            const sourceIndex = parseInt(e.dataTransfer.getData("source-col"));
            const cartaData = JSON.parse(e.dataTransfer.getData("carta"));
            const destino = columnas[index];
            const cima = destino[destino.length - 1];

            if (puedeMover(cartaData, cima)) {
                const cartaMovida = columnas[sourceIndex].pop();
                columnas[index].push(cartaMovida);
                if (columnas[sourceIndex].length > 0) {
                    columnas[sourceIndex][columnas[sourceIndex].length - 1].visible = true;
                }
                incrementarMovimientos();
                renderizarColumnas();
            }
        };
    });
}

function puedeMover(carta, cima) {
    if (!cima) return carta.valor === 'K'; // Solo un Rey puede ir en columna vacía
    const colores = { '♠': 'negro', '♣': 'negro', '♥': 'rojo', '♦': 'rojo' };
    const valores = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    const valorCarta = valores.indexOf(carta.valor);
    const valorCima = valores.indexOf(cima.valor);
    return colores[carta.palo] !== colores[cima.palo] && valorCarta === valorCima + 1;
}

function mostrarMazo() {
    const deck = document.getElementById("deck");
    deck.innerHTML = '';
    let carta = document.createElement("div");
    carta.className = "carta";
    carta.innerText = "🂠";
    carta.onclick = robarCarta;
    deck.appendChild(carta);
}

function robarCarta() {
    if (mazo.length > 0) {
        const carta = mazo.pop();
        carta.visible = true;
        const waste = document.getElementById("waste");
        let cartaDiv = document.createElement("div");
        cartaDiv.className = "carta " + ((carta.palo === '♥' || carta.palo === '♦') ? "rojo" : "negro");
        cartaDiv.innerText = carta.valor + carta.palo;
        cartaDiv.setAttribute("draggable", true);
        cartaDiv.ondragstart = (e) => {
            e.dataTransfer.setData("carta", JSON.stringify(carta));
            e.dataTransfer.setData("source-col", -1);
        };
        waste.innerHTML = '';
        waste.appendChild(cartaDiv);
        incrementarMovimientos();
    }
}

function incrementarMovimientos() {
    movimientos++;
    document.getElementById("movimientos").innerText = movimientos;
}

function actualizarTiempo() {
    tiempo++;
    const minutos = String(Math.floor(tiempo / 60)).padStart(2, '0');
    const segundos = String(tiempo % 60).padStart(2, '0');
    document.getElementById("tiempo").innerText = `${minutos}:${segundos}`;
}

function mostrarPartidasGanadas() {
    const contador = document.getElementById("contadorGanadas");
    if (!contador) {
        const span = document.createElement("span");
        span.id = "contadorGanadas";
        span.innerText = "Partidas ganadas: " + partidasGanadas;
        document.getElementById("controls").appendChild(span);
    } else {
        contador.innerText = "Partidas ganadas: " + partidasGanadas;
    }
}

function reiniciarJuego() {
    movimientos = 0;
    tiempo = 0;
    mazo = crearMazo();
    repartirCartas();
    renderizarColumnas();
    mostrarMazo();
    document.getElementById("movimientos").innerText = movimientos;
    document.getElementById("tiempo").innerText = "00:00";
    document.getElementById("waste").innerHTML = '';
    if (intervalo) clearInterval(intervalo);
    intervalo = setInterval(actualizarTiempo, 1000);
    mostrarPartidasGanadas();
}

window.onload = reiniciarJuego;
