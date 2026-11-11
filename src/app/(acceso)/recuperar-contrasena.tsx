import { StyleSheet, View } from 'react-native';

import { PantallaSecundaria } from '@/components/navegacion/PantallaSecundaria';
import { Tarjeta, Texto } from '@/components/ui';
import { espacio } from '@/theme';

// Recuperar contraseña: no hay diseño en Figma y el servidor todavía no envía correos (P-48). Provisoria.
export default function RecuperarContrasenaScreen() {
  return (
    <PantallaSecundaria>
      <View style={styles.contenido}>
        <Texto variante="tituloAcceso" accessibilityRole="header">
          Recuperar contraseña
        </Texto>
        <Tarjeta>
          <Texto variante="tituloTarjeta" color="textoSobreOscuro">
            Muy pronto
          </Texto>
          <Texto variante="cuerpoChico" color="textoSecundario">
            Todavía no se puede recuperar la contraseña desde la app. Vamos a sumarlo cuando el
            servidor de Olegario pueda enviar correos.
          </Texto>
        </Tarjeta>
      </View>
    </PantallaSecundaria>
  );
}

const styles = StyleSheet.create({
  contenido: { gap: espacio.base },
});
