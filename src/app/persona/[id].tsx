import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { BotonSolicitud } from '@/components/comunidad/BotonSolicitud';
import { PanelSolicitud } from '@/components/comunidad/PanelSolicitud';
import { IconoUbicacion } from '@/components/iconos/Iconos';
import { PantallaEnConstruccion } from '@/components/PantallaEnConstruccion';
import { PantallaSecundaria } from '@/components/navegacion/PantallaSecundaria';
import { Texto } from '@/components/ui';
import { useComunidad } from '@/estado/comunidad';
import { colores, degradados, espacio, radios } from '@/theme';

// Perfil profesional público. PROVISORIO: no hay captura en Figma (P-27); se usan los datos conocidos
// (portada, nombre, profesión, dónde está, "Sobre mí", ofrezco y busco). Decisión de la responsable,
// 2026-11-04. Solo se muestran los datos que existen: no se inventa información.
export default function PersonaScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
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

  return (
    <PantallaSecundaria>
      <View style={styles.portada}>
        <LinearGradient
          colors={degradados.marca.colores}
          locations={degradados.marca.posiciones}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        {persona.foto ? (
          <Image
            source={persona.foto}
            style={styles.foto}
            accessibilityIgnoresInvertColors
            accessibilityLabel={`Foto de ${persona.nombre}`}
          />
        ) : null}
      </View>

      <View style={styles.contenido}>
        <View style={styles.centro}>
          <Texto variante="tituloAcceso" accessibilityRole="header" style={styles.textoCentro}>
            {persona.nombre}
          </Texto>
          {persona.profesion ? (
            <Texto variante="cuerpo" style={styles.textoCentro}>
              {persona.profesion}
            </Texto>
          ) : null}
          {persona.ubicacion ? (
            <View style={styles.ubicacion}>
              <View style={styles.puntoLima} />
              <IconoUbicacion color={colores.acentoNaranja} />
              <Texto variante="cuerpoChicoDestacado">{persona.ubicacion}</Texto>
            </View>
          ) : null}
        </View>

        {persona.sobreMi ? <Caja titulo="Sobre mí" texto={persona.sobreMi} /> : null}
        {persona.ofrezco ? <Caja titulo="Ofrezco" texto={persona.ofrezco} /> : null}
        {persona.busco ? <Caja titulo="Busco" texto={persona.busco} /> : null}

        <BotonSolicitud
          texto="Contactar"
          enviada={solicitudEnviada(persona.id)}
          onPress={() => setContactando(true)}
        />
      </View>

      {contactando ? (
        <PanelSolicitud
          titulo="Contactar"
          destinatario={persona.nombre}
          onEnviar={(mensaje) => enviarSolicitud(persona.id, mensaje)}
          onCerrar={() => setContactando(false)}
        />
      ) : null}
    </PantallaSecundaria>
  );
}

function Caja({ titulo, texto }: { titulo: string; texto: string }) {
  return (
    <View style={styles.caja}>
      <Texto variante="categoria" color="acentoLima">
        {titulo}
      </Texto>
      <Texto variante="cuerpo" color="textoSecundario">
        {texto}
      </Texto>
    </View>
  );
}

const TAMANO_FOTO = 120;

const styles = StyleSheet.create({
  portada: {
    height: 160,
    marginTop: espacio.base,
    marginBottom: TAMANO_FOTO / 2,
    alignItems: 'center',
    justifyContent: 'flex-end',
    borderRadius: radios.xxl,
  },
  foto: {
    width: TAMANO_FOTO,
    height: TAMANO_FOTO,
    marginBottom: -TAMANO_FOTO / 2,
    borderRadius: radios.pastilla,
    borderWidth: 4,
    borderColor: colores.fondo,
  },
  contenido: { gap: espacio.base, marginTop: espacio.base },
  centro: { alignItems: 'center', gap: espacio.xs },
  textoCentro: { textAlign: 'center' },
  ubicacion: { flexDirection: 'row', alignItems: 'center', gap: espacio.s, marginTop: espacio.s },
  puntoLima: {
    width: 8,
    height: 8,
    borderRadius: radios.pastilla,
    backgroundColor: colores.acentoLima,
  },
  caja: {
    gap: espacio.xs,
    padding: espacio.base,
    borderRadius: radios.xxl,
    backgroundColor: colores.superficie,
  },
});
