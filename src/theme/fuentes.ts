// Cada peso se importa desde su propia ruta para que la app incluya solo los archivos que usa.
import { Poppins_700Bold } from '@expo-google-fonts/poppins/700Bold';
import { Poppins_800ExtraBold } from '@expo-google-fonts/poppins/800ExtraBold';
import { Poppins_900Black } from '@expo-google-fonts/poppins/900Black';
import { Poppins_900Black_Italic } from '@expo-google-fonts/poppins/900Black_Italic';
import { Inter_400Regular } from '@expo-google-fonts/inter/400Regular';
import { Inter_500Medium } from '@expo-google-fonts/inter/500Medium';
import { Inter_600SemiBold } from '@expo-google-fonts/inter/600SemiBold';
import { Inter_700Bold } from '@expo-google-fonts/inter/700Bold';
import { Inter_800ExtraBold } from '@expo-google-fonts/inter/800ExtraBold';
import { Inter_900Black } from '@expo-google-fonts/inter/900Black';

// Nombres con los que se registran las fuentes. Los componentes usan siempre estas constantes.
export const familias = {
  poppinsBold: 'Poppins-Bold',
  poppinsExtraBold: 'Poppins-ExtraBold',
  poppinsBlack: 'Poppins-Black',
  poppinsBlackItalic: 'Poppins-BlackItalic',
  interRegular: 'Inter-Regular',
  interMedium: 'Inter-Medium',
  interSemiBold: 'Inter-SemiBold',
  interBold: 'Inter-Bold',
  interExtraBold: 'Inter-ExtraBold',
  interBlack: 'Inter-Black',
} as const;

// Poppins (títulos y destacados, como en Figma) e Inter (texto continuo): Google Fonts, licencia SIL Open Font License.
export const archivosDeFuentes = {
  [familias.poppinsBold]: Poppins_700Bold,
  [familias.poppinsExtraBold]: Poppins_800ExtraBold,
  [familias.poppinsBlack]: Poppins_900Black,
  [familias.poppinsBlackItalic]: Poppins_900Black_Italic,
  [familias.interRegular]: Inter_400Regular,
  [familias.interMedium]: Inter_500Medium,
  [familias.interSemiBold]: Inter_600SemiBold,
  [familias.interBold]: Inter_700Bold,
  [familias.interExtraBold]: Inter_800ExtraBold,
  [familias.interBlack]: Inter_900Black,
};
