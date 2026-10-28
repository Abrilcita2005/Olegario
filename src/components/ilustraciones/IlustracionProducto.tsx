import { useId } from 'react';
import { Circle, Defs, Ellipse, G, LinearGradient, Path, Rect, Stop, Svg } from 'react-native-svg';

import { colores, degradados, marca } from '@/theme';

// Ilustraciones de productos en los colores de la marca. Ocupan el lugar de la foto hasta que haya
// fotos reales (pendiente P-40). No son fotos: no se presentan como imágenes reales del producto.
export type Ilustracion =
  | 'espresso'
  | 'flatWhite'
  | 'cortado'
  | 'coldBrew'
  | 'limonada'
  | 'cookie'
  | 'medialuna'
  | 'promoFlatWhiteCookie';

type Props = {
  ilustracion: Ilustracion;
  tamano?: number;
};

const CAFE = '#6B3E2E';
const CAFE_CLARO = '#C89B6D';
const ESPUMA = '#F4E9DC';
const VIDRIO = 'rgba(255, 255, 255, 0.18)';

export function IlustracionProducto({ ilustracion, tamano = 64 }: Props) {
  const idFondo = useId();
  return (
    <Svg width={tamano} height={tamano} viewBox="0 0 64 64">
      <Defs>
        <LinearGradient id={idFondo} x1="0" y1="0" x2="1" y2="1">
          {degradados.marca.colores.map((color, i) => (
            <Stop
              key={color}
              offset={degradados.marca.posiciones[i]}
              stopColor={color}
              stopOpacity={0.35}
            />
          ))}
        </LinearGradient>
      </Defs>
      <Rect width={64} height={64} rx={12} fill={colores.superficieElevada} />
      <Rect width={64} height={64} rx={12} fill={`url(#${idFondo})`} />
      {DIBUJOS[ilustracion]}
    </Svg>
  );
}

function Taza({
  ancho,
  alto,
  liquido,
  espuma,
}: {
  ancho: number;
  alto: number;
  liquido: string;
  espuma?: boolean;
}) {
  const x = 32 - ancho / 2;
  const y = 44 - alto;
  return (
    <G>
      <Ellipse
        cx={32}
        cy={47}
        rx={ancho / 2 + 7}
        ry={3.5}
        fill={colores.textoSobreOscuro}
        opacity={0.9}
      />
      <Path
        d={`M${x} ${y} h${ancho} v${alto - 6} a6 6 0 0 1 -6 6 h-${ancho - 12} a6 6 0 0 1 -6 -6 Z`}
        fill={colores.textoSobreOscuro}
      />
      <Path
        d={`M${x + ancho} ${y + 4} a5 5 0 0 1 0 ${Math.min(10, alto - 6)}`}
        stroke={colores.textoSobreOscuro}
        strokeWidth={3}
        fill="none"
      />
      <Ellipse cx={32} cy={y + 1} rx={ancho / 2 - 1.5} ry={2.5} fill={liquido} />
      {espuma ? (
        <Path
          d={`M28 ${y + 1} q4 -2 8 0 q-4 2 -8 0 Z M30 ${y} q2 2 4 0`}
          fill={ESPUMA}
          stroke={ESPUMA}
          strokeWidth={0.8}
        />
      ) : null}
    </G>
  );
}

function Vaso({ liquido, hielo, limon }: { liquido: string; hielo?: boolean; limon?: boolean }) {
  return (
    <G>
      <Path d="M20 16 h24 l-3 32 a3 3 0 0 1 -3 3 h-12 a3 3 0 0 1 -3 -3 Z" fill={VIDRIO} />
      <Path d="M21.5 24 h21 l-2.3 24 a2 2 0 0 1 -2 2 h-12.4 a2 2 0 0 1 -2 -2 Z" fill={liquido} />
      {hielo ? (
        <G fill="rgba(255,255,255,0.6)">
          <Rect x={25} y={27} width={7} height={7} rx={1.5} transform="rotate(-12 28 30)" />
          <Rect x={33} y={31} width={6.5} height={6.5} rx={1.5} transform="rotate(10 36 34)" />
        </G>
      ) : null}
      {limon ? (
        <G>
          <Circle cx={43} cy={18} r={7} fill={marca.lima} />
          <Circle cx={43} cy={18} r={4.8} fill="#E8F98A" />
          <Path d="M43 13.5 v9 M38.5 18 h9" stroke={marca.lima} strokeWidth={1} />
        </G>
      ) : null}
      <Path d="M36 10 l-3 20" stroke={marca.rosa} strokeWidth={2.5} strokeLinecap="round" />
    </G>
  );
}

function Cookie({ cx = 32, cy = 34, r = 15 }: { cx?: number; cy?: number; r?: number }) {
  return (
    <G>
      <Circle cx={cx} cy={cy} r={r} fill={CAFE_CLARO} />
      <Circle cx={cx} cy={cy} r={r - 2} fill="#D9AE7E" />
      <G fill={CAFE}>
        <Circle cx={cx - r * 0.4} cy={cy - r * 0.3} r={r * 0.13} />
        <Circle cx={cx + r * 0.35} cy={cy - r * 0.4} r={r * 0.11} />
        <Circle cx={cx + r * 0.1} cy={cy + r * 0.15} r={r * 0.14} />
        <Circle cx={cx - r * 0.35} cy={cy + r * 0.45} r={r * 0.1} />
        <Circle cx={cx + r * 0.5} cy={cy + r * 0.4} r={r * 0.12} />
      </G>
    </G>
  );
}

const DIBUJOS: Record<Ilustracion, React.ReactNode> = {
  espresso: <Taza ancho={22} alto={17} liquido={CAFE} />,
  flatWhite: <Taza ancho={30} alto={21} liquido={CAFE_CLARO} espuma />,
  cortado: <Taza ancho={26} alto={19} liquido="#A9764F" />,
  coldBrew: <Vaso liquido={CAFE} hielo />,
  limonada: <Vaso liquido="rgba(202, 242, 44, 0.75)" hielo limon />,
  cookie: <Cookie />,
  medialuna: (
    <G>
      <Path d="M12 44 A20 20 0 1 1 52 44 L44 44 A12 12 0 1 0 20 44 Z" fill="#E2A85A" />
      <Path
        d="M18 36 l7 3 M23 27 l5 6 M32 23 v8 M41 27 l-5 6 M46 36 l-7 3"
        stroke="#B9783A"
        strokeWidth={1.8}
        strokeLinecap="round"
      />
    </G>
  ),
  promoFlatWhiteCookie: (
    <G>
      <G transform="translate(-7 0)">
        <Taza ancho={22} alto={16} liquido={CAFE_CLARO} espuma />
      </G>
      <Cookie cx={47} cy={44} r={10} />
    </G>
  ),
};
