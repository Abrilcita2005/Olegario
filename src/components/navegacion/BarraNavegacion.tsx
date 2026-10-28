import type { TabListProps, TabTriggerSlotProps } from 'expo-router/ui';
import type { ComponentType } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  IconoAgenda,
  IconoComunidad,
  IconoEspacios,
  IconoInicio,
} from '@/components/iconos/Iconos';
import { Texto } from '@/components/ui';
import { colores, espacio, radios } from '@/theme';

import { BARRA } from './medidas';

export const PESTANAS = [
  { nombre: 'inicio', ruta: '/', etiqueta: 'Inicio', Icono: IconoInicio },
  { nombre: 'espacios', ruta: '/espacios', etiqueta: 'Espacios', Icono: IconoEspacios },
  { nombre: 'agenda', ruta: '/agenda', etiqueta: 'Agenda', Icono: IconoAgenda },
  { nombre: 'comunidad', ruta: '/comunidad', etiqueta: 'Comunidad', Icono: IconoComunidad },
] as const;

// Contenedor flotante de la barra inferior (Figma: oscura, radio 16, 52 px de alto). Queda fija al desplazar.
export function ContenedorBarra(props: TabListProps) {
  const { bottom } = useSafeAreaInsets();
  return (
    <View
      {...props}
      accessibilityRole="tablist"
      style={[styles.barra, { bottom: Math.max(bottom, BARRA.separacionInferior) }]}
    />
  );
}

type PropsPestana = TabTriggerSlotProps & {
  etiqueta: string;
  Icono: ComponentType<{ color: string; tamano?: number }>;
};

// `ref` se descarta: el tipo que declara expo-router no coincide con el de Pressable en RN 0.88.
export function BotonPestana({ etiqueta, Icono, isFocused, ref: _ref, ...props }: PropsPestana) {
  const color = isFocused ? colores.textoSobreOscuro : colores.textoTerciario;
  return (
    <Pressable
      {...props}
      accessibilityRole="tab"
      accessibilityLabel={etiqueta}
      accessibilityState={{ selected: isFocused }}
      style={[styles.pestana, isFocused && styles.pestanaActiva]}
    >
      <Icono color={color} tamano={17} />
      <Texto variante={isFocused ? 'pestanaActiva' : 'pestana'} style={{ color }}>
        {etiqueta}
      </Texto>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  barra: {
    position: 'absolute',
    left: BARRA.margenLateral,
    right: BARRA.margenLateral,
    height: BARRA.alto,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: espacio.s,
    borderRadius: radios.xxl,
    backgroundColor: colores.superficie,
  },
  pestana: {
    width: 64,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    gap: espacio.xxs,
    borderRadius: radios.lg,
  },
  pestanaActiva: { backgroundColor: colores.acento },
});
