import type { TextStyle } from 'react-native';

import { familias } from './fuentes';

// Escala tipográfica tomada de Figma (docs/DISENO.md §C.3).
// Regla de conversión aprobada: Poppins → Vástago Grotesk y Manrope / Montserrat / DM Sans → Inter, con el mismo peso.
// Las fuentes propias no admiten fontWeight: el peso lo da la familia.
export const tipografia = {
  // Títulos y destacados (Vástago)
  display: { fontFamily: familias.vastagoBlack, fontSize: 30, lineHeight: 36 },
  tituloPantalla: {
    fontFamily: familias.vastagoBlack,
    fontSize: 26,
    lineHeight: 32.5,
    letterSpacing: -0.65,
  },
  tituloAcceso: {
    fontFamily: familias.vastagoHeavy,
    fontSize: 28,
    lineHeight: 34,
    letterSpacing: -0.28,
  },
  tituloSeccion: {
    fontFamily: familias.vastagoHeavy,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: -0.4,
    textTransform: 'uppercase',
  },
  tituloTarjeta: { fontFamily: familias.vastagoBold, fontSize: 16, lineHeight: 24 },
  tituloBienvenida: { fontFamily: familias.vastagoBold, fontSize: 17, lineHeight: 22 },
  categoria: {
    fontFamily: familias.vastagoHeavy,
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
