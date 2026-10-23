# PLAN DE DESARROLLO DEL PROYECTO DE SOFTWARE (PDS)
## Universidad Privada del Norte — Ciclo 2026-II
### Curso: Proyecto Capstone (Aula: 22643421416 | Grupo 2)
### Organización Cliente: Impresos Trujillo E.I.R.L.

---

## CONTROL DEL DOCUMENTO Y APROBACIONES

#### TABLA 2: CONTROL DE ELABORACIÓN Y APROBACIÓN
| ELABORÓ | REVISÓ | AUTORIZÓ |
|:---|:---|:---|
| **Jose Estibb Anhuaman Delgado**<br>Analista Frontend / UI-UX / Tester QA<br><br>**Jose Diego Rodriguez Vasquez**<br>Desarrollador Backend & IA / DBA | **Gerardo Erick Plasencia Torres**<br>Líder del Proyecto Capstone / Scrum Master / Full Stack | **Angel Almilcar Rodríguez Evangelista**<br>Gerente / Jefe de Taller, Impresos Trujillo E.I.R.L.<br><br>**Marcell Magaly Vásquez Loje**<br>Gerente / Jefa de Oficina, Impresos Trujillo E.I.R.L. |

#### TABLA 5: HISTORIAL DE REVISIONES
| VERSIÓN | FECHA | AUTOR | DESCRIPCIÓN |
|:---|:---|:---|:---|
| **0.1** | 07/09/2026 | Equipo Capstone | Formulación del borrador inicial del Plan de Desarrollo de Software. |
| **1.0** | 11/09/2026 | Gerardo Erick Plasencia Torres | Incorporación de la Matriz de Riesgos sincronizada con la EDT, RACI balanceado y separación estricta de características y beneficios. |
| **1.1** | 26/09/2026 | Gerardo Erick Plasencia Torres | Alineamiento de códigos EDT a 4 niveles y formalización para evaluación T1. |

---

## 1. INTRODUCCIÓN

### 1.1 Alcance

El Plan de Desarrollo de Software (PDS) establece el marco de gestión, ingeniería, arquitectura, riesgos y asignación de responsabilidades para guiar la construcción, implantación y evaluación del sistema web integral en **Impresos Trujillo E.I.R.L.**.

#### TABLA 13: ALCANCE DEL PROYECTO
| En el Alcance | Fuera del Alcance |
|:---|:---|
| • Módulo Transaccional: emisión digital de órdenes con formato de Contrato/Proforma, correlativo automático y cálculo de IGV. | • Integración o facturación electrónica directa vía API con la SUNAT (la emisión formal se realiza en Portal Clave SOL). |
| • Candado digital de caja: bloqueo de entrega de pedidos si existe saldo pendiente mayor a S/ 0.00. | • Aplicaciones móviles nativas para tiendas Google Play Store o Apple App Store (sistema web SPA responsive). |
| • Control de inventario de insumos mediante deducción automática por recetas y registro de mermas en taller. | • Pasarela de cobros bancarios automatizada con débito en línea (conciliación manual asistida de vouchers Yape/transferencia). |
| • Tablero visual de producción en taller con pipeline de estados (Pendiente, En Taller, Terminado, Entregado). | • Módulos de administración de recursos humanos, marcación biométrica o planillas salariales (SUNAFIL). |
| • Módulo de Business Intelligence (BI): dashboards gerenciales de ventas, productividad y exportación a Excel 2021 (.xlsx). | • Transferencias bancarias automáticas ni emisión de órdenes de pago a proveedores externos de insumos. |
| • Módulo de Inteligencia Artificial (IA): modelo predictivo mensual de demanda de rollos de lona banner y vinil. | • Modificación del firmware o controladores propietarios de la máquina de impresión Wit-Color Ultra 1000. |
| • Despliegue en contenedor Docker sobre servidor VPS Linux propio con integración continua (CI/CD) en GitHub Actions. | • Compra de computadoras o servidores físicos para las oficinas de la empresa (se reutilizan las estaciones existentes). |

---

### 1.2 Documentos Relacionados

#### TABLA 10: DOCUMENTOS RELACIONADOS
| Título | Fecha | Organización | Identificador del documento |
|:---|:---|:---|:---|
| Acta de Constitución del Proyecto | 28/08/2026 | Impresos Trujillo E.I.R.L. / UPN | ACT-CAP-SEM01 |
| Caso de Negocio (Business Case) | 28/08/2026 | Impresos Trujillo E.I.R.L. / UPN | BC-CAP-SEM01 |
| Especificación de Requerimientos de Software (IEEE 830) | 28/08/2026 | UPN - Capstone Grupo 2 | SRS-CAP-SEM01 |
| Matriz de Consistencia Metodológica | 04/09/2026 | UPN - Capstone Grupo 2 | MC-CAP-SEM02 |
| Informe de Estructura de Análisis | 04/09/2026 | UPN - Capstone Grupo 2 | EA-CAP-SEM02 |
| Estructura de Desglose del Trabajo (EDT de 4 niveles) | 04/09/2026 | UPN - Capstone Grupo 2 | EDT-CAP-SEM02 |
| Cronograma Maestro del Proyecto (Gantt) | 04/09/2026 | UPN - Capstone Grupo 2 | CRON-CAP-SEM02 |

---

### 1.3 Definiciones, Acrónimos y Abreviaturas

- **API:** Application Programming Interface. Conjunto de endpoints RESTful provistos por FastAPI.
- **BI:** Business Intelligence. Módulo analítico para la toma de decisiones gerenciales.
- **Candado Digital:** Validación algorítmica que impide despachar un pedido si registra saldo pendiente impago.
- **CI/CD:** Continuous Integration / Continuous Deployment implementado con GitHub Actions.
- **Docker:** Plataforma de contenedores que aísla backend, base de datos y proxy en producción.
- **FastAPI:** Framework asíncrono en Python 3.11 para construcción de APIs de alto rendimiento.
- **IA:** Inteligencia Artificial. Modelos de regresión/series temporales para pronóstico de insumos.
- **PostgreSQL:** Sistema gestor de base de datos relacional transaccional robusto.
- **RACI:** Responsible, Accountable, Consulted, Informed. Matriz de asignación de roles.
- **SPA:** Single Page Application construida en Angular 21 sin recarga de página.
- **VPS:** Virtual Private Server en Linux Ubuntu 24.04 dedicado al proyecto.

---

### 1.4 Descripción del Proyecto

El proyecto consiste en el diseño, desarrollo, implantación y evaluación experimental de un sistema web integral desacoplado que digitaliza las operaciones de taller y oficina en **Impresos Trujillo E.I.R.L.**, eliminando la dependencia de talonarios comerciales físicos de papel, automatizando la liquidación de cobros en caja, optimizando el consumo de insumos por receta y dotando a la gerencia de capacidades predictivas y de inteligencia de negocios.

---

## 2. ENTORNO Y FUNDAMENTOS

### 2.1 Antecedentes

Los antecedentes se fundamentan en seis investigaciones científicas y aplicadas redactadas en prosa y sustentadas cuantitativamente:
- **Internacionales:** Zamora Irrazabal (2021) en Ecuador demostró que la digitalización de cotizaciones de imprenta redujo el tiempo de atención de 16.4 a 4.2 minutos (-74.39%) y eliminó el extravío de órdenes al 0.0%. Alvear Macías y Guallichico Guamán (2019) alcanzaron 100% de trazabilidad en taller y eliminaron al 100% las entregas impagas mediante liquidación obligatoria previa al despacho.
- **Nacionales:** Chávez Gutiérrez (2024) en Lima redujo el tiempo de registro en imprenta de 21.3 a 4.8 minutos (-77.46%) y las mermas de insumos del 15.8% al 4.2%. Espinoza Reina (2024) logró una mejora del 86.0% en tiempos de presupuestación e incrementó la precisión de cálculo de insumos del 68.4% al 96.2%.
- **Locales (Trujillo):** Rey Ascoy (2023) en Trujillo redujo las discrepancias en arqueos de caja del 22.4% al 1.8% y el tiempo de cierre de 150 a 12 minutos. Huayan Urbina (2021) disminuyó los paros por rotura de stock en imprenta local de 4.2 a 0.5 días mensuales (-88.1%).

---

### 2.2 Identificación del Problema

#### Pregunta Problema Canónica:
> **¿De qué manera influye la implementación de un sistema web transaccional con módulos de inteligencia de negocios e inteligencia artificial en la optimización de los procesos operativos y financieros en Impresos Trujillo E.I.R.L., Trujillo - 2026?**

#### Diagnóstico Operativo de Campo:
1. **Lentitud en el Mostrador:** La emisión manual en talonario físico promedia 18.5 minutos por cliente, generando demoras y cuellos de botella comerciales.
2. **Extravío de Pedidos:** Un 14.3% de las órdenes físicas se traspapelan entre mostrador y las máquinas de producción.
3. **Pérdidas Económicas en Caja:** El 11.2% de los pedidos son entregados con saldos pendientes impagos por falta de control en el despacho.
4. **Paros Productivos por Desabastecimiento:** Promedio de 3.0 días de paro al mes por falta imprevista de rollos de lona o vinil.
5. **Cierre de Caja Lento y Discrepante:** Arqueo manual semanal de 240 minutos con dificultad para conciliar pagos en efectivo, Yape y transferencias.

---

### 2.3 Objetivos del Proyecto

- **Objetivo General:**
  Determinar la influencia de la implementación de un sistema web transaccional con módulos de inteligencia de negocios e inteligencia artificial en la optimización de los procesos operativos y financieros en Impresos Trujillo E.I.R.L., Trujillo - 2026.
- **Objetivos Específicos:**
  1. *OE1:* Determinar la influencia de la implementación del sistema en el tiempo de registro de órdenes de trabajo en Impresos Trujillo E.I.R.L.
  2. *OE2:* Determinar la influencia de la implementación del sistema en el control de inventario de insumos en Impresos Trujillo E.I.R.L.
  3. *OE3:* Determinar la influencia de la implementación del sistema en las pérdidas financieras por entrega de trabajos con saldo pendiente en Impresos Trujillo E.I.R.L.
  4. *OE4:* Determinar la influencia de la implementación del sistema en la exactitud de los arqueos diarios de caja en Impresos Trujillo E.I.R.L.
  5. *OE5:* Determinar la influencia del módulo de inteligencia artificial en la precisión de la predicción de demanda de insumos en Impresos Trujillo E.I.R.L.

---

### 2.4 Alcance

El sistema abarcará los procesos de gestión de clientes comerciales, emisión de órdenes correlativas con recetas de insumos, control de pagos multicanal con candado digital, pipeline de estados en taller, arqueo segregado de caja, tableros BI y modelo predictivo de compras con IA.

---

### 2.5 Justificación

La justificación radica en el impacto perjudicial de **mantener el estado manual actual**: pérdidas financieras irrecuperables por pedidos retirados sin cancelar el saldo, pérdida de clientes por demoras de 18.5 minutos en mostrador, compras de emergencia de materiales a sobrecosto minorista y ceguera analítica gerencial que impide planificar el crecimiento de la empresa.

---

### 2.6 Características y Beneficios del Sistema

> *Nota de Observación Docente:* Se presentan en secciones formalmente **separadas** atendiendo la orden de clase (`notas_clase_profesor_4.txt` L18 y L36).

#### 2.6.1 Características Técnicas y Funcionales del Sistema:
1. **Emisión Digital Estructurada:** Talonario virtual con generación de N° correlativo autoincremental, cálculo de IGV y emisión de comprobante interno optimizado para impresión.
2. **Mecanismo de Candado Digital de Caja:** Algoritmo que bloquea de forma automatizada el cambio de estado a "Entregado" si existe saldo pendiente mayor a S/ 0.00.
3. **Deducción Parametrizada por Receta:** Cálculo inmediato del metraje cuadrado de sustrato (lona, vinil) y tintas requeridas por trabajo, con reserva automática en stock.
4. **Pipeline Visual de Taller:** Tablero Kanban con cuatro estados atómicos: Pendiente, En Taller, Terminado y Entregado.
5. **Arqueo Segregado de Ingresos:** Consolidación de ingresos por usuario y separación de fondos entre Imprenta y Gigantografías, distinguiendo efectivo, Yape y transferencias.
6. **Cuadros de Mando Ejecutivos e Interoperabilidad:** Dashboards de ingresos y rendimiento por operario con exportación nativa a Microsoft Excel 2021 (.xlsx).
7. **Modelo Predictivo de Series Temporales (IA):** Algoritmo entrenado para pronosticar el consumo mensual de rollos de lona y vinil.

#### 2.6.2 Beneficios Operativos y Financieros del Sistema:
1. **Celeridad Comercial:** Reducción del tiempo de registro y emisión de pedidos de 18.5 minutos a menos de 5.0 minutos por orden.
2. **Cero Fugas Financieras:** Eliminación total (0.0%) de pérdidas económicas por despachos de pedidos con saldos no cobrados.
3. **Trazabilidad Absoluta:** Reducción del extravío de especificaciones físicas en taller del 14.3% al 0.0%.
4. **Continuidad Operativa:** Erradicación de los 3 días mensuales de paro de taller por desabastecimiento de insumos críticos.
5. **Exactitud en Cierres Contables:** Reducción del tiempo de arqueo de 240 a menos de 15 minutos semanales, logrando una exactitud de conciliación superior al 95%.

---

### 2.7 Suposiciones y Limitaciones

#### Suposiciones (Idénticas al Acta de Constitución y Business Case):
1. La empresa garantizará el acceso continuo a los registros históricos de órdenes de trabajo físicas, talonarios comerciales y archivos Excel para el levantamiento de la línea base operativa.
2. La gerencia y el personal clave dispondrán de un mínimo de 2 horas semanales para reuniones de coordinación técnica, validación de incrementos y pruebas en taller.
3. Las 6 computadoras registradas en oficina y taller (sistemas Windows 10 y Windows 11) y el enlace de internet de 200 Mbps se mantendrán operativos y disponibles durante el proyecto.
4. Las recetas y reglas de consumo de insumos definidas con el Jefe de Taller se mantendrán estables durante el período experimental.

#### Limitaciones (Idénticas al Acta de Constitución y Business Case):
1. El sistema no incluye facturación electrónica directa con la API de SUNAT (la emisión fiscal se mantiene en el Portal Clave SOL).
2. No se construirán aplicaciones móviles nativas para tiendas Play Store o App Store (acceso web responsive).
3. No se incorpora pasarela de pagos automatizada con cobro bancario en línea.
4. No se incluye gestión de recursos humanos ni cálculo de planillas salariales (SUNAFIL).

---

### 2.8 Evolución del Plan del Proyecto

El plan se actualizará formalmente ante cada hito académico de revisión docente (T1 en Semana 6, T2 en Semana 10, T3 en Semana 13 y Sustentación Final en Semana 16), registrando los ajustes en la tabla de control de cambios.

---

## 3. ORGANIZACIÓN DEL PROYECTO

### 3.1 Recursos Humanos

#### TABLA 16: RECURSOS HUMANOS DEL PROYECTO
| Necesidad | Recurso | Cantidad | Estado | Comentarios/Responsabilidades |
|:---|:---|:---:|:---|:---|
| Gestión y Arquitectura | Líder de Proyecto / Full Stack | 1 | Asignado | Gerardo Plasencia Torres. Dirección técnica, CI/CD, backend transaccional y candado digital. |
| Diseño de Interfaces y Calidad | Analista Frontend / QA Tester | 1 | Asignado | Jose Estibb Anhuaman Delgado. Maquetación Angular 21, catálogo, tablero visual y pruebas. |
| Datos, Analítica e IA | Desarrollador Backend & IA / DBA | 1 | Asignado | Jose Diego Rodriguez Vasquez. PostgreSQL Docker, endpoints analíticos BI, modelo IA y pretest. |
| Validación de Negocio (Cliente) | Administradora de Oficina y Finanzas | 1 | Asignada | Marcell Magaly Vásquez Loje. Validación de cotizaciones, cobros y arqueos diarios. |
| Validación Técnica (Cliente) | Gerente General / Jefe de Taller | 1 | Asignado | Angel Almilcar Rodríguez Evangelista. Aprobación de recetas, mermas y pruebas en taller. |

---

### 3.2 Organización de los Equipos de Trabajo (MultiRol)

#### TABLA 17: ASIGNACIÓN DE CARGOS Y RESPONSABILIDADES
| Nombre | Cargo |
|:---|:---|
| **Gerardo Erick Plasencia Torres** | Líder de Proyecto / Scrum Master / Full Stack Developer / DevOps |
| **Jose Estibb Anhuaman Delgado** | Desarrollador Frontend / Analista de Requerimientos UI-UX / Tester QA |
| **Jose Diego Rodriguez Vasquez** | Desarrollador Backend & IA / Administrador de Base de Datos / Analista BI |
| **Angel Almilcar Rodríguez Evangelista** | Auspiciante Ejecutivo / Gerente / Jefe de Taller (Empresa Cliente) |
| **Marcell Magaly Vásquez Loje** | Auspiciante Ejecutiva / Product Owner / Jefa de Oficina (Empresa Cliente) |
| **Alexis / Aldair / Gabriel** | Operarios de Taller y Diseñadores Gráficos (Usuarios Clave de Producción) |

> *Nota de Exclusión:* El docente del curso (Ing. Jose Alberto Gomez Avila) no figura en la organización del equipo ejecutor ni decisor, actuando exclusivamente como asesor académico y evaluador de la universidad.

---

### 3.3 Herramientas de Desarrollo y Colaboración

#### TABLA 19: HERRAMIENTAS DE DESARROLLO Y PLATAFORMAS
| Herramienta | Fuente | Cantidad | Estado | Comentarios |
|:---|:---|:---:|:---|:---|
| **Angular 21** | Open Source (Google) | 1 | Activo | Framework Frontend SPA en TypeScript standalone. Maquetación directa en código (sin Figma). |
| **FastAPI** | Open Source (Python) | 1 | Activo | Framework Backend API asíncrono en Python 3.11 con Pydantic v2 y SQLAlchemy 2. |
| **PostgreSQL 16** | Open Source | 1 | Activo | Base de datos relacional transaccional oficial en contenedor Docker. |
| **Docker Engine 26+** | Open Source | 1 | Activo | Plataforma de contenedores para backend, base de datos y proxy en producción. |
| **Scikit-learn / Prophet** | Open Source | 1 | Activo | Librerías para entrenamiento del modelo predictivo de series temporales de insumos. |
| **Linux Ubuntu 24.04** | Servidor Propio | 1 | Activo | Servidor VPS particular propio para alojamiento de producción. |
| **GitHub Actions** | GitHub | 1 | Activo | Pipeline automatizado de integración continua (CI/CD) para pruebas y despliegue. |
| **VS Code** | Microsoft | 3 | Activo | Entorno de desarrollo integrado para el equipo. |

---

### 3.4 Control de Cambios

Todo cambio que impacte el alcance, tiempo o costos se someterá al protocolo formal de cuatro pasos:
1. **Emisión de Solicitud de Cambio (RFC):** Registro formal del requerimiento emergente y justificación de negocio.
2. **Evaluación de Impacto:** Análisis técnico del equipo en plazo máximo de 48 horas.
3. **Aprobación de Gerencia:** Ratificación formal suscrita por Marcell Vásquez o Angel Rodríguez.
4. **Control de Versiones en Git:** Incorporación controlada mediante feature branch y pull request auditado.

---

## 4. ESTRUCTURA DEL TRABAJO Y ESTIMADOS

#### TABLA 21: PASOS Y ESTIMACIÓN TEMPORAL DE FASES
| Paso | Descripción | Estimado |
|:---|:---|:---:|
| **Paso 1** | Fase 1: Gestión y Planificación del Proyecto (Acta, Business Case, SRS, Metodología, EDT, Cronograma, PDS) | 25 días |
| **Paso 2** | Fase 2: Diseño de Ingeniería y Arquitectura (Base de datos PostgreSQL, API FastAPI, Maquetación Angular) | 10 días |
| **Paso 3** | Fase 3: Construcción del Módulo Transaccional (Clientes, Catálogo, Talonario virtual, Candado de cobro, Insumos) | 15 días |
| **Paso 4** | Fase 4: Construcción de Módulos BI e IA (Endpoints agregados, Dashboards Angular, Dataset de boletas, Modelo predictivo) | 15 días |
| **Paso 5** | Fase 5: Pruebas, Implantación, Capacitación y Cierre (Pruebas ISO 25010, VPS Docker, Capacitación, Pretest/Postest, RSU, Tesis) | 25 días |

---

## 5. ENTREGABLES DEL PROYECTO

> *Nota de Observación Docente:* Siguiendo rigurosamente `notas_clase_profesor_6.txt` (Línea 13), esta sección contiene **una fila individual por cada entregable formal del proyecto**.

#### TABLA 22: LISTA FORMAL DE ENTREGABLES DEL PROYECTO
| Entregable | Descripción | Fecha de la Entrega |
|:---|:---|:---:|
| **Acta de Constitución Aprobada** | Documento fundacional con objetivos, alcance, gobernabilidad y firmas del cliente. | 22/08/2026 |
| **Business Case Validado** | Caso de negocio con estudio de viabilidad económica, KPIs y evaluación de alternativas. | 28/08/2026 |
| **Documento SRS IEEE 830** | Especificación de requerimientos de software con procesos reales de imprenta y RNF. | 28/08/2026 |
| **Matriz de Consistencia Metodológica** | Matriz pre-experimental que articula problema, hipótesis, objetivos y variables. | 02/09/2026 |
| **Informe de Estructura de Análisis** | Análisis de variables, población (N=125), muestra (n=125) y 6 antecedentes en prosa. | 04/09/2026 |
| **Grafo y Matriz EDT** | Estructura de desglose del trabajo de 4 niveles sin conectores Y ni paréntesis. | 08/09/2026 |
| **Cronograma Maestro del Proyecto** | Cronograma Gantt con duraciones, predecesoras, costos y asignación MultiRol balanceada. | 09/09/2026 |
| **Documento Plan de Desarrollo de Software** | Plan maestro de ingeniería que articula recursos, metodología, herramientas y entregables. | 10/09/2026 |
| **Matriz de Riesgos del Proyecto** | Matriz con 7 riesgos operacionales y contextuales mapeados a códigos EDT de 4 niveles. | 10/09/2026 |
| **Matriz RACI MultiRol** | Asignación equitativa de responsabilidades entre el equipo, gerencia y operarios de taller. | 10/09/2026 |
| **Matriz de Comunicaciones Oficial** | Protocolo formal de comunicaciones presenciales y digitales por entregable. | 11/09/2026 |
| **Script DDL PostgreSQL** | Script SQL con tablas relacionales, llaves foráneas y restricciones de integridad de datos. | 17/09/2026 |
| **Contenedor Docker PostgreSQL** | Contenedor oficial de PostgreSQL 16 configurado y persistente con volúmenes locales. | 18/09/2026 |
| **Repositorio Backend FastAPI** | Código fuente del backend asíncrono con arquitectura modular estructurada. | 22/09/2026 |
| **Especificación OpenAPI Swagger** | Documentación viva de los endpoints RESTful generada por FastAPI. | 24/09/2026 |
| **Componentes UI Angular** | Componentes standalone en Angular 21 maquetados con diseño responsive para taller. | 23/09/2026 |
| **Vista de Emisión de Órdenes** | Pantalla de talonario virtual que replica el diseño del contrato proforma físico. | 25/09/2026 |
| **Informe de Estado del Proyecto v1.0** | Reporte semanal de avance de alcance, tiempo y costos correspondiente al Sprint 1. | 19/09/2026 |
| **Portafolio Consolidado Evaluación T1** | Portafolio formal de entregables S1 a S6, costeo de 31 paquetes y lecciones aprendidas. | 26/09/2026 |
| **Módulo de Clientes Operativo** | Módulo web funcional para búsqueda, registro y edición de clientes comerciales. | 01/10/2026 |
| **Catálogo de Productos y Fórmulas** | Módulo de configuración de productos gráficos con fórmulas de sustrato por metro cuadrado. | 02/10/2026 |
| **Servicio de Emisión de Órdenes** | Servicio transaccional que asigna número correlativo y reserva insumos en inventario. | 08/10/2026 |
| **Plantilla de Impresión de Pedidos** | Formato de impresión de órdenes de trabajo para entrega en mostrador y guía de taller. | 10/10/2026 |
| **Mecanismo de Bloqueo de Entrega** | Candado digital de cobro que impide entregar pedidos si registran saldo pendiente impago. | 08/10/2026 |
| **Reporte de Cierre de Caja Diario** | Servicio de arqueo de caja con segregación de ingresos entre imprenta y gigantografías. | 09/10/2026 |
| **Servicio de Reserva de Insumos** | Algoritmo que descuenta preventivamente metros cuadrados de lona y vinil del stock. | 12/10/2026 |
| **Formulario de Ajuste de Taller** | Interfaz para registro de mermas técnicas y consumo adicional de material en taller. | 14/10/2026 |
| **Tablero Visual de Producción** | Tablero Kanban operativo para seguimiento de estados de pedidos en taller de máquinas. | 16/10/2026 |
| **Endpoints Analíticos FastAPI** | Servicios web de consulta agregada para métricas de ventas y rentabilidad por producto. | 23/10/2026 |
| **Tableros Ejecutivos de BI** | Dashboards gerenciales en Angular con gráficos interactivos de ventas y cobros. | 27/10/2026 |
| **Reportes Nativos en Excel 2021** | Exportación tabular nativa de reportes en formato .xlsx compatible con Office 2021. | 28/10/2026 |
| **Dataset Estructurado de Producción** | Base de datos normalizada con transcripción de boletas y órdenes físicas históricas. | 29/10/2026 |
| **Modelo Predictivo Entrenado** | Modelo de aprendizaje automático entrenado para predicción de demanda de insumos. | 03/11/2026 |
| **Servicio Predictivo de Reabastecimiento** | Endpoint de inferencia de IA que recomienda cantidades óptimas de compra de materiales. | 06/11/2026 |
| **Informe de Pruebas del Sistema** | Documento con resultados de pruebas unitarias, de integración y cobertura de requisitos. | 13/11/2026 |
| **Informe de Métricas de Calidad** | Evaluación formal de métricas de software bajo el estándar internacional ISO/IEC 25010. | 14/11/2026 |
| **Servidor VPS de Producción Activo** | Servidor Linux Ubuntu 24.04 configurado con contenedores Docker y proxy inverso Nginx. | 18/11/2026 |
| **Pipeline CI CD Desplegado** | Flujo automatizado en GitHub Actions para compilación, pruebas y despliegue a producción. | 19/11/2026 |
| **Manuales de Usuario del Sistema** | Guías técnicas ilustradas para administradora, jefe de producción y operarios de taller. | 23/11/2026 |
| **Acta de Capacitación del Personal** | Constancia formal suscrita con la gerencia de las jornadas de capacitación ejecutadas. | 25/11/2026 |
| **Base de Datos Pretest Documentada** | Registro estructurado de mediciones de línea base sobre 125 órdenes de talonarios físicos. | 20/11/2026 |
| **Base de Datos Postest Documentada** | Registro estructurado de mediciones post-implementación sobre 125 órdenes en el sistema web. | 26/11/2026 |
| **Informe Experimental de Resultados** | Análisis estadístico comparativo pretest vs postest contrastando las hipótesis del estudio. | 27/11/2026 |
| **Informe de Responsabilidad Social UPN** | Evidencias y reporte de la charla comunitaria ejecutada en la empresa (auditoría RSU). | 01/12/2026 |
| **Paper Científico Final de Tesis** | Artículo científico de investigación estructurado bajo directrices IMRyD para publicación. | 04/12/2026 |
| **Informe Final del Proyecto Capstone** | Memoria consolidada integral del proyecto de ingeniería de software con actas finales. | 05/12/2026 |

---

## 6. CALENDARIO DEL PROYECTO

#### TABLA 24: CALENDARIO DE FASES Y DISCIPLINAS
| Disciplinas / Objetos generados o modificados durante la Fase | Comienzo | Aprobación |
|:---|:---:|:---:|
| **Fase 1: Gestión y Planificación del Proyecto** (Acta, Business Case, SRS, Metodología, EDT, Cronograma, PDS, Riesgos, RACI, Comunicaciones) | 17/08/2026 | 11/09/2026 |
| **Fase 2: Diseño de Ingeniería y Arquitectura** (DDL PostgreSQL, Docker, Backend FastAPI, UI Angular, OpenAPI) | 14/09/2026 | 25/09/2026 |
| **Fase 3: Construcción del Módulo Transaccional** (Clientes, Catálogo, Talonario virtual, Candado de cobro, Insumos, Tablero Kanban) | 28/09/2026 | 16/10/2026 |
| **Fase 4: Construcción de Módulos BI e Inteligencia Artificial** (Endpoints analíticos, Dashboards Angular, Dataset boletas, Modelo IA) | 19/10/2026 | 06/11/2026 |
| **Fase 5: Pruebas, Implantación, Capacitación y Cierre** (Pruebas ISO 25010, VPS Docker, Manuales, Pretest/Postest, RSU, Paper, Memoria Final) | 09/11/2026 | 05/12/2026 |

---

## 7. MANEJO DE RIESGOS

Siguiendo las observaciones del docente (`notas_clase_profesor_4.txt` L22, L26 y L45), todos los riesgos corresponden a contingencias operacionales, contextuales y tecnológicas de la imprenta, mapeados estrictamente a códigos reales de la EDT canónica de 4 niveles, erradicando cualquier riesgo atribuido al equipo estudiantil.

| N° | Código EDT | Tipo de Riesgo | Riesgo / Fuente | Consecuencia Potencial | Acciones de Mitigación |
|:---:|:---:|:---|:---|:---|:---|
| **R1** | 1.1.2 | Gestión | Demora de la empresa en facilitar el lote de boletas físicas y talonarios anteriores. | Retraso en la estructuración de la línea base pretest y dataset de IA. | Establecimiento de cronograma de recojo in situ y digitalización asistida por el equipo en taller. |
| **R2** | 5.3.2 | Organizacional | Resistencia al cambio del personal de taller acostumbrado a talonarios físicos. | Retorno a prácticas manuales en papel y pérdida de trazabilidad. | Diseño de interfaces web que replican visualmente el talonario físico y jornadas personalizadas de inducción. |
| **R3** | 5.2.1 | Externo | Cortes imprevistos en la red eléctrica comercial en el centro histórico de Trujillo. | Detención temporal del mostrador y riesgo de interrupción de sesiones. | Persistencia transaccional ACID en PostgreSQL y almacenamiento local de borradores en la SPA web. |
| **R4** | 3.1.2 | Gestión | Discrepancias entre las tarifas vigentes y las fórmulas de insumos por metro cuadrado. | Errores en cotizaciones y cálculos inexactos de reservas de material. | Parametrización conjunta de recetas y factores de desperdicio con el Jefe de Taller antes del pase a producción. |
| **R5** | 3.3.1 | Técnico | Capturas de pantalla de pagos Yape cargadas con datos o montos inconsistentes. | Riesgo de registrar pagos ficticios y descalces en el arqueo diario. | Validación manual asistida con verificación obligatoria del N° de operación bancaria previa al desbloqueo del pedido. |
| **R6** | 5.2.1 | Técnico | Caída temporal del enlace de internet comercial o interrupción del servidor VPS. | Imposibilidad de sincronizar órdenes en tiempo real entre oficina y taller. | Arquitectura cliente resiliente con caché local y reconexión automática tan pronto se restablece la red. |
| **R7** | 4.2.2 | Calidad | Volumen insuficiente o inconsistencias en los registros de boletas para entrenar la IA. | Precisión del modelo predictivo por debajo de la meta del 70%. | Proceso riguroso de limpieza, normalización y aumento de datos históricos mediante técnicas de series temporales. |

---

## 8. PLANEACIÓN DE DEPENDENCIAS DEL PROYECTO

1. **Dependencia de Infraestructura de la Empresa:** La ejecución del software depende de la disponibilidad operativa de las computadoras y red existentes en Jr. Simón Bolívar 945, las cuales son mantenidas por la empresa.
2. **Dependencia de Información Contable:** El entrenamiento de la IA y la medición pretest dependen de la entrega formal de boletas y talonarios comerciales físicos por parte de la administración.
3. **Dependencia de Hitos Académicos UPN:** La entrega y cierre de fases está supeditada al cronograma oficial de 16 semanas del ciclo 2026-II, culminando con la entrega del software funcional a la empresa y sustentación final.
