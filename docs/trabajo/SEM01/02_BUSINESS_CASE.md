# CASO DE NEGOCIO (BUSINESS CASE)
## Universidad Privada del Norte — Ciclo 2026-II
### Curso: Proyecto Capstone (Aula: 22643421416 | Grupo 2)
### Organización Cliente: Impresos Trujillo E.I.R.L.

---

## TABLA DE CONTENIDO

- **Sección 1: Datos Generales del Proyecto y de la Empresa**
  - 1.1 Ficha de la Empresa
  - 1.2 Equipo del Proyecto (Capstone)
  - 1.3 Condiciones de Acceso a la Información
- **Sección 2: Resumen Ejecutivo**
  - 2.1 Situación Actual
  - 2.2 Resultados Esperados
  - 2.3 Recomendación
  - 2.4 Justificación
  - 2.5 Suposiciones
  - 2.6 Limitaciones
- **Sección 3: Gobierno y Equipo de Análisis del Business Case**
  - 3.1 Gobierno
  - 3.2 Equipo de Análisis del Business Case
- **Sección 4: Definición del Problema**
  - 4.1 Enunciado del Problema
  - 4.2 Metodología de Levantamiento de Información
  - 4.3 Organización Cliente y Componentes de su Entorno
  - 4.4 Entorno Tecnológico Actual
    - 4.4.1 Software Actual
    - 4.4.2 Hardware e Infraestructura Actual
- **Sección 5: Visión del Proyecto**
  - 5.1 Descripción del Proyecto
  - 5.2 Metas y Objetivos
  - 5.3 Medidas de Desempeño (KPI)
  - 5.4 Suposiciones
  - 5.5 Restricciones
  - 5.6 Entorno Tecnológico Propuesto
    - 5.6.1 Software Propuesto
    - 5.6.2 Hardware Propuesto
  - 5.7 Hitos Principales del Proyecto
- **Sección 6: Evaluación del Proyecto**
  - 6.1 Cumplimiento de Regulaciones
  - 6.2 Alineamiento Estratégico
  - 6.3 Análisis de Impacto
  - 6.4 Consideración de Riesgos
  - 6.6 Análisis de Alternativas
- **Sección 7: Selección del Proyecto**
  - 7.1 Metodología
  - 7.2 Resultados
- **Sección 8: Cronograma del Proyecto**
- **Sección 9: Glosario**
- **Sección 10: Control de Cambios**
- **Sección 11: Anexos**

---

## SECCIÓN 1: DATOS GENERALES DEL PROYECTO Y DE LA EMPRESA

### 1.1 Ficha de la Empresa

#### TABLA 1: DATOS DEL DOCUMENTO
| Campo | Detalle |
|:---|:---|
| **Versión** | Versión 1.0 |
| **Fecha de revisión** | 28/08/2026 |
| **Preparado por** | Gerardo Erick Plasencia Torres, Jose Estibb Anhuaman Delgado, Jose Diego Rodriguez Vasquez |
| **Aprobado por** | Angel Almilcar Rodríguez Evangelista (Gerente / Jefe de Taller), Marcell Magaly Vásquez Loje (Gerente / Jefa de Oficina) |
| **Nombre del proyecto** | Implementación de un sistema web transaccional con módulos de inteligencia de negocios e inteligencia artificial para la optimización de los procesos operativos y financieros en Impresos Trujillo E.I.R.L. |
| **Identificador del proyecto** | Grupo 2 (Aula: 22643421416) |

#### TABLA 2: FICHA DE LA EMPRESA
| Campo | Detalle |
|:---|:---|
| **Razón social** | Impresos Trujillo E.I.R.L. |
| **RUC** | 20602572952 |
| **Sector** | Servicios Gráficos y Publicitarios (CIIU 1811 - Impresión comercial) |
| **Tamaño de la empresa** | Microempresa (MYPE) — 5 colaboradores permanentes en oficina y taller |
| **Ubicación** | Jr. Simón Bolívar Nro. 945 Int. 1, Centro Cívico, Trujillo, La Libertad, Perú |
| **Persona de contacto** | Angel Almilcar Rodríguez Evangelista / Marcell Magaly Vásquez Loje |
| **Cargo** | Gerente General / Administradora de Oficina y Finanzas |

---

### 1.2 Equipo del Proyecto (Capstone)

#### TABLA 3: EQUIPO DEL PROYECTO
| Integrante | Código | Rol en el equipo | Correo |
|:---|:---|:---|:---|
| **Gerardo Erick Plasencia Torres** | N00305886 | Líder de Proyecto / Scrum Master / Full Stack | n00305886@upn.pe |
| **Jose Estibb Anhuaman Delgado** | N00302830 | Analista Frontend / UI-UX / Tester QA | n00302830@upn.pe |
| **Jose Diego Rodriguez Vasquez** | N00209425 | Desarrollador Backend & IA / DBA / Analista BI | n00209425@upn.pe |

---

### 1.3 Condiciones de Acceso a la Información

1. **Acuerdo de Acceso y Colaboración:** La gerencia autoriza visitas técnicas al taller e inspección in situ de talonarios comerciales, cuadernos de notas y archivos de cálculo en Microsoft Excel 2021.
2. **Confidencialidad de la Información (Ley N° 29733):** Se pacta reserva absoluta sobre precios de compra de insumos a distribuidores mayoristas y base de datos de clientes comerciales.
3. **Mecanismos de Recolección:** Entrevistas semiestructuradas con los administradores, observación directa del flujo en taller, arqueo de talonarios de papel y digitalización estructurada de boletas físicas.

---

## SECCIÓN 2: RESUMEN EJECUTIVO

### 2.1 Situación Actual
Impresos Trujillo E.I.R.L. administra sus operaciones mediante talonarios comerciales físicos de Contrato/Proforma y cuadernos manuscritos. La emisión manual de una orden toma en promedio 18.5 minutos por cliente, se registra un 14.3% de extravíos o deterioros de órdenes físicas entre la oficina y las máquinas de taller, y un 11.2% de los pedidos son despachados con saldos pendientes sin liquidar en caja. El control de rollos de lona y vinil es empírico, originando hasta 3 días hábiles de paro productivo al mes por quiebres imprevistos de material.

### 2.2 Resultados Esperados
1. Reducir el tiempo promedio de registro y emisión de órdenes a menos de 5 minutos por cliente.
2. Eliminar completamente (0%) la pérdida económica por entrega de pedidos con saldos pendientes impagos mediante un candado digital de cobro en caja.
3. Asegurar el 100% de trazabilidad de órdenes de trabajo en taller, eliminando el extravío físico de pedidos.
4. Prevenir quiebres de inventario mediante descuento automático por receta y un modelo predictivo de demanda mensual de insumos.
5. Proveer tableros analíticos de inteligencia de negocios para visualizar rentabilidad por producto y productividad por operario.

### 2.3 Recomendación
Se recomienda implementar un sistema web desacoplado basado en Angular 21 (Frontend SPA responsivo), FastAPI en Python 3.11 (Backend API RESTful asíncrono), PostgreSQL nativo sobre Docker, y módulos analíticos en Scikit-learn y Prophet. La solución se desplegará en un servidor VPS Linux propio con integración continua (CI/CD) mediante GitHub Actions, reutilizando las computadoras y red existentes en la empresa con costo cero de inversión en hardware.

### 2.4 Justificación (Impacto de NO Automatizar)
Si la empresa **NO automatiza** sus procesos y mantiene el estado actual (status quo en papel):
1. **Pérdidas económicas crecientes e irrecuperables:** Continuará fugando liquidez por pedidos retirados sin cancelar el saldo final, lo que en temporadas de alta demanda electoral o comercial representa descalces financieros graves.
2. **Colapso del mostrador y pérdida de clientes:** El cuello de botella de 18.5 minutos por orden limitará la captación de nuevos clientes corporativos que exigen inmediatez.
3. **Paros de producción costosos:** La falta de cálculo automático de insumos seguirá provocando compras de emergencia a precios minoristas elevados o parálisis del plotter Wit-Color.
4. **Incapacidad de crecimiento:** Sin métricas consolidadas de caja y costos, la administración no podrá negociar mejores márgenes con proveedores ni expandir su capacidad instalada.

### 2.5 Suposiciones
1. La empresa garantizará el acceso continuo a los registros históricos de órdenes de trabajo físicas, talonarios comerciales y archivos Excel para el levantamiento de la línea base operativa.
2. La gerencia y el personal clave dispondrán de un mínimo de 2 horas semanales para reuniones de coordinación técnica, validación de incrementos y pruebas en taller.
3. Las 6 computadoras registradas en oficina y taller (sistemas Windows 10 y Windows 11) y el enlace de internet de 200 Mbps se mantendrán operativos y disponibles durante el proyecto.
4. Las recetas y reglas de consumo de insumos definidas con el Jefe de Taller se mantendrán estables durante el período experimental.

### 2.6 Limitaciones
1. El sistema no incluye facturación electrónica directa con la API de SUNAT; la emisión fiscal se mantiene en el Portal Clave SOL.
2. No se construirán aplicaciones móviles nativas para tiendas Play Store o App Store; el acceso se realiza por navegador web.
3. No se incorpora pasarela de pagos automatizada con cobro bancario en línea.
4. No se incluye gestión de recursos humanos ni cálculo de planillas salariales (SUNAFIL).

---

## SECCIÓN 3: GOBIERNO Y EQUIPO DE ANÁLISIS DEL BUSINESS CASE

### 3.1 Gobierno
La empresa no posee un departamento formal de TI. La dirección estratégica y tecnológica recae en la Gerencia General de Impresos Trujillo E.I.R.L. en estrecha coordinación con el Líder de Proyecto del equipo Capstone.

### 3.2 Equipo de Análisis del Business Case

#### TABLA 4: EQUIPO DE ANÁLISIS
| Rol | Nombre / Cargo | Procedencia |
|:---|:---|:---|
| **Auspiciante Ejecutivo (empresa)** | Angel Almilcar Rodríguez Evangelista — Gerente / Jefe de Taller | Empresa |
| **Auspiciante Ejecutivo (empresa)** | Marcell Magaly Vásquez Loje — Gerente / Jefa de Oficina y Finanzas | Empresa |
| **Auspiciante Tecnológico** | Gerardo Erick Plasencia Torres — Arquitecto de Software y Líder | Universidad |
| **Asesor Académico** | Ing. Jose Alberto Gomez Avila — Docente del Curso Capstone | Universidad |
| **Analistas de Negocio** | Jose Estibb Anhuaman Delgado / Jose Diego Rodriguez Vasquez | Universidad |
| **Gerente Funcional (Taller)** | Angel Almilcar Rodríguez Evangelista — Jefe de Producción | Empresa |
| **Gerente Funcional (Oficina)** | Marcell Magaly Vásquez Loje — Administradora Comercial | Empresa |
| **Líder de Proyecto** | Gerardo Erick Plasencia Torres — Scrum Master y Full Stack | Universidad |

---

## SECCIÓN 4: DEFINICIÓN DEL PROBLEMA

### 4.1 Enunciado del Problema
> **¿De qué manera la implementación de un sistema web transaccional con módulos de inteligencia de negocios e inteligencia artificial optimiza los procesos operativos y financieros en Impresos Trujillo E.I.R.L.?**

### 4.2 Metodología de Levantamiento de Información

#### TABLA 5: TÉCNICAS DE LEVANTAMIENTO DE INFORMACIÓN
| Técnica | Fuente / Participante | Fecha | Hallazgo principal |
|:---|:---|:---|:---|
| **Entrevista semiestructurada** | Marcell Magaly Vásquez Loje (Jefa de Oficina) | 15/08/2026 | Descontrol en cobro de saldos y demora crítica al llenar talonarios físicos a mano. |
| **Inspección in situ y observación** | Angel Almilcar Rodríguez (Jefe de Taller) | 18/08/2026 | Frecuente extravío de hojas de pedido en taller y quiebres de rollos de lona y vinil. |
| **Auditoría de talonarios y boletas** | Lote de boletas físicas y cuadernos de taller | 20/08/2026 | Inexistencia de correlativos digitales y descalce entre pedidos terminados y cobros. |
| **Levantamiento técnico de TI** | Computadoras de oficina, taller y red | 22/08/2026 | Hardware suficiente (Core i5/i7, 8-16GB RAM) compatible con clientes web modernos. |

---

### 4.3 Organización Cliente y Componentes de su Entorno

#### TABLA 6: GRUPOS DE PERSONAS INTERESADAS (GPI)
| GPI | Descripción |
|:---|:---|
| **Gerencia General** | Socios propietarios que supervisan la rentabilidad del negocio y aprueban el software. |
| **Administración y Oficina** | Personal de mostrador que registra pedidos, emite contratos y efectúa cobros en caja. |
| **Jefatura de Producción** | Administra las órdenes en taller, asigna tareas a operarios y controla las máquinas. |
| **Operarios y Diseñadores** | Personal operativo que adapta artes gráficos y opera las impresoras industriales. |
| **Clientes Comerciales** | Usuarios finales que contratan servicios gráficos y exigen rapidez y puntualidad. |
| **Equipo Capstone** | Tres ingenieros de sistemas responsables del diseño, desarrollo y validación experimental. |

#### TABLA 7: PROCESOS / SERVICIOS AFECTADOS
| Procesos/Servicios | Descripción de las Modificaciones/Automatizaciones |
|:---|:---|
| **Emisión de Órdenes de Trabajo** | Reemplazo del talonario físico manual por talonario digital con correlativo automático. |
| **Cobro y Liquidación de Caja** | Control estricto de adelantos y saldos con candado digital que impide entregar sin cobro. |
| **Gestión de Insumos y Recetas** | Reserva automática de lona, vinil y tintas según las medidas del trabajo solicitado. |
| **Seguimiento de Producción** | Pipeline visual de estados en taller (Pendiente, En Taller, Terminado, Entregado). |
| **Análisis Gerencial (BI e IA)** | Dashboards de productividad y ventas, más predicción mensual de demanda de material. |

---

### 4.4 Entorno Tecnológico Actual

#### 4.4.1 Software Actual

#### TABLA 8: SOFTWARE ACTUAL
| Ítem de Software | Descripción |
|:---|:---|
| **Sistema Operativo (Oficina)** | Microsoft Windows 10 Pro 64-bit (Licencia OEM activa) |
| **Sistema Operativo (Taller)** | Microsoft Windows 11 Pro 64-bit (Licencia OEM activa) |
| **Ofimática y Cuentas** | Microsoft Office 2021 LTSC (Excel 2021 utilizado para control de ingresos) |
| **Software RIP de Impresión** | SAi PhotoPrint DX 12 Cloud Edition (Software de ripeo para plotter Wit-Color) |
| **Diseño Gráfico Publicitario** | Adobe Illustrator CC 2022 / CorelDRAW Graphics Suite 2021 |
| **Navegadores de Internet** | Google Chrome versión 128+ / Microsoft Edge versión 128+ |

#### 4.4.2 Hardware e Infraestructura Actual

#### TABLA 9: HARDWARE ACTUAL
| Ítem de Hardware | Descripción |
|:---|:---|
| **Estación de Oficina (Caja/Ventas)** | PC Desktop Intel Core i5-10400, 16 GB RAM DDR4, SSD 480 GB Kingston, Monitor 21.5" |
| **Estación de Taller 1 (Diseño)** | PC Desktop Intel Core i7-10700, 16 GB RAM DDR4, SSD 500 GB NVMe, Monitor 24" IPS |
| **Estación de Taller 2 (RIP Wit-Color)** | PC Desktop Intel Core i5-8400, 8 GB RAM DDR4, SSD 240 GB + HDD 1 TB, Monitor 19" |
| **Plotter Gran Formato** | Wit-Color Ultra 1000 (Cabezales Epson DX5, ancho de impresión 3.20 metros) |
| **Infraestructura de Conectividad** | Router Fibra Óptica Movistar simétrico 200 Mbps + Switch TP-Link Gigabit 8 puertos |
| **Terminal de Cobranza Móvil** | Smartphone Xiaomi Redmi Note 11 (App Yape y banca móvil BCP para oficina) |

---

## SECCIÓN 5: VISIÓN DEL PROYECTO

### 5.1 Descripción del Proyecto

#### TABLA 10: DESCRIPCIÓN DEL PROYECTO
| Descripción del Proyecto |
|:---|
| Desarrollo e implementación de un sistema web integral de gestión gráfica que consta de tres componentes articulados: un **Módulo Transaccional** para la emisión digital de órdenes con formato de Contrato/Proforma, trazabilidad de pedidos en taller y candado digital de cobro en caja; un **Módulo de Business Intelligence (BI)** para el monitoreo de ingresos, rotación de insumos y rentabilidad; y un **Módulo de Inteligencia Artificial (IA)** para la predicción de demanda de materiales críticos y detección de anomalías en consumos. |

---

### 5.2 Metas y Objetivos

#### TABLA 11: METAS DE NEGOCIO
| Metas de Negocio | Descripción |
|:---|:---|
| **MN1: Celeridad en Atención** | Reducir el tiempo de atención comercial por cliente a menos de 5 minutos. |
| **MN2: Cero Fugas Financieras** | Eliminar las pérdidas económicas derivadas de pedidos entregados sin cobrar el saldo. |
| **MN3: Eficiencia en Abastecimiento** | Eliminar los paros de taller ocasionados por falta imprevista de rollos de lona o vinil. |
| **MN4: Inteligencia de Negocios** | Disponer de tableros consolidados de ventas y productividad en tiempo real. |
| **MN5: Planificación Inteligente** | Anticipar las compras mensuales de materiales críticos mediante modelos predictivos. |

#### TABLA 12: OBJETIVOS DEL PROYECTO
| Objetivos del Proyecto | Descripción |
|:---|:---|
| **OE1: Digitalización Transaccional** | Implementar la emisión digital de órdenes de trabajo para reducir el tiempo de atención. |
| **OE2: Candado Digital de Caja** | Controlar la liquidación total de cobros para evitar despachos con saldos impagos. |
| **OE3: Descuento Automático de Insumos** | Gestionar el stock y consumo de insumos por orden para prevenir quiebres de material. |
| **OE4: Dashboards Analíticos BI** | Generar reportes ejecutivos de rendimiento para optimizar la toma de decisiones. |
| **OE5: Modelo Predictivo de IA** | Entrenar un algoritmo de aprendizaje automático para predecir la demanda de insumos. |

---

### 5.3 Medidas de Desempeño (KPI)

#### TABLA 13: MEDIDAS DE DESEMPEÑO (KPI)
| Proceso/Servicio Clave | KPI | Línea Base Actual | Meta Esperada |
|:---|:---|:---|:---|
| **Atención y Emisión de Órdenes** | Tiempo promedio de registro por orden | 18.5 minutos | ≤ 5.0 minutos |
| **Despacho y Liquidación de Cobros** | Tasa de órdenes entregadas con saldo pendiente | 11.2% de órdenes | 0.0% (Eliminación total) |
| **Trazabilidad en Taller de Producción** | Tasa de órdenes físicas extraviadas o traspapeladas | 14.3% de órdenes | 0.0% (Trazabilidad total) |
| **Disponibilidad de Materiales Críticos** | Días hábiles de paro mensual por falta de insumos | 3.0 días / mes | 0.0 días / mes |
| **Consolidación Financiera de Caja** | Tiempo semanal de arqueo y cierre de cuentas | 240 minutos / sem | ≤ 15 minutos / sem |

---

### 5.4 Suposiciones
1. La empresa garantizará el acceso continuo a los registros históricos de órdenes de trabajo físicas, talonarios comerciales y archivos Excel para el levantamiento de la línea base operativa.
2. La gerencia y el personal clave dispondrán de un mínimo de 2 horas semanales para reuniones de coordinación técnica, validación de incrementos y pruebas en taller.
3. Las 6 computadoras registradas en oficina y taller (sistemas Windows 10 y Windows 11) y el enlace de internet de 200 Mbps se mantendrán operativos y disponibles durante el proyecto.
4. Las recetas y reglas de consumo de insumos definidas con el Jefe de Taller se mantendrán estables durante el período experimental.

### 5.5 Restricciones
1. **Plazo Estricto de Entrega:** El sistema debe encontrarse 100% operativo e implantado en la empresa en la semana 11 del ciclo académico para la ejecución del postest y emisión del informe empresarial.
2. **Arquitectura Web Ligera:** El sistema debe operar exclusivamente mediante navegadores web modernos (Google Chrome y Microsoft Edge), sin requerir instalación de software cliente en las máquinas del cliente.
3. **Compatibilidad Ofimática:** Todo reporte y tabla exportable debe ser nativamente compatible con Microsoft Excel 2021 LTSC (.xlsx).
4. **Límite Presupuestario Universitario:** El gasto en efectivo autofinanciado para el despliegue del proyecto no superará los S/ 300.00.

---

### 5.6 Entorno Tecnológico Propuesto

#### 5.6.1 Software Propuesto

#### TABLA 14: SOFTWARE PROPUESTO
| Ítem de Software | Descripción |
|:---|:---|
| **Frontend Framework** | Angular 21 (SPA standalone, TypeScript, maquetación CSS/Tailwind, sin Figma) |
| **Backend REST API** | FastAPI (Python 3.11+, Pydantic v2, SQLAlchemy 2 async) |
| **Motor de Base de Datos** | PostgreSQL 16 nativo en contenedor Docker oficial |
| **Librerías de Analítica e IA** | Scikit-learn 1.5, Prophet, Pandas y NumPy en contenedor de backend |
| **Servidor Web y Contenedores** | Nginx Reverse Proxy y Docker Engine 26+ sobre Linux Ubuntu 24.04 LTS |

#### 5.6.2 Hardware Propuesto

#### TABLA 15: HARDWARE PROPUESTO
| Ítem de Hardware | Descripción |
|:---|:---|
| **Estaciones de Trabajo de la Empresa** | 6 computadoras de escritorio existentes reutilizadas (Costo presupuestal: S/ 0.00) |
| **Servidor de Producción VPS** | VPS particular propio en la nube (2 vCPU, 4 GB RAM, 60 GB NVMe - Costo S/ 180.00) |
| **Red y Conectividad** | Enlace existente de fibra óptica de la empresa (Costo presupuestal: S/ 0.00) |

---

### 5.7 Hitos Principales del Proyecto

#### TABLA 16: HITOS PRINCIPALES DEL PROYECTO
| Hito/Entregable | Fecha Tentativa |
|:---|:---|
| **Hito 1: Aprobación de Documentos Iniciales (Acta, Business Case, SRS IEEE 830)** | 28/08/2026 |
| **Hito 2: Aprobación de Planificación, EDT, Cronograma y Matriz de Consistencia** | 04/09/2026 |
| **Hito 3: Aprobación del Plan de Desarrollo de Software y Matrices de Riesgos y RACI** | 11/09/2026 |
| **Hito 4: Primer Informe de Estado y Sprint 1 operativo en taller (Evaluación T1)** | 26/09/2026 |
| **Hito 5: Primer Monitoreo y Práctica de Campo corte 1 (Módulo Caja y Digitalización)** | 03/10/2026 |
| **Hito 6: Despliegue de Módulos BI e IA e Informe de Estado v5.0 (Evaluación T2)** | 24/10/2026 |
| **Hito 7: 100% Software Desplegado en VPS y Entrega Formal a la Empresa (T3)** | 31/10/2026 |
| **Hito 8: Ejecución de Charla de Responsabilidad Social Universitaria (RSU)** | 07/11/2026 |
| **Hito 9: Evaluación Experimental Pretest/Postest y Cierre de Prácticas de Campo** | 21/11/2026 |
| **Hito 10: Presentación del Paper de Investigación y Sustentación Final del Proyecto** | 05/12/2026 |

---

## SECCIÓN 6: EVALUACIÓN DEL PROYECTO

### 6.1 Cumplimiento de Regulaciones

#### TABLA 17: MANDATOS REGULATORIOS
| Mandatos relacionados con el proyecto | Citación Regulatoria |
|:---|:---|
| **Protección de Datos Personales** | Ley N° 29733 y D.S. N° 003-2013-JUS: Confidencialidad de DNI/RUC y teléfonos de clientes. |
| **Normativa de Comprobantes de Pago** | R.S. N° 007-99/SUNAT: Las órdenes digitales son comprobantes internos de servicio. |
| **Seguridad y Salud en el Trabajo** | Ley N° 29783: Reducción de fatiga visual y posturas ergonómicas en taller gráfico. |
| **Propiedad Intelectual y Software** | D.L. N° 822 (Ley sobre el Derecho de Autor) y licencias abiertas MIT / Apache 2.0. |

---

### 6.2 Alineamiento Estratégico

Impresos Trujillo E.I.R.L. es una empresa familiar que no posee un documento formal de "Plan Estratégico 2026-2030", pero opera bajo directrices estratégicas funcionales claramente verbalizadas por su Gerencia General.

#### TABLA 18: ALINEAMIENTO ESTRATÉGICO
| Plan Estratégico | Objetivos | Meta | Relación con el Proyecto |
|:---|:---|:---|:---|
| **Eje Estratégico 1: Celeridad Comercial** | Reducir tiempos de atención y cotización en mostrador. | Atender pedidos en menos de 5 min y evitar pérdida de clientes. | **Relación Directa** |
| **Eje Estratégico 2: Disciplina Financiera** | Asegurar la cobranza íntegra de todos los trabajos realizados. | Fuga de cobranzas reducida a 0% mediante candado de caja. | **Relación Directa** |
| **Eje Estratégico 3: Continuidad Operativa** | Mantener abastecimiento constante de rollos de lona y vinil. | Cero paros productivos en plotter Wit-Color por falta de stock. | **Relación Directa** |
| **Eje Estratégico 4: Control de Gestión** | Conocer el rendimiento por operario y rentabilidad por producto. | Dashboards analíticos semanales accesibles por la Gerencia. | **Relación Directa** |

---

### 6.3 Análisis de Impacto
1. **Impacto Operativo:** Ahorro proyectado de 13.5 minutos por pedido emitido y eliminación del 100% de órdenes de papel extraviadas.
2. **Impacto Financiero:** Recuperación del 11.2% de ingresos retenidos por pedidos impagos y reducción de compras de emergencia a precios minoristas.
3. **Impacto en Recursos y Energía:** Aumento insignificante en consumo de energía eléctrica (< S/ 5.00 mensuales por uso de PC). Ahorro neto en resmas de papel y talonarios de imprenta (S/ 60.00 mensuales).
4. **Impacto Organizacional:** Requiere un plan de capacitación de 4 sesiones presenciales de 45 minutos para vencer la curva inicial de resistencia al cambio del personal de taller.

---

### 6.4 y 6.5 Consideración de Riesgos

#### TABLA 19: MATRIZ DE RIESGOS
| Riesgo | Probabilidad/Impacto | Acciones de Mitigación |
|:---|:---:|:---|
| **R1: Cortes imprevistos en la red eléctrica en el Centro de Trujillo** | 3 / 4 | Persistencia inmediata en base de datos PostgreSQL y auto-guardado en la SPA web. |
| **R2: Resistencia inicial de operarios al reemplazo del papel** | 4 / 3 | Capacitación personalizada in situ e interfaz que replica visualmente el talonario físico. |
| **R3: Caída temporal del servicio de internet en el local comercial** | 2 / 3 | Resiliencia en cliente Angular con almacenamiento en caché y sincronización automática. |
| **R4: Alta congestión comercial de la empresa durante horas punta** | 3 / 3 | Coordinación de pruebas y capacitaciones en horarios de baja afluencia matutina. |
| **R5: Retraso en suministro mayorista de insumos importados** | 2 / 4 | Umbrales de alerta temprana en el modelo predictivo de IA para compras anticipadas. |

*Escala: Probabilidad (1 a 5) / Impacto (1 a 5).* En ningún caso se consideran deficiencias del equipo como riesgo.

---

### 6.6 Análisis de Alternativas

#### TABLA 20: NO HACER NADA (STATUS QUO)
| No Hacer Nada (Status Quo) | Factores Clave que muestran la No Viabilidad |
|:---|:---|
| **Mantener talonarios de papel y cuadernos manuales** | Perpetúa la fuga de ingresos por pedidos impagos (11.2%), mantiene la demora de 18.5 min/orden, provoca extravíos del 14.3% de pedidos e impide el escalamiento comercial del negocio. |

#### TABLA 21: OPCIÓN ALTERNATIVA
| Opción(es) Alternativa(s) | Factores Clave que muestran la No Viabilidad |
|:---|:---|
| **Adquisición de ERP Comercial Enlatado (ej. Odoo SaaS / SAP Business One)** | Costo de licencias mensuales en dólares inasumible para una MYPE, complejidad excesiva, falta de adaptación al flujo de recetas gráficas (lona por m²) y dependencia de terceros. |

---

## SECCIÓN 7: SELECCIÓN DEL PROYECTO

### 7.1 Metodología de Decisión Ponderada

#### TABLA 22: MATRIZ DE DECISIÓN PONDERADA
| Criterio | Peso (%) | Opción A: Desarrollo a Medida (Angular + FastAPI + Docker) | Opción B: ERP Gráfico Especializado (PrintIQ / Optimus Graphic) | Opción C: Software Administrativo MYPE Genérico (Defontana ERP) |
|:---|:---:|:---:|:---:|:---:|
| **Alineamiento con Procesos de Imprenta** | 30% | 5 (1.50) | 4 (1.20) | 2 (0.60) |
| **Costo Total de Adquisición y Operación** | 25% | 5 (1.25) | 1 (0.25) | 2 (0.50) |
| **Independencia Tecnológica y Flexibilidad** | 20% | 5 (1.00) | 2 (0.40) | 2 (0.40) |
| **Capacidad Analítica y Predictiva (BI/IA)** | 15% | 5 (0.75) | 3 (0.45) | 1 (0.15) |
| **Facilidad de Adopción por el Personal** | 10% | 4 (0.40) | 2 (0.20) | 3 (0.30) |
| **PUNTAJE PONDERADO TOTAL** | **100%** | **4.90 / 5.00** | **2.50 / 5.00** | **1.95 / 5.00** |

*Escala de Calificación:* 1 (Muy deficiente) a 5 (Excelente).

### 7.2 Resultados
La **Opción A (Desarrollo a Medida con Angular 21, FastAPI y PostgreSQL sobre Docker)** obtiene un puntaje contundente de **4.90 sobre 5.00**, demostrando viabilidad absoluta al personalizar el cálculo de recetas de imprenta por metro cuadrado, asegurar el candado digital de cobro y operar a costo mínimo reutilizando la infraestructura instalada, frente a alternativas comerciales con costos recurrentes prohibitivos o sistemas genéricos incapaces de modelar recetas gráficas.

---

## SECCIÓN 8: CRONOGRAMA DEL PROYECTO

#### TABLA 23: CRONOGRAMA MAESTRO DEL PROYECTO
| Semana | Entregables | Fecha Inicio / Fecha Fin |
|:---|:---|:---|
| **Semana 01** | Presentación de sílabo e inducción académica en la universidad | 17/08/2026 – 22/08/2026 |
| **Semana 02 (SEM01)** | Acta de Constitución, Business Case y Requerimientos IEEE 830 | 24/08/2026 – 28/08/2026 |
| **Semana 03 (SEM02)** | EDT, Cronograma Gantt, Matriz de Consistencia y Estructura de Análisis | 31/08/2026 – 04/09/2026 |
| **Semana 04 (SEM03)** | Plan de Desarrollo de Software, Matriz de Riesgos, Matriz RACI y Comunicaciones | 07/09/2026 – 11/09/2026 |
| **Semana 05 (SEM04)** | Informe de Estado v1.0, Sprint 1 Backlog y Scrum Diario | 14/09/2026 – 19/09/2026 |
| **Semana 06 (SEM05)** | Evaluación T1: Informe de Estado v2.0, Costeo de 31 Paquetes y Portafolio T1 | 21/09/2026 – 26/09/2026 |
| **Semana 07 (SEM06)** | Monitoreo 1: Práctica de Campo corte 1 (30% software) y Métricas ISO 25010 | 28/09/2026 – 03/10/2026 |
| **Semana 08 (SEM07)** | Monitoreo Avance: Demostración del Software e Instrumentos de Recolección | 05/10/2026 – 10/10/2026 |
| **Semana 09** | Sprint 2: Vistas de Business Intelligence e integración de datos | 12/10/2026 – 17/10/2026 |
| **Semana 10 (T2)** | Evaluación T2: 70% funcionalidad, pruebas de integración y reporte de avance | 19/10/2026 – 24/10/2026 |
| **Semana 11** | 100% Software Desplegado en VPS y cierre de informes de estado semanales | 26/10/2026 – 31/10/2026 |
| **Semana 12** | Charla auditada de Responsabilidad Social Universitaria (RSU) en la empresa | 02/11/2026 – 07/11/2026 |
| **Semana 13 (T3)** | Evaluación T3: Evaluación de prácticas de campo, pretest y postest en taller | 09/11/2026 – 14/11/2026 |
| **Semana 14** | Consolidación y cierre del portafolio final de prácticas de campo | 16/11/2026 – 21/11/2026 |
| **Semana 15** | Jornada de evaluación inter-equipos y co-evaluación académica | 23/11/2026 – 28/11/2026 |
| **Semana 16 (EF)** | Evaluación Final: Sustentación del proyecto y entrega del Paper de Investigación | 30/11/2026 – 05/12/2026 |

---

## SECCIÓN 9: GLOSARIO

#### TABLA 24: GLOSARIO DE TÉRMINOS
| Término / Acrónimo | Definición |
|:---|:---|
| **API** | Application Programming Interface (interfaz de programación para comunicación backend-frontend). |
| **BI** | Business Intelligence (tecnologías para transformar datos operativos en información estratégica). |
| **Candado Digital** | Mecanismo de software que impide cambiar una orden al estado "Entregado" si registra saldo por cobrar. |
| **CIIU** | Clasificación Industrial Internacional Uniforme (código estándar de actividad económica). |
| **Docker** | Plataforma de virtualización basada en contenedores ligeros que empaquetan la aplicación y sus dependencias. |
| **FastAPI** | Framework web moderno y asíncrono en Python orientado a la creación de APIs de alto rendimiento. |
| **IA** | Inteligencia Artificial (algoritmos computacionales orientados al aprendizaje automático y predicción). |
| **PostgreSQL** | Sistema de gestión de bases de datos relacional de código abierto reconocido por su fiabilidad y concurrencia. |
| **RIP** | Raster Image Processor (software que traduce archivos gráficos vectoriales en mapas de bits para impresión). |
| **SPA** | Single Page Application (aplicación web de página única desarrollada en Angular para una interacción fluida). |
| **VPS** | Virtual Private Server (servidor virtual privado dedicado al alojamiento del backend y base de datos). |

---

## SECCIÓN 10: CONTROL DE CAMBIOS

#### TABLA 25: CONTROL DE CAMBIOS DEL DOCUMENTO
| Versión | Fecha | Nombre | Descripción |
|:---|:---|:---|:---|
| **1.0** | 28/08/2026 | Gerardo Erick Plasencia Torres — Líder de Proyecto / Scrum Master | Elaboración inicial completa del Caso de Negocio (Business Case). |
| **1.1** | 04/09/2026 | Jose Diego Rodriguez Vasquez — Desarrollador Backend & IA | Alineamiento de la Pregunta Problema con la Estructura de Análisis (Semana 2). |
| **1.2** | 11/09/2026 | Jose Estibb Anhuaman Delgado — Analista Frontend / UI-UX | Inclusión de especificaciones técnicas y capacidades de hardware in situ. |
| **1.3** | 26/09/2026 | Marcell Magaly Vásquez Loje — Administradora de Oficina y Finanzas (Cliente) | Validación de alineamiento funcional y cierre formal del hito T1. |

---

## SECCIÓN 11: ANEXOS

1. **Evidencias Fotográficas de la Visita Técnica N° 1 a Impresos Trujillo E.I.R.L. (Jr. Simón Bolívar 945 Int. 1):**
   - Fotografía 1: Fachada y mostrador comercial de atención con los talonarios físicos de Contrato/Proforma.
   - Fotografía 2: Estación de diseño gráfico y PC de oficina operando con Microsoft Excel 2021 LTSC.
   - Fotografía 3: Máquina industrial de impresión gran formato Wit-Color Ultra 1000 en el taller de producción.
   - Fotografía 4: Rollos de lona banner y vinil adhesivo almacenados sin registro sistematizado de stock.
   - Fotografía 5: Sesión técnica de validación con el Gerente de Taller (Angel Rodríguez) y la Jefa de Oficina (Marcell Vásquez).
2. **Documentación Complementaria de Apoyo:**
   - Boletas de venta físicas digitalizadas y cuadernos comerciales de control diario de ingresos de agosto 2026.
   - Ficha RUC electrónica SUNAT emitida para Impresos Trujillo E.I.R.L. (RUC 20602572952).
