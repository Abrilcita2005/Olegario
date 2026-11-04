import { StyleSheet, View } from 'react-native';

import { IconoCheck } from '@/components/iconos/Iconos';
import { Boton, Texto } from '@/components/ui';
import { colores, espacio, radios } from '@/theme';

type Props = {
  texto: string;
  enviada: boolean;
  onPress: () => void;
  // "contorno" para acciones secundarias (Figma: "SUMARME AL EQUIPO DE TESTING").
  variante?: 'primario' | 'contorno';
};

// Botón de contacto/postulación de Comunidad. Una vez enviada la solicitud (simulada, Etapa 10) queda
// el aviso "Solicitud enviada".
export function BotonSolicitud({ texto, enviada, onPress, variante = 'primario' }: Props) {
  if (enviada) {
    return (
      <View style={styles.enviada} accessible accessibilityLabel={`${texto}: solicitud enviada`}>
        <IconoCheck color={colores.acentoLima} />
        <Texto variante="boton" color="acentoLima">
          Solicitud enviada
        </Texto>
      </View>
    );
  }
  return <Boton texto={texto} variante={variante} onPress={onPress} />;
}

const styles = StyleSheet.create({
  enviada: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: espacio.m,
    minHeight: 44,
    borderRadius: radios.lg,
    borderWidth: 1,
    borderColor: colores.bordeLima,
  },
});
