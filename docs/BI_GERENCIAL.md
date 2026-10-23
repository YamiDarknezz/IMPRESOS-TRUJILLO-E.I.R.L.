# Inteligencia de negocio — decisiones y evolución

## Registro de versiones

| Versión | Fecha | Estado | Decisión |
| --- | --- | --- | --- |
| v1 | 22/10/2026 | Implementada en código; despliegue pendiente | Priorizar ventas, cobranza y seguimiento operativo con los datos realmente capturados. |

Este archivo conserva el motivo de las decisiones del BI. En futuras versiones se agregará una entrada con cambios de fórmulas, nuevas fuentes, límites resueltos y verificación realizada. Las cifras de diagnóstico son una fotografía, no valores fijos del dashboard.

## Por qué se implementa esta primera versión

El Acta y el Business Case plantean análisis gerencial de ventas, productividad y rentabilidad. El RF-14 del SRS solicita ingresos diarios/semanales/mensuales, pedidos liquidados y volumen de producción por operario. Finanzas y Cuentas por cobrar ya ofrecen información operativa, pero faltaba una vista gerencial que permitiera identificar tendencias y priorizar acciones.

Se inspeccionó el despliegue real mediante SSH al alias `oracle` y consultas `BEGIN READ ONLY` sobre PostgreSQL 17, sin alterar datos ni servicios. Corte: 22/10/2026, hora de Perú.

### Hallazgos que determinaron el alcance

| Dato observado | Resultado al corte | Consecuencia de diseño |
| --- | --- | --- |
| Historial | 341 órdenes desde el 05/10/2026; 16 fechas con actividad | Análisis descriptivo; no estacionalidad ni predicciones. |
| Órdenes no canceladas | 333; valor S/ 38,142.10 | Ventas registradas, volumen y ticket son calculables. |
| Saldo vigente | S/ 7,826.00; Imprenta S/ 7,186.00 | Priorizar recuperación de deuda y desglose por línea. |
| Finalizadas sin entrega registrada | 238; 212 con saldo cero | Hacer visible el trabajo listo y diferenciarlo del atraso de producción. |
| Asignación | 64 de 333 órdenes con responsable | Mostrar cobertura, sin ranking de productividad. |
| Costeo y consumo | 0 productos, 0 órdenes-materiales, 0 piezas y 0 consumos de piezas | No presentar márgenes, utilidad neta ni merma como si existiera base suficiente. |
| Ítems | 49 ítems en 49 órdenes, ninguno vinculado a producto | No agrupar descripciones libres como productos equivalentes. |
| Conciliación | S/ 1,470.00 de pagos conformes en canceladas y una orden con diferencia de S/ 25.00 | Excluir canceladas de cobros y advertir los casos; no corregir ni inferir devoluciones. |

El dashboard consulta la base actual. No usa estas cifras como datos de demostración ni incluye identificadores personales del diagnóstico.

## Acceso e integración

- Menú: **Administración → Inteligencia de negocio**. Ruta `/bi`.
- Endpoint de lectura: `GET /api/bi/resumen`.
- Roles autorizados: administrador y subgerente, tanto en el guard de ruta como en la dependencia de autorización del backend.
- Parámetros opcionales: `desde`, `hasta` (ISO `AAAA-MM-DD`), `unidad_negocio`, `canal_ingreso`.
- Sin fechas: últimos 7 días, incluyendo hoy. Máximo 366 días; se rechazan rangos invertidos, fechas inválidas y fechas futuras.
- Toda fecha de negocio se interpreta en `America/Lima`; timestamps almacenados en UTC.
- No requiere migraciones, credenciales adicionales, servicio BI externo ni cambios a datos históricos.
- Se conserva Finanzas y Cuentas por cobrar. El nuevo apartado agrega lectura gerencial, no sustituye el arqueo ni las operaciones de cobro.

## Contrato de métricas v1

### Flujos del período seleccionado

Los filtros de línea y canal se aplican a la orden asociada. Las órdenes canceladas se excluyen. Los atributos y estados se leen como están hoy: no se reconstruye cómo estaban al cierre de una fecha histórica.

| Métrica | Definición | Interpretación |
| --- | --- | --- |
| Valor de órdenes | Suma de `ordenes.total` de órdenes creadas en el rango peruano | Importe comercial registrado, con el tratamiento de IGV/descuento propio de la orden. No es ingreso cobrado ni venta contable reconocida. |
| Cobros conformes | Suma de `orden_pagos.monto` con `estado_pago=conforme`, por `fecha` del pago | Puede incluir pagos de órdenes anteriores. No cuenta pagos observados/anulados ni de órdenes hoy canceladas. |
| Órdenes creadas | Cantidad de órdenes no canceladas creadas en el rango | Volumen, sin sumar eventos de pago como pedidos nuevos. |
| Ticket promedio | Valor de órdenes / cantidad de órdenes | Cero si no hay órdenes. No mezclar con cobros. |
| Liquidadas al corte | Órdenes de esa cohorte con `pagado_totalmente=true` hoy / total de la cohorte | Porcentaje nulo si no hay órdenes. No significa que se liquidaran dentro del período elegido. |
| Tendencia diaria | Valor de órdenes y cobros agrupados por su propia fecha peruana | Se incluyen días sin actividad con cero. El gráfico tiene tabla accesible de valores exactos. |
| Desglose de ventas | Cantidad, valor y ticket por línea y canal | Participación comercial, no conversión de consultas a ventas. |
| Métodos de pago | Cobros conformes por método | Yape total agrupa `yape`, `yape_angel` y `yape_marcell`; el detalle no se vuelve a sumar al total. |
| Clientes recurrentes | Clientes con más de una orden dentro del rango y filtros | No es recurrencia histórica ni retención entre cohortes. |
| Concentración | Hasta 5 clientes por valor de órdenes y participación sobre el total del período | Detecta dependencia comercial. No equivale a rentabilidad por cliente. |
| Tiempo hasta finalizar | Media de horas transcurridas entre creación y finalización, para finalizaciones del rango con fechas coherentes | Incluye noches y fines de semana. Se informa el número de observaciones; no son horas-hombre ni productividad individual. |

**Comparaciones:** período inmediatamente anterior de igual cantidad de días. Se habilitan solo si el historial filtrado comienza a más tardar en el inicio del período anterior y el rango actual no incluye hoy. Si la base anterior es cero, no se presenta una variación porcentual. La primera orden no garantiza captura completa. No se comparan días parciales con días completos ni se extrapola el día actual.

### Fotografía actual: sin filtro de fechas

Estos bloques respetan línea y canal, pero **ignoran `desde`/`hasta`**. La interfaz lo indica para que una consulta semanal no oculte una deuda antigua.

| Métrica | Definición / acción |
| --- | --- |
| Saldo actual por cobrar | Suma de saldos positivos de órdenes no canceladas. |
| Deuda por línea y cliente | Distribución del saldo; hasta 10 clientes con mayor deuda. |
| Saldo con fecha comprometida pasada | Tramos 1–7, 8–30 y más de 30 días desde `fecha_entrega`; solo saldo positivo. No se llama mora crediticia: no existe fecha contractual de vencimiento de crédito. |
| Entregadas autorizadas con deuda | Saldo positivo de órdenes entregadas con autorizador registrado. |
| Finalizadas y pagadas | Estado `finalizada` y saldo cero: revisar recojo o actualizar entrega. |
| Finalizadas con deuda | Estado `finalizada` y saldo positivo: seguimiento de cobro. |
| Fecha comprometida pasada | Fecha de entrega anterior a hoy y orden no entregada/cancelada. No afirma que esté pendiente de producir. |
| Sin responsable | Cantidad sin `asignado_a`, sobre todas las órdenes vigentes del alcance, incluidas cerradas. Cobertura de captura, no carga laboral actual. |

Las listas operativas muestran hasta 10 órdenes de cada categoría, por fecha comprometida más antigua y luego ID. Los contadores reflejan el total, no solo las primeras 10. Se accede a la orden y a su historial de pagos. El enlace a Cuentas por cobrar conserva el comportamiento de esa pantalla, que puede iniciar mostrando solo proformas.

## Calidad y límites

- **Conciliación:** se detecta `abs(total - saldo_pendiente - suma(pagos conformes)) > S/ 0.01` en órdenes no canceladas del alcance, de todas las fechas. Se informa el total de casos y se ofrecen hasta 10 para revisión. No se altera el importe original.
- **Canceladas con pagos:** se informa por fecha de pago el importe conforme excluido. Sin registrar devolución no se puede afirmar cuánto se devolvió o retuvo.
- **Entrega física:** “sin entrega registrada” no prueba que el cliente no recogió el trabajo. El backlog puede reflejar hábitos de actualización.
- **Historia mutable:** si se edita/cancela una orden o se observa un pago, reportes de períodos pasados pueden variar. No es un libro contable cerrado ni un almacén histórico de snapshots.
- **Concurrencia:** las agregaciones se consultan en una petición, sobre la base operativa. No se anuncia un cierre contable atómico: operaciones concurrentes pueden modificar datos mientras se calcula.
- **Rendimiento:** agregaciones de columnas en SQL, sin hidratar todas las relaciones ORM; fechas de flujo acotadas y listas limitadas. La deuda actual requiere examinar el conjunto vigente. Reevaluar índices/cache/materialización al crecer y medir planes reales antes de introducir complejidad.
- **Exportación:** CSV compatible con hojas de cálculo, con fechas, filtros y notas de interpretación. No se anuncia como archivo `.xlsx`.
- **Historial limitado:** no se imputan datos faltantes ni se concluyen tendencias anuales con semanas de información.

## Qué queda para siguientes versiones

| Capacidad | Datos/criterios necesarios antes de incorporarla |
| --- | --- |
| Margen de contribución por producto/orden | Productos identificados, consumos por orden y costos unitarios históricos, costos de subcontratación y criterio explícito de IGV. |
| Utilidad neta | Gastos completos, costos indirectos, depreciación, remuneraciones y reglas contables validadas; gastos de caja no bastan. |
| Merma y cobertura de insumos | Recepciones, movimientos, unidades compatibles, rollos y consumos reales capturados consistentemente; separar reserva de consumo para no duplicar salidas. |
| Productividad por operario | Asignación consistente, cambios de responsable, hitos y complejidad de trabajo; no ordenar personas solo por cantidad de pedidos. |
| Puntualidad fiable | Registro de entrega física y fecha comprometida consistente; mostrar siempre cobertura del indicador. |
| Retención y conversión | Cohortes suficientes y, para conversión, consultas/cotizaciones que no terminaron en orden. |
| Predicción de demanda | Historia suficiente, continuidad de captura, estacionalidad evaluada y validación fuera de muestra. |
| Devoluciones de canceladas | Flujo explícito de devolución/retención, importe y estado conciliado. |

Estas capacidades siguen pendientes aunque documentos anteriores las describan como implementadas. Esta versión cubre parcialmente el RF-14: ventas/cobros, liquidación y seguimiento; el ranking de productividad queda condicionado a la calidad de captura.

## Verificación y mantenimiento

- Backend: pruebas de separación entre fecha de creación y pago, deuda antigua, corte peruano, días vacíos, cancelaciones, pagos observados, filtros, recurrencia, comparación, conciliación y autorización por rol (`tests/test_bi.py`).
- Frontend: pruebas de fecha peruana, filtros, respuesta fuera de orden y error recuperable (`bi.spec.ts`); pruebas del menú según rol.
- Compilación de producción del frontend y revisión visual con datos sintéticos, sin copiar información de clientes reales.
- La existencia de pruebas en código no equivale a aprobación del cliente ni a evidencia de despliegue. Registrar por separado la versión efectivamente desplegada y la validación en el negocio.

### Resultado de verificación de v1

- `pytest tests/test_bi.py tests/test_finanzas.py tests/test_api_rbac.py -q`: **31 aprobadas**, con base aislada SQLite en memoria. No se ejecutó esta versión del servicio contra PostgreSQL: Docker local no estaba disponible. La inspección inicial de producción fue de solo lectura y no sustituye esa prueba de integración.
- `ruff check app/services/bi_service.py app/routers/bi.py tests/test_bi.py`: sin errores.
- `npm test -- --watch=false`: **473 aprobadas en 43 archivos**. Se actualizó el mock de sesión de Inventario que no incluía `puedeRegistrarInventario`, incorporado por el cambio anterior de permisos.
- `npm run build`: compilación de producción correcta.
- Navegador Chrome local con API simulada y datos sintéticos: vista a 1440 px y 390 px, sin desbordamiento horizontal global; cambio de categoría operativa, historial de pagos, cierre con Escape, error y recuperación a estado vacío. No se usaron sesiones ni datos personales de producción.
- Estado al finalizar estas pruebas, antes de la integración: cambios locales en `feat/bi-gerencial-v1`. El despliegue y su validación deben confirmarse por separado.

Para cada mejora: agregar fecha y versión arriba, actualizar fórmulas si cambian, registrar la fuente habilitante y mantener explícita la comparabilidad con v1. No sobrescribir el motivo histórico por el que una métrica se pospuso.
