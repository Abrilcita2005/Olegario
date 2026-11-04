import { Image, Pressable, StyleSheet, View } from 'react-native';

import { IconoUbicacion } from '@/components/iconos/Iconos';
import { Texto } from '@/components/ui';
import type { Persona } from '@/models/comunidad';
import { colores, espacio, radios } from '@/theme';

import { BotonSolicitud } from './BotonSolicitud';

type Props = {
  persona: Persona;
  enviada?: boolean;
  esVos?: boolean;
  onVerPerfil?: () => void;
  onContactar?: () => void;
};

// Talento disponible (Figma: COMUNIDAD, "TALENTOS DISPONIBLES").
export function TarjetaTalento({
  persona,
  enviada = false,
  esVos,
  onVerPerfil,
  onContactar,
}: Props) {
  return (
    <View style={styles.tarjeta}>
      <View style={styles.cabecera}>
        <Pressable
          onPress={onVerPerfil}
          disabled={!onVerPerfil}
          accessibilityRole={onVerPerfil ? 'link' : undefined}
          accessibilityLabel={onVerPerfil ? `Ver perfil de ${persona.nombre}` : undefined}
          style={styles.identidad}
        >
          {persona.foto ? (
            <Image source={persona.foto} style={styles.foto} accessibilityIgnoresInvertColors />
          ) : null}
          <View style={styles.flex}>
            <Texto variante="tituloBienvenida" color="textoSobreOscuro" accessibilityRole="header">
              {esVos ? `${persona.nombre} (vos)` : persona.nombre}
            </Texto>
            {persona.profesion ? (
              <Texto variante="cuerpoChico" color="textoTerciario">
                {persona.profesion}
              </Texto>
            ) : null}
          </View>
        </Pressable>
        {persona.disponible ? (
          <View style={styles.disponible}>
            <Texto variante="chip" color="textoSobreClaro">
              Disponible
            </Texto>
          </View>
        ) : null}
      </View>

      {persona.ubicacion ? (
        <View style={styles.ubicacion}>
          <IconoUbicacion color={colores.acentoNaranja} />
          <Texto variante="cuerpoChico" color="textoSecundario">
            {persona.ubicacion}
          </Texto>
        </View>
      ) : null}

      {persona.ofrezco ? <Caja titulo="Ofrezco" texto={persona.ofrezco} /> : null}
      {persona.busco ? <Caja titulo="Busco" texto={persona.busco} color="acentoNaranja" /> : null}

      {esVos ? (
        <Texto variante="cuerpoChico" color="acentoLima">
          Así te ven en Conexión Abierta. En Modo Foco no aparecés en esta lista.
        </Texto>
      ) : onContactar ? (
        <BotonSolicitud texto="Contactar" enviada={enviada} onPress={onContactar} />
      ) : null}
    </View>
  );
}

function Caja({
  titulo,
  texto,
  color = 'acentoLima',
}: {
  titulo: string;
  texto: string;
  color?: 'acentoLima' | 'acentoNaranja';
}) {
  return (
    <View style={styles.caja}>
      <Texto variante="categoria" color={color}>
        {titulo}
      </Texto>
      <Texto variante="cuerpo" color="textoSecundario">
        {texto}
      </Texto>
    </View>
  );
}

const styles = StyleSheet.create({
  tarjeta: {
    gap: espacio.l,
    padding: espacio.base,
    borderRadius: radios.xxl,
    backgroundColor: colores.superficie,
  },
  cabecera: { flexDirection: 'row', alignItems: 'flex-start', gap: espacio.m },
  identidad: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: espacio.l },
  foto: { width: 44, height: 44, borderRadius: radios.pastilla },
  flex: { flex: 1 },
  disponible: {
    paddingHorizontal: espacio.l,
    paddingVertical: espacio.xxs,
    borderRadius: radios.pastilla,
    backgroundColor: colores.acentoLima,
  },
  ubicacion: { flexDirection: 'row', alignItems: 'center', gap: espacio.s },
  caja: {
    gap: espacio.xs,
    padding: espacio.l,
    borderRadius: radios.lg,
    borderWidth: 1,
    borderColor: colores.divisorSobreOscuro,
  },
});
