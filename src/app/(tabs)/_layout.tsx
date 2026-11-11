import { TabList, Tabs, TabSlot, TabTrigger } from 'expo-router/ui';

import { BotonPestana, ContenedorBarra, PESTANAS } from '@/components/navegacion/BarraNavegacion';
import { BotonNovedades } from '@/components/navegacion/BotonNovedades';

// Pestañas principales: barra inferior de Figma (fija) y botón flotante de Novedades.
export default function TabsLayout() {
  return (
    <Tabs>
      {/* flexShrink: 1 deja que el contenido ocupe solo el alto de la pantalla (por defecto no se achica y,
          en la versión web, lo último quedaba tapado por la barra y Novedades sin poder bajar). */}
      <TabSlot style={{ flexShrink: 1 }} />
      <BotonNovedades />
      <TabList asChild>
        <ContenedorBarra>
          {PESTANAS.map(({ nombre, ruta, etiqueta, Icono }) => (
            <TabTrigger key={nombre} name={nombre} href={ruta} asChild>
              <BotonPestana etiqueta={etiqueta} Icono={Icono} />
            </TabTrigger>
          ))}
        </ContenedorBarra>
      </TabList>
    </Tabs>
  );
}
