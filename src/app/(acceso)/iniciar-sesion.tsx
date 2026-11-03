import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { PieHospitalidad } from '@/components/acceso/PieHospitalidad';
import { PantallaSecundaria } from '@/components/navegacion/PantallaSecundaria';
import {
  Boton,
  CampoFormulario,
  EnlaceTexto,
  SelectorSegmentado,
  Tarjeta,
  Texto,
} from '@/components/ui';
import { useSesion } from '@/estado/sesion';
import { espacio, sombras } from '@/theme';
import { validarContrasenaIngreso, validarUsuarioOCorreo } from '@/utils/validaciones';

const ROLES = [
  { valor: 'miembro', etiqueta: 'Miembro coworker' },
  { valor: 'invitado', etiqueta: 'Invitado / evento' },
] as const;

// Inicio de sesión (Figma: INICIO 3), sin Google, Apple ni Face ID (decisión 2026-11-03).
// PROVISIONAL: sin servidor, cualquier dato con formato válido entra (no se verifica la contraseña).
export default function IniciarSesionScreen() {
  const { ingresar } = useSesion();
  const [rol, setRol] = useState<(typeof ROLES)[number]['valor']>('miembro');
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [errores, setErrores] = useState<{ usuario?: string; contrasena?: string }>({});
  const [enviando, setEnviando] = useState(false);

  async function entrar() {
    const nuevos = {
      usuario: validarUsuarioOCorreo(usuario) ?? undefined,
      contrasena: validarContrasenaIngreso(contrasena) ?? undefined,
    };
    setErrores(nuevos);
    if (nuevos.usuario || nuevos.contrasena) return;
    setEnviando(true);
    await ingresar(rol);
  }

  return (
    <PantallaSecundaria>
      <View style={styles.titulos}>
        <Texto variante="tituloReencuentro" accessibilityRole="header">
          ¡Qué bueno verte de nuevo!
        </Texto>
        <Texto variante="citaAcceso">
          Ingresá a tu espacio, sincronizá tu jornada y conectá con tu comunidad creativa.
        </Texto>
      </View>
      <SelectorSegmentado
        opciones={ROLES}
        seleccionado={rol}
        onCambiar={setRol}
        etiquetaAccesible="Tipo de acceso"
      />
      <Tarjeta style={styles.tarjeta}>
        <CampoFormulario
          etiqueta="Email o usuario"
          placeholder="ejemplo: sofi@olegario.work"
          value={usuario}
          onChangeText={setUsuario}
          autoCapitalize="none"
          autoComplete="username"
          textContentType="username"
          error={errores.usuario}
        />
        <CampoFormulario
          etiqueta="Contraseña"
          placeholder="••••••••••••"
          esContrasena
          value={contrasena}
          onChangeText={setContrasena}
          autoComplete="current-password"
          textContentType="password"
          error={errores.contrasena}
        />
        <View style={styles.olvido}>
          <EnlaceTexto
            texto="¿Olvidaste tu contraseña?"
            variante="enlaceChico"
            color="textoSobreOscuro"
            onPress={() => router.push('/recuperar-contrasena')}
          />
        </View>
        <Boton texto="Iniciar sesión" onPress={entrar} cargando={enviando} />
      </Tarjeta>
      <View style={styles.registrate}>
        <Texto variante="citaAcceso">¿Todavía no sos miembro?</Texto>
        <EnlaceTexto
          texto="Registrate y sumate a Olegario"
          onPress={() => router.replace('/registro')}
        />
      </View>
      <PieHospitalidad />
    </PantallaSecundaria>
  );
}

const styles = StyleSheet.create({
  titulos: { gap: espacio.xs, marginBottom: espacio.grande },
  tarjeta: { gap: espacio.base, marginTop: espacio.m, padding: espacio.m, ...sombras.tarjeta },
  olvido: { alignItems: 'flex-end' },
  registrate: { alignItems: 'center', marginTop: espacio.grande },
});
