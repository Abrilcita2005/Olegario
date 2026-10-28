import { PantallaEnConstruccion } from '@/components/PantallaEnConstruccion';
import { PantallaSecundaria } from '@/components/navegacion/PantallaSecundaria';

// Carta del café (OLE/CAFÉ). No tiene diseño en Figma todavía (pendiente P-38).
export default function CartaCafeScreen() {
  return (
    <PantallaSecundaria>
      <PantallaEnConstruccion titulo="Carta del café" etapa="sin diseño todavía" />
    </PantallaSecundaria>
  );
}
