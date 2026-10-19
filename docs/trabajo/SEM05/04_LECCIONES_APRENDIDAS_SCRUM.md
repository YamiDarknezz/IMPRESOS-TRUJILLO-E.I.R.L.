# FORMATO DE LECCIONES APRENDIDAS — SCRUM
## Universidad Privada del Norte — Ciclo 2026-II
### Curso: Proyecto Capstone (Aula: 22643421416 | Grupo 2)
### Proyecto: Implementación de un sistema web transaccional con módulos de inteligencia de negocios e inteligencia artificial para la optimización de los procesos operativos y financieros en Impresos Trujillo E.I.R.L.

---

### Metadatos y Encabezado del Formato Oficial
* **Registro de aprendizajes obtenidos durante los eventos del marco Scrum (Sprint Planning, Daily, Sprint Review, Retrospectiva)**
* **Plantilla Base:** `Lecciones_Aprendidas_Scrum.pdf`
* **Proyecto:** Implementación de un sistema web transaccional con módulos de inteligencia de negocios e inteligencia artificial para la optimización de los procesos operativos y financieros en Impresos Trujillo E.I.R.L.
* **Sprint Nº:** Sprint 1 — Inicialización de Arquitectura Docker Compose, Autenticación JWT, Modelado Relacional y Digitalización Operativa
* **Fecha:** 26 de Septiembre de 2026
* **Scrum Master:** Gerardo Erick Plasencia Torres
* **Product Owner:** Marcell Magaly Vásquez Loje

---

### Registro de Lecciones Aprendidas

| Nº | Evento Scrum | Lección aprendida | Causa raíz (Técnica de los 5 Porqués) | Acción de mejora (Compromiso Sprint 2) |
|:---:|:---|:---|:---|:---|
| **1** | **Sprint Planning 1** | La estimación de esfuerzo para el catálogo de insumos (HU-02) fue insuficiente al no contemplar la complejidad del cálculo de merma y demasías en sustratos gráficos. | **¿Por qué?** Se estimó como un CRUD simple de productos.<br>**¿Por qué?** No se analizó el flujo de taller.<br>**¿Por qué?** El equipo desconocía que el ripeo de lonas exige 5 cm de borde perimétrico.<br>**¿Por qué?** No se consultó a los operarios de máquinas.<br>**Causa raíz:** Falta de participación técnica de los maquinistas en la sesión de estimación. | Incorporar formalmente a los operarios de taller (Alexis y Aldair) en el refinamiento técnico de historias que afecten la producción y el corte. |
| **2** | **Daily Scrum**<br>*(Día 3)* | El desarrollo de frontend quedó temporalmente bloqueado durante 24 horas a la espera de la publicación definitiva del endpoint de inicio de sesión. | **¿Por qué?** Frontend no podía conectar el formulario.<br>**¿Por qué?** El backend cambió los nombres de los atributos JSON.<br>**¿Por qué?** No existía un contrato OpenAPI cerrado previamente.<br>**¿Por qué?** Se codificó primero la lógica interna en FastAPI.<br>**Causa raíz:** Incumplimiento del principio API-First en el diseño de interfaces de comunicación. | Adoptar un enfoque API-First riguroso: diseñar y validar primero la especificación OpenAPI Swagger y generar mocks JSON para desacoplar el desarrollo de Angular. |
| **3** | **Daily Scrum**<br>*(Día 4)* | La transcripción de boletas físicas manuales evidenció un alto número de datos incompletos (teléfonos no registrados, dimensiones sin unidad de medida explícita). | **¿Por qué?** El llenado manual en mostrador es apresurado.<br>**¿Por qué?** No existen validaciones de formato en papel.<br>**¿Por qué?** Las vendedoras anotan sólo lo indispensable para despachar.<br>**Causa raíz:** Inexistencia de campos obligatorios en el proceso manual tradicional. | Diseñar la interfaz de emisión de órdenes en Angular con validaciones reactivas estrictas que impidan guardar pedidos sin teléfono del cliente o dimensiones numéricas. |
| **4** | **Sprint Review 1** | El Product Owner solicitó que la vista web de órdenes emule visualmente el talonario físico, destacando de forma visible los casilleros de "A cuenta" y "Saldo". | **¿Por qué?** La primera propuesta de UI usaba un diseño genérico de ecommerce.<br>**¿Por qué?** No resultaba familiar para el personal de mostrador.<br>**¿Por qué?** Generaría fricción y retrasos en la atención rápida en ventanilla.<br>**Causa raíz:** Desconexión visual inicial entre la propuesta digital y la cultura operativa de la imprenta. | Maquetar el componente del talonario virtual en Angular 21 replicando fielmente la estructura matricial de la boleta/proforma física actual de la empresa. |
| **5** | **Sprint Retrospective 1** | Se logró una cobertura de pruebas automatizadas del 84% en backend con pytest, pero no se implementaron pruebas unitarias para los componentes de Angular 21. | **¿Por qué?** El tiempo del sprint se agotó.<br>**¿Por qué?** Se priorizó el acabado visual y estilos CSS responsive.<br>**¿Por qué?** No se incluyó la suite de pruebas de frontend en la Definition of Done.<br>**Causa raíz:** Criterios de aceptación asimétricos entre las disciplinas de frontend y backend. | Actualizar la Definition of Done (DoD) exigiendo un mínimo de cobertura del 75% en pruebas unitarias de componentes para todo entregable de Angular en el Sprint 2. |
| **6** | **Sprint Retrospective 1** | Las reuniones de coordinación presenciales en las instalaciones de la imprenta (Jr. Bolívar 945) demostraron ser significativamente más efectivas que los mensajes digitales. | **¿Por qué?** Las dudas sobre los tipos de acabados (ojillos, termosellado, laminado) se resolvieron viendo los materiales físicos en vivo.<br>**¿Por qué?** La terminología técnica de imprenta varía entre operarios y clientes.<br>**Causa raíz:** Ambigüedad semántica inherente a los procesos industriales gráficos. | Mantener un protocolo de al menos una visita técnica presencial semanal en planta con el Product Owner para validaciones de entregables y demostraciones de software. |

---

### Instrucciones de Uso y Compromisos de Gestión:
* **Evento Scrum:** Se especifica con exactitud la ceremonia ágil en la que se identificó el hallazgo (Planning, Daily, Review, Retrospectiva).
* **Causa Raíz:** Aplicación sistemática del método de los *5 Porqués* para evitar diagnósticos superficiales y culpas individuales.
* **Acción de Mejora:** Compromiso operativo medible asumido por el equipo técnico para su ejecución inmediata en el Sprint 2.
