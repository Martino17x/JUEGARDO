const tablero = document.getElementById('tablero');
const mensaje = document.getElementById('mensaje');
const btnReiniciar = document.getElementById('reiniciar');
const pantallaVictoria = document.getElementById('pantallaVictoria');

let imagenes = [
    'img/1.png',
  'img/2.png',
  'img/3.jpg',
  'img/4.png',
  'img/5.png'
];

let cartas = [];
let cartasVolteadas = [];
let bloqueo = false;

function mezclar(array) {
  return array.sort(() => 0.5 - Math.random());
}

function crearTablero() {
  tablero.innerHTML = '';
  mensaje.textContent = '';
  pantallaVictoria.classList.add('oculto');
  cartasVolteadas = [];
  bloqueo = false;

  const pares = [...imagenes, ...imagenes];
  cartas = mezclar(pares);

  cartas.forEach((src, i) => {
    const carta = document.createElement('div');
    carta.classList.add('carta');
    carta.dataset.valor = src;

    const inner = document.createElement('div');
    inner.classList.add('inner');

    const frente = document.createElement('div');
    frente.classList.add('frente');
    const imgFrente = document.createElement('img');
    imgFrente.src = src;
    frente.appendChild(imgFrente);

    const dorso = document.createElement('div');
    dorso.classList.add('dorso');
    dorso.textContent = '⚽';

    inner.appendChild(frente);
    inner.appendChild(dorso);
    carta.appendChild(inner);

    carta.addEventListener('click', manejarClick);
    tablero.appendChild(carta);
  });
}

function manejarClick(e) {
  const carta = e.currentTarget;
  if (bloqueo || carta.classList.contains('revelada')) return;

  carta.classList.add('revelada');
  cartasVolteadas.push(carta);

  if (cartasVolteadas.length === 2) {
    bloqueo = true;
    const [c1, c2] = cartasVolteadas;
    const v1 = c1.dataset.valor;
    const v2 = c2.dataset.valor;

    if (v1 === v2) {
      cartasVolteadas = [];
      bloqueo = false;
      verificarGanador();
    } else {
      setTimeout(() => {
        c1.classList.remove('revelada');
        c2.classList.remove('revelada');
        cartasVolteadas = [];
        bloqueo = false;
      }, 1000);
    }
  }
}

function verificarGanador() {
  const todas = [...document.querySelectorAll('.carta')];
  const ganaste = todas.every(carta => carta.classList.contains('revelada'));

  if (ganaste) {
    mensaje.textContent = '¡Ganaste crack! 🎉';
    pantallaVictoria.classList.remove('oculto');
  }
}

btnReiniciar.addEventListener('click', crearTablero);

crearTablero();