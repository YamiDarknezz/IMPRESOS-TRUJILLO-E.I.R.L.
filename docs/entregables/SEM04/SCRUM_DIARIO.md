# SCRUM DIARIO — SPRINT 1 (SEMANA 04)

**PROYECTO:** Implementación de un sistema web transaccional con módulos de inteligencia de negocios e inteligencia artificial para la optimización de los procesos operativos en la empresa Impresos Trujillo E.I.R.L.

**PERÍODO:** Semana 4 (Sprint 1: 14/09/2026 al 19/09/2026) | Entorno: Desarrollo Local en Docker (Sin despliegue en esta fase; VPS particular en semana 11)

---

| SPRINT / DÍA | HACER (To Do) | EN ESPERA (On Hold) | HACIENDO (In Progress) | TERMINADO (Done) |
|:---|:---|:---|:---|:---|
| **Sprint 1 — Día 1<br>(Lunes 14/09/2026)** | • [T-03] Configuración de Docker Compose para entorno local (Angular 21 + FastAPI + PostgreSQL nativo). (Gerardo)<br>• [T-04] Modelamiento de tablas relacionales de Usuarios y Roles en PostgreSQL Docker. (Diego)<br>• [T-05] Maquetación inicial de estructura HTML/CSS de Login en Angular 21. (Estibb)<br>• [T-06] Implementación de servicio de autenticación JWT y hashing bcrypt en FastAPI. (Diego) | Sin impedimentos operativos en el primer día de sprint. | • [T-01] Sprint Planning 1: Desglose de historias de usuario (HU-01, HU-02) en tareas técnicas. (Gerardo, Estibb, Diego)<br>• [T-02] Inicialización de repositorio GitHub y configuración de ramas (main, develop). (Gerardo) | • [T-01] Sprint Planning 1: Desglose formalizado en el Product Backlog y Sprint Backlog. (Equipo)<br>• [T-02] Repositorio GitHub inicializado con estructura de ramas. (Gerardo) |
| **Sprint 1 — Día 2<br>(Martes 15/09/2026)** | • [T-05] Maquetación de interfaz y formulario reactivo de Login en Angular 21. (Estibb)<br>• [T-06] Implementación de servicio de autenticación JWT y hashing bcrypt en FastAPI. (Diego)<br>• [T-07] Integración del formulario de Login con API REST. (Estibb)<br>• [T-08] Modelamiento relacional de tablas de Insumos y Recetas por m² en PostgreSQL Docker. (Diego) | Sin impedimentos activos. | • [T-03] Configuración de Docker Compose para entorno local unificado (FastAPI, PostgreSQL, Angular). (Gerardo)<br>• [T-04] Modelamiento y creación de tablas relacionales de Usuarios y Roles en PostgreSQL Docker. (Diego) | • [T-03] Entorno Docker Compose local completamente operativo para todo el equipo. (Gerardo)<br>• [T-04] Esquema relacional de tablas de Usuarios y Roles aplicado en PostgreSQL Docker. (Diego) |
| **Sprint 1 — Día 3<br>(Miércoles 16/09/2026)** | • [T-07] Integración del formulario de Login con API REST y gestión de sesión JWT. (Estibb)<br>• [T-09] Creación de Angular AuthGuard para protección de rutas según rol (RBAC). (Estibb)<br>• [T-10] Pruebas unitarias de endpoints de autenticación con pytest en backend. (Diego) | • [T-07] Esperando culminación del endpoint REST /api/v1/auth/login para integración HTTP directa en Angular. (Estibb) | • [T-05] Maquetación de vista de Login con estilos CSS nativos, validación de campos y diseño responsive. (Estibb)<br>• [T-06] Implementación de servicio de autenticación JWT y endpoints de login en FastAPI. (Diego)<br>• [T-08] Modelamiento relacional de tablas de Insumos y Recetas por m² en PostgreSQL Docker. (Diego) | • [T-05] Maquetación de interfaz y componentes visuales de Login aprobada técnicamente. (Estibb)<br>• [T-08] Tablas relacionales de Insumos y Recetas migradas en PostgreSQL Docker (base de HU-02). (Diego) |
| **Sprint 1 — Día 4<br>(Jueves 17/09/2026)** | • [T-09] Creación de Angular AuthGuard para protección de rutas según rol (RBAC). (Estibb)<br>• [T-10] Pruebas unitarias de endpoints de autenticación con pytest en backend. (Diego) | Sin bloqueos (Impedimento de T-07 resuelto con la publicación del endpoint de login). | • [T-05/T-07] Integración completa de la maquetación de Login con el servicio de autenticación REST en Angular 21. (Estibb)<br>• [T-06] Culminación de endpoints de autenticación JWT y roles en FastAPI. (Diego)<br>• [T-10] Pruebas unitarias de endpoints de autenticación con pytest en backend. (Diego) | • [T-05] Maquetación responsive de Login y Shell base: 100% CULMINADA E INTEGRADA A HECHO (Done) en Angular 21. (Estibb)<br>• [T-06] Servicio de autenticación JWT y endpoints de login concluidos en FastAPI. (Diego)<br>• [T-07] Componente interactivo de Login consumiendo API REST con almacenamiento seguro de token JWT en HECHO (Done). (Estibb)<br>• [T-10] Suite de pruebas unitarias pytest para autenticación y usuarios con 84% de cobertura. (Diego) |
| **Sprint 1 — Día 5<br>(Viernes 18/09/2026)**<br>*Cierre de Desarrollo* | • Preparación de material de demostración funcional para la sesión de clase del sábado.<br>• Registro de tareas técnicas en proceso y deuda técnica para traslado a Sprint 2. | Sin impedimentos. Entorno de desarrollo local validado para la presentación académica. | • [T-09] Implementación de Angular AuthGuard y restricción de navegación por roles RBAC. (Estibb)<br>• Verificación técnica funcional interna en Docker local de los criterios de DoD para HU-01 (Maquetación + API + Roles). (Equipo) | • [T-05/T-09] Maquetación responsive y Guards de navegación por rol plenamente operativos e integrados en HECHO (Done). (Estibb)<br>• Verificación técnica interna en Docker local completada con éxito. Cierre del ciclo de codificación de Sprint 1. (Equipo) |
| **Sprint 1 — Día 6<br>(Sábado 19/09/2026)**<br>*Sprint Review en Clase* | • [T-11] Parametrización de catálogo de insumos y recetas por m² en interfaz web (HU-02 para Sprint 2).<br>• [T-12] Implementación de pruebas unitarias de componentes en Angular (Deuda técnica Sprint 2).<br>• [T-13] Configuración de pipeline CI/CD en GitHub Actions (Deuda técnica Sprint 2).<br>• [T-14] Refinamiento de Product Backlog para Sprint 2 (Cotizador y Talonario Digital HU-03, HU-04). | Cero impedimentos al cierre del Sprint 1. Tareas no críticas trasladadas planificadamente al Sprint 2. | • Presentación del incremento de software funcional (HU-01: Maquetación, Auth y Roles) en sesión de clase ante el docente.<br>• Sprint Retrospective y traspaso formal de tareas técnicas al backlog del Sprint 2. | • Incremento de software de autenticación, maquetación y roles validado y presentado ante el docente en clase.<br>• Cierre formal del ciclo de desarrollo conforme a la Definition of Done para HU-01 (3 SP devengados).<br>• Deuda técnica (CI/CD, pruebas de componentes y recetas en interfaz) programada para Sprint 2. |

---

### Resumen y Métricas de Cierre del Sprint 1

- **Total de tareas técnicas planificadas:** 14 tareas.
- **Tareas completadas satisfactoriamente en desarrollo (HECHO / Done):** 10 tareas (71.4% de avance técnico):
  1. *[T-01] Sprint Planning 1 y desglose técnico.*
  2. *[T-02] Inicialización de repositorio GitHub y estrategia de ramas.*
  3. *[T-03] Configuración de entorno local Docker Compose (FastAPI, Angular 21, PostgreSQL).*
  4. *[T-04] Modelado y migración de tablas relacionales de Usuarios y Roles en PostgreSQL.*
  5. *[T-05] Maquetación responsive de interfaz de Login y Shell base en Angular 21 (100% en HECHO).*
  6. *[T-06] Servicio de autenticación JWT y hashing seguro bcrypt en FastAPI.*
  7. *[T-07] Integración interactiva de Login consumiendo API REST con token seguro (100% en HECHO).*
  8. *[T-08] Modelo relacional de tablas de Insumos y Recetas métricas en PostgreSQL Docker.*
  9. *[T-09] Guards de navegación por rol (RBAC) en Angular 21 (bloqueo efectivo a no autorizados).*
  10. *[T-10] Suite de pruebas unitarias pytest para autenticación y usuarios con 84% de cobertura.*
- **Tareas trasladadas / en proceso para Sprint 2:** 4 tareas:
  1. *[T-11] Interfaz gráfica de parametrización de catálogo de insumos y recetas por m² (HU-02).*
  2. *[T-12] Suites de pruebas unitarias para componentes en Angular (deuda técnica).*
  3. *[T-13] Configuración de pipeline CI/CD en GitHub Actions (deuda técnica).*
  4. *[T-14] Refinamiento de Product Backlog para Sprint 2 (Cotizador y Talonario Digital HU-03, HU-04).*
- **Gestión de impedimentos:** 1 impedimento técnico registrado en el Día 3 (espera del endpoint de login) y resuelto en el Día 4.
- **Historias de Usuario cubiertas:**
  - **HU-01 (Autenticación y RBAC):** **100% Terminada** (3 SP completados y aceptados en Sprint Review).
  - **HU-02 (Catálogo y recetas de insumos):** **En Proceso** (base de datos relacional modelada y migrada en PostgreSQL Docker; interfaz gráfica de parametrización dinámica trasladada a Sprint 2).
- **Story Points devengados:** **3 SP** (de 8 SP del Sprint 1).
- **Entorno y Despliegue:** 100% Desarrollo local en Docker. **Sin despliegue en esta fase**; el despliegue al servidor **VPS particular propio** se realizará en la entrega final de la Semana 11.
