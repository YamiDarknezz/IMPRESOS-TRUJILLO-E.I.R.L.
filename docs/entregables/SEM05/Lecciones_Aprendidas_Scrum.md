# FORMATO DE LECCIONES APRENDIDAS — SCRUM

**Registro de aprendizajes obtenidos durante los eventos del marco Scrum (Sprint Planning, Daily Scrum, Sprint Review, Sprint Retrospective)**

---

## Información General del Proyecto y Sesión

| Campo | Detalle Operativo y Metodológico |
|:---|:---|
| **Proyecto:** | Implementación de un sistema web transaccional con módulos de inteligencia de negocios e inteligencia artificial para la optimización de los procesos operativos en la empresa Impresos Trujillo E.I.R.L. |
| **Sprint Nº / Período:** | **Sprint 2** (Semana 5: del 21/09/2026 al 26/09/2026) |
| **Fecha de Sesión:** | **26/09/2026** *(Cierre de Sprint 2 y suscripción de Acta de Aceptación)* |
| **Scrum Master:** | Gerardo Erick Plasencia Torres (Líder de Proyecto / Full Stack) |
| **Product Owner:** | Marcell Magaly Vásquez Loje (Gerente de Administración / Contraparte del Negocio) |
| **Equipo de Desarrollo:** | Gerardo Erick Plasencia Torres, Jose Estibb Anhuaman Delgado, Jose Diego Rodríguez Vásquez |

---

## Registro de Lecciones Aprendidas

| Nº | Evento Scrum | Lección Aprendida | Causa Raíz (5 Porqués / Diagnóstico) | Acción de Mejora (Compromiso Concreto para Sprint 3) |
|:---:|:---|:---|:---|:---|
| **1** | **Sprint Planning** | La estimación y diseño de historias que gestionan inventario fraccionado (rollos continuos UV DTF de 100m y planchas MDF de 2.44x1.22m) exige modelar y aislar la capa relacional de base de datos antes de comprometer interfaces web. | En el Sprint 1 se intentó programar formularios web sin contar con las tablas relacionales de piezas y consumos, lo que ocasionó retrabajos en frontend y aplazamiento de tareas de recetas. | Establecer como criterio del Definition of Ready (DoR) que ninguna historia de inventario o catálogo inicie maquetación sin contar previamente con sus modelos SQLAlchemy y migración Alembic probada. |
| **2** | **Daily Scrum** *(Día 3)* | La definición temprana de contratos de API REST (esquemas Pydantic y endpoints OpenAPI) entre backend y frontend previene discrepancias de nomenclatura y cuellos de botella de integración. | Diego y Gerardo emplearon nombres divergentes para los campos de cortes (`metros_consumidos` vs `longitud_corte`), generando un bloqueo de integración de 24h que requirió refactorización. | Formalizar los contratos de datos en Swagger UI / OpenAPI previo al desarrollo y validar los endpoints mediante pruebas unitarias en pytest antes de conectar los servicios de Angular. |
| **3** | **Daily Scrum** *(Día 5)* | La ejecución de pruebas automatizadas en pipelines de CI/CD para entornos headless (GitHub Actions en Linux) requiere ejecutores ligeros desacoplados del entorno gráfico del sistema operativo. | Angular 21 por defecto requería paquetes gráficos de Chromium/Karma no disponibles en el contenedor de CI, provocando fallos en el flujo de integración continua sobre Node 22. | Se configuró Vitest como runner nativo de pruebas en Angular 21, logrando ejecutar 281 pruebas unitarias en frontend sin requerir browser headless y consolidando una suite total de 374 pruebas automatizadas (93 backend + 281 frontend) integradas al pipeline de GitHub Actions. |
| **4** | **Sprint Review** | En ambientes de producción rápida de imprenta, la interfaz debe incorporar retroalimentación cromática de alto contraste (semáforos rojo/verde) para alertar sobre deudas pendientes de cobro. | La vista inicial de pedidos presentaba badges monocromáticos en escala de grises, obligando al cajero a leer montos en lugar de identificar visualmente de inmediato las órdenes con saldo. | Implementar alertas visuales condicionales de alto contraste en el listado de pedidos para el Sprint 3: rojo brillante para saldos deudores y verde para pedidos cancelados al 100%. |
| **5** | **Sprint Retrospective** | La automatización del pipeline de despliegue continuo (CD) mediante GitHub Actions y SSH hacia el servidor VPS propio erradica el riesgo operativo de copias manuales e inconsistencias de variables `.env`. | Las transferencias manuales de archivos zip o sincronizaciones dispares en semanas previas causaban discrepancias entre el entorno local de desarrollo y el servidor de pruebas. | Todo incremento funcional debe integrarse y desplegarse exclusivamente a través de los workflows automatizados de GitHub Actions tras validar que el 100% de los tests unitarios pasen en verde. |
| **6** | **Sprint Retrospective** | Para erradicar fugas reales de dinero por comprobantes adulterados ("Yape falso"), el sistema debe articular la auditoría de caja con el bloqueo físico inmediato de la entrega (Candado Digital). | En el taller se detectó que clientes exhibían capturas falsas de transferencias bancarias y retiraban los trabajos antes de que la administración pudiera conciliar los abonos en cuenta. | Implementar la regla de negocio estricta RN-04: al observar o anular un pago en el módulo de caja, el sistema descuenta de inmediato el monto del arqueo y reactiva el Candado Digital de entrega. |

---

## Instrucciones de Uso

- **Evento Scrum:** Indica en qué ceremonia o rito del marco de trabajo surgió el aprendizaje (Sprint Planning, Daily Scrum, Sprint Review, Sprint Retrospective).
- **Causa raíz:** Describe objetivamente el motivo determinante del hallazgo, empleando análisis causal (técnica de los 5 Porqués).
- **Acción de mejora:** Establece un compromiso concreto, accionable y verificable a incorporar formalmente en el backlog del siguiente ciclo (Sprint 3).
