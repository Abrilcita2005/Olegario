import { PantallaEnConstruccion } from '@/components/PantallaEnConstruccion';
import { PantallaBase } from '@/components/navegacion/PantallaBase';

export default function ComunidadScreen() {
  return (
    <PantallaBase>
      <PantallaEnConstruccion titulo="Comunidad" etapa="Etapa 10" />
    </PantallaBase>
  );
}
