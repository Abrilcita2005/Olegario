import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { PantallaEnConstruccion } from '@/components/PantallaEnConstruccion';
import { PantallaSecundaria } from '@/components/navegacion/PantallaSecundaria';
import { Avatar, Boton, EstadoVacio, MenuOpciones, Texto, type OpcionMenu } from '@/components/ui';
import { useSesion } from '@/estado/sesion';
import { puede } from '@/utils/permisos';
import { elegirFotoPerfil } from '@/services/fotoPerfil';
import { espacio } from '@/theme';

// Perfil de cuenta (membresía, horas, servicios). Por ahora: foto de perfil y cerrar sesión.
// El resto del contenido llega en la Etapa 11.
export default function PerfilScreen() {
  const { fotoPerfil, cambiarFotoPerfil, salir, tipoAcceso } = useSesion();
  const [aviso, setAviso] = useState<string | null>(null);
  const [menuAbierto, setMenuAbierto] = useState(false);

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

  const opciones: OpcionMenu[] = [
    { texto: 'Elegir de la galería', onPress: () => cambiarFoto('galeria') },
    { texto: 'Sacar una foto', onPress: () => cambiarFoto('camara') },
    ...(fotoPerfil
      ? [{ texto: 'Quitar foto', onPress: () => cambiarFotoPerfil(null), destructiva: true }]
      : []),
  ];

  // El invitado no tiene perfil de cuenta (decisión 2026-11-03): se le ofrece crear una.
  if (!puede(tipoAcceso, 'verPerfilCuenta')) {
    return (
      <PantallaSecundaria>
        <EstadoVacio
          titulo="Tu perfil te está esperando"
          texto="Como invitado podés mirar todo e inscribirte a eventos. Para tener tu perfil, reservar espacios y sumarte a la comunidad, creá tu cuenta."
          accion={{ texto: 'Crear mi cuenta', onPress: salir }}
        />
      </PantallaSecundaria>
    );
  }

  return (
    <PantallaSecundaria>
      <View style={styles.foto}>
        <Avatar foto={fotoPerfil} tamano={112} />
        <Boton texto="Cambiar foto" variante="secundario" onPress={() => setMenuAbierto(true)} />
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
      <MenuOpciones
        visible={menuAbierto}
        titulo="Foto de perfil"
        opciones={opciones}
        onCerrar={() => setMenuAbierto(false)}
      />
      <PantallaEnConstruccion titulo="Mi perfil" etapa="Etapa 11">
        <Boton texto="Cerrar sesión" variante="secundario" onPress={salir} />
      </PantallaEnConstruccion>
    </PantallaSecundaria>
  );
}

const styles = StyleSheet.create({
  foto: { alignItems: 'center', gap: espacio.base },
  aviso: { textAlign: 'center' },
});
