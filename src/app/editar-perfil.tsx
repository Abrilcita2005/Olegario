import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { PantallaSecundaria } from '@/components/navegacion/PantallaSecundaria';
import { Boton, CampoFormulario, Texto } from '@/components/ui';
import { useSesion } from '@/estado/sesion';
import { espacio } from '@/theme';

// Editar perfil (no está en Figma: provisorio, decisión de la responsable 2026-11-04). El correo no se
// cambia acá (es el dato de acceso; se gestiona con el servidor en la Etapa 13). La foto se cambia
// tocándola en el Perfil.
export default function EditarPerfilScreen() {
  const { perfilBasico, actualizarPerfil } = useSesion();
  const [nombre, setNombre] = useState(perfilBasico?.nombre ?? '');
  const [profesion, setProfesion] = useState(perfilBasico?.profesion ?? '');
  const [errores, setErrores] = useState<{ nombre?: string; profesion?: string }>({});

  const guardar = async () => {
    const encontrados = {
      nombre: nombre.trim().length < 2 ? 'Ingresá tu nombre.' : undefined,
      profesion: profesion.trim().length < 2 ? 'Contá a qué te dedicás.' : undefined,
    };
    setErrores(encontrados);
    if (encontrados.nombre || encontrados.profesion) return;
    await actualizarPerfil({
      nombre: nombre.trim(),
      profesion: profesion.trim(),
      correo: perfilBasico?.correo ?? '',
    });
    router.back();
  };

  return (
    <PantallaSecundaria>
      <View style={styles.contenido}>
        <Texto variante="tituloAcceso" accessibilityRole="header">
          Editar perfil
        </Texto>
        <CampoFormulario
          etiqueta="Nombre completo"
          value={nombre}
          onChangeText={setNombre}
          maxLength={60}
          error={errores.nombre}
        />
        <CampoFormulario
          etiqueta="Profesión / Área de trabajo"
          value={profesion}
          onChangeText={setProfesion}
          maxLength={80}
          error={errores.profesion}
        />
        {perfilBasico?.correo ? (
          <Texto variante="cuerpoChico">Correo: {perfilBasico.correo}</Texto>
        ) : null}
        <Boton texto="Guardar cambios" tamano="grande" onPress={guardar} />
      </View>
    </PantallaSecundaria>
  );
}

const styles = StyleSheet.create({
  contenido: { gap: espacio.base },
});
