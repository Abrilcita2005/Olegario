import { router } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DivisorTexto } from '@/components/acceso/DivisorTexto';
import { PieHospitalidad } from '@/components/acceso/PieHospitalidad';
import { Logo } from '@/components/marca/Logo';
import { Boton, Texto, TextoDegradado } from '@/components/ui';
import { useSesion } from '@/estado/sesion';
import { colores, espacio } from '@/theme';

// Acceso (Figma: INICIO 1). Sin ingreso con Google, Apple ni Face ID por ahora (decisión 2026-11-03).
export default function AccesoScreen() {
  const { ingresar } = useSesion();
  return (
    <SafeAreaView style={styles.pantalla}>
      <ScrollView contentContainerStyle={styles.contenido}>
        <Logo fondo="sobreClaro" />
        <View style={styles.titulos}>
          <View
            accessible
            accessibilityRole="header"
            accessibilityLabel="Ecosistema creativo"
            style={styles.titulo}
          >
            <Texto variante="tituloDestacado">Ecosistema</Texto>
            <TextoDegradado>creativo</TextoDegradado>
          </View>
          <View style={styles.cita}>
            <View style={styles.barraCita} />
            <Texto variante="citaAcceso" style={styles.textoCita}>
              “Un espacio vivo para conectar personas, crear y expandir tu potencial profesional en
              el corazón de Mendoza.”
            </Texto>
          </View>
        </View>
        <View style={styles.acciones}>
          <Boton
            texto="Iniciar sesión"
            tamano="grande"
            onPress={() => router.push('/iniciar-sesion')}
          />
          <Boton
            texto="Crear una cuenta"
            tamano="grande"
            variante="secundario"
            onPress={() => router.push('/registro')}
          />
          <View style={styles.invitado}>
            <DivisorTexto texto="O continuá con" />
            <Boton
              texto="Modo Invitado"
              tamano="chico"
              variante="secundario"
              onPress={() => ingresar('invitado')}
              etiquetaAccesible="Entrar en modo invitado"
            />
          </View>
        </View>
        <PieHospitalidad />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: colores.fondo },
  contenido: {
    flexGrow: 1,
    paddingHorizontal: espacio.margenPantalla,
    paddingTop: espacio.margenPantalla + espacio.base,
    gap: espacio.grande + espacio.m,
  },
  titulos: { gap: espacio.xl, marginTop: espacio.grande },
  titulo: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-end', columnGap: espacio.s },
  cita: { flexDirection: 'row', paddingVertical: espacio.xs },
  barraCita: { width: 2, borderRadius: 9999, backgroundColor: colores.superficie },
  textoCita: { flex: 1, paddingLeft: espacio.xxl },
  acciones: { gap: espacio.xl },
  invitado: { gap: espacio.xl, paddingTop: espacio.m },
});
