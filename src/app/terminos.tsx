import { StyleSheet, View } from 'react-native';

import { PantallaSecundaria } from '@/components/navegacion/PantallaSecundaria';
import { Tarjeta, Texto } from '@/components/ui';
import { espacio } from '@/theme';

// Términos de convivencia y manifiesto. TEXTO PROVISORIO: el definitivo lo carga la responsable (P-23).
export default function TerminosScreen() {
  return (
    <PantallaSecundaria>
      <View style={styles.contenido}>
        <Texto variante="tituloAcceso" accessibilityRole="header">
          Términos de convivencia
        </Texto>
        <Texto variante="cuerpo">
          Cuidamos el silencio productivo, la hospitalidad y la cultura de colaboración abierta.
        </Texto>
        <Tarjeta>
          <Texto variante="tituloTarjeta" color="textoSobreOscuro">
            Texto en preparación
          </Texto>
          <Texto variante="cuerpoChico" color="textoSecundario">
            El texto completo de los términos de convivencia y del manifiesto de la comunidad
            Olegario se va a publicar acá.
          </Texto>
        </Tarjeta>
      </View>
    </PantallaSecundaria>
  );
}

const styles = StyleSheet.create({
  contenido: { gap: espacio.base },
});
