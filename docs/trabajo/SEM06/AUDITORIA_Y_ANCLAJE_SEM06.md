# AUDITORÍA FORENSE Y ANCLAJE METODOLÓGICO — SEMANA 06 (PRÁCTICA DE CAMPO 1)
## Universidad Privada del Norte — Ciclo 2026-II
### Curso: Proyecto Capstone (Aula: 22643421416 | Grupo 2)
### Organización Cliente: Impresos Trujillo E.I.R.L. (RUC: 20602572952)

---

### 1. ALINEACIÓN TEMPORAL Y DESFASE DE SEMANAS

* **Semana de Calendario Académico UPN:** **Semana 07** (Lunes 28/09/2026 al Sábado 03/10/2026).
* **Carpeta de Entregable Oficial:** `SEM06` (rotulado como SEMANA 06 en el repositorio).
* **Fecha de Corte del Período:** **03/10/2026**.
* **Hito Académico Central:** **Monitoreo de Práctica de Campo 1 (Avance mínimo del 30% del software implementado)**.
* **Contexto de Negocio e Ingeniería Real:**
  La semana previa la administración de la imprenta entregó un lote físico de boletas de venta, talonarios proforma y órdenes de trabajo de taller en papel. En el período del 28/09 al 03/10 el equipo ejecutó la transcripción, estructuración y normalización de estas boletas a digital (dataset estructurado de 125 órdenes), insumo indispensable para alimentar el Dashboard analítico de BI (HU-09) y el entrenamiento del modelo de IA (HU-10).
* **Entregables Obligatorios de Cátedra para SEM06:**
  1. `1_Acta de Aceptación de Entregables.docx` (AAE-02, suscripción formal con el cliente al 03/10/2026).
  2. `2_Informe de Estado del Proyecto.docx` (v3.0 con corte al 03/10/2026).
  3. `Métricas de Calidad.docx` (evaluación formal ISO/IEC 25010 sobre el software desarrollado).
  4. `SCRUM_DIARIO.xlsx` (Scrum Diario del período 28/09 al 03/10/2026).
* **Siguiente Período Programado:** Semana 08 de la Universidad (05/10 al 10/10/2026), correspondiente a `SEM07` (Monitoreo de Avance 1, desarrollo de vistas/endpoints BI y feature engineering IA).

---

### 2. AUDITORÍA FORENSE DE OBSERVACIONES DOCENTES (NOTAS DE CLASE 7)

El borrador previo de SEM06 contenía fallas que originaron las observaciones directas del docente en `notas_clase_profesor_7.txt`:

| Observación Docente (Clase 7) | Hallazgo en Borrador Previo | Corrección Canónica Aplicada |
|:---|:---|:---|
| **Obs 1: "Justificar porcentajes del semáforo. Explicar de dónde sale el 95%, 96.5% y 96%"** | En el borrador anterior se colocaron porcentajes inventados (95.0%, 96.5%, 96.0%) sin ninguna base matemática ni sustento de cálculo. | **Sustento Matemático Transparente:** Se calculan los porcentajes reales basados estrictamente en las 5 actividades del ciclo: Alcance 80.0% (media de regla binaria 100%/0%), Tiempo 83.3% ($SPI = 0.98$), Costo 92.6% ($CPI = 1.08$, ahorro de S/ 100.00). |
| **Obs 2 y 3: "Semáforo y tiempo relacionados únicamente con el período evaluado (28/09 al 03/10)"** | Se mezclaban actividades pasadas de la semana 1 a la 5 y actividades futuras del sprint 3 dentro de las tablas de sustento del período. | **Aislamiento Estricto del Período:** Las Tablas 3, 4 y 5 del Anexo 1 evalúan EXCLUSIVAMENTE las actividades ejecutadas entre el 28/09/2026 y el 03/10/2026. |
| **Obs 4: "Revisar el cálculo de amortización. Justificar laptops, hosting y recursos"** | Se ponía una cifra global de costos sin explicar la base de cálculo de los equipos de cómputo. | **Desglose Analítico de Amortización:** Justificación explícita de la depreciación semanal de 3 computadoras portátiles (S/ 50.00 c/u = S/ 150.00/semana), horas de ingeniería (55h a S/ 20.00/h = S/ 1,100.00) y consumibles (S/ 50.00). |
| **Obs 5 y 6: "Incorporar el Acta AAE con fecha real de entrega al cliente"** | En borradores previos figuraba el nombre falso "Juan Carlos Plasencia Torres" y fechas genéricas no validadas en planta. | **Acta AAE-02 Canónica:** Suscrita presencialmente en el taller (Jr. Simón Bolívar 945) con Ángel Rodríguez Rodríguez (Gerente General) y Marcell Magaly Vásquez Loje (Product Owner) el 03/10/2026. |
| **Obs 8 y 10: "Mostrar evidencias del software desarrollado: Módulo de Caja, Docker, Swagger"** | Se mencionaba avance de software sin detallar las evidencias técnicas probatorias. | **Evidencias Técnicas Formalizadas:** Contenedores Docker levantados localmente con PostgreSQL 16 y FastAPI, endpoints documentados en OpenAPI Swagger (`/api/v1/payments`, `/api/v1/orders`), componente de talonario virtual reactivo en Angular 21 y logs de ejecución. |
| **Obs 9 y 11: "En SCRUM Diario mostrar actividades reales del período"** | El Scrum Diario repetía tareas genéricas de codificación desconectadas del trabajo de campo. | **Scrum Diario Sincero:** Detalle de la digitalización masiva y estructuración del lote de 125 boletas físicas, calibración de fórmulas por m², y pruebas de candado digital. |
| **Fidelidad de Plantillas (Directiva Vital)** | El borrador anterior alteró los nombres de columnas de las Tablas 2, 3, 4 y 5 del Anexo 1 (agregando columnas arbitrarias de 8 y 5 campos). | **Restauración 100% Fiel de Tablas:** Se restauran con precisión quirúrgica las columnas originales de la plantilla oficial: Tabla 2 (6 columnas), Tabla 3 (3 columnas), Tabla 4 (4 columnas), Tabla 5 (3 columnas). |

---

### 3. ESTRUCTURA CANÓNICA DE ENTREGABLES PARA SEM06

Se establecen 4 documentos canónicos en `docs/trabajo/SEM06/`:
1. `01_ACTA_DE_ACEPTACION_DE_ENTREGABLES_AAE02.md`: Segunda acta formal (AAE-02) con las 7 tablas oficiales y firmas reales de Ángel Rodríguez y Marcell Vásquez.
2. `02_INFORME_DE_ESTADO_DEL_PROYECTO_V3.md`: Tercer informe de estado oficial (corte al 03/10/2026) con justificación matemática transparente y eliminación de los porcentajes ficticios.
3. `03_METRICAS_DE_CALIDAD_ISO25010.md`: Formato oficial de `Métricas de Calidad.docx` evaluando 6 métricas bajo ISO/IEC 25010 para Producto y Variable Dependiente.
4. `04_SCRUM_DIARIO_SPRINT_02_SEGUNDA_SEMANA.md`: Registro de Daily Scrums del período (28/09 al 03/10/2026) en formato oficial de `SCRUM_DIARIO.xlsx`.
