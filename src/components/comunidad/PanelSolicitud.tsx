import { useState } from 'react';
import { StyleSheet, TextInput } from 'react-native';

import { Boton, PanelInferior, Texto } from '@/components/ui';
import { colores, espacio, radios, tipografia } from '@/theme';

type Props = {
  titulo: string;
  destinatario: string;
  // Devuelve false si no se pudo enviar: el panel queda abierto con un aviso.
  onEnviar: (mensaje: string) => Promise<boolean>;
  onCerrar: () => void;
};

const LARGO_MAXIMO = 300;

// Panel para escribir un mensaje corto y enviar la solicitud. PROVISIONAL (Etapa 10, decisión de la
// responsable): no hay servidor ni chat; la solicitud queda guardada en el teléfono.
export function PanelSolicitud({ titulo, destinatario, onEnviar, onCerrar }: Props) {
  const [mensaje, setMensaje] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [fallo, setFallo] = useState(false);

  return (
    <PanelInferior visible titulo={titulo} onCerrar={onCerrar}>
      <Texto variante="cuerpoChico" color="textoSecundario">
        Escribile a {destinatario} un mensaje corto (opcional).
      </Texto>
      <TextInput
        value={mensaje}
        onChangeText={setMensaje}
        multiline
        maxLength={LARGO_MAXIMO}
        placeholder="Hola, me interesa porque…"
        placeholderTextColor={colores.textoTerciario}
        accessibilityLabel="Mensaje"
        style={styles.mensaje}
      />
      <Boton
        texto="Enviar solicitud"
        cargando={enviando}
        onPress={async () => {
          setEnviando(true);
          const enviada = await onEnviar(mensaje.trim());
          setEnviando(false);
          if (enviada) onCerrar();
          else setFallo(true);
        }}
      />
      {fallo ? (
        <Texto variante="cuerpoChico" color="error" accessibilityRole="alert">
          No pudimos enviar la solicitud. Revisá tu conexión y probá de nuevo.
        </Texto>
      ) : null}
      <Boton texto="Cancelar" variante="secundario" onPress={onCerrar} />
    </PanelInferior>
  );
}

const styles = StyleSheet.create({
  mensaje: {
    ...tipografia.input,
    minHeight: 96,
    padding: espacio.l,
    textAlignVertical: 'top',
    color: colores.textoSobreOscuro,
    borderRadius: radios.lg,
    backgroundColor: colores.superficieElevada,
  },
});
