# INFORME DE ESTADO DEL PROYECTO (v2.0)
## Implementación de un sistema web transaccional con módulos de inteligencia de negocios e inteligencia artificial para la optimización de los procesos operativos y financieros en Impresos Trujillo E.I.R.L.

---

### Registro de Revisión

| Revisión | Fecha | Modificaciones | Autor |
|:---:|:---:|:---|:---|
| **1.0** | 19/09/2026 | Emisión inicial del Informe de Estado del Proyecto (Sprint 1, corte al 19/09/2026) | Gerardo Erick Plasencia Torres (Líder / DevOps) |
| **2.0** | 26/09/2026 | Segundo Informe de Estado del Proyecto (Cierre formal T1, Sprint 2 inicial, corte al 26/09/2026) | Gerardo Erick Plasencia Torres (Líder / DevOps) |
| **2.1** | 26/09/2026 | Revisión ejecutiva y aprobación de conformidad con el Acta de Aceptación (AAE-01) | Marcell Magaly Vásquez Loje (Product Owner) / Ángel Rodríguez Rodríguez (Gerente General) |

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
| **VERDE (83.3% Cumplimiento)** | **VERDE (83.3% En Plazo)** | **VERDE (92.9% Presupuestado / CPI 1.08)** |

#### Explicaciones:
* **Respecto al Alcance (VERDE - 83.3%):** El indicador se calculó mediante la media ponderada del cumplimiento binario (regla estricta de cátedra: 100% o 0%, donde una actividad no culminada formalmente no genera avance parcial) de las 6 actividades técnicas y de gestión evaluadas durante la semana del 21/09 al 26/09/2026 (ver Anexo 1, Tabla 3):
  $$\text{Alcance Promedio} = \frac{100\% + 100\% + 100\% + 100\% + 100\% + 0\%}{6} = 83.33\%$$
  Cinco de las seis actividades planificadas para el cierre de la Evaluación T1 y arranque del Sprint 2 fueron concluidas al 100% con entregables formales aprobados (EDT 1.3.1 Informes de Estado v1 y v2, EDT 1.3.2 Registro de Daily Scrums, EDT 3.1.2 Especificación OpenAPI Swagger, EDT 3.3.2 Guía de estilos y componentes UI Angular 21, y EDT 4.2.1 Maquetación de la pantalla de mostrador del talonario virtual). La actividad EDT 4.1.2 (Desarrollo de API de Pagos y Arqueo de Caja) se computa formalmente al 0% por regla binaria al encontrarse en desarrollo activo sus endpoints transaccionales para entrega en el Sprint 2 avanzado. Al situarse en 83.3%, supera holgadamente el umbral mínimo del 75.0% (Anexo 2, Tabla 6), asignándole semáforo **VERDE**.

* **Respecto al Tiempo (VERDE - 83.3%):** El indicador se determinó evaluando la relación entre los días laborables hombre culminados estrictamente dentro del cronograma previsto frente al total de días planificados para las actividades evaluadas durante el ciclo semanal (ver Anexo 1, Tabla 4):
  $$\text{Eficiencia de Tiempo} = \frac{10\text{ días en plazo}}{12\text{ días planificados}} \times 100\% = 83.33\%$$
  Cinco actividades se entregaron en sus plazos asignados de 2 días hombre. Se registró un desfase menor de 1 día en la sincronización de contratos JSON entre los modelos Pydantic de FastAPI y los componentes reactivos de Angular 21, el cual fue absorbido dentro de la holgura del Sprint sin comprometer la entrega de la Evaluación T1. Al ubicarse en 83.3% ($\ge 75.0\%$), el semáforo clasifica en **VERDE**, respaldado por un $SPI = 0.98$.

* **Respecto al Costo (VERDE - 92.9%):** El indicador se calculó mediante el cociente directo entre el Costo Real Incurrido (AC) y el Valor Planificado presupuestado (PV) para las actividades del período (ver Anexo 1, Tabla 5):
  $$\text{Rendimiento de Costo} = \frac{\text{Costo Real (AC)}}{\text{Valor Planificado (PV)}} = \frac{\text{S/ } 1,300.00}{\text{S/ } 1,400.00} = 92.86\%$$
  El costo real insumido por el equipo asciende a S/ 1,300.00 frente a un presupuesto previsto de S/ 1,400.00, logrando un saldo positivo a favor de S/ 100.00 (ahorro del 7.14%). Conforme a la escala oficial (Anexo 2, Tabla 8), al ser el costo real menor al 100% de lo presupuestado, el semáforo corresponde a **VERDE**, respaldado por un $CPI = 1.08$.

#### Sustento del Estado del Proyecto:
* **Sustento del Alcance:** Durante el presente ciclo (Semana 06 Universidad / SEM05), el equipo consolidó la totalidad de los entregables académicos y técnicos de la Evaluación Parcial T1, formalizó la recepción conforme mediante la suscripción del Acta de Aceptación de Entregables (AAE-01) con Ángel Rodríguez y Marcell Vásquez, y completó el costeo analítico integral de los 31 paquetes EDT. En el frente técnico, se culminó la documentación OpenAPI Swagger y la maquetación responsive del talonario virtual en Angular 21, reflejando un avance equilibrado entre ingeniería y gestión.
* **Sustento del Tiempo:** Las actividades de integración y redacción de informes se desarrollaron de manera sincronizada. La entrega formal de artefactos a la empresa se cumplió el 26/09/2026, fecha acordada en el cronograma maestro, manteniéndose un $SPI = 0.98$.
* **Sustento del Costo:** La ejecución de horas de ingeniería se mantuvo en 65 horas efectivas acumuladas entre los tres integrantes (Gerardo Plasencia: 23h, Jose Estibb Anhuaman: 21h, Jose Diego Rodríguez: 21h a S/ 20.00/h = S/ 1,300.00). Dentro de este monto se justifica la amortización prorrateada de 3 computadoras portátiles de trabajo (S/ 50.00 por equipo = S/ 150.00) y gastos de conectividad asumidos por el equipo, alcanzándose un $CPI = 1.08$.

#### Cambios principales ocurridos desde el último reporte emitido:
En el presente período se formalizó la retroalimentación operativa de Marcell Magaly Vásquez Loje (Product Owner), acordando que la interfaz del talonario virtual en Angular 21 incluya de forma obligatoria los campos destacados de *"A cuenta"* y *"Saldo"* replicando el diseño del talonario físico. Este ajuste no alteró la línea base de alcance ni demandó presupuesto adicional, habiendo sido incorporado satisfactoriamente en los prototipos de UI.

---

### 2. Trabajo planificado para la siguiente semana

Para el siguiente ciclo de trabajo (Semana 07 de Universidad / SEM06 / Monitoreo de Práctica de Campo 1, período del 28/09 al 03/10/2026), se ha planificado la ejecución de las siguientes actividades críticas:
1. **Transcripción y Normalización del Dataset Histórico de Boletas Físicas:** Procesamiento estructurado del lote de boletas físicas, talonarios proforma y órdenes de taller entregados por la administración de la imprenta, insumo indispensable para alimentar el Dashboard analítico de BI (HU-09) y el entrenamiento del modelo de IA (HU-10).
2. **Evaluación de Métricas de Calidad ISO/IEC 25010:** Medición formal de adecuación funcional, usabilidad, fiabilidad y eficiencia de desempeño sobre el incremento de software desarrollado.
3. **Desarrollo de API Transaccional de Cobros y Candado Digital (EDT 4.1.2):** Implementación de la lógica de bloqueo de cambio de estado a "Entregado" si el pedido registra saldo pendiente impago.
4. **Construcción de Servicios de Arqueo Dual de Caja:** Creación de endpoints en FastAPI para liquidación diaria con segregación de ingresos entre imprenta y gigantografías.
5. **Emisión del Informe de Estado del Proyecto v3.0:** Reporte semanal de control y registro de Daily Scrums del período.

---

### 3. Mejoras o cambios pendientes

* **Control de Alcance:** Sin solicitudes de cambio fuera de línea base.
* **Mejoras Registradas en Taller:** Los operarios de taller (Alexis, Aldair, Gabriel) solicitaron que en la vista de órdenes de taller se distinga con colores de alto contraste el sustrato requerido (Lona 13 oz, Vinil Brillante, Vinil Mate, Adhesivo Troquelado) para evitar confusiones en el ripeo de archivos para el plotter Wit-Color Ultra 1000. La solicitud fue clasificada como mejora de usabilidad para la historia HU-06.

---

### 4. Hitos y entregables del proyecto (Semana Actual y Siguiente):

#### Hitos de la Semana Evaluada (21/09/2026 al 26/09/2026):
* **Hito 1 (22/09/2026):** Apertura del Sprint 2 y diseño de componentes del talonario virtual en Angular 21.
* **Hito 2 (24/09/2026):** Culminación del costeo analítico y estructurado de los 31 paquetes de trabajo de la EDT.
* **Hito 3 (25/09/2026):** Publicación interactiva de contratos OpenAPI Swagger en `/docs` del backend FastAPI.
* **Hito 4 (26/09/2026):** Suscripción presencial en planta del Acta de Aceptación de Entregables (AAE-01) con gerencia.
* **Hito 5 (26/09/2026):** Cierre formal y presentación de la Evaluación Parcial T1 de Proyecto Capstone.

#### Hitos de la Siguiente Semana Proyectada (28/09/2026 al 03/10/2026):
* **Hito 6 (29/09/2026):** Digitalización y normalización de la muestra de 125 boletas físicas históricas de imprenta.
* **Hito 7 (01/10/2026):** Implementación del candado digital de cobro en backend FastAPI (`saldo_pendiente == 0`).
* **Hito 8 (02/10/2026):** Elaboración y validación del Informe de Métricas de Calidad de Software ISO/IEC 25010.
* **Hito 9 (03/10/2026):** Cierre formal de la Práctica de Campo 1 y emisión del Informe de Estado v3.0.

---

### 5. Indicadores Clave de Desempeño (KPI's)

#### Tiempo — El Proyecto se encuentra alineado con respecto al cronograma (variación marginal controlada):
* **Schedule Variance (SV):** $-\text{S/ } 30.00$ (Variación marginal controlada y absorbida dentro del Sprint 2).
* **Schedule Performance Index (SPI):** $0.98$ (Eficiencia de cronograma del 98.0%, dentro del rango admisible verde $\ge 0.95$).

#### Costo — El Proyecto está por debajo de lo presupuestado (ahorro operativo favorable):
* **Cost Variance (CV):** $+\text{S/ } 100.00$ (Ahorro presupuestal a favor del proyecto al cierre de semana).
* **Cost Performance Index (CPI):** $1.08$ (Rendimiento del costo superior a la unidad, indicando optimización de recursos).

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
| **1.3.1** | Elaboración de Informes de Estado Semanales | Informe de Estado del Proyecto v2.0 | 26/09/2026 | 26/09/2026 | TERMINADO |
| **1.3.2** | Registro de Daily Scrums del Proyecto | Registro de Daily Scrums Sprint 2 (Inicial) | 26/09/2026 | 26/09/2026 | TERMINADO |
| **1.3.3** | Gestión de Impedimentos y Desviaciones | Registro de Impedimentos y Desviaciones | 26/09/2026 | 26/09/2026 | TERMINADO |
| **1.4.1** | Gestión de Solicitudes de Control de Cambios | Solicitudes de Control de Cambios | 03/10/2026 | - | NO INICIADO |
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
| **4.1.2** | Desarrollo de API de Pagos y Arqueo de Caja | API de Arqueo Dual y Candado de Entrega | 03/10/2026 | - | EN EJECUCIÓN |
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
| **EDT 1.3.1 Consolidación y cierre de entregables para Evaluación T1** | Portafolio consolidado de S1 a S6 e Informes de Estado v1 y v2 | 100% |
| **EDT 1.3.2 Registro y sistematización de Daily Scrums del período** | Registro de Daily Scrums y métricas de avance del ciclo | 100% |
| **EDT 3.1.2 Especificación OpenAPI Swagger de Endpoints REST** | Documentación OpenAPI interactiva Swagger en `/docs` FastAPI | 100% |
| **EDT 3.3.2 Guía de componentes y estilos UI para Angular 21** | Biblioteca de estilos y componentes responsive para taller | 100% |
| **EDT 4.2.1 Maquetación de la pantalla de Talonario Virtual de mostrador** | Formulario reactivo de órdenes con campos A cuenta y Saldo | 100% |
| **EDT 4.1.2 Desarrollo de API de Cobros, Pagos y Arqueo de Caja** | Endpoints de registro de pagos y candado digital de cobro | 0% |
| **Cumplimiento Promedio Global del Período** | **6 actividades evaluadas bajo regla binaria estricta** | **83.3%** |

---

#### DETALLE DE VALIDACIÓN DEL TIEMPO

| ACTIVIDAD | DURACIÓN ESTIMADA | DURACIÓN REAL | % CUMPLIMIENTO |
|:---|:---:|:---:|:---:|
| **EDT 1.3.1 Consolidación y cierre de entregables T1** | 2 días | 2 días | 100.0% |
| **EDT 1.3.2 Registro de Daily Scrums del período** | 2 días | 2 días | 100.0% |
| **EDT 3.1.2 Especificación OpenAPI Swagger de Endpoints** | 2 días | 2 días | 100.0% |
| **EDT 3.3.2 Guía de componentes y estilos UI en Angular 21** | 2 días | 2 días | 100.0% |
| **EDT 4.2.1 Maquetación de pantalla de Talonario Virtual** | 2 días | 2 días | 100.0% |
| **EDT 4.1.2 Desarrollo de API de Pagos y Arqueo de Caja** | 2 días | 3 días (en curso) | 50.0% |
| **Cumplimiento promedio del Período** | **12 días planificados** | **13 días insumidos** | **83.3%** |

---

#### DETALLE DE VALIDACIÓN DE COSTOS

| ACTIVIDAD | VALOR PLANIFICADO | COSTO REAL |
|:---|:---:|:---:|
| **EDT 1.3.1 Consolidación y cierre de entregables T1** | S/ 250.00 | S/ 240.00 |
| **EDT 1.3.2 Registro de Daily Scrums y gestión ágil** | S/ 150.00 | S/ 140.00 |
| **EDT 3.1.2 Especificación OpenAPI Swagger de Endpoints** | S/ 250.00 | S/ 230.00 |
| **EDT 3.3.2 Guía de componentes y estilos UI en Angular 21** | S/ 250.00 | S/ 230.00 |
| **EDT 4.2.1 Maquetación de pantalla de Talonario Virtual** | S/ 300.00 | S/ 280.00 |
| **EDT 4.1.2 Desarrollo de API de Pagos y Arqueo de Caja** | S/ 200.00 | S/ 180.00 |
| **TOTAL** | **S/ 1,400.00** | **S/ 1,300.00** |

*Justificación Técnica y Económica del Costo Incurrido:*
1. **Horas Hombre de Ingeniería:** Se consumieron 65 horas efectivas de desarrollo y gestión entre los tres integrantes (Gerardo Plasencia: 23h = S/ 460.00; Jose Estibb Anhuaman: 21h = S/ 420.00; Jose Diego Rodríguez: 21h = S/ 420.00 a razón de S/ 20.00/hora valorizada = S/ 1,300.00).
2. **Amortización de Hardware y Recursos:** Dentro del costo valorizado se prorratea la depreciación semanal de 3 computadoras portátiles de desarrollo (S/ 50.00 por equipo = S/ 150.00) y el servicio de conectividad a Internet.
3. **Eficiencia Lograda:** La automatización de la documentación interactiva Swagger a través de FastAPI y la estandarización de componentes en Angular 21 permitió una economía favorable de S/ 100.00 frente a lo planificado ($CPI = 1.08$).

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
