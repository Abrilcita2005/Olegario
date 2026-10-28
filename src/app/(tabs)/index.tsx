import { PantallaEnConstruccion } from '@/components/PantallaEnConstruccion';
import { PantallaBase } from '@/components/navegacion/PantallaBase';

export default function InicioScreen() {
  return (
    <PantallaBase>
      <PantallaEnConstruccion titulo="Inicio" etapa="Etapa 7" />
    </PantallaBase>
  );
}
