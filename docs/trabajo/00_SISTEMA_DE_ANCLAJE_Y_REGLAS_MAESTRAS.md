# SISTEMA DE ANCLAJE Y REGLAS MAESTRAS DEL PROYECTO CAPSTONE
## Universidad Privada del Norte — Ciclo 2026-II
### Empresa Beneficiaria: Impresos Trujillo E.I.R.L.

---

## 1. PROPÓSITO DEL DOCUMENTO Y POLÍTICA DE TOLERANCIA CERO

Este documento constituye la **VERDAD CANÓNICA Y NORMA SUPREMA** de todo el proyecto Capstone. NINGÚN entregable, archivo `.md`, script de generación, o documento `.docx` / `.pdf` podrá violar, contradecir, omitir o reformular las reglas aquí estipuladas.

### Principios Fundamentales:
1. **Fidelidad Absoluta a las Plantillas del Docente:**
   - Si la plantilla oficial del docente estipula encabezados de tabla con `['Campo', 'Detalle']`, se mantiene ESTRICTAMENTE `['Campo', 'Detalle']`.
   - Queda TERMINANTEMENTE PROHIBIDO alterar nombres de columnas (ej. cambiar `Detalle` por `Nombre`, `Descripción` por `Justificación`, etc.) o añadir filas cabeceras artificiales.
   - La numeración de secciones, orden de párrafos y campos fijados por el docente son inalterables: una sección 5 jamás se convierte en 4, ni se eliminan secciones fijadas por el docente.
2. **Cero Invenciones ("Anti-Alucinación"):**
   - Toda información técnica, operativa, financiera y legal proviene de los datos reales de **Impresos Trujillo E.I.R.L.**, el relevamiento in situ en la sede de Jr. Simón Bolívar 945 Int. 1, las boletas físicas, los talonarios comerciales y el entorno de hardware/software verificado.
3. **Respeto e Integración Permanente de las Observaciones del Docente:**
   - Toda corrección señalada en clase (recogida en `docs/contexto/notas_clase/`) debe quedar subsanada en la semana de origen y preservarse en TODAS las semanas posteriores. Está terminantemente prohibido ignorar una observación ya señalada.
4. **Anclaje Bidireccional entre Semanas:**
   - La Semana 1 y la Semana 2 forman una unidad metodológica indisoluble: los objetivos, variables, hipótesis, alcance, riesgos y supuestos del Acta de Constitución y Business Case (Semana 1) DEBEN HACER MATCH EXACTO con la Matriz de Consistencia, Estructura de Análisis, EDT y Cronograma (Semana 2).

---

## 2. MATRIZ DE EQUIVALENCIA DE CALENDARIO Y DESFASE DE SEMANAS

### El Problema Identificado:
En la Universidad Privada del Norte (semestre 2026-II), la **Semana 01 de calendario académico** (17/08/2026 al 22/08/2026) fue la clase inaugural de presentación del sílabo, pautas del docente y conformación de grupos. No se ejecutaron entregables de desarrollo en dicha primera clase.

Por lo tanto, existe un **desnivel exacto de 1 semana** entre el cómputo de semanas de avance de entregables y las semanas académicas de la universidad:
- Lo que en el repositorio se rotula en carpetas como `SEM01` corresponde al primer entregable elaborado durante la **Semana 02 de la Universidad**.
- Lo que en el repositorio se rotula como `SEM07` (período del 05/10/2026 al 10/10/2026) corresponde en realidad a la **Semana 08 de la Universidad**.

### Tabla Maestra de Mapeo Calendario:

| Semana Universidad (Sílabo) | Período de Fechas (Lunes a Sábado) | Carpeta Repo | Hito / Contenido del Entregable | Corte / Evaluación |
|:---|:---|:---|:---|:---|
| **Semana 01** | 17/08/2026 – 22/08/2026 | *Inducción* | Presentación del sílabo, conformación de equipos, contacto inicial con empresa. Sin entrega de software. | Inicio ciclo |
| **Semana 02** | 24/08/2026 – 29/08/2026 | `SEM01` | **Entrega 1:** Acta de Constitución, Business Case, Requerimientos de Software (IEEE 830). Fecha límite: 28/08/2026. | Corte Entregable 1 |
| **Semana 03** | 31/08/2026 – 05/09/2026 | `SEM02` | **Entrega 2:** EDT, Cronograma (Gantt), Matriz de Consistencia, Estructura de Análisis. Fecha límite: 04/09/2026. | Corte Entregable 2 |
| **Semana 04** | 07/09/2026 – 12/09/2026 | `SEM03` | **Entrega 3:** Plan de Desarrollo de Software, Matriz de Riesgos, Matriz RACI, Matriz de Comunicaciones. Fecha límite: 11/09/2026. | Corte Entregable 3 |
| **Semana 05** | 14/09/2026 – 19/09/2026 | `SEM04` | **Entrega 4:** Informe de Estado v1.0, Sprint 1 Backlog, Tablero de Trabajo, Scrum Diario. Fecha límite: 19/09/2026. | Corte Entregable 4 |
| **Semana 06** | 21/09/2026 – 26/09/2026 | `SEM05` / `T1` | **Evaluación T1 Oficial:** Informe de Estado v2.0, Costeo de 31 Paquetes de Trabajo, Acta de Aceptación, Lecciones Aprendidas, Portafolio T1 e Informe de Proyecto. Fecha: 26/09/2026. | **EVALUACIÓN T1** |
| **Semana 07** | 28/09/2026 – 03/10/2026 | `SEM06` | **Entrega 6 / Monitoreo 1:** Práctica de Campo corte 1 (30% software implementado, digitalización de boletas físicas de imprenta), Informe de Estado v3.0, Métricas de Calidad ISO 25010, Scrum Diario. Fecha: 03/10/2026. | Corte Práctica Campo 1 |
| **Semana 08** | 05/10/2026 – 10/10/2026 | `SEM07` | **Entrega 7 (Semana 8 Univ):** Informe de Estado v4.0, Instrumentos de Recolección de Datos, Demostración del Software (Módulo Caja/Ventas, Docker, CI/CD), Scrum Diario. Fecha: 10/10/2026. | Monitoreo Avance 1 |
| **Semana 09** | 12/10/2026 – 17/10/2026 | `SEM08` | Sprint 2 avanzado (desarrollo vistas BI, feature engineering IA), Informe de Estado v5.0. | Trabajo de campo |
| **Semana 10** | 19/10/2026 – 24/10/2026 | `SEM09` / `T2` | **Evaluación T2 Oficial:** Funcionalidad mínima 70%, pruebas de integración, Informe Estado v6.0. | **EVALUACIÓN T2** |
| **Semana 11** | 26/10/2026 – 31/10/2026 | `SEM10` | 100% Software implementado, despliegue final en producción, última entrega de Informe de Estado (v7.0). | Cierre Software |
| **Semana 12** | 02/11/2026 – 07/11/2026 | `SEM11` | Charla de Responsabilidad Social Universitaria en la empresa (auditada, 4 puntos). | RSU |
| **Semana 13** | 09/11/2026 – 14/11/2026 | `SEM12` / `T3` | **Evaluación T3:** Entrega formal de software a la empresa con pretest y postest. | **EVALUACIÓN T3** |
| **Semana 14** | 16/11/2026 – 21/11/2026 | `SEM13` | Cierre de prácticas de campo, consolidación de evidencias. | Prácticas Campo |
| **Semana 15** | 23/11/2026 – 28/11/2026 | `SEM14` | Evaluación entre equipos (co-evaluación con preguntas obligatorias). | Co-evaluación |
| **Semana 16** | 30/11/2026 – 05/12/2026 | `SEM15` / `EF` | **Evaluación Final:** Paper de investigación científico + Informe Final consolidado. | **EXAMEN FINAL** |

---

## 3. DATOS MAESTROS INVARIABLES DEL PROYECTO

Estos datos son IDÉNTICOS en todos los documentos. No se permite ninguna variación tipográfica o semántica:

### 3.1 Título Oficial Canónico:
> **Implementación de un sistema web transaccional con módulos de inteligencia de negocios e inteligencia artificial para la optimización de los procesos operativos y financieros en Impresos Trujillo E.I.R.L.**

- **Fórmula:** Variable Independiente + Variable Dependiente + Lugar.
- **Regla docente:** Sin comas intermedias superfluas, sin dobles verbos ("Implementar o Diseñar, nunca los dos"). Se usa exclusivamente **Implementación** / **Implementar**.

### 3.2 Organización Cliente:
- **Razón Social:** Impresos Trujillo E.I.R.L.
- **RUC:** 20602572952
- **Dirección Legal y Taller:** Jr. Simón Bolívar Nro. 945 Int. 1, Centro Cívico, Trujillo, La Libertad, Perú.
- **Actividad Económica:** Imprenta comercial, gigantografías, encuadernación, comprobantes y publicidad gráfica (CIIU 1811).
- **Representantes de la Empresa:**
  - **Angel Almilcar Rodríguez Evangelista** — Gerente / Jefe de Taller (Decisor Técnico y de Producción).
  - **Marcell Magaly Vásquez Loje** — Gerente / Jefa de Oficina (Decisora Comercial y de Facturación).

### 3.3 Equipo de Desarrollo (Esquema MultiRol):
- **Código de Grupo:** Grupo 2 (NRC / Aula: 22643421416).
- **Integrantes y Asignación MultiRol:**
  1. **Gerardo Erick Plasencia Torres** (Código: N00305886)
     - Rol Principal: Líder de Proyecto / Scrum Master.
     - Roles Secundarios: Arquitecto de Software / Full Stack Developer / DevOps & CI-CD.
  2. **Jose Estibb Anhuaman Delgado** (Código: N00302830)
     - Rol Principal: Desarrollador Frontend.
     - Roles Secundarios: Analista de Requerimientos UI-UX / Tester QA / Responsable de Documentación.
  3. **Jose Diego Rodriguez Vasquez** (Código: N00209425)
     - Rol Principal: Desarrollador Backend & IA.
     - Roles Secundarios: Administrador de Base de Datos (DBA) / Ingeniero de Datos / Analista de BI.

---

## 4. ANCLAJE METODOLÓGICO: VARIABLES, OBJETIVOS E HIPÓTESIS

### 4.1 Variables del Estudio:
- **Variable Independiente (VI):**
  - *Definición Nominal:* Sistema web transaccional con módulos de inteligencia de negocios e inteligencia artificial.
  - *Indicadores de la VI:*
    1. Porcentaje de implementación del Módulo Transaccional (%).
    2. Porcentaje de implementación del Módulo de Cobros y Caja (%).
    3. Porcentaje de implementación del Módulo de Business Intelligence (%).
    4. Porcentaje de implementación del Módulo de Inteligencia Artificial (%).
- **Variable Dependiente (VD):**
  - *Definición Nominal:* Optimización de los procesos operativos y financieros en Impresos Trujillo E.I.R.L.
  - *Indicadores de la VD (Cuantitativos, medibles en Pretest y Postest):*
    1. Tiempo promedio de emisión y registro de órdenes de trabajo (minutos).
    2. Tasa de extravío u omisión de órdenes de trabajo (%).
    3. Tasa de órdenes de trabajo entregadas con saldos pendientes no liquidados (%).
    4. Tiempo medio de consolidación de reportes de cierre de caja diario (minutos).
    5. Frecuencia de incidentes de desabastecimiento de insumos críticos de imprenta (días de paro por rotura de stock).

### 4.2 Pregunta Problema Canónica:
> ¿De qué manera la implementación de un sistema web transaccional con módulos de inteligencia de negocios e inteligencia artificial optimiza los procesos operativos y financieros en Impresos Trujillo E.I.R.L.?

### 4.3 Hipótesis General:
> La implementación de un sistema web transaccional con módulos de inteligencia de negocios e inteligencia artificial optimiza significativamente los procesos operativos y financieros en Impresos Trujillo E.I.R.L.

### 4.4 Objetivos del Proyecto:
- **Objetivo General:**
  - Implementar un sistema web transaccional con módulos de inteligencia de negocios e inteligencia artificial para optimizar los procesos operativos y financieros en Impresos Trujillo E.I.R.L.
- **Objetivos Específicos (OE):**
  - *OE1 (Transaccional - Emisión):* Digitalizar el registro y seguimiento de órdenes de trabajo mediante un módulo transaccional para reducir el tiempo promedio de atención al cliente.
  - *OE2 (Transaccional - Caja y Cobros):* Controlar la recaudación y liquidación de pagos mediante un módulo de caja con candado digital para eliminar las entregas de pedidos con saldos impagos.
  - *OE3 (Transaccional - Inventario):* Controlar el consumo y disponibilidad de insumos de imprenta mediante reglas de descuento automatizadas para prevenir roturas de stock.
  - *OE4 (Inteligencia de Negocios):* Analizar la productividad y rentabilidad operativa mediante cuadros de mando e informes de Business Intelligence para optimizar la toma de decisiones gerenciales.
  - *OE5 (Inteligencia Artificial):* Predecir la demanda de insumos críticos de impresión mediante un modelo de aprendizaje automático para optimizar la planificación mensual de compras.

---

## 5. LÍMITES DE ALCANCE Y STACK TECNOLÓGICO INMUTABLES

### 5.1 Lo que el Sistema SÍ Incluye:
1. Módulo Transaccional: clientes, catálogo con recetas de insumos, emisión digital de órdenes de trabajo (talonario virtual tipo Contrato/Proforma con N° correlativo), control de consumo de insumos por orden, cobros en efectivo/Yape/transferencia, y arqueo de caja segregado (Imprenta vs Gigantografías).
2. Módulo de Business Intelligence (BI): Dashboards gerenciales (ventas, saldos pendientes, productividad por operario, insumos más consumidos) y exportación nativa a Excel (.xlsx).
3. Módulo de Inteligencia Artificial (IA): Modelo de series temporales/regresión para predicción mensual de demanda de materiales críticos (lona, vinil, papel autocopiativo) y detección de consumos atípicos.

### 5.2 Lo que el Sistema NO Incluye (Límites Estrictos):
1. **NO facturación electrónica directa vía API SUNAT.** La empresa emite comprobantes formales en el Portal SUNAT Clave SOL. El sistema genera órdenes y comprobantes de control interno informativo.
2. **NO aplicaciones móviles nativas (Android/iOS).** El sistema es una aplicación web responsive accesible vía navegador.
3. **NO pasarela de pagos con débito bancario en línea.** La conciliación de pagos electrónicos se realiza mediante carga y verificación de capturas/comprobantes.
4. **NO módulos de recursos humanos, asistencia biométrica ni cálculo de planillas de sueldos (SUNAFIL).**
5. **NO gestión de compras ni emisión de transferencias bancarias directas a proveedores.**

### 5.3 Stack Tecnológico Aprobado:
- **Frontend:** Angular 21 (SPA, TypeScript, TailwindCSS / CSS modular). Maquetación directa en código (SIN Figma).
- **Backend:** FastAPI (Python 3.11+, Pydantic v2, SQLAlchemy 2 async).
- **Base de Datos:** PostgreSQL nativo en contenedor Docker (SIN Supabase ni servicios SaaS cerrados).
- **Despliegue e Infraestructura:** VPS particular propio Ubuntu 24.04 con Docker Compose y Nginx Reverse Proxy (SIN Google Cloud Run). CI/CD con GitHub Actions.

---

## 6. REGLAS DOCENTES INCORPORADAS Y PROHIBICIONES

1. **Gestión de Riesgos:**
   - **PROHIBIDO:** Colocar como riesgos la inexperiencia, falta de conocimiento, atraso personal, o errores del equipo de estudiantes. Un profesional jamás le dice al cliente: *"Hay riesgo de que me equivoque porque soy estudiante"*.
   - **PERMITIDO Y OBLIGATORIO:** Riesgos operacionales de la empresa (resistencia al cambio del personal, fallas en la red eléctrica local de Trujillo, cortes de internet simétrico de la empresa, demoras en la validación por carga comercial del cliente).
2. **Participación Institucional del Docente:**
   - **PROHIBIDO:** Colocar al docente como miembro del gobierno del proyecto, miembro del equipo de desarrollo, decisor de cambios o juez experto para validación de instrumentos. El docente es evaluador académico externo.
3. **Manejo de Conectores:**
   - **PROHIBIDO:** Usar conectores lógicos "Y" en objetivos o nombres de entregables que fusionen dos conceptos en uno (ej. *"diseñar y desarrollar"* o *"backend y frontend"*). Cada entregable y cada objetivo debe representar una sola unidad clara.
4. **Respeto a las Plantillas:**
   - Se replican con exactitud milimétrica las etiquetas de las tablas, encabezados y textos guía de la universidad.
   - En la Ficha de Empresa y Datos Generales: las columnas se titulan exactamente `Campo` y `Detalle`.
   - En Requerimientos de Software (IEEE 830): la autenticación y control de accesos se clasifican ESTRICTAMENTE como **Requerimientos No Funcionales (RNF)**, ya que la empresa solicita procesos de negocio reales (emisión de órdenes, liquidación de cobros, control de insumos), no meros formularios de login.
