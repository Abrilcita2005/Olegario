import { PantallaEnConstruccion } from '@/components/PantallaEnConstruccion';
import { PantallaBase } from '@/components/navegacion/PantallaBase';

export default function EspaciosScreen() {
  return (
    <PantallaBase>
      <PantallaEnConstruccion titulo="Espacios" etapa="Etapa 8" />
    </PantallaBase>
  );
}
