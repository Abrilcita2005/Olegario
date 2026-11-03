import { StyleSheet, View } from 'react-native';

import { PantallaSecundaria } from '@/components/navegacion/PantallaSecundaria';
import { Tarjeta, Texto } from '@/components/ui';
import { espacio } from '@/theme';

// Recuperar contraseña: no hay diseño en Figma ni servidor todavía (Etapa 13). Pantalla provisoria.
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
            Vas a poder recuperar tu contraseña desde acá cuando las cuentas estén conectadas al
            servidor de Olegario.
          </Texto>
        </Tarjeta>
      </View>
    </PantallaSecundaria>
  );
}

const styles = StyleSheet.create({
  contenido: { gap: espacio.base },
});
