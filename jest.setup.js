// Las pruebas nunca usan un servidor real: sin estas variables, la app usa los datos de prueba.
// (El entorno de la nube todavía puede tener cargadas variables de Supabase.)
delete process.env.EXPO_PUBLIC_SUPABASE_URL;
delete process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
delete process.env.EXPO_PUBLIC_API_URL;

// Almacenamiento local simulado en memoria para las pruebas.
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);
