// Las pruebas nunca usan un servidor real: sin esta variable, la app usa los datos de prueba
// (aunque el entorno la tenga cargada). Las pruebas de la API simulan fetch (tests/api.test.tsx).
delete process.env.EXPO_PUBLIC_API_URL;

// Almacenamiento local simulado en memoria para las pruebas.
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);
