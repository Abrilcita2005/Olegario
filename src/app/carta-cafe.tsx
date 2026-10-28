import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { IconoSubmarca } from '@/components/marca/IconoSubmarca';
import { PantallaSecundaria } from '@/components/navegacion/PantallaSecundaria';
import { IlustracionProducto } from '@/components/ilustraciones/IlustracionProducto';
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
        <IlustracionProducto ilustracion="promoFlatWhiteCookie" tamano={72} />
        <View style={styles.textosPromo}>
          <View style={styles.filaChips}>
            <Chip texto="20% OFF" variante="descuento" />
            <Texto variante="categoria" color="textoSobreOscuro">
              Promo cafetería
            </Texto>
          </View>
          <Texto variante="cuerpoChico" color="textoSecundario">
            Flat White de especialidad + Cookie casera de avena
          </Texto>
        </View>
      </Tarjeta>

      <SelectorSegmentado
        opciones={FILTROS}
        seleccionado={filtro}
        onCambiar={setFiltro}
        etiquetaAccesible="Filtrar la carta"
      />

      <View style={styles.lista}>
        {productos.map((producto) => (
          <View key={producto.id} style={styles.producto}>
            <View style={styles.cuerpoProducto}>
              <IlustracionProducto ilustracion={producto.ilustracion} />
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
            </View>
            {/* El precio va en un recuadro del color del fondo que continúa la forma de la tarjeta. */}
            <View style={styles.precio}>
              <Texto
                variante="tituloTarjeta"
                accessibilityLabel={`Precio ${formatearPrecio(producto.precioDeEjemplo)}`}
              >
                {formatearPrecio(producto.precioDeEjemplo)}
              </Texto>
            </View>
          </View>
        ))}
      </View>
    </PantallaSecundaria>
  );
}

const styles = StyleSheet.create({
  cabecera: { flexDirection: 'row', alignItems: 'center', gap: espacio.base },
  titulos: { flex: 1, gap: espacio.xs },
  bajada: { marginTop: espacio.xl, marginBottom: espacio.m },
  promo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacio.base,
    marginVertical: espacio.grande,
  },
  textosPromo: { flex: 1, gap: espacio.m },
  filaChips: { flexDirection: 'row', alignItems: 'center', gap: espacio.m },
  lista: { gap: espacio.l, marginTop: espacio.base },
  producto: { flexDirection: 'row' },
  cuerpoProducto: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacio.xl,
    padding: espacio.base,
    borderTopLeftRadius: radios.xxl,
    borderBottomLeftRadius: radios.xxl,
    backgroundColor: colores.superficie,
  },
  precio: {
    width: 92,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderLeftWidth: 0,
    borderColor: colores.superficie,
    borderTopRightRadius: radios.xxl,
    borderBottomRightRadius: radios.xxl,
    backgroundColor: colores.fondo,
  },
  etiquetas: { flexDirection: 'row', flexWrap: 'wrap', gap: espacio.s, marginTop: espacio.xs },
  textosProducto: { flex: 1, gap: espacio.xs },
});
