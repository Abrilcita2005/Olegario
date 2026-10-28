import { PantallaEnConstruccion } from '@/components/PantallaEnConstruccion';
import { Logo } from '@/components/marca/Logo';
import { Boton } from '@/components/ui';
import { useSesion } from '@/estado/sesion';
import { PantallaSecundaria } from '@/components/navegacion/PantallaSecundaria';

// PROVISIONAL (Etapa 5): una sola pantalla para probar el flujo. Las 3 bienvenidas de Figma llegan en la Etapa 6.
export default function BienvenidaScreen() {
  const { marcarBienvenidaVista } = useSesion();
  return (
    <PantallaSecundaria conIsotipo={false}>
      <Logo fondo="sobreClaro" />
      <PantallaEnConstruccion titulo="Bienvenida" etapa="Etapa 6">
        <Boton texto="SIGUIENTE" variante="siguienteOscuro" onPress={marcarBienvenidaVista} />
      </PantallaEnConstruccion>
    </PantallaSecundaria>
  );
}
