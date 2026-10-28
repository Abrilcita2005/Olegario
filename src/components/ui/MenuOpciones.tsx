import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colores, espacio, radios } from '@/theme';

import { Boton } from './Boton';
import { Texto } from './Texto';

export type OpcionMenu = {
  texto: string;
  onPress: () => void;
  destructiva?: boolean;
};

type Props = {
  visible: boolean;
  titulo: string;
  opciones: OpcionMenu[];
  onCerrar: () => void;
};

// Menú de opciones que sube desde abajo (p. ej. "Cambiar foto"). Se cierra tocando afuera, con
// "Cancelar" o con el botón atrás del sistema.
export function MenuOpciones({ visible, titulo, opciones, onCerrar }: Props) {
  const { bottom } = useSafeAreaInsets();
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onCerrar}>
      <Pressable
        style={styles.fondo}
        onPress={onCerrar}
        accessibilityRole="button"
        accessibilityLabel="Cerrar opciones"
      />
      <View style={[styles.panel, { paddingBottom: Math.max(bottom, espacio.grande) }]}>
        <View style={styles.agarre} />
        <Texto variante="tituloSeccion" color="textoSobreOscuro" accessibilityRole="header">
          {titulo}
        </Texto>
        {opciones.map((opcion) => (
          <Boton
            key={opcion.texto}
            texto={opcion.texto}
            variante={opcion.destructiva ? 'contorno' : 'secundario'}
            onPress={() => {
              onCerrar();
              opcion.onPress();
            }}
            style={styles.opcion}
          />
        ))}
        <Boton texto="Cancelar" variante="secundario" onPress={onCerrar} style={styles.cancelar} />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  fondo: { flex: 1, backgroundColor: colores.velo },
  panel: {
    gap: espacio.m,
    padding: espacio.grande,
    borderTopLeftRadius: radios.xxl,
    borderTopRightRadius: radios.xxl,
    backgroundColor: colores.superficie,
  },
  agarre: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    marginBottom: espacio.m,
    borderRadius: radios.pastilla,
    backgroundColor: colores.textoTerciario,
  },
  opcion: { backgroundColor: colores.superficieElevada },
  cancelar: { marginTop: espacio.xs },
});
