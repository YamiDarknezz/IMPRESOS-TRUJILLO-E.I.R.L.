# GUION DE DEMOSTRACIÓN TÉCNICA — SEM07 (BORRADOR PARA REVISIÓN)
## Monitoreo de Avance 1 · SEM07 entregables / Semana 08 académica · 05–10/10/2026

**Proyecto:** Impresos Trujillo E.I.R.L.
**Entorno de la evidencia automatizada:** GitHub Actions sobre el código integrado; job de despliegue omitido.
**Sábado 10/10:** jornada de clase, sin tareas de desarrollo ni horas de trabajo.

## Objetivo

Demostrar cambios del sistema que sí están versionados al corte SEM07: búsqueda y filtros de órdenes, adelantos en varios métodos de pago, Yape por destinatario y consumo automático del rollo asociado a una orden. Este documento es un guion; solo los resultados adjuntos en el registro de ejecución se consideran evidencia de que se hizo una demostración.

## Matriz de verificación técnica

| Caso | Cambio relacionado | Acción propuesta | Evidencia/código de referencia | Resultado en vivo |
|:---|:---|:---|:---|:---|
| DEMO-01 | Filtro de local/pendientes del día (#123) | Elegir local y activar pendientes del día; comparar la lista con órdenes disponibles. | PR #123; registrar captura original durante demo. | Pendiente de registrar |
| DEMO-02 | Búsqueda de teléfono (#122) | Buscar un pedido por su teléfono y abrir sus detalles. | PR #122; usar datos anonimizados. | Pendiente de registrar |
| DEMO-03 | Adelanto en varios métodos (#124) | Registrar/mostrar un adelanto distribuido y verificar importes por método. | PR #124; usar orden de prueba. | Pendiente de registrar |
| DEMO-04 | Yape por destinatario (#125) | Mostrar la selección/desglose de Yape por número/destinatario. | PR #125; usar datos de prueba. | Pendiente de registrar |
| DEMO-05 | Consumo de rollo por orden (#127) | En entorno controlado, revisar el rollo vinculado al crear/editar/cancelar una orden y el saldo resultante. | PR #127; adjuntar log/captura de la versión probada. | Pendiente de registrar |
| DEMO-06 | CI backend/frontend | Consultar el run automatizado del corte. | Run #38028670036, SHA `f812ece`. | 293 backend + 469 frontend; jobs CI exitosos, deploy omitido |

## Procedimiento de la sesión

1. Confirmar el commit/versión de la aplicación que se va a mostrar y si la sesión será local o en producción.
2. Iniciar sesión con un usuario autorizado y datos anonimizados/de prueba.
3. Recorrer DEMO-01 a DEMO-05 en la aplicación; registrar captura auténtica, hora, usuario de prueba y resultado observado.
4. Abrir en GitHub el run #38028670036 y mostrar las conclusiones de los jobs. Distinguir CI/build de despliegue: el job VPS de ese run quedó omitido.
5. Anotar observaciones y pendientes del Product Owner/docente. No escribir “aprobado” sin acta/registro de conformidad firmado.

## Delimitación de SEM07

- No incluir en esta demostración de SEM07 el BI v1 implementado después en `main` (`GET /api/bi/resumen`), ni atribuir al corte histórico Dashboard BI, endpoints `/api/bi/resumen-ventas`, `/api/bi/saldos-cobranza`, `/api/bi/consumo-mermas`, cifras de mermas o inferencias IA sin código/evidencia contemporánea.
- No usar las imágenes compuestas existentes como capturas reales de ejecución. Sustituirlas por capturas originales fechadas si Estibb/Diego conservan la evidencia.
- No presentar las 125 boletas, cifras R²/MAPE, respuesta en milisegundos ni las aprobaciones AAE-03 como verificadas en vivo hasta anexar sus fuentes originales.
- La clase del sábado 10/10 se puede anotar como hito académico; no representa día de trabajo del sprint.

## Registro para completar en la demostración

| Fecha/hora | Commit/entorno | Caso | Resultado observado | Ruta a evidencia original | Responsable |
|:---|:---|:---|:---|:---|:---|
| Pendiente | Pendiente | DEMO-01–05 | Pendiente | Pendiente | Pendiente |
