import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { Texto } from '@/components/ui';
import { espacio } from '@/theme';

type Props = {
  titulo: string;
  etapa: string;
  children?: ReactNode;
};

// Contenido temporal de las pantallas que todavía no se construyeron.
export function PantallaEnConstruccion({ titulo, etapa, children }: Props) {
  return (
    <View style={styles.contenido}>
      <Texto accessibilityRole="header" variante="tituloPantalla">
        {titulo}
      </Texto>
      <Texto>Pantalla en construcción ({etapa})</Texto>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  contenido: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: espacio.xl,
    paddingVertical: espacio.grande,
  },
});
