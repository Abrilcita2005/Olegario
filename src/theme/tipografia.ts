import type { TextStyle } from 'react-native';

import { familias } from './fuentes';

// Escala tipográfica tomada de Figma (docs/DISENO.md §C.3).
// Títulos en Poppins (como en Figma). Manrope / Montserrat / DM Sans → Inter, con el mismo peso (decisión aprobada).
// Las fuentes propias no admiten fontWeight: el peso lo da la familia.
export const tipografia = {
  // Títulos y destacados (Poppins)
  display: { fontFamily: familias.poppinsBlack, fontSize: 30, lineHeight: 36 },
  tituloPantalla: {
    fontFamily: familias.poppinsBlack,
    fontSize: 26,
    lineHeight: 32.5,
    letterSpacing: -0.65,
  },
  tituloAcceso: {
    fontFamily: familias.poppinsExtraBold,
    fontSize: 28,
    lineHeight: 34,
    letterSpacing: -0.28,
  },
  tituloSeccion: {
    fontFamily: familias.poppinsExtraBold,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: -0.4,
    textTransform: 'uppercase',
  },
  tituloTarjeta: { fontFamily: familias.poppinsBold, fontSize: 16, lineHeight: 24 },
  tituloBienvenida: { fontFamily: familias.poppinsBold, fontSize: 17, lineHeight: 22 },
  tituloConsentimiento: { fontFamily: familias.poppinsExtraBold, fontSize: 20, lineHeight: 22 },
  tituloReencuentro: {
    fontFamily: familias.poppinsExtraBold,
    fontSize: 22,
    lineHeight: 30,
    letterSpacing: -0.28,
  },
  tituloDestacado: {
    fontFamily: familias.poppinsBlackItalic,
    fontSize: 25,
    // 31 y no 25 (Figma): con 25, en el iPhone se cortaba arriba la cursiva y las tildes (Etapa 14).
    lineHeight: 31,
    letterSpacing: -0.625,
    textTransform: 'uppercase',
  },
  categoria: {
    fontFamily: familias.poppinsExtraBold,
    fontSize: 11,
    lineHeight: 16.5,
    letterSpacing: 0.55,
    textTransform: 'uppercase',
  },

  // Texto continuo (Inter)
  cita: {
    fontFamily: familias.interExtraBold,
    fontSize: 18,
    lineHeight: 22.5,
    letterSpacing: -0.45,
  },
  cuerpo: { fontFamily: familias.interRegular, fontSize: 14, lineHeight: 21 },
  cuerpoDestacado: { fontFamily: familias.interExtraBold, fontSize: 14, lineHeight: 21 },
  cuerpoChico: { fontFamily: familias.interRegular, fontSize: 13, lineHeight: 18 },
  cuerpoChicoDestacado: { fontFamily: familias.interExtraBold, fontSize: 13, lineHeight: 18 },
  cuerpoMedio: { fontFamily: familias.interSemiBold, fontSize: 14, lineHeight: 19 },
  citaAcceso: { fontFamily: familias.interRegular, fontSize: 15, lineHeight: 20 },
  enlace: { fontFamily: familias.poppinsBold, fontSize: 18, lineHeight: 26 },
  enlaceChico: {
    fontFamily: familias.interBold,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 0.55,
  },
  divisor: {
    fontFamily: familias.interExtraBold,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  meta: { fontFamily: familias.interRegular, fontSize: 12, lineHeight: 18 },
  chip: { fontFamily: familias.interBold, fontSize: 11, lineHeight: 16.5 },
  etiquetaCampo: {
    fontFamily: familias.interExtraBold,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.96,
  },
  input: { fontFamily: familias.interRegular, fontSize: 15, lineHeight: 20 },
  boton: {
    fontFamily: familias.interBold,
    fontSize: 13,
    lineHeight: 19.5,
    letterSpacing: 0.9,
    textTransform: 'uppercase',
  },
  botonGrande: {
    fontFamily: familias.interBold,
    fontSize: 18,
    lineHeight: 26,
    letterSpacing: 0.45,
    textTransform: 'uppercase',
  },
  botonFlotante: {
    fontFamily: familias.interExtraBold,
    fontSize: 12,
    lineHeight: 14,
    letterSpacing: -0.3,
  },
  botonSecundario: { fontFamily: familias.interMedium, fontSize: 13, lineHeight: 20 },
  pestana: { fontFamily: familias.interMedium, fontSize: 10, lineHeight: 15, letterSpacing: -0.25 },
  pestanaActiva: {
    fontFamily: familias.interBold,
    fontSize: 10,
    lineHeight: 15,
    letterSpacing: -0.25,
  },
  // 9 px como en Figma: por debajo del mínimo recomendado (pendiente L-05 / P-14).
  micro: { fontFamily: familias.interRegular, fontSize: 9, lineHeight: 18 },
} satisfies Record<string, TextStyle>;

export type VarianteTexto = keyof typeof tipografia;
