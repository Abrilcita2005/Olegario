// Medidas de la barra inferior y del botón Novedades (Figma, frame de 402 px).
export const BARRA = {
  alto: 52,
  separacionInferior: 30,
  margenLateral: 30,
};

export const BOTON_NOVEDADES = {
  alto: 45,
  separacionSobreBarra: 18,
  margenDerecho: 32,
};

// Espacio que el contenido desplazable debe dejar libre abajo para no quedar tapado.
export const ESPACIO_INFERIOR_CONTENIDO =
  BARRA.separacionInferior +
  BARRA.alto +
  BOTON_NOVEDADES.separacionSobreBarra +
  BOTON_NOVEDADES.alto +
  24;
