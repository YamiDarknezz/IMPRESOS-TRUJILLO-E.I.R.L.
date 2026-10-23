# INFORME DE ESTADO DEL PROYECTO (v3.0)
## Implementación de un sistema web transaccional con módulos de inteligencia de negocios e inteligencia artificial para la optimización de los procesos operativos y financieros en Impresos Trujillo E.I.R.L.

---

### Registro de Revisión

| Revisión | Fecha | Modificaciones | Autor |
|:---:|:---:|:---|:---|
| **1.0** | 19/09/2026 | Emisión inicial del Informe de Estado del Proyecto (Sprint 1, corte al 19/09/2026) | Gerardo Erick Plasencia Torres (Líder / DevOps) |
| **2.0** | 26/09/2026 | Segundo Informe de Estado del Proyecto (Cierre formal T1, corte al 26/09/2026) | Gerardo Erick Plasencia Torres (Líder / DevOps) |
| **3.0** | 03/10/2026 | Tercer Informe de Estado del Proyecto (Práctica de Campo 1, corte al 03/10/2026) | Gerardo Erick Plasencia Torres (Líder / DevOps) |
| **3.1** | 03/10/2026 | Validación ejecutiva en taller y aprobación formal con Acta de Aceptación (AAE-02) | Marcell Magaly Vásquez Loje (Product Owner) / Ángel Rodríguez Rodríguez (Gerente General) |

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
| **VERDE (80.0% Cumplimiento)** | **VERDE (83.3% En Plazo)** | **VERDE (92.6% Presupuestado / CPI 1.08)** |

#### Explicaciones:
* **Respecto al Alcance (VERDE - 80.0%):** El indicador se calculó mediante la media ponderada del cumplimiento binario (regla estricta de cátedra: 100% o 0%, donde una actividad no culminada formalmente no genera avance parcial) de las 5 actividades técnicas y de campo evaluadas durante la semana del 28/09/2026 al 03/10/2026 (ver Anexo 1, Tabla 3):
  $$\text{Alcance Promedio} = \frac{100\% + 100\% + 100\% + 100\% + 0\%}{5} = 80.0\%$$
  Cuatro de las cinco actividades planificadas para el hito de Práctica de Campo 1 fueron concluidas al 100% con entregables formales aprobados por el cliente (EDT 4.2.1 Transcripción y normalización digital del dataset de 125 boletas físicas, EDT 5.1.2 Informe de Métricas de Calidad de Software ISO/IEC 25010, EDT 4.1.2 Desarrollo de API transaccional de cobros y candado digital en FastAPI, y EDT 1.3.1 Emisión del Informe de Estado v3.0). La actividad EDT 4.1.2.b (Servicio de Arqueo Dual de Caja con segregación contable de ingresos de imprenta y gigantografías) se computa formalmente al 0% por regla binaria al encontrarse en fase de integración técnica para entrega en el siguiente ciclo. Al situarse en 80.0%, supera el umbral mínimo del 75.0% (Anexo 2, Tabla 6), asignándole semáforo **VERDE**.

* **Respecto al Tiempo (VERDE - 83.3%):** El indicador se determinó evaluando la relación entre los días laborables hombre culminados estrictamente dentro del cronograma previsto frente al total de días planificados para las actividades evaluadas durante el ciclo semanal (ver Anexo 1, Tabla 4):
  $$\text{Eficiencia de Tiempo} = \frac{10\text{ días en plazo}}{12\text{ días planificados}} \times 100\% = 83.33\%$$
  Cuatro actividades se completaron puntualmente en sus duraciones de 2 y 3 días. Se registró un desfase operativo menor de 1 día durante el proceso de transcripción de boletas físicas debido a escritura manual borrosa en ítems de acabados gráficos, el cual fue resuelto y absorbido mediante una sesión presencial con Marcell Vásquez (PO) sin alterar la fecha límite de corte del período (03/10/2026). Al ubicarse en 83.3% ($\ge 75.0\%$), el semáforo clasifica en **VERDE**, respaldado por un $SPI = 0.98$.

* **Respecto al Costo (VERDE - 92.6%):** El indicador se calculó mediante el cociente directo entre el Costo Real Incurrido (AC) y el Valor Planificado presupuestado (PV) para las actividades del período (ver Anexo 1, Tabla 5):
  $$\text{Rendimiento de Costo} = \frac{\text{Costo Real (AC)}}{\text{Valor Planificado (PV)}} = \frac{\text{S/ } 1,250.00}{\text{S/ } 1,350.00} = 92.59\%$$
  El costo real ejecutado por el equipo asciende a S/ 1,250.00 frente a un presupuesto planificado de S/ 1,350.00, logrando un ahorro favorable de S/ 100.00 (7.41% de economía). Conforme a la escala oficial (Anexo 2, Tabla 8), al ser el costo real menor al 100% de lo presupuestado, el semáforo corresponde a **VERDE**, respaldado por un $CPI = 1.08$.

#### Sustento del Estado del Proyecto:
* **Sustento del Alcance:** Durante el período del 28/09 al 03/10/2026, el equipo completó el procesamiento y estructuración del lote de 125 boletas físicas y contratos proforma entregados por la administración de la imprenta, conformando el dataset normalizado que servirá como insumo fundamental para el entrenamiento del modelo de IA (HU-10) y la analítica de BI (HU-09). Asimismo, se implementaron los endpoints del candado digital en FastAPI (`/api/v1/payments/verify-lock`), garantizando la imposibilidad de despacho si persiste saldo pendiente impago, lo que acredita un avance de software funcional del 35%, superando el umbral del 30% requerido para la Práctica de Campo 1.
* **Sustento del Tiempo:** Las labores de digitalización en oficina y codificación se desarrollaron en estrecha coordinación. La entrega y demostración en las instalaciones de la imprenta se ejecutó el 03/10/2026, cumpliendo los plazos acordados con la gerencia, manteniéndose un $SPI = 0.98$.
* **Sustento del Costo:** La ejecución presupuestal comprendió 55 horas efectivas de ingeniería entre los tres integrantes (Gerardo Plasencia: 19h, Jose Estibb Anhuaman: 18h, Jose Diego Rodríguez: 18h a razón de S/ 20.00/h = S/ 1,100.00). Dentro del costo real se justifica de manera explícita la depreciación semanal de 3 computadoras portátiles de desarrollo (S/ 50.00 por equipo por la semana = S/ 150.00) y consumibles/conectividad asumidos por el equipo técnico, alcanzándose un $CPI = 1.08$.

#### Cambios principales ocurridos desde el último reporte emitido:
No aplica. No se han producido solicitudes de cambio que alteren la línea base de alcance, cronograma ni presupuesto aprobados en el Acta de Constitución y el diccionario EDT.

---

### 2. Trabajo planificado para la siguiente semana

Para el siguiente período de trabajo (Semana 08 de calendario universitario / SEM07 / Monitoreo de Avance 1, período del 05/10 al 10/10/2026), se ha planificado la ejecución de las siguientes actividades:
1. **Desarrollo de Vistas y Endpoints de Business Intelligence (EDT 4.1.1 y 4.1.2):** Construcción de endpoints analíticos de ventas agregadas en FastAPI y tableros gerenciales en Angular 21 con visualización de márgenes por producto gráfico.
2. **Feature Engineering y Preprocesamiento del Dataset de IA (EDT 4.2.2):** Selección de variables de series temporales, rezagos de ventas ($t-1$, $t-2$) y tendencias mensuales para alimentar el algoritmo predictivo de sustratos.
3. **Consolidación del Servicio de Arqueo Dual de Caja:** Integración de la vista de cierre de jornada con desglose entre imprenta y gigantografías y exportación tabular en formato compatible con Excel 2021 LTSC.
4. **Presentación de Evidencias de Software en Clase:** Demostración ante el docente de los workflows de GitHub Actions, logs de Docker Compose y suites de pruebas automatizadas con pytest.
5. **Emisión del Informe de Estado del Proyecto v4.0:** Reporte semanal de seguimiento y registro de Daily Scrums.

---

### 3. Mejoras o cambios pendientes

* **Control de Alcance:** Sin alteraciones no autorizadas.
* **Mejoras Operativas Registradas:** Durante las pruebas en mostrador con Marcell Vásquez (PO), se solicitó que al ingresar el cliente mediante autocompletado de RUC, el sistema muestre en pantalla una alerta si dicho cliente tiene órdenes anteriores pendientes de recojo en taller, para evitar acumulación de pedidos en el área de acabado. Esta mejora fue incorporada al backlog de refinamiento de la historia HU-02.

---

### 4. Hitos y entregables del proyecto (Semana Actual y Siguiente):

#### Hitos de la Semana Evaluada (28/09/2026 al 03/10/2026):
* **Hito 1 (29/09/2026):** Culminación de la transcripción de las 125 boletas físicas manuales de imprenta.
* **Hito 2 (01/10/2026):** Implementación del candado digital de cobro en backend FastAPI con pruebas unitarias.
* **Hito 3 (02/10/2026):** Elaboración y validación del Informe de Métricas de Calidad ISO/IEC 25010.
* **Hito 4 (03/10/2026):** Demostración presencial en planta del avance funcional del 35% del software.
* **Hito 5 (03/10/2026):** Suscripción presencial del Acta de Aceptación de Entregables (AAE-02) con Ángel Rodríguez.

#### Hitos de la Siguiente Semana Proyectada (05/10/2026 al 10/10/2026):
* **Hito 6 (06/10/2026):** Despliegue de endpoints de agregación de ventas para Business Intelligence en FastAPI.
* **Hito 7 (08/10/2026):** Generación de pipelines de entrenamiento y validación de features para el modelo de IA.
* **Hito 8 (09/10/2026):** Implementación de la vista de arqueo dual de caja con exportación tabular a Excel 2021.
* **Hito 9 (10/10/2026):** Sustentación del Monitoreo de Avance 1 de software ante la cátedra de Capstone.

---

### 5. Indicadores Clave de Desempeño (KPI's)

#### Tiempo — El Proyecto se encuentra alineado con respecto al cronograma (variación marginal controlada):
* **Schedule Variance (SV):** $-\text{S/ } 30.00$ (Variación marginal controlada y absorbida dentro del ciclo).
* **Schedule Performance Index (SPI):** $0.98$ (Eficiencia de cronograma del 98.0%, dentro del rango admisible verde $\ge 0.95$).

#### Costo — El Proyecto está por debajo de lo presupuestado (ahorro operativo favorable):
* **Cost Variance (CV):** $+\text{S/ } 100.00$ (Ahorro presupuestal a favor del proyecto al cierre de semana).
* **Cost Performance Index (CPI):** $1.08$ (Rendimiento del costo superior a la unidad, indicando alta eficiencia en la inversión de recursos).

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
| **1.3.1** | Elaboración de Informes de Estado Semanales | Informe de Estado del Proyecto v3.0 | 03/10/2026 | 03/10/2026 | TERMINADO |
| **1.3.2** | Registro de Daily Scrums del Proyecto | Registro de Daily Scrums Sprint 2 (Semana 2) | 03/10/2026 | 03/10/2026 | TERMINADO |
| **1.3.3** | Gestión de Impedimentos y Desviaciones | Registro de Impedimentos y Desviaciones | 03/10/2026 | 03/10/2026 | TERMINADO |
| **1.4.1** | Gestión de Solicitudes de Control de Cambios | Solicitudes de Control de Cambios | 03/10/2026 | 03/10/2026 | TERMINADO |
| **1.4.2** | Auditoría de Calidad de Entregables | Auditorías de Calidad de Entregables | 10/10/2026 | - | NO INICIADO |
| **2.1.1** | Recolección de Datos de Boletas Físicas | Dataset de Boletas Históricas | 28/08/2026 | 28/08/2026 | TERMINADO |
| **2.1.2** | Entrevistas Operativas de Mostrador y Taller | Registro de Entrevistas Operativas | 28/08/2026 | 28/08/2026 | TERMINADO |
| **2.2.1** | Especificación de Requerimientos SRS IEEE 830 | Especificación SRS IEEE 830 Validada | 28/08/2026 | 28/08/2026 | TERMINADO |
| **2.2.2** | Formulación de la Matriz de Consistencia | Matriz de Consistencia Metodológica | 02/09/2026 | 02/09/2026 | TERMINADO |
| **2.3.1** | Modelado de Procesos de Negocio Actuales | Diagramas de Casos de Uso del Negocio | 04/09/2026 | 04/09/2026 | TERMINADO |
| **2.3.2** | Elaboración de la Matriz de Trazabilidad | Matriz de Trazabilidad de Requisitos | 05/09/2026 | 05/09/2026 | TERMINADO |
| **3.1.1** | Especificación de Arquitectura de Software | Documento de Arquitectura y Docker Compose | 17/09/2026 | 17/09/2026 | TERMINADO |
| **3.1.2** | Especificación OpenAPI Swagger de Servicios | Documentación OpenAPI Swagger de Endpoints | 24/09/2026 | 24/09/2026 | TERMINADO |
| **3.2.1** | Modelado Entidad Relación de Base de Datos | Diagrama Entidad Relación de Base de Datos | 17/09/2026 | 17/09/2026 | TERMINADO |
| **3.2.2** | Creación de Tablas y Restricciones DDL | Script DDL PostgreSQL Ejecutado | 18/09/2026 | 18/09/2026 | TERMINADO |
| **3.3.1** | Elaboración de Prototipos UI en Angular 21 | Prototipos de Pantalla en Angular 21 | 18/09/2026 | 18/09/2026 | TERMINADO |
| **3.3.2** | Definición de Guía de Estilos y Componentes | Guía de Estilos y Componentes UI | 25/09/2026 | 25/09/2026 | TERMINADO |
| **4.1.1** | Desarrollo de API de Órdenes y Clientes | API Transaccional de Órdenes y Clientes | 19/09/2026 | 19/09/2026 | TERMINADO |
| **4.1.2** | Desarrollo de API de Pagos y Arqueo de Caja | API de Arqueo Dual y Candado de Entrega | 03/10/2026 | 03/10/2026 | TERMINADO |
| **4.1.3** | Desarrollo de API de Predicción de Insumos | API de Inferencia Predictiva de Insumos | 24/10/2026 | - | NO INICIADO |
| **4.2.1** | Maquetación de Pantalla de Mostrador | Pantalla de Talonario Virtual de Mostrador | 25/09/2026 | 25/09/2026 | TERMINADO |
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
| **EDT 4.2.1 Transcripción y normalización de 125 boletas físicas** | Dataset estructurado de producción normalizado | 100% |
| **EDT 5.1.2 Evaluación formal de Métricas de Calidad ISO 25010** | Documento oficial de Métricas de Calidad ISO/IEC 25010 | 100% |
| **EDT 4.1.2 API de cobros y mecanismo de candado digital en FastAPI** | Endpoints de pagos y candado de entrega implementados en Swagger | 100% |
| **EDT 1.3.1 Elaboración del Informe de Estado v3.0 (Práctica de Campo 1)** | Informe de Estado v3.0 y evidencias de Práctica de Campo 1 | 100% |
| **EDT 4.1.2.b Servicio de arqueo dual de caja con segregación de ingresos** | Módulo de cierre de caja segregado imprenta y gigantografías | 0% |
| **Cumplimiento Promedio Global del Período** | **5 actividades evaluadas bajo regla binaria estricta** | **80.0%** |

---

#### DETALLE DE VALIDACIÓN DEL TIEMPO

| ACTIVIDAD | DURACIÓN ESTIMADA | DURACIÓN REAL | % CUMPLIMIENTO |
|:---|:---:|:---:|:---:|
| **EDT 4.2.1 Transcripción y normalización de boletas físicas** | 3 días | 3 días | 100.0% |
| **EDT 5.1.2 Evaluación de Métricas de Calidad ISO 25010** | 2 días | 2 días | 100.0% |
| **EDT 4.1.2 API de cobros y candado digital en FastAPI** | 3 días | 3 días | 100.0% |
| **EDT 1.3.1 Elaboración del Informe de Estado v3.0** | 2 días | 2 días | 100.0% |
| **EDT 4.1.2.b Servicio de arqueo dual de caja segregado** | 2 días | 3 días (en curso) | 50.0% |
| **Cumplimiento promedio del Período** | **12 días planificados** | **13 días insumidos** | **83.3%** |

---

#### DETALLE DE VALIDACIÓN DE COSTOS

| ACTIVIDAD | VALOR PLANIFICADO | COSTO REAL |
|:---|:---:|:---:|
| **EDT 4.2.1 Transcripción y normalización de boletas físicas** | S/ 350.00 | S/ 320.00 |
| **EDT 5.1.2 Evaluación de Métricas de Calidad ISO 25010** | S/ 250.00 | S/ 230.00 |
| **EDT 4.1.2 API de cobros y candado digital en FastAPI** | S/ 350.00 | S/ 330.00 |
| **EDT 1.3.1 Elaboración del Informe de Estado v3.0** | S/ 200.00 | S/ 190.00 |
| **EDT 4.1.2.b Servicio de arqueo dual de caja segregado** | S/ 200.00 | S/ 180.00 |
| **TOTAL** | **S/ 1,350.00** | **S/ 1,250.00** |

*Justificación Técnica y Económica del Costo Incurrido:*
1. **Horas Hombre de Ingeniería:** Se consumieron 55 horas efectivas entre los tres desarrolladores (Gerardo Plasencia: 19h = S/ 380.00; Jose Estibb Anhuaman: 18h = S/ 360.00; Jose Diego Rodríguez: 18h = S/ 360.00 a razón de S/ 20.00/hora valorizada = S/ 1,100.00).
2. **Amortización de Hardware y Recursos:** Se justifica numéricamente la amortización semanal de 3 computadoras portátiles de desarrollo (S/ 50.00 por equipo = S/ 150.00) y gastos operativos de conectividad asumidos por el equipo técnico.
3. **Eficiencia Lograda:** La tabulación optimizada del dataset en hojas estructuradas y el uso de librerías nativas de validación permitieron un ahorro neto de S/ 100.00 frente al valor presupuestado ($CPI = 1.08$).

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
