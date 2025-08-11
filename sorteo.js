// --- Dependencias mínimas para probar el sorteo ---
let listaAmigos = [];

function asignarTextoElemento(sel, texto) {
  const el = document.querySelector(sel);
  if (el) el.textContent = texto;
}

function mostrarResultado(nombre) {
  asignarTextoElemento('#estado', '🎉 Ganador: ' + nombre);
}

function agregarAmigo(nombre) {
  if (nombre && !listaAmigos.includes(nombre)) {
    listaAmigos.push(nombre);
  }
}

function limpiarLista() {
  listaAmigos = [];
}

function eliminarAmigo(nombre) {
  listaAmigos = listaAmigos.filter(n => n !== nombre);
}

// --- Pega aquí el código de sorteo sin repetición (tu script original) ---

/** Pila de sorteables de la ronda actual (barajados) */
let _pendientesRonda = [];

/** Fisher–Yates (in place) */
function _barajar(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/** Reinicia la ronda con la lista actual (si hay >=2) */
function _resetRonda() {
  _pendientesRonda = [];
  if (listaAmigos.length >= 2) {
    _pendientesRonda = _barajar([...listaAmigos]); // copia barajada
  }
  // Opcional: indica cuántos quedan
  const quedan = _pendientesRonda.length;
  if (quedan) asignarTextoElemento('#estado', `Nueva ronda: ${quedan} por sortear.`);
}

/** Hook: cada cambio estructural de la lista reinicia la ronda */
const __agregarAmigo = agregarAmigo;
agregarAmigo = function (nombre) {
  __agregarAmigo(nombre);
  _resetRonda();
};

const __limpiarLista = limpiarLista;
limpiarLista = function () {
  __limpiarLista();
  _resetRonda();
};

if (typeof eliminarAmigo === 'function') {
  const __eliminarAmigo = eliminarAmigo;
  eliminarAmigo = function (nombre) {
    __eliminarAmigo(nombre);
    _resetRonda();
  };
}

/** Reemplaza tu sortearAmigo por este */
function sortearAmigo() {
  if (listaAmigos.length < 2) {
    asignarTextoElemento('#estado', 'Agrega al menos 2 nombres para sortear.');
    return;
  }

  // Si aún no hay ronda preparada (o se vació), prepárala
  if (_pendientesRonda.length === 0) {
    _resetRonda();
    if (_pendientesRonda.length === 0) return;
  }

  const ganador = _pendientesRonda.pop();
  mostrarResultado(ganador);

  // Estado: cuántos quedan
  const quedan = _pendientesRonda.length;
  if (quedan > 0) {
    asignarTextoElemento('#estado', `🎉 Ganador: ${ganador}<br>Quedan ${quedan} por sortear en esta ronda.`);
  } else {
    asignarTextoElemento('#estado', `🎉 Ganador: ${ganador}<br>¡Ronda completada! Se reiniciará automáticamente en el próximo sorteo.`);
  }
}

// Inicializa la ronda al cargar
document.addEventListener('DOMContentLoaded', () => {
  _resetRonda();
});