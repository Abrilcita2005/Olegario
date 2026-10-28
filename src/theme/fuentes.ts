// Cada peso se importa desde su propia ruta para que la app incluya solo los archivos que usa.
import { Inter_400Regular } from '@expo-google-fonts/inter/400Regular';
import { Inter_500Medium } from '@expo-google-fonts/inter/500Medium';
import { Inter_600SemiBold } from '@expo-google-fonts/inter/600SemiBold';
import { Inter_700Bold } from '@expo-google-fonts/inter/700Bold';
import { Inter_800ExtraBold } from '@expo-google-fonts/inter/800ExtraBold';
import { Inter_900Black } from '@expo-google-fonts/inter/900Black';

// Nombres con los que se registran las fuentes. Los componentes usan siempre estas constantes.
export const familias = {
  vastagoMedium: 'Vastago-Medium',
  vastagoSemiBold: 'Vastago-SemiBold',
  vastagoBold: 'Vastago-Bold',
  vastagoHeavy: 'Vastago-Heavy',
  vastagoBlack: 'Vastago-Black',
  interRegular: 'Inter-Regular',
  interMedium: 'Inter-Medium',
  interSemiBold: 'Inter-SemiBold',
  interBold: 'Inter-Bold',
  interExtraBold: 'Inter-ExtraBold',
  interBlack: 'Inter-Black',
} as const;

// Vástago Grotesk (títulos): archivos en assets/fuentes/ (ver docs/DISENO.md §C.3 sobre su licencia).
// Inter (texto continuo): Google Fonts, licencia SIL Open Font License.
export const archivosDeFuentes = {
  [familias.vastagoMedium]: require('../../assets/fuentes/VastagoGrotesk-Medium.otf'),
  [familias.vastagoSemiBold]: require('../../assets/fuentes/VastagoGrotesk-SemiBold.otf'),
  [familias.vastagoBold]: require('../../assets/fuentes/VastagoGrotesk-Bold.otf'),
  [familias.vastagoHeavy]: require('../../assets/fuentes/VastagoGrotesk-Heavy.otf'),
  [familias.vastagoBlack]: require('../../assets/fuentes/VastagoGrotesk-Black.otf'),
  [familias.interRegular]: Inter_400Regular,
  [familias.interMedium]: Inter_500Medium,
  [familias.interSemiBold]: Inter_600SemiBold,
  [familias.interBold]: Inter_700Bold,
  [familias.interExtraBold]: Inter_800ExtraBold,
  [familias.interBlack]: Inter_900Black,
};
