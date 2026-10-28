import * as ImagePicker from 'expo-image-picker';

export type ResultadoFoto =
  { estado: 'elegida'; foto: string } | { estado: 'cancelada' } | { estado: 'sinPermiso' };

const OPCIONES: ImagePicker.ImagePickerOptions = {
  mediaTypes: ['images'],
  allowsEditing: true,
  aspect: [1, 1],
  quality: 0.4,
  base64: true,
};

// Pide el permiso solo en el momento de uso (regla de privacidad del proyecto) y devuelve la foto
// como imagen comprimida, para que no dependa de archivos temporales del sistema.
export async function elegirFotoPerfil(origen: 'galeria' | 'camara'): Promise<ResultadoFoto> {
  const permiso =
    origen === 'camara'
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permiso.granted) return { estado: 'sinPermiso' };

  const resultado =
    origen === 'camara'
      ? await ImagePicker.launchCameraAsync(OPCIONES)
      : await ImagePicker.launchImageLibraryAsync(OPCIONES);
  const imagen = resultado.canceled ? undefined : resultado.assets[0];
  if (!imagen) return { estado: 'cancelada' };

  const tipo = imagen.mimeType ?? 'image/jpeg';
  return {
    estado: 'elegida',
    foto: imagen.base64 ? `data:${tipo};base64,${imagen.base64}` : imagen.uri,
  };
}
