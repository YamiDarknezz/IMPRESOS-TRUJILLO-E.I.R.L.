# MATRIZ DE GESTIÓN DE RIESGOS DEL PROYECTO
## Universidad Privada del Norte — Ciclo 2026-II
### Curso: Proyecto Capstone (Aula: 22643421416 | Grupo 2)
### Organización Cliente: Impresos Trujillo E.I.R.L.

---

## METADATOS INSTITUCIONALES DEL DOCUMENTO

- **Proyecto:** Implementación de un sistema web transaccional con módulos de inteligencia de negocios e inteligencia artificial para la optimización de los procesos operativos y financieros en Impresos Trujillo E.I.R.L.
- **ID del Proyecto:** Grupo 2 — Aula 22643421416
- **Fecha de Inicio Planificada:** 17 de agosto de 2026
- **Fecha de Fin Planificada:** 05 de diciembre de 2026

---

## TABLA ESTRUCTURADA DE LA MATRIZ DE RIESGOS

> *Nota de Fidelidad a Plantilla:* Esta matriz reproduce con exactitud las columnas de [`plantilla_matriz_riesgos.xls`](file:///c:/Users/Erick/Documents/Proyectos/Proyectos/CAP/docs/plantillas/SEM03/plantilla_matriz_riesgos.xls): `No. de Riesgo`, `Elemento de la EDT`, `Tipo de riesgo`, `Riesgo` (Fuente y Consecuencia), `Síntoma`, `Impacto`, `Probabilidad`, `Evaluación` y `Respuesta`.
>
> **Reglas de Oro del Docente Integradas:**
> 1. Códigos EDT rigurosamente sincronizados con la EDT canónica de 4 niveles aprobada.
> 2. Numeración correlativa limpia iniciando en R1 (sin saltos arbitrarios).
> 3. Cero riesgos atribuidos a inexperiencia o atrasos del equipo de estudiantes.

| No. de Riesgo | Elemento de la EDT | Tipo de Riesgo | Riesgo / Fuente | Consecuencia Potencial | Síntoma de Alerta | Impacto (A/M/B) | Probabilidad (A/M/B) | Evaluación (Nivel) | Respuesta y Estrategia de Mitigación |
|:---:|:---|:---|:---|:---|:---|:---:|:---:|:---:|:---|
| **R1** | 1.1.2 Elaboración del Caso de Negocio / 5.4.1 Recolección Pretest | Gestión | Demora de la empresa en facilitar el lote histórico de talonarios físicos de Contrato/Proforma y boletas en papel. | Menor volumen de datos estructurados para la línea base pretest y para el dataset de entrenamiento del modelo de IA. | Retraso en la entrega de documentos físicos durante las primeras visitas técnicas al taller. | **Medio (M)** | **Medio (M)** | **Moderado** | **Mitigar:** Acordar cronograma de recojo in situ en Jr. Simón Bolívar 945 y apoyar presencialmente en la digitalización estructurada de boletas con el equipo. |
| **R2** | 5.3.2 Jornadas de Capacitación in Situ | Organizacional | Resistencia al cambio del personal operativo de taller, acostumbrado a la anotación informal en libretas manuscritas. | Subutilización del software en el área de producción y persistencia de prácticas manuales con pérdida de trazabilidad. | Renuencia a registrar mermas o cambio de estados de pedidos directamente en las computadoras de taller. | **Medio (M)** | **Alto (A)** | **Significativo** | **Mitigar:** Diseñar interfaces web intuitivas que repliquen el diseño del talonario físico y ejecutar 4 jornadas de inducción personalizada in situ de 45 minutos. |
| **R3** | 5.2.1 Configuración de Servidor VPS Propio en Linux | Externo | Cortes imprevistos en la red eléctrica comercial en el centro histórico de Trujillo durante jornadas comerciales pico. | Detención temporal del mostrador comercial y riesgo de corrupción en transacciones no confirmadas. | Parpadeo en fluido eléctrico de la zona comercial o apagones reportados por la concesionaria eléctrica. | **Alto (A)** | **Medio (M)** | **Significativo** | **Mitigar:** Implementar persistencia transaccional ACID en PostgreSQL nativo, auto-guardado en la SPA web y aprovechamiento de UPS en las computadoras principales de oficina. |
| **R4** | 3.1.2 Catálogo de Productos y Fórmulas | Gestión | Discrepancias entre los precios comerciales vigentes, formatos de comprobante y las recetas de consumo por metro cuadrado. | Errores en cotizaciones al cliente y desajustes en el cálculo preventivo de reserva de insumos en bodega. | Observaciones o diferencias de tarifas reportadas por la administradora al emitir las primeras órdenes de prueba. | **Medio (M)** | **Medio (M)** | **Moderado** | **Mitigar:** Realizar sesión de parametrización y homologación de recetas con el Gerente de Taller (Angel Rodríguez) previo al despliegue en producción. |
| **R5** | 3.3.1 Candado Digital de Cobro | Técnico | Carga de capturas de pantalla de pagos Yape o transferencias con montos o códigos de operación adulterados o duplicados. | Descalces financieros en la recaudación diaria y registro de pedidos entregados sin respaldo monetario efectivo. | Comprobantes de pago digitales con numeración de operación borrosa o inconsistente con el extracto bancario. | **Alto (A)** | **Bajo (B)** | **Moderado** | **Mitigar:** Validación manual asistida con verificación obligatoria del N° de operación bancaria por la administradora antes de que el candado digital libere la entrega. |
| **R6** | 5.2.1 Configuración de Servidor VPS Propio en Linux | Técnico | Caída temporal del enlace simétrico de fibra óptica en el local o indisponibilidad temporal del servidor VPS en la nube. | Imposibilidad temporal de sincronizar órdenes de trabajo en tiempo real entre la oficina de mostrador y el taller. | Pérdida de conectividad a internet en navegadores o latencias elevadas en peticiones a la API backend. | **Medio (M)** | **Bajo (B)** | **Bajo** | **Mitigar:** Arquitectura cliente SPA resiliente con almacenamiento de formularios en LocalStorage y reconexión automática tan pronto se restablece el servicio. |
| **R7** | 4.2.2 Entrenamiento del Modelo Predictivo de Demanda | Calidad | Volumen insuficiente o inconsistencias en los registros de consumo histórico de rollos de lona y vinil para la IA. | Precisión del modelo predictivo por debajo del umbral mínimo del 70% requerido para apoyar la planificación mensual de compras. | Error cuadrático medio (RMSE) elevado o variabilidad extrema en las curvas de ajuste durante el entrenamiento. | **Medio (M)** | **Medio (M)** | **Moderado** | **Mitigar:** Aplicar técnicas rigurosas de limpieza de datos, imputación estadística y enriquecimiento de series temporales con datos de estacionalidad gráfica local. |

---

## CRITERIOS DE EVALUACIÓN Y ESCALA DE RIESGOS

- **Impacto:** Alto (A - Pérdida de servicio o descalce monetario), Medio (M - Demoras operativas subsanables), Bajo (B - Incidencia menor).
- **Probabilidad:** Alta (A - Frecuente en operaciones MYPE), Media (M - Ocasional), Baja (B - Improbable bajo condiciones normales).
- **Nivel de Evaluación:** Significativo (Requiere monitoreo y contingencia activa), Moderado (Control periódico y parametrización), Bajo (Procedimiento estándar).
