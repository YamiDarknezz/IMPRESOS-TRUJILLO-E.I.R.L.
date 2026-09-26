# INFORME DE ESTADO DEL PROYECTO

**Proyecto:** Implementación de un sistema web transaccional con módulos de inteligencia de negocios e inteligencia artificial para la optimización de los procesos operativos en la empresa Impresos Trujillo E.I.R.L.  
**Fecha de Emisión:** 19/09/2026 | **Última Actualización:** 25/09/2026 | **Revisión:** 1.1  
**Líder de Proyecto:** Gerardo Erick Plasencia Torres  
**Equipo de Desarrollo:** Gerardo Erick Plasencia Torres, Jose Estibb Anhuaman Delgado, Jose Diego Rodríguez Vásquez  

---

## Control de Versiones

| Versión | Fecha | Modificaciones Realizadas | Autores |
|:---:|:---:|:---|:---|
| **1.0** | 19/09/2026 | Emisión inicial del Informe de Estado del Proyecto al cierre de la Semana 4. | Gerardo Plasencia, Jose Estibb Anhuaman, Diego Rodríguez |
| **1.1** | 25/09/2026 | Subsanación de observaciones de Semana 05: incorporación de códigos EDT en tablas de control, sustitución de entregables técnicos (fórmulas por script DDL y modelo relacional), sinceramiento de estado de entregables conforme a acta de aceptación formal, desglose matemático explícito de cálculo de semáforos y segregación analítica de sustentos de Alcance, Tiempo y Costo. | Gerardo Plasencia, Jose Estibb Anhuaman, Diego Rodríguez |

---

## 1. Descripción del Proyecto

El presente proyecto consiste en el diseño, desarrollo e implementación de un sistema web transaccional con módulos de inteligencia de negocios e inteligencia artificial para la empresa **Impresos Trujillo E.I.R.L.** La solución permitirá gestionar órdenes de trabajo, inventario continuo de bobinas y planchas rígidas, cobranzas con arqueo de caja diario auditado y reportes gerenciales, con el objetivo de optimizar los procesos operativos, erradicar fugas de cobranza y apoyar la toma de decisiones basada en datos dentro de la imprenta.

---

## 2. Semáforo Global del Proyecto

| Parámetro de Control | Semáforo | % Obtenido | Fórmula y Criterio Metodológico de Cálculo |
|:---|:---:|:---:|:---|
| **Alcance** | **VERDE** | **80.0%** | $\frac{\sum \text{Cumplimiento binario de actividades EDT}}{\text{Total de actividades planificadas}} = \frac{100\% + 100\% + 100\% + 100\% + 0\%}{5} = \mathbf{80.0\%}$<br>*(Supera el umbral mínimo del 75.0% estipulado en la leyenda oficial; Anexo 1, Tabla 3 y Anexo 2, Tabla 6).* |
| **Tiempo** | **VERDE** | **83.3%** | $\frac{\text{Días de trabajo ejecutados en plazo}}{\text{Total de días programados}} \times 100\% = \frac{10 \text{ días}}{12 \text{ días}} \times 100\% = \mathbf{83.3\%}$<br>*(Supera el umbral mínimo del 75.0%; 1 solo impedimento menor resuelto en <24h; Anexo 1, Tabla 4 y Anexo 2, Tabla 7).* |
| **Costo** | **VERDE** | **93.3%** | $\frac{\text{Costo Real Incurrido (AC)}}{\text{Valor Planificado (PV)}} \times 100\% = \frac{\text{S/ } 1,400.00}{\text{S/ } 1,500.00} \times 100\% = \mathbf{93.33\%}$<br>*(Costo real menor al 100% presupuestado; genera ahorro económico favorable de S/ 100.00; Anexo 1, Tabla 5 y Anexo 2, Tabla 8).* |

### Explicación y Justificación de los Indicadores

- **Respecto al Alcance (VERDE - 80.0%):**  
  El indicador se calculó mediante la media ponderada del cumplimiento binario (regla estricta 100% o 0% estipulada por la cátedra) de las 5 actividades técnicas programadas para el ciclo en la EDT. Cuatro de las cinco actividades de entrega han sido completadas técnicamente al 100% (EDT 4.1.2 Priorización del Backlog, EDT 3.4.1 Prototipos UI, EDT 4.1.1 API Auth JWT y EDT 4.1.1 Login y Guards Angular). La actividad EDT 4.1.1 Parametrización de recetas dinámicas en interfaz web se computa al 0% formalmente por regla binaria (al haberse priorizado el esquema de base de datos relacional y quedar la interfaz de usuario programada para el siguiente sprint). Al situarse el cumplimiento en 80.0%, supera el umbral mínimo del 75.0% estipulado en la leyenda oficial (Anexo 2, Tabla 6), asignándole semáforo VERDE.

- **Respecto al Tiempo (VERDE - 83.3%):**  
  El indicador se calculó evaluando la relación entre los días de trabajo completados estrictamente dentro del cronograma previsto frente al total de días planificados para las actividades evaluadas (10 días en plazo / 12 días planificados = 83.3%). Cuatro actividades críticas se completaron en su duración estimada de 2 y 3 días. Se registró un único desfase temporal menor de 1 día en la actividad de catálogo de recetas debido al ajuste de relaciones de base de datos en Docker, el cual fue resuelto y absorbido en menos de 24 horas sin alterar la fecha límite del período. Dado que el 83.3% es superior al umbral mínimo del 75.0% (Anexo 2, Tabla 7), el indicador de tiempo se clasifica en VERDE, respaldado por un SPI de 0.97.

- **Respecto al Costo (VERDE - 93.3%):**  
  El indicador se determinó mediante el cociente directo entre el Costo Real Incurrido (AC) y el Valor Planificado presupuestado (PV) para las actividades del período (S/ 1,400.00 / S/ 1,500.00 = 93.33%). El costo acumulado ejecutado por el equipo asciende a S/ 1,400.00 frente a un presupuesto previsto de S/ 1,500.00, logrando una economía favorable de S/ 100.00 (ahorro del 6.67%). De acuerdo con la escala oficial (Anexo 2, Tabla 8), al ser el costo real menor o igual al 100% del costo presupuestado, el semáforo corresponde a VERDE, evidenciado por un índice de rendimiento de costo CPI = 1.04.

---

## 3. Sustento del Estado del Proyecto

En cumplimiento de las directrices académicas, la justificación de desempeño operativo se desglosa formalmente por dimensión:

- **Sustento del Alcance:**  
  Durante el período correspondiente a la Semana 4, el equipo se enfocó en la inicialización arquitectónica del sistema web: configuración del entorno local contenerizado con Docker Compose (Angular 21 + FastAPI + PostgreSQL nativo), implementación del núcleo de autenticación y control de acceso basado en roles (JWT, bcrypt, RBAC) y diseño de la interfaz de usuario reactiva. Los entregables técnicos completados fueron validados internamente por el equipo de desarrollo. La parametrización dinámica de recetas en la interfaz web fue programada de manera estructurada para el siguiente ciclo sin comprometer la funcionalidad base.

- **Sustento del Tiempo:**  
  Las actividades de codificación y configuración se ejecutaron de manera coordinada. El único impedimento registrado (bloqueo momentáneo de integración frontend a la espera del despliegue del endpoint de autenticación en backend) fue resuelto en menos de 24 horas. El cronograma general no sufrió desvíos críticos, manteniendo la holgura operativa con un SPI de 0.97.

- **Sustento del Costo:**  
  La ejecución presupuestal se mantuvo estrictamente controlada. La inversión de horas técnicas por cada integrante del equipo (Gerardo Plasencia, Jose Estibb Anhuaman y Jose Diego Rodríguez) se optimizó mediante la reutilización de librerías nativas y pruebas automatizadas en pytest, lo que evitó retrabajos y derivó en un ahorro de S/ 100.00 respecto al monto proyectado (CPI = 1.04).

---

## 4. Cambios Principales Ocurridos desde el Último Reporte Emitido

**No aplica.** No se han registrado solicitudes de cambio ni modificaciones a la línea base de alcance, cronograma ni costos durante el presente período de evaluación. Al constituir este el primer informe formal de estado de desarrollo del proyecto (Semana 4), el trabajo se rige al 100% por la línea base original aprobada en el Acta de Constitución y el diccionario EDT.

---

## 5. Hitos y Entregables Formales del Período

> **Regla de Estado Formal:** En estricto apego a la orden de cátedra, un entregable únicamente puede declararse en estado *"TERMINADO"* si cuenta con su respectiva **Acta de Aceptación de Entregables** suscrita formalmente por la contraparte de la empresa. Por tanto, los entregables con desarrollo de software finalizado se clasifican con el rigor metodológico correspondiente como *"EN PROCESO (Culminado técnicamente / Pendiente de suscripción de Acta de Aceptación)"*.

| Código EDT | ACTIVIDAD | Entregable Tangible | Fecha Planeada | Fecha Real | Estado Metodológico |
|:---:|:---|:---|:---:|:---:|:---|
| **EDT 4.1.2** | Priorización del Product Backlog e historias de usuario | Documento Product Backlog formalizado con 10 historias y criterios DoD | 16/09/2026 | 16/09/2026 | **EN PROCESO** (Culminado técnicamente / Pendiente de suscripción de Acta de Aceptación) |
| **EDT 3.4.1** | Diseño de interfaces de usuario de alta fidelidad | Prototipos visuales de interfaz (Login, Cotizador, Taller y Caja) | 17/09/2026 | 17/09/2026 | **EN PROCESO** (Culminado técnicamente / Pendiente de suscripción de Acta de Aceptación) |
| **EDT 4.1.1** | Construcción de Módulo Transaccional Base (Seguridad y Autenticación JWT) | Servicio backend de autenticación JWT y componente reactivo de Login en Angular 21 | 19/09/2026 | 19/09/2026 | **EN PROCESO** (Culminado técnicamente / Pendiente de suscripción de Acta de Aceptación) |
| **EDT 4.1.1** | Construcción de Módulo Transaccional Base (Catálogo e Insumos) | Script DDL y modelo relacional de catálogo de insumos y recetas técnicas en PostgreSQL | 23/09/2026 | Pendiente | **EN PROCESO** (Modelo DB aplicado; parametrización web programada para siguiente ciclo) |
| **EDT 4.2.1** | Construcción de Módulo de Cobros, Caja y Business Intelligence | Módulo de cotización dinámica, talonario digital y arqueo de caja con dashboard | 26/09/2026 | Pendiente | **PLANIFICADO** (Programado en cronograma EDT) |

---

## 6. Indicadores Clave de Desempeño (KPIs / EVM)

### Dimensión Tiempo (Variación Marginal Controlada)
- **Schedule Variance (SV):** $\text{EV} - \text{PV} = \text{S/ } 1,450.00 - \text{S/ } 1,500.00 = \mathbf{-S/\ 50.00}$ *(Margen mínimo absorbido en el período)*
- **Schedule Performance Index (SPI):** $\frac{\text{EV}}{\text{PV}} = \frac{\text{S/ } 1,450.00}{\text{S/ } 1,500.00} = \mathbf{0.97}$ *(Eficiencia de cronograma: 97%, en rango de tolerancia > 0.95)*

### Dimensión Costo (Ahorro Operativo Favorable)
- **Cost Variance (CV):** $\text{EV} - \text{AC} = \text{S/ } 1,450.00 - \text{S/ } 1,400.00 = \mathbf{+S/\ 50.00}$ *(Ahorro neto a favor del proyecto)*
- **Cost Performance Index (CPI):** $\frac{\text{EV}}{\text{AC}} = \frac{\text{S/ } 1,450.00}{\text{S/ } 1,400.00} = \mathbf{1.04}$ *(Rendimiento presupuestal superior a la unidad)*

---

## ANEXO 1: Detalle de Validación Analítica con Códigos EDT

### Tabla 3: Detalle de Validación del Alcance (Regla Binaria: 100% o 0%)

| Código EDT | ACTIVIDAD EVALUADA | ENTREGABLE TANGIBLE ASOCIADO | % CUMPLIMIENTO |
|:---:|:---|:---|:---:|
| **EDT 4.1.2** | Priorización del Product Backlog | Documento Product Backlog formalizado con 10 historias y criterios DoD | **100%** |
| **EDT 3.4.1** | Diseño de interfaces de usuario UI | Prototipos visuales de interfaz (Login, Cotizador, Taller y Caja) | **100%** |
| **EDT 4.1.1.1** | Construcción de API de Autenticación JWT | Endpoints REST de login, hashing bcrypt y tokens JWT en FastAPI | **100%** |
| **EDT 4.1.1.2** | Maquetación de interfaz Login y AuthGuard | Formulario reactivo Angular 21 con guards de navegación por rol | **100%** |
| **EDT 4.1.1.3** | Parametrización de catálogo de insumos y recetas | Script DDL y modelo relacional de catálogo de insumos en PostgreSQL | **0%** |
| **TOTAL** | **Cumplimiento Promedio Global del Período** | **5 actividades EDT evaluadas bajo regla binaria (100% o 0%)** | **80.0% (VERDE)** |

### Tabla 4: Detalle de Validación del Tiempo (Cumplimiento de Cronograma)

| Código EDT | ACTIVIDAD EVALUADA | DURACIÓN ESTIMADA | DURACIÓN REAL | % CUMPLIMIENTO |
|:---:|:---|:---:|:---:|:---:|
| **EDT 4.1.1.a** | Configuración de entorno Docker local y base de datos | 2 días | 2 días | **100.0%** |
| **EDT 4.1.1.b** | Modelado relacional de tablas de Usuarios y Roles | 2 días | 2 días | **100.0%** |
| **EDT 4.1.1.c** | Servicio de autenticación JWT y roles en FastAPI | 3 días | 3 días | **100.0%** |
| **EDT 4.1.1.d** | Componente de Login y Guards de navegación Angular | 3 días | 3 días | **100.0%** |
| **EDT 4.1.1.e** | Modelo de base de datos de catálogo e insumos | 3 días | 4 días (en curso) | **50.0%** |
| **TOTAL** | **Cumplimiento Promedio de Tiempo** | **12 días planificados** | **14 días insumidos** | **83.3% (VERDE)** |

### Tabla 5: Detalle de Validación de Costos (Ejecución Presupuestal)

| Código EDT | ACTIVIDAD EVALUADA | VALOR PLANIFICADO (PV) | COSTO REAL (AC) | VARIACIÓN |
|:---:|:---|:---:|:---:|:---:|
| **EDT 4.1.1.a** | Configuración de entorno Docker Compose y PostgreSQL | S/ 250.00 | S/ 240.00 | +S/ 10.00 |
| **EDT 4.1.1.b** | Modelado relacional de datos y tablas de Usuarios | S/ 250.00 | S/ 240.00 | +S/ 10.00 |
| **EDT 4.1.1.c** | Desarrollo de API de Autenticación JWT en FastAPI | S/ 400.00 | S/ 380.00 | +S/ 20.00 |
| **EDT 4.1.1.d** | Maquetación de Login y Guards de navegación Angular 21 | S/ 400.00 | S/ 380.00 | +S/ 20.00 |
| **EDT 4.1.1.e** | Parametrización de catálogo de insumos y recetas | S/ 200.00 | S/ 160.00 | +S/ 40.00 |
| **TOTAL** | **VALORIZACIÓN TOTAL ACUMULADA** | **S/ 1,500.00** | **S/ 1,400.00** | **+S/ 100.00** |
| **MÉTRICA** | **Porcentaje de Variación Presupuestal (AC / PV)** | **93.3%** | *(Ahorro neto favorable: 6.67%)* | **VERDE** |

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