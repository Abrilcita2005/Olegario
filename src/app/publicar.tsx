import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { PantallaSecundaria } from '@/components/navegacion/PantallaSecundaria';
import { Boton, CampoFormulario, SelectorSegmentado, Texto } from '@/components/ui';
import { useComunidad } from '@/estado/comunidad';
import type { TipoPublicacion } from '@/models/comunidad';
import { espacio } from '@/theme';
import {
  LARGO_MAXIMO_DESCRIPCION,
  LARGO_MAXIMO_TITULO,
  separarEtiquetas,
  validarPublicacion,
  type ErroresPublicacion,
} from '@/utils/comunidad';

const TIPOS = [
  { valor: 'colaborador', etiqueta: 'Busco colaborador' },
  { valor: 'iniciativa', etiqueta: 'Iniciativa' },
] as const;

// Publicar proyecto o búsqueda. PROVISORIO (no hay diseño en Figma; decisión de la responsable,
// 2026-11-04): la publicación se guarda en el teléfono y aparece primera en Comunidad.
export default function PublicarScreen() {
  const { publicar } = useComunidad();
  const [tipo, setTipo] = useState<TipoPublicacion>('colaborador');
  const [busca, setBusca] = useState('');
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [etiquetas, setEtiquetas] = useState('');
  const [errores, setErrores] = useState<ErroresPublicacion>({});
  const [enviando, setEnviando] = useState(false);

  const enviar = async () => {
    const encontrados = validarPublicacion({ tipo, busca, titulo, descripcion, etiquetas });
    setErrores(encontrados);
    if (Object.keys(encontrados).length > 0) return;
    setEnviando(true);
    await publicar({
      tipo,
      busca: tipo === 'colaborador' ? busca.trim() : undefined,
      titulo: titulo.trim(),
      descripcion: descripcion.trim(),
      etiquetas: separarEtiquetas(etiquetas),
    });
    setEnviando(false);
    router.back();
  };

  return (
    <PantallaSecundaria>
      <View style={styles.contenido}>
        <Texto variante="tituloAcceso" accessibilityRole="header">
          Publicá tu proyecto
        </Texto>
        <Texto variante="cuerpo">
          Contale a la comunidad qué estás armando y a quién buscás para sumarse.
        </Texto>
        <SelectorSegmentado
          opciones={TIPOS}
          seleccionado={tipo}
          onCambiar={setTipo}
          etiquetaAccesible="Tipo de publicación"
        />
        {tipo === 'colaborador' ? (
          <CampoFormulario
            etiqueta="¿Qué perfil buscás?"
            placeholder="ej. Diseñador/a UI/UX"
            value={busca}
            onChangeText={setBusca}
            maxLength={50}
            error={errores.busca}
          />
        ) : null}
        <CampoFormulario
          etiqueta="Título"
          placeholder="ej. EcoTrack: App de impacto"
          value={titulo}
          onChangeText={setTitulo}
          maxLength={LARGO_MAXIMO_TITULO}
          error={errores.titulo}
        />
        <CampoFormulario
          etiqueta="Descripción"
          placeholder="Qué necesitás, cuándo y cómo se trabaja"
          value={descripcion}
          onChangeText={setDescripcion}
          maxLength={LARGO_MAXIMO_DESCRIPCION}
          multiline
          error={errores.descripcion}
        />
        <CampoFormulario
          etiqueta="Etiquetas (separadas por coma, opcional)"
          placeholder="Figma, Mobile UX"
          value={etiquetas}
          onChangeText={setEtiquetas}
        />
        <Boton texto="Publicar" tamano="grande" onPress={enviar} cargando={enviando} />
      </View>
    </PantallaSecundaria>
  );
}

const styles = StyleSheet.create({
  contenido: { gap: espacio.base },
});
