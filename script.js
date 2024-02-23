// Parámetros
const params = {
  imgSrc: 'mosquito.gif',
  velocidadMin: 1,
  velocidadMax: 5,
  tamanioMin: 20,
  tamanioMax: 70,
  cantInicialMin: 3,
  cantInicialMax: 10,
  cantMax: 70,
  opacidadMin: 0.1,
  opacidadMax: 1
};

// Audio
const audio = document.getElementById('audio');
audio.volume = 0.3;

// Array para almacenar los mosquitos
let mosquitos = [];

// Función para generar un mosquito
function generarMosquito() {
  let direccion = Math.random() < 0.5 ? 1 : -1;
  let velocidad = Math.random() * (params.velocidadMax - params.velocidadMin) + params.velocidadMin;
  let tamanio = Math.random() * (params.tamanioMax - params.tamanioMin) + params.tamanioMin;
  const mosquito = document.createElement('img');

  // 0.5% de probabilidad de que sea un mosquito gigante
  if (Math.random() < 0.01) {
    const anchoViewport = window.innerWidth;
    tamanio = '400';
    // (Celulares) Si el tamaño del mosquito es mayor al ancho del viewport, reducirlo
    if (tamanio >= anchoViewport) tamanio = anchoViewport * .8;
    mosquito.style.zIndex = '1000';
  }
  mosquito.style.position = 'fixed';
  mosquito.src = params.imgSrc;
  mosquito.style.width = tamanio + 'px';


  
  // Posicionar el mosquito fuera del viewport
  const posicion = Math.floor(Math.random() * 4); // 0, 1, 2, o 3
  switch (posicion) {
    case 0: // Izquierda
      mosquito.style.left = `-${mosquito.width}px`;
      mosquito.style.top = Math.random() * (window.innerHeight - parseFloat(mosquito.height)) + 'px';
      break;
    case 1: // Derecha
      mosquito.style.left = `${window.innerWidth+mosquito.width}px`;
      mosquito.style.top = Math.random() * (window.innerHeight - parseFloat(mosquito.height)) + 'px';
      break;
    case 2: // Arriba
      mosquito.style.left = Math.random() * (window.innerWidth - parseFloat(mosquito.width)) + 'px';
      mosquito.style.top = `-${mosquito.height}px`;
      break;
    case 3: // Abajo
      // mosquito.style.left = Math.random() * (window.innerWidth - parseFloat(mosquito.width)) + 'px';
      // mosquito.style.top = `${window.innerHeight+mosquito.height}px`;
      mosquito.style.left = Math.random() * (window.innerWidth - parseFloat(mosquito.width)) + 'px';
      mosquito.style.top = `-${mosquito.height}px`;
      break;
  }
  
  // Setear la opacidad basada en el tamaño del mosquito
  const rangoTamanio = params.tamanioMax - params.tamanioMin;
  const normalizado = (tamanio - params.tamanioMin) / rangoTamanio;

  const rangoOpacidad = params.opacidadMax - params.opacidadMin;
  const opacidad =  params.opacidadMin + (normalizado * rangoOpacidad);
  mosquito.style.opacity = opacidad;

  // // Setear el blur basado en el tamaño del mosquito, pero solo a los mosquitos pequeños
  // if (normalizado < 0.5) {
  //   const blur = 2 - (normalizado * 2);
  //   mosquito.style.filter = `blur(${blur}px)`;
  // }

  // Setear saturación aleatoria
  // const rndSat = Math.random() * 1.5;
  // mosquito.style.filter = `saturate(${rndSat})`;

  
  mosquito.addEventListener('click', (event) => {
    event.stopPropagation();
    aplastarMosquito(mosquito);
  });

  mosquito.addEventListener('mousedown', (event) => {
    event.stopPropagation();
    aplastarMosquito(mosquito);
  });

  mosquito.addEventListener('touchstart', (event) => {
    event.stopPropagation();
    aplastarMosquito(mosquito);
  });

  // Deshabilitar el arrastre cuando se mueve el mouse
  mosquito.addEventListener('dragstart', (event) => {
    event.preventDefault();
  });

  document.body.appendChild(mosquito);

  mosquitos.push({
      elemento: mosquito,
      velocidadX: direccion * velocidad,
      velocidadY: direccion * velocidad,
      imgSrc: params.imgSrc,
      isDead: false
  });
}

// Aplastar mosquito haciendo un efecto de cambio de imagen
function aplastarMosquito(mosquito) {
  const foundMosquito = mosquitos.find(m => m.elemento === mosquito);
  if (!foundMosquito || foundMosquito.isDead) return;
  foundMosquito.isDead = true;
  foundMosquito.imgSrc = 'aplastado.gif';
  detenerMosquito(mosquito);
  audio.pause(); // Pausar el sonido
  audio.currentTime = 0; // Volver al principio del audio
  audio.play();
  setTimeout(() => eliminarMosquito(mosquito), 3000);
}

// Eliminar un mosquito del DOM y del array
function eliminarMosquito(mosquito) {
  const indexMosquito = mosquitos.findIndex(m => m.elemento === mosquito);
  if (indexMosquito !== -1) {
    mosquito.parentNode.removeChild(mosquito); // Elimino el mosquito del DOM
    mosquitos.splice(indexMosquito, 1); // Elimino el mosquito del array
  }
}

// Detener un mosquito
function detenerMosquito(mosquito) {
  const foundMosquito = mosquitos.find(m => m.elemento === mosquito);
  foundMosquito.velocidadX = 0;
  foundMosquito.velocidadY = 0;
}


// Función para actualizar la posición de los mosquitos
function actualizarMosquitos() {
  mosquitos.forEach(mosquito => {
      let x = parseFloat(mosquito.elemento.style.left);
      let y = parseFloat(mosquito.elemento.style.top);
      let ancho = parseFloat(mosquito.elemento.style.width);
      let alto = mosquito.elemento.offsetHeight * (ancho / mosquito.elemento.offsetWidth); // Mantener la relación de aspecto
      x += mosquito.velocidadX;
      y += mosquito.velocidadY;

      const quedarseParado = Math.random() < 0.30 ? true : false; // 30% de probabilidad de quedarse parado
      if (quedarseParado && mosquito.velocidadX !== 0 && mosquito.velocidadY > 0 && y + alto >= window.innerHeight) {
        mosquito.velocidadX = 0;
        mosquito.velocidadY = 0;
        const rndTime = Math.floor(Math.random() * (6000 - 1000 + 1)) + 1000; // Tiempo aleatorio entre 1 y 6 segundos
        setTimeout(() => {
          if (mosquito.isDead) return;
          mosquito.velocidadX = getRandomVelocidad()
          mosquito.velocidadY = -1 * Math.abs(getRandomVelocidad())
        }, rndTime);
      }


      // Colisiones con bordes laterales de la pantalla
      if (mosquito.velocidadX !== 0) {
          const rnd = getRandomVelocidad();
          if (x < 0) {
            mosquito.left = 0;
            mosquito.velocidadX = Math.abs(rnd);
          }
          if (x + ancho >= window.innerWidth) {
            mosquito.left = window.innerWidth - ancho;
            mosquito.velocidadX = -1 * Math.abs(rnd);
          }
      }

      // Colisiones con bordes superior e inferior de la pantalla
      if (mosquito.velocidadY !== 0) {
          const rnd = getRandomVelocidad();
          if (y < 0) {
            mosquito.top = 0;
            mosquito.velocidadY = Math.abs(rnd);
          }
          if (y + alto >= window.innerHeight) {
            mosquito.top = window.innerHeight - alto;
            mosquito.velocidadY = -1 * Math.abs(rnd);
          }
      }

      // Si el mosquito está muerto, restablecer la saturación
      if (mosquito.isDead) {
        // mosquito.elemento.style.filter = 'saturate(1)';
      }
      
      // Si esta reposado en el suelo, reposicionarlo segun el resize de viewport
      if (!mosquito.isDead && mosquito.velocidadX === 0 && mosquito.velocidadY === 0 ) {
        y = window.innerHeight - alto;
      }

      if (mosquito.velocidadX > 0) {
        transformScaleX = 'scaleX(1)';
      }
      if (mosquito.velocidadX < 0) {
        transformScaleX = 'scaleX(-1)';
      }

      if (mosquito.velocidadX === 0) transformRotate = 'rotate(0deg)';
      if (mosquito.velocidadX !== 0) transformRotate = `rotate(${(Math.abs(mosquito.velocidadX)*50)/params.velocidadMax}deg)`;

      mosquito.elemento.style.left = x + 'px';
      mosquito.elemento.style.top = y + 'px';

      if (!mosquito.isDead && transformScaleX && transformRotate) mosquito.elemento.style.transform = `${transformScaleX} ${transformRotate}`;

      // Setear el gif sólo cuando sea necesario para evitar que se reinicie y parezca una imagen estática
      const partesURL = mosquito.elemento.src.split("/");
      const htmlImgSrc = partesURL[partesURL.length - 1];
      if (htmlImgSrc !== mosquito.imgSrc) mosquito.elemento.src = mosquito.imgSrc;
  });
}

function getRandomVelocidad() {
  return Math.random() * (params.velocidadMax - params.velocidadMin) + params.velocidadMin;
}

// Función de animación
function animar() {
  actualizarMosquitos();
  document.title = `Mosquitos (${mosquitos.length}) 🦟`;
  const porcentaje = Math.floor((mosquitos.length / params.cantMax) * 100);
  document.querySelector('#info').innerText = `🦟 ${mosquitos.length} (${porcentaje}%)`;
  window.requestAnimationFrame(animar);
}

// Función para matar a todos los mosquitos
function killAllMosquitos() {
  mosquitos.forEach(mosquito => {
    aplastarMosquito(mosquito.elemento);
  });
  init();
}

// Iniciar la animación
function init() {
  const cantidadMosquitosInicial = Math.floor(Math.random() * (params.cantInicialMax - params.cantInicialMin + 1)) + params.cantInicialMin;
  for(let i = 0; i < cantidadMosquitosInicial; i++) {
    generarMosquito();
  }
}

init();
animar();

const timer = setInterval(() => {
  if (mosquitos.length < params.cantMax) generarMosquito();
}, 2000);