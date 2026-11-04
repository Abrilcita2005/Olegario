import type { ReactNode } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colores, espacio, radios } from '@/theme';

import { Texto } from './Texto';

type Props = {
  visible: boolean;
  titulo: string;
  onCerrar: () => void;
  children: ReactNode;
};

// Panel oscuro que sube desde abajo (horario, confirmación de reserva). Se cierra tocando afuera o con
// el botón atrás del sistema.
export function PanelInferior({ visible, titulo, onCerrar, children }: Props) {
  const { bottom } = useSafeAreaInsets();
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onCerrar}>
      <Pressable
        style={styles.fondo}
        onPress={onCerrar}
        accessibilityRole="button"
        accessibilityLabel="Cerrar"
      />
      <View style={[styles.panel, { paddingBottom: Math.max(bottom, espacio.grande) }]}>
        <View style={styles.agarre} />
        <Texto variante="tituloSeccion" color="textoSobreOscuro" accessibilityRole="header">
          {titulo}
        </Texto>
        {children}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  fondo: { flex: 1, backgroundColor: colores.velo },
  panel: {
    gap: espacio.l,
    padding: espacio.grande,
    borderTopLeftRadius: radios.xxl,
    borderTopRightRadius: radios.xxl,
    backgroundColor: colores.superficie,
  },
  agarre: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    marginBottom: espacio.xs,
    borderRadius: radios.pastilla,
    backgroundColor: colores.textoTerciario,
  },
});
