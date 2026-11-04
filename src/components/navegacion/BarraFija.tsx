import { router } from 'expo-router';

import { BotonPestana, ContenedorBarra, PESTANAS } from './BarraNavegacion';
import { BotonNovedades } from './BotonNovedades';

type Props = { activa: (typeof PESTANAS)[number]['nombre'] };

// Barra inferior y botón Novedades para pantallas que están fuera de las pestañas pero se ven como una
// de ellas (Figma: el perfil público muestra la barra con Comunidad activa).
export function BarraFija({ activa }: Props) {
  return (
    <>
      <BotonNovedades />
      <ContenedorBarra>
        {PESTANAS.map(({ nombre, ruta, etiqueta, Icono }) => (
          <BotonPestana
            key={nombre}
            etiqueta={etiqueta}
            Icono={Icono}
            isFocused={nombre === activa}
            onPress={() => router.navigate(ruta)}
          />
        ))}
      </ContenedorBarra>
    </>
  );
}
