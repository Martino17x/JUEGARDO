
const canvas = document.getElementById('lienzoJuego');
const ctx = canvas.getContext('2d');

const GRAVEDAD = 0.5;
const SALTO = -8;
const ANCHO_TUBO = 60;
const HUECO_TUBO = 150;
const VELOCIDAD_TUBO = 2;
const ALTURA_SUELO = 100;

let pajaro = { x: 80, y: 150, ancho: 40, alto: 40, velocidad: 0 };
let tubos = [];
let puntuacion = 0;
let mejorPuntuacion = localStorage.getItem('mejorPuntuacion') || 0;
let juegoTerminado = false;

const imagenPajaro = new Image();
imagenPajaro.src = "pajaro.png";

const imagenSuelo = new Image();
imagenSuelo.src = "suelo.png";

const musicaFondo = document.getElementById('musicaFondo');
let musicaIniciada = false;

let desplazamientoSuelo = 0;

function reiniciarJuego() {
  pajaro.y = 150;
  pajaro.velocidad = 0;
  tubos = [];
  puntuacion = 0;
  juegoTerminado = false;
  desplazamientoSuelo = 0;
  generarTubo();
}

function generarTubo() {
  let alturaSuperior = Math.random() * (canvas.height - ALTURA_SUELO - HUECO_TUBO - 100) + 50;
  tubos.push({
    x: canvas.width,
    superior: alturaSuperior,
    inferior: canvas.height - alturaSuperior - HUECO_TUBO - ALTURA_SUELO
  });
}

function actualizar() {
  if (juegoTerminado) return;

  pajaro.velocidad += GRAVEDAD;
  pajaro.y += pajaro.velocidad;

  if (pajaro.y + pajaro.alto / 2 > canvas.height - ALTURA_SUELO || pajaro.y - pajaro.alto / 2 < 0) {
    terminarJuego();
  }

  tubos.forEach((t, i) => {
    t.x -= VELOCIDAD_TUBO;
    if (t.x + ANCHO_TUBO < 0) {
      tubos.splice(i, 1);
      generarTubo();
      puntuacion++;
      if (puntuacion > mejorPuntuacion) {
        mejorPuntuacion = puntuacion;
        localStorage.setItem('mejorPuntuacion', mejorPuntuacion);
      }
    }
    if (t.x < pajaro.x + pajaro.ancho / 2 && t.x + ANCHO_TUBO > pajaro.x - pajaro.ancho / 2) {
      if (pajaro.y - pajaro.alto / 2 < t.superior || pajaro.y + pajaro.alto / 2 > canvas.height - t.inferior - ALTURA_SUELO) {
        terminarJuego();
      }
    }
  });

  desplazamientoSuelo -= VELOCIDAD_TUBO;
  if (desplazamientoSuelo <= -canvas.width) desplazamientoSuelo = 0;
}

function dibujar() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Tubos con detalle estético
  tubos.forEach(t => {
    const gradArriba = ctx.createLinearGradient(t.x, 0, t.x + ANCHO_TUBO, 0);
    gradArriba.addColorStop(0, "#006400");
    gradArriba.addColorStop(1, "#32CD32");
    ctx.fillStyle = gradArriba;
    ctx.fillRect(t.x, 0, ANCHO_TUBO, t.superior);
    ctx.strokeStyle = "#003300";
    ctx.lineWidth = 2;
    ctx.strokeRect(t.x, 0, ANCHO_TUBO, t.superior);

    const gradAbajo = ctx.createLinearGradient(t.x, 0, t.x + ANCHO_TUBO, 0);
    gradAbajo.addColorStop(0, "#006400");
    gradAbajo.addColorStop(1, "#32CD32");
    ctx.fillStyle = gradAbajo;
    ctx.fillRect(t.x, canvas.height - t.inferior - ALTURA_SUELO, ANCHO_TUBO, t.inferior);
    ctx.strokeStyle = "#003300";
    ctx.lineWidth = 2;
    ctx.strokeRect(t.x, canvas.height - t.inferior - ALTURA_SUELO, ANCHO_TUBO, t.inferior);
  });

  // Pájaro con imagen
  if (imagenPajaro.complete) {
    ctx.drawImage(imagenPajaro, pajaro.x - pajaro.ancho / 2, pajaro.y - pajaro.alto / 2, pajaro.ancho, pajaro.alto);
  }

  // Suelo con imagen repetida
  if (imagenSuelo.complete) {
    for (let x = desplazamientoSuelo; x < canvas.width; x += imagenSuelo.width) {
      ctx.drawImage(imagenSuelo, x, canvas.height - ALTURA_SUELO, imagenSuelo.width, ALTURA_SUELO);
    }
  } else {
    ctx.fillStyle = "#8B4513";
    ctx.fillRect(0, canvas.height - ALTURA_SUELO, canvas.width, ALTURA_SUELO);
  }

  // Puntuación
  ctx.fillStyle = "white";
  ctx.font = "24px Arial";
  ctx.fillText("Puntos: " + puntuacion, canvas.width - 140, 40);
  ctx.fillText("Récord: " + mejorPuntuacion, canvas.width - 140, 70);

  if (juegoTerminado) {
    ctx.fillStyle = "red";
    ctx.font = "36px Arial";
    ctx.fillText("FIN DEL JUEGO", canvas.width / 2 - 120, canvas.height / 2);
    ctx.font = "24px Arial";
    ctx.fillText("Haz clic o pulsa para reiniciar", canvas.width / 2 - 140, canvas.height / 2 + 40);
  }
}

function bucle() {
  actualizar();
  dibujar();
  requestAnimationFrame(bucle);
}

function terminarJuego() {
  juegoTerminado = true;
}

function saltar() {
  if (!musicaIniciada) {
    musicaFondo.play();
    musicaIniciada = true;
  }
  if (juegoTerminado) {
    reiniciarJuego();
    return;
  }
  pajaro.velocidad = SALTO;
}

document.addEventListener('keydown', saltar);
document.addEventListener('mousedown', saltar);
document.addEventListener('touchstart', saltar);

reiniciarJuego();
bucle();
