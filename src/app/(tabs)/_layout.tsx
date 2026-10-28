import { TabList, Tabs, TabSlot, TabTrigger } from 'expo-router/ui';

import { BotonPestana, ContenedorBarra, PESTANAS } from '@/components/navegacion/BarraNavegacion';
import { BotonNovedades } from '@/components/navegacion/BotonNovedades';

// Pestañas principales: barra inferior de Figma (fija) y botón flotante de Novedades.
export default function TabsLayout() {
  return (
    <Tabs>
      <TabSlot />
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
