# AUDITORÍA FORENSE Y ANCLAJE METODOLÓGICO — SEMANA 07 (ENTREGA FINAL SEMANA 8)
## Universidad Privada del Norte — Ciclo 2026-II
### Curso: Proyecto Capstone (Aula: 22643421416 | Grupo 2)
### Organización Cliente: Impresos Trujillo E.I.R.L. (RUC: 20602572952)

---

### 1. ALINEACIÓN TEMPORAL Y CONTEXTO DE ENTREGA

* **Semana de Calendario Académico UPN:** **Semana 08** (Lunes 05/10/2026 al Sábado 10/10/2026).
* **Carpeta de Entregable Oficial:** `SEM07` (rotulada como SEMANA 07 conforme al correlativo de entregables).
* **Corte de trabajo del equipo:** **Viernes 09/10/2026**.
* **Hito académico / fecha de entrega:** **Sábado 10/10/2026**. El sábado es jornada de clases; no se contabilizan tareas de desarrollo, horas-hombre ni costos de trabajo ese día.
* **Hito Académico Central:** **Monitoreo de Avance 1 de Software / Evaluación Continua de Semana 8**.
* **Aclaración Metodológica Vital sobre Notas de Clase 7:**
  El archivo `docs/contexto/notas_clase/notas_clase_profesor_7.txt` contiene observaciones que deben preservarse: justificar semáforos con actividades del período, separar período actual y futuro, sustentar la fecha real de entrega, adjuntar evidencias y reflejar actividades reales. La auditoría de esta revisión no considera demostrada una afirmación solo porque aparezca en un DOCX, PDF, captura compuesta o Scrum.

---

### 2. AUDITORÍA FORENSE DE ERRORES DETECTADOS EN BORRADORES DE SEM07

Al inspeccionar los archivos preliminares generados en `docs/entregables/SEM07/`, se identificaron vicios graves que deben ser erradicados de forma terminante:

| Elemento Auditado | Hallazgo en Borrador Preliminar SEM07 | Criterio Docente Vulnerado | Corrección de esta revisión / estado |
|:---|:---|:---|:---|
| **Porcentajes del Semáforo en Informe v4.0** | Borradores anteriores incluían porcentajes de alcance/tiempo/costo sin plan y datos reales verificables. | Directiva Nota 7 (Obs. 1): justificar indicadores desde actividades del período. | Retirados como resultados. EVM y semáforos siguen pendientes hasta cotejar línea base, regla de cálculo y datos de ejecución; no se afirma que el recálculo esté terminado. |
| **Recuento y presupuesto de paquetes EDT** | El costeo SEM05 declara 31 paquetes nivel 4; la EDT vigente contiene 43 actividades nivel 3 y las tablas heredadas reutilizan códigos que no concuerdan con ella. El Markdown suma S/ 5,940 en sus 19 totales de resumen (no S/ 5,100 declarado); su subtotal detallado Fase 5 es S/ 1,300 frente a S/ 1,150 en los cinco totales de paquete. El XLSX de SEM05 presenta ocho fases y códigos EDT distintos de la EDT vigente; sus fórmulas de resumen no tienen valores almacenados en caché. | Trazabilidad entre EDT, costeo y reporte; cuadre aritmético antes de calcular PV/AC/CPI. | La Tabla 5-B SEM07 lista las 43 actividades nivel 3, sin sumar avance ni usar 31 como denominador. No se declara ninguna de las fuentes de costeo como línea base validada: el equipo debe identificar la versión aprobada y conciliar códigos, importes y fórmulas antes de producir totales o semáforos de costo. |
| **Nombres de Interesados y Autoridades** | Aparecían nombres/cargos contradictorios en versiones previas. | No inventar datos; mantener consistencia con registros del proyecto. | Confirmar nombres y cargos contra Acta/Business Case. Esta revisión no usa el nombre cuestionado como autoridad ni asigna una persona a cargos no comprobados. |
| **RUC de la Empresa en Demostración** | La guía previa contenía un identificador empresarial inconsistente. | Rigor y veracidad documental. | La versión anterior de esta guía fue sustituida; el RUC no es necesario para demostrar los cambios funcionales y se omite del guion. |
| **Aislamiento del Período de Tiempo** | El sustento de tiempo mezclaba ejecución, CI automático y jornada académica sabatina. | Directiva Nota 7 (Obs. 2 y 3): aislar período y sustentar calendario/esfuerzo. | Se distingue trabajo de lunes a viernes, integración con timestamp posterior a medianoche y CI automático. Horas y cumplimiento permanecen pendientes; no se declara un número de jornadas-hombre sin bitácora. |
| **Justificación de Amortización de Hardware** | El desglose de laptops, horas y conectividad no tenía fuente primaria adjunta. | Directiva Nota 7 (Obs. 4): justificar laptops, hosting y recursos. | No se conserva como dato real. Requiere presupuesto base, criterio/vida útil de amortización, horas individuales y comprobantes. |
| **Evidencias técnicas** | Los borradores atribuyen al corte BI/IA, tres endpoints analíticos y 387 pruebas, pero no se localizaron los módulos/endpoints BI/IA en el código versionado del corte ni capturas verificables de esas pantallas. | Nota 7 (Obs. 8 y 10): mostrar pruebas reales, workflow y logs. | **CI verificable:** el run de GitHub Actions `38028670036` sobre `f812ece` (10/10/2026) pasó 293 pruebas backend y 469 frontend. El job de despliegue quedó omitido. No usar ese run como evidencia de despliegue ni afirmar BI/IA en SEM07 sin respaldo de código/evidencia de esa fecha. |
| **Acta AAE-03** | El PDF de SEM07 incluido en el repositorio tiene campos de firma en blanco, aunque el texto indica aceptación y aprobación. | Nota 7 (Obs. 5): un hito al 100% requiere aceptación real y fecha real. | Conservar como borrador hasta cotejar con el ejemplar firmado por cliente y responsables. No citarlo como aprobación formal basándose solo en esta copia. |
| **Validación de instrumentos** | En los entregables aparecen V de Aiken de 0.94 y 0.96 y Alfa de Cronbach de 0.89, sin matriz de calificaciones de jueces ni respuestas piloto localizadas en el repositorio. | No publicar una métrica psicométrica sin sus datos y cálculo fuente. | Mantener instrumentos como diseñados; completar la sección de validación cuando se aporten fichas de jueces y base del piloto. |
| **Cronograma y esfuerzo** | El Scrum incluye actividad técnica en sábado y el informe calcula tiempo/costo con días y porcentajes que no cuadran completamente con la regla binaria declarada. | Nota 7 (Obs. 2 y 3): evaluar solo el período real y sustentar los indicadores. | Sábado 10/10 es clase/entrega, no jornada laboral. Las tareas se registran en lunes–viernes solo si el equipo confirma que allí se realizaron; no se cambian timestamps ni se inventan horas para acomodar merges posteriores a medianoche. Validar línea base y esfuerzo antes de recalcular semáforos. |

---

### 3. ESTRUCTURA CANÓNICA DE ENTREGABLES PARA SEM07 (ENTREGA 10/10/2026)

Se conservan las fuentes de trabajo en `docs/trabajo/SEM07/` para revisión interna. **No se consideran listas para presentación formal** hasta resolver la matriz de pendientes de la sección 4 y sincronizar las salidas DOCX/PDF/XLSX con la versión aprobada.
1. `01_INFORME_DE_ESTADO_DEL_PROYECTO_V4.md`: borrador interno del informe SEM07; indicadores y trazabilidad histórica pendientes de validar.
2. `02_DEMOSTRACION_DEL_SOFTWARE_NUEVO.md`: guion de cambios funcionales versionados y matriz para completar durante una demostración real.
3. `03_INSTRUMENTOS_DE_RECOLECCION_DE_DATOS.md`: fichas de diseño de cuatro instrumentos; aplicación y validación pendientes de datos fuente.
4. `04_SCRUM_DIARIO_SPRINT_04.md`: borrador de trabajo lunes–viernes, con sábado excluido como jornada de desarrollo; actividad diaria por cotejar con el equipo.

---

### 4. VERIFICACIÓN DE ESTA REVISIÓN Y PENDIENTES PARA SESIÓN CON ESTIBB

#### Hechos comprobados en GitHub / código

* La equivalencia temporal canónica es `SEM07` = entregable 7 = semana académica 8 = 05/10–10/10/2026. No renombrar la carpeta por la semana universitaria.
* Los cambios de software que sí aparecen en el historial de ese corte incluyen filtro de local/pendientes y teléfono de órdenes, adelanto en varios métodos, distinción de destinatarios Yape y descuento automático del rollo al crear/editar/cancelar/completar la orden (PR #122–#127, integrados alrededor del 09–10/10).
* Run CI `38028670036`, commit `f812ece`, 10/10/2026: backend **293 passed**, frontend **469 passed**; workflow exitoso. El job de despliegue fue **skipped**. Evidencia: https://github.com/YamiDarknezz/IMPRESOS-TRUJILLO-E.I.R.L./actions/runs/38028670036.
* Para eliminar trabajo planificado en sábado, se actualizó el cronograma maestro: EDT 3.2.2 y su entregable 3.2.2.1 culminan el viernes 09/10/2026; el paquete 3.2 queda en cinco días. Es un ajuste de fecha planeada, no una afirmación de que el entregable se completó realmente ese día.
* No se encontró en el árbol de código de ese corte `DashboardBiComponent`, endpoints `/api/bi/resumen-ventas`, `/api/bi/saldos-cobranza`, `/api/bi/consumo-mermas` ni el servicio/modelo IA descrito en los anexos. El BI v1 que se implementó después en `main` usa `GET /api/bi/resumen`; no debe retrofecharse.
* La plantilla de Informe de Estado contiene seis columnas en su tabla de hitos: código EDT, actividad, entregable, fecha planeada de culminación, **fecha real de entrega**, estado. La fuente de trabajo SEM07 conserva esas seis columnas en la tabla de hitos; cualquier propuesta XLSX/DOCX se coteja contra la plantilla antes de exportar.
* La plantilla `SCRUM_DIARIO.xlsx` tiene las cinco columnas `SPRINT`, `HACER`, `EN ESPERA`, `HACIENDO`, `TERMINADO`. La estructura se conserva y no se registran tareas de desarrollo del sábado.

#### Pendientes de cotejo con Estibb / el equipo

1. Confirmar qué trabajo efectivamente se hizo cada día lunes–viernes y quién lo realizó. Los commits prueban la integración de código, no reconstruyen por sí solos el trabajo diario ni las horas.
2. Cotejar el Scrum de SEM07 con cada integrante; conservar sin tareas, horas ni costo de trabajo el sábado, que corresponde a clase.
3. Calcular los semáforos solo desde el plan semanal y esfuerzo real confirmados. No mezclar plan, ejecución parcial y regla binaria (100/0) en una misma fórmula.
4. Sustentar horas/costos con el control de trabajo y una línea base aprobada. Confirmar con el equipo cuál versión de costeo rige: el Markdown SEM05 tiene totales internos incompatibles y el XLSX SEM05 usa ocho fases/códigos distintos de la EDT vigente, además de no tener resultados de fórmulas almacenados. Sin conciliación y aprobación, no calcular PV/AC/CPI ni presentar importes como auditados.
5. Validar V de Aiken (0.94 o 0.96), Alfa de Cronbach y valores Pretest/Postest con hojas originales de jueces, respuestas y fórmulas; no mantener resultados de ejemplo como observaciones reales.
6. Obtener copia firmada del AAE-03 o dejarlo como borrador pendiente de aceptación.
7. Sustituir las imágenes de BI/IA/CI que sean maquetas por capturas originales verificables; no insertar datos sintéticos como evidencia real.
8. Reubicar el Scrum de 28/09–03/10 en SEM06 y conservar el Scrum Sprint 5 de 12/10–16/10 en SEM08. Verificar que Word, PDF y Excel de cada carpeta sean la misma versión.
