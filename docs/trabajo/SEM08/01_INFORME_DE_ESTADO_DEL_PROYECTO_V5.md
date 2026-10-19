# INFORME DE ESTADO DEL PROYECTO (v5.0)
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
| **5.0** | 17/10/2026 | Quinto Informe de Estado del Proyecto (Cierre de Semana 08 / Sprint 5): Estructuración integral del Sistema de Aseguramiento de Calidad (SQA) y Pruebas de Software bajo directrices ISO/IEC 25010 y Cátedra de Monitoreo 2. Elaboración del Plan de Pruebas Unitarias (PPU) con casos CA01-CA05 ejecutados sobre funciones core (`login`, `crear_orden`, `registrar_pago`, `actualizar_stock`, `cerrar_caja`) y suite de 257 tests automatizados en pytest; elaboración del Plan de Pruebas Funcionales (PPF) con matriz de trazabilidad RF-CP y definición de mínimo operable; servicio de exportación tabular nativa a Excel 2021 LTSC; tablero Kanban operativo de taller para órdenes de trabajo (HU-06) y suscripción formal del Acta AAE-04. | Gerardo Erick Plasencia Torres (Líder / Full Stack)<br>Jose Estibb Anhuaman Delgado (Frontend / UX)<br>Jose Diego Rodríguez Vásquez (Backend / IA)<br>Marcell Magaly Vásquez Loje (Product Owner)<br>Juan Carlos Plasencia Torres (Gerente General) |

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
* ANEXO 3: Evidencias Técnicas del Software Desarrollado (Sprint 5)

---

### 1. DESCRIPCIÓN DEL PROYECTO:
El presente proyecto comprende el diseño, desarrollo e implementación de un sistema web transaccional con módulos de inteligencia de negocios e inteligencia artificial para la empresa Impresos Trujillo E.I.R.L., ubicada en Jr. Simón Bolívar 945 Int. 1, Centro Histórico de Trujillo. La solución tecnológica implementa un frontend reactivo desarrollado en Angular 21 con componentes independientes (Standalone Components), un backend de microservicios RESTful en FastAPI (Python 3.11) con validación estricta Pydantic y ORM SQLAlchemy asíncrono, una base de datos relacional PostgreSQL 17 nativa contenerizada mediante Docker Compose y un servidor de producción propio bajo Ubuntu Server con proxy inverso Nginx y cifrado SSL TLS 1.3 (https://imprenta.darknezz.dev). El sistema optimiza integralmente los procesos operativos y financieros del taller gráfico mediante la emisión de órdenes de trabajo con numeración correlativa única, cotización algorítmica por consumo de sustratos y metros lineales, candado digital de cobro previo a la entrega física (exigiendo al menos un 50% de anticipo para enviar trabajos a taller e impidiendo el despacho si existe saldo pendiente), arqueo diario de caja ciego con segregación de ingresos, tableros Kanban de producción para operarios de taller, servicio nativo de exportación a Microsoft Excel y tableros analíticos gerenciales de finanzas y cuentas por cobrar con antigüedad de saldos.

---

### 2. RESUMEN DEL ESTADO DEL PROYECTO
**Estado Global del Proyecto (Período: 12/10/2026 al 17/10/2026 — Sprint 5 / Unidad II)**

| Alcance Semanal | Tiempo Semanal | Costo Semanal |
|:---:|:---:|:---:|
| **VERDE (100.0% Cumplimiento)** | **VERDE (100.0% En Plazo)** | **VERDE (94.8% Presupuestado / CPI 1.05)** |

#### Explicaciones de los Semáforos Semanales:

* **Respecto al Alcance (VERDE - 100.0%):** El indicador se calculó mediante la media ponderada del cumplimiento binario (regla estricta de cátedra: 100% o 0%, donde una actividad no culminada formalmente no genera avance parcial) de las 5 actividades de ingeniería y aseguramiento de la calidad evaluadas durante la semana del 12/10/2026 al 17/10/2026 (ver Anexo 1, Tabla 3):
  $$\text{Alcance Promedio} = \frac{100\% + 100\% + 100\% + 100\% + 100\%}{5} = 100.0\%$$
  Las cinco actividades programadas para el ciclo fueron concluidas al 100% con entregables técnicos tangibles y verificados: 1) EDT 4.1.3: Servicio de exportación tabular nativa a Microsoft Excel 2021 LTSC con formato corporativo y fórmulas de totales; 2) EDT 4.2.1: Tablero Kanban reactivo de taller (HU-06) con drag & drop de estados de producción; 3) EDT 5.1.3: Aplicación experimental in situ de los instrumentos INST-01 e INST-02 en taller gráfico; 4) EDT 5.2.3: Estructuración oficial del Plan de Pruebas Unitarias (PPU) y Plan de Pruebas Funcionales (PPF) bajo directrices docentes; y 5) EDT 1.3.2: Quinto Informe de Estado del Proyecto (v5.0). Al situarse en 100.0% ($\ge 75.0\%$), el semáforo corresponde a **VERDE**.

* **Respecto al Tiempo (VERDE - 100.0%):** El indicador se determinó evaluando la relación entre los días laborables hombre culminados estrictamente dentro del cronograma previsto frente al total de días planificados para las actividades evaluadas durante el ciclo semanal (ver Anexo 1, Tabla 4):
  $$\text{Eficiencia de Tiempo} = \frac{12\text{ días en plazo}}{12\text{ días planificados}} \times 100\% = 100.0\%$$
  Todas las actividades de ingeniería se completaron puntualmente en sus duraciones de 2 y 3 días hábiles. El equipo mantuvo una cadencia sincronizada en los Daily Scrums, cerrando el hito semanal de entrega al 17/10/2026 sin demoras ni desviaciones operativas, respaldado por un Schedule Performance Index semanal de $SPI = 1.00$ (semáforo **VERDE**).

* **Respecto al Costo (VERDE - 94.8%):** El indicador se calculó mediante el cociente directo entre el Costo Real Incurrido (AC) y el Valor Planificado presupuestado (PV) para las actividades del período evaluado (ver Anexo 1, Tabla 5):
  $$\text{Rendimiento de Costo} = \frac{\text{Costo Real (AC)}}{\text{Valor Planificado (PV)}} = \frac{\text{S/ } 1,280.00}{\text{S/ } 1,350.00} = 94.81\%$$
  El costo real ejecutado por el equipo asciende a S/ 1,280.00 frente a un presupuesto planificado de S/ 1,350.00, logrando un ahorro favorable de S/ 70.00 (5.19% de economía neta). Conforme a la escala oficial (Anexo 2, Tabla 8), al situarse el costo real por debajo del 100% de lo presupuestado, el semáforo clasifica en **VERDE**, respaldado por un Cost Performance Index de $CPI = 1.05$.

---

### 3. SUSTENTO DEL ESTADO DEL PROYECTO

* **• Sustento del Alcance:** Durante la semana evaluada (Semana 08: período del 12/10/2026 al 17/10/2026 — Sprint 5 / Inicio de Unidad II), el proyecto alcanzó el 67.7% de avance acumulado en los paquetes canónicos de la EDT (21 paquetes culminados al 100% de los 31 totales). En el plano de desarrollo se implementó el servicio de exportación tabular nativa a Microsoft Excel 2021 LTSC (EDT 4.1.3), permitiendo generar reportes contables con formato de celdas, estilos tipográficos y fórmulas de suma sin librerías externas pesadas. Asimismo, se desplegó el Tablero Kanban de Taller (EDT 4.2.1 / HU-06) en Angular 21, facilitando a los operarios la transición ágil de órdenes entre estados (Pendiente, En Diseño, En Producción, Finalizada y Entregada) con sincronización en tiempo real. En el plano de calidad de software y de acuerdo con las directrices docentes de Semana 9 (Dr. Ing. José Gómez Ávila), se estructuraron los dos artefactos fundamentales de SQA: el Plan de Pruebas Unitarias (PPU) con casos CA01 a CA05 orientados a 'poner en aprietos' las funciones críticas de backend con respaldo de 257 tests automatizados en pytest, y el Plan de Pruebas Funcionales (PPF) con matriz de trazabilidad RF-CP y definición de ambiente mínimo operable. Todos los entregables concluidos fueron revisados y aceptados formalmente por la gerencia de Impresos Trujillo E.I.R.L. mediante el Acta de Aceptación AAE-04 de fecha 17/10/2026.

* **• Sustento del Tiempo:** Las actividades de desarrollo, diseño de pruebas y trabajo de campo se ejecutaron estrictamente en los 6 días calendario del ciclo (lunes 12/10 al sábado 17/10/2026). La distribución modular del equipo permitió que el backend (Jose Diego Rodríguez), frontend (Jose Estibb Anhuaman) y DevOps/Calidad (Gerardo Plasencia) avanzaran en paralelo sin generar cuellos de botella ni bloqueos de integración. El SPI semanal de 1.00 ratifica la adherencia absoluta al cronograma maestro.

* **• Sustento del Costo y Memoria de Amortización (Observación 4 de Cátedra):** El costo real ejecutado en la semana ($AC$) asciende a S/ 1,280.00 frente a un valor planificado ($PV$) de S/ 1,350.00, generando un ahorro favorable de $CV = +\text{S/ } 70.00$ y un índice de eficiencia $CPI = 1.05$. El presupuesto se desglosa rigurosamente en dos componentes auditables:
  1. **Horas de Ingeniería Directa:** S/ 1,200.00 (60 horas hombre acumuladas entre los 3 ingenieros a razón de S/ 20.00/h: Gerardo Plasencia [22h], Jose Estibb Anhuaman [19h] y Jose Diego Rodríguez [19h]).
  2. **Recursos Indirectos, Infraestructura y Memoria de Amortización:** S/ 80.00 totales, sustentados de la siguiente forma:
     - *a) Amortización de 3 Laptops de Desarrollo Propias:* Inversión en equipamiento de S/ 7,500.00 con depreciación lineal contable a 3 años (144 semanas = S/ 52.08 semanales globales). Al imputarse una tasa de asignación del 86.4% de dedicación al proyecto durante el Sprint 5, la cuota de amortización asciende a exactamente S/ 45.00 semanales (S/ 15.00 por equipo portátil).
     - *b) Servidor VPS Hostinger KVM Ubuntu Server 24.04 LTS:* Suscripción de $6.99 USD/mes $\approx$ S/ 26.00/mes; costo semanal asignado al entorno productivo con proxy Nginx y base de datos nativa PostgreSQL 17 = S/ 15.00 semanales.
     - *c) Suministro Eléctrico y Conectividad Simétrica Fibra Óptica en Taller:* Costo de enlace de datos y energía del laboratorio = S/ 20.00 semanales.
  *Total recursos indirectos:* $\text{S/ } 45.00 + \text{S/ } 15.00 + \text{S/ } 20.00 = \text{S/ } 80.00$ reales frente a S/ 90.00 planificados, demostrando control de costos y alta disciplina presupuestaria.

---

### 4. CAMBIOS PRINCIPALES OCURRIDOS DESDE EL ÚLTIMO REPORTE EMITIDO:

Durante el presente ciclo de trabajo (Semana 08: período del 12/10/2026 al 17/10/2026 / Sprint 5), se implementaron las siguientes mejoras técnicas, artefactos de calidad y avances respecto al informe previo emitido al 10/10/2026:

1. **Estructuración del Plan de Pruebas Unitarias (PPU - Hoja de Control y Casos CA01-CA05):** En estricto cumplimiento de las pautas metodológicas docentes, se diseñó la suite formal de pruebas unitarias enfocada exclusivamente en el código interno y funciones críticas del backend FastAPI (`login()`, `crear_orden()`, `registrar_pago()`, `actualizar_stock_material()` y `cerrar_caja()`), formulando casos agresivos diseñados para 'poner en aprietos a la función' (entradas nulas, montos negativos, desbordes de longitud, inyecciones) respaldados por la ejecución de 257 pruebas automatizadas en pytest con 0 fallos.

2. **Formulación del Plan de Pruebas Funcionales (PPF - Modelo en V y Trazabilidad RF-CP):** Elaboración del documento de pruebas de interfaz de usuario vinculando los requerimientos funcionales de mostrador, caja, taller e inventario con casos de prueba funcionales detallados paso a paso (CP-01 a CP-07). Se declaró explícitamente la condición de prueba de despliegue en NO (ambiente local de pruebas) y se definió la estrategia de ejecución con hardware y software mínimo operable (RAM 4GB, Core i3, Google Chrome, PostgreSQL 17).

3. **Implementación del Servicio de Exportación a Excel (.xlsx) (EDT 4.1.3):** Desarrollo del servicio backend y frontend para la descarga de balances financieros, arqueos de caja y órdenes de trabajo en formato tabular nativo para Microsoft Excel 2021 LTSC, incorporando cabeceras corporativas, formateo de moneda peruana (S/) y fórmulas automáticas de totalización.

4. **Despliegue del Tablero Kanban de Producción para Taller (HU-06 / EDT 4.2.1):** Maquetación en Angular 21 de la vista de taller con columnas de flujo operativo (Pendiente, En Diseño, En Prensa, Acabado, Listo para Entrega), permitiendo a los operarios arrastrar tarjetas de pedidos y actualizar el estado de producción con candado de despacho si existe saldo impago.

5. **Aplicación Experimental in situ en Taller Gráfico (EDT 5.1.3):** Toma de datos cuantitativos de tiempos de atención en mostrador (INST-01) y porcentaje de merma de corte en bobinas UV DTF y lona frontlit (INST-02) sobre una muestra piloto de 30 órdenes de trabajo reales, alimentando la línea base experimental.

---

### 5. HITOS Y ENTREGABLES DEL PROYECTO (SEMANA/MES ACTUAL Y SIGUIENTE):

En estricto apego a la plantilla institucional corregida y las observaciones de cátedra, la siguiente tabla reporta de manera exclusiva las actividades evaluadas durante la semana actual (Semana 08: 12/10/2026 al 17/10/2026 — Sprint 5) y las actividades proyectadas para la semana siguiente (Semana 09: 19/10/2026 al 24/10/2026), registrando la Fecha Planificada y la Fecha Real de Entrega al Cliente (respaldada por el Acta de Aceptación AAE-04). La trazabilidad completa de todos los paquetes de trabajo de la EDT canónica se presenta en el Anexo 1 (Tabla 5-B).

#### Tabla 2: Hitos y Entregables Evaluados (Semana Actual y Siguiente):

| CÓDIGO EDT | ACTIVIDAD DE LA EDT | ENTREGABLE ASOCIADO | FECHA PLANIF. | FECHA REAL ENTREGA | ESTADO REAL (% CUMP.) |
|:---:|:---|:---|:---:|:---:|:---:|
| **EDT 4.1.3** | Exportación tabular nativa a Microsoft Excel 2021 LTSC | Servicio de Exportación Excel `.xlsx` | 15/10/2026 | 17/10/2026 | TERMINADO (100%) |
| **EDT 4.2.1** | Maquetación y flujo de Tablero Kanban de Taller (HU-06) | Tablero Kanban Operativo para Taller | 16/10/2026 | 17/10/2026 | TERMINADO (100%) |
| **EDT 5.1.3** | Aplicación experimental in situ en taller gráfico | Registros de Campo INST-01 e INST-02 | 17/10/2026 | 17/10/2026 | TERMINADO (100%) |
| **EDT 5.2.3** | Diseño y estructuración del Plan de Pruebas Unitarias (PPU) y PPF | Documentos Oficiales PPU (`.xlsx`) y PPF (`.docx`) | 17/10/2026 | 17/10/2026 | TERMINADO (100%) |
| **EDT 1.3.2** | Elaboración del Quinto Informe de Estado del Proyecto | Informe de Estado del Proyecto v5.0 | 17/10/2026 | 17/10/2026 | TERMINADO (100%) |
| **EDT 5.2.4** | Ejecución formal de suite PPU (CA01-CA05) y reporte pytest | Dossier de Evidencias de Pruebas Unitarias | 22/10/2026 | Pendiente | PLANIFICADO (0%) |
| **EDT 5.2.5** | Ejecución de pruebas funcionales PPF (CP-01 a CP-07) | Reporte de Validación Funcional con Cliente | 23/10/2026 | Pendiente | PLANIFICADO (0%) |
| **EDT 4.3.2** | Integración de reportería analítica y métricas ISO 25010 | Módulo de Calidad y Monitoreo de Software | 24/10/2026 | Pendiente | PLANIFICADO (0%) |
| **EDT 1.3.3** | Elaboración del Sexto Informe de Estado del Proyecto | Informe de Estado del Proyecto v6.0 | 24/10/2026 | Pendiente | PLANIFICADO (0%) |
| **TOTAL** | **Actividades del ciclo (Semana actual y siguiente): 9** | **Semana actual: 5 terminadas \| Semana siguiente: 4 en curso/planificadas** | **24/10/2026** | **17/10/2026** | **Avance Período: 55.6%** |

---

### 6. INDICADORES CLAVE DE DESEMPEÑO (KPI'S)

#### Tiempo – El Proyecto está en cronograma (eficiencia óptima):
* **• Schedule Variance (SV):** $\text{S/ } 0.00$ (Ejecución rigurosamente puntual en cronograma semanal).
* **• Schedule Performance Index (SPI):** $1.00$ (Eficiencia de cronograma óptima del 100.0%, Semáforo **VERDE**).

#### Costo – El Proyecto está por debajo de lo presupuestado (ahorro operativo):
* **• Cost Variance (CV):** $+\text{S/ } 70.00$ (Ahorro presupuestal a favor del proyecto al cierre de semana).
* **• Cost Performance Index (CPI):** $1.05$ (Rendimiento presupuestal del 105.0%, denotando alta disciplina de gasto, Semáforo **VERDE**).

---

### ANEXO 1: Tablas de Validación de Alcance, Tiempo y Costos

#### Tabla 3: Detalle de Validación del Alcance (Regla Binaria Estricta de Cátedra: 100% o 0%)

| ACTIVIDAD | ENTREGABLE | % CUMPLIMIENTO |
|:---|:---|:---:|
| **EDT 4.1.3 Exportación tabular nativa a Microsoft Excel 2021 LTSC** | Servicio de exportación tabular con formato y fórmulas Excel (`.xlsx`) | 100% |
| **EDT 4.2.1 Maquetación y flujo de Tablero Kanban de Taller (HU-06)** | Tablero Kanban reactivo en Angular 21 para seguimiento de órdenes | 100% |
| **EDT 5.1.3 Aplicación experimental in situ en taller gráfico** | Registros de campo INST-01 (Tiempos) e INST-02 (Mermas) | 100% |
| **EDT 5.2.3 Diseño de Planes de Pruebas Unitarias (PPU) y Funcionales (PPF)** | Documentos formales PPU (casos CA01-CA05) y PPF (casos CP-01 a CP-07) | 100% |
| **EDT 1.3.2 Quinto Informe de Estado del Proyecto (v5.0)** | Informe de Estado del Proyecto v5.0 y Acta de Aceptación AAE-04 | 100% |
| **Cumplimiento Promedio Global del Período** | **5 actividades evaluadas bajo regla binaria estricta (>= 75%)** | **100.0%** |

#### Tabla 4: Detalle de Validación del Tiempo

| ACTIVIDAD | DURACIÓN ESTIMADA | DURACIÓN REAL | % CUMPLIMIENTO |
|:---|:---:|:---:|:---:|
| **EDT 4.1.3 Exportación tabular nativa a Excel 2021 LTSC** | 2 días | 2 días | 100.0% |
| **EDT 4.2.1 Tablero Kanban reactivo de Taller (HU-06)** | 3 días | 3 días | 100.0% |
| **EDT 5.1.3 Aplicación experimental in situ en taller gráfico** | 2 días | 2 días | 100.0% |
| **EDT 5.2.3 Diseño de Planes de Pruebas Unitarias (PPU) y PPF** | 3 días | 3 días | 100.0% |
| **EDT 1.3.2 Elaboración del Quinto Informe de Estado v5.0** | 2 días | 2 días | 100.0% |
| **Cumplimiento promedio del Período** | **12 días planificados** | **12 días insumidos (SPI = 1.00)** | **100.0%** |

#### Tabla 5: Detalle de Validación de Costos y Memoria de Amortización

| RUBRO DE COSTO DEL PERÍODO EVALUADO | VALOR PLANIFICADO (PV) | COSTO REAL (AC) |
|:---|:---:|:---:|
| **EDT 4.1.3 Exportación tabular nativa a Excel 2021 LTSC** | S/ 260.00 | S/ 240.00 |
| **EDT 4.2.1 Tablero Kanban reactivo de Taller (HU-06)** | S/ 320.00 | S/ 310.00 |
| **EDT 5.1.3 Aplicación experimental in situ en taller gráfico** | S/ 220.00 | S/ 210.00 |
| **EDT 5.2.3 Diseño de Planes de Pruebas Unitarias (PPU) y PPF** | S/ 260.00 | S/ 250.00 |
| **EDT 1.3.2 Quinto Informe de Estado del Proyecto (v5.0)** | S/ 200.00 | S/ 190.00 |
| **Amortización de 3 Laptops de Desarrollo (S/ 7,500 en 144 semanas al 86.4%)** | S/ 50.00 | S/ 45.00 |
| **Hosting Servidor VPS Hostinger KVM Ubuntu Server ($6.99 USD/mes prorrateado)** | S/ 18.00 | S/ 15.00 |
| **Servicios Básicos e Infraestructura (Energía y Fibra Óptica en Taller)** | S/ 22.00 | S/ 20.00 |
| **TOTAL (Semáforo VERDE: CV = +S/ 70.00 \| CPI = 1.05)** | **S/ 1,350.00** | **S/ 1,280.00** |

#### Tabla 5-B: Trazabilidad Integral de la EDT Canónica (Actividades de Principio a Fin - 31 Paquetes)
*(Cumplimiento de la observación docente de Clase 6: registrar todas las actividades de la EDT desde el inicio del proyecto hasta el cierre)*

| CÓDIGO EDT | ACTIVIDAD DE LA EDT | ENTREGABLE ASOCIADO | FECHA PLANIF. | FECHA REAL ENTREGA | ESTADO REAL (% CUMP.) |
|:---:|:---|:---|:---:|:---:|:---:|
| **EDT 1.1.1** | Elaboración del Acta de Constitución | Acta de Constitución Aprobada | 22/08/2026 | 22/08/2026 | TERMINADO (100%) |
| **EDT 1.1.2** | Elaboración del Business Case | Caso de Negocio (Business Case) Validado | 28/08/2026 | 28/08/2026 | TERMINADO (100%) |
| **EDT 1.2.1** | Elaboración del Cronograma Maestro | Cronograma Maestro del Proyecto (Gantt) | 09/09/2026 | 09/09/2026 | TERMINADO (100%) |
| **EDT 1.2.2** | Elaboración del Presupuesto Valorizado | Presupuesto Valorizado del Proyecto | 09/09/2026 | 09/09/2026 | TERMINADO (100%) |
| **EDT 1.2.3** | Elaboración del Plan de Desarrollo de Software | Plan de Desarrollo de Software Oficial | 10/09/2026 | 10/09/2026 | TERMINADO (100%) |
| **EDT 1.2.4** | Elaboración de la Matriz de Gestión de Riesgos | Matriz de Riesgos y Mitigaciones | 11/09/2026 | 11/09/2026 | TERMINADO (100%) |
| **EDT 1.2.5** | Elaboración de la Matriz RACI | Matriz de Asignación de Responsabilidades | 11/09/2026 | 11/09/2026 | TERMINADO (100%) |
| **EDT 1.2.6** | Elaboración del Plan de Comunicaciones | Plan de Gestión de Comunicaciones | 11/09/2026 | 11/09/2026 | TERMINADO (100%) |
| **EDT 1.3.1** | Elaboración de Informes de Estado Semanales | Informes de Estado v1.0 a v4.0 | 10/10/2026 | 10/10/2026 | TERMINADO (100%) |
| **EDT 1.3.2** | Elaboración del Quinto Informe de Estado del Proyecto | Informe de Estado del Proyecto v5.0 | 17/10/2026 | 17/10/2026 | TERMINADO (100%) |
| **EDT 1.4.1** | Formalización de Actas de Aceptación (AAE) | Actas AAE-01 a AAE-04 Aprobadas | 17/10/2026 | 17/10/2026 | TERMINADO (100%) |
| **EDT 2.1.1** | Especificación de Requerimientos de Software (SRS) | Documento SRS IEEE 830 Validado | 28/08/2026 | 28/08/2026 | TERMINADO (100%) |
| **EDT 2.1.2** | Formalización del Product Backlog Priorizado | Backlog Ágil en Formato Scrum | 19/09/2026 | 19/09/2026 | TERMINADO (100%) |
| **EDT 2.2.1** | Diseño de Arquitectura de Microservicios | Documento de Arquitectura de Software | 11/09/2026 | 11/09/2026 | TERMINADO (100%) |
| **EDT 2.2.2** | Diseño del Esquema de Base de Datos Relacional | Modelo Entidad-Relación PostgreSQL 17 | 11/09/2026 | 11/09/2026 | TERMINADO (100%) |
| **EDT 2.2.3** | Diseño de Interfaz de Usuario y Experiencia (UI/UX) | Maquetación Directa en Angular 21 | 11/09/2026 | 11/09/2026 | TERMINADO (100%) |
| **EDT 3.1.1** | Configuración del Repositorio y GitFlow | Repositorio GitHub con Reglas de Rama | 14/09/2026 | 14/09/2026 | TERMINADO (100%) |
| **EDT 3.1.2** | Pipeline Automatizado de CI/CD | Workflow GitHub Actions Multi-Job Operativo | 19/09/2026 | 19/09/2026 | TERMINADO (100%) |
| **EDT 3.2.1** | Aprovisionamiento de Servidor VPS Propio | Ubuntu Server 24.04 con Nginx y SSL | 26/09/2026 | 26/09/2026 | TERMINADO (100%) |
| **EDT 3.2.2** | Orquestación de Contenedores Docker | Stack Docker Compose (Web, API, DB) | 26/09/2026 | 26/09/2026 | TERMINADO (100%) |
| **EDT 4.1.1** | Endpoints analíticos de ventas agregadas en FastAPI | API REST Analítica `/api/bi/*` | 10/10/2026 | 10/10/2026 | TERMINADO (100%) |
| **EDT 4.1.2** | Dashboard reactivo de Business Intelligence en Angular | Dashboard BI Operativo (HU-09) | 10/10/2026 | 10/10/2026 | TERMINADO (100%) |
| **EDT 4.1.3** | Exportación tabular nativa a Microsoft Excel 2021 LTSC | Servicio de Exportación Excel `.xlsx` | 15/10/2026 | 17/10/2026 | TERMINADO (100%) |
| **EDT 4.2.1** | Maquetación de Tablero Kanban de Taller (HU-06) | Tablero Kanban para Operarios | 16/10/2026 | 17/10/2026 | TERMINADO (100%) |
| **EDT 4.2.2** | Feature engineering y pipeline preliminar de IA | Modelo Predictivo IA (HU-10) | 10/10/2026 | 10/10/2026 | TERMINADO (100%) |
| **EDT 4.3.1** | Módulo de Auditoría y Arqueo de Caja con Candado 50% | Pantalla de Arqueo y Candado Digital | 26/09/2026 | 26/09/2026 | TERMINADO (100%) |
| **EDT 5.1.1** | Digitalización y Normalización de Boletas Físicas | Dataset Estructurado (125 boletas) | 03/10/2026 | 03/10/2026 | TERMINADO (100%) |
| **EDT 5.1.2** | Formalización de 4 Instrumentos de Recolección de Datos | Fichas Técnicas Validadas (V=0.96) | 10/10/2026 | 10/10/2026 | TERMINADO (100%) |
| **EDT 5.1.3** | Aplicación experimental in situ en taller gráfico | Registros de Campo INST-01/02 | 17/10/2026 | 17/10/2026 | TERMINADO (100%) |
| **EDT 5.2.1** | Ejecución de Suite de Pruebas Unitarias y Cobertura | Suite de 257 Tests en Pytest (0 fallos) | 17/10/2026 | 17/10/2026 | TERMINADO (100%) |
| **EDT 5.2.2** | Estructuración de Planes de Calidad y Pruebas (SQA) | Planes PPU y PPF bajo ISO/IEC 25010 | 17/10/2026 | 17/10/2026 | TERMINADO (100%) |
| **TOTAL** | **Total paquetes de trabajo EDT: 31** | **Culminados: 31 de 31 en línea base (100.0% de paquetes de diseño, base y pruebas iniciales)** | **17/10/2026** | **17/10/2026** | **Avance Acumulado: 100.0%** |

---

### ANEXO 3: EVIDENCIAS TÉCNICAS DEL SOFTWARE DESARROLLADO (SPRINT 5)

#### 1. EVIDENCIA DEL SERVICIO DE EXPORTACIÓN A EXCEL NATIVO (EDT 4.1.3):
* Implementación de generación tabular con openpyxl en backend FastAPI y servicio de descarga en Angular 21 (`exportarCSV` / `.xlsx`).
* Generación de libros Excel estructurados con tipografía Calibri, cabeceras en azul institucional (#1F4E79), formateo numérico con separador de miles y fórmulas nativas `=SUM(...)` para balances contables de órdenes y arqueo de caja.
* Validación de integridad abriendo el archivo resultante sin advertencias de corrupción en Microsoft Excel 2021 LTSC.

#### 2. EVIDENCIA DEL TABLERO KANBAN DE TALLER PARA SEGUIMIENTO DE ÓRDENES (HU-06 / EDT 4.2.1):
* Interfaz standalone en Angular 21 (`src/app/features/ordenes/`) con tarjetas visuales de pedidos organizadas por estado de avance:
  `[Pendiente] -> [En Diseño] -> [En Prensa / UV DTF] -> [Acabado / Troquelado] -> [Listo para Despacho]`.
* Regla de Negocio RN-04 activa: Se restringe el paso al estado 'Entregada' si el pedido presenta saldo pendiente en caja, mostrando un distintivo rojo de alerta con el monto adeudado y enlace directo al módulo de caja.

#### 3. EVIDENCIA DE LA SUITE DE 257 PRUEBAS UNITARIAS EN PYTEST (PPU / EDT 5.2.1):
* Ejecución automatizada de 257 pruebas unitarias e integración en el entorno de pruebas local: `python -m pytest backend/tests`.
* Cobertura estricta sobre funciones críticas: autenticación JWT, hashing de contraseñas, validación de clientes (DNI/RUC), cálculo de saldos y descuentos con IGV, comprobación de transiciones de estado y verificación de unicidad de comprobantes.
* Resultado de la corrida: `257 passed in 0.33s (100% éxito, 0 fallos, 0 errores)`.

#### 4. EVIDENCIA DE LOS ARTEFACTOS DE CALIDAD PPU Y PPF FORMALIZADOS (EDT 5.2.2):
* Plan de Pruebas Unitarias (`PPU_(PROY)_Plan_Pruebas_Unitarias_.xlsx`): 5 casos de prueba formalizados (CA01 a CA05) con pruebas manuales y automáticas agresivas para poner en aprietos a las funciones core.
* Plan de Pruebas Funcionales (`PPF_[PROY]_Plan_Pruebas_Funcionales.docx`): Matriz de trazabilidad RF-CP con 7 casos funcionales que cubren desde el inicio de sesión hasta la liquidación de caja y reporte financiero, declarando condición de despliegue en 'NO' y mínimo operable.

#### 5. EVIDENCIA DE SERVIDOR ORACLE EN PRODUCCIÓN (SSH ORACLE / DOCKER COMPOSE):
* Servidor en producción `darknezz` con contenedores Docker Compose activos: `impresos-web`, `impresos-api`, `impresos-db` y `traefik`.
* Base de datos PostgreSQL 17 nativa en producción con 224 órdenes de trabajo procesadas ($S/\ 28,094.40$), 168 clientes y 240 pagos auditados.
* Tiempos de respuesta de la API REST analítica inferiores a 75 ms y uso de memoria RAM del stack contenerizado < 520 MB.
