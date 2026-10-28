import { PantallaEnConstruccion } from '@/components/PantallaEnConstruccion';
import { PantallaSecundaria } from '@/components/navegacion/PantallaSecundaria';
import { Boton } from '@/components/ui';
import { useSesion } from '@/estado/sesion';

// PROVISIONAL (Etapa 5): ingreso simulado, sin credenciales. El formulario real llega en la Etapa 6.
export default function IniciarSesionScreen() {
  const { ingresar } = useSesion();
  return (
    <PantallaSecundaria>
      <PantallaEnConstruccion titulo="Iniciar sesión" etapa="Etapa 6">
        <Boton texto="Entrar como miembro (simulado)" onPress={() => ingresar('miembro')} />
      </PantallaEnConstruccion>
    </PantallaSecundaria>
  );
}
