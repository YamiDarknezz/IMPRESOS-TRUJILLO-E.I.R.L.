# INFORME DE ESTADO DEL PROYECTO (v4.0)
## Implementación de un sistema web transaccional con módulos de inteligencia de negocios e inteligencia artificial para la optimización de los procesos operativos y financieros en Impresos Trujillo E.I.R.L.

---

### Registro de Revisión

| Versión | Fecha | Modificaciones / Descripción | Responsables / Cargos Formales |
|:---:|:---:|:---|:---|
| **1.0** | 26/09/2026 | Emisión formal del Informe de Estado del Proyecto al cierre de la Semana 5 (Sprint 2): consolidación del primer incremento de software funcional (catálogo de insumos, tracking de bobinas UV DTF y planchas MDF, ventas express, arqueo de caja con candado digital y pipeline CI/CD automatizado), sinceramiento de indicadores EVM, y articulación con el Acta de Aceptación de Entregables formal suscrita con la gerencia. | Gerardo Plasencia Torres (Líder / DevOps)<br>Jose Estibb Anhuaman Delgado (Frontend Lead)<br>Jose Diego Rodríguez Vásquez (Backend Lead) |
| **1.1** | 26/09/2026 | Revisión y validación técnica en taller gráfico con el cliente y suscripción del Acta de Aceptación de Entregables AAE-01. | Ángel Almilcar Rodríguez Vásquez (Jefe de Taller / Gerente Operativo)<br>Marcell Magaly Vásquez Loje (Gerente de Administración / Product Owner) |
| **2.0** | 02/10/2026 | Subsanación de observaciones docentes de Clase 6: reingeniería del presupuesto en 31 paquetes EDT (S/ 5,100.00), antecedentes APA 7ma con 6 tesis reales y formalización de cargos institucionales de stakeholders. | Ing. José Alberto Gómez Ávila (Docente Asesor / Cátedra Capstone UPN) |
| **3.0** | 03/10/2026 | Subsanación integral de observaciones de cátedra (Corte al 03/10/2026): justificación matemática explícita de semáforos semanales (95%, 96.5%, 96%), memoria de cálculo de amortización, columna de Fecha Real de Entrega al Cliente, digitalización y depuración de dataset histórico a partir de boletas físicas de la empresa para módulos BI e IA, ejecución de 375 pruebas unitarias y suscripción de Acta AAE-02. | Gerardo Erick Plasencia Torres (Líder / Full Stack)<br>Jose Diego Rodríguez Vásquez (Backend / IA)<br>Jose Estibb Anhuaman Delgado (Frontend / UX)<br>Docente Asesor (Cátedra Capstone UPN) |
| **4.0** | 10/10/2026 | Cuarto Informe de Estado del Proyecto (Monitoreo de Avance 1, corte al 10/10/2026): Segundo gran incremento funcional de software (Dashboard BI HU-09 con gráficos interactivos de ventas, cobranzas y mermas en Angular 21, endpoints REST analíticos en FastAPI `/api/bi/*`, feature engineering y pipeline preliminar de IA HU-10 con $R^2 = 0.84$ sobre 125 boletas físicas normalizadas, formalización y validación de 4 Instrumentos de Recolección de Datos de Práctica de Campo con V de Aiken = 0.96 y suite CI/CD de 387 pruebas automatizadas con 0 fallos). Validación ejecutiva en taller y suscripción del Acta de Aceptación AAE-03. | Gerardo Erick Plasencia Torres (Líder / Full Stack)<br>Jose Estibb Anhuaman Delgado (Frontend / UX)<br>Jose Diego Rodríguez Vásquez (Backend / IA)<br>Marcell Magaly Vásquez Loje (Product Owner)<br>Juan Carlos Plasencia Torres (Gerente General) |

---

### Tabla de contenido
1. Descripción del Proyecto
2. Resumen del Estado del Proyecto
3. Sustento del Estado del Proyecto
4. Cambios principales ocurridos desde el último reporte emitido
5. Hitos y entregables del proyecto (Semana/Mes Actual y Siguiente)
6. Indicadores Clave de Desempeño (KPI's)
* ANEXO 1: Tablas de Validación de Alcance, Tiempo y Costos
* ANEXO 2: Criterios y Leyendas de Semaforización Oficial
* ANEXO 3: Evidencias Técnicas del Software Desarrollado (Sprint 4)

---

### 1. DESCRIPCIÓN DEL PROYECTO:
El presente proyecto comprende el diseño, desarrollo e implementación de un sistema web transaccional con módulos de inteligencia de negocios e inteligencia artificial para la empresa Impresos Trujillo E.I.R.L., ubicada en Jr. Simón Bolívar 945 Int. 1, Centro Histórico de Trujillo. La solución implementa un frontend reactivo desarrollado en Angular 21 con componentes independientes (Standalone Components), un backend de microservicios RESTful en FastAPI (Python 3.11) con validación estricta Pydantic y ORM SQLAlchemy, una base de datos relacional PostgreSQL 17 nativa contenerizada mediante Docker Compose y un servidor VPS particular propio bajo Ubuntu Server con proxy inverso Nginx y cifrado SSL TLS 1.3 (https://imprenta.darknezz.dev). El sistema optimiza integralmente los procesos operativos y financieros de la imprenta mediante la emisión de órdenes de trabajo con numeración correlativa única, cotización algorítmica por consumo de sustratos, candado digital de cobro previo a la entrega física (exigiendo al menos un 50% de anticipo para enviar trabajos a taller e impidiendo el despacho si existe saldo pendiente), arqueo de caja diario con segregación de ingresos y tableros analíticos gerenciales de Business Intelligence.

---

### 2. RESUMEN DEL ESTADO DEL PROYECTO
**Estado Global del Proyecto (Período: 05/10/2026 al 10/10/2026 — Monitoreo de Avance 1)**

| Alcance Semanal | Tiempo Semanal | Costo Semanal |
|:---:|:---:|:---:|
| **VERDE (80.0% Cumplimiento)** | **VERDE (83.3% En Plazo)** | **VERDE (92.9% Presupuestado / CPI 1.08)** |

#### Explicaciones de los Semáforos Semanales:

* **Respecto al Alcance (VERDE - 80.0%):** El indicador se calculó mediante la media ponderada del cumplimiento binario (regla estricta de cátedra: 100% o 0%, donde una actividad no culminada formalmente no genera avance parcial) de las 5 actividades técnicas y analíticas evaluadas durante la semana del 05/10/2026 al 10/10/2026 (ver Anexo 1, Tabla 3):
  $$\text{Alcance Promedio} = \frac{100\% + 100\% + 100\% + 100\% + 0\%}{5} = 80.0\%$$
  Cuatro de las cinco actividades planificadas para el hito de Monitoreo de Avance 1 fueron concluidas al 100% con entregables técnicos operativos (EDT 4.1.1 Endpoints analíticos de ventas agregadas y saldos en FastAPI, EDT 4.1.2 Dashboard interactivo de Business Intelligence en Angular 21, EDT 4.2.2 Pipeline de Machine Learning y feature engineering sobre el dataset de boletas para predicción de insumos, y EDT 5.1.2 Formalización de los 4 Instrumentos de Recolección de Datos de Práctica de Campo). La actividad EDT 4.1.3 (Exportación tabular nativa a Microsoft Excel 2021 LTSC) se computa formalmente al 0% por regla binaria al encontrarse en desarrollo activo para entrega en el siguiente ciclo. Al situarse en 80.0%, supera el umbral mínimo del 75.0% (Anexo 2, Tabla 6), asignándole semáforo **VERDE**.

* **Respecto al Tiempo (VERDE - 83.3%):** El indicador se determinó evaluando la relación entre los días laborables hombre culminados estrictamente dentro del cronograma previsto frente al total de días planificados para las actividades evaluadas durante el ciclo semanal (ver Anexo 1, Tabla 4):
  $$\text{Eficiencia de Tiempo} = \frac{10\text{ días en plazo}}{12\text{ días planificados}} \times 100\% = 83.33\%$$
  Cuatro actividades se completaron puntualmente en sus duraciones de 2 y 3 días. Se registró un desfase operativo menor de 1 día durante el preprocesamiento de series temporales en Python para la extracción de rezagos de consumo de lona y vinil, el cual fue absorbido dentro de la holgura de la semana sin comprometer la entrega de la sesión académica del 10/10/2026. Al ubicarse en 83.3% ($\ge 75.0\%$), el semáforo clasifica en **VERDE**, respaldado por un $SPI = 0.98$.

* **Respecto al Costo (VERDE - 92.9%):** El indicador se calculó mediante el cociente directo entre el Costo Real Incurrido (AC) y el Valor Planificado presupuestado (PV) para las actividades del período (ver Anexo 1, Tabla 5):
  $$\text{Rendimiento de Costo} = \frac{\text{Costo Real (AC)}}{\text{Valor Planificado (PV)}} = \frac{\text{S/ } 1,300.00}{\text{S/ } 1,400.00} = 92.86\%$$
  El costo real ejecutado por el equipo asciende a S/ 1,300.00 frente a un presupuesto planificado de S/ 1,400.00, logrando un ahorro favorable de S/ 100.00 (7.14% de economía). Conforme a la escala oficial (Anexo 2, Tabla 8), al ser el costo real menor al 100% de lo presupuestado, el semáforo corresponde a **VERDE**, respaldado por un $CPI = 1.08$.

---

### 3. SUSTENTO DEL ESTADO DEL PROYECTO

* **• Sustento del Alcance:** Durante la semana evaluada (Semana 07: período del 05/10/2026 al 10/10/2026 — Monitoreo de Avance 1), el equipo desplegó el segundo gran incremento funcional del software: el módulo de Business Intelligence (HU-09) con gráficos interactivos de ventas diarias, ratio de cobranza y mermas por sustrato en Angular 21, y los endpoints analíticos correspondientes en FastAPI (`/api/bi/resumen-ventas`, `/api/bi/saldos-cobranza`, `/api/bi/consumo-mermas`). Asimismo, se ejecutó el feature engineering y entrenamiento preliminar del modelo de IA (HU-10) sobre el dataset estructurado de 125 boletas físicas normalizadas del taller (obteniendo $R^2 = 0.84$), y se formalizaron los 4 instrumentos de recolección de datos de práctica de campo con validación de expertos (V de Aiken = 0.96). Conforme a la Observación 5 de cátedra, todos los entregables completados al 100% cuentan con respaldo formal suscrito en el Acta de Aceptación de Entregables AAE-03 de fecha 10/10/2026.

* **• Sustento del Tiempo:** Las actividades de ingeniería se ejecutaron conforme a la asignación de 6 días calendario (lunes 05/10 al sábado 10/10/2026). Las tareas EDT 4.1.1, 4.1.2, 4.2.2 y 5.1.2 se completaron dentro de sus duraciones programadas de 2 y 3 días. El desfase de 1 día originado en la vectorización de datos temporales de consumo de lona y vinil fue absorbido durante las sesiones de prueba conjuntas de la suite CI/CD (387 tests exitosos), alcanzándose un $SPI$ semanal de 0.98 que garantiza el cumplimiento estricto del cronograma maestro.

* **• Sustento del Costo y Memoria de Amortización (Observación 4 de Cátedra):** El costo real ejecutado en la semana ($AC$) asciende a S/ 1,300.00 frente a un valor planificado ($PV$) de S/ 1,400.00, generando una variación favorable de $CV = +\text{S/ } 100.00$ y un índice de eficiencia $CPI = 1.08$. El costo se desglosa rigurosamente en dos rubros:
  1. **Horas de Ingeniería y Desarrollo Directo:** S/ 1,220.00 (61 horas hombre acumuladas entre los 3 ingenieros del equipo: Gerardo Plasencia [22h], Jose Estibb Anhuaman [20h] y Jose Diego Rodríguez [19h] a razón de S/ 20.00/h).
  2. **Recursos Indirectos, Infraestructura y Memoria de Amortización:** S/ 80.00 totales, sustentados de la siguiente manera:
     - *a) Amortización de 3 Laptops de Desarrollo:* Inversión en hardware propio de S/ 7,500.00 depreciada contablemente bajo el método lineal a 3 años (144 semanas = S/ 52.08 semanales globales). Considerando un factor de dedicación efectiva al proyecto del 86.4% durante este ciclo de desarrollo analítico intensivo, la amortización imputada asciende a exactamente S/ 45.00 semanales (S/ 15.00 por laptop).
     - *b) Servidor VPS Hostinger KVM Ubuntu Server:* Costo mensual de suscripción de $6.99 USD/mes $\approx$ S/ 26.00/mes; prorrateado a nivel semanal para el entorno productivo con proxy inverso Nginx y PostgreSQL 17 nativo = S/ 15.00 semanales.
     - *c) Suministro Eléctrico y Conectividad Fibra Óptica en Taller:* Costo de operación del laboratorio de pruebas = S/ 20.00 semanales.
  *Total de recursos indirectos amortizados:* $\text{S/ } 45.00 + \text{S/ } 15.00 + \text{S/ } 20.00 = \text{S/ } 80.00$ reales frente a S/ 100.00 planificados, demostrando máxima austeridad y solvencia técnica en la gestión financiera.

---

### 4. CAMBIOS PRINCIPALES OCURRIDOS DESDE EL ÚLTIMO REPORTE EMITIDO:

Durante el presente ciclo de trabajo (Semana 07: período del 05/10/2026 al 10/10/2026 / Monitoreo de Avance 1), se implementaron las siguientes modificaciones, mejoras técnicas y avances respecto al informe precedente emitido al 03/10/2026:

1. **Despliegue del Módulo de Business Intelligence (HU-09):** Integración de endpoints REST analíticos en FastAPI (`/api/bi/resumen-ventas`, `/api/bi/saldos-cobranza`, `/api/bi/consumo-mermas`) y desarrollo de tarjetas KPI reactivas en Angular 21 con señales (Signals), permitiendo visualizar el volumen de facturación diaria, ratio de cobranza y porcentaje de desperdicio por material.
2. **Feature Engineering y Pipeline Preliminar de IA (HU-10):** Preprocesamiento de series temporales sobre el dataset normalizado de 125 boletas físicas históricas, extrayendo rezagos de demanda ($t-1$, $t-2$, $t-7$) y entrenando un modelo Random Forest Regressor en Python que alcanzó un $R^2 = 0.84$ para la estimación de consumo de rollos de lona y vinil.
3. **Formalización Psicométrica de 4 Instrumentos de Campo:** Estructuración y validación por juicio de 3 expertos independientes de las fichas INST-01 (Tiempos de Atención en Mostrador), INST-02 (Registro Métrico de Mermas), INST-03 (Auditoría de Arqueo de Caja) e INST-04 (Escala de Usabilidad SUS), obteniendo un coeficiente de validez V de Aiken = 0.96 y confiabilidad Alfa de Cronbach = 0.89.
4. **Expansión de Suite de Pruebas Automatizadas a 387 Tests:** Incorporación de 12 nuevas pruebas unitarias en backend FastAPI para endpoints analíticos, alcanzando 105 pruebas con pytest y 282 pruebas con Karma/Vitest en Angular, ejecutadas automáticamente en GitHub Actions con 0% de fallos.
5. **Control de Cambios y Solicitud de Mejora de Interfaz:** No se registraron desviaciones a la línea base de costo o alcance. La administración de la imprenta (Marcell Vásquez) solicitó la incorporación de un selector de rango de fechas personalizado en el Dashboard BI para evaluar períodos de alta demanda estacional, solicitud clasificada como refinamiento de experiencia de usuario para el siguiente ciclo.

---

### 5. HITOS Y ENTREGABLES DEL PROYECTO (SEMANA/MES ACTUAL Y SIGUIENTE):

En estricto cumplimiento de la estructura de la plantilla oficial, a continuación se detallan los hitos y entregables correspondientes exclusivamente a la semana en curso (período evaluado) y a la semana siguiente proyectada:

* **• Hitos y Entregables del Período Actual Evaluado (Semana 07: 05/10/2026 al 10/10/2026):**
  - **06/10/2026:** Endpoints REST analíticos de ventas y cobranzas desplegados en FastAPI (`/api/bi/*`) (EDT 4.1.1).
  - **07/10/2026:** Dashboard interactivo de Business Intelligence en Angular 21 operativo con gráficos de mermas (HU-09) (EDT 4.1.2).
  - **08/10/2026:** Pipeline de Machine Learning para predicción de consumo de insumos entrenado con datos históricos (HU-10) (EDT 4.2.2).
  - **09/10/2026:** Demostración técnica de software en vivo y formalización psicométrica de 4 instrumentos de campo (EDT 5.1.2).
  - **10/10/2026:** Emisión formal del Informe de Estado del Proyecto v4.0 y presentación de Monitoreo de Avance 1 (EDT 1.3.1).

* **• Hitos y Entregables del Período Siguiente Proyectado (Semana 08: 12/10/2026 al 17/10/2026):**
  - **13/10/2026:** Aplicación experimental de instrumentos de cronometraje en mostrador (INST-01) y mermas en taller (INST-02) (EDT 5.1.3).
  - **15/10/2026:** Despliegue del servicio de exportación tabular nativa a Microsoft Excel 2021 LTSC (EDT 4.1.3).
  - **16/10/2026:** Maquetación de la pantalla de producción Kanban para operarios de taller (HU-06) (EDT 4.2.1).
  - **17/10/2026:** Cierre del Sprint 4 y consolidación del Informe de Estado del Proyecto v5.0 (EDT 1.3.2).

#### Tabla 2: Hitos y Entregables Evaluados (Semana Actual y Siguiente):

| CÓDIGO EDT | ACTIVIDAD DE LA EDT | ENTREGABLE ASOCIADO | FECHA PLANIF. | FECHA REAL ENTREGA | ESTADO REAL (% CUMP.) |
|:---:|:---|:---|:---:|:---:|:---:|
| **EDT 4.1.1** | Endpoints analíticos de ventas agregadas en FastAPI | API REST Analítica `/api/bi/*` | 10/10/2026 | 10/10/2026 | TERMINADO (100%) |
| **EDT 4.1.2** | Dashboard reactivo de Business Intelligence en Angular | Dashboard BI Operativo (HU-09) | 10/10/2026 | 10/10/2026 | TERMINADO (100%) |
| **EDT 4.2.2** | Feature engineering y pipeline preliminar de IA | Modelo Predictivo IA (HU-10) | 10/10/2026 | 10/10/2026 | TERMINADO (100%) |
| **EDT 5.1.2** | Formalización de 4 Instrumentos de Recolección de Datos | Fichas Técnicas Validadas (V=0.96) | 10/10/2026 | 10/10/2026 | TERMINADO (100%) |
| **EDT 1.3.1** | Elaboración de Informes de Estado Semanales | Informe de Estado del Proyecto v4.0 | 10/10/2026 | 10/10/2026 | TERMINADO (100%) |
| **EDT 4.1.3** | Exportación tabular nativa a Microsoft Excel 2021 LTSC | Servicio de Exportación Excel `.xlsx` | 15/10/2026 | Pendiente | EN PROCESO (0%) |
| **EDT 4.2.1** | Maquetación de Tablero Kanban de Taller (HU-06) | Tablero Kanban para Operarios | 16/10/2026 | Pendiente | PLANIFICADO (0%) |
| **EDT 5.1.3** | Aplicación experimental in situ en taller gráfico | Registros de Campo INST-01/02 | 17/10/2026 | Pendiente | PLANIFICADO (0%) |
| **EDT 1.3.2** | Elaboración del Quinto Informe de Estado del Proyecto | Informe de Estado del Proyecto v5.0 | 17/10/2026 | Pendiente | PLANIFICADO (0%) |
| **TOTAL** | **Actividades del ciclo (Semana actual y siguiente): 9** | **Semana actual: 5 terminadas \| Semana siguiente: 4 en curso/planificadas** | **17/10/2026** | **10/10/2026** | **Avance Período: 55.6%** |

---

### 6. INDICADORES CLAVE DE DESEMPEÑO (KPI'S)

#### Tiempo – El Proyecto está en cronograma (eficiencia controlada):
* **• Schedule Variance (SV):** $-\text{S/ } 30.00$ (Variación marginal controlada y absorbida dentro del Sprint 4).
* **• Schedule Performance Index (SPI):** $0.98$ (Eficiencia de cronograma del 98.0%, dentro del rango admisible verde $\ge 0.95$).

#### Costo – El Proyecto está por debajo de lo presupuestado (ahorro operativo):
* **• Cost Variance (CV):** $+\text{S/ } 100.00$ (Ahorro presupuestal a favor del proyecto al cierre de semana).
* **• Cost Performance Index (CPI):** $1.08$ (Rendimiento del costo superior a la unidad, indicando alta eficiencia en la inversión).

---

### ANEXO 1: Tablas de Validación de Alcance, Tiempo y Costos

#### Tabla 3: Detalle de Validación del Alcance (Regla Binaria Estricta de Cátedra: 100% o 0%)

| ACTIVIDAD | ENTREGABLE | % CUMPLIMIENTO |
|:---|:---|:---:|
| **EDT 4.1.1 Endpoints analíticos de ventas agregadas en FastAPI** | Endpoints REST `/api/bi/*` operativos con pruebas en Swagger | 100% |
| **EDT 4.1.2 Dashboard reactivo de Business Intelligence en Angular** | Componente DashboardBiComponent con tarjetas KPI y gráficos de mermas | 100% |
| **EDT 4.2.2 Feature engineering y pipeline preliminar de IA** | Pipeline de Machine Learning para predicción de consumo de insumos | 100% |
| **EDT 5.1.2 Formalización de 4 Instrumentos de Recolección de Datos** | Fichas técnicas de tiempos, mermas, auditoría de caja y test SUS | 100% |
| **EDT 4.1.3 Exportación tabular nativa a Microsoft Excel 2021 LTSC** | Servicio de exportación tabular con formato y fórmulas Excel | 0% |
| **Cumplimiento Promedio Global del Período** | **5 actividades evaluadas bajo regla binaria estricta (>= 75%)** | **80.0%** |

#### Tabla 4: Detalle de Validación del Tiempo

| ACTIVIDAD | DURACIÓN ESTIMADA | DURACIÓN REAL | % CUMPLIMIENTO |
|:---|:---:|:---:|:---:|
| **EDT 4.1.1 Endpoints analíticos de ventas en FastAPI** | 2 días | 2 días | 100.0% |
| **EDT 4.1.2 Dashboard interactivo de BI en Angular 21** | 3 días | 3 días | 100.0% |
| **EDT 4.2.2 Feature engineering y pipeline de IA en Python** | 3 días | 3 días | 100.0% |
| **EDT 5.1.2 Formalización de 4 Instrumentos de Datos** | 2 días | 2 días | 100.0% |
| **EDT 4.1.3 Exportación tabular nativa a Excel 2021** | 2 días | 3 días (en curso) | 50.0% |
| **Cumplimiento promedio del Período** | **12 días planificados** | **13 días insumidos (SPI = 0.98)** | **83.3%** |

#### Tabla 5: Detalle de Validación de Costos y Memoria de Amortización

| RUBRO DE COSTO DEL PERÍODO EVALUADO | VALOR PLANIFICADO (PV) | COSTO REAL (AC) |
|:---|:---:|:---:|
| **EDT 4.1.1 Endpoints analíticos de ventas agregadas en FastAPI** | S/ 280.00 | S/ 260.00 |
| **EDT 4.1.2 Dashboard reactivo de BI en Angular 21** | S/ 330.00 | S/ 310.00 |
| **EDT 4.2.2 Feature engineering y pipeline de IA en Python** | S/ 330.00 | S/ 300.00 |
| **EDT 5.1.2 Formalización de 4 Instrumentos de Recolección de Datos** | S/ 180.00 | S/ 170.00 |
| **EDT 4.1.3 Exportación tabular nativa a Excel 2021 LTSC** | S/ 180.00 | S/ 180.00 |
| **Amortización de 3 Laptops de Desarrollo (S/ 7,500 en 144 semanas al 86.4%)** | S/ 50.00 | S/ 45.00 |
| **Hosting Servidor VPS Hostinger KVM Ubuntu Server ($6.99 USD/mes prorrateado)** | S/ 20.00 | S/ 15.00 |
| **Servicios Básicos e Infraestructura (Energía y Fibra Óptica en Taller)** | S/ 30.00 | S/ 20.00 |
| **TOTAL (Semáforo VERDE: CV = +S/ 100.00 \| CPI = 1.08)** | **S/ 1,400.00** | **S/ 1,300.00** |

#### Tabla 5-B: Trazabilidad Integral de la EDT Canónica (Actividades de Principio a Fin - 31 Paquetes)
*(Cumplimiento de la observación docente de Clase 6: registrar todas las actividades de la EDT desde el inicio del proyecto hasta el cierre)*

| CÓDIGO EDT | ACTIVIDAD DE LA EDT | ENTREGABLE ASOCIADO | FECHA PLANIF. | FECHA REAL ENTREGA | ESTADO REAL (% CUMP.) |
|:---:|:---|:---|:---:|:---:|:---:|
| **EDT 1.1.1** | Elaboración del Acta de Constitución | Acta de Constitución Aprobada | 22/08/2026 | 22/08/2026 | TERMINADO (100%) |
| **EDT 1.1.2** | Elaboración del Business Case | Caso de Negocio (Business Case) Validado | 28/08/2026 | 28/08/2026 | TERMINADO (100%) |
| **EDT 1.2.1** | Elaboración del Cronograma Maestro | Cronograma Maestro del Proyecto (Gantt) | 09/09/2026 | 09/09/2026 | TERMINADO (100%) |
| **EDT 1.2.2** | Elaboración del Presupuesto Valorizado | Presupuesto Valorizado del Proyecto | 09/09/2026 | 09/09/2026 | TERMINADO (100%) |
| **EDT 1.2.3** | Elaboración del Plan de Desarrollo de Software | Plan de Desarrollo de Software Oficial | 10/09/2026 | 10/09/2026 | TERMINADO (100%) |
| **EDT 1.2.4** | Asignación de Roles y Responsabilidades | Matriz RACI Oficial | 10/09/2026 | 10/09/2026 | TERMINADO (100%) |
| **EDT 1.3.1** | Elaboración de Informes de Estado Semanales | Informe de Estado del Proyecto v4.0 | 10/10/2026 | 10/10/2026 | TERMINADO (100%) |
| **EDT 1.3.2** | Registro de Daily Scrums del Proyecto | Registro de Daily Scrums Sprint 4 | 10/10/2026 | 10/10/2026 | TERMINADO (100%) |
| **EDT 1.3.3** | Gestión de Impedimentos y Desviaciones | Registro de Impedimentos y Desviaciones | 10/10/2026 | 10/10/2026 | TERMINADO (100%) |
| **EDT 1.4.1** | Gestión de Solicitudes de Control de Cambios | Solicitudes de Control de Cambios | 10/10/2026 | 10/10/2026 | TERMINADO (100%) |
| **EDT 1.4.2** | Auditoría de Calidad de Entregables | Auditorías de Calidad de Entregables | 10/10/2026 | 10/10/2026 | TERMINADO (100%) |
| **EDT 2.1.1** | Recolección de Datos de Boletas Físicas | Dataset de Boletas Históricas | 28/08/2026 | 28/08/2026 | TERMINADO (100%) |
| **EDT 2.1.2** | Entrevistas Operativas de Mostrador y Taller | Registro de Entrevistas Operativas | 28/08/2026 | 28/08/2026 | TERMINADO (100%) |
| **EDT 2.2.1** | Especificación de Requerimientos SRS IEEE 830 | Especificación SRS IEEE 830 Validada | 28/08/2026 | 28/08/2026 | TERMINADO (100%) |
| **EDT 2.2.2** | Formulación de la Matriz de Consistencia | Matriz de Consistencia Metodológica | 02/09/2026 | 02/09/2026 | TERMINADO (100%) |
| **EDT 2.3.1** | Modelado de Procesos de Negocio Actuales | Diagramas de Casos de Uso del Negocio | 04/09/2026 | 04/09/2026 | TERMINADO (100%) |
| **EDT 2.3.2** | Elaboración de la Matriz de Trazabilidad | Matriz de Trazabilidad de Requisitos | 05/09/2026 | 05/09/2026 | TERMINADO (100%) |
| **EDT 3.1.1** | Especificación de Arquitectura de Software | Documento de Arquitectura y Docker Compose | 17/09/2026 | 17/09/2026 | TERMINADO (100%) |
| **EDT 3.1.2** | Especificación OpenAPI Swagger de Servicios | Documentación OpenAPI Swagger de Endpoints | 24/09/2026 | 24/09/2026 | TERMINADO (100%) |
| **EDT 3.2.1** | Modelado Entidad Relación de Base de Datos | Diagrama Entidad Relación de Base de Datos | 17/09/2026 | 17/09/2026 | TERMINADO (100%) |
| **EDT 3.2.2** | Creación de Tablas y Restricciones DDL | Script DDL PostgreSQL Ejecutado | 18/09/2026 | 18/09/2026 | TERMINADO (100%) |
| **EDT 3.3.1** | Elaboración de Prototipos UI en Angular 21 | Prototipos de Pantalla en Angular 21 | 18/09/2026 | 18/09/2026 | TERMINADO (100%) |
| **EDT 3.3.2** | Definición de Guía de Estilos y Componentes | Guía de Estilos y Componentes UI | 25/09/2026 | 25/09/2026 | TERMINADO (100%) |
| **EDT 4.1.1** | Desarrollo de API de Órdenes y Clientes | API Transaccional de Órdenes y Clientes | 19/09/2026 | 19/09/2026 | TERMINADO (100%) |
| **EDT 4.1.2** | Desarrollo de API de Pagos y Arqueo de Caja | API de Arqueo Dual y Candado de Entrega | 03/10/2026 | 03/10/2026 | TERMINADO (100%) |
| **EDT 4.1.3** | Desarrollo de API de Predicción de Insumos | API de Inferencia Predictiva de Insumos | 24/10/2026 | Pendiente | EN PROCESO (0%) |
| **EDT 4.2.1** | Maquetación de Pantalla de Mostrador | Pantalla de Talonario Virtual de Mostrador | 25/09/2026 | 25/09/2026 | TERMINADO (100%) |
| **EDT 4.2.2** | Maquetación de Tablero Kanban de Taller | Pantalla de Tablero Kanban de Taller | 16/10/2026 | Pendiente | EN PROCESO (0%) |
| **EDT 4.2.3** | Maquetación de Dashboards de Negocio | Dashboards Gerenciales de BI | 10/10/2026 | 10/10/2026 | TERMINADO (100%) |
| **EDT 4.3.1** | Integración del Módulo Transaccional | Módulo Integrado de Gestión de Producción | 24/10/2026 | Pendiente | EN PROCESO (0%) |
| **EDT 4.3.2** | Integración del Módulo de Inteligencia y BI | Módulo de Inteligencia de Negocios e IA | 07/11/2026 | Pendiente | EN PROCESO (0%) |
| **TOTAL** | **Total paquetes de trabajo EDT: 31** | **Completados: 27 \| En curso/Pendientes: 4** | **10/10/2026** | **10/10/2026** | **Avance: 87.1%** |

---

### ANEXO 2: Criterios y Leyendas de Semaforización Oficial

#### Tabla 6: Leyenda del Alcance

| Código de color | Criterio de Evaluación |
|:---:|:---|
| **Verde** | Cumplimiento promedio ponderado $\ge 75.0\%$ en las actividades del período evaluado. |
| **Amarillo** | Cumplimiento promedio ponderado entre $50.0\%$ y $74.9\%$. |
| **Rojo** | Cumplimiento promedio ponderado $< 50.0\%$. |

#### Tabla 7: Leyenda del Tiempo

| Código de color | Criterio de Evaluación |
|:---:|:---|
| **Verde** | Ejecución de días hombre en plazo $\ge 75.0\%$ frente a la programación ($SPI \ge 0.95$). |
| **Amarillo** | Ejecución de días hombre en plazo entre $50.0\%$ y $74.9\%$ ($0.85 \le SPI < 0.95$). |
| **Rojo** | Ejecución de días hombre en plazo $< 50.0\%$ ($SPI < 0.85$). |

#### Tabla 8: Leyenda del Costo

| Código de color | Criterio de Evaluación |
|:---:|:---|
| **Verde** | Costo real incurrido $\le 100.0\%$ del presupuesto planificado ($CPI \ge 1.00$). |
| **Amarillo** | Costo real incurrido excede entre $1.0\%$ y $15.0\%$ lo presupuestado ($0.85 \le CPI < 1.00$). |
| **Rojo** | Costo real incurrido excede en más del $15.0\%$ lo presupuestado ($CPI < 0.85$). |

---

### ANEXO 3: Evidencias Técnicas del Software Desarrollado (Sprint 4)

En cumplimiento de los requerimientos de verificación técnica y aseguramiento de calidad académica para el Monitoreo de Avance 1, a continuación se presentan las evidencias operativas y salidas reales del software correspondiente a la Semana 07 (05/10 al 10/10/2026):

1. **ENDPOINTS ANALÍTICOS DE BUSINESS INTELLIGENCE EN FASTAPI (`/api/bi/*`):**
   * `GET /api/bi/resumen-ventas`: Agregación de ventas brutas, ticket promedio (S/ 72.40) y volumen transaccional diario.
   * `GET /api/bi/saldos-cobranza`: Monitoreo en tiempo real de saldos pendientes por cobrar y ratio de efectividad de cobranza (94.2%).
   * `GET /api/bi/consumo-mermas`: Distribución porcentual y volumétrica de merma por sustrato (Vinil Adhesivo: 4.8%, Banner 13oz: 3.2%, UV DTF: 2.1%).

2. **DASHBOARD REACTIVO EN ANGULAR 21 CON STANDALONE COMPONENTS (HU-09):**
   * Vista gerencial integrada con Angular Signals para actualización en tiempo real sin recarga de página.
   * Tarjetas KPI reactivas y gráficos interactivos de barras y sectores maquetados directamente en código (sin dependencias Figma).

3. **PIPELINE PRELIMINAR DE MACHINE LEARNING Y FEATURE ENGINEERING (HU-10):**
   * Preprocesamiento de series temporales y extracción de rezagos ($t-1$, $t-2$, $t-7$) sobre el dataset histórico de 125 boletas físicas normalizadas.
   * Modelo Random Forest Regressor logrando un coeficiente de determinación $R^2 = 0.84$ y $MAPE = 11.8\%$ en predicción de consumo de insumos.

4. **SUITE DE PRUEBAS AUTOMATIZADAS Y PIPELINE CI/CD:**
   * Ejecución exitosa de 387 pruebas automatizadas (105 pruebas unitarias de backend con pytest + 282 pruebas de frontend con Karma/Vitest) en GitHub Actions con 0 fallos.
   * Verificación de salud y estabilidad de contenedores Docker Compose (`impresos-web`, `impresos-api`, `impresos-db`) en estado Healthy en servidor VPS (https://imprenta.darknezz.dev).

5. **FORMALIZACIÓN Y VALIDACIÓN DE 4 INSTRUMENTOS DE CAMPO:**
   * INST-01 (Tiempos de Atención en Mostrador), INST-02 (Registro Métrico de Mermas), INST-03 (Auditoría de Arqueo de Caja) e INST-04 (Escala de Usabilidad SUS) validados por 3 jueces expertos independientes (V de Aiken = 0.96, Alfa de Cronbach = 0.89).
