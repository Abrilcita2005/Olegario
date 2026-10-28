// Formato de precios en pesos argentinos sin decimales: 3800 → "$ 3.800".
export function formatearPrecio(valor: number): string {
  const conMiles = Math.round(valor)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `$ ${conMiles}`;
}
