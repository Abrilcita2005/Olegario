import { PantallaEnConstruccion } from '@/components/PantallaEnConstruccion';
import { PantallaSecundaria } from '@/components/navegacion/PantallaSecundaria';
import { Boton } from '@/components/ui';
import { useSesion } from '@/estado/sesion';

// PROVISIONAL (Etapa 5): registro simulado. El formulario real llega en la Etapa 6.
export default function RegistroScreen() {
  const { ingresar } = useSesion();
  return (
    <PantallaSecundaria>
      <PantallaEnConstruccion titulo="Creá tu cuenta" etapa="Etapa 6">
        <Boton texto="Crear cuenta (simulado)" onPress={() => ingresar('miembro')} />
      </PantallaEnConstruccion>
    </PantallaSecundaria>
  );
}
