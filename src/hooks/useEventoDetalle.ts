import { useEffect, useState } from 'react';

import type { EventoDetalle } from '@/models/agenda';
import { apiConfigurada } from '@/services/api';
import { leerEventoServidor } from '@/services/datosServidor';
import { inicioDelDia } from '@/utils/fechas';

import { coworkeoItineranteDePrueba, eventosDePrueba } from '../../data/mock/agenda';

// Detalle de un evento para su pantalla: con servidor, del servidor; sin servidor, de los datos de prueba.
// undefined = cargando · null = no existe (o no se pudo leer).
export function useEventoDetalle(id: string): EventoDetalle | null | undefined {
  const [delServidor, setDelServidor] = useState<EventoDetalle | null | undefined>(undefined);

  useEffect(() => {
    if (!apiConfigurada) return;
    let activo = true;
    leerEventoServidor(id).then((leido) => {
      if (activo) setDelServidor(leido);
    });
    return () => {
      activo = false;
    };
  }, [id]);

  if (apiConfigurada) return delServidor;
  const hoy = inicioDelDia(new Date());
  if (id === 'coworkeo-itinerante') return coworkeoItineranteDePrueba(hoy);
  const evento = eventosDePrueba(hoy).find((e) => e.id === id);
  if (!evento) return null;
  return {
    id: evento.id,
    etiqueta: evento.submarca === 'afterOffice' ? 'OLE / After office' : 'OLE / Evento',
    titulo: evento.titulo,
    detalle: evento.detalle,
    descripcion: evento.descripcion,
    inicio: evento.inicio,
    foto: evento.foto,
    inscriptos: evento.inscriptos,
  };
}
