# ACTA DE ACEPTACIÓN DE ENTREGABLES (AAE-01)
## Universidad Privada del Norte — Ciclo 2026-II
### Curso: Proyecto Capstone (Aula: 22643421416 | Grupo 2)
### Proyecto: Implementación de un sistema web transaccional con módulos de inteligencia de negocios e inteligencia artificial para la optimización de los procesos operativos y financieros en Impresos Trujillo E.I.R.L.

---

### Metadatos Oficiales del Formato
* **Documento:** Acta de Aceptación de Entregables (AAE-01)
* **Plantilla Base:** `1_Acta de Aceptación de Entregables.docx`
* **Entidad Cliente:** Impresos Trujillo E.I.R.L. (RUC: 20602572952)
* **Dirección de Taller:** Jr. Simón Bolívar 945, Int. 1, Centro Histórico de Trujillo, Perú
* **Fecha de Formalización:** 26 de Septiembre de 2026

---

### TABLA 0: Control de Versiones: Acta de Aceptación de Entregables

| Versión | Estado (Borrador, Revisión, Aprobada) | Elaborada por (Nombre Apellido) | Aprobada por (Nombre Apellido) | Fecha (dd/mm/aaaa) |
|:---:|:---:|:---|:---|:---:|
| **1.0 (AAE-01)** | Aprobada por Gerencia | Gerardo Erick Plasencia Torres (Líder / DevOps) | Ángel Rodríguez Rodríguez (Gerente General) / Marcell Magaly Vásquez Loje (Product Owner) | 26/09/2026 |

---

### TABLA 1: Información General

| Campo | Detalle / Registro Oficial |
|:---|:---|
| **Cliente** | **Impresos Trujillo E.I.R.L. (RUC: 20602572952)**<br>Representada por Ángel Rodríguez Rodríguez (Gerente General) y Marcell Magaly Vásquez Loje (Administradora / Product Owner). |
| **Nombre de la fase** | **Fase 1 (Gestión del Proyecto), Fase 2 (Análisis y Requerimientos) y Fase 3 (Diseño y Arquitectura Inicial)** |
| **Nombre del entregable** | **Paquete Consolidado de Entregables Metodológicos y Técnicos de Evaluación T1 (Semanas 1 a 6)** |
| **Responsable de la ejecución del entregable** | **Gerardo Erick Plasencia Torres (Líder / Full Stack)**<br>Jose Estibb Anhuaman Delgado (Frontend)<br>Jose Diego Rodriguez Vasquez (Backend / IA) |
| **Inicio de la ejecución del entregable** | 22/08/2026 |
| **Término de la ejecución del entregable** | 26/09/2026 |
| **Cantidad de días de ejecución del entregable** | 35 días calendario (25 días laborables efectivos) |
| **Cantidad de horas de ejecución del entregable** | 220 horas hombre de ingeniería acumuladas |
| **Fecha de la reunión de aceptación del entregable** | **26/09/2026** (Reunión técnica presencial en taller: Jr. Simón Bolívar 945 Int. 1, Centro Histórico de Trujillo) |

---

### TABLA 2: Descripción del Entregable

| Descripción del Entregable |
|:---|
| El presente entregable formal consolida y somete a conformidad de la gerencia de **Impresos Trujillo E.I.R.L.** el conjunto integral de productos de gestión, ingeniería de software y artefactos técnicos desarrollados durante el período inicial del proyecto (Semanas 1 a 6 de calendario académico / Semanas 01 a 05 de entregables), comprendiendo:<br><br>1. **Acta de Constitución del Proyecto (AC-01):** Documento fundacional suscrito formalizando objetivos de negocio, alcance operativo delimitado, límites de intervención, gobernabilidad y presupuesto maestro de inversión.<br>2. **Business Case y Evaluación Financiera (BC-01):** Análisis de viabilidad técnica y económica que demuestra la rentabilidad del sistema frente a ERPs comerciales (TIR de 38.6%, VAN de S/ 6,837 y recuperación de capital en 1.1 años).<br>3. **Especificación de Requerimientos de Software (SRS IEEE 830):** Levantamiento exhaustivo de 16 Requerimientos Funcionales de imprenta (RF-01 a RF-16) y Requerimientos No Funcionales de seguridad, disponibilidad y auditoría.<br>4. **Matriz de Consistencia y Estructura de Análisis:** Formulación metodológica con hipótesis científica, diseño pre-experimental ($G: O_1 \rightarrow X \rightarrow O_2$), población censal ($N=125$), muestra ($n=125$) y antecedentes en prosa continua.<br>5. **Estructura de Desglose del Trabajo (EDT) y Cronograma Maestro:** Grafo canónico de 4 niveles con 31 paquetes de trabajo sin conectores "Y" ni paréntesis, y cronograma Gantt valorizado en S/ 5,100.<br>6. **Planes de Gestión del Software:** Plan de Desarrollo de Software (PDS), Matriz de Riesgos (R1 a R7 vinculados a códigos EDT), Matriz RACI MultiRol balanceada y Protocolo de Comunicaciones oficiales.<br>7. **Incremento de Software del Sprint 1 (HU-01):** Arquitectura base contenerizada en Docker Compose local (PostgreSQL 16, FastAPI, Angular 21), servicio de autenticación JWT con hashing bcrypt, endpoints documentados en Swagger y componentes visuales de Login probados. |

---

### TABLA 3: Observaciones Adicionales

| Observaciones Adicionales |
|:---|
| Durante la sesión de revisión técnica y demostración funcional presencial ejecutada en la oficina de la imprenta el 26/09/2026, la administración formuló las siguientes precisiones de conformidad:<br><br>1. **Diseño del Talonario Virtual de Mostrador:** Marcell Magaly Vásquez Loje (Product Owner) validó la arquitectura propuesta y reiteró que la pantalla de emisión de órdenes (HU-03) en Angular 21 debe preservar de forma obligatoria los campos de *"A cuenta"* y *"Saldo"* en la misma disposición del talonario proforma en papel, para garantizar que la transición del personal no altere el ritmo de atención al cliente.<br>2. **Regla del Candado de Cobro:** Se ratificó que el candado digital que impide la entrega física si existe saldo pendiente (HU-04) responde fielmente al principal dolor financiero de la empresa y debe mantenerse como regla no modificable.<br>3. **Aprobación de la Arquitectura Contenerizada:** Ángel Rodríguez Rodríguez (Gerente General) expresó su conformidad con el modelo de desarrollo local en Docker Compose y confirmó que el servidor VPS Linux particular propio se habilitará formalmente en las fases de pre-producción conforme al cronograma.<br>4. **Recepción Conforme:** No se registraron objeciones técnicas de fondo, dándose por subsanadas al 100% las observaciones preliminares de semanas anteriores. |

---

### TABLA 4: Declaración de la Aceptación Formal

| Declaración de la Aceptación Formal |
|:---|
| Mediante este documento se deja constancia que el entregable **Paquete Consolidado de Entregables Metodológicos y Técnicos de Evaluación T1 (Semanas 1 a 6)** ejecutado por **Gerardo Erick Plasencia Torres, Jose Estibb Anhuaman Delgado y Jose Diego Rodriguez Vasquez** ha sido aceptado y aprobado por **Impresos Trujillo E.I.R.L. (representada por Ángel Rodríguez Rodríguez y Marcell Magaly Vásquez Loje)**; de este modo queda constancia que se da por terminado satisfactoriamente el entregable y se autoriza la prosecución del cronograma hacia el Sprint 2 de desarrollo. |

---

### TABLA 5: En Caso de Aprobación: Firma de Aceptación del Entregable
*(Aprobación del representante del cliente y equipo)*

| Nombre | Cargo | Fecha | Firma |
|:---|:---|:---:|:---:|
| **Ángel Rodríguez Rodríguez** | Gerente General / Project Sponsor<br>Impresos Trujillo E.I.R.L. | 26/09/2026 | _____________________________ <br>*(Firma y Sello Gerencial)* |
| **Marcell Magaly Vásquez Loje** | Administradora General / Product Owner<br>Impresos Trujillo E.I.R.L. | 26/09/2026 | _____________________________ <br>*(Firma de Conformidad)* |
| **Gerardo Erick Plasencia Torres** | Líder de Proyecto / Scrum Master<br>Grupo 2 — Proyecto Capstone UPN | 26/09/2026 | _____________________________ <br>*(Firma de Entrega Técnica)* |

---

### TABLA 6: En Caso de Rechazo: Firma de Rechazo del Entregable
*(Rechazo del representante del cliente)*

| Nombre | Cargo | Fecha | Motivo del Rechazo | Medida Correctiva Sugerida | Firma |
|:---:|:---:|:---:|:---:|:---:|:---:|
| — | — | — | *NO APLICA*<br>(Entregable Aprobado por la Gerencia) | *NO APLICA* | — |
