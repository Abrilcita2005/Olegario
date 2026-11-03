// Saludo según la hora (Figma: "¡Buen día, Sofi!"). Se usa el primer nombre si lo hay.
export function saludoSegunHora(hora: number): string {
  if (hora >= 5 && hora < 12) return 'Buen día';
  if (hora >= 12 && hora < 20) return 'Buenas tardes';
  return 'Buenas noches';
}

export function primerNombre(nombreCompleto: string | null | undefined): string | null {
  const primero = nombreCompleto?.trim().split(/\s+/)[0];
  return primero ? primero : null;
}

export function textoSaludo(ahora: Date, nombreCompleto?: string | null): string {
  const nombre = primerNombre(nombreCompleto);
  const saludo = saludoSegunHora(ahora.getHours());
  return nombre ? `¡${saludo}, ${nombre}!` : `¡${saludo}!`;
}
