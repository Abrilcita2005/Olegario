import { useEffect, useState, type ReactNode } from 'react';
import {
  BackHandler,
  Image,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MazoFotos } from '@/components/bienvenida/MazoFotos';
import { IconoCandado, IconoLupaEstrella, IconoManoCorazon } from '@/components/iconos/Iconos';
import { Logo } from '@/components/marca/Logo';
import { Boton, Texto } from '@/components/ui';
import { useSesion } from '@/estado/sesion';
import { colores, espacio, radios } from '@/theme';

import { fotoEvento, fotosCollage } from '../../../data/bienvenida';

// Bienvenidas 1 a 3 (Figma: BIENVENIDA 1, 2 y 3). Se muestran solo la primera vez.
// La 1 queda tal cual Figma, solo con "SIGUIENTE" (decisión de la responsable, 2026-11-03).
export default function BienvenidaScreen() {
  const { marcarBienvenidaVista } = useSesion();
  const [paso, setPaso] = useState(1);

  // El botón atrás de Android vuelve al paso anterior en lugar de cerrar la app.
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (paso > 1) {
        setPaso(paso - 1);
        return true;
      }
      return false;
    });
    return () => sub.remove();
  }, [paso]);

  // Se avanza un instante después de tocar, para que se vea el cambio de color del botón.
  const siguiente = () =>
    setTimeout(() => (paso < 3 ? setPaso(paso + 1) : marcarBienvenidaVista()), 180);
  const oscuro = paso !== 2;

  return (
    <SafeAreaView style={[styles.pantalla, oscuro ? styles.fondoOscuro : styles.fondoClaro]}>
      <ScrollView contentContainerStyle={styles.contenido} bounces={false}>
        <Logo fondo={oscuro ? 'sobreOscuro' : 'sobreClaro'} />
        <View style={styles.cuerpo}>
          {paso === 1 ? <Paso1 /> : null}
          {paso === 2 ? <Paso2 /> : null}
          {paso === 3 ? <Paso3 /> : null}
        </View>
        <View style={styles.pie}>
          <Boton
            texto="SIGUIENTE"
            variante={oscuro ? 'siguienteClaro' : 'siguienteOscuro'}
            onPress={siguiente}
            etiquetaAccesible={`Siguiente, paso ${paso} de 3`}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Paso1() {
  return (
    <View style={styles.paso1}>
      <Texto variante="tituloConsentimiento" color="fondo" accessibilityRole="header">
        ¡Queremos ofrecerte la mejor experiencia!
      </Texto>
      <View style={styles.lista}>
        <FilaIcono icono={<IconoLupaEstrella color={colores.fondo} />}>
          Las cookies y permisos de rastreo nos ayudan a ofrecerte contenido relevante.
        </FilaIcono>
        <FilaIcono icono={<IconoCandado color={colores.fondo} />}>
          Respetamos y protegemos tu privacidad en todo momento.
        </FilaIcono>
        <FilaIcono icono={<IconoManoCorazon color={colores.fondo} />}>
          Al aceptar, haremos de esta app un lugar genial para ti.
        </FilaIcono>
      </View>
    </View>
  );
}

function FilaIcono({ icono, children }: { icono: ReactNode; children: string }) {
  return (
    <View style={styles.fila}>
      <View style={styles.icono} importantForAccessibility="no" accessibilityElementsHidden>
        {icono}
      </View>
      <Texto variante="cuerpoMedio" color="fondo" style={styles.textoFila}>
        {children}
      </Texto>
    </View>
  );
}

function Paso2() {
  const { width } = useWindowDimensions();
  const ancho = Math.min(width, 402);
  return (
    <View>
      <View style={styles.collage}>
        <MazoFotos fotos={fotosCollage} ancho={ancho} alto={360 * Math.min(1, ancho / 402)} />
      </View>
      <View style={styles.textos}>
        <Texto variante="tituloBienvenida" accessibilityRole="header">
          Donde las ideas encuentran su lugar.
        </Texto>
        <Texto variante="cuerpoChico">
          Hay lugares donde simplemente vas a trabajar.{'\n'}Y hay lugares que te inspiran a hacerlo
          de otra manera.{'\n\n'}Olegario nace para crear, aprender, compartir y conectar con nuevas
          personas que están haciendo cosas{' '}
          <Texto variante="cuerpoChicoDestacado">tan interesantes como vos.</Texto>
        </Texto>
      </View>
    </View>
  );
}

function Paso3() {
  const { width } = useWindowDimensions();
  // Ancho disponible (sin márgenes) y proporción de Figma: 341 × 375.
  const ancho = Math.min(width, 402) - espacio.margenPantalla * 2;
  return (
    <View>
      <Image
        source={fotoEvento}
        style={[styles.fotoEvento, { width: ancho, height: (ancho * 375) / 341 }]}
        accessibilityLabel="Evento en Olegario con mucha gente"
      />
      <View style={styles.textos}>
        <Texto variante="tituloBienvenida" color="fondo" accessibilityRole="header">
          Tu experiencia empieza acá.
        </Texto>
        <Texto variante="cuerpoChico" color="fondo">
          Vas a poder vivir Olegario estés donde estés. Encontrá y reservá el espacio que mejor se
          adapte a vos, descubrí eventos y capacitaciones, conocé las novedades y aprovechá
          beneficios exclusivos.{'\n\n'}
          <Texto variante="cuerpoChicoDestacado" color="fondo">
            Bienvenido a Olegario.
          </Texto>
        </Texto>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pantalla: { flex: 1 },
  fondoOscuro: { backgroundColor: colores.fondoOscuro },
  fondoClaro: { backgroundColor: colores.fondo },
  contenido: {
    flexGrow: 1,
    paddingHorizontal: espacio.margenPantalla,
    paddingTop: espacio.margenPantalla,
  },
  cuerpo: { flex: 1, marginTop: espacio.grande },
  pie: { alignItems: 'center', paddingVertical: espacio.grande + espacio.base },
  paso1: { gap: espacio.grande + espacio.l, marginTop: espacio.base },
  lista: { gap: espacio.grande },
  fila: { flexDirection: 'row', alignItems: 'center', gap: espacio.grande },
  icono: { width: 32, alignItems: 'center' },
  textoFila: { flex: 1 },
  collage: { marginHorizontal: -espacio.margenPantalla, alignItems: 'center' },
  textos: { gap: espacio.base, marginTop: espacio.grande },
  fotoEvento: { borderRadius: radios.md + 2 },
});
