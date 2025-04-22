const tablero = document.getElementById('tablero');
const mensaje = document.getElementById('mensaje');
const btnReiniciar = document.getElementById('reiniciar');

let cartas = ['🍎', '🍌', '🍇', '🍉', '🍎', '🍌', '🍇', '🍉'];
let cartasVolteadas = [];
let bloqueo = false;

let tiempo = 0;
let intervalo = null;

function mezclar(array) {
  return array.sort(() => 0.5 - Math.random());
}

function crearTablero() {
  tablero.innerHTML = '';
  cartasVolteadas = [];
  bloqueo = false;
  mensaje.textContent = '';
  cartas = mezclar(cartas);
  
  cartas.forEach((emoji, i) => {
    const carta = document.createElement('div');
    carta.classList.add('carta');
    carta.dataset.valor = emoji;
    carta.dataset.index = i;
    carta.textContent = '';
    carta.addEventListener('click', manejarClick);
    tablero.appendChild(carta);
  });

  iniciarTemporizador();  // Iniciamos el temporizador al reiniciar el juego
}

function manejarClick(e) {
  const carta = e.target;
  if (bloqueo || carta.classList.contains('revelada')) return;

  revelarCarta(carta);
  cartasVolteadas.push(carta);

  if (cartasVolteadas.length === 2) {
    bloqueo = true;
    const [carta1, carta2] = cartasVolteadas;

    if (carta1.dataset.valor === carta2.dataset.valor) {
      carta1.classList.add('revelada');
      carta2.classList.add('revelada');
      cartasVolteadas = [];
      bloqueo = false;
      verificarGanador();
    } else {
      setTimeout(() => {
        ocultarCarta(carta1);
        ocultarCarta(carta2);
        cartasVolteadas = [];
        bloqueo = false;
      }, 1000);
    }
  }
}

function revelarCarta(carta) {
  carta.textContent = carta.dataset.valor;
  carta.style.backgroundColor = '#fff';
  carta.style.color = '#000';
}

function ocultarCarta(carta) {
  carta.textContent = '';
  carta.style.backgroundColor = '#444';
  carta.style.color = 'white';
}

function verificarGanador() {
  const todasReveladas = [...document.querySelectorAll('.carta')].every(c =>
    c.classList.contains('revelada')
  );

  if (todasReveladas) {
    mensaje.textContent = '¡Ganaste! 🎉';
    detenerTemporizador();  // Detener el temporizador cuando el jugador gana
  }
}

function iniciarTemporizador() {
  tiempo = 0;
  document.getElementById('tiempo').textContent = tiempo;
  intervalo = setInterval(() => {
    tiempo++;
    document.getElementById('tiempo').textContent = tiempo;
  }, 1000);
}

function detenerTemporizador() {
  clearInterval(intervalo);
}

btnReiniciar.addEventListener('click', crearTablero);

crearTablero(); // Inicializar al cargar
