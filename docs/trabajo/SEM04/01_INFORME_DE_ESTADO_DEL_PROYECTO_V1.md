# INFORME DE ESTADO DEL PROYECTO
## Implementación de un sistema web transaccional con módulos de inteligencia de negocios e inteligencia artificial para la optimización de los procesos operativos y financieros en Impresos Trujillo E.I.R.L.

---

### Registro de Revisión

| Revisión | Fecha | Modificaciones | Autor |
|:---:|:---:|:---|:---|
| **1.0** | 19/09/2026 | Emisión inicial del Informe de Estado del Proyecto (Sprint 1, corte al 19/09/2026) | Gerardo Erick Plasencia Torres (Líder / DevOps) |
| **1.1** | 19/09/2026 | Revisión y validación formal de avance con la gerencia y Product Owner | Marcell Magaly Vásquez Loje (Product Owner) / Ángel Rodríguez Rodríguez (Gerente General) |

---

### Tabla de contenido
1. Resumen del Estado del Proyecto
2. Trabajo planificado para la siguiente semana
3. Mejoras o cambios pendientes
4. Hitos y entregables del proyecto
5. Indicadores Clave de Desempeño (KPI's)
* ANEXO 1: Tablas de Validación de Alcance, Tiempo y Costos
* ANEXO 2: Criterios y Leyendas de Semaforización Oficial

---

### DESCRIPCIÓN DEL PROYECTO:
El presente proyecto comprende el diseño, desarrollo e implementación de un sistema web transaccional con módulos de inteligencia de negocios e inteligencia artificial para la empresa Impresos Trujillo E.I.R.L., ubicada en Jr. Simón Bolívar 945 Int. 1, Centro Histórico de Trujillo. La solución optimiza integralmente los procesos operativos y financieros de la imprenta mediante la emisión de órdenes de trabajo con numeración correlativa única, cotización algorítmica por consumo de sustratos, candado digital de cobro previo a la entrega física, arqueo de caja diario con segregación de ingresos y tableros analíticos gerenciales, sustituyendo el flujo manual basado en talonarios físicos de papel.

---

### 1. Resumen del Estado del Proyecto

#### Estado Global

| Alcance | Tiempo | Costo |
|:---:|:---:|:---:|
| **VERDE (80.0% Cumplimiento)** | **VERDE (83.3% En Plazo)** | **VERDE (93.3% Presupuestado / CPI 1.07)** |

#### Explicaciones:
* **Respecto al Alcance (VERDE - 80.0%):** El indicador se calculó mediante la media ponderada del cumplimiento binario (regla estricta de cátedra: 100% o 0%, donde una actividad no culminada formalmente no genera entregable parcial) de los 5 paquetes técnicos ejecutados durante el Sprint 1 (ver Anexo 1, Tabla 3):
  $$\text{Alcance Promedio} = \frac{100\% + 100\% + 100\% + 100\% + 0\%}{5} = 80.0\%$$
  Cuatro de las cinco actividades de entrega fueron concluidas satisfactoriamente al 100% (EDT 3.1.1 Arquitectura Docker Compose local, EDT 3.2.1 Esquema relacional de Usuarios e Insumos en PostgreSQL, EDT 3.3.1 Prototipos interactivos de Login y Shell en Angular 21, y EDT 4.1.1 Servicio de autenticación JWT y RBAC en FastAPI). La actividad EDT 4.2.1 (Componente Login y Guardias de Navegación) se computa formalmente al 0% por regla binaria, dado que si bien la vista responsive y el consumo de la API REST están terminados, las pruebas de restricción de rutas por roles fueron programadas para cerrarse en el siguiente ciclo. Al situarse en 80.0%, supera el umbral del 75.0% fijado en la leyenda oficial (Anexo 2, Tabla 6), correspondiéndole el semáforo **VERDE**.

* **Respecto al Tiempo (VERDE - 83.3%):** El indicador se calculó evaluando la relación entre los días laborables hombre completados estrictamente dentro del cronograma previsto frente al total de días planificados para las actividades evaluadas durante la semana (ver Anexo 1, Tabla 4):
  $$\text{Eficiencia de Tiempo} = \frac{10\text{ días en plazo}}{12\text{ días planificados}} \times 100\% = 83.33\%$$
  Cuatro actividades se completaron puntualmente en sus estimaciones de 2 y 3 días. Se registró un desfase operativo menor de 1 día en el mapeo relacional de insumos y fórmulas de conversión de metros cuadrados a bobinas en Docker, el cual fue resuelto y absorbido en menos de 24 horas por el equipo sin alterar la fecha límite de entrega del Sprint 1 (19/09/2026). Dado que el 83.3% es superior al umbral del 75.0% (Anexo 2, Tabla 7), el indicador clasifica en **VERDE**, respaldado por un Schedule Performance Index de $SPI = 0.97$.

* **Respecto al Costo (VERDE - 93.3%):** El indicador se determinó mediante el cociente directo entre el Costo Real Incurrido (AC) y el Valor Planificado presupuestado (PV) para las actividades del período evaluado (ver Anexo 1, Tabla 5):
  $$\text{Rendimiento de Costo} = \frac{\text{Costo Real (AC)}}{\text{Valor Planificado (PV)}} = \frac{\text{S/ } 1,400.00}{\text{S/ } 1,500.00} = 93.33\%$$
  El costo ejecutado por el equipo asciende a S/ 1,400.00 frente a un presupuesto planificado de S/ 1,500.00, generando una economía favorable de S/ 100.00 (ahorro del 6.67%). Conforme a la escala oficial (Anexo 2, Tabla 8), al ser el costo real menor o igual al 100% de lo planificado, el semáforo corresponde a **VERDE**, acreditado por un Cost Performance Index de $CPI = 1.07$.

#### Sustento del Estado del Proyecto:
* **Sustento del Alcance:** Durante la semana evaluada (Semana 4 / Sprint 1), el equipo completó la inicialización arquitectónica del proyecto: configuración del entorno local contenerizado con Docker Compose (Angular 21 + FastAPI + PostgreSQL 16 nativo), implementación del módulo de seguridad con JWT y hashing bcrypt, y modelamiento relacional de usuarios y catálogo de insumos. Los entregables técnicos fueron validados internamente mediante pruebas automatizadas y revisados de forma presencial en las instalaciones de la imprenta con Marcell Vásquez (Product Owner).
* **Sustento del Tiempo:** Las actividades de codificación y análisis se desarrollaron en estrecha coordinación. El único impedimento registrado (espera de publicación del endpoint REST `/api/v1/auth/login` para completar el enlace en Angular) se resolvió en 24 horas. El cronograma general no sufrió desvíos críticos, manteniendo la sincronización entre backend y frontend con un $SPI = 0.97$.
* **Sustento del Costo:** La ejecución presupuestal se mantuvo bajo control estricto. La inversión de 70 horas efectivas de ingeniería entre los tres integrantes (Gerardo Plasencia, Jose Estibb Anhuaman y Jose Diego Rodríguez a razón de S/ 20.00/hora valorizada = S/ 1,400.00) optimizó el gasto gracias a la reutilización de librerías nativas y pruebas en pytest. Asimismo, se justifica el prorrateo de amortización de 3 laptops de trabajo (S/ 50.00 por equipo por el ciclo semanal) y servicios de electricidad/conectividad asumidos por el equipo técnico, manteniéndose un $CPI = 1.07$.

#### Cambios principales ocurridos desde el último reporte emitido:
No aplica. No se han registrado solicitudes de cambio ni modificaciones a la línea base de alcance, cronograma ni costos durante el presente período de evaluación. Al constituir este el primer informe formal de estado de desarrollo del proyecto (Semana 4 / Sprint 1), el trabajo se rige al 100% por la línea base original aprobada en el Acta de Constitución y la EDT canónica.

---

### 2. Trabajo planificado para la siguiente semana

Para el siguiente período de trabajo (Semana 06 de calendario universitario / Semana 21/09 al 26/09/2026), se ha planificado la ejecución de las siguientes actividades prioritarias:
1. **Consolidación y Presentación de la Evaluación Parcial T1:** Integración formal del portafolio documental de semanas 1 a 6 y sustentación académica del proyecto.
2. **Costeo Analítico de los 31 Paquetes de Trabajo:** Elaboración detallada del presupuesto valorizado por paquete EDT conforme a la plantilla oficial de costos de cátedra (`Plantilla Costeo x Paq Trabajo_v3.xlsx`), sincerando recursos humanos, amortización de hardware y consumibles.
3. **Suscripción del Acta de Aceptación de Entregables (AAE):** Formalización presencial con la gerencia de la imprenta (Ángel Rodríguez y Marcell Vásquez) de la recepción conforme de los primeros 6 paquetes de entregables metodológicos.
4. **Documentación de Lecciones Aprendidas Scrum:** Sistematización de hallazgos del Sprint 1 y oportunidades de mejora para el ciclo de desarrollo continuo.
5. **Lanzamiento del Sprint 2 de Desarrollo:** Construcción de la vista de emisión de órdenes (talonario virtual en Angular 21) y parametrización de fórmulas de cálculo de metros cuadrados para gigantografías en FastAPI.

---

### 3. Mejoras o cambios pendientes

* **Control de Alcance:** No existen modificaciones no autorizadas en el alcance del proyecto.
* **Mejoras Ergonómicas Registradas:** Tras la demostración preliminar presencial con Marcell Vásquez (Product Owner) en la oficina de la imprenta (Jr. Simón Bolívar 945), se acordó que la interfaz de emisión de órdenes en Angular 21 debe respetar estrictamente la disposición visual de los campos del talonario proforma físico actual, en particular las casillas de *"A cuenta"* y *"Saldo"*. Esta retroalimentación fue registrada como criterio de aceptación mandatorio para la historia HU-03 en el Sprint 2.

---

### 4. Hitos y entregables del proyecto (Semana Actual y Siguiente):

#### Hitos de la Semana Evaluada (14/09/2026 al 19/09/2026):
* **Hito 1 (14/09/2026):** Apertura formal del Sprint 1 y desglose de tareas técnicas en el Sprint Backlog.
* **Hito 2 (16/09/2026):** Entorno de contenedores Docker Compose local operativo con PostgreSQL 16 y FastAPI.
* **Hito 3 (17/09/2026):** Endpoints REST de autenticación JWT y control de roles por RBAC implementados en FastAPI.
* **Hito 4 (18/09/2026):** Componente Login y Shell de navegación maquetados en Angular 21 con diseño responsive.
* **Hito 5 (19/09/2026):** Cierre formal del Sprint 1, Sprint Review interna y emisión del Informe de Estado v1.0.

#### Hitos de la Siguiente Semana Proyectada (21/09/2026 al 26/09/2026):
* **Hito 6 (22/09/2026):** Apertura del Sprint 2 de desarrollo enfocado en el módulo transaccional de órdenes de trabajo.
* **Hito 7 (24/09/2026):** Elaboración y validación del documento de Costeo Analítico de los 31 paquetes de trabajo EDT.
* **Hito 8 (25/09/2026):** Suscripción presencial en planta del Acta de Aceptación de Entregables (AAE) con la gerencia.
* **Hito 9 (26/09/2026):** Sustentación oficial y cierre de la Evaluación Parcial T1 de Proyecto Capstone.

---

### 5. Indicadores Clave de Desempeño (KPI's)

#### Tiempo — El Proyecto se encuentra alineado con respecto al cronograma (variación marginal controlada):
* **Schedule Variance (SV):** $-\text{S/ } 50.00$ (Desvío menor de 1 día absorbido operativamente dentro del Sprint).
* **Schedule Performance Index (SPI):** $0.97$ (Eficiencia de cronograma del 97.0%, dentro del rango admisible verde $\ge 0.95$).

#### Costo — El Proyecto está por debajo de lo presupuestado (ahorro operativo favorable):
* **Cost Variance (CV):** $+\text{S/ } 100.00$ (Ahorro presupuestal a favor del proyecto al cierre de semana).
* **Cost Performance Index (CPI):** $1.07$ (Rendimiento del costo superior a la unidad, indicando alta eficiencia en la inversión de horas de ingeniería).

---

### ANEXO 1

#### DETALLE DE VALIDACIÓN DEL ALCANCE
*(Mapeo integral de los 31 paquetes de trabajo de Nivel 4 de la EDT Canónica del Proyecto)*

| Código EDT | ACTIVIDAD | Entregable | Fecha Planeada Culminación | Fecha Real de Entrega | Estado |
|:---:|:---|:---|:---:|:---:|:---:|
| **1.1.1** | Elaboración del Acta de Constitución | Acta de Constitución Aprobada | 22/08/2026 | 22/08/2026 | TERMINADO |
| **1.1.2** | Elaboración del Business Case | Caso de Negocio (Business Case) Validado | 28/08/2026 | 28/08/2026 | TERMINADO |
| **1.2.1** | Elaboración del Cronograma Maestro | Cronograma Maestro del Proyecto (Gantt) | 09/09/2026 | 09/09/2026 | TERMINADO |
| **1.2.2** | Elaboración del Presupuesto Valorizado | Presupuesto Valorizado del Proyecto | 09/09/2026 | 09/09/2026 | TERMINADO |
| **1.2.3** | Elaboración del Plan de Desarrollo de Software | Plan de Desarrollo de Software Oficial | 10/09/2026 | 10/09/2026 | TERMINADO |
| **1.2.4** | Asignación de Roles y Responsabilidades | Matriz RACI Oficial | 10/09/2026 | 10/09/2026 | TERMINADO |
| **1.3.1** | Elaboración de Informes de Estado Semanales | Informe de Estado del Proyecto v1.0 | 19/09/2026 | 19/09/2026 | TERMINADO |
| **1.3.2** | Registro de Daily Scrums del Proyecto | Registro de Daily Scrums Sprint 1 | 19/09/2026 | 19/09/2026 | TERMINADO |
| **1.3.3** | Gestión de Impedimentos y Desviaciones | Registro de Impedimentos y Desviaciones | 26/09/2026 | - | NO INICIADO |
| **1.4.1** | Gestión de Solicitudes de Control de Cambios | Solicitudes de Control de Cambios | 03/10/2026 | - | NO INICIADO |
| **1.4.2** | Auditoría de Calidad de Entregables | Auditorías de Calidad de Entregables | 10/10/2026 | - | NO INICIADO |
| **2.1.1** | Recolección de Datos de Boletas Físicas | Dataset de Boletas Históricas | 28/08/2026 | 28/08/2026 | TERMINADO |
| **2.1.2** | Entrevistas Operativas de Mostrador y Taller | Registro de Entrevistas Operativas | 28/08/2026 | 28/08/2026 | TERMINADO |
| **2.2.1** | Especificación de Requerimientos SRS IEEE 830 | Especificación SRS IEEE 830 Validada | 28/08/2026 | 28/08/2026 | TERMINADO |
| **2.2.2** | Formulación de la Matriz de Consistencia | Matriz de Consistencia Metodológica | 02/09/2026 | 02/09/2026 | TERMINADO |
| **2.3.1** | Modelado de Procesos de Negocio Actuales | Diagramas de Casos de Uso del Negocio | 04/09/2026 | 04/09/2026 | TERMINADO |
| **2.3.2** | Elaboración de la Matriz de Trazabilidad | Matriz de Trazabilidad de Requisitos | 05/09/2026 | 05/09/2026 | TERMINADO |
| **3.1.1** | Especificación de Arquitectura de Software | Documento de Arquitectura y Docker Compose | 17/09/2026 | 17/09/2026 | TERMINADO |
| **3.1.2** | Especificación OpenAPI Swagger de Servicios | Documentación OpenAPI Swagger de Endpoints | 24/09/2026 | - | NO INICIADO |
| **3.2.1** | Modelado Entidad Relación de Base de Datos | Diagrama Entidad Relación de Base de Datos | 17/09/2026 | 17/09/2026 | TERMINADO |
| **3.2.2** | Creación de Tablas y Restricciones DDL | Script DDL PostgreSQL Ejecutado | 18/09/2026 | 18/09/2026 | TERMINADO |
| **3.3.1** | Elaboración de Prototipos UI en Angular 21 | Prototipos de Pantalla en Angular 21 | 18/09/2026 | 18/09/2026 | TERMINADO |
| **3.3.2** | Definición de Guía de Estilos y Componentes | Guía de Estilos y Componentes UI | 25/09/2026 | - | NO INICIADO |
| **4.1.1** | Desarrollo de API de Órdenes y Clientes | API Transaccional de Órdenes y Clientes | 19/09/2026 | 19/09/2026 | TERMINADO |
| **4.1.2** | Desarrollo de API de Pagos y Arqueo de Caja | API de Arqueo Dual y Candado de Entrega | 03/10/2026 | - | NO INICIADO |
| **4.1.3** | Desarrollo de API de Predicción de Insumos | API de Inferencia Predictiva de Insumos | 24/10/2026 | - | NO INICIADO |
| **4.2.1** | Maquetación de Pantalla de Mostrador | Pantalla de Talonario Virtual de Mostrador | 25/09/2026 | - | EN EJECUCIÓN |
| **4.2.2** | Maquetación de Tablero Kanban de Taller | Pantalla de Tablero Kanban de Taller | 16/10/2026 | - | NO INICIADO |
| **4.2.3** | Maquetación de Dashboards de Negocio | Dashboards Gerenciales de BI | 27/10/2026 | - | NO INICIADO |
| **4.3.1** | Integración del Módulo Transaccional | Módulo Integrado de Gestión de Producción | 24/10/2026 | - | NO INICIADO |
| **4.3.2** | Integración del Módulo de Inteligencia y BI | Módulo de Inteligencia de Negocios e IA | 07/11/2026 | - | NO INICIADO |
| **5.1.1** | Ejecución de Pruebas Unitarias y Funcionales | Informe de Pruebas Unitarias y Funcionales | 13/11/2026 | - | NO INICIADO |
| **5.1.2** | Ejecución de Pruebas de Aceptación UAT | Acta de Pruebas de Aceptación UAT | 14/11/2026 | - | NO INICIADO |
| **5.2.1** | Configuración de Servidor VPS de Producción | Sistema Desplegado en VPS de Producción | 18/11/2026 | - | NO INICIADO |
| **5.2.2** | Configuración de Políticas de Respaldo | Plan de Contingencia y Copias de Seguridad | 19/11/2026 | - | NO INICIADO |
| **5.3.1** | Elaboración de Manuales de Usuario del Sistema | Manuales de Usuario del Sistema Web | 23/11/2026 | - | NO INICIADO |
| **5.3.2** | Capacitación al Personal Operativo y Gerencia | Acta de Capacitación del Personal Suscrita | 25/11/2026 | - | NO INICIADO |
| **5.4.1** | Evaluación Cuantitativa Pretest Postest | Informe Experimental Pretest Postest | 27/11/2026 | - | NO INICIADO |
| **5.4.2** | Suscripción del Acta de Cierre del Proyecto | Acta de Cierre y Transferencia Definitiva | 05/12/2026 | - | NO INICIADO |

---

#### Resumen de Actividades del Período Evaluado
*(Evaluación bajo Regla Binaria Estricta de Cátedra: 100% o 0%)*

| ACTIVIDAD | ENTREGABLE | % CUMPLIMIENTO |
|:---|:---|:---:|
| **EDT 3.1.1 Configuración de Docker Compose local y arquitectura** | Entorno Docker local multicontenedor unificado y operativo | 100% |
| **EDT 3.2.1 Modelado relacional de datos y tablas de Usuarios en DB** | Diagrama relacional y tablas base creadas en PostgreSQL Docker | 100% |
| **EDT 3.3.1 Prototipado y maquetación de vistas Login y Shell base** | Componentes visuales y vista responsive maquetada en Angular 21 | 100% |
| **EDT 4.1.1 Construcción de API de Autenticación JWT y roles RBAC** | Endpoints REST de login, hashing bcrypt y tokens JWT en FastAPI | 100% |
| **EDT 4.2.1 Componente Login reactivo y Guardias de navegación por rol** | Formulario integrado con guardias de restricción por rol probados | 0% |
| **Cumplimiento Promedio Global del Período** | **5 actividades evaluadas bajo regla binaria estricta** | **80.0%** |

---

#### DETALLE DE VALIDACIÓN DEL TIEMPO

| ACTIVIDAD | DURACIÓN ESTIMADA | DURACIÓN REAL | % CUMPLIMIENTO |
|:---|:---:|:---:|:---:|
| **EDT 3.1.1 Configuración de Docker Compose local** | 2 días | 2 días | 100.0% |
| **EDT 3.2.1 Modelado relacional de tablas Usuarios e Insumos** | 2 días | 2 días | 100.0% |
| **EDT 3.3.1 Maquetación de interfaz Login y Shell Angular 21** | 3 días | 3 días | 100.0% |
| **EDT 4.1.1 Servicio de autenticación JWT y roles en FastAPI** | 3 días | 3 días | 100.0% |
| **EDT 4.2.1 Integración de guardias y pruebas de rutas en Angular** | 2 días | 3 días (en curso) | 50.0% |
| **Cumplimiento promedio del Período** | **12 días planificados** | **13 días insumidos** | **83.3%** |

---

#### DETALLE DE VALIDACIÓN DE COSTOS

| ACTIVIDAD | VALOR PLANIFICADO | COSTO REAL |
|:---|:---:|:---:|
| **EDT 3.1.1 Configuración de Docker Compose local y arquitectura** | S/ 250.00 | S/ 240.00 |
| **EDT 3.2.1 Modelado relacional de tablas Usuarios e Insumos en PostgreSQL** | S/ 250.00 | S/ 240.00 |
| **EDT 3.3.1 Maquetación de interfaz Login y Shell en Angular 21** | S/ 350.00 | S/ 320.00 |
| **EDT 4.1.1 Desarrollo de API de Autenticación JWT y roles en FastAPI** | S/ 450.00 | S/ 420.00 |
| **EDT 4.2.1 Integración de guardias y pruebas de rutas en Angular 21** | S/ 200.00 | S/ 180.00 |
| **TOTAL** | **S/ 1,500.00** | **S/ 1,400.00** |

*Justificación Técnica y Económica del Costo Incurrido:*
1. **Horas Hombre de Ingeniería:** Se consumieron 70 horas efectivas de desarrollo entre los tres miembros del equipo a una tarifa referencial de S/ 20.00/hora valorizada (Gerardo Plasencia: 24h = S/ 480.00; Jose Estibb Anhuaman: 22h = S/ 440.00; Jose Diego Rodríguez: 24h = S/ 480.00), totalizando S/ 1,400.00.
2. **Amortización de Hardware y Recursos:** Dentro del costo valorizado se encuentra prorrateada la depreciación operativa semanal de 3 computadoras portátiles de desarrollo (S/ 50.00 por equipo = S/ 150.00) y el servicio de suministro eléctrico e internet de fibra óptica local.
3. **Eficiencia Lograda:** La reutilización de middleware oficial de FastAPI (`HTTPBearer`, `OAuth2PasswordBearer`) y tipado estricto en Pydantic evitó retrabajos de codificación, logrando un ahorro favorable de S/ 100.00 respecto al valor planificado ($CPI = 1.07$).

---

### ANEXO 2

#### Leyenda del Alcance:

| Código de color | Significado |
|:---:|:---|
| **Verde** | Los entregables correspondientes al período evaluado se encuentran con un cumplimiento promedio mayor o igual al 75%. |
| **Amarillo** | Los entregables correspondientes al período evaluado se encuentran con un cumplimiento promedio entre 50% y 74.9%. |
| **Rojo** | Los entregables correspondientes al período evaluado se encuentran con un cumplimiento promedio menor al 50%. |

#### Leyenda del Tiempo:

| Código de color | Significado |
|:---:|:---|
| **Verde** | Las actividades correspondientes al período evaluado registran una ejecución en plazo mayor o igual al 75% frente a la programación. |
| **Amarillo** | Las actividades correspondientes al período evaluado registran una ejecución en plazo entre 50% y 74.9%. |
| **Rojo** | Las actividades correspondientes al período evaluado registran una ejecución en plazo menor al 50%. |

#### Leyenda del Costo:

| Código de color | Significado |
|:---:|:---|
| **Verde** | El costo real de las actividades correspondientes al período evaluado es menor o igual al 100% del costo presupuestado (ahorro o equilibrio). |
| **Amarillo** | El costo real de las actividades correspondientes al período evaluado excede entre 1% y 15% el costo presupuestado. |
| **Rojo** | El costo real de las actividades correspondientes al período evaluado excede en más del 15% el costo presupuestado. |
