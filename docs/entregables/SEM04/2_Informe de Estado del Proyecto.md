# INFORME DE ESTADO DEL PROYECTO

**Proyecto:** Implementacin de un sistema web transaccional con mdulos de inteligencia de negocios e inteligencia artificial para la optimizacin de los procesos operativos en la empresa Impresos Trujillo E.I.R.L.
**Fecha de Emisin:** 19/09/2026 | **Revisin:** 1.0 | **Lder de Proyecto:** Gerardo Erick Plasencia Torres

---

## 1. Descripcin del Proyecto

El presente proyecto comprende la implementacin de un sistema web integral diseado para la empresa Impresos Trujillo E.I.R.L., enfocado en sistematizar el flujo operativo comercial mediante un cotizador paramtrico con recetas de insumos por m, gestin de rdenes de trabajo con talonario digital correlativo, control de produccin en taller grfico mediante tablero visual, candado digital de despacho con validacin de saldo cero, control de ingresos en mostrador segregado por turnos y dashboards analticos con algoritmos de apoyo al reabastecimiento mensual; sustentado en una arquitectura distribuida basada en Angular 21, FastAPI, PostgreSQL 17 nativo en Docker y operacin local sin despliegues tempranos.

---

## 2. Semforo Global del Proyecto

| Parmetro de Control | Estado Actual | % Cumplimiento | Criterio Metodolgico |
|:---|:---:|:---:|:---|
| **Alcance** | **VERDE** | **80.0%** | 4 de 5 actividades de entrega concluidas al 100% (regla binaria docente). |
| **Tiempo** | **VERDE** | **83.3%** | 5 de 6 semanas iniciales ejecutadas en fecha segn cronograma. |
| **Costo** | **VERDE** | **93.3%** | Presupuesto planificado: S/ 1,500.00 vs Costo real: S/ 1,400.00 (ahorro S/ 100.00). |

---

## 3. Hitos y Entregables Formales

| Cdigo EDT | ACTIVIDAD | Entregable | Fecha Planeada | Fecha Real | Estado |
|:---:|:---|:---|:---:|:---:|:---|
| **4.1.2** | Priorizacin del Product Backlog e historias de usuario | Product Backlog formalizado con 10 historias y DoD | 16/09/2026 | 16/09/2026 | **TERMINADO (Aceptado por Marcell Vsquez)** |
| **3.4.1** | Diseo de interfaces de usuario de alta fidelidad | Mockups UI de Login, Cotizador, Kanban y Caja | 17/09/2026 | 17/09/2026 | **TERMINADO (Validado en equipo)** |
| **4.1.1** | Construccin de Mdulo Transaccional Base (Seguridad y Auth JWT) | API Auth FastAPI y componente Login Angular 21 | 19/09/2026 | 19/09/2026 | **TERMINADO (Aceptado por Marcell Vsquez)** |
| **4.1.1** | Construccin de Mdulo Transaccional Base (Catlogo y Recetas m) | Frmulas de consumo de lonas y vinilos en PostgreSQL | 23/09/2026 | Pendiente | **EN PROCESO (Sprint 1)** |
| **4.2.1** | Construccin de Mdulo de Cobros, Caja y Business Intelligence | Cotizador dinmico, talonario digital y cierre de caja | 26/09/2026 | Pendiente | **PLANIFICADO (Sprint 2)** |

---

## 4. Anexo 1: Detalle de Validacin del Alcance (Regla Binaria del Docente)

> **Nota Acadmica:** En cumplimiento estricto con la orden del docente, las actividades individuales nicamente admiten valor binario: **100% (completada formalmente)** o **0% (no completada)**.

| ACTIVIDAD | ENTREGABLE | % CUMPLIMIENTO |
|:---|:---|:---:|
| EDT 4.1.2 Priorizacin del Product Backlog | Product Backlog formalizado con 10 historias y mockups | **100%** |
| EDT 3.4.1 Diseo de interfaces de usuario UI | Prototipos de interfaz de Login, Cotizador, Kanban y Caja | **100%** |
| EDT 4.1.1 Construccin de API de Autenticacin JWT | Endpoints REST /auth/login y hashing bcrypt en FastAPI | **100%** |
| EDT 4.1.1 Maquetacin de interfaz Login y AuthGuard | Formulario reactivo Angular 21 con guards RBAC activos | **100%** |
| EDT 4.1.1 Parametrizacin de recetas de insumos por m | Frmulas de consumo de lonas y vinilos en base de datos | **0%** |

**Promedio de Cumplimiento del Alcance:** (100% + 100% + 100% + 100% + 0%) / 5 = **80.0%** (Semforo **VERDE**).

---

## 5. Indicadores de Gestin de Valor Ganado (EVM)

- **Valor Planificado (PV):** S/ 1,500.00
- **Costo Real (AC):** S/ 1,400.00
- **Valor Ganado (EV):** S/ 1,450.00
- **Variacin del Cronograma (SV):** EV - PV = **-S/ 50.00**
- **Variacin del Costo (CV):** EV - AC = **+S/ 50.00**
- **ndice de Rendimiento del Cronograma (SPI):** EV / PV = **0.97** (En tolerancia operativa >0.95)
- **ndice de Rendimiento del Costo (CPI):** EV / AC = **1.04** (Eficiencia presupuestal favorable >1.00)