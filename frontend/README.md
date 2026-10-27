# Frontend — Impresos Trujillo

Angular 21 (componentes standalone y signals). Pruebas con Vitest.

```bash
npm start                      # servidor de desarrollo
npx ng test --watch=false      # pruebas
npx ng build                   # compilación (falla ante errores de tipo)
```

## Estilos: reglas de la casa

1. **Nada de `style="..."` en las plantillas.** El único estilo en línea admitido es
   un valor calculado en tiempo de ejecución (`[style.width.%]`). Todo lo demás va
   a una clase en `src/app/shared/estilos/componentes.css`.
2. **Los colores salen de los tokens** (`var(--success)`, `var(--danger)`,
   `var(--text-muted)`...), definidos en `src/styles.css` para el tema claro y el
   oscuro. Un color escrito a mano (`#16a34a`, `#ef4444`) no sigue al tema oscuro.
   Excepción: el contrato imprimible, que usa colores de papel a propósito.
3. **Toda clase que usa una plantilla debe existir en una hoja de estilos.** Una clase
   sin CSS se ve sin estilo y nadie lo nota hasta mirarla con lupa.
4. Si un estado cambia el color (nivel crítico, monto negativo), se usa una clase
   (`[class.nivel-critico]`), no `[style.color]`.

Para comprobarlo:

```bash
grep -ro 'style="' src/app --include=*.html | wc -l    # debe dar 0
```

## Textos y porcentajes del negocio

Los porcentajes (IGV, adelanto mínimo), los catálogos (métodos de pago, canales de
ingreso, acciones de auditoría...) y los datos de la empresa los publica el servidor
en `GET /api/configuracion`. Se leen desde `src/app/core/estado/catalogos.ts`; no se
escriben a mano en las pantallas.
