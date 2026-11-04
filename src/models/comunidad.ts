import type { ImageSourcePropType } from 'react-native';

export type Persona = {
  id: string;
  nombre: string;
  // Vacía si no se conoce (no se inventa).
  profesion: string;
  foto?: ImageSourcePropType;
  // Foto grande del perfil público (Figma: PERFIL PÚBLICO, "HeroCover").
  portada?: ImageSourcePropType;
  // Dónde está ahora en Olegario (solo si la persona está en "Conexión Abierta").
  ubicacion?: string;
  sobreMi?: string;
  ofrezco?: string;
  busco?: string;
  disponible?: boolean;
};

export type TipoPublicacion = 'colaborador' | 'iniciativa';

export type Publicacion = {
  id: string;
  tipo: TipoPublicacion;
  // "Diseñador/a UI/UX" (solo si busca colaborador).
  busca?: string;
  titulo: string;
  descripcion: string;
  etiquetas: string[];
  // Personas autoras (perfil público) o un texto (p. ej. "Comunidad Olegario").
  autores: { personaId?: string; nombre: string }[];
  rolAutor?: string;
  lugar?: string;
  actividad: string;
  accion: string;
  conDetalle?: boolean;
  esPropia?: boolean;
  esDatoDePrueba?: boolean;
};

export type Taller = {
  id: string;
  tipo: string;
  cuando: string;
  titulo: string;
  descripcion: string;
  accion: string;
  esDatoDePrueba?: boolean;
};

export type ModoComunidad = 'abierta' | 'foco';
