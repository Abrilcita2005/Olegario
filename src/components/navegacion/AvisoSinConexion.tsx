import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Chip, Texto } from '@/components/ui';
import { useAgenda } from '@/estado/agenda';
import { useComunidad } from '@/estado/comunidad';
import { useReservas } from '@/estado/reservas';
import { colores, espacio, radios } from '@/theme';

// Aviso de las pestañas cuando el servidor de Olegario no responde (Etapa 14): sin él, la app mostraba
// pantallas vacías que parecían ciertas ("Todavía no tenés reservas"). "Reintentar" vuelve a leer todo.
export function AvisoSinConexion() {
  const reservas = useReservas();
  const agenda = useAgenda();
  const comunidad = useComunidad();
  const [reintentando, setReintentando] = useState(false);

  if (!reservas.sinConexion && !agenda.sinConexion && !comunidad.sinConexion) return null;

  const reintentar = async () => {
    setReintentando(true);
    await Promise.all([reservas.actualizar(), agenda.actualizar(), comunidad.actualizar()]);
    setReintentando(false);
  };

  return (
    <View style={styles.aviso} accessibilityRole="alert">
      <View style={styles.textos}>
        <Texto variante="cuerpoChicoDestacado" color="textoSobreOscuro">
          Sin conexión con Olegario
        </Texto>
        <Texto variante="cuerpoChico" color="textoSecundario">
          Lo que ves puede no estar actualizado. Revisá tu conexión a internet.
        </Texto>
      </View>
      <Chip
        texto={reintentando ? 'Reintentando…' : 'Reintentar'}
        variante="destacado"
        onPress={reintentando ? undefined : reintentar}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  aviso: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacio.m,
    padding: espacio.base,
    marginBottom: espacio.l,
    borderRadius: radios.xl,
    borderLeftWidth: 4,
    borderLeftColor: colores.advertencia,
    backgroundColor: colores.superficie,
  },
  textos: { flex: 1, gap: espacio.xxs },
});
