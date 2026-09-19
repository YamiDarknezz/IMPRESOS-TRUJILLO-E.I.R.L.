# INFORME DE ESTADO DEL PROYECTO

**Proyecto:** Implementación de un sistema web transaccional con módulos de inteligencia de negocios e inteligencia artificial para la optimización de los procesos operativos en la empresa Impresos Trujillo E.I.R.L.
**Fecha de Emisión:** 19/09/2026 | **Revisión:** 1.0 | **Líder de Proyecto:** Gerardo Erick Plasencia Torres

---

## 1. Descripción del Proyecto

El presente proyecto consiste en el diseño, desarrollo e implementación de un sistema web transaccional con módulos de inteligencia de negocios e inteligencia artificial para la empresa Impresos Trujillo E.I.R.L. La solución permitirá gestionar órdenes de trabajo, inventario, cobranzas y reportes, con el objetivo de optimizar los procesos operativos, mejorar el control de la información y apoyar la toma de decisiones dentro de la empresa.

### Sustento del Estado del Proyecto

Durante la Semana 4 se inició el Sprint 1 del proyecto. El equipo avanzó en la configuración del entorno de desarrollo, la implementación de la autenticación de usuarios, el modelado de la base de datos y la construcción de las primeras interfaces del sistema. Las actividades ejecutadas se desarrollaron conforme al cronograma establecido y no afectaron la ruta crítica del proyecto.

---

## 2. Semáforo Global del Proyecto

| Parámetro de Control | Estado Actual | % Cumplimiento | Criterio Metodológico |
|:---|:---:|:---:|:---|
| **Alcance** | **VERDE** | **80.0%** | 4 de 5 actividades de entrega concluidas al 100% (regla binaria docente). |
| **Tiempo** | **VERDE** | **83.3%** | 5 de 6 semanas iniciales ejecutadas en fecha según cronograma. |
| **Costo** | **VERDE** | **93.3%** | Presupuesto planificado: S/ 1,500.00 vs Costo real: S/ 1,400.00 (ahorro S/ 100.00). |

---

## 3. Hitos y Entregables Formales

| Código EDT | ACTIVIDAD | Entregable | Fecha Planeada | Fecha Real | Estado |
|:---:|:---|:---|:---:|:---:|:---|
| **4.1.2** | Priorización del Product Backlog e historias de usuario | Product Backlog formalizado con 10 historias y DoD | 16/09/2026 | 16/09/2026 | **TERMINADO (Aceptado por Marcell Vásquez)** |
| **3.4.1** | Diseño de interfaces de usuario de alta fidelidad | Mockups UI de Login, Cotizador, Kanban y Caja | 17/09/2026 | 17/09/2026 | **TERMINADO (Validado en equipo)** |
| **4.1.1** | Construcción de Módulo Transaccional Base (Seguridad y Auth JWT) | API Auth FastAPI y componente Login Angular 21 | 19/09/2026 | 19/09/2026 | **TERMINADO (Aceptado por Marcell Vásquez)** |
| **4.1.1** | Construcción de Módulo Transaccional Base (Catálogo y Recetas m²) | Fórmulas de consumo de lonas y vinilos en PostgreSQL | 23/09/2026 | Pendiente | **EN PROCESO (Sprint 1)** |
| **4.2.1** | Construcción de Módulo de Cobros, Caja y Business Intelligence | Cotizador dinámico, talonario digital y cierre de caja | 26/09/2026 | Pendiente | **PLANIFICADO (Sprint 2)** |

---

## 4. Anexo 1: Detalle de Validación del Alcance (Regla Binaria del Docente)

> **Nota Académica:** En cumplimiento estricto con la orden del docente, las actividades individuales únicamente admiten valor binario: **100% (completada formalmente)** o **0% (no completada)**.

| ACTIVIDAD | ENTREGABLE | % CUMPLIMIENTO |
|:---|:---|:---:|
| EDT 4.1.2 Priorización del Product Backlog | Product Backlog formalizado con 10 historias y mockups | **100%** |
| EDT 3.4.1 Diseño de interfaces de usuario UI | Prototipos de interfaz de Login, Cotizador, Kanban y Caja | **100%** |
| EDT 4.1.1 Construcción de API de Autenticación JWT | Endpoints REST /auth/login y hashing bcrypt en FastAPI | **100%** |
| EDT 4.1.1 Maquetación de interfaz Login y AuthGuard | Formulario reactivo Angular 21 con guards RBAC activos | **100%** |
| EDT 4.1.1 Parametrización de recetas de insumos por m² | Fórmulas de consumo de lonas y vinilos en base de datos | **0%** |

**Promedio de Cumplimiento del Alcance:** (100% + 100% + 100% + 100% + 0%) / 5 = **80.0%** (Semáforo **VERDE**).

---

## 5. Indicadores de Gestión de Valor Ganado (EVM)

- **Valor Planificado (PV):** S/ 1,500.00
- **Costo Real (AC):** S/ 1,400.00
- **Valor Ganado (EV):** S/ 1,450.00
- **Variación del Cronograma (SV):** EV - PV = **-S/ 50.00**
- **Variación del Costo (CV):** EV - AC = **+S/ 50.00**
- **Índice de Rendimiento del Cronograma (SPI):** EV / PV = **0.97** (En tolerancia operativa >0.95)
- **Índice de Rendimiento del Costo (CPI):** EV / AC = **1.04** (Eficiencia presupuestal favorable >1.00)