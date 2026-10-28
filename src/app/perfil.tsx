import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { PantallaEnConstruccion } from '@/components/PantallaEnConstruccion';
import { PantallaSecundaria } from '@/components/navegacion/PantallaSecundaria';
import { Avatar, Boton, Texto } from '@/components/ui';
import { useSesion } from '@/estado/sesion';
import { elegirFotoPerfil } from '@/services/fotoPerfil';
import { espacio } from '@/theme';

// Perfil de cuenta (membresía, horas, servicios). Por ahora: foto de perfil y cerrar sesión.
// El resto del contenido llega en la Etapa 11.
export default function PerfilScreen() {
  const { fotoPerfil, cambiarFotoPerfil, salir } = useSesion();
  const [aviso, setAviso] = useState<string | null>(null);

  async function cambiarFoto(origen: 'galeria' | 'camara') {
    setAviso(null);
    try {
      const resultado = await elegirFotoPerfil(origen);
      if (resultado.estado === 'elegida') await cambiarFotoPerfil(resultado.foto);
      if (resultado.estado === 'sinPermiso') {
        setAviso(
          origen === 'camara'
            ? 'Para sacar una foto, permití el uso de la cámara en los ajustes del teléfono.'
            : 'Para elegir una foto, permití el acceso a tus fotos en los ajustes del teléfono.',
        );
      }
    } catch {
      setAviso('No pudimos cargar la foto. Probá de nuevo.');
    }
  }

  return (
    <PantallaSecundaria>
      <View style={styles.foto}>
        <Avatar foto={fotoPerfil} tamano={112} />
        <View style={styles.botones}>
          <Boton
            texto="Elegir de la galería"
            variante="secundario"
            onPress={() => cambiarFoto('galeria')}
          />
          <Boton
            texto="Sacar una foto"
            variante="secundario"
            onPress={() => cambiarFoto('camara')}
          />
          {fotoPerfil ? (
            <Boton
              texto="Quitar foto"
              variante="contorno"
              onPress={() => cambiarFotoPerfil(null)}
            />
          ) : null}
        </View>
        {aviso ? (
          <Texto
            variante="cuerpoChico"
            color="error"
            accessibilityLiveRegion="polite"
            style={styles.aviso}
          >
            {aviso}
          </Texto>
        ) : null}
      </View>
      <PantallaEnConstruccion titulo="Mi perfil" etapa="Etapa 11">
        <Boton texto="Cerrar sesión" variante="secundario" onPress={salir} />
      </PantallaEnConstruccion>
    </PantallaSecundaria>
  );
}

const styles = StyleSheet.create({
  foto: { alignItems: 'center', gap: espacio.base },
  botones: { alignSelf: 'stretch', gap: espacio.m },
  aviso: { textAlign: 'center' },
});
