import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { IconoSubmarca } from '@/components/marca/IconoSubmarca';
import { PantallaSecundaria } from '@/components/navegacion/PantallaSecundaria';
import { Chip, SelectorSegmentado, Tarjeta, Texto } from '@/components/ui';
import { espacio } from '@/theme';
import { formatearPrecio } from '@/utils/formatos';

import { productosDePrueba, type CategoriaCarta } from '../../data/mock/cartaCafe';

// Carta del café (OLE/CAFÉ). DISEÑO PROVISIONAL propuesto por el equipo (no está en Figma, P-38),
// armado con el sistema de diseño. Productos y precios: datos de ejemplo.
const FILTROS = [
  { valor: 'todo', etiqueta: 'Todo' },
  { valor: 'cafes', etiqueta: 'Cafés' },
  { valor: 'frios', etiqueta: 'Fríos' },
  { valor: 'pasteleria', etiqueta: 'Pastelería' },
] as const;

type Filtro = 'todo' | CategoriaCarta;

export default function CartaCafeScreen() {
  const [filtro, setFiltro] = useState<Filtro>('todo');
  const productos = productosDePrueba.filter((p) => filtro === 'todo' || p.categoria === filtro);

  return (
    <PantallaSecundaria>
      <View style={styles.cabecera}>
        <IconoSubmarca submarca="cafe" tamano={64} />
        <View style={styles.titulos}>
          <Texto variante="categoria" color="acentoNaranja">
            OLE/CAFÉ
          </Texto>
          <Texto variante="tituloDestacado" accessibilityRole="header">
            Carta del{' '}
            <Texto variante="tituloDestacado" color="acento">
              café
            </Texto>
          </Texto>
        </View>
      </View>
      <Texto variante="cuerpo" style={styles.bajada}>
        Café de especialidad para acompañar tu jornada en Olegario.
      </Texto>
      <Chip texto="Carta de ejemplo · productos y precios a confirmar" variante="destacado" />

      <Tarjeta elevada style={styles.promo}>
        <View style={styles.filaChips}>
          <Chip texto="20% OFF" variante="descuento" />
          <Texto variante="categoria" color="textoSobreOscuro">
            Promo cafetería
          </Texto>
        </View>
        <Texto variante="cuerpoChico" color="textoSecundario">
          Flat White de especialidad + Cookie casera de avena
        </Texto>
      </Tarjeta>

      <SelectorSegmentado
        opciones={FILTROS}
        seleccionado={filtro}
        onCambiar={setFiltro}
        etiquetaAccesible="Filtrar la carta"
      />

      <View style={styles.lista}>
        {productos.map((producto) => (
          <Tarjeta key={producto.id} style={styles.producto}>
            <View style={styles.textosProducto}>
              <Texto variante="tituloTarjeta" color="textoSobreOscuro">
                {producto.nombre}
              </Texto>
              <Texto variante="cuerpoChico" color="textoSecundario">
                {producto.descripcion}
              </Texto>
            </View>
            <Texto
              variante="tituloTarjeta"
              color="acentoLima"
              accessibilityLabel={`Precio de ejemplo ${formatearPrecio(producto.precioDeEjemplo)}`}
            >
              {formatearPrecio(producto.precioDeEjemplo)}
            </Texto>
          </Tarjeta>
        ))}
      </View>
    </PantallaSecundaria>
  );
}

const styles = StyleSheet.create({
  cabecera: { flexDirection: 'row', alignItems: 'center', gap: espacio.base },
  titulos: { flex: 1, gap: espacio.xs },
  bajada: { marginTop: espacio.xl, marginBottom: espacio.m },
  promo: { gap: espacio.m, marginVertical: espacio.grande },
  filaChips: { flexDirection: 'row', alignItems: 'center', gap: espacio.m },
  lista: { gap: espacio.l, marginTop: espacio.base },
  producto: { flexDirection: 'row', alignItems: 'center', gap: espacio.xl },
  textosProducto: { flex: 1, gap: espacio.xs },
});
