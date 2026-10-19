# ACTA DE ACEPTACIÓN DE ENTREGABLES (AAE-02)
## Universidad Privada del Norte — Ciclo 2026-II
### Curso: Proyecto Capstone (Aula: 22643421416 | Grupo 2)
### Proyecto: Implementación de un sistema web transaccional con módulos de inteligencia de negocios e inteligencia artificial para la optimización de los procesos operativos y financieros en Impresos Trujillo E.I.R.L.

---

### Metadatos Oficiales del Formato
* **Documento:** Acta de Aceptación de Entregables (AAE-02)
* **Plantilla Base:** `1_Acta de Aceptación de Entregables.docx`
* **Entidad Cliente:** Impresos Trujillo E.I.R.L. (RUC: 20602572952)
* **Dirección de Taller:** Jr. Simón Bolívar 945, Int. 1, Centro Histórico de Trujillo, Perú
* **Fecha de Formalización:** 03 de Octubre de 2026

---

### TABLA 0: Control de Versiones: Acta de Aceptación de Entregables

| Versión | Estado (Borrador, Revisión, Aprobada) | Elaborada por (Nombre Apellido) | Aprobada por (Nombre Apellido) | Fecha (dd/mm/aaaa) |
|:---:|:---:|:---|:---|:---:|
| **2.0 (AAE-02)** | Aprobada por Gerencia | Gerardo Erick Plasencia Torres (Líder / DevOps) | Ángel Rodríguez Rodríguez (Gerente General) / Marcell Magaly Vásquez Loje (Product Owner) | 03/10/2026 |

---

### TABLA 1: Información General

| Campo | Detalle / Registro Oficial |
|:---|:---|
| **Cliente** | **Impresos Trujillo E.I.R.L. (RUC: 20602572952)**<br>Representada por Ángel Rodríguez Rodríguez (Gerente General) y Marcell Magaly Vásquez Loje (Administradora / Product Owner). |
| **Nombre de la fase** | **Fase 4 (Construcción del Sistema Web, Transcripción de Boletas y Práctica de Campo 1)** |
| **Nombre del entregable** | **Paquete Consolidado de Entregables de Práctica de Campo 1 y Transcripción Digital de Boletas** |
| **Responsable de la ejecución del entregable** | **Gerardo Erick Plasencia Torres (Líder / Full Stack)**<br>Jose Estibb Anhuaman Delgado (Frontend)<br>Jose Diego Rodriguez Vasquez (Backend / IA) |
| **Inicio de la ejecución del entregable** | 28/09/2026 |
| **Término de la ejecución del entregable** | 03/10/2026 |
| **Cantidad de días de ejecución del entregable** | 6 días calendario (5 días laborables efectivos) |
| **Cantidad de horas de ejecución del entregable** | 55 horas hombre de ingeniería acumuladas en la semana |
| **Fecha de la reunión de aceptación del entregable** | **03/10/2026** (Reunión técnica presencial en taller: Jr. Simón Bolívar 945 Int. 1, Centro Histórico de Trujillo) |

---

### TABLA 2: Descripción del Entregable

| Descripción del Entregable |
|:---|
| El presente entregable formal (AAE-02) somete a conformidad de la gerencia de **Impresos Trujillo E.I.R.L.** los productos de ingeniería de software, análisis de calidad y digitalización de datos desarrollados durante el período del 28/09/2026 al 03/10/2026 (Semana 07 de calendario universitario / Semana 06 de entregables), acreditando el cumplimiento de los hitos de la **Práctica de Campo 1 (Avance mínimo del 30% del software implementado)**:<br><br>1. **Dataset Estructurado de 125 Boletas Históricas Normalizadas:** Transcripción, tabulación y limpieza de datos del lote de boletas físicas, talonarios proforma y órdenes de trabajo anteriores en papel entregados por la administración, estructurando medidas ($L \times A$), acabados, importes, anticipos, saldos y medios de pago para alimentar el Dashboard analítico de BI (HU-09) y el entrenamiento del modelo de IA (HU-10).<br>2. **Componente de Talonario Virtual en Angular 21 (HU-03):** Formulario reactivo para mostrador con selección de productos, cálculo automático de metros cuadrados con demasía perimétrica de taller y visualización destacada de casillas de *"A cuenta"* y *"Saldo"*.<br>3. **API Transaccional de Pagos y Candado Digital en FastAPI (HU-04):** Servicios backend que registran amortizaciones de pago e impiden de forma estricta el cambio de estado de una orden a "Entregado" si `saldo_pendiente > 0.00`.<br>4. **Informe de Métricas de Calidad de Software ISO/IEC 25010:** Evaluación formal de completitud funcional, tiempo medio de respuesta de API, usabilidad en terminales de mostrador y fiabilidad de contenedores Docker.<br>5. **Entorno Docker Compose Local Operativo:** Contenedores de base de datos relacional PostgreSQL 16 y backend FastAPI activos en red interna de taller con persistencia en volúmenes locales. |

---

### TABLA 3: Observaciones Adicionales

| Observaciones Adicionales |
|:---|
| Durante la sesión de inspección presencial y revisión técnica ejecutada en la planta de la imprenta el 03/10/2026, la administración de la empresa formuló las siguientes precisiones de conformidad:<br><br>1. **Validación del Dataset Histórico de Boletas:** Marcell Magaly Vásquez Loje (Product Owner) auditó la transcripción de las 125 órdenes físicas y validó que las fórmulas de cálculo de metraje cuadrado ($\text{m}^2$) aplicadas en el dataset coinciden con los consumos reales observados en el taller de máquinas.<br>2. **Inspección del Candado Digital de Cobro:** Ángel Rodríguez Rodríguez (Gerente General) presenció la prueba en vivo del mecanismo de bloqueo en FastAPI, comprobando que el sistema rechaza exitosamente el despacho si una orden mantiene saldo impago, aprobando la lógica transaccional implementada.<br>3. **Pruebas en Terminal de Mostrador:** Se constató la fluidez de carga del formulario de emisión de órdenes en la computadora de ventanilla, cumpliendo con el tiempo objetivo menor a 3 minutos.<br>4. **Conformidad Absoluta:** La gerencia otorga su aprobación unánime sin observaciones de rechazo, autorizando la continuación hacia el siguiente ciclo de desarrollo. |

---

### TABLA 4: Declaración de la Aceptación Formal

| Declaración de la Aceptación Formal |
|:---|
| Mediante este documento se deja constancia que el entregable **Paquete Consolidado de Entregables de Práctica de Campo 1 y Transcripción Digital de Boletas** ejecutado por **Gerardo Erick Plasencia Torres, Jose Estibb Anhuaman Delgado y Jose Diego Rodriguez Vasquez** ha sido aceptado y aprobado por **Impresos Trujillo E.I.R.L. (representada por Ángel Rodríguez Rodríguez y Marcell Magaly Vásquez Loje)**; de este modo queda constancia que se da por terminado satisfactoriamente el entregable y se autoriza la prosecución del cronograma de ingeniería. |

---

### TABLA 5: En Caso de Aprobación: Firma de Aceptación del Entregable
*(Aprobación del representante del cliente y equipo)*

| Nombre | Cargo | Fecha | Firma |
|:---|:---|:---:|:---:|
| **Ángel Rodríguez Rodríguez** | Gerente General / Project Sponsor<br>Impresos Trujillo E.I.R.L. | 03/10/2026 | _____________________________ <br>*(Firma y Sello Gerencial)* |
| **Marcell Magaly Vásquez Loje** | Administradora General / Product Owner<br>Impresos Trujillo E.I.R.L. | 03/10/2026 | _____________________________ <br>*(Firma de Conformidad)* |
| **Gerardo Erick Plasencia Torres** | Líder de Proyecto / Scrum Master<br>Grupo 2 — Proyecto Capstone UPN | 03/10/2026 | _____________________________ <br>*(Firma de Entrega Técnica)* |

---

### TABLA 6: En Caso de Rechazo: Firma de Rechazo del Entregable
*(Rechazo del representante del cliente)*

| Nombre | Cargo | Fecha | Motivo del Rechazo | Medida Correctiva Sugerida | Firma |
|:---:|:---:|:---:|:---:|:---:|:---:|
| — | — | — | *NO APLICA*<br>(Entregable Aprobado por la Gerencia) | *NO APLICA* | — |
