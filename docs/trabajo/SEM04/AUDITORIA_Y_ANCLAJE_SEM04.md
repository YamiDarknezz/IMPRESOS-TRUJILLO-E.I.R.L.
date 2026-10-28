# AUDITORÍA FORENSE Y ANCLAJE METODOLÓGICO — SEMANA 04
## Universidad Privada del Norte — Ciclo 2026-II
### Curso: Proyecto Capstone (Aula: 22643421416 | Grupo 2)
### Organización Cliente: Impresos Trujillo E.I.R.L. (RUC: 20602572952)

---

### 1. ALINEACIÓN TEMPORAL Y DESFASE DE SEMANAS

* **Semana de Calendario Académico UPN:** **Semana 05** (Lunes 14/09/2026 al Sábado 19/09/2026).
* **Carpeta de Entregable Oficial:** `SEM04` (rotulado como SEMANA 04 conforme a la secuencia de entregables del curso).
* **Fecha de Corte del Período:** **19/09/2026**.
* **Hitos de la Semana:**
  - Primer Informe Formal de Estado del Proyecto (Informe de Estado v1.0).
  - Formalización del Product Backlog (10 Historias de Usuario, estimación en Story Points y criterios DoD).
  - Ejecución y Cierre del Sprint 1 (Arquitectura Base en Docker Compose, Autenticación JWT y maquetación de pantallas).
  - Registro de Daily Scrums del período (14/09 al 19/09/2026).
* **Siguiente Período Programado:** Semana 06 de la Universidad (21/09 al 26/09/2026), correspondiente a la Evaluación Parcial T1 y Costeo de los 31 paquetes de trabajo.

---

### 2. AUDITORÍA FORENSE DE ENTREGABLES PREVIOS VS PLANTILLAS Y RETROALIMENTACIÓN DOCENTE

| Ítem Auditado | Estado Anterior (Hallazgos Críticos) | Directiva Docente Oficial | Corrección Canónica Aplicada |
|:---|:---|:---|:---|
| **Título del Proyecto** | En borradores previos de SEM04 se omitió la frase "y financieros", dejándolo únicamente como "procesos operativos". | Exigencia de consistencia estricta en todos los documentos (Notas 1, 2, 6). | **Título Canónico Unificado:** *"Implementación de un sistema web transaccional con módulos de inteligencia de negocios e inteligencia artificial para la optimización de los procesos operativos y financieros en Impresos Trujillo E.I.R.L."* |
| **Datos de la Empresa en Backlog** | En el archivo previo `SCRUM_Agile-Product-Backlog.docx` figuraba "Av. España 251" y RUC ficticio "20481234567". | Información falsa/inventada sancionada severamente. Prohibido inventar datos. | **Datos Reales Anclados:** RUC 20602572952, Jr. Simón Bolívar 945, Int. 1, Centro Histórico de Trujillo, La Libertad, Perú. |
| **Estructura de la EDT en Anexo 1** | El borrador anterior inventó códigos arbitrarios (`EDT 1.4.5`, `EDT 1.4.6`, `EDT 4.1.1.1`, `EDT 4.1.1.a`) que destruían la correspondencia con la EDT canónica. | Directiva Clase 6 (L9): *"colocar todas las actividades de principio a fin en anexos de informe de estado"*. | **Inclusión total de los 31 paquetes de nivel 4** de la EDT canónica (desde 1.1.1 hasta 5.4.2), con estados sinceros: TERMINADO, EN EJECUCIÓN o NO INICIADO. |
| **Semaforización sin Criterio** | En versiones preliminares se coloreaba en Verde sin sustento numérico ni justificación matemática. | Directiva Clase 4 (L5) y Clase 7 (Obs 1-3): *"EL PROFESOR RESALTA EL NO COLOREAR SIN CRITERIO. Explicar de dónde salen los porcentajes. Relacionar solo con actividades del período"*. | **Sustento Matemático Transparente:** Fórmulas explícitas en Alcance (media de regla binaria 100%/0%), Tiempo (días reales vs estimados, SPI) y Costo (AC vs PV, CPI). |
| **Regla de Medición de Alcance** | En borradores previos se ponían avances arbitrarios (e.g. 75% o 85% en actividades individuales). | Directiva Clase 4 (L5): *"SOLO HAY DOS VALORES: O TERMINÉ O NO TERMINÉ (100% o 0%). Si dices 75% es como si dijeras que la actividad necesita descomponerse"*. | **Regla Binaria Estricta (100% o 0%):** Cada actividad individual del período se califica con 100% (si tiene entregable validado) o 0% (si está en curso). El cumplimiento promedio sí refleja el porcentaje ponderado. |
| **Scrum Diario y Actividades Reales** | El Scrum previo solo listaba tareas abstractas de programación, desconectadas del trabajo académico y de campo. | Directiva Clase 7 (Obs 9 y 11): *"En SCRUM Diario mostrar actividades reales del período: Digitalización, Depuración, Presupuesto, Antecedentes, Actividades desarrolladas durante la semana"*. | **Scrum Diario con Actividades Reales:** Integración de tareas de ingeniería de software con la digitalización de boletas físicas, consolidación de costos y depuración de antecedentes metodológicos. |
| **Exclusión de Metodología Kanban** | Borradores anteriores intentaban mezclar plantillas Kanban con Scrum. | Directiva Clase 4 (L2): *"IGNORAR KANBAN puesto que el proyecto se trabaja en scrum"*. | Solo se adoptan y completan los artefactos oficiales de Scrum requeridos: Product Backlog, Sprint Backlog y Scrum Diario. |

---

### 3. VINCULACIÓN METODOLÓGICA Y REGLAS DE SEMAFORIZACIÓN (SEMANA 4)

#### A. Criterio de Alcance (Período 14/09 al 19/09/2026):
* Se evalúan 5 paquetes técnicos planificados para el Sprint 1:
  1. `EDT 3.1.1`: Especificación de Arquitectura de Software y Docker Compose local (100% — Completado).
  2. `EDT 3.2.1`: Diseño de Base de Datos relacional para Usuarios, Roles e Insumos (100% — Completado).
  3. `EDT 3.3.1`: Prototipos de Interfaz UI para Login y Shell de Trabajo en Angular 21 (100% — Completado).
  4. `EDT 4.1.1`: Desarrollo de Backend: Servicio de Autenticación JWT y RBAC en FastAPI (100% — Completado).
  5. `EDT 4.2.1`: Desarrollo de Frontend: Componente Login y Guardias de Navegación (0% — En curso de refinamiento al cierre de sprint; interfaz visual operativa pero integración con guardias de rol en pruebas).
* **Cálculo de Alcance Promedio:** \((100\% + 100\% + 100\% + 100\% + 0\%) / 5 = 80.0\%\).
* **Semáforo:** **VERDE** (según Anexo 2 Tabla 6, cumplimiento \(\ge 75\%\)).

#### B. Criterio de Tiempo (Período 14/09 al 19/09/2026):
* Duración planificada de actividades del período: 12 días laborables hombre acumulados.
* Duración real insumida en actividades concluidas: 10 días laborables en plazo estricto.
* Desfase controlado: 1 día de ajuste en el mapeo relacional de insumos resuelto en menos de 24 horas.
* **Cálculo de Eficiencia de Tiempo:** \((10 / 12) \times 100\% = 83.33\%\).
* **Métrica Earned Value:** \(SPI = 0.97\) (variación marginal controlada).
* **Semáforo:** **VERDE** (según Anexo 2 Tabla 7, actividades en plazo \(\ge 75\%\)).

#### C. Criterio de Costo (Período 14/09 al 19/09/2026):
* Valor Planificado (PV): S/ 1,500.00 (equivalente a 75 horas de ingeniería valorizadas a S/ 20.00/hora).
* Costo Real Incurrido (AC): S/ 1,400.00 (70 horas efectivas insumidas gracias a la reutilización de librerías nativas y pruebas automatizadas con pytest).
* Amortización de Equipos Justificada: 3 laptops de desarrollo \(\times\) S/ 50.00/semana de depreciación operativa prorrateada = S/ 150.00 incluidos dentro del costo valorizado.
* **Cálculo de Rendimiento de Costo:** \(CPI = PV / AC = 1,500 / 1,400 = 1.07\) (economía a favor del proyecto de S/ 100.00, costo real representa el 93.3% del planificado).
* **Semáforo:** **VERDE** (según Anexo 2 Tabla 8, costo real \(\le 100\%\) del planificado).

---

### 4. MATRIZ DE HISTORIAS DE USUARIO Y ALCANCE DEL SPRINT 1

* **Product Backlog Consolidado:** 10 Historias de Usuario (HU-01 a HU-10) con una estimación global de 65 Story Points (SP).
* **Alcance del Sprint 1:**
  - `HU-01`: Control de Acceso, Autenticación Segura y Roles de Usuario (3 SP — Must Have). **TERMINADO**.
  - `HU-02`: Gestión de Clientes y Cotizaciones de Imprenta (Base de datos relacional y servicios iniciales — 5 SP — Must Have). **EN CURSO (Base DB culminada, interfaces a Sprint 2)**.
  - `HU-04`: Arquitectura Base del Sistema Contenerizado (Docker Compose + PostgreSQL + FastAPI + Angular). **TERMINADO**.
* **Story Points Devengados en Sprint 1:** 3 SP completados al 100% bajo Definition of Done (DoD).
