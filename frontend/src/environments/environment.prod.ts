export const environment = {
  production: true,
  // Cadena vacía = mismo origen.
  //
  // En producción el navegador pide /api/... al mismo dominio donde se sirve
  // la aplicación (imprenta.darknezz.dev) y el nginx del contenedor web
  // reenvía esas peticiones al contenedor de FastAPI. Por eso no se cruza de
  // dominio: no hay CORS, ni peticiones OPTIONS de preflight, ni que abrir el
  // backend a internet.
  apiUrl: '',
};
