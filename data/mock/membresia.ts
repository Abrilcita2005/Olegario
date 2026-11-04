// DATOS DE PRUEBA (no reales) de la membresía, tomados de Figma (pantalla PERFIL), hasta el servidor
// (Etapa 13). El vencimiento se calcula como el último día del mes en curso para que la suscripción
// figure "al día" (en Figma dice "31 de Mayo, 2025", una fecha ya pasada).

export function membresiaDePrueba(hoy: Date = new Date()) {
  return {
    plan: 'Plan Pro Creativo',
    acceso: 'Acceso 24/7 · Puesto Nómade',
    vence: new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0),
    renovacionAutomatica: true,
    factura: '#OLE-9821',
    // Solo la marca y los últimos 4 dígitos: nunca se guarda un número de tarjeta completo.
    tarjeta: { marca: 'Visa', ultimos: '4092' },
    esDatoDePrueba: true as const,
  };
}

// Paquetes en recepción (Figma: "Recepción de Paquetes · Listo para retirar en recepción principal").
export const paquetesDePrueba = [
  {
    id: 'paquete-1',
    descripcion: 'Paquete a tu nombre',
    estado: 'Listo para retirar en recepción principal',
  },
];

// Beneficios: la promo de la carta del café (Figma: OLE/CAFÉ).
export const beneficiosDePrueba = [
  {
    id: 'promo-cafeteria',
    titulo: '20% OFF en la cafetería',
    detalle: 'Flat White de especialidad + Cookie casera de chocolate',
    lugar: 'OLE/CAFÉ',
  },
];

// Paquetes de horas extras de la SIMULACIÓN (sin precios: no hay pagos reales, P-03).
export const paquetesDeHorasDePrueba = [5, 10, 20];
