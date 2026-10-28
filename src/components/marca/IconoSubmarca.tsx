import { View } from 'react-native';

import { SubmarcaCafe } from './SubmarcaCafe';
import { SubmarcaCowork } from './SubmarcaCowork';
import { SubmarcaNetwork } from './SubmarcaNetwork';
import { SubmarcaStream } from './SubmarcaStream';

export type Submarca = 'cowork' | 'stream' | 'network' | 'cafe';

const COMPONENTES = {
  cowork: SubmarcaCowork,
  stream: SubmarcaStream,
  network: SubmarcaNetwork,
  cafe: SubmarcaCafe,
} as const;

const NOMBRES: Record<Submarca, string> = {
  cowork: 'OLE/COWORK',
  stream: 'OLE/STREAM',
  network: 'OLE/NETWORK',
  cafe: 'OLE/CAFÉ',
};

// Ícono circular de cada servicio OLE/. El nombre del servicio se muestra aparte como texto.
export function IconoSubmarca({ submarca, tamano = 73 }: { submarca: Submarca; tamano?: number }) {
  const Componente = COMPONENTES[submarca];
  return (
    <View accessible accessibilityRole="image" accessibilityLabel={NOMBRES[submarca]}>
      <Componente ancho={tamano} />
    </View>
  );
}
