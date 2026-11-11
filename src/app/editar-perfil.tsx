import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { PantallaSecundaria } from '@/components/navegacion/PantallaSecundaria';
import { Boton, CampoFormulario, Texto } from '@/components/ui';
import { useSesion } from '@/estado/sesion';
import { espacio } from '@/theme';

// Editar perfil (no está en Figma: provisorio, decisión de la responsable 2026-11-04). El correo no se
// cambia acá (es el dato de acceso). La foto se cambia tocándola en el Perfil. "Sobre mí", "Ofrezco" y
// "Busco" son opcionales y se ven en el perfil público de Comunidad (P-47, resuelto 2026-11-11 con el
// mismo formulario, sin diseño nuevo).
export default function EditarPerfilScreen() {
  const { perfilBasico, actualizarPerfil } = useSesion();
  const [nombre, setNombre] = useState(perfilBasico?.nombre ?? '');
  const [profesion, setProfesion] = useState(perfilBasico?.profesion ?? '');
  const [sobreMi, setSobreMi] = useState(perfilBasico?.sobreMi ?? '');
  const [ofrezco, setOfrezco] = useState(perfilBasico?.ofrezco ?? '');
  const [busco, setBusco] = useState(perfilBasico?.busco ?? '');
  const [errores, setErrores] = useState<{ nombre?: string; profesion?: string }>({});
  const [fallo, setFallo] = useState<string | null>(null);

  const guardar = async () => {
    const encontrados = {
      nombre: nombre.trim().length < 2 ? 'Ingresá tu nombre.' : undefined,
      profesion: profesion.trim().length < 2 ? 'Contá a qué te dedicás.' : undefined,
    };
    setErrores(encontrados);
    if (encontrados.nombre || encontrados.profesion) return;
    const resultado = await actualizarPerfil({
      nombre: nombre.trim(),
      profesion: profesion.trim(),
      correo: perfilBasico?.correo ?? '',
      // Vacío = sin texto (no se muestra en la Comunidad).
      ...(sobreMi.trim() ? { sobreMi: sobreMi.trim() } : {}),
      ...(ofrezco.trim() ? { ofrezco: ofrezco.trim() } : {}),
      ...(busco.trim() ? { busco: busco.trim() } : {}),
    });
    if (!resultado.ok) {
      setFallo(resultado.error);
      return;
    }
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
        <Texto variante="tituloSeccion" accessibilityRole="header">
          Para la Comunidad (opcional)
        </Texto>
        <CampoFormulario
          etiqueta="Sobre mí"
          placeholder="Contá en pocas líneas qué hacés y qué te apasiona"
          value={sobreMi}
          onChangeText={setSobreMi}
          maxLength={600}
          multiline
        />
        <CampoFormulario
          etiqueta="Ofrezco"
          placeholder="ej. Asesoría en diseño de interfaces"
          value={ofrezco}
          onChangeText={setOfrezco}
          maxLength={300}
          multiline
        />
        <CampoFormulario
          etiqueta="Busco"
          placeholder="ej. Aprender sobre marketing digital"
          value={busco}
          onChangeText={setBusco}
          maxLength={300}
          multiline
        />
        {perfilBasico?.correo ? (
          <Texto variante="cuerpoChico">Correo: {perfilBasico.correo}</Texto>
        ) : null}
        {fallo ? (
          <Texto variante="cuerpoChico" color="error" accessibilityRole="alert">
            {fallo}
          </Texto>
        ) : null}
        <Boton texto="Guardar cambios" tamano="grande" onPress={guardar} />
      </View>
    </PantallaSecundaria>
  );
}

const styles = StyleSheet.create({
  contenido: { gap: espacio.base },
});
