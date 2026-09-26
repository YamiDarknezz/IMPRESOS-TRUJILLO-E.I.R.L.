# INFORME DE ESTADO DEL PROYECTO

**Proyecto:** Implementación de un sistema web transaccional con módulos de inteligencia de negocios e inteligencia artificial para la optimización de los procesos operativos en la empresa Impresos Trujillo E.I.R.L.  
**Fecha de Emisión:** 26/09/2026 | **Versión:** 1.0  
**Líder de Proyecto:** Gerardo Erick Plasencia Torres  
**Equipo de Desarrollo:** Gerardo Erick Plasencia Torres, Jose Estibb Anhuaman Delgado, Jose Diego Rodríguez Vásquez  

---

## Control de Versiones

| Versión | Fecha | Modificaciones Realizadas | Autores |
|:---:|:---:|:---|:---|
| **1.0** | 26/09/2026 | Emisión formal del Informe de Estado del Proyecto al cierre de la Semana 5 (Sprint 2): consolidación del primer incremento de software funcional (catálogo de insumos, tracking de bobinas UV DTF y planchas MDF, ventas express, arqueo de caja con candado digital y pipeline CI/CD automatizado), sinceramiento de indicadores EVM, y articulación con el Acta de Aceptación de Entregables formal suscrita con la gerencia. | Gerardo Plasencia, Jose Estibb Anhuaman, Diego Rodríguez |

---

## 1. Descripción del Proyecto

El presente proyecto consiste en el diseño, desarrollo e implementación de un sistema web transaccional con módulos de inteligencia de negocios e inteligencia artificial para la empresa **Impresos Trujillo E.I.R.L.** La solución optimiza el flujo de cotizaciones, ventas de mostrador express con anticipo mínimo del 50%, talonario correlativo único, inventario continuo de bobinas y sustratos rígidos con cálculo automático de mermas y rentabilidad neta, arqueo diario de caja auditado con candado digital contra entregas no pagadas o pagos fraudulentos, y canal de despliegue continuo contenerizado (CI/CD) alojado en VPS particular propio.

---

## 2. Semáforo Global del Proyecto

| Parámetro de Control | Semáforo | % Obtenido | Fórmula y Criterio Metodológico de Cálculo |
|:---|:---:|:---:|:---|
| **Alcance** | **VERDE** | **83.3%** | $\frac{\sum \text{Cumplimiento binario de actividades EDT}}{\text{Total de actividades planificadas}} = \frac{100\% + 100\% + 100\% + 100\% + 100\% + 0\%}{6} = \mathbf{83.3\%}$<br>*(Supera ampliamente el umbral mínimo del 75.0% estipulado en la leyenda oficial; Anexo 1, Tabla 3 y Anexo 2, Tabla 6).* |
| **Tiempo** | **VERDE** | **91.7%** | $\frac{\text{Días de trabajo ejecutados en plazo}}{\text{Total de días programados}} \times 100\% = \frac{11 \text{ días}}{12 \text{ días}} \times 100\% = \mathbf{91.7\%}$<br>*(Supera con creces el umbral mínimo del 75.0%; 1 solo impedimento técnico resuelto en <24h; Anexo 1, Tabla 4 y Anexo 2, Tabla 7).* |
| **Costo** | **VERDE** | **95.0%** | $\frac{\text{Costo Real Incurrido (AC)}}{\text{Valor Planificado (PV)}} \times 100\% = \frac{\text{S/ } 1,520.00}{\text{S/ } 1,600.00} \times 100\% = \mathbf{95.00\%}$<br>*(Costo real menor al 100% presupuestado; genera economía favorable neta de S/ 80.00 en el período; Anexo 1, Tabla 5 y Anexo 2, Tabla 8).* |

### Explicación y Justificación de los Indicadores

- **Respecto al Alcance (VERDE - 83.3%):**  
  El indicador se calculó mediante la media ponderada del cumplimiento binario (regla estricta 100% o 0% estipulada por la cátedra) de las 6 actividades técnicas programadas para el ciclo en la EDT (ver Anexo 1, Tabla 3). Cinco de las seis actividades de entrega han sido completadas técnicamente al 100% (EDT 4.1.1.3 Parametrización de catálogo de insumos y tracking de bobinas/planchas, EDT 4.1.3 Definición formal de Definition of Done para Sprint 2, EDT 4.2.1.1 Módulo de Ventas Rápidas y Talonario con anticipo obligatorio 50%, EDT 4.2.1.2 Auditoría y arqueo de caja con candado digital, y EDT 5.2.2 Pipeline CI/CD automatizado y control de versiones continuo). La actividad EDT 4.2.1.3 (Dashboard de Business Intelligence gerencial) se computa formalmente al 0% por regla binaria al estar programada para el Sprint 3 / Semana 6. Al situarse el cumplimiento en 83.3%, supera el umbral mínimo del 75.0% estipulado en la leyenda oficial (Anexo 2, Tabla 6), asignándole semáforo VERDE.

- **Respecto al Tiempo (VERDE - 91.7%):**  
  El indicador se calculó evaluando la relación entre los días de trabajo completados estrictamente dentro del cronograma previsto frente al total de días planificados para las actividades evaluadas (11 días en plazo / 12 días planificados = 91.7%). Cinco actividades críticas se ejecutaron estrictamente dentro de sus duraciones estimadas de 1 a 3 días. Se registró un único desfase menor de 0.5 días en la consolidación de fixtures de base de datos para pruebas automatizadas en backend (Día 3), el cual fue resuelto y absorbido el Día 4 sin alterar el hito de entrega del período. Dado que el 91.7% supera con creces el umbral mínimo del 75.0% (Anexo 2, Tabla 7), el indicador de tiempo se clasifica en VERDE, respaldado por un SPI de 0.98.

- **Respecto al Costo (VERDE - 95.0%):**  
  El indicador se determinó mediante el cociente directo entre el Costo Real Incurrido (AC) y el Valor Planificado presupuestado (PV) para las actividades del ciclo evaluado (S/ 1,520.00 / S/ 1,600.00 = 95.00%). El costo incurrido en el ciclo asciende a S/ 1,520.00 frente a un presupuesto previsto de S/ 1,600.00, generando una economía favorable neta de S/ 80.00 (ahorro del 5.00%). A nivel acumulado consolidado (Semanas 1 a 5), el costo real ejecutado por el equipo asciende a S/ 2,920.00 frente a un PV acumulado de S/ 3,100.00 (ahorro global de S/ 180.00). De acuerdo con la escala oficial (Anexo 2, Tabla 8), al ser el costo real menor o igual al 100% del costo presupuestado, el semáforo corresponde a VERDE, evidenciado por un índice de rendimiento de costo CPI = 1.05.

---

## 3. Sustento del Estado del Proyecto

En estricto cumplimiento de las directrices académicas y metodológicas de la cátedra, la justificación de desempeño operativo se desglosa formalmente por dimensión:

- **Sustento del Alcance:**  
  Durante el Sprint 2 (Semana 5), el equipo de desarrollo consolidó el núcleo funcional operativo del sistema: se implementó el tracking individual de bobinas continuas (UV DTF Film A+B de 100m) y planchas rígidas (MDF 2.44x1.22m), el módulo de venta rápida express de mostrador, el talonario digital con validación de anticipo del 50%, y el arqueo diario de caja auditado con candado digital. Asimismo, se integró el pipeline automatizado de Integración y Despliegue Continuo (CI/CD) en GitHub Actions hacia el VPS particular propio, y se consolidó una batería de 374 pruebas automatizadas con 100% de éxito (93 pruebas en backend con pytest y 281 pruebas en frontend con Vitest), asegurando el cumplimiento estricto del Definition of Done (DoD) formal para garantizar la calidad del incremento entregable.

- **Sustento del Tiempo:**  
  El cronograma de trabajo del Sprint 2 se cumplió conforme a las estimaciones de la planificación ágil. El único impedimento técnico reportado en el Scrum Diario (ajuste de tipos de datos en modelos relacionales SQLAlchemy para la migración Alembic `70522830813f`) fue resuelto en menos de 24 horas por el equipo técnico. Se mantuvo la cadencia de entregas intermedias, permitiendo llegar a la sesión de Sprint Review y reunión técnica con el cliente en la fecha comprometida (26/09/2026), logrando un SPI de 0.98.

- **Sustento del Costo:**  
  La administración de recursos financieros mantuvo una disciplina estricta. El esfuerzo de desarrollo de los tres integrantes (Gerardo Plasencia, Jose Estibb Anhuaman y Jose Diego Rodríguez) se optimizó mediante la automatización integral de pruebas (374 pruebas entre backend pytest y frontend Vitest) y el empaquetado en contenedores Docker y Nginx, prescindiendo de servicios de nube de terceros de alto costo. Esto consolidó un Cost Performance Index (CPI) de 1.05 y un Schedule Performance Index (SPI) de 0.98.

---

## 4. Cambios Principales Ocurridos desde el Último Reporte Emitido

En el presente ciclo de evaluación (Semana 5), se formalizan los siguientes refinamientos operativos de alcance y mejoras funcionales consensuadas con la gerencia en la Reunión Técnica de Coordinación:

1. **Refinamiento de Control de Materiales Continuos y Rígidos (HU-02 / EDT 4.1.1.3):**  
   A partir de las sesiones de coordinación técnica con la gerencia, se refinó el alcance del catálogo para incorporar el control individualizado de bobinas continuas (UV DTF Film A+B de 100m) y sustratos rígidos (planchas MDF de 2.44x1.22m). Esta mejora registra el costo de adquisición de la pieza entera, las dimensiones de cada corte por orden de trabajo, la merma resultante y calcula dinámicamente la rentabilidad neta por pieza. El refinamiento fue absorbido en el Sprint 2 sin desvíos de presupuesto ni plazo.

2. **Refinamiento en Arqueo de Caja y Prevención de Fraude (HU-08 / EDT 4.2.1.2):**  
   En respuesta a la problemática operativa de desbalance de caja por comprobantes electrónicos no validados ("Yape falso") o billetes adulterados, se incorporó en el módulo de Caja la acción de "Observar / Anular Pago". Al observarse una transacción, el monto se descuenta automáticamente del arqueo físico de caja y se reactiva de inmediato el Candado Digital de entrega sobre la orden hasta la regularización del cobro legítimo. Refinamiento operativo sin impacto económico ni desfase en el cronograma.

3. **Automatización de Despliegue Continuo CI/CD (EDT 5.2.2):**  
   Se implementó el pipeline de integración y despliegue continuo mediante GitHub Actions (`.github/workflows/ci.yml` y `deploy.yml`) hacia el servidor VPS propio con reverse proxy Nginx y SSL. Permite la compilación y ejecución automática de las suites completas de pruebas unitarias (374 pruebas: 93 en backend con pytest y 281 en frontend con Vitest) ante cada push/PR, optimizando el ciclo de entrega técnica sin costo adicional de licenciamiento.

---

## 5. Hitos y Entregables Formales del Período

> **Regla de Estado Formal (Observación de Cátedra #71):** Un entregable únicamente puede declararse formalmente como *"ENTREGADO Y ACEPTADO"* si cuenta con su respectiva **Acta de Aceptación de Entregables** suscrita formalmente por la contraparte de la empresa. Por tanto, los entregables del Sprint 1 formalizados pasan al estado aceptado mediante el acta del 26/09/2026, mientras que los entregables técnicos culminados del Sprint 2 quedan clasificados como *"EN PROCESO (Culminado técnicamente / Incluido en Acta de Aceptación para suscripción en reunión del 26/09/2026)"*.

| Código EDT | ACTIVIDAD | Entregable Tangible | Fecha Planeada | Fecha Real | Estado Metodológico |
|:---:|:---|:---|:---:|:---:|:---|
| **EDT 4.1.2** | Priorización del Product Backlog e historias de usuario | Documento Product Backlog formalizado con 10 historias y criterios DoD | 16/09/2026 | 16/09/2026 | **ENTREGADO Y ACEPTADO FORMALMENTE** (Consolidado en Acta de Aceptación suscrita el 26/09/2026) |
| **EDT 3.4.1** | Diseño de interfaces de usuario de alta fidelidad | Prototipos visuales de interfaz (Login, Cotizador, Taller y Caja) | 17/09/2026 | 17/09/2026 | **ENTREGADO Y ACEPTADO FORMALMENTE** (Consolidado en Acta de Aceptación suscrita el 26/09/2026) |
| **EDT 4.1.1** | Construcción de Módulo Transaccional Base (Seguridad y Autenticación JWT) | Servicio backend de autenticación JWT y componente reactivo de Login en Angular 21 | 19/09/2026 | 19/09/2026 | **ENTREGADO Y ACEPTADO FORMALMENTE** (Consolidado en Acta de Aceptación suscrita el 26/09/2026) |
| **EDT 4.1.1** | Construcción de Módulo Transaccional Base (Catálogo, Insumos y Bobinas) | Script de migración Alembic `70522830813f` y módulo de tracking de bobinas UV DTF y planchas MDF | 23/09/2026 | 24/09/2026 | **EN PROCESO** (Culminado técnicamente / Incluido en Acta de Aceptación para suscripción en reunión del 26/09/2026) |
| **EDT 4.2.1** | Módulo de Cobros, Caja y Candado Digital (Ventas Rápidas y Auditoría) | Módulo de cotización, venta express, talonario con anticipo 50% y arqueo auditado | 26/09/2026 | 25/09/2026 | **EN PROCESO** (Culminado técnicamente / Incluido en Acta de Aceptación para suscripción en reunión del 26/09/2026) |
| **EDT 5.2.2** | Automatización de Despliegue y Control de Versiones | Pipeline CI/CD en GitHub Actions y orquestación Docker en VPS particular | 25/09/2026 | 25/09/2026 | **EN PROCESO** (Culminado técnicamente / Incluido en Acta de Aceptación para suscripción en reunión del 26/09/2026) |
| **EDT 4.2.1.3** | Módulo de Business Intelligence y Dashboard Gerencial | Dashboard reactivo con gráficos de rentabilidad y reportes de producción | 03/10/2026 | Pendiente | **PLANIFICADO** (Programado en cronograma para Sprint 3 / Semana 6) |

---

## 6. Indicadores Clave de Desempeño (KPIs / EVM)

### Dimensión Tiempo — El Proyecto está en plazo (Adelantado en componentes críticos de Sprint 2)
- **Schedule Variance (SV):** $\text{EV} - \text{PV} = \text{S/ } 1,570.00 - \text{S/ } 1,600.00 = \mathbf{-S/\ 30.00}$ *(Desfase marginal absorbido en holgura de sprint)*
- **Schedule Performance Index (SPI):** $\frac{\text{EV}}{\text{PV}} = \frac{\text{S/ } 1,570.00}{\text{S/ } 1,600.00} = \mathbf{0.98}$ *(Eficiencia de cronograma: 98%, dentro del umbral verde de alta tolerancia > 0.95)*

### Dimensión Costo — El Proyecto está por debajo de lo presupuestado (Ahorro económico favorable)
- **Cost Variance (CV):** $\text{EV} - \text{AC} = \text{S/ } 1,570.00 - \text{S/ } 1,520.00 = \mathbf{+S/\ 50.00}$ *(Ahorro directo en el sprint a favor del proyecto)*
- **Cost Performance Index (CPI):** $\frac{\text{EV}}{\text{AC}} = \frac{\text{S/ } 1,570.00}{\text{S/ } 1,520.00} = \mathbf{1.03}$ *(Rendimiento presupuestal superior a la unidad)*

---

## ANEXO 1: Detalle de Validación Analítica con Códigos EDT

### Tabla 3: Detalle de Validación del Alcance (Regla Binaria: 100% o 0%)

| Código EDT | ACTIVIDAD EVALUADA | ENTREGABLE TANGIBLE ASOCIADO | % CUMPLIMIENTO |
|:---:|:---|:---|:---:|
| **EDT 4.1.1.3** | Parametrización de catálogo de insumos y tracking de bobinas/planchas | Migración Alembic `70522830813f`, modelos SQLAlchemy y UI de control de rollos UV DTF y planchas MDF con cálculo de ganancia neta | **100%** |
| **EDT 4.1.3** | Definición de Definition of Done (DoD) y validación de historias | Matriz DoD formalizada con criterios de aceptación Gherkin para HU-02, HU-03, HU-04, HU-07 y HU-08 | **100%** |
| **EDT 4.2.1.1** | Módulo de Ventas Rápidas y Talonario con anticipo obligatorio 50% | Endpoint `/api/ordenes/caja-rapida`, cotización con anticipo mínimo del 50% y talonario comercial digital | **100%** |
| **EDT 4.2.1.2** | Auditoría y Arqueo de Caja con reactivación de Candado Digital | Servicio `caja_service.py` con endpoint `/api/caja/pagos/{id}/observar`, deducción de pagos fraudulentos y reapertura de candado | **100%** |
| **EDT 5.2.2** | Pipeline CI/CD automatizado y control de versiones continuo | Workflows de GitHub Actions (`ci.yml`, `deploy.yml`), reverse proxy Nginx y despliegue a VPS particular | **100%** |
| **EDT 4.2.1.3** | Módulo de Business Intelligence y Dashboard Gerencial | Dashboard analítico de rentabilidad por insumo y métricas financieras gerenciales | **0%** |
| **TOTAL** | **Cumplimiento Promedio Global del Período** | **6 actividades EDT evaluadas bajo regla binaria (100% o 0%)** | **83.3% (VERDE)** |

### Tabla 4: Detalle de Validación del Tiempo (Cumplimiento de Cronograma)

| Código EDT | ACTIVIDAD EVALUADA | DURACIÓN ESTIMADA | DURACIÓN REAL | % CUMPLIMIENTO |
|:---:|:---|:---:|:---:|:---:|
| **EDT 4.1.1.3** | Modelado de bobinas/planchas y migración Alembic | 3 días | 3 días | **100.0%** |
| **EDT 4.1.3** | Refinamiento DoD y criterios de aceptación Gherkin | 1 día | 1 día | **100.0%** |
| **EDT 4.2.1.1** | Venta Rápida express y cotizador en Angular / FastAPI | 2 días | 2 días | **100.0%** |
| **EDT 4.2.1.2** | Auditoría de caja, deducción y candado digital | 2 días | 2 días | **100.0%** |
| **EDT 5.2.2** | Pipeline CI/CD en GitHub Actions y Nginx VPS | 2 días | 2 días | **100.0%** |
| **EDT 5.1.1** | Suite de 374 pruebas automatizadas (backend pytest + frontend Vitest) | 2 días | 2.5 días (resuelto) | **80.0%** |
| **TOTAL** | **Cumplimiento Promedio de Tiempo** | **12 días planificados** | **12.5 días insumidos** | **91.7% (VERDE)** |

### Tabla 5: Detalle de Validación de Costos (Ejecución Presupuestal)

| Código EDT | ACTIVIDAD EVALUADA | VALOR PLANIFICADO (PV) | COSTO REAL (AC) | VARIACIÓN |
|:---:|:---|:---:|:---:|:---:|
| **EDT 4.1.1.3** | Parametrización de catálogo, bobinas UV DTF y planchas MDF | S/ 300.00 | S/ 280.00 | +S/ 20.00 |
| **EDT 4.1.3** | Definition of Done y refinamiento de historias de usuario | S/ 100.00 | S/ 90.00 | +S/ 10.00 |
| **EDT 4.2.1.1** | Módulo de Ventas Rápidas de mostrador y Talonario comercial | S/ 350.00 | S/ 340.00 | +S/ 10.00 |
| **EDT 4.2.1.2** | Auditoría y arqueo de caja con candado digital | S/ 350.00 | S/ 330.00 | +S/ 20.00 |
| **EDT 5.2.2** | Pipeline CI/CD automatizado y orquestación Docker en VPS | S/ 250.00 | S/ 240.00 | +S/ 10.00 |
| **EDT 5.1.1** | Batería integral de pruebas automatizadas (374 tests backend/frontend) | S/ 250.00 | S/ 240.00 | +S/ 10.00 |
| **TOTAL** | **VALORIZACIÓN TOTAL DEL PERÍODO** | **S/ 1,600.00** | **S/ 1,520.00** | **+S/ 80.00** |
| **MÉTRICA** | **Porcentaje de Variación Presupuestal (AC / PV)** | **95.0%** | *(Ahorro neto favorable: 5.00%)* | **VERDE** |

---

## ANEXO 2: Leyenda Oficial de Clasificación por Semáforo

### Leyenda del Alcance (Tabla 6)
- **VERDE:** Los entregables correspondientes al período de evaluación se han completado en un porcentaje mayor o igual a 75%.
- **AMARILLO:** Los entregables correspondientes al período de evaluación se han completado en un porcentaje menor a 75%, pero mayor o igual a 50%.
- **ROJO:** Los entregables correspondientes al período de evaluación se han completado en un porcentaje menor a 50%.

### Leyenda del Tiempo (Tabla 7)
- **VERDE:** Las actividades correspondientes al período de evaluación se han completado dentro del plazo previsto en un porcentaje mayor o igual a 75%.
- **AMARILLO:** Las actividades correspondientes al período de evaluación se han completado dentro del plazo previsto en un porcentaje menor a 75%, pero mayor o igual a 50%.
- **ROJO:** Las actividades correspondientes al período de evaluación se han completado dentro del plazo previsto en un porcentaje menor a 50%.

### Leyenda del Costo (Tabla 8)
- **VERDE:** El costo real de las actividades correspondientes al período de evaluación es menor o igual al 100% del costo presupuestado.
- **AMARILLO:** El costo real de las actividades correspondientes al período de evaluación es mayor al 100% del costo presupuestado, pero menor o igual al 110%.
- **ROJO:** El costo real de las actividades correspondientes al período de evaluación es mayor al 110% del costo presupuestado.
