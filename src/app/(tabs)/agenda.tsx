import { PantallaEnConstruccion } from '@/components/PantallaEnConstruccion';
import { PantallaBase } from '@/components/navegacion/PantallaBase';

export default function AgendaScreen() {
  return (
    <PantallaBase>
      <PantallaEnConstruccion titulo="Agenda" etapa="Etapa 9" />
    </PantallaBase>
  );
}
