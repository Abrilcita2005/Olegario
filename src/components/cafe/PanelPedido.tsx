import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Boton, PanelInferior, Texto } from '@/components/ui';
import { espacio } from '@/theme';

type Props = {
  // Lo que se pidió (producto o promo); null = panel cerrado.
  pedido: string | null;
  onCerrar: () => void;
};

type Entrega = 'mesa' | 'barra';

// Pedido de la carta de OLE/CAFÉ (pedido de la responsable, Etapa 14): al elegir un producto o la promo,
// el barista recibe el pedido, la persona elige si se lo llevan a la mesa o lo retira en la barra, y se
// confirma que estará listo en 10 minutos. SIMULADO por ahora (decisión del 2026-11-11): todavía no le
// llega a nadie; se conecta al servidor más adelante.
export function PanelPedido({ pedido, onCerrar }: Props) {
  const [entrega, setEntrega] = useState<Entrega | null>(null);

  const cerrar = () => {
    setEntrega(null);
    onCerrar();
  };

  return (
    <PanelInferior
      visible={pedido !== null}
      titulo={entrega ? 'Pedido confirmado' : 'Tu pedido'}
      onCerrar={cerrar}
    >
      {entrega === null ? (
        <>
          <View style={styles.bloque} accessibilityLiveRegion="polite">
            <Texto variante="tituloTarjeta" color="acentoLima">
              ¡El barista recibió tu pedido!
            </Texto>
            <Texto variante="cuerpo" color="textoSobreOscuro">
              {pedido}
            </Texto>
            <Texto variante="cuerpoChico" color="textoSecundario">
              ¿Cómo lo querés?
            </Texto>
          </View>
          <Boton texto="Llevar a mi mesa" onPress={() => setEntrega('mesa')} />
          <Boton
            texto="Retiro en la barra"
            variante="contorno"
            onPress={() => setEntrega('barra')}
          />
        </>
      ) : (
        <>
          <View style={styles.bloque} accessibilityLiveRegion="polite">
            <Texto variante="tituloTarjeta" color="acentoLima">
              Tu pedido fue recibido
            </Texto>
            <Texto variante="cuerpo" color="textoSobreOscuro">
              Estará listo en 10 minutos.{' '}
              {entrega === 'mesa'
                ? 'Te lo llevamos a tu mesa.'
                : 'Retiralo en la barra de OLE/CAFÉ.'}
            </Texto>
          </View>
          <Boton texto="Listo" variante="secundario" onPress={cerrar} />
        </>
      )}
      <Texto variante="meta" color="textoTerciario">
        Simulación: el pedido todavía no le llega al equipo de OLE/CAFÉ.
      </Texto>
    </PanelInferior>
  );
}

const styles = StyleSheet.create({
  bloque: { gap: espacio.s },
});
