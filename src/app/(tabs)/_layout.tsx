import { Tabs, TabList, TabSlot, TabTrigger, type TabTriggerSlotProps } from 'expo-router/ui';
import { Pressable, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Barra de pestañas provisional (Etapa 3). El diseño de Figma se aplica en la Etapa 5.
const PESTANAS = [
  { nombre: 'inicio', ruta: '/', etiqueta: 'Inicio' },
  { nombre: 'espacios', ruta: '/espacios', etiqueta: 'Espacios' },
  { nombre: 'agenda', ruta: '/agenda', etiqueta: 'Agenda' },
  { nombre: 'comunidad', ruta: '/comunidad', etiqueta: 'Comunidad' },
] as const;

export default function TabsLayout() {
  return (
    <Tabs>
      <TabSlot />
      <TabList asChild>
        <SafeAreaView edges={['bottom']} style={styles.barra}>
          {PESTANAS.map((pestana) => (
            <TabTrigger key={pestana.nombre} name={pestana.nombre} href={pestana.ruta} asChild>
              <BotonPestana etiqueta={pestana.etiqueta} />
            </TabTrigger>
          ))}
        </SafeAreaView>
      </TabList>
    </Tabs>
  );
}

type BotonPestanaProps = TabTriggerSlotProps & { etiqueta: string };

// `ref` se descarta: el tipo que declara expo-router no coincide con el de Pressable en RN 0.88.
function BotonPestana({ etiqueta, isFocused, ref: _ref, ...props }: BotonPestanaProps) {
  return (
    <Pressable
      {...props}
      accessibilityRole="tab"
      accessibilityState={{ selected: isFocused }}
      style={styles.pestana}
    >
      <Text style={[styles.etiqueta, isFocused && styles.etiquetaActiva]}>{etiqueta}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  barra: {
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  pestana: {
    flex: 1,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  etiqueta: {
    fontSize: 12,
  },
  etiquetaActiva: {
    fontWeight: '700',
  },
});
