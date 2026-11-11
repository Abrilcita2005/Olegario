import { useCallback, useEffect, useState } from 'react';

import { useAhora } from '@/hooks/useAhora';
import { guardarOpiniones, leerOpiniones, type MensajeEquipo } from '@/services/almacenamiento';
import { apiConfigurada } from '@/services/api';
import {
  enviarMensajeServidor,
  leerBeneficiosServidor,
  leerMembresiaServidor,
  leerOpinionesServidor,
  leerPaquetesServidor,
  valorarEspacioServidor,
  type BeneficioApi,
  type MembresiaApi,
  type PaqueteApi,
} from '@/services/datosServidor';

import { beneficiosDePrueba, membresiaDePrueba, paquetesDePrueba } from '../../data/mock/membresia';

// Servicios del Perfil de cuenta (Etapa 13). Con la API configurada: membresía, paquetes, beneficios,
// valoraciones y mensajes al equipo vienen del servidor o se guardan ahí. Sin servidor: datos de prueba
// y opiniones guardadas en el teléfono (Etapa 11). Los pagos siguen SIMULADOS: la tarjeta y la factura
// son siempre datos de prueba (decisión de la responsable, 2026-11-04).

// Lee algo del servidor una vez al abrir la pantalla; mientras tanto (o si falla) queda `inicial`.
function useLecturaServidor<T>(leer: () => Promise<T | null>, inicial: T): T {
  const [valor, setValor] = useState<T>(inicial);
  useEffect(() => {
    if (!apiConfigurada) return;
    let activo = true;
    leer().then((leido) => {
      if (activo && leido !== null) setValor(leido);
    });
    return () => {
      activo = false;
    };
  }, [leer]);
  return valor;
}

function fechaLocal(texto: string): Date {
  const [anio, mes, dia] = texto.split('-').map(Number);
  return new Date(anio, mes - 1, dia);
}

export function useMembresia() {
  const prueba = membresiaDePrueba(useAhora());
  const servidor = useLecturaServidor<MembresiaApi | null>(leerMembresiaServidor, null);
  if (!servidor) return prueba;
  return {
    ...prueba,
    plan: servidor.plan,
    acceso: servidor.acceso,
    vence: servidor.vence ? fechaLocal(servidor.vence) : prueba.vence,
    renovacionAutomatica: servidor.renovacionAutomatica,
  };
}

export function usePaquetes(): PaqueteApi[] {
  return useLecturaServidor(leerPaquetesServidor, apiConfigurada ? [] : paquetesDePrueba);
}

export function useBeneficios(): BeneficioApi[] {
  return useLecturaServidor(leerBeneficiosServidor, apiConfigurada ? [] : beneficiosDePrueba);
}

// Valoraciones y mensajes al equipo. Las funciones devuelven false si no se pudo guardar.
export function useOpiniones() {
  const [cantidad, setCantidad] = useState({ valoraciones: 0, mensajes: 0 });

  useEffect(() => {
    let activo = true;
    const leer = apiConfigurada
      ? leerOpinionesServidor()
      : leerOpiniones().then((o) => ({
          valoraciones: o.valoraciones.length,
          mensajes: o.mensajes.length,
        }));
    leer
      .then((leida) => {
        if (activo && leida) setCantidad(leida);
      })
      .catch(() => {});
    return () => {
      activo = false;
    };
  }, []);

  const valorar = useCallback(async (espacioId: string, estrellas: number, comentario: string) => {
    if (apiConfigurada) {
      if (!(await valorarEspacioServidor(espacioId, estrellas, comentario))) return false;
    } else {
      const actuales = await leerOpiniones();
      await guardarOpiniones({
        ...actuales,
        valoraciones: [
          ...actuales.valoraciones,
          {
            id: `valoracion-${Date.now()}`,
            espacioId,
            estrellas,
            comentario,
            fecha: new Date().toISOString(),
          },
        ],
      });
    }
    setCantidad((c) => ({ ...c, valoraciones: c.valoraciones + 1 }));
    return true;
  }, []);

  const enviarMensaje = useCallback(async (tipo: MensajeEquipo['tipo'], texto: string) => {
    if (apiConfigurada) {
      if (!(await enviarMensajeServidor(tipo, texto))) return false;
    } else {
      const actuales = await leerOpiniones();
      await guardarOpiniones({
        ...actuales,
        mensajes: [
          ...actuales.mensajes,
          { id: `mensaje-${Date.now()}`, tipo, texto, fecha: new Date().toISOString() },
        ],
      });
    }
    setCantidad((c) => ({ ...c, mensajes: c.mensajes + 1 }));
    return true;
  }, []);

  return { cantidad, valorar, enviarMensaje };
}
