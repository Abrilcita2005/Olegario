import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BotonSolicitud } from '@/components/comunidad/BotonSolicitud';
import { PanelSolicitud } from '@/components/comunidad/PanelSolicitud';
import { IconoFlechaVolver } from '@/components/iconos/Iconos';
import { PantallaEnConstruccion } from '@/components/PantallaEnConstruccion';
import { BarraFija } from '@/components/navegacion/BarraFija';
import { ESPACIO_INFERIOR_CONTENIDO } from '@/components/navegacion/medidas';
import { PantallaSecundaria } from '@/components/navegacion/PantallaSecundaria';
import { Texto } from '@/components/ui';
import { useComunidad } from '@/estado/comunidad';
import { colores, degradados, espacio, radios } from '@/theme';

const PROPORCION_PORTADA = 373 / 402;

// Perfil profesional público (Figma: COMUNIDAD, perfil de Martina Rossi; referencia que pasó la
// responsable el 2026-11-04): foto grande que se funde con el fondo, flecha para volver encima,
// nombre, profesión, dónde está (puntos rosas) y "SOBRE MI". Debajo, Ofrezco/Busco si los hay y
// Contactar (solicitud simulada, D-57). Solo se muestran los datos que existen.
export default function PersonaScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { top } = useSafeAreaInsets();
  const { personas, solicitudEnviada, enviarSolicitud } = useComunidad();
  const persona = personas.find((p) => p.id === id);
  const [contactando, setContactando] = useState(false);

  if (!persona) {
    return (
      <PantallaSecundaria>
        <PantallaEnConstruccion titulo="Perfil no encontrado" etapa="sin datos" />
      </PantallaSecundaria>
    );
  }

  const portada = persona.portada ?? persona.foto;

  return (
    <View style={styles.pantalla}>
      <ScrollView contentContainerStyle={styles.desplazable}>
        <View style={styles.portada}>
          {portada ? (
            <Image
              source={portada}
              resizeMode="cover"
              style={styles.imagen}
              accessibilityLabel={`Foto de ${persona.nombre}`}
              accessibilityIgnoresInvertColors
            />
          ) : (
            <LinearGradient
              colors={degradados.marca.colores}
              locations={degradados.marca.posiciones}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
          )}
          {/* La foto se funde con el fondo, como en Figma. */}
          <LinearGradient
            colors={[colores.fondoTransparente, colores.fondo]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.fundido}
          />
        </View>

        <View style={styles.contenido}>
          <Texto variante="tituloAcceso" accessibilityRole="header">
            {persona.nombre}
          </Texto>
          {persona.profesion ? <Texto variante="citaAcceso">{persona.profesion}</Texto> : null}
          {persona.ubicacion ? (
            <View style={styles.estados}>
              {persona.ubicacion.split(' · ').map((parte) => (
                <View key={parte} style={styles.estado}>
                  <View style={styles.punto} />
                  <Texto variante="cuerpoChico" color="acento">
                    {parte}
                  </Texto>
                </View>
              ))}
            </View>
          ) : null}

          {persona.sobreMi ? <Caja titulo="Sobre mí" texto={persona.sobreMi} /> : null}
          {persona.ofrezco ? <Caja titulo="Ofrezco" texto={persona.ofrezco} /> : null}
          {persona.busco ? <Caja titulo="Busco" texto={persona.busco} /> : null}

          <BotonSolicitud
            texto="Contactar"
            enviada={solicitudEnviada(persona.id)}
            onPress={() => setContactando(true)}
          />
        </View>
      </ScrollView>

      <Pressable
        onPress={() => (router.canGoBack() ? router.back() : router.navigate('/comunidad'))}
        accessibilityRole="button"
        accessibilityLabel="Volver"
        hitSlop={8}
        style={[styles.volver, { top: top + espacio.base }]}
      >
        <IconoFlechaVolver tamano={35} color={colores.textoSobreOscuro} />
      </Pressable>

      <BarraFija activa="comunidad" />

      {contactando ? (
        <PanelSolicitud
          titulo="Contactar"
          destinatario={persona.nombre}
          onEnviar={(mensaje) => enviarSolicitud(persona.id, mensaje)}
          onCerrar={() => setContactando(false)}
        />
      ) : null}
    </View>
  );
}

function Caja({ titulo, texto }: { titulo: string; texto: string }) {
  return (
    <View style={styles.caja}>
      <View style={styles.etiqueta}>
        <Texto variante="categoria" color="acentoNaranja">
          {titulo}
        </Texto>
      </View>
      <Texto variante="cuerpo" color="textoSobreOscuroSuave">
        {texto}
      </Texto>
    </View>
  );
}

const styles = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: colores.fondo },
  desplazable: { paddingBottom: ESPACIO_INFERIOR_CONTENIDO },
  portada: { width: '100%', aspectRatio: 1 / PROPORCION_PORTADA, overflow: 'hidden' },
  // Tamaño explícito: en la web, absoluteFill solo no escala la imagen.
  imagen: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' },
  // Solo el último cuarto de la foto se funde con el fondo, para que la foto se vea nítida.
  fundido: { position: 'absolute', left: 0, right: 0, bottom: 0, height: '25%' },
  contenido: {
    gap: espacio.base,
    marginTop: -espacio.m,
    paddingHorizontal: espacio.margenPantalla,
  },
  estados: { flexDirection: 'row', flexWrap: 'wrap', gap: espacio.grande },
  estado: { flexDirection: 'row', alignItems: 'center', gap: espacio.s },
  punto: { width: 7, height: 7, borderRadius: radios.pastilla, backgroundColor: colores.acento },
  caja: {
    gap: espacio.l,
    padding: espacio.base,
    borderRadius: radios.xxl,
    backgroundColor: colores.superficie,
  },
  etiqueta: {
    alignSelf: 'flex-start',
    paddingHorizontal: espacio.l,
    paddingVertical: espacio.xxs,
    borderRadius: radios.pastilla,
    borderWidth: 1,
    borderColor: colores.bordeNaranja,
  },
  volver: { position: 'absolute', left: espacio.margenPantalla },
});
