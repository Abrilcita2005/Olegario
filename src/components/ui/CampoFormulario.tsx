import { useId, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { IconoOjo, IconoOjoTachado } from '@/components/iconos/Iconos';
import { AREA_TACTIL_MINIMA, colores, espacio, radios, tipografia } from '@/theme';

import { Texto } from './Texto';

type Props = Omit<TextInputProps, 'style'> & {
  etiqueta: string;
  error?: string;
  esContrasena?: boolean;
  debajo?: React.ReactNode;
};

// Campo de formulario de las pantallas de acceso: tarjeta oscura, etiqueta lima e input gris.
export function CampoFormulario({
  etiqueta,
  error,
  esContrasena = false,
  debajo,
  ...props
}: Props) {
  const [visible, setVisible] = useState(false);
  const idError = useId();
  const ocultar = esContrasena && !visible;

  return (
    <View style={styles.tarjeta}>
      <Texto variante="etiquetaCampo" color="acentoLima">
        {etiqueta}
      </Texto>
      <View style={[styles.input, error ? styles.inputConError : null]}>
        <TextInput
          {...props}
          accessibilityLabel={etiqueta}
          accessibilityHint={error}
          aria-describedby={error ? idError : undefined}
          secureTextEntry={ocultar}
          placeholderTextColor={colores.textoTerciario}
          style={styles.texto}
        />
        {esContrasena ? (
          <Pressable
            onPress={() => setVisible((v) => !v)}
            accessibilityRole="button"
            accessibilityLabel={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            hitSlop={8}
            style={styles.botonOjo}
          >
            {visible ? (
              <IconoOjoTachado color={colores.textoSobreOscuro} />
            ) : (
              <IconoOjo color={colores.textoSobreOscuro} />
            )}
          </Pressable>
        ) : null}
      </View>
      {debajo}
      {error ? (
        <Texto nativeID={idError} variante="meta" color="error" accessibilityLiveRegion="polite">
          {error}
        </Texto>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  tarjeta: {
    gap: espacio.xs,
    padding: espacio.base,
    borderRadius: radios.lg,
    backgroundColor: colores.superficie,
  },
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: AREA_TACTIL_MINIMA,
    paddingHorizontal: espacio.base,
    borderRadius: radios.md,
    borderWidth: 1,
    borderColor: colores.transparente,
    backgroundColor: colores.superficieElevada,
  },
  inputConError: { borderColor: colores.error },
  texto: {
    ...tipografia.input,
    flex: 1,
    paddingVertical: espacio.xl,
    color: colores.textoSobreOscuro,
  },
  botonOjo: { paddingLeft: espacio.m },
});
