import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { PieHospitalidad } from '@/components/acceso/PieHospitalidad';
import { PantallaSecundaria } from '@/components/navegacion/PantallaSecundaria';
import {
  Boton,
  CampoFormulario,
  Casilla,
  EnlaceTexto,
  IndicadorFortaleza,
  Texto,
} from '@/components/ui';
import { useSesion } from '@/estado/sesion';
import { espacio } from '@/theme';
import { calcularFortaleza } from '@/utils/fortalezaContrasena';
import { validarRegistro, type ErroresRegistro } from '@/utils/validaciones';

// Registro (Figma: INICIO 2). PROVISIONAL: sin servidor, la cuenta se simula en el teléfono
// (se guarda nombre, correo y profesión; la contraseña no se guarda). Cuenta real: Etapa 13.
export default function RegistroScreen() {
  const { registrarse } = useSesion();
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [profesion, setProfesion] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [errores, setErrores] = useState<ErroresRegistro>({});
  const [enviando, setEnviando] = useState(false);
  const [avisoServidor, setAvisoServidor] = useState<string | null>(null);

  async function crearCuenta() {
    const nuevosErrores = validarRegistro({
      nombre,
      correo,
      profesion,
      contrasena,
      aceptaTerminos,
    });
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;
    setEnviando(true);
    const resultado = await registrarse(
      { nombre: nombre.trim(), correo: correo.trim(), profesion: profesion.trim() },
      contrasena,
    );
    setEnviando(false);
    if (!resultado.ok) setAvisoServidor(resultado.error);
    else if (resultado.requiereConfirmacion)
      setAvisoServidor(
        'Te mandamos un correo para confirmar tu cuenta. Confirmalo y después ingresá.',
      );
  }

  return (
    <PantallaSecundaria>
      <Texto variante="tituloAcceso" accessibilityRole="header">
        Creá tu cuenta
      </Texto>
      <View style={styles.formulario}>
        <CampoFormulario
          etiqueta="Nombre completo"
          placeholder="ej. Sofía Valenzuela"
          value={nombre}
          onChangeText={setNombre}
          autoComplete="name"
          textContentType="name"
          error={errores.nombre}
        />
        <CampoFormulario
          etiqueta="Correo profesional"
          placeholder="sofia@estudio.design"
          value={correo}
          onChangeText={setCorreo}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          textContentType="emailAddress"
          error={errores.correo}
        />
        <CampoFormulario
          etiqueta="Profesión / Área de trabajo"
          placeholder="ej. Diseñadora UI/UX, Dev, Gestor PM..."
          value={profesion}
          onChangeText={setProfesion}
          error={errores.profesion}
        />
        <CampoFormulario
          etiqueta="Contraseña"
          placeholder="Mínimo 8 caracteres"
          esContrasena
          value={contrasena}
          onChangeText={setContrasena}
          autoComplete="new-password"
          textContentType="newPassword"
          error={errores.contrasena}
          debajo={<IndicadorFortaleza nivel={calcularFortaleza(contrasena)} />}
        />
        <Casilla
          marcada={aceptaTerminos}
          onCambiar={setAceptaTerminos}
          texto="Acepto los términos de convivencia y manifiesto de la comunidad Olegario."
          aclaracion="Cuidamos el silencio productivo, la hospitalidad y la cultura de colaboración abierta."
        />
        <View style={styles.enlaceTerminos}>
          <EnlaceTexto
            texto="Leer los términos de convivencia"
            variante="enlaceChico"
            onPress={() => router.push('/terminos')}
            subrayado
          />
        </View>
        {errores.aceptaTerminos ? (
          <Texto variante="meta" color="error" accessibilityLiveRegion="polite">
            {errores.aceptaTerminos}
          </Texto>
        ) : null}
        {avisoServidor ? (
          <Texto variante="cuerpoChico" color="error" accessibilityRole="alert">
            {avisoServidor}
          </Texto>
        ) : null}
        <Boton
          texto="Crear cuenta y continuar"
          onPress={crearCuenta}
          cargando={enviando}
          style={styles.boton}
        />
      </View>
      <View style={styles.yaTenes}>
        <Texto variante="citaAcceso">¿Ya tenés cuenta?</Texto>
        <EnlaceTexto
          texto="Iniciar sesión"
          onPress={() => router.replace('/iniciar-sesion')}
          subrayado
        />
      </View>
      <PieHospitalidad />
    </PantallaSecundaria>
  );
}

const styles = StyleSheet.create({
  formulario: { gap: espacio.m, marginTop: espacio.base },
  enlaceTerminos: { alignItems: 'flex-start', paddingLeft: espacio.xs },
  boton: { marginTop: espacio.m },
  yaTenes: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: espacio.xs,
    marginTop: espacio.base,
  },
});
