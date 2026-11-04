import { Circle, Line, Path, Svg } from 'react-native-svg';

type Props = {
  tamano?: number;
  color: string;
};

// Íconos lineales genéricos (trazo de 2 px, estilo de Figma). Los íconos de marca están en components/marca.

export function IconoOjo({ tamano = 18, color }: Props) {
  return (
    <Svg width={tamano} height={tamano} viewBox="0 0 24 24" fill="none">
      <Path
        d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z"
        stroke={color}
        strokeWidth={2}
        strokeLinejoin="round"
      />
      <Circle cx={12} cy={12} r={3} stroke={color} strokeWidth={2} />
    </Svg>
  );
}

export function IconoOjoTachado({ tamano = 18, color }: Props) {
  return (
    <Svg width={tamano} height={tamano} viewBox="0 0 24 24" fill="none">
      <Path
        d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z"
        stroke={color}
        strokeWidth={2}
        strokeLinejoin="round"
      />
      <Circle cx={12} cy={12} r={3} stroke={color} strokeWidth={2} />
      <Line x1={3} y1={3} x2={21} y2={21} stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

export function IconoFlechaVolver({ tamano = 24, color }: Props) {
  return (
    <Svg width={tamano} height={tamano} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={10.5} stroke={color} strokeWidth={1.5} />
      <Path
        d="M13 7.5 8.5 12l4.5 4.5M9 12h7"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// Íconos de la barra inferior y del botón Novedades (trazo 1.6–2 px, como en Figma).

export function IconoInicio({ tamano = 18, color }: Props) {
  return (
    <Svg width={tamano} height={tamano} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9.5Z"
        stroke={color}
        strokeWidth={1.8}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function IconoEspacios({ tamano = 18, color }: Props) {
  return (
    <Svg width={tamano} height={tamano} viewBox="0 0 24 24" fill="none">
      <Path d="M5 21V4a1 1 0 0 1 1-1h9v18M3 21h18M15 5h3v16" stroke={color} strokeWidth={1.8} />
      <Circle cx={12} cy={12.5} r={1} fill={color} />
    </Svg>
  );
}

export function IconoAgenda({ tamano = 18, color }: Props) {
  return (
    <Svg width={tamano} height={tamano} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 6a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6ZM4 10h16M8 3v4M16 3v4"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function IconoComunidad({ tamano = 18, color }: Props) {
  return (
    <Svg width={tamano} height={tamano} viewBox="0 0 24 24" fill={color}>
      <Circle cx={12} cy={7} r={3} />
      <Circle cx={5} cy={9} r={2.2} />
      <Circle cx={19} cy={9} r={2.2} />
      <Path d="M6 19a6 6 0 0 1 12 0v1H6v-1ZM1 19a4 4 0 0 1 5.2-3.8A7.5 7.5 0 0 0 4.6 20H1v-1ZM23 19a4 4 0 0 0-5.2-3.8 7.5 7.5 0 0 1 1.6 4.8H23v-1Z" />
    </Svg>
  );
}

export function IconoMegafono({ tamano = 14, color }: Props) {
  return (
    <Svg width={tamano} height={tamano} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 10v4a1 1 0 0 0 1 1h3l8 5V4L7 9H4a1 1 0 0 0-1 1ZM19 9a4 4 0 0 1 0 6"
        stroke={color}
        strokeWidth={2}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </Svg>
  );
}

// Íconos de la Bienvenida 1 y del pie de las pantallas de acceso (redibujados a partir de Figma).

export function IconoLupaEstrella({ tamano = 29, color }: Props) {
  return (
    <Svg width={tamano} height={tamano} viewBox="0 0 29 29" fill="none">
      <Circle cx={12} cy={12} r={9.5} stroke={color} strokeWidth={2.2} />
      <Path d="m19 19 7.5 7.5" stroke={color} strokeWidth={2.6} strokeLinecap="round" />
      <Path
        d="m12 6.8 1.6 3.3 3.6.5-2.6 2.5.6 3.6-3.2-1.7-3.2 1.7.6-3.6-2.6-2.5 3.6-.5Z"
        stroke={color}
        strokeWidth={1.4}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function IconoCandado({ tamano = 30, color }: Props) {
  return (
    <Svg width={tamano * (25 / 35)} height={tamano} viewBox="0 0 25 35" fill="none">
      <Path d="M5.5 14V9a7 7 0 0 1 14 0v5" stroke={color} strokeWidth={2.4} />
      <Path
        d="M2 15.5a1.5 1.5 0 0 1 1.5-1.5h18a1.5 1.5 0 0 1 1.5 1.5v15a1.5 1.5 0 0 1-1.5 1.5h-18A1.5 1.5 0 0 1 2 30.5v-15Z"
        stroke={color}
        strokeWidth={2.4}
      />
      <Circle cx={12.5} cy={22} r={2.2} fill={color} />
      <Path d="M12.5 23.5v3.5" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

export function IconoManoCorazon({ tamano = 29, color }: Props) {
  return (
    <Svg width={tamano} height={tamano * (27 / 29)} viewBox="0 0 29 27" fill="none">
      <Path
        d="M14.5 11.5s-5-3-5-6.2A2.8 2.8 0 0 1 14.5 3.6a2.8 2.8 0 0 1 5 1.7c0 3.2-5 6.2-5 6.2Z"
        stroke={color}
        strokeWidth={1.8}
        strokeLinejoin="round"
      />
      <Path
        d="M2 18.5h4l4.5-2.5h5.5a2 2 0 0 1 0 4h-4.5M16 20l7-3.2a2 2 0 0 1 2 3.4L16.5 25H2"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function IconoUbicacion({ tamano = 13, color }: Props) {
  return (
    <Svg width={tamano * (10 / 12.5)} height={tamano} viewBox="0 0 10 12.5" fill="none">
      <Path
        d="M5 12s4-4 4-7a4 4 0 0 0-8 0c0 3 4 7 4 7Z"
        stroke={color}
        strokeWidth={1.3}
        strokeLinejoin="round"
      />
      <Circle cx={5} cy={5} r={1.4} stroke={color} strokeWidth={1.2} />
    </Svg>
  );
}

// Íconos de la tarjeta de reserva del Home.

export function IconoReloj({ tamano = 13, color }: Props) {
  return (
    <Svg width={tamano} height={tamano} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={9.5} stroke={color} strokeWidth={2.2} />
      <Path d="M12 7v5l3.5 2" stroke={color} strokeWidth={2.2} strokeLinecap="round" />
    </Svg>
  );
}

export function IconoQr({ tamano = 16, color }: Props) {
  return (
    <Svg width={tamano} height={tamano} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 3h7v7H3V3Zm11 0h7v7h-7V3ZM3 14h7v7H3v-7Z"
        stroke={color}
        strokeWidth={2}
        strokeLinejoin="round"
      />
      <Path d="M6 6h1v1H6zM17 6h1v1h-1zM6 17h1v1H6z" fill={color} stroke={color} />
      <Path d="M14 14h3v3h-3zM18 18h3v3h-3zM14 20h2M20 14v2" stroke={color} strokeWidth={2} />
    </Svg>
  );
}

export function IconoNavegar({ tamano = 15, color }: Props) {
  return (
    <Svg width={tamano} height={tamano} viewBox="0 0 24 24" fill="none">
      <Path
        d="M21 3 3 10.5l7.5 3 3 7.5L21 3Z"
        stroke={color}
        strokeWidth={2}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// Íconos de Espacios (Figma: ESPACIOS).

export function IconoCamara({ tamano = 18, color }: Props) {
  return (
    <Svg width={tamano} height={tamano} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 7h12v10H3V7Zm12 3.5L21 7v10l-6-3.5"
        stroke={color}
        strokeWidth={1.8}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function IconoCronometro({ tamano = 20, color }: Props) {
  return (
    <Svg width={tamano} height={tamano} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={13.5} r={7.5} stroke={color} strokeWidth={2} />
      <Path d="M10 2.5h4M12 9.5v4l2.5 1.5" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

export function IconoCheck({ tamano = 14, color }: Props) {
  return (
    <Svg width={tamano} height={tamano} viewBox="0 0 24 24" fill="none">
      <Path
        d="m4 12.5 5 5L20 6.5"
        stroke={color}
        strokeWidth={2.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function IconoMas({ tamano = 18, color }: Props) {
  return (
    <Svg width={tamano} height={tamano} viewBox="0 0 24 24" fill="none">
      <Path d="M12 5v14M5 12h14" stroke={color} strokeWidth={2.4} strokeLinecap="round" />
    </Svg>
  );
}

export function IconoMenos({ tamano = 18, color }: Props) {
  return (
    <Svg width={tamano} height={tamano} viewBox="0 0 24 24" fill="none">
      <Path d="M5 12h14" stroke={color} strokeWidth={2.4} strokeLinecap="round" />
    </Svg>
  );
}

// Íconos de la Agenda (Figma: AGENDA).

export function IconoChevron({
  tamano = 16,
  color,
  direccion = 'derecha',
}: Props & { direccion?: 'izquierda' | 'derecha' }) {
  return (
    <Svg width={tamano} height={tamano} viewBox="0 0 24 24" fill="none">
      <Path
        d={direccion === 'derecha' ? 'm9 5 7 7-7 7' : 'm15 5-7 7 7 7'}
        stroke={color}
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function IconoFlechaDerecha({ tamano = 16, color }: Props) {
  return (
    <Svg width={tamano} height={tamano} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 12h15m-6-6 6 6-6 6"
        stroke={color}
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function IconoCopiar({ tamano = 16, color }: Props) {
  return (
    <Svg width={tamano} height={tamano} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 9h11v11H9V9Zm-4 6H4V4h11v1"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function IconoLlave({ tamano = 20, color }: Props) {
  return (
    <Svg width={tamano} height={tamano} viewBox="0 0 24 24" fill="none">
      <Circle cx={7} cy={12} r={4} stroke={color} strokeWidth={2} />
      <Path d="M11 12h10m-3 0v3m-3-3v2" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

// Íconos de Comunidad (Figma: COMUNIDAD).

export function IconoRayo({ tamano = 14, color }: Props) {
  return (
    <Svg width={tamano} height={tamano} viewBox="0 0 24 24" fill="none">
      <Path
        d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z"
        stroke={color}
        strokeWidth={2}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function IconoAuriculares({ tamano = 14, color }: Props) {
  return (
    <Svg width={tamano} height={tamano} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 15v-3a8 8 0 0 1 16 0v3M4 15h3v6H4v-6Zm13 0h3v6h-3v-6Z"
        stroke={color}
        strokeWidth={2}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function IconoMasCirculo({ tamano = 16, color }: Props) {
  return (
    <Svg width={tamano} height={tamano} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={9.5} stroke={color} strokeWidth={2} />
      <Path d="M12 8v8M8 12h8" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

// Íconos de Gestión y servicios (Figma: PERFIL).

export function IconoCaja({ tamano = 18, color }: Props) {
  return (
    <Svg width={tamano} height={tamano} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 4h18v4H3V4Zm2 4v12h14V8M10 12h4"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function IconoRegalo({ tamano = 18, color }: Props) {
  return (
    <Svg width={tamano} height={tamano} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 9h18v4H3V9Zm2 4v8h14v-8M12 9v12M12 9S10.5 4 8 5s1 4 4 4Zm0 0s1.5-5 4-4-1 4-4 4Z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function IconoEstrella({ tamano = 18, color, relleno }: Props & { relleno?: string }) {
  return (
    <Svg width={tamano} height={tamano} viewBox="0 0 24 24" fill="none">
      <Path
        d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z"
        stroke={color}
        fill={relleno ?? 'none'}
        strokeWidth={2}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function IconoMensaje({ tamano = 18, color }: Props) {
  return (
    <Svg width={tamano} height={tamano} viewBox="0 0 24 24" fill="none">
      <Path d="M4 4h16v12H8l-4 4V4Z" stroke={color} strokeWidth={2} strokeLinejoin="round" />
    </Svg>
  );
}

export function IconoTarjeta({ tamano = 18, color }: Props) {
  return (
    <Svg width={tamano} height={tamano} viewBox="0 0 24 24" fill="none">
      <Path d="M3 5h18v14H3V5Zm0 4h18" stroke={color} strokeWidth={2} strokeLinejoin="round" />
    </Svg>
  );
}

// Ícono de etiqueta de descuento (Figma: NOVEDADES, "20% OFF").
export function IconoEtiqueta({ tamano = 12, color }: Props) {
  return (
    <Svg width={tamano} height={tamano} viewBox="0 0 24 24" fill="none">
      <Path d="M3 12V4h8l10 10-8 8L3 12Z" stroke={color} strokeWidth={2.2} strokeLinejoin="round" />
      <Circle cx={7.5} cy={8.5} r={1.5} fill={color} />
    </Svg>
  );
}
