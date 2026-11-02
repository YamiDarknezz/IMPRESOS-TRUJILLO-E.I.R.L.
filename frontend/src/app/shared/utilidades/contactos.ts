/** Reconoce solo celulares peruanos completos; no interpreta usuarios ni nombres. */
export function celularPeruano(valor: string): string | null {
  const texto = valor.trim();
  if (!/^[+\d\s().-]+$/.test(texto)) return null;
  let digitos = texto.replace(/\D/g, '');
  if (digitos.length === 11 && digitos.startsWith('519')) digitos = digitos.slice(2);
  return /^9\d{8}$/.test(digitos) ? `+51${digitos}` : null;
}
