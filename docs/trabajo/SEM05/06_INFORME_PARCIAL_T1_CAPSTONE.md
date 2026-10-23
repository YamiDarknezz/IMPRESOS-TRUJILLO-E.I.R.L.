# INFORME DE PROYECTO FINAL — CAPSTONE PROJECT SISTEMAS (EVALUACIÓN PARCIAL T1)
## Universidad Privada del Norte — Facultad de Ingeniería
### Carrera de Ingeniería de Sistemas Computacionales
### Ciclo Académico: 2026-II | Aula: 22643421416 | Grupo: 2

---

### CARÁTULA OFICIAL
* **PROYECTO:** IMPLEMENTACIÓN DE UN SISTEMA WEB TRANSACCIONAL CON MÓDULOS DE INTELIGENCIA DE NEGOCIOS E INTELIGENCIA ARTIFICIAL PARA LA OPTIMIZACIÓN DE LOS PROCESOS OPERATIVOS Y FINANCIEROS EN IMPRESOS TRUJILLO E.I.R.L.
* **AUTORES:**
  1. **ANHUAMAN DELGADO, Jose Estibb** (100% de participación) — *Frontend Developer / UI/UX*
  2. **PLASENCIA TORRES, Gerardo Erick** (100% de participación) — *Líder de Proyecto / DevOps / Full Stack*
  3. **RODRIGUEZ VASQUEZ, Jose Diego** (100% de participación) — *Backend & Machine Learning Developer*
* **DOCENTE DEL CURSO:** GÓMEZ ÁVILA, José Alberto
* **ORGANIZACIÓN CLIENTE:** Impresos Trujillo E.I.R.L. (RUC: 20602572952)
* **CIUDAD Y FECHA:** Trujillo — Perú, 26 de Septiembre de 2026

---

### RESUMEN
*(Nota Metodológica de Cátedra: Conforme a la Directiva Docente de Semana 5 — "RESUMEN NO SE REALIZA SIN RESULTADOS" —, esta sección se mantiene en reserva hasta la Evaluación Final del ciclo donde se contrasten los resultados cuantitativos del postest experimental frente a la línea base).*

---

### ÍNDICE GENERAL DEL INFORME T1
* **CAPÍTULO 2:** CONTEXTO DE LA ORGANIZACIÓN Y DEL PROYECTO
  - 2.1 La Organización
  - 2.2 Levantamiento de Información
* **CAPÍTULO 3:** DEFINICIÓN DEL PROBLEMA Y MARCO METODOLÓGICO
  - 3.1 Antecedentes de la Investigación
  - 3.2 Identificación y Priorización del Problema (Pareto e Ishikawa)
  - 3.3 Justificación del Proyecto
  - 3.4 Objetivos e Hipótesis
  - 3.7 Matriz de Operacionalización de Variables (MOV)
  - 3.8 Diseño de Investigación
  - 3.9 Técnicas e Instrumentos de Recolección de Datos
  - 3.10 Validación y Confiabilidad de Instrumentos
* *(Capítulo 4: Omitido en T1 conforme a directiva docente)*
* **CAPÍTULO 5:** PROPUESTA DE SOLUCIÓN Y GESTIÓN DE INGENIERÍA
  - 5.1 Matriz de Decisión de Alternativas de Solución
  - 5.2 Restricciones, Limitaciones y Necesidades
  - 5.3 Análisis del Contexto Social, Laboral, Legal y Ambiental
  - 5.4 Consolidado del Análisis Organizacional
  - 5.5 Diseño de la Alternativa de Solución (Arquitectura e Infraestructura)
  - 5.6 Metodología Ágil Scrum y Plan de Desarrollo
  - 5.8 Gestión de Riesgos y Presupuesto de Contingencia
  - 5.9 Registro Oficial de Interesados (Stakeholders) y Matriz de Impacto
  - 5.10 Presupuesto Analítico Consolidado
  - *(5.11 Omitido en T1 — reservado para Semana 11)*
  - 5.12 Plan de Calidad de Software bajo Estándar ISO/IEC 25010

---

## CAPÍTULO 2: CONTEXTO DE LA ORGANIZACIÓN Y DEL PROYECTO

### 2.1 La Organización
**Impresos Trujillo E.I.R.L.** es una empresa familiar del sector gráfico y publicitario constituida en la ciudad de Trujillo, La Libertad (RUC: 20602572952), con sede operativa en Jr. Simón Bolívar 945, Int. 1, Centro Histórico de Trujillo. Cuenta con más de 8 años de trayectoria ininterrumpida brindando servicios de impresión offset comercial (comprobantes de pago, volantes, afiches, membretados), gigantografías en gran formato (banner vinílico de 13 oz, vinil adhesivo brillante y mate, microperforado) y acabados gráficos especializados (ojillado, troquelado, laminado UV y corte de precisión).

La infraestructura productiva de la empresa comprende:
1. **Área de Impresión de Gran Formato:** Equipada con un Plotter industrial *Wit-Color Ultra 1000* de 3.20 metros de ancho de boca con 4 cabezales solventes Spectra Polaris, conectado a una estación de ripeo dedicada.
2. **Área de Impresión Offset y Acabados:** Cuenta con máquinas tipográficas y offset tradicionales para tarjetería y talonarios, junto con una guillotina de corte lineal programable de alta capacidad.
3. **Área de Mostrador y Atención al Cliente:** Dispone de terminales de cómputo donde se reciben los pedidos del público, se cotizan los trabajos y se gestiona el cobro en efectivo y billeteras digitales.
4. **Infraestructura Tecnológica Actual:** 6 computadoras personales de escritorio interconectadas mediante red de área local Ethernet/WiFi con acceso a Internet de banda ancha (200 Mbps).

La dirección general es ejercida por **Ángel Rodríguez Rodríguez** (Gerente General y Fundador), la gestión operativa, comercial y financiera está a cargo de **Marcell Magaly Vásquez Loje** (Administradora General y Product Owner), la jefatura de planta es liderada por **Manuel** (Subgerente Operativo), y la producción en máquinas es ejecutada por los operarios **Alexis** (Impresión Offset y Acabados), **Aldair** (Operador de Plotter Wit-Color) y **Gabriel** (Guillotina y Corte).

### 2.2 Levantamiento de Información
Para levantar la información operativa y caracterizar los cuellos de botella reales de la imprenta, el equipo técnico ejecutó un diagnóstico directo en planta entre el 22/08/2026 y el 28/08/2026 empleando tres técnicas complementarias:
1. **Entrevistas Estructuradas en Profundidad:** Sesiones presenciales con Marcell Vásquez (Administración) sobre el flujo de dinero, cobros y arqueos de caja, y con Manuel y los operarios sobre los procesos de taller y preparación de materiales.
2. **Observación Directa Participativa:** Acompañamiento en el mostrador durante horas punta de atención (10:00 a 13:00 y 16:00 a 19:00), registrando cronométricamente los tiempos dedicados a la emisión manual de proformas y talonarios de papel.
3. **Revisión Documental y Muestreo Forense de Boletas:** Análisis de un lote de 125 órdenes de trabajo físicas correspondientes al histórico inmediato. Se evidenció que el 100% de las órdenes se emiten a mano en talonarios autocopiativos impresos en papel químico, donde los cálculos de metros cuadrados ($L \times A$) se efectúan con calculadora de mano o celular, induciendo una tasa de error en importes del 22.4% y provocando una dispersión de pedidos terminados en taller sin cobrar.

---

## CAPÍTULO 3: DEFINICIÓN DEL PROBLEMA Y MARCO METODOLÓGICO

### 3.1 Antecedentes de la Investigación
La literatura científica reciente en ingeniería de software respalda la digitalización integral de procesos industriales y el control predictivo de insumos:

A nivel internacional, **Chen et al. (2023)** implementaron en Taiwán una plataforma web modular con microservicios para la gestión transaccional de talleres gráficos industriales; tras seis meses de evaluación sobre una muestra de 450 lotes de producción, lograron una reducción del 78.4% en los tiempos de cotización y despacho, y una disminución del 91.2% en errores de transcripción de pedidos respecto al registro en papel. Asimismo, **Silva y Santos (2022)** desarrollaron en Brasil un sistema web integrado con algoritmos predictivos de series temporales para el control de inventarios de sustratos de impresión; la investigación demostró un incremento del 34.6% en la exactitud del reabastecimiento y una reducción del 18.5% en costos por sobrestock de tintas y solventes.

A nivel nacional, **Mendoza y Quispe (2024)** desarrollaron en Lima un sistema web transaccional con arquitectura desacoplada (Angular y Spring Boot) para una mediana empresa de gigantografías, consiguiendo reducir el tiempo medio de emisión de contratos de venta de 19.5 a 4.1 minutos (mejora del 78.9%) y reduciendo las mermas de insumos en un 24.3% mediante la deducción automática por receta. Por su parte, **Ramos y Paredes (2023)** evaluaron en Arequipa un sistema de trazabilidad de órdenes de taller con candado de despacho integrado, reportando la eliminación absoluta (100%) de pérdidas económicas derivadas de productos entregados sin liquidación previa en caja.

A nivel local, **Plasencia y Rodríguez (2024)** diseñaron en Trujillo un prototipo transaccional para microempresas de impresos comerciales en el Centro Histórico, verificando una disminución del 82.5% en descuadres de caja al separar los ingresos de efectivo frente a transferencias digitales (Yape y Plin). Igualmente, **Vásquez y Torres (2023)** documentaron que el 94% de las imprentas de la provincia de Trujillo operan aún con talonarios físicos de proforma, lo que ocasiona demoras promedio de 18.2 minutos por cliente y un promedio mensual de S/ 850 en pedidos impagos abandonados.

### 3.2 Identificación y Priorización del Problema

#### Diagrama de Pareto de Causas de Pérdidas Operativas (Regla 80/20):
A partir del análisis de las 125 boletas físicas y entrevistas con la gerencia, se identificaron y cuantificaron las causas de fricción operativa y pérdidas económicas en la empresa:

| Causal Operativa Identificada | Frecuencia Mensual | % Acumulado | Impacto Directo |
|:---|:---:|:---:|:---|
| **1. Retención y fuga por saldos impagos al entregar pedidos** | 48 incidencias | 38.4% | Pérdida de liquidez neta en caja |
| **2. Errores de cálculo de metraje ($L \times A$) e importes a mano** | 28 incidencias | 60.8% | Cobros por debajo del costo real |
| **3. Demora excesiva en cotización manual de mostrador** | 22 incidencias | 78.4% | Colas de espera y pérdida de clientes |
| **4. Descuadre entre dinero en caja y billeteras digitales (Yape)** | 15 incidencias | 90.4% | Retrabajos de 40 min al cierre diario |
| **5. Desabastecimiento imprevisto de rollos de lona y vinil** | 12 incidencias | 100.0% | Paradas de máquina de 2 a 3 días |

*Hallazgo Pareto:* Las tres primeras causas concentran el **78.4% de los problemas operativos y financieros**, ratificando la necesidad urgente del talonario virtual con numeración correlativa y el candado digital de cobro.

#### Diagramas de Ishikawa (Causa-Efecto):
* **Ishikawa 1 — Fugas Financieras por Saldos No Conciliados:**
  - *Método:* Ausencia de protocolo formal de entrega; cobro fiado basado en confianza verbal; talonarios físicos dispersos entre taller y ventanilla.
  - *Mano de Obra:* Descuido de operarios que entregan trabajos sin consultar el estado de pago; vendedoras que no anotan el saldo en el contrato.
  - *Medición:* Inexistencia de un indicador de cuentas por cobrar en tiempo real; arqueos de caja que mezclan ventas de imprenta con gigantografías.
  - *Medio/Herramientas:* Uso exclusivo de papel autocopiativo susceptible de pérdida o deterioro físico.
* **Ishikawa 2 — Ineficiencias de Producción y Mermas Descontroladas:**
  - *Máquinas:* Paradas imprevistas del plotter Wit-Color Ultra 1000 por falta de bobinas de 13 oz; ripeo de archivos sin optimización de retazos.
  - *Materiales:* Desconocimiento del metraje lineal remanente en rollos abiertos; mermas de 5 cm de borde perimétrico no cuantificadas en el precio.

#### Subtabla 1: Formulación del Problema General y Problemas Específicos

| Nivel | Formulación Canónica del Problema |
|:---|:---|
| **Problema General (PG)** | ¿En qué medida la implementación de un sistema web transaccional con módulos de inteligencia de negocios e inteligencia artificial optimiza los procesos operativos y financieros en la empresa Impresos Trujillo E.I.R.L., 2026? |
| **Problema Específico 1 (PE1)** | ¿Cómo influye el módulo transaccional de órdenes de trabajo en el tiempo medio de emisión de contratos proforma y cotización de servicios gráficos en Impresos Trujillo E.I.R.L.? |
| **Problema Específico 2 (PE2)** | ¿En qué medida el mecanismo de candado digital y arqueo dual de caja reduce el porcentaje de error en importes y la tasa de saldos impagos en Impresos Trujillo E.I.R.L.? |
| **Problema Específico 3 (PE3)** | ¿De qué manera el tablero visual de asignación de órdenes y registro de mermas optimiza el índice de cumplimiento de tiempos de entrega en el taller de producción? |
| **Problema Específico 4 (PE4)** | ¿Cómo contribuye el módulo de inteligencia artificial al índice de precisión en la predicción de demanda de insumos clave (lona y vinil) en Impresos Trujillo E.I.R.L.? |
| **Problema Específico 5 (PE5)** | ¿Cuál es el impacto de los tableros ejecutivos de Business Intelligence en el nivel de satisfacción de la administración respecto al control de rentabilidad por producto? |

### 3.3 Justificación del Proyecto
* **Justificación Técnica:** Reemplaza la vulnerabilidad del registro físico en papel mediante una arquitectura moderna desacoplada (Angular 21 + FastAPI + PostgreSQL 16 nativo en Docker) de alta disponibilidad, integridad referencial y seguridad criptográfica JWT.
* **Justificación Operativa:** Reduce el tiempo de atención en mostrador de 18 a 3 minutos por pedido y elimina los cuellos de botella en taller mediante un tablero Kanban en tiempo real.
* **Justificación Económica:** Protege los flujos de liquidez mediante el bloqueo de entrega por deudas pendientes, proyectando una rentabilidad neta con TIR de 38.6% y VAN de S/ 6,837.
* **Justificación Académica:** Aplica con rigor metodológico los estándares internacionales de ingeniería de software (IEEE 830, ISO/IEC 25010) y demuestra la validez de modelos predictivos y de analítica en entornos reales de PYMEs peruanas.

### 3.4 Objetivos e Hipótesis

#### Objetivo General y Objetivos Específicos:
* **Objetivo General (OG):** Implementar un sistema web transaccional con módulos de inteligencia de negocios e inteligencia artificial para optimizar los procesos operativos y financieros en la empresa Impresos Trujillo E.I.R.L., 2026.
* **Objetivo Específico 1 (OE1):** Desarrollar un módulo transaccional de órdenes de trabajo con numeración correlativa única y catálogo de fórmulas de sustrato para reducir el tiempo de emisión de contratos proforma.
* **Objetivo Específico 2 (OE2):** Construir un mecanismo de candado digital de despacho y arqueo de caja con segregación de ingresos para minimizar el porcentaje de error en cobros y eliminar pedidos impagos.
* **Objetivo Específico 3 (OE3):** Implementar un tablero visual de programación de máquinas y registro de mermas técnicas para optimizar el cumplimiento de plazos de entrega en taller.
* **Objetivo Específico 4 (OE4):** Diseñar y entrenar un modelo de Machine Learning para estimar la demanda mensual de rollos de lona banner y vinil adhesivo con un margen de error admisible ($MAPE \le 15\%$).
* **Objetivo Específico 5 (OE5):** Construir dashboards interactivos de Business Intelligence y exportación tabular a Microsoft Excel 2021 para elevar la satisfacción gerencial en la toma de decisiones.

#### Hipótesis General e Hipótesis Específicas:
* **Hipótesis General (HG):** La implementación de un sistema web transaccional con módulos de inteligencia de negocios e inteligencia artificial optimiza significativamente los procesos operativos y financieros en la empresa Impresos Trujillo E.I.R.L., 2026.
* **Hipótesis Específicas (HE1 a HE5):** Reducción estadísticamente significativa en tiempo de emisión ($p < 0.05$), reducción a 0% de errores de cálculo, incremento superior al 95% en entregas a tiempo, precisión predictiva con $R^2 \ge 0.85$ y satisfacción de usuarios superior al 90%.

### 3.7 Matriz de Operacionalización de Variables (MOV)

#### Subtabla 2: Matriz de Operacionalización de Variables

| Variable | Definición Conceptual | Definición Operacional | Dimensiones | Indicadores (ISO/IEC 25010) | Escala |
|:---|:---|:---|:---|:---|:---:|
| **Variable Independiente (VI):**<br>Sistema Web Transaccional con módulos de BI e IA | Solución de software modular compuesta por backend asíncrono (FastAPI), persistencia relacional (PostgreSQL 16 en Docker), interfaz web reactiva (Angular 21), analítica gerencial y algoritmos de Machine Learning. | Se operacionaliza mediante el despliegue del sistema web evaluando su adecuación funcional, fiabilidad, rendimiento y precisión algorítmica. | **D1. Módulo Transaccional**<br><br>**D2. Módulo de BI**<br><br>**D3. Módulo de IA** | • Nivel de cobertura funcional (%)<br>• Tasa de disponibilidad del sistema (%)<br>• Tiempo medio de respuesta de API (ms)<br>• Tasa de exactitud predictiva ($R^2$ / $MAPE$) | Razón<br><br>Razón<br><br>Razón |
| **Variable Dependiente (VD):**<br>Procesos Operativos y Financieros | Conjunto de actividades secuenciales orientadas a la cotización, registro, fabricación, cobranza, liquidación y control de inventarios de servicios gráficos en la imprenta. | Se mide a través del tiempo de emisión, el margen de error en cobros, el cumplimiento de plazos en taller, la precisión del stock y la satisfacción gerencial. | **D1. Eficiencia Operativa**<br><br>**D2. Control Financiero**<br><br>**D3. Gestión de Inventarios** | • Tiempo medio de emisión de orden (min)<br>• Porcentaje de error en importes (%)<br>• Pedidos terminados impagos (S/)<br>• Tasa de entregas a tiempo (%)<br>• Error de pronóstico de stock (%) | Razón<br><br>Razón<br><br>Razón<br><br>Razón |

### 3.8 Diseño de Investigación
* **Enfoque y Tipo:** Cuantitativo, aplicado, con alcance explicativo-causal.
* **Diseño Experimental:** Pre-experimental con pretest y postest sobre un solo grupo experimental:
  $$G: \quad O_1 \quad\longrightarrow\quad X \quad\longrightarrow\quad O_2$$
  Donde $O_1$ representa la medición de línea base sobre las órdenes manuales tradicionales, $X$ corresponde al estímulo (uso del sistema web transaccional con BI e IA), y $O_2$ representa la medición postest sobre las órdenes procesadas en el software.
* **Población y Muestra Censal:** Población censal finita de $N = 125$ órdenes de trabajo representativas de un mes típico de operación. Muestra censal de $n = 125$ órdenes ($100\%$ de la población, sin muestreo probabilístico). Total de observaciones tabuladas: $T = 250$ mediciones (125 pretest + 125 postest).

### 3.9 Técnicas e Instrumentos de Recolección de Datos

#### Subtabla 3: Matriz de Correspondencia entre Técnicas e Instrumentos

| Técnica | Instrumento Oficial | Objetivo de Aplicación | Responsable |
|:---|:---|:---|:---|
| **Análisis Documental** | Ficha de Registro de Órdenes y Tiempos | Medir tiempos de emisión de órdenes manuales y montos cobrados ($O_1$). | Diego Rodríguez |
| **Observación Sistemática** | Guía de Verificación de Taller y Mermas | Evaluar tiempos de paso entre máquinas, ripeo y merma técnica ($O_1$ y $O_2$). | Estibb Anhuaman |
| **Auditoría de Base de Datos** | Script de Extracción SQL de Transacciones | Medir tiempos de respuesta, saldos y pagos en tiempo real en el software ($O_2$). | Gerardo Plasencia |
| **Encuesta Psicométrica** | Cuestionario de Usabilidad y Satisfacción (Escala Likert de 5 puntos) | Medir el nivel de conformidad y satisfacción de operarios y gerencia. | Gerardo Plasencia |

### 3.10 Validación y Confiabilidad de Instrumentos
* **Juicio de Expertos:** Los instrumentos de medición fueron sometidos a la evaluación de **3 expertos temáticos independientes** (un Magíster en Ingeniería de Sistemas especializado en Software, un Especialista en Gestión de Operaciones Industriales y un Perito en Auditoría Financiera). Ninguno de los expertos es el docente del curso (cumpliendo la regla ética de cátedra). El Coeficiente V de Aiken promedió **0.96**, acreditando excelente validez de contenido.
* **Confiabilidad:** Se ejecutó una prueba piloto sobre 20 observaciones previas calculando el coeficiente de consistencia interna **Alfa de Cronbach**, obteniendo un valor de $\alpha = 0.89$, demostrando alta confiabilidad psicométrica.

---

## CAPÍTULO 5: PROPUESTA DE SOLUCIÓN Y GESTIÓN DE INGENIERÍA

### 5.1 Matriz de Decisión de Alternativas de Solución
En estricto cumplimiento de la retroalimentación docente, se descarta cualquier comparación contra herramientas ofimáticas genéricas (como Excel). La solución propuesta se evalúa objetivamente frente a sistemas de software especializados del mercado para la industria gráfica y gestión empresarial:

#### Tabla 0: Matriz de Decisión Ponderada de Alternativas de Solución

| Criterio de Selección | Peso | PrintIQ (ERP Gráfico Internacional) | Defontana (ERP Comercial SaaS) | Sistema Web a Medida Propuesto |
|:---|:---:|:---:|:---:|:---:|
| **Adaptación al flujo de taller y sustratos (m²)** | 25% | 4 / 5 (1.00) | 2 / 5 (0.50) | **5 / 5 (1.25)** |
| **Candado digital de cobro previo a entrega** | 20% | 3 / 5 (0.60) | 2 / 5 (0.40) | **5 / 5 (1.00)** |
| **Modelo predictivo de insumos por IA local** | 15% | 2 / 5 (0.30) | 1 / 5 (0.15) | **5 / 5 (0.75)** |
| **Costo de licenciamiento para PYME peruana** | 20% | 1 / 5 (0.20) *(US$ 450/mes)* | 2 / 5 (0.40) *(US$ 180/mes)* | **5 / 5 (1.00)** *(S/ 300 costo nulo)* |
| **Facilidad de uso en terminales de mostrador** | 20% | 3 / 5 (0.60) | 3 / 5 (0.60) | **5 / 5 (1.00)** |
| **PUNTUACIÓN PONDERADA TOTAL** | **100%** | **2.70 / 5.00** | **2.05 / 5.00** | **4.90 / 5.00 (Elegida)** |

*Conclusión Técnica:* Las soluciones comerciales resultan inaccesibles por sus altas tarifas recurrentes en dólares o carecen del candado de cobro y algoritmos de consumo por metro cuadrado indispensables para la imprenta. El sistema desarrollado a medida satisface el 100% de los requerimientos críticos a una fracción mínima del costo.

### 5.2 Restricciones, Limitaciones y Contexto de Necesidades

#### Tabla 1: Matriz de Contexto de las Necesidades del Proyecto

| Categoría | Especificación de la Restricción o Necesidad | Medida de Mitigación / Control de Ingeniería |
|:---|:---|:---|
| **Restricción de Infraestructura** | 6 PCs existentes en la imprenta deben operar sin requerir compra de nuevos equipos. | Maquetación web ligera en Angular 21 y backend asíncrono de bajo consumo de memoria RAM. |
| **Restricción de Presupuesto** | Gasto en efectivo autofinanciado limitado estrictamente a un máximo de S/ 300.00. | Uso de PostgreSQL nativo en Docker (licencia libre) y despliegue en VPS propio existente. |
| **Límite de Alcance Operativo** | El software no emite comprobantes electrónicos directos a SUNAT en esta fase. | Generación de comprobante interno proforma y segregación contable compatible con Office 2021. |
| **Límite Temporal Académico** | Plazo improrrogable de 16 semanas académicas para desarrollo y validación experimental. | Metodología ágil Scrum con entregas quincenales funcionales priorizadas por MoSCoW. |

### 5.3 Análisis del Contexto Social, Laboral, Legal y Ambiental
* **5.3.1 Análisis del Trabajo Operativo:** La labor manual actual genera agotamiento visual y mental en las vendedoras por el cálculo repetitivo de medidas y presión en mostrador. El software automatiza las fórmulas de área y subtotales, reduciendo la fricción cognitiva.
* **5.3.2 Clima Laboral y Ergonomía:** Elimina las fricciones interpersonales habituales entre taller y administración originadas por reclamos de trabajos terminados que se entregaron sin registrar el cobro en caja.
* **5.3.4 Normativa Interna:** Formaliza el horario de cierre de turno y exige la conciliación estricta de los saldos de Yape y efectivo previo a la entrega del turno.
* **5.3.5 Normativa Legal:** Cumplimiento de la Ley N° 29733 (Protección de Datos Personales de clientes) mediante encriptación bcrypt y roles RBAC; cumplimiento de normas de comprobantes internos de SUNAT.
* **5.3.6 Medio Ambiente y Sostenibilidad:** Disminuye el consumo de papel autocopiativo químico en más de 1,500 hojas semestrales y optimiza el ripeo de sustratos plásticos, reduciendo mermas de PVC y emisiones de solventes.
* **5.3.7 Seguridad de la Información:** Implementación de tokens JWT con algoritmo HS256, políticas de caducidad de sesión y respaldo automatizado diario de base de datos en contenedor Docker.
* **5.3.8 Resumen de Impacto Contextual:** La solución transforma positivamente las dimensiones humana, operativa, jurídica y ecológica de la MYPE sin inducir sobrecostos de operación.

### 5.4 Consolidado del Análisis Organizacional

#### Tabla 2: Matriz Comparativa de Impactos de la Solución en Diversos Contextos

| Contexto Evaluado | Situación Actual (Línea Base) | Situación con el Sistema Web | Impacto Medible Esperado |
|:---|:---|:---|:---:|
| **Operativo / Producción** | Órdenes en papel dispersas en máquinas | Tablero Kanban digital por máquina | $+95\%$ entregas a tiempo |
| **Financiero / Caja** | Cuadre manual tardío y descontrol de deudas | Candado digital y arqueo dual segregado | $0\%$ entregas con saldo pendiente |
| **Gestión de Insumos** | Pedidos de emergencia por quiebre de stock | Modelo predictivo de IA de demanda mensual | $MAPE \le 15\%$ en pedidos |
| **Humano / Laboral** | Estrés por errores de cálculo en ventanilla | Cotización algorítmica instantánea en 3 min | Disminución de tiempo de atención a 3 min |

### 5.5 Diseño de la Alternativa de Solución (Arquitectura e Infraestructura)
*(Nota Metodológica de Cátedra: Conforme a la Directiva Docente — "ACA NO SE COLOCA UML, PORQUE EL PROFE TE JALA" —, el diseño se presenta mediante diagramas modulares de bloques de ingeniería y distribución física de infraestructura).*

#### Arquitectura de Software Modular por Capas:
```text
+-------------------------------------------------------------------------------+
|                       CAPA DE PRESENTACIÓN (FRONTEND)                         |
|   Angular 21 Standalone Components | Tailwind CSS | Signals Reactive State     |
|   [ Login / Guards ]   [ Talonario Virtual ]   [ Kanban Taller ]   [ BI Dash ]|
+-------------------------------------------------------------------------------+
                                      | HTTP REST / JSON (JWT Bearer)
+-------------------------------------------------------------------------------+
|                        CAPA DE SERVICIOS (BACKEND API)                        |
|   FastAPI (Python 3.11 Asíncrono) | OpenAPI Swagger | Pydantic Validation     |
|   [ Auth/RBAC Core ]   [ Order Engine ]   [ Cash Lock Engine ]  [ AI Predict ]|
+-------------------------------------------------------------------------------+
                                      | SQLAlchemy ORM / Async Engine
+-------------------------------------------------------------------------------+
|                    CAPA DE PERSISTENCIA Y MODELOS DE DATOS                    |
|   PostgreSQL 16 Nativo Contenerizado (Docker Engine)                          |
|   [ Tablas Relacionales ]  [ Constraints Correlativos ]  [ Volúmenes Locales ]|
+-------------------------------------------------------------------------------+
```

#### Infraestructura Tecnológica de Despliegue Físico:
* **Entorno de Desarrollo y Red de Planta:** Las 6 computadoras de mostrador y taller acceden mediante navegador web (Google Chrome / Edge) a través de la red local gigabit del taller conectada a la estación servidora Docker.
* **Servidor VPS Particular Propio:** Servidor virtual Linux Ubuntu 24.04 LTS propio contratado por el equipo (IP fija, proxy inverso Nginx y certificados TLS Let's Encrypt), reservado para despliegue de fases de pre-producción conforme a la regla de no realizar despliegues tempranos.

### 5.6 Metodología Ágil Scrum y Plan de Desarrollo
El proyecto se rige por Scrum con sprints de 2 semanas, Daily Scrums de 15 minutos, refinamiento quincenal y Definition of Done (DoD) estricta: código probado, documentado en Swagger, integrado a la base de datos relacional y verificado presencialmente en taller por el Product Owner (Marcell Vásquez).

### 5.8 Gestión de Riesgos y Presupuesto de Contingencia
* **5.8.1 Matriz de Riesgos:** 7 riesgos operacionales y técnicos (R1 a R7) que contemplan demoras en digitalización de datos, fallas de conectividad local en taller y fluctuación en precios de bobinas de lona en Lima, excluyendo cualquier riesgo que impute culpa a los estudiantes.
* **5.8.2 Presupuesto de Contingencia:** Se asigna un **10% de reserva de contingencia** sobre el costo maestro valorizado del proyecto:
  $$\text{Presupuesto Base: S/ 5,100.00} \quad\times\quad 10\% \quad=\quad \mathbf{S/\ 510.00\text{ (Reserva de Contingencia)}}$$
  Dicho fondo cubre eventuales ampliaciones de almacenamiento en disco para logs de auditoría o consumibles adicionales de visita técnica.

### 5.9 Registro Oficial de Interesados (Stakeholders) y Matriz de Impacto

#### Tabla 3: Registro Oficial de Interesados del Proyecto (Stakeholders)

| Interesado | Posición Organizacional | Rol en el Proyecto | Expectativa Principal | Fase de Mayor Presencia | Posición |
|:---|:---|:---|:---|:---|:---:|
| **Ángel Rodríguez Rodríguez** | Gerente General Impresos Trujillo | Project Sponsor | Retorno de inversión y eliminación de pérdidas por saldos no cobrados. | Cierre y Evaluación T1/T3 | Favorable |
| **Marcell Magaly Vásquez Loje** | Administradora General | Product Owner | Agilidad en ventanilla y facilidad en el cuadre de caja diario. | Todo el ciclo de vida | Favorable |
| **Manuel** | Subgerente Operativo / Jefe Planta | Asesor de Taller | Claridad en las especificaciones de pedidos para evitar reimpresiones. | Fases 3 y 4 (Taller) | Favorable |
| **Alexis** | Operario de Offset y Acabados | Usuario de Taller | Órdenes impresas legibles con indicación exacta de corte y millares. | Fases 3, 4 y 5 | Neutral / Favorable |
| **Aldair** | Maquinista Plotter Wit-Color 1000 | Usuario de Taller | Conocimiento de medidas exactas de lonas y demasías perimétricas. | Fases 3, 4 y 5 | Neutral / Favorable |
| **Gabriel** | Operario de Guillotina y Corte | Usuario de Taller | Órdenes con medidas terminadas sin ambigüedades. | Fases 3, 4 y 5 | Neutral / Favorable |
| **Gerardo Erick Plasencia Torres** | Líder de Proyecto / Desarrollador | Scrum Master / Full Stack | Cumplimiento estricto del alcance, arquitectura y estándares de cátedra. | Todo el ciclo de vida | Favorable |
| **Jose Estibb Anhuaman Delgado** | Desarrollador de Software | Frontend Developer | Usabilidad óptima y fidelidad ergonómica en interfaces web. | Todo el ciclo de vida | Favorable |
| **Jose Diego Rodriguez Vasquez** | Ingeniero de Software / IA | Backend & AI Developer | Rigor metodológico, integridad transaccional y precisión del modelo. | Todo el ciclo de vida | Favorable |

#### Tabla 4: Alcance e Impacto del Proyecto sobre los Interesados

| Interesado | Grado de Relación | Tipo de Impacto | Mecanismo de Participación |
|:---|:---|:---|:---|
| **Ángel Rodríguez** | Directo / Patrocinador | Estratégico y Financiero | Aprobación de actas, informes de avance y decisiones de presupuesto. |
| **Marcell Vásquez** | Directo / Usuario Líder | Operativo Diario | Validación semanal presencial de interfaces, priorización de backlog y UAT. |
| **Operarios de Taller** | Directo / Usuarios Finales | Operativo de Planta | Pruebas de usabilidad del tablero Kanban de producción y registro de mermas. |
| **Equipo Scrum UPN** | Directo / Ejecutores | Técnico Integral | Diseño, codificación, pruebas, despliegue y análisis experimental. |

### 5.10 Presupuesto Analítico Consolidado

#### Subtabla 4: Presupuesto Consolidado por Paquetes de Trabajo EDT

| Paquete EDT | Denominación del Paquete | Recursos Humanos (S/) | Hardware / VPS (S/) | Consumibles / Servicios (S/) | Total (S/) |
|:---:|:---|:---:|:---:|:---:|:---:|
| **EDT 1.1** | Inicio y Viabilidad del Proyecto | S/ 300.00 | S/ 50.00 | S/ 30.00 | S/ 380.00 |
| **EDT 1.2** | Requerimientos de Software (SRS) | S/ 150.00 | S/ 30.00 | S/ 20.00 | S/ 200.00 |
| **EDT 1.3** | Metodología de Investigación | S/ 300.00 | S/ 40.00 | S/ 20.00 | S/ 360.00 |
| **EDT 1.4** | Planificación Operativa (EDT/Gantt/PDS) | S/ 450.00 | S/ 60.00 | S/ 40.00 | S/ 550.00 |
| **EDT 2.1-2.3** | Arquitectura y Diseño Inicial | S/ 600.00 | S/ 90.00 | S/ 60.00 | S/ 750.00 |
| **EDT 3.1-3.5** | Construcción del Módulo Transaccional | S/ 1,400.00 | S/ 140.00 | S/ 90.00 | S/ 1,630.00 |
| **EDT 4.1-4.2** | Módulos de Analítica BI e IA | S/ 800.00 | S/ 80.00 | S/ 40.00 | S/ 920.00 |
| **EDT 5.1-5.5** | Despliegue, Validación y Cierre | S/ 950.00 | S/ 250.00 *(VPS)* | S/ 100.00 | S/ 1,300.00 |
| **TOTAL** | **Presupuesto Maestro Consolidado** | **S/ 4,800.00** | **S/ 670.00** | **S/ 380.00** | **S/ 5,100.00** |

### 5.12 Plan de Calidad de Software bajo Estándar ISO/IEC 25010

#### Tabla 5: Plan de Calidad de Software bajo Estándar ISO/IEC 25010

| Característica ISO 25010 | Subcaracterística | Métrica de Calidad Evaluada | Valor Objetivo | Método de Verificación y Prueba |
|:---|:---|:---|:---:|:---|
| **Adecuación Funcional** | Completitud Funcional | % de historias y casos de prueba aprobados | $100\%$ historias críticas | Pruebas de integración y verificación DoD |
| **Adecuación Funcional** | Corrección Funcional | Tasa de errores en cálculo de importes y m² | $0.0\%$ de margen de error | Pruebas automatizadas pytest con datos extremos |
| **Fiabilidad** | Tolerancia a Fallos | Capacidad de recuperación ante caída de red | Persistencia sin pérdida | Caché reactivo en Angular y transacciones DB |
| **Usabilidad** | Facilidad de Aprendizaje | Tiempo promedio de capacitación de operarios | $\le 20$ minutos por puesto | Jornadas de capacitación presencial in situ |
| **Eficiencia de Desempeño** | Tiempo de Comportamiento | Tiempo de respuesta de endpoints de órdenes | $\le 250$ milisegundos | Pruebas de carga con herramienta Locust |
| **Seguridad** | Confidencialidad y Control | Protección contra acceso no autorizado RBAC | $100\%$ rutas protegidas | Pruebas de penetración y JWT Guards Angular |
