import { useEffect, useState } from 'react';

import { useSesion } from '@/estado/sesion';
import type { Novedad } from '@/models/novedad';
import { apiConfigurada } from '@/services/api';
import { leerNovedadesServidor } from '@/services/datosServidor';

import { novedadesDePrueba } from '../../data/mock/novedades';

// Novedades del panel "Pulso de Olegario": con servidor, las que carga el equipo (Etapa 14: antes se
// mostraban las de prueba de Figma aunque hubiera servidor); sin servidor, las de prueba.
export function useNovedades(): Novedad[] {
  const { tipoAcceso } = useSesion();
  const [delServidor, setDelServidor] = useState<Novedad[]>([]);

  useEffect(() => {
    if (!apiConfigurada || !tipoAcceso) return;
    let activo = true;
    leerNovedadesServidor().then((leidas) => {
      if (activo && leidas) setDelServidor(leidas);
    });
    return () => {
      activo = false;
    };
  }, [tipoAcceso]);

  return apiConfigurada ? delServidor : novedadesDePrueba;
}
