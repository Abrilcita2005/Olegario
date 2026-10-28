import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { IconoSubmarca } from '@/components/marca/IconoSubmarca';
import { PantallaSecundaria } from '@/components/navegacion/PantallaSecundaria';
import { Chip, SelectorSegmentado, Tarjeta, Texto } from '@/components/ui';
import { colores, espacio, radios } from '@/theme';
import { formatearPrecio } from '@/utils/formatos';

import {
  productosDePrueba,
  type CategoriaCarta,
  type EtiquetaProducto,
} from '../../data/mock/cartaCafe';

// Carta del café (OLE/CAFÉ). DISEÑO PROVISIONAL propuesto por el equipo (no está en Figma, P-38),
// armado con el sistema de diseño. Productos y precios: datos de ejemplo (marcados en data/mock;
// la responsable pidió no mostrar el aviso en pantalla). Reemplazar antes de publicar (P-38).
const FILTROS = [
  { valor: 'todo', etiqueta: 'Todo' },
  { valor: 'cafes', etiqueta: 'Cafés' },
  { valor: 'frios', etiqueta: 'Fríos' },
  { valor: 'pasteleria', etiqueta: 'Pastelería' },
] as const;

type Filtro = 'todo' | CategoriaCarta;

const NOMBRE_ETIQUETA: Record<EtiquetaProducto, string> = {
  vegano: 'Vegano',
  sinTacc: 'Sin TACC',
  sinLactosa: 'Sin lactosa',
};

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
            {/* Espacio reservado para la foto del producto (todavía no hay fotos reales, P-40). */}
            <View style={styles.foto} accessibilityElementsHidden importantForAccessibility="no">
              <IconoSubmarca submarca="cafe" tamano={40} conAro={false} />
            </View>
            <View style={styles.textosProducto}>
              <Texto variante="tituloTarjeta" color="textoSobreOscuro">
                {producto.nombre}
              </Texto>
              <Texto variante="cuerpoChico" color="textoSecundario">
                {producto.descripcion}
              </Texto>
              {producto.etiquetas.length > 0 ? (
                <View style={styles.etiquetas}>
                  {producto.etiquetas.map((etiqueta) => (
                    <Chip key={etiqueta} texto={NOMBRE_ETIQUETA[etiqueta]} variante="etiqueta" />
                  ))}
                </View>
              ) : null}
            </View>
            <Texto
              variante="tituloTarjeta"
              color="acentoLima"
              accessibilityLabel={`Precio ${formatearPrecio(producto.precioDeEjemplo)}`}
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
  foto: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radios.lg,
    backgroundColor: colores.superficieElevada,
  },
  etiquetas: { flexDirection: 'row', flexWrap: 'wrap', gap: espacio.s, marginTop: espacio.xs },
  textosProducto: { flex: 1, gap: espacio.xs },
});
