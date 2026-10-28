import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { IconoFlechaVolver } from '@/components/iconos/Iconos';
import { IconoSubmarca } from '@/components/marca/IconoSubmarca';
import { Logo } from '@/components/marca/Logo';
import {
  Boton,
  BotonIcono,
  CampoFormulario,
  Casilla,
  Chip,
  EstadoCargando,
  EstadoError,
  EstadoVacio,
  Esqueleto,
  IndicadorFortaleza,
  SelectorSegmentado,
  Tarjeta,
  Texto,
} from '@/components/ui';
import { colores, espacio, marca, radios, tipografia, type VarianteTexto } from '@/theme';
import { calcularFortaleza } from '@/utils/fortalezaContrasena';

// Catálogo del sistema de diseño (Etapa 4). Herramienta de desarrollo: se abre en /catalogo.
// Se oculta o elimina antes de publicar la app.
const sinAccion = () => {};

const ROLES = [
  { valor: 'miembro', etiqueta: 'Miembro coworker' },
  { valor: 'invitado', etiqueta: 'Invitado / evento' },
] as const;

export default function CatalogoScreen() {
  const [rol, setRol] = useState<(typeof ROLES)[number]['valor']>('miembro');
  const [contrasena, setContrasena] = useState('');
  const [acepto, setAcepto] = useState(false);

  return (
    <SafeAreaView style={styles.pantalla}>
      <ScrollView contentContainerStyle={styles.contenido}>
        <Texto variante="tituloPantalla" accessibilityRole="header">
          Catálogo de diseño
        </Texto>

        <Seccion titulo="Marca">
          <Logo fondo="sobreClaro" />
          <View style={styles.fondoOscuro}>
            <Logo fondo="sobreOscuro" />
          </View>
          <View style={styles.fila}>
            {(['cowork', 'stream', 'network', 'cafe'] as const).map((s) => (
              <IconoSubmarca key={s} submarca={s} />
            ))}
          </View>
        </Seccion>

        <Seccion titulo="Colores">
          <View style={styles.fila}>
            {Object.entries(marca).map(([nombre, valor]) => (
              <View key={nombre} style={styles.muestra}>
                <View style={[styles.color, { backgroundColor: valor }]} />
                <Texto variante="meta">{nombre}</Texto>
                <Texto variante="meta">{valor}</Texto>
              </View>
            ))}
          </View>
        </Seccion>

        <Seccion titulo="Íconos sin aro">
          <View style={styles.fila}>
            <IconoSubmarca submarca="cowork" conAro={false} />
          </View>
        </Seccion>

        <Seccion titulo="Tipografía">
          {(Object.keys(tipografia) as VarianteTexto[]).map((v) => (
            <Texto key={v} variante={v}>
              {v} · Impulsamos personas
            </Texto>
          ))}
        </Seccion>

        <Seccion titulo="Botones">
          <Boton texto="Iniciar sesión" tamano="grande" onPress={sinAccion} />
          <Boton
            texto="Crear una cuenta"
            tamano="grande"
            variante="secundario"
            onPress={sinAccion}
          />
          <Boton texto="Ver detalles y check-in" variante="contorno" onPress={sinAccion} />
          <Boton texto="Crear cuenta y continuar" onPress={sinAccion} cargando />
          <Boton texto="Deshabilitado" onPress={sinAccion} deshabilitado />
          <View style={styles.fondoOscuroCentro}>
            <Boton texto="SIGUIENTE" variante="siguienteClaro" onPress={sinAccion} />
          </View>
          <View style={styles.centro}>
            <Boton texto="SIGUIENTE" variante="siguienteOscuro" onPress={sinAccion} />
          </View>
          <BotonIcono
            etiquetaAccesible="Volver"
            onPress={sinAccion}
            icono={<IconoFlechaVolver color={colores.textoSobreOscuro} />}
          />
        </Seccion>

        <Seccion titulo="Chips">
          <View style={styles.fila}>
            <Chip texto="En curso" />
            <Chip texto="Ver todo >" variante="enlace" />
            <Chip texto="20% OFF" variante="descuento" />
            <Chip texto="4 Puestos Libres" variante="destacado" />
          </View>
        </Seccion>

        <Seccion titulo="Formularios">
          <SelectorSegmentado
            opciones={ROLES}
            seleccionado={rol}
            onCambiar={setRol}
            etiquetaAccesible="Tipo de acceso"
          />
          <CampoFormulario etiqueta="Nombre completo" placeholder="ej. Sofía Valenzuela" />
          <CampoFormulario
            etiqueta="Correo profesional"
            placeholder="sofia@estudio.design"
            keyboardType="email-address"
            autoCapitalize="none"
            error="Ingresá un correo válido."
          />
          <CampoFormulario
            etiqueta="Contraseña"
            placeholder="Mínimo 8 caracteres"
            esContrasena
            value={contrasena}
            onChangeText={setContrasena}
            debajo={<IndicadorFortaleza nivel={calcularFortaleza(contrasena)} />}
          />
          <Casilla
            marcada={acepto}
            onCambiar={setAcepto}
            texto="Acepto los términos de convivencia y manifiesto de la comunidad Olegario."
            aclaracion="Cuidamos el silencio productivo, la hospitalidad y la cultura de colaboración abierta."
          />
        </Seccion>

        <Seccion titulo="Tarjeta">
          <Tarjeta elevada>
            <Texto variante="categoria" color="acentoNaranja">
              OLE/COWORK · Puesto individual
            </Texto>
            <Texto variante="tituloTarjeta" color="textoSobreOscuro">
              Mesa con Luz Natural
            </Texto>
            <Texto variante="cuerpoChico" color="textoSecundario">
              Hoy: 10:00 - 14:00 hs (dato de ejemplo)
            </Texto>
          </Tarjeta>
        </Seccion>

        <Seccion titulo="Estados (provisionales)">
          <Esqueleto />
          <EstadoCargando />
          <EstadoVacio
            titulo="Todavía no tenés reservas"
            texto="Cuando reserves un espacio lo vas a ver acá."
            accion={{ texto: 'Reservá tu lugar', onPress: sinAccion }}
          />
          <EstadoError
            titulo="No pudimos cargar la información"
            texto="Revisá tu conexión e intentá de nuevo."
            accion={{ texto: 'Reintentar', onPress: sinAccion }}
          />
        </Seccion>
      </ScrollView>
    </SafeAreaView>
  );
}

function Seccion({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <View style={styles.seccion}>
      <Texto variante="tituloSeccion" accessibilityRole="header">
        {titulo}
      </Texto>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  pantalla: { flex: 1, backgroundColor: colores.fondo },
  contenido: { padding: espacio.margenPantalla, gap: espacio.grande },
  seccion: { gap: espacio.xl },
  fila: { flexDirection: 'row', flexWrap: 'wrap', gap: espacio.xl, alignItems: 'center' },
  centro: { alignItems: 'center' },
  fondoOscuro: {
    padding: espacio.base,
    borderRadius: radios.xxl,
    backgroundColor: colores.fondoOscuro,
  },
  fondoOscuroCentro: {
    alignItems: 'center',
    padding: espacio.base,
    borderRadius: radios.xxl,
    backgroundColor: colores.fondoOscuro,
  },
  muestra: { alignItems: 'center', gap: espacio.xs },
  color: { width: 56, height: 56, borderRadius: radios.lg },
});
