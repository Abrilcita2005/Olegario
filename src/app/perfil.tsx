import { PantallaEnConstruccion } from '@/components/PantallaEnConstruccion';
import { PantallaSecundaria } from '@/components/navegacion/PantallaSecundaria';
import { Boton } from '@/components/ui';
import { useSesion } from '@/estado/sesion';

// Perfil de cuenta (membresía, horas, servicios). Contenido en la Etapa 11.
export default function PerfilScreen() {
  const { salir } = useSesion();
  return (
    <PantallaSecundaria>
      <PantallaEnConstruccion titulo="Mi perfil" etapa="Etapa 11">
        <Boton texto="Cerrar sesión" variante="secundario" onPress={salir} />
      </PantallaEnConstruccion>
    </PantallaSecundaria>
  );
}
