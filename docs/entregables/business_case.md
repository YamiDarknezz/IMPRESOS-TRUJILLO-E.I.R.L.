# Business Case — Caso de Negocio

## Información del Documento y Control de Versiones

| Campo | Detalle |
| :--- | :--- |
| **Proyecto:** | Implementación de un sistema web transaccional con módulos de inteligencia de negocios e inteligencia artificial para la optimización de los procesos operativos en la empresa Impresos Trujillo E.I.R.L. |
| **Identificador / Código:** | Grupo 2 (Aula: 22643421416) |
| **Versión:** | 1.0 |
| **Fecha de revisión:** | 28/08/2026 |
| **Autor:** | Equipo de Proyecto Capstone — Grupo 2 |
| **Aprobado por:** | Angel Almilcar Rodríguez Evangelista (Dueño / Jefe de Taller) y Marcell Magaly Vásquez Loje (Dueña / Jefa de Oficina) |

---

# Sección 1: Datos Generales del Proyecto y de la Empresa

### 1.1 Ficha de la Empresa
| Campo | Detalle |
| :--- | :--- |
| **Razón Social** | Impresos Trujillo E.I.R.L. |
| **RUC** | 20602572952 (Activo y Habido) |
| **Sector y Actividad Económica** | Industria Gráfica y Publicitaria (CIIU Principal: 1811 - Impresión; Secundaria: 7310 - Publicidad) |
| **Tamaño de la Empresa** | Microempresa (8 colaboradores en planta y oficina) |
| **Domicilio Fiscal / Ubicación** | Jr. Simón Bolívar Nro. 945 Int. 1, Trujillo, La Libertad, Perú |
| **Persona de Contacto** | Angel Almilcar Rodríguez Evangelista (Gerente / Jefe de Taller) — Tel: 924 943 790 |
| **Horario de Atención** | Lunes a Sábado de 10:00 AM a 8:00 PM |
| **Régimen y Comprobantes** | Emisor Electrónico Portal SUNAT (Factura Portal y Boleta Portal desde 2021/2022) |

### 1.2 Equipo del Proyecto (Capstone)
| Integrante | Código | Rol en el Equipo (MultiRol) | Correo Institucional |
| :--- | :--- | :--- | :--- |
| **Gerardo Erick Plasencia Torres** | N00340097 | Líder de Proyecto / Scrum Master / Arquitecto de Software / Full Stack / DevOps | N00340097@upn.pe |
| **Jose Estibb Anhuaman Delgado** | N00340098 | Desarrollador Frontend Lead / Diseñador UI/UX / QA Tester Funcional / Analista | N00340098@upn.pe |
| **Jose Diego Rodriguez Vasquez** | N00340099 | Desarrollador Backend Lead / Ingeniero de Datos & IA / DBA PostgreSQL / QA Performance | N00340099@upn.pe |

### 1.3 Condiciones de Acceso a la Información
El acceso a la información operativa y financiera de Impresos Trujillo E.I.R.L. se gestionó mediante acuerdo formal de cooperación académica y técnica entre los propietarios y el equipo de desarrollo. Se establecieron las siguientes condiciones:
1. **Mecanismo de levantamiento:** Entrevistas presenciales semiestructuradas, observación directa de las faenas de impresión en taller, muestreo de tiempos de atención y digitalización de talonarios físicos de contratos/proformas ("talón de aire") y libros manuales en Excel 2021.
2. **Nivel de Confidencialidad:** La información contable, tarifas de costo y datos sensibles de clientes se mantienen bajo estricto secreto profesional y uso exclusivo para el desarrollo del proyecto universitario.
3. **Privacidad y Protección de Datos:** Por motivos de seguridad, los operarios de taller y el personal de oficina son identificados en reportes externos por sus cargos funcionales, anonimizando las identidades de clientes minoristas en las bases de datos de prueba.

---

# Sección 2: Resumen Ejecutivo

### 2.1 Situación Actual
El proyecto se aplicará en la sede central y taller de producción de Impresos Trujillo E.I.R.L. (Jr. Simón Bolívar Nro. 945 Int. 1, Trujillo), abarcando transversalmente los procesos de recepción de clientes y emisión de contratos/proformas, reserva y control de inventario de materiales (vinilos, banners, tintas y pegamentos), seguimiento de órdenes en el pipeline de diseño y manufactura, y el cierre diario de caja. Actualmente, estos procesos se ejecutan de forma manual mediante talonarios impresos desarticulados y hojas de cálculo en Microsoft Excel 2021 que se sobrescriben semana a semana, lo que ocasiona la pérdida total del historial de pedidos, discrepancias del 35% en stock físico y fugas de cobranza al entregarse productos sin liquidar saldos.

### 2.2 Resultados Esperados
1. Reducir el tiempo promedio de atención, cotización y registro de pedidos de 18 minutos a menos de 3 minutos.
2. Disminuir en un 80% las mermas no controladas y roturas de inventario mediante la reserva obligatoria de stock y el cálculo paramétrico de pegamento (1 cuota estimada por cada 5 metros lineales de material procesado).
3. Eliminar al 100% las entregas físicas con saldos pendientes a través de un candado digital en el pipeline que exige pago total para autorizar la salida del taller.
4. Alcanzar un 95% de exactitud en los arqueos diarios de caja segregando operativamente los ingresos de Imprenta y Gigantografías y conciliando medios de pago (efectivo, Yape y transferencias).
5. Suministrar tableros analíticos de BI y un modelo predictivo de demanda con un 85% de precisión para anticipar requerimientos de reabastecimiento.

### 2.3 Recomendación
Se recomienda la implementación de una plataforma web integral basada en una arquitectura moderna de código abierto: Frontend SPA en **Angular 21**, Backend asíncrono en **FastAPI (Python 3.11)**, Base de Datos relacional transaccional en **PostgreSQL**, y módulos analíticos en **Scikit-learn / Prophet**, empaquetados bajo contenedores **Docker** y desplegados en servicios Cloud (**Google Cloud Run / Supabase**). Esta solución se ejecutará sobre el parque de 6 computadoras existentes en la empresa a costo cero de infraestructura, asegurando portabilidad, escalabilidad y compatibilidad nativa con Microsoft Excel 2021 para exportaciones gerenciales.

### 2.4 Justificación (Costo de la Inacción)
La justificación de este proyecto no radica meramente en la incorporación de tecnología, sino en **las severas consecuencias económicas y operativas que enfrentará la empresa si NO se automatiza**:
* **Pérdidas económicas directas:** Se estima una fuga acumulada superior a **S/ 42,000.00 anuales** producto de mermas descontroladas de insumos (bobinas de vinilo dañadas y pegamento desperdiciado por falta de estandarización técnica) y pedidos retirados con saldos impagos que se convierten en cuentas incobrables.
* **Vulnerabilidad y pérdida de activos de datos:** La práctica actual de sobrescribir archivos Excel 2021 ("registros chancados") destruye diariamente la memoria transaccional de la empresa, imposibilitando auditorías fiscales, proyecciones de flujo de caja o análisis de comportamiento del cliente.
* **Cuellos de botella y quiebres de servicio:** Aceptar trabajos de gran formato sin validar stock en tiempo real genera incumplimientos en fechas de entrega, penalidades comerciales y daño irreversible a la reputación comercial frente a la competencia de Trujillo.
* **Dependencia extrema de los propietarios:** Sin un sistema de reglas de negocio automatizado, el negocio no puede operar sin la presencia permanente de los dueños para fijar precios, autorizar entregas o cuadrar la caja diaria.

### 2.5 Suposiciones
1. La empresa facilitará acceso irrestricto a los talonarios físicos históricos ("talón de aire") y archivos de Excel 2021 para levantar la línea base del estudio pre-experimental.
2. La gerencia y jefaturas dispondrán de al menos 2 horas semanales para sesiones de validación de sprints, refinamiento y pruebas piloto.
3. El parque informático actual de 6 computadoras (Windows 10/11) y el enlace de fibra óptica de 200 Mbps se mantendrán operativos y conectados.
4. Las reglas operativas clave (adelanto obligatorio, entrega contra pago total y regla de 5 metros de pegamento) serán respaldadas y exigidas por la gerencia.

### 2.6 Limitaciones
1. Plazo improrrogable del curso: El software debe estar 100% implantado en la semana 11 para la toma de datos del Postest y emisión del informe de aceptación de la empresa.
2. El sistema no incluye desarrollo de app móvil nativa para Play Store / App Store (se diseña como aplicación web responsive accesible por navegador móvil y PC).
3. No se incluye facturación electrónica con conexión directa a SUNAT (se mantiene la emisión manual vía Clave SOL / Portal SUNAT).
4. El presupuesto neto de financiamiento en efectivo no superará los S/ 300.00 disponibles para el proyecto universitario.

---

# Sección 3: Gobierno y Equipo de Análisis del Business Case

### 3.1 Gobierno
Impresos Trujillo E.I.R.L. carece de un departamento formal de Tecnología de Información. La máxima instancia de supervisión y gobernabilidad recae en los socios propietarios. Las decisiones sobre prioridades de negocio las adopta la Gerencia General, mientras que las decisiones de diseño arquitectónico y estándares de desarrollo son lideradas por el Líder de Proyecto Capstone.

### 3.2 Equipo de Análisis del Business Case
| Rol | Nombre / Cargo | Procedencia |
| :--- | :--- | :--- |
| **Auspiciante Ejecutivo** | Angel Almilcar Rodríguez Evangelista (Dueño / Jefe de Taller) | Empresa |
| **Auspiciante Comercial/Financiero** | Marcell Magaly Vásquez Loje (Dueña / Jefa de Oficina) | Empresa |
| **Auspiciante Tecnológico** | Gerardo Erick Plasencia Torres (Líder de Proyecto / Arquitecto) | Universidad (Capstone) |
| **Asesor Académico** | Ing. Jose Alberto Gomez Avila (Docente del Curso) | Universidad Privada del Norte |
| **Analista de Negocio / Frontend Lead** | Jose Estibb Anhuaman Delgado (Desarrollador Frontend) | Universidad (Capstone) |
| **Analista de Negocio / Backend Lead** | Jose Diego Rodriguez Vasquez (Desarrollador Backend / IA) | Universidad (Capstone) |
| **Gerente Funcional Operativo** | Manuel (Subgerente Operativo) | Empresa |
| **Especialista Funcional Taller** | Marilú (Secretaria de Taller) | Empresa |
| **Especialista Funcional Diseño** | Ashlee (Diseñadora Gráfica) | Empresa |

*Nota metodológica: Siguiendo las directivas de clase, el docente actúa exclusivamente como Asesor Académico y evaluador, sin formar parte del gobierno operativo de la empresa cliente.*

---

# Sección 4: Definición del Problema

### 4.1 Enunciado del Problema
De acuerdo con la estructura científica de análisis (Variable Independiente, Variable Dependiente y Unidad de Análisis cuantitativa), el problema se formula de la siguiente manera:

> **¿De qué manera la implementación de un sistema web transaccional con módulos de inteligencia de negocios e inteligencia artificial optimiza los procesos operativos y financieros en la empresa Impresos Trujillo E.I.R.L. durante el año 2026?**

### 4.2 Metodología de Levantamiento de Información
| Técnica | Fuente / Participante | Fecha | Hallazgo Principal |
| :--- | :--- | :--- | :--- |
| **Entrevista semiestructurada** | Angel Rodríguez y Marcell Vásquez (Propietarios) | 15/08/2026 | Ausencia de trazabilidad en anticipos vs saldos; fuga de cobranzas en trabajos retirados de mostrador sin liquidar el monto total. |
| **Muestreo de trabajo y observación directa** | Manuel (Subgerente) y Marilú (Secretaria de Taller) | 18/08/2026 | Registro de contratos en talonarios volantes ("talón de aire"); tiempo promedio de cotización y búsqueda de proformas físicas de 18 minutos. |
| **Auditoría física de inventarios** | Aldair y Alexis (Operarios de Taller) | 20/08/2026 | 35% de inconsistencia entre stock real y registros manuales; desperdicio no contabilizado en cortes de vinilos y pegamento en gran formato. |
| **Arqueo y conciliación de caja** | Marcell Vásquez Loje (Jefa de Oficina) | 22/08/2026 | Mezcla indiferenciada de fondos de Imprenta y Gigantografías; cobros por Yape y transferencias sin validación estricta frente a contratos. |

### 4.3 Organización Cliente y Componentes de su Entorno

#### Grupos de Personas Interesadas (GPI / Stakeholders):
| GPI | Descripción |
| :--- | :--- |
| **Gerencia General / Propietarios** | Angel Rodríguez y Marcell Vásquez: Definen prioridades, validan requerimientos, aprueban hitos y evalúan el impacto financiero. |
| **Subgerencia Operativa** | Manuel: Coordina transversalmente las operaciones entre taller y oficina; supervisa el cumplimiento de órdenes en planta. |
| **Área de Diseño** | Ashlee: Responsable de la recepción de artes, edición digital y validación previa de medidas con clientes antes de producción. |
| **Secretaría de Taller** | Marilú: Recepciona clientes en mostrador, elabora proformas y registra pagos de adelantos y saldos. |
| **Personal Operativo de Taller** | Aldair, Alexis y Gabriel: Ejecutan la impresión en plotters, rotulación y armado de estructuras; reportan consumo de materiales. |
| **Equipo de Desarrollo Capstone** | Erick Plasencia, Estibb Anhuaman y Diego Rodriguez: Diseñan, desarrollan, prueban e implantan la plataforma tecnológica. |

#### Procesos o Servicios Modificados o Automatizados:
| Procesos/Servicios | Descripción de las Modificaciones / Automatizaciones |
| :--- | :--- |
| **Emisión y Gestión de Órdenes** | Sustitución del talonario manual por orden digital estructurada con campos de Contrato/Proforma, correlativo automático y cálculo de IGV. |
| **Control de Inventario y Mermas** | Automatización de la reserva de insumos al crear la orden y ajuste por mermas/devolución al finalizar; control de consumo de goma por 5m. |
| **Gestión de Cobranzas y Pagos** | Registro cronológico de eventos de pago (efectivo, Yape, transferencias) con candado lógico que prohíbe el marcado de "Entregada" con saldo pendiente. |
| **Cierre y Arqueo Diario de Caja** | Liquidación por usuario con separación obligatoria e independiente de ingresos para "Imprenta" y "Gigantografías" por método de pago. |
| **Inteligencia Analítica y Demanda** | Generación de tableros de BI de ingresos/productividad y modelos de IA predictivos para reabastecimiento de materiales críticos. |

### 4.4 Entorno Tecnológico Actual

#### 4.4.1 Software Actual
| Ítem de Software | Descripción y Versión Real |
| :--- | :--- |
| **Microsoft Excel 2021 LTSC** | Versión 2108 (Compilación 14332.20721) instalada en terminales de oficina para registro manual de ingresos y tablas de stock. |
| **Microsoft Word 2021 LTSC** | Versión 2108 para redacción no estandarizada de proformas corporativas y contratos especiales. |
| **Sistemas Operativos Windows** | Windows 10 Pro 22H2 (Builds 19045.5371 / 19045.5737 / 19045.3324) y Windows 11 Pro 25H2 (Build 26200.9168). |
| **Navegadores Web** | Google Chrome versión 128.0.6613.120 (64-bit) y Microsoft Edge versión 128.0.2735.67 (64-bit). |
| **Comprobantes Electrónicos** | Sistema Portal SUNAT (Factura Portal y Boleta Portal desde 2021/2022) operado manualmente mediante Clave SOL. |
| **Mensajería Operativa** | WhatsApp Desktop versión 2.2435.6.0 para recepción de comprobantes digitales de pago (capturas Yape) y archivos de diseño. |

#### 4.4.2 Hardware e Infraestructura Actual
| Estación / Recurso | Especificaciones Técnicas y Capacidades Reales |
| :--- | :--- |
| **PC 1 (Oficina Principal)** | Intel Core i5 12400F (6 núcleos / 12 hilos), 16 GB RAM DDR4, SSD 500 GB NVMe, Win 10 Pro 22H2 (Build 19045.5371). |
| **PC 2 (Diseño / Atención)** | Intel Core i5 10400T (6 núcleos / 12 hilos), 12 GB RAM DDR4, HDD/SSD 1 TB, Win 11 Pro 25H2 (Build 26200.9168). |
| **PC 3 (Taller / Impresión)** | Intel Core i7 6700 (4 núcleos / 8 hilos), 16 GB RAM DDR4, Almacenamiento 2 TB, Win 10 Pro 22H2 (Build 19045.5371). |
| **PC 4 (Diseño Gran Formato)** | AMD Ryzen 5 3400G (4 núcleos / 8 hilos), 32 GB RAM DDR4, Almacenamiento 3 TB, Win 11 Pro 25H2 (Build 26200.9168). |
| **PC 5 (Recepción de Taller)** | Intel Core i5 12400F (6 núcleos / 12 hilos), 16 GB RAM DDR4, SSD 500 GB NVMe, Win 10 Pro 22H2 (Build 19045.5737). |
| **PC 6 (Terminal Operativa Taller)** | Intel Core i5 10400F (6 núcleos / 12 hilos), 8 GB RAM DDR4, SSD 500 GB, Win 10 Pro 22H2 (Build 19045.3324). |
| **Infraestructura de Red** | Conexión de fibra óptica dedicada simétrica de 200 Mbps con enrutador Gigabit Ethernet y cobertura Wi-Fi local. |

---

# Sección 5: Visión del Proyecto

### 5.1 Descripción del Proyecto
| Identificador del Proyecto | Descripción del Proyecto |
| :--- | :--- |
| **Grupo 2 (Aula: 22643421416)** | Sistema web transaccional distribuido que integra la gestión de órdenes de trabajo (talonario de contrato/proforma), reserva y control de stock de insumos con cálculo de pegamento, registro de eventos de cobranza y cierre de caja dual (Imprenta vs Gigantografías). Incorpora un módulo de Inteligencia de Negocios (BI) para tableros gerenciales y reportes exportables a Excel 2021, así como un módulo de Inteligencia Artificial (IA) con modelos predictivos de demanda y detección de mermas anómalas. |

### 5.2 Metas y Objetivos
| Metas de Negocio | Descripción |
| :--- | :--- |
| **MN1: Optimizar el tiempo operativo** | Reducir el tiempo de atención al cliente y despacho de trabajos para elevar la capacidad operativa en mostrador. |
| **MN2: Proteger los márgenes de utilidad** | Reducir el gasto operativo generado por mermas y desperdicios no contabilizados en bobinas y consumibles de gran formato. |
| **MN3: Garantizar la cobranza efectiva** | Asegurar que el 100% de los trabajos retirados del local se encuentren íntegramente cancelados en caja. |
| **MN4: Claridad financiera por unidad** | Disponer de arqueos de caja diarios exactos y diferenciados entre las operaciones de Imprenta tradicional y Gigantografías. |
| **MN5: Abastecimiento estratégico de insumos** | Evitar quiebres de inventario y sobrecostos mediante compras planificadas basadas en proyecciones predictivas de demanda. |

| Objetivos del Proyecto | Descripción (Match directo con Metas de Negocio) |
| :--- | :--- |
| **OE1: Digitalización de Órdenes (MN1)** | Reducir el tiempo de procesamiento y consulta de órdenes de 18 a 3 minutos mediante el talonario digital centralizado. |
| **OE2: Control de Stock y Mermas (MN2)** | Disminuir en un 80% las discrepancias de stock y mermas mediante reserva automática y regla técnica de 5m de goma. |
| **OE3: Candado de Entrega y Cobranza (MN3)** | Eliminar al 100% las entregas con saldo pendiente validando el cobro completo en el pipeline operativo. |
| **OE4: Cierre de Caja Dual (MN4)** | Incrementar al 95% la exactitud del arqueo diario segregando cuentas de Imprenta y Gigantografías por canal de pago. |
| **OE5: Módulo Analítico y Predictivo (MN5)** | Desarrollar modelos de BI e IA con una precisión mínima del 85% para predecir la demanda y detectar consumos anómalos. |

### 5.3 Medidas de Desempeño (KPI)
| Proceso/Servicio Clave | KPI | Línea Base Actual | Meta Esperada |
| :--- | :--- | :--- | :--- |
| **Atención y Emisión de Órdenes** | Tiempo medio de registro y búsqueda de orden/proforma | 18.0 minutos (manual en papel) | < 3.0 minutos (sistema web) |
| **Control de Insumos y Almacén** | Porcentaje de discrepancia entre stock físico y registrado | 35.0% de error | < 5.0% de error |
| **Gestión Financiera de Cobranzas** | Tasa de órdenes entregadas con saldo pendiente de pago | 12.0% de los pedidos | 0.0% (cero entregas con deuda) |
| **Liquidación y Cuadre de Caja** | Exactitud en arqueo diario de caja dual (Imprenta / Gigantografía) | 60.0% de arqueos sin descuadre | >= 95.0% de arqueos exactos |
| **Gestión Predictiva de Demanda** | Precisión del modelo de predicción de insumos críticos (IA) | 0.0% (inexistente / empírico) | >= 85.0% de exactitud predictiva |

### 5.4 Suposiciones
Idénticas y consistentes con el Acta de Constitución (S1: Acceso a datos históricos; S2: Disponibilidad de 2 horas semanales del cliente; S3: Mantenimiento operativo de las 6 PCs y red de 200 Mbps; S4: Vigencia de políticas comerciales y regla de goma de 5m).

### 5.5 Restricciones
Idénticas y consistentes con el Acta de Constitución (R1: Plazo estricto de implantación en semana 11; R2: Arquitectura web sin clientes pesados; R3: Compatibilidad estricta con Microsoft Excel 2021 LTSC; R4: Techo presupuestario autofinanciado de S/ 300.00).

### 5.6 Entorno Tecnológico Propuesto

#### 5.6.1 Software Propuesto
| Ítem de Software | Descripción y Justificación Técnica |
| :--- | :--- |
| **Angular 21** | Framework frontend SPA tipado con componentes Standalone; diseño responsive para PC y smartphones. |
| **FastAPI (Python 3.11)** | Backend RESTful asíncrono de alto rendimiento con validación estricta de esquemas Pydantic y documentación OpenAPI. |
| **PostgreSQL 15 (Supabase)** | Motor de base de datos relacional con soporte transaccional ACID estricto para garantizar consistencia en reserva de stock. |
| **Scikit-learn / Prophet** | Librerías de Machine Learning para series temporales y predicción de demanda mensual de insumos críticos. |
| **Docker & Google Cloud Run** | Empaquetamiento en contenedores ligeros y despliegue serverless escalable con costo optimizado. |

#### 5.6.2 Hardware Propuesto
| Ítem de Hardware | Descripción y Costo Presupuestal |
| :--- | :--- |
| **6 Terminales de Trabajo (PCs 1 a 6)** | Reutilización íntegra de los equipos existentes de oficina y taller descritos en la Sección 4.4.2 (Costo S/ 0.00). |
| **Conectividad de Red 200 Mbps** | Reutilización de la conexión de fibra óptica contratada por la empresa cliente (Costo S/ 0.00). |

### 5.7 Hitos Principales del Proyecto
| Hito / Entregable Principal | Fecha Tentativa (Límite) |
| :--- | :--- |
| **H1: Aprobación de Acta de Constitución y Business Case** | 28/08/2026 |
| **H2: Especificación de Requerimientos de Software (SRS IEEE 830) validado** | 04/09/2026 |
| **H3: Versión Beta Operativa desplegada en taller (Funciones mínimas transaccionales)** | 23/10/2026 |
| **H4: Módulo de BI con Dashboards y reportes Excel 2021 operativos** | 30/10/2026 |
| **H5: Módulo de IA con modelo de predicción de demanda validado** | 06/11/2026 |
| **H6: Despliegue 100% en producción en taller/oficina y toma de Postest** | 20/11/2026 |
| **H7: Charla de Responsabilidad Social, Paper de investigación e Informe Final** | 11/12/2026 |

---

# Sección 6: Evaluación del Proyecto

### 6.1 Cumplimiento de Regulaciones
| Mandatos Relacionados con el Proyecto | Citación Regulatoria |
| :--- | :--- |
| **Protección de Datos Personales** | Ley N° 29733 y D.S. N° 003-2013-JUS: Tratamiento confidencial de datos de clientes (DNI/RUC, teléfono, domicilio) y medidas de seguridad digital. |
| **Comprobantes de Pago Tributarios** | Resolución de Superintendencia SUNAT N° 007-99/SUNAT: Identificación informativa y correlatividad de documentos de venta y proformas. |
| **Código de Protección al Consumidor** | Ley N° 29571: Claridad en el detalle de servicios cotizados, condiciones de entrega, desglose de IGV y plazos pactados en el contrato. |
| **Propiedad Intelectual y Software Libre** | D.L. N° 822: Uso estricto de librerías de código abierto bajo licencias MIT/Apache 2.0 respetando derechos de autor. |

### 6.2 Alineamiento Estratégico
| Plan Estratégico Funcional | Objetivos del Proyecto | Meta de Negocio | Relación con el Proyecto |
| :--- | :--- | :--- | :--- |
| **Línea de Eficiencia Operativa** | OE1: Digitalización y agilización de proformas | MN1: Reducir tiempos de atención a < 3 min | **DIRECTA** |
| **Línea de Control de Costos** | OE2: Reserva de inventario y regla de pegamento | MN2: Disminución del 80% en mermas | **DIRECTA** |
| **Línea de Seguridad Financiera** | OE3: Candado de entrega contra pago total | MN3: Cero pérdidas por saldos impagos | **DIRECTA** |
| **Línea de Transparencia Contable** | OE4: Cierre segregado Imprenta vs Gigantografía | MN4: 95% de exactitud en arqueo diario | **DIRECTA** |
| **Línea de Crecimiento Comercial** | OE5: Analítica predictiva de demanda de insumos | MN5: Abastecimiento óptimo continuo | **DIRECTA** |

### 6.3 Análisis de Impacto
El proyecto genera un impacto operacional altamente positivo sin requerir inversión en nuevo hardware. El soporte técnico y mantenimiento recaerá en el equipo Capstone durante el período académico. Se contempla un plan de inducción práctica de 4 sesiones de 45 minutos para el personal de taller y oficina, minimizando la curva de aprendizaje mediante interfaces gráficas adaptadas al flujo diario. El impacto en el consumo eléctrico de las terminales existentes es nulo al operar sobre la misma infraestructura activa.

### 6.4 y 6.5 Consideración de Riesgos
| Riesgo | Probabilidad / Impacto | Acciones de Mitigación |
| :--- | :---: | :--- |
| **R1: Retraso en la entrega de registros históricos** (talonarios físicos y hojas Excel) para la línea base y la IA. | 3 / 4 | Planificar jornadas presenciales de digitalización asistida por lotes con la secretaria de taller. |
| **R2: Resistencia al cambio del personal operativo** acostumbrado al cuaderno manual de taller. | 3 / 3 | Capacitación en el puesto de trabajo, interfaces con botones grandes y simplificadas para pantalla táctil. |
| **R3: Interrupciones de energía o caídas de internet** local en la zona céntrica de Trujillo. | 2 / 4 | Persistencia local temporal en navegador (IndexedDB) y base de datos alojada en la nube de alta disponibilidad. |
| **R4: Discrepancias imprevistas en los formatos de contratos físicos** o precios unitarios durante las pruebas. | 2 / 3 | Congelamiento de especificaciones mediante acta de diseño de contrato firmada con gerencia en Fase II. |
| **R5: Inconsistencias en las capturas de pantalla de pagos Yape** cargadas por los clientes. | 2 / 3 | Módulo de validación visual rápida con confirmación explícita de recepción en cuenta bancaria por la dueña. |

### 6.6 Análisis de Alternativas

#### Opción 1: No Hacer Nada (Status Quo)
| Alternativa | Factores Clave que Muestran la No Viabilidad |
| :--- | :--- |
| **Permanecer con talonarios físicos y Excel 2021** | • Continuidad de pérdidas económicas mayores a S/ 42,000 anuales por mermas y cuentas incobrables.<br>• Riesgo permanente de pérdida total de datos ante fallas de disco o sobrescritura involuntaria.<br>• Imposibilidad de segregar de manera confiable la rentabilidad entre Imprenta y Gigantografías.<br>• Saturación operativa de los dueños que limita cualquier plan de expansión hacia nuevos talleres. |

#### Opción 2: Adquisición de un ERP Comercial Enlatado / SaaS de Terceros
| Opción(es) Alternativa(s) | Factores Clave que Muestran la No Viabilidad |
| :--- | :--- |
| **Licenciamiento de software comercial (ej. SAP Business One, Odoo Enterprise)** | • Costos de implementación y licencias mensuales en dólares inasumibles para una microempresa familiar.<br>• Excesiva rigidez que no contempla las particularidades del rubro gráfico local (cálculo de goma por metro lineal, talón de aire, proforma/contrato dual).<br>• Alto costo de consultoría para adaptaciones y nula integración con modelos predictivos de demanda personalizados. |

---

# Sección 7: Selección del Proyecto

### 7.1 Metodología de Ponderación Multicriterio
Para determinar la alternativa óptima, se aplicó una matriz de decisión cuantitativa ponderando 5 criterios esenciales para el contexto de Impresos Trujillo E.I.R.L. La escala de calificación es de 1 (deficiente) a 5 (óptimo).

| Criterio de Selección | Peso (%) | Opción A: Desarrollo a Medida (Scrum MultiRol) | Opción B: ERP Comercial Enlatado | Opción C: No Hacer Nada (Excel 2021) |
| :--- | :---: | :---: | :---: | :---: |
| **Alineamiento al proceso gráfico (recetas y goma)** | 30% | 5 (1.50) | 2 (0.60) | 2 (0.60) |
| **Costo económico de adquisición y mantenimiento** | 25% | 5 (1.25) | 1 (0.25) | 4 (1.00) |
| **Facilidad de adopción y compatibilidad (6 PCs)** | 20% | 4 (0.80) | 2 (0.40) | 3 (0.60) |
| **Capacidades de BI y Predicción de Demanda (IA)** | 15% | 5 (0.75) | 2 (0.30) | 1 (0.15) |
| **Trazabilidad de cobranzas y control de mermas** | 10% | 5 (0.50) | 3 (0.30) | 1 (0.10) |
| **PUNTUACIÓN TOTAL PONDERADA** | **100%** | **4.80 / 5.00 (96%)** | **1.85 / 5.00 (37%)** | **2.45 / 5.00 (49%)** |

### 7.2 Resultados de la Selección
La **Opción A (Desarrollo a Medida con Metodología Ágil Scrum y Equipo MultiRol)** resultó seleccionada con una contundente calificación de **4.80 sobre 5.00**. Esta alternativa satisface con exactitud los requerimientos particulares de la empresa (control de consumo de goma por 5m, talonario digital adaptado al contrato/proforma real, cierre segregado de caja para Imprenta y Gigantografías), garantiza costo cero en hardware aprovechando las 6 PCs registradas, y añade valor estratégico mediante módulos de analítica y predicción que ningún paquete enlatado ofrece a microempresas.

---

# Sección 8: Cronograma del Proyecto

| Fase / Sprint | Entregables Principales | Fechas de Inicio y Fin |
| :--- | :--- | :--- |
| **Fase I: Inicio y Planificación Estratégica** | Acta de Constitución y Business Case aprobados | 22/08/2026 - 28/08/2026 |
| **Fase II: Análisis y Requerimientos** | SRS bajo estándar IEEE 830 y Matriz de Trazabilidad | 29/08/2026 - 04/09/2026 |
| **Fase III.1: Transaccional (Sprint 1)** | Módulo de Clientes, Catálogo de Productos y Recetas | 05/09/2026 - 18/09/2026 |
| **Fase III.2: Transaccional (Sprint 2)** | Talonario digital de Órdenes, Proformas y Reserva de Stock | 19/09/2026 - 02/10/2026 |
| **Fase III.3: Transaccional (Sprint 3)** | Módulo de Pagos, Candado de Entrega y Cierre de Caja Dual | 03/10/2026 - 23/10/2026 |
| **Fase IV: Inteligencia de Negocios (Sprint 4)** | Dashboards ejecutivos y Reportes exportables a Excel 2021 | 24/10/2026 - 30/10/2026 |
| **Fase V: Inteligencia Artificial (Sprint 5)** | Modelo de predicción de demanda de insumos y alertas | 31/10/2026 - 06/11/2026 |
| **Fase VI: Implantación y Pretest/Postest** | Despliegue 100% en planta, Postest y Conformidad del Cliente | 07/11/2026 - 20/11/2026 |
| **Fase VII: Cierre y Transferencia** | Charla de Responsabilidad Social, Paper e Informe Final | 21/11/2026 - 11/12/2026 |

---

# Sección 9: Glosario

| Término / Acrónimo | Definición |
| :--- | :--- |
| **Contrato / Proforma** | Formato de documento comercial físico y digital utilizado por Impresos Trujillo para fijar el pedido, fecha pactada, monto de adelanto, saldo y compromiso de entrega. |
| **Talón de Aire** | Talonario físico manual y volante en el que se anotan transitoriamente pedidos rápidos en mostrador antes de ser transcritos o procesados. |
| **Regla de Goma (5m)** | Parámetro técnico de producción que estima el consumo de 1 porción estandarizada de pegamento adhesivo por cada 5 metros lineales de material procesado. |
| **Pipeline Operativo** | Flujo secuencial de estados de una orden: Pendiente -> En Diseño -> Aprobado -> En Producción -> Finalizada -> Entregada (o Cancelada). |
| **Candado de Entrega** | Regla de negocio automatizada que impide marcar una orden como 'Entregada' si existe un saldo pendiente de liquidar (saldo > S/ 0.00). |
| **Cierre de Caja Dual** | Procedimiento de arqueo contable que liquida por separado y de manera obligatoria los ingresos generados por 'Imprenta' y 'Gigantografías'. |
| **MultiRol (Scrum)** | Esquema organizativo donde los integrantes del equipo asumen funciones técnicas complementarias (QA, DevOps, Arquitectura, UI/UX, DBA). |

---

# Sección 10: Control de Cambios

| Versión | Fecha | Nombre del Responsable | Descripción de la Modificación |
| :--- | :--- | :--- | :--- |
| **1.0** | 28/08/2026 | Equipo Capstone — Grupo 2 | Elaboración inicial del Business Case alineado al nuevo contexto de negocio y plantilla oficial. |

---

# Sección 11: Anexos

1. **Anexo 1:** Minuta y registro fotográfico de las visitas técnicas de relevamiento en las instalaciones de Jr. Simón Bolívar Nro. 945 Int. 1.
2. **Anexo 2:** Muestra escaneada del formato real de Contrato / Proforma y muestras del "talón de aire" físico.
3. **Anexo 3:** Inventario técnico y fichas de auditoría de hardware de las 6 computadoras operativas de oficina y taller.
4. **Anexo 4:** Matriz completa de Consistencia Metodológica Pre-experimental del proyecto Capstone.
