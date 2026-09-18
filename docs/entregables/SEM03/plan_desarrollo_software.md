PLAN DE DESARROLLO DEL PROYECTO
SOFTWARE

[TABLE]
| ELABORÓ | REVISÓ | AUTORIZÓ |
| Gerardo Erick Plasencia Torres
Líder de Proyecto / Desarrollador Full Stack

Jose Estibb Anhuaman Delgado
Desarrollador Frontend Lead / Diseñador UI/UX

Jose Diego Rodriguez Vasquez
Desarrollador Backend Lead / Especialista en IA | Gerardo Erick Plasencia Torres
Líder de Proyecto / Scrum Master | Marcell Magaly Vásquez Loje
Gerente de Administración / Product Owner |
[/TABLE]

Proyecto: Implementación de un sistema web transaccional con módulos de inteligencia de negocios e inteligencia artificial para la optimización de los procesos operativos en la empresa Impresos Trujillo E.I.R.L.
Versión: 0.1
Historial de Revisiones

[TABLE]
| VERSIÓN | FECHA | AUTOR | DESCRIPCIÓN |
| 0.1 | 11/09/2026 | Equipo Capstone - Grupo 2 | Versión inicial formal del Plan de Desarrollo del Proyecto de Software. |
[/TABLE]

Tabla de Contenido
1.   Introducción
1.1 Alcance
1.2 Documentos relacionados
1.3 Definiciones, Acrónimos y Abreviaturas
1.4 Descripción
2     Entorno y fundamentos
2.1 Antecedentes
2.2 Identificación del Problema
El Proyecto
2.3 Objetivo
2.4 Alcance
2.5 Justificación
2.6 Características y Beneficios del Sistema
2.7 Suposiciones y Limitaciones
2.8 Evolución del Plan del proyecto
3     Resumen de la Metodología
3.1 Organización de los equipos del proyecto
3.1.1 Recursos humanos
3.1.2 Organización de los equipos de trabajo
3.2 Herramientas de desarrollo y colaboración
3.3 Control de cambios
3.4 De la actualización del Plan de Proyecto
5.   Estructura del trabajo y estimados
6.   Entregables del proyecto
7.   Calendario del proyecto
8.   Manejo de riesgos
9.   Planeación de dependencias del proyecto
Planificación del Proyecto
1  Introducción
1.1 Alcance
Este documento define la planificación, organización, plan de trabajo y gestión del proyecto de desarrollo de software para Impresos Trujillo E.I.R.L. Aplica al equipo Capstone del Grupo 2 de la Universidad Privada del Norte y a la empresa beneficiaria, rigiendo la ejecución del proyecto entre el 22/08/2026 y el 11/12/2026 (16 semanas del ciclo 2026-II).
Los proyectos asociados a este plan comprenden el desarrollo del sistema web transaccional, los módulos de inteligencia de negocios e inteligencia artificial, la capacitación del personal y las prácticas de campo e informe experimental pretest/postest en planta.
1.2 Documentos relacionados
Los documentos relacionados que sirven de entrada y referencia para este plan son los siguientes:

[TABLE]
| Título | Fecha | Organización | Identificador del documento |
| Acta de Constitución del Proyecto | 28/08/2026 | Equipo Capstone - Grupo 2 UPN | AC-G2-2026 |
| Business Case (Caso de Negocio) | 04/09/2026 | Equipo Capstone - Grupo 2 UPN | BC-G2-2026 |
| Especificación de Requerimientos de Software SRS IEEE 830 | 11/09/2026 | Equipo Capstone - Grupo 2 UPN | SRS-G2-2026 |
| Estructura de Desglose del Trabajo EDT | 11/09/2026 | Equipo Capstone - Grupo 2 UPN | EDT-G2-2026 |
| Cronograma y Presupuesto Valorizado | 11/09/2026 | Equipo Capstone - Grupo 2 UPN | CRON-G2-2026 |
| Estructura de Análisis y Matriz de Consistencia | 11/09/2026 | Equipo Capstone - Grupo 2 UPN | EA-G2-2026 |
| Matriz de Riesgos | 11/09/2026 | Equipo Capstone - Grupo 2 UPN | MR-G2-2026 |
| Matriz de Comunicaciones y Matriz de Responsabilidades | 11/09/2026 | Equipo Capstone - Grupo 2 UPN | MRC-G2-2026 |
[/TABLE]

1.3 Definiciones, Acrónimos y Abreviaturas
API: Interfaz de programación de aplicaciones que expone los servicios del backend.
BI: Inteligencia de Negocios (Business Intelligence); módulo de tableros y reportes gerenciales.
EDT / WBS: Estructura de Desglose del Trabajo; descomposición jerárquica de entregables.
IA: Inteligencia Artificial; modelo predictivo de demanda mensual y detección de anomalías.
IEEE 830: Estándar para la especificación formal de requerimientos de software.
JWT: Token web firmado empleado para autenticación stateless y control de sesiones seguras.
KPI: Indicador clave de desempeño para medición operativa y financiera.
PO: Product Owner; representante de la empresa responsable de maximizar el valor del software.
RACI: Matriz de asignación de responsabilidades: Responsable, Aprueba, Consultado e Informado.
RBAC: Control de acceso basado en roles para administración de permisos y perfiles.
RF / RNF: Requerimiento funcional / requerimiento no funcional.
Scrum: Marco de trabajo ágil iterativo e incremental con sprints quincenales.
SLA: Acuerdo de nivel de servicio garantizado por los proveedores de nube.
SPA: Aplicación web de página única desarrollada en Angular 21.
SRS: Especificación de Requerimientos de Software (Software Requirements Specification).
1.4 Descripción
El documento se organiza en cuatro partes principales: la introducción y fundamentos (secciones 1 y 2), la definición del proyecto (El Proyecto), el resumen de la metodología (sección 3) y la estructura de trabajo y gestión operativa (secciones 5 a 9).
2     Entorno y fundamentos
2.1 Antecedentes
En respuesta a la interrogante sobre los antecedentes e historia operativa detrás del presente proyecto, la iniciativa surge a partir del diagnóstico cuantitativo y levantamiento de la línea base operativa y financiera en Impresos Trujillo E.I.R.L. (medición realizada del 15 al 22/08/2026), donde se identificó que la gestión manual de órdenes, inventario y caja genera deficiencias críticas directamente vinculadas a los Objetivos Específicos del proyecto:
Línea Base del Proceso Operativo Actual vs. Objetivos del Proyecto:
Tiempo de atención (OE1): El registro y cotización manual mediante talonarios físicos de papel autocopiativo («talón de aire») demanda un promedio de 18.0 minutos por orden. El objetivo es reducirlo a 5.0 minutos.
Control de insumos y mermas (OE2): Existe un 35% de discrepancia entre el stock físico y lo registrado, con pérdidas por mermas descontroladas de bobinas de vinilo, lona y pegamentos estimadas en S/ 2,000.00 mensuales (S/ 24,000.00/año) por falta de reserva previa y recetas técnicas de corte. La meta es reducir las discrepancias y mermas en un 40%.
Pérdidas financieras por saldos pendientes (OE3): La entrega física de trabajos terminados sin verificar la liquidación de saldos acumula más de S/ 24,000.00 anuales en cuentas incobrables. La meta es eliminar estas pérdidas al 100% mediante un candado digital de cobro.
Arqueo de caja (OE4): La mezcla indiscriminada de ingresos entre Imprenta y Gigantografías bajo múltiples canales (efectivo, Yape y transferencias) exige más de 2 horas diarias de cuadre manual con alta tasa de error. La meta es alcanzar un 90% de exactitud en la liquidación diaria mediante segregación de cuentas.
Planificación de demanda (OE5): La sobrescritura semanal de archivos Excel 2021 LTSC destruye el 100% de la serie histórica transaccional, impidiendo anticipar compras de insumos. La meta es lograr una precisión predictiva mínima del 70% con modelos de inteligencia artificial.
Antecedentes Empíricos de Ingeniería de Software:
Para OE1 (Tiempo Operativo): Rey Ascoy (2023, Trujillo) demostró mediante diseño experimental en una imprenta local que la automatización web del flujo de órdenes reduce el tiempo medio de atención de 11.02 minutos a 1.15 minutos (reducción del 89.58%).
Para OE2 (Inventario y Mermas): Huayan Urbina (2021, UPN Trujillo) comprobó en el sector gráfico local que la estandarización técnica de consumo de materiales disminuye el porcentaje de mermas del 7.82% al 2.15% y reduce los costos operativos en un 14.7%.
Para OE3 (Cobranza) y OE4 (Arqueo): Investigaciones en sistemas transaccionales para imprentas (Alvear & Guallichico, 2019; Chávez, 2024) concluyen que la trazabilidad integral de órdenes y el bloqueo de estados erradica la entrega de productos sin cancelación y centraliza el 100% de las liquidaciones de caja.
2.2 Identificación del Problema
La identificación del problema se formula de acuerdo con la estructura de análisis y matriz de consistencia del proyecto, relacionando la variable independiente, la variable dependiente y la unidad de análisis cuantitativa de la empresa:
¿De qué manera la implementación de un sistema web transaccional con módulos de inteligencia de negocios e inteligencia artificial optimiza los procesos operativos y financieros en la empresa Impresos Trujillo E.I.R.L. durante el año 2026?
Las causas raíz identificadas son la falta de trazabilidad de anticipos y saldos, la volatilidad de los registros en Excel, la ausencia de reglas técnicas de consumo de insumos (vinilos, lonas, pegamentos) y la mezcla indiscriminada de ingresos entre Imprenta y Gigantografías.
El Proyecto
El proyecto tiene como propósito implementar un sistema web transaccional con módulos de BI e IA que optimice los procesos operativos y financieros de la empresa, dentro del alcance, los objetivos y las restricciones validadas por la Gerencia General.
2.3            Objetivo
Implementar un sistema web transaccional con módulos de inteligencia de negocios e inteligencia artificial para la optimización de los procesos operativos y financieros en la empresa Impresos Trujillo E.I.R.L.
2.4            Alcance
El alcance del proyecto comprende los siguientes módulos y productos de ingeniería, y excluye expresamente los siguientes aspectos:

[TABLE]
| En el Alcance | Fuera del Alcance |
| Módulo transaccional: catálogo, recetas de insumos, órdenes digitalizadas en formato de contrato/proforma con N° correlativo, reserva automática de stock, cobros multicanal y candado digital de entrega. | Integración y facturación electrónica directa con SUNAT (la emisión formal se mantiene vía Clave SOL / Portal SUNAT). |
| Cierre de caja dual segregado para Imprenta y Gigantografías, con desglose de pagos en efectivo, Yape y transferencias. | Desarrollo de aplicaciones móviles nativas para sistemas Android o iOS (se diseña como aplicación web responsive). |
| Módulo de BI con tableros ejecutivos interactivos y reportes tabulares compatibles con Microsoft Excel 2021 LTSC. | Pasarela de pagos bancaria automatizada con cobro en línea (la conciliación se realiza por verificación asistida de capturas). |
| Módulo de IA con modelo predictivo de demanda de insumos (precisión mínima del 70%) y detección de anomalías en mermas. | Módulos de gestión de recursos humanos, control biométrico de asistencia y cálculo de planillas salariales (SUNAFIL). |
| Documentación de ingeniería, manuales de usuario y despliegue, capacitación in situ y evaluación experimental pretest/postest. | Gestión de compras y emisión de órdenes de pago a proveedores externos de insumos fuera del registro de costos. |
[/TABLE]

2.5            Justificación
La justificación del proyecto radica en las consecuencias operativas y económicas de la inacción: se estima una fuga acumulada superior a S/ 24,000.00 anuales (S/ 2,000.00 mensuales) debido a mermas descontroladas de insumos y a pedidos retirados con saldos impagos que devienen en cuentas incobrables por falta de validación en mostrador.
La sobrescritura semanal de archivos Excel destruye el histórico transaccional, imposibilitando auditorías, conciliaciones de caja y análisis de demanda; asimismo, aceptar trabajos sin reserva de stock en tiempo real genera retrasos de entrega y dependencia permanente de los propietarios para autorizar retiros y cuadrar la caja manualmente al cierre del día.
2.6            Características y Beneficios del Sistema
2.6.1   Características del Sistema
•  Arquitectura web cliente ligero (Single Page Application) en Angular 21, ejecutable directamente desde navegadores modernos (Google Chrome, Microsoft Edge) en las 6 estaciones de trabajo de oficina y taller, sin requerir instalación de software cliente local.
•  Digitalización integral del talonario comercial en formato formal de contrato, proforma y orden de trabajo, incorporando correlativo numérico automático, datos del cliente, especificaciones técnicas, anticipos, saldos y fecha de entrega pactada.
•  Parametrización del catálogo de productos y servicios con recetas técnicas de consumo de materiales por metro cuadrado para vinilos, lonas y tintas.
•  Reserva automática de existencias en bodega al registrar cada orden, con registro y ajuste de mermas al finalizar la manufactura.
•  Candado digital de seguridad operativa que bloquea la entrega física del producto terminado si la orden mantiene saldo pendiente de cobro.
•  Registro cronológico de cobros multicanal con soporte para pagos en efectivo, billeteras digitales (Yape) y transferencias bancarias, con verificación asistida de capturas.
•  Arqueo y liquidación diaria de caja con segregación obligatoria para las unidades de negocio de Imprenta y Gigantografías.
2.6.2   Beneficios del Proyecto
•  Reducción cuantitativa del tiempo medio de atención, cotización y registro de órdenes de 18.0 a 5.0 minutos por orden (mejora operativa superior al 72%).
•  Disminución del 40% en discrepancias de existencias físicas y reducción de mermas de vinilos, lonas y pegamentos, mitigando pérdidas estimadas en S/ 2,000.00 mensuales (S/ 24,000.00 anuales).
•  Erradicación al 100% de pérdidas financieras por entrega de pedidos con saldos pendientes, asegurando la cancelación completa previa al retiro de taller.
•  Capacidad predictiva de demanda con precisión mínima del 70% mediante modelos de analítica avanzada para soporte al reabastecimiento mensual.
•  Preservación íntegra de la serie histórica transaccional, eliminando la destrucción de información provocada por la sobrescritura semanal de hojas de cálculo.
•  Optimización del tiempo de cuadre de caja diario, reduciendo la conciliación manual de más de 2 horas a menos de 10 minutos con una exactitud mínima del 90%.
2.7            Suposiciones y Limitaciones
Suposición 1: La empresa garantizará el acceso continuo a los registros históricos de órdenes de trabajo, talonarios de contratos/proformas y archivos Excel para el levantamiento de la línea base.
Suposición 2: La gerencia y el personal clave dispondrán de un mínimo de 2 horas semanales para reuniones de coordinación, validación de avances y pruebas operativas.
Suposición 3: Las 6 computadoras registradas en oficina y taller (sistemas Windows 10 y Windows 11) y el enlace de internet de 200 Mbps se mantendrán operativos y disponibles.
Suposición 4: Las reglas de consumo de insumos serán definidas y validadas con la empresa durante el proyecto y permanecerán estables durante el período experimental.
Limitación 1 (Plazo estricto de entrega): El sistema debe encontrarse 100% operativo e implantado en la empresa en la semana 11 del ciclo académico para la ejecución del postest y emisión del informe empresarial.
Limitación 2 (Arquitectura de cliente ligero): El sistema debe operar exclusivamente en entorno web mediante navegadores modernos (Google Chrome y Microsoft Edge), sin requerir instalación de clientes pesados en las estaciones de trabajo.
Limitación 3 (Compatibilidad ofimática): Todo reporte o exportación de datos debe ser nativamente compatible con Microsoft Excel 2021 LTSC.
Limitación 4 (Límite presupuestario universitario): Los gastos en efectivo de tecnología, dominio y papelería no podrán exceder la cuota autofinanciada de S/ 300.00 asignada al proyecto.
2.8            Evolución del Plan del proyecto
Este plan será revisado y actualizado al cierre de cada sprint quincenal y en cada hito formal del proyecto. Toda modificación se registrará en el historial de revisiones con indicación de versión, fecha y autor, y los cambios de alcance se gestionarán mediante el protocolo de control de cambios aprobado por la Product Owner. La versión vigente del documento se mantendrá versionada en GitHub.
CRONOGRAMA

[TABLE]
| Nombre del Proyecto |
| Implementación de un sistema web transaccional con módulos de inteligencia de negocios e inteligencia artificial para la optimización de los procesos operativos en la empresa Impresos Trujillo E.I.R.L. |
| Estructura de la EDT | Duración | Predecesora | Costo estimado |
| 1 | Gestión del Proyecto |  |  |  |
| 1.1 | Acta de Constitución del Proyecto |  |  |  |
| 1.1.1 | Elaborar el Acta de Constitución | 4 días | - | 100 |
| 1.1.1.1 | Acta de Constitución |  |  |  |
| 1.1.2 | Validar el Acta con Gerencia | 3 días | 1.1.1 | 100 |
| 1.1.2.1 | Acta de Constitución validada |  |  |  |
| 1.2 | Business Case |  |  |  |
| 1.2.1 | Formular el Business Case | 4 días | 1.1.2 | 100 |
| 1.2.1.1 | Business Case validado |  |  |  |
| 1.2.2 | Evaluar la viabilidad económica | 3 días | 1.2.1 | 100 |
| 1.2.2.1 | Informe de Viabilidad Económica |  |  |  |
| 1.3 | Planificación del Proyecto |  |  |  |
| 1.3.1 | Elaborar la EDT | 2 días | 1.2.2 | 60 |
| 1.3.1.1 | EDT del Proyecto |  |  |  |
| 1.3.2 | Construir el cronograma | 2 días | 1.3.1 | 60 |
| 1.3.2.1 | Cronograma del Proyecto |  |  |  |
| 1.3.3 | Definir el presupuesto | 2 días | 1.3.2 | 60 |
| 1.3.3.1 | Presupuesto del Proyecto |  |  |  |
| 1.3.4 | Definir el plan de recursos | 1 día | 1.3.3 | 40 |
| 1.3.4.1 | Plan de Recursos |  |  |  |
| 1.4 | Plan de Desarrollo del Proyecto de Software |  |  |  |
| 1.4.1 | Planificar la gestión del proyecto | 2 días | 1.3.4 | 60 |
| 1.4.1.1 | Plan de Gestión del Proyecto |  |  |  |
| 1.4.2 | Gestionar los riesgos | 2 días | 1.4.1 | 60 |
| 1.4.2.1 | Matriz de Riesgos |  |  |  |
| 1.4.3 | Planificar las comunicaciones | 2 días | 1.4.2 | 60 |
| 1.4.3.1 | Matriz de Comunicaciones |  |  |  |
| 1.4.4 | Asignar responsabilidades | 2 días | 1.4.3 | 60 |
| 1.4.4.1 | Matriz de Responsabilidades |  |  |  |
| 1.4.5 | Definir el plan de calidad | 2 días | 1.4.4 | 60 |
| 1.4.5.1 | Plan de Calidad |  |  |  |
| 1.4.6 | Definir el plan de seguridad | 2 días | 1.4.5 | 60 |
| 1.4.6.1 | Plan de Seguridad Integral |  |  |  |
| 1.4.7 | Planificar el involucramiento de interesados | 2 días | 1.4.6 | 60 |
| 1.4.7.1 | Plan de Involucramiento de Interesados |  |  |  |
| 2 | Análisis de Requerimientos |  |  |  |
| 2.1 | Requerimientos de Software |  |  |  |
| 2.1.1 | Especificar los requerimientos | 7 días | 1.1.2 | 190 |
| 2.1.1.1 | Documento SRS IEEE 830 |  |  |  |
| 2.2 | Estructura de Análisis |  |  |  |
| 2.2.1 | Elaborar la estructura de análisis | 7 días | 2.1.1 | 100 |
| 2.2.1.1 | Documento de Estructura de Análisis |  |  |  |
| 2.3 | Matriz de Consistencia |  |  |  |
| 2.3.1 | Elaborar la matriz de consistencia | 7 días | 2.1.1 | 100 |
| 2.3.1.1 | Matriz de Consistencia |  |  |  |
| 3 | Diseño de la Solución |  |  |  |
| 3.1 | Arquitectura del Sistema |  |  |  |
| 3.1.1 | Diseñar la arquitectura | 7 días | 2.1.1 | 150 |
| 3.1.1.1 | Documento de Arquitectura |  |  |  |
| 3.2 | Modelado de Arquitectura Ágil, Historias de Usuario |  |  |  |
| 3.2.1 | Elaborar el modelado ágil, historias de usuario | 7 días | 3.1.1 | 100 |
| 3.2.1.1 | Modelado ágil, historias de usuario |  |  |  |
| 3.3 | Base de Datos |  |  |  |
| 3.3.1 | Diseñar la base de datos | 7 días | 3.1.1 | 125 |
| 3.3.1.1 | Modelo Entidad-Relación |  |  |  |
| 3.4 | Interfaces de Usuario |  |  |  |
| 3.4.1 | Diseñar las interfaces | 7 días | 3.1.1 | 125 |
| 3.4.1.1 | Prototipos de Interfaces |  |  |  |
| 3.5 | Trazabilidad |  |  |  |
| 3.5.1 | Elaborar la trazabilidad | 7 días | 3.3.1 | 110 |
| 3.5.1.1 | Matriz de Trazabilidad |  |  |  |
| 4 | Construcción del Producto |  |  |  |
| 4.1 | Módulo Transaccional Base - Catálogo, Talonario Virtual, Clientes |  |  |  |
| 4.1.1 | Construir el incremento funcional | 14 días | 3.3.1 | 250 |
| 4.1.1.1 | Módulo Transaccional Base desplegado |  |  |  |
| 4.1.2 | Priorizar el Product Backlog | 3 días | 3.4.1 | 60 |
| 4.1.2.1 | Backlog Priorizado |  |  |  |
| 4.1.3 | Definir el Definition of Done | 2 días | 4.1.2 | 50 |
| 4.1.3.1 | Definition of Done |  |  |  |
| 4.2 | Módulo de Cobros, Caja, Business Intelligence |  |  |  |
| 4.2.1 | Construir el incremento funcional | 21 días | 4.1.1 | 300 |
| 4.2.1.1 | Módulo de Cobros, Caja, BI desplegado |  |  |  |
| 4.2.2 | Registrar los cambios | 5 días | 4.1.1 | 40 |
| 4.2.2.1 | Registro de Cambios |  |  |  |
| 4.2.3 | Registrar los incidentes | 5 días | 4.2.2 | 40 |
| 4.2.3.1 | Registro de Incidentes |  |  |  |
| 4.3 | Módulo Predictivo de Demanda, Candado Digital de Entrega |  |  |  |
| 4.3.1 | Verificar el avance funcional | 4 días | 4.2.1 | 60 |
| 4.3.1.1 | Módulo Predictivo de Demanda validado |  |  |  |
| 4.3.2 | Consolidar el producto | 3 días | 4.3.1 | 60 |
| 4.3.2.1 | Sistema Web Integral al 100% |  |  |  |
| 5 | Aseguramiento de Calidad |  |  |  |
| 5.1 | Pruebas |  |  |  |
| 5.1.1 | Ejecutar las pruebas unitarias | 4 días | 4.2.1 | 90 |
| 5.1.1.1 | Reporte de Pruebas Unitarias |  |  |  |
| 5.1.2 | Ejecutar las pruebas de integración | 3 días | 5.1.1 | 90 |
| 5.1.2.1 | Reporte de Pruebas de Integración |  |  |  |
| 5.1.3 | Ejecutar las pruebas de sistema | 3 días | 5.1.2 | 60 |
| 5.1.3.1 | Reporte de Pruebas de Sistema |  |  |  |
| 5.1.4 | Ejecutar las pruebas de aceptación | 3 días | 5.1.3 | 50 |
| 5.1.4.1 | Reporte de Pruebas de Aceptación |  |  |  |
| 5.1.5 | Verificar la cobertura de requisitos | 2 días | 5.1.4 | 50 |
| 5.1.5.1 | Matriz de Cobertura de Requisitos |  |  |  |
| 5.1.6 | Registrar los defectos | 2 días | 5.1.4 | 50 |
| 5.1.6.1 | Registro de Defectos |  |  |  |
| 5.2 | SQA |  |  |  |
| 5.2.1 | Ejecutar la revisión SQA | 3 días | 5.1.2 | 60 |
| 5.2.1.1 | Informe de Revisión SQA |  |  |  |
| 5.2.2 | Controlar las versiones | 3 días | 5.2.1 | 60 |
| 5.2.2.1 | Registro de Control de Versiones |  |  |  |
| 5.3 | Evaluación de Aceptación Operativa en Planta |  |  |  |
| 5.3.1 | Ejecutar la evaluación operativa en planta | 3 días | 5.1.4 | 60 |
| 5.3.1.1 | Reporte de Aceptación Operativa |  |  |  |
| 6 | Despliegue del Producto |  |  |  |
| 6.1 | Despliegue |  |  |  |
| 6.1.1 | Desplegar en producción | 4 días | 5.1.2 | 280 |
| 6.1.1.1 | Software Desplegado |  |  |  |
| 6.1.2 | Entregar el software en planta | 3 días | 6.1.1 | 100 |
| 6.1.2.1 | Acta de Entrega |  |  |  |
| 6.2 | Capacitación |  |  |  |
| 6.2.1 | Elaborar el manual de usuario | 3 días | 6.1.1 | 180 |
| 6.2.1.1 | Manual de Usuario |  |  |  |
| 6.2.2 | Elaborar la guía de despliegue | 2 días | 6.2.1 | 50 |
| 6.2.2.1 | Guía de Despliegue |  |  |  |
| 6.2.3 | Capacitar al personal | 3 días | 6.2.2 | 90 |
| 6.2.3.1 | Registro de Capacitación |  |  |  |
| 7 | Prácticas de Campo |  |  |  |
| 7.1 | Práctica de Campo I |  |  |  |
| 7.1.1 | Recolectar los datos iniciales | 7 días | 2.1.1 | 60 |
| 7.1.1.1 | Portafolio de Primera Entrega |  |  |  |
| 7.1.2 | Redactar el Capítulo I | 5 días | 7.1.1 | 60 |
| 7.1.2.1 | Capítulo I del Informe |  |  |  |
| 7.1.3 | Redactar el Capítulo II | 5 días | 7.1.2 | 60 |
| 7.1.3.1 | Capítulo II del Informe |  |  |  |
| 7.2 | Práctica de Campo II |  |  |  |
| 7.2.1 | Redactar el Capítulo V | 7 días | 7.1.3 | 60 |
| 7.2.1.1 | Capítulo V del Informe |  |  |  |
| 7.2.2 | Redactar el Capítulo VII | 7 días | 7.2.1 | 60 |
| 7.2.2.1 | Capítulo VII del Informe |  |  |  |
| 7.2.3 | Consolidar el informe de campo | 4 días | 7.2.2 | 60 |
| 7.2.3.1 | Informe de Práctica de Campo |  |  |  |
| 7.3 | Responsabilidad Social |  |  |  |
| 7.3.1 | Ejecutar la actividad de responsabilidad social | 3 días | 6.1.2 | 60 |
| 7.3.1.1 | Informe de Responsabilidad Social |  |  |  |
| 7.4 | Medición Pretest |  |  |  |
| 7.4.1 | Medir la línea base | 14 días | 2.1.1 | 60 |
| 7.4.1.1 | Informe de Línea Base |  |  |  |
| 7.5 | Medición Postest |  |  |  |
| 7.5.1 | Recolectar la muestra postest | 28 días | 6.1.2 | 80 |
| 7.5.1.1 | Dataset Postest |  |  |  |
| 7.6 | Informe Empresarial |  |  |  |
| 7.6.1 | Elaborar el informe de resultados | 7 días | 7.5.1 | 60 |
| 7.6.1.1 | Informe de Resultados de la Empresa |  |  |  |
| 8 | Cierre del Proyecto |  |  |  |
| 8.1 | Inferencia Estadística |  |  |  |
| 8.1.1 | Contrastar las hipótesis | 7 días | 7.6.1 | 70 |
| 8.1.1.1 | Informe Estadístico |  |  |  |
| 8.2 | Paper Científico |  |  |  |
| 8.2.1 | Redactar el artículo científico | 7 días | 8.1.1 | 60 |
| 8.2.1.1 | Artículo IEEE |  |  |  |
| 8.3 | Memoria Técnica |  |  |  |
| 8.3.1 | Consolidar la memoria técnica | 5 días | 8.1.1 | 60 |
| 8.3.1.1 | Memoria Técnica |  |  |  |
| 8.4 | Portafolio Final |  |  |  |
| 8.4.1 | Consolidar el portafolio final | 5 días | 8.1.1 | 60 |
| 8.4.1.1 | Portafolio Final |  |  |  |
| 8.5 | Cierre |  |  |  |
| 8.5.1 | Sustentar el cierre del proyecto | 2 días | 8.4.1 | 60 |
| 8.5.1.1 | Acta de Cierre |  |  |  |
[/TABLE]

3  Resumen de la Metodología
El desarrollo del proyecto se rige bajo el marco de trabajo ágil Scrum, complementado con prácticas de ingeniería de software para asegurar entregas continuas y funcionales en las estaciones de trabajo de la empresa. La gestión se estructura en sprints quincenales orientados a procesos de negocio específicos, con revisiones directas en las instalaciones de Jr. Simón Bolívar 945 para contrastar cada incremento con las necesidades operativas de taller y mostrador.
3.1            Organización de los Equipos del Proyecto
El proyecto se ejecuta bajo un esquema MultiRol estructurado para los tres integrantes del Grupo 2, garantizando un equilibrio riguroso en las responsabilidades de gestión, desarrollo y aseguramiento de calidad:
3.1.1   Recursos Humanos

[TABLE]
| Necesidad | Recurso | Cantidad | Estado | Comentarios/Responsabilidades |
| Gestión del Proyecto y Arquitectura | Gerardo Erick Plasencia Torres | 80 horas | Disponible | Líder de Proyecto, Scrum Master, Arquitecto Full Stack, DevOps y DBA. |
| Frontend y QA Funcional | Jose Estibb Anhuaman Delgado | 80 horas | Disponible | Desarrollador Frontend Lead (Angular 21), Diseñador UI/UX, Tester QA y Analista de Procesos. |
| Backend e Inteligencia Artificial | Jose Diego Rodriguez Vasquez | 80 horas | Disponible | Desarrollador Backend Lead (FastAPI), Ingeniero de IA, Tester de Rendimiento/APIs y DBA. |
[/TABLE]

3.1.2   Organización de los Equipos de Trabajo

[TABLE]
| Nombre | Cargo |
| Gerardo Erick Plasencia Torres | Líder de Proyecto, Scrum Master y Desarrollador Full Stack |
| Jose Estibb Anhuaman Delgado | Desarrollador Frontend Lead, Diseñador UI/UX y Tester QA |
| Jose Diego Rodriguez Vasquez | Desarrollador Backend Lead, Ingeniero de IA y DBA |
[/TABLE]

3.2            Herramientas de Desarrollo y Colaboración
Aquí se especifican las herramientas que se planean usar de manera intensiva durante el desarrollo del proyecto. Se detallan tanto las estaciones de trabajo físicas existentes en las instalaciones de Impresos Trujillo E.I.R.L. (oficina y taller) como las herramientas de software, infraestructura en la nube, librerías de analítica y plataformas de colaboración:

[TABLE]
| Equipo / Ubicación | Especificación Técnica (CPU, RAM, Disco) | Sistema Operativo y Compilación | Estado | Costo |
| PC 1: Oficina / Mostrador Principal (Recepción) | Intel Core i5 12400F / 16 GB RAM / SSD 500 GB | Windows 10 Pro 22H2 (compilación 19045.5371) | Cumple | S/ 0.00 (Reutilizado) |
| PC 2: Taller / Mostrador Secundario | Intel Core i5 10400T / 12 GB RAM / HDD 1 TB | Windows 11 Pro 25H2 (compilación 26200.9168) | Cumple | S/ 0.00 (Reutilizado) |
| PC 3: Taller / Producción Plotters Wit-Color | Intel Core i7 6700 / 16 GB RAM / HDD 2 TB | Windows 10 Pro 22H2 (compilación 19045.5371) | Cumple | S/ 0.00 (Reutilizado) |
| PC 4: Oficina / Estación Diseño Gráfico (Ashlee) | AMD Ryzen 5 3400G / 32 GB RAM / HDD 3 TB | Windows 11 Pro 25H2 (compilación 26200.9168) | Cumple | S/ 0.00 (Reutilizado) |
| PC 5: Oficina / Gerencia General (Marcell Vásquez) | Intel Core i5 12400F / 16 GB RAM / SSD 500 GB | Windows 10 Pro 22H2 (compilación 19045.5737) | Cumple | S/ 0.00 (Reutilizado) |
| PC 6: Taller / Secretaría y Control (Marilú) | Intel Core i5 10400F / 8 GB RAM / SSD 500 GB | Windows 10 Pro 22H2 (compilación 19045.3324) | Cumple | S/ 0.00 (Reutilizado) |
| Conectividad: Enlace de Red en Planta | Fibra óptica simétrica 200 Mbps y red cableada Gigabit Ethernet | Infraestructura de red de alta velocidad | Cumple | S/ 0.00 (Existente) |
[/TABLE]

Asimismo, para el entorno de arquitectura, desarrollo e integración continua en la nube, se detalla el conjunto de herramientas de software, plataformas y servicios seleccionados para el proyecto:

[TABLE]
| Herramienta / Categoría | Tecnología / Plataforma | Versión / Tipo | Estado | Comentarios / Costo |
| Frontend Web SPA | Angular 21, TypeScript, Tailwind CSS | v21 Open Source | Cumple | Aplicación web responsive cliente ligero para navegadores Chrome y Edge (S/ 0.00) |
| Backend API RESTful | FastAPI, Python 3.11 asíncrono, Pydantic | v0.115 Open Source | Cumple | API asíncrona con documentación OpenAPI interactiva (Swagger) (S/ 0.00) |
| Base de Datos Relacional Cloud | PostgreSQL nativo en contenedor Docker (servidor VPS particular) | v16 Managed Cloud | Cumple | Base de datos transaccional con réplicas y alta disponibilidad (S/ 70.00) |
| Inteligencia Artificial y Analítica | Scikit-learn y Prophet | Python Open Source | Cumple | Modelos predictivos de demanda mensual y detección de anomalías en mermas (S/ 0.00) |
| Contenedores y Cloud Hosting | Docker y Servidor VPS particular propio (Ubuntu + Docker) | Serverless Container | Cumple | Servicios de nube escalables con despliegue automatizado continuo |
| Control de Versiones y Código | Git y repositorio institucional en GitHub | GitHub Enterprise / UPN | Cumple | Control de versiones, ramas por feature, auditoría y Pull Requests (S/ 0.00) |
| Diseño UI/UX y Prototipado | Maquetación directa en código (Angular 21) | Cloud Colaborativo | Cumple | Diseño de wireframes, guías de estilo y prototipos validados con Gerencia |
| Comunicación y Colaboración | WhatsApp institucional, Google Meet y GitHub Projects | Herramientas colaborativas | Cumple | Seguimiento de sprint backlog, actas de acuerdos y soporte directo |
[/TABLE]

3.3            Control de Cambios
En este apartado se describe cómo se controlarán los cambios en el proyecto. Cualquier modificación que altere el alcance, cronograma o presupuesto pactado seguirá el procedimiento formal: (1) Emisión de Solicitud de Cambio RFC con justificación técnica y operativa; (2) Evaluación técnica de impacto por el equipo de desarrollo; (3) Aprobación formal por el Líder de Proyecto y la Gerencia de Impresos Trujillo E.I.R.L. (Product Owner); y (4) Registro en la matriz de trazabilidad y control de versiones mediante Pull Requests en GitHub.
3.4            De la Actualización del Plan de Proyecto
Este documento será actualizado cuando se requiera mientras dure el proyecto, particularmente al cierre de cada sprint quincenal y en cada hito formal. Toda nueva versión aprobada se mantendrá bajo control de versiones en el repositorio institucional del proyecto.
5   Estructura del Trabajo y Estimados
A continuación se enumeran las 8 fases y 39 tareas del proyecto derivadas de la EDT, con su respectiva estimación temporal que totaliza exactamente 240 horas valorizadas de trabajo de ingeniería:

[TABLE]
| Paso | Descripción | Estimado |
| 1 | Gestión del Proyecto | 38 h |
| 1.1 | Acta de Constitución del Proyecto | 10 h |
| 1.2 | Business Case | 10 h |
| 1.3 | Planificación del Proyecto | 8 h |
| 1.4 | Plan de Desarrollo del Proyecto de Software | 10 h |
| 2 | Análisis de Requerimientos | 21 h |
| 2.1 | Requerimientos de Software | 9 h |
| 2.2 | Estructura de Análisis | 6 h |
| 2.3 | Matriz de Consistencia | 6 h |
| 3 | Diseño de la Solución | 30 h |
| 3.1 | Arquitectura del Sistema | 7 h |
| 3.2 | Modelado de Arquitectura Ágil, Historias de Usuario | 6 h |
| 3.3 | Base de Datos | 7 h |
| 3.4 | Interfaces de Usuario | 7 h |
| 3.5 | Trazabilidad | 3 h |
| 4 | Construcción del Producto | 58 h |
| 4.1 | Módulo Transaccional Base - Catálogo, Talonario Virtual, Clientes | 22 h |
| 4.2 | Módulo de Cobros, Caja, Business Intelligence | 26 h |
| 4.3 | Módulo Predictivo de Demanda, Candado Digital de Entrega | 10 h |
| 5 | Aseguramiento de Calidad | 20 h |
| 5.1 | Pruebas | 10 h |
| 5.2 | SQA | 6 h |
| 5.3 | Evaluación de Aceptación Operativa en Planta | 4 h |
| 6 | Despliegue del Producto | 20 h |
| 6.1 | Despliegue | 10 h |
| 6.2 | Capacitación | 10 h |
| 7 | Prácticas de Campo | 32 h |
| 7.1 | Práctica de Campo I | 7 h |
| 7.2 | Práctica de Campo II | 7 h |
| 7.3 | Responsabilidad Social | 3 h |
| 7.4 | Medición Pretest | 4 h |
| 7.5 | Medición Postest | 5 h |
| 7.6 | Informe Empresarial | 6 h |
| 8 | Cierre del Proyecto | 21 h |
| 8.1 | Inferencia Estadística | 5 h |
| 8.2 | Paper Científico | 4 h |
| 8.3 | Memoria Técnica | 4 h |
| 8.4 | Portafolio Final | 4 h |
| 8.5 | Cierre | 4 h |
| Total | Trabajo de ingeniería valorizado del proyecto | 240 h |
[/TABLE]

6   Entregables del Proyecto

[TABLE]
| Entregable | Descripción | Fecha de la Entrega |
| Acta de Constitución | Documento de formalización con objetivos, alcance, hitos y presupuesto. | 28/08/2026 |
| Business Case | Caso de negocio con evaluación económica y viabilidad. | 04/09/2026 |
| Documento SRS IEEE 830 | Especificación formal de requerimientos funcionales y no funcionales. | 11/09/2026 |
| EDT, cronograma y presupuesto | Estructura de desglose, programación y costos valorizados. | 11/09/2026 |
| Estructura de análisis y matriz de consistencia | Variables, indicadores, población y muestra del estudio. | 11/09/2026 |
| Plan de Desarrollo del Proyecto de Software | Plan con metodología, recursos y plan de trabajo. | 25/09/2026 |
| Documento de arquitectura, modelado ágil | Diseño de arquitectura Servidor VPS particular, modelos UML y base de datos. | 25/09/2026 |
| Prototipos de interfaces | Wireframes y prototipos UI/UX en Maquetación directa en código (Angular 21) validados con la empresa. | 25/09/2026 |
| Matriz de trazabilidad | Trazabilidad problema-necesidades-requisitos-diseño. | 25/09/2026 |
| Módulo Transaccional Base | Producto funcional al 30% con el módulo transaccional base. | 02/10/2026 |
| Módulo de Cobros, Caja, BI | Producto funcional al 70% con cobros, arqueo dual y BI. | 23/10/2026 |
| Módulo Predictivo de Demanda | Verificación del avance funcional y ajustes de estabilización. | 27/10/2026 |
| Sistema Web Integral al 100% | Construcción completa de los módulos transaccional, BI e IA. | 30/10/2026 |
| Reportes de pruebas y UAT | Pruebas unitarias, integración, sistema y aceptación con usuarios. | 05/11/2026 |
| Software desplegado y acta de entrega | Despliegue en producción y entrega formal en planta, Hito 5. | 06/11/2026 |
| Manuales y capacitación | Manual de usuario, guía de despliegue y registro de capacitación. | 11/11/2026 |
| Informe de práctica de campo y responsabilidad social | Portafolio de primera entrega, capítulos e informe de RS. | 20/11/2026 |
| Informe de resultados y dataset postest | Medición postest, muestra censal n=125 e informe de aceptación empresarial. | 27/11/2026 |
| Informe estadístico y paper | Contraste de hipótesis mediante pruebas Wilcoxon y t-Student, paper IEEE y memoria. | 11/12/2026 |
| Acta de cierre | Cierre formal del proyecto y portafolio final sustentado. | 11/12/2026 |
[/TABLE]

7   Calendario del proyecto
El calendario del proyecto abarca un horizonte formal de 16 semanas académicas (22/08/2026 al 11/12/2026). Se estructuran a continuación el cronograma maestro por fases e hitos, las tablas normativas de disciplinas y objetos generados para las fases de Inicio y Elaboración, el desglose de actividades derivadas de la EDT con sus predecesoras y costos valorizados, y la sincronización con el Diagrama de Gantt oficial:

[TABLE]
| Fase del Proyecto | Período / Semanas | Fechas Clave | Hito / Entregable Principal | Costo Valorizado |
| Fase I: Inicio y Planificación Estratégica | Semanas 1 y 2 | 22/08/2026 - 04/09/2026 | H1: Acta de Constitución y Business Case aprobados | S/ 980.00 |
| Fase II: Análisis y Especificación de Procesos | Semanas 2 y 3 | 29/08/2026 - 11/09/2026 | H2: Documento SRS IEEE 830 y Matriz de Consistencia | S/ 390.00 |
| Fase III: Diseño de Arquitectura y Base de Datos | Semanas 4 y 5 | 12/09/2026 - 25/09/2026 | Arquitectura Servidor VPS particular, ER PostgreSQL y Maquetación directa en código (Angular 21) validados | S/ 610.00 |
| Fase IV: Construcción Transaccional, BI e IA | Semanas 4 a 10 | 12/09/2026 - 30/10/2026 | H3: T1, Semana 6, 30% funcional; H4: T2, Semana 10, software al 100% | S/ 860.00 |
| Fase V: QA, Despliegue y Entrega en Planta | Semana 11 | 31/10/2026 - 06/11/2026 | H5: UAT, despliegue en 6 PCs y Acta de Entrega en Planta | S/ 930.00 |
| Fase VI: Operación en Planta, Postest e Informe | Semanas 11 a 14 | 31/10/2026 - 27/11/2026 | Muestra postest, muestra censal n=125, RSU, Semana 12, H6: Informe Empresarial | S/ 620.00 |
| Fase VII: Inferencia Estadística, Paper y Cierre | Semanas 15 y 16 | 28/11/2026 - 11/12/2026 | H7: Wilcoxon/t-Student, Paper IEEE, Memoria y Acta Cierre | S/ 710.00 |
| TOTAL VALORIZADO DEL PROYECTO | 16 Semanas | 22/08 - 05/12/2026 | Despliegue integral, validación científica y cierre formal | S/ 5,100.00 |
[/TABLE]

A continuación se detalla la programación de disciplinas y objetos generados en la Fase de Inicio:

[TABLE]
| Fase de Inicio: disciplinas y objetos generados | Comienzo | Aprobación |
| Gestión del Proyecto: Acta de Constitución del Proyecto, código AC-G2-2026 | 22/08/2026 | 28/08/2026 |
| Gestión del Proyecto: Business Case, código BC-G2-2026 | 29/08/2026 | 04/09/2026 |
| Requerimientos: Especificación de Requerimientos SRS IEEE 830, código SRS-G2-2026 | 29/08/2026 | 11/09/2026 |
| Metodología y Alcance: Estructura de Análisis y Matriz de Consistencia | 05/09/2026 | 11/09/2026 |
| Planificación Integral: Plan de Desarrollo del Proyecto de Software | 05/09/2026 | 25/09/2026 |
[/TABLE]

Para la Fase de Elaboración se especifican las disciplinas arquitectónicas y modelos producidos:

[TABLE]
| Fase de Elaboración: disciplinas y objetos generados | Comienzo | Aprobación |
| Diseño de Arquitectura: Arquitectura del Sistema en Servidor VPS particular propio (Ubuntu + Docker) | 12/09/2026 | 18/09/2026 |
| Modelado y Datos: Modelado de Arquitectura Ágil, Historias de Usuario y Modelo Relacional PostgreSQL en PostgreSQL nativo (Docker) | 12/09/2026 | 25/09/2026 |
| Diseño UI/UX: Interfaces de Usuario y Wireframes en Maquetación directa en código (Angular 21) validados con Gerencia | 12/09/2026 | 25/09/2026 |
| Trazabilidad: Matriz de Trazabilidad Problema - Requisitos - Arquitectura | 19/09/2026 | 25/09/2026 |
| Construcción Inicial: Incremento Funcional Módulo Transaccional Base al 30% | 19/09/2026 | 02/10/2026 |
[/TABLE]

El detalle de actividades del cronograma con duraciones, predecesoras y costos valorizados se presenta a continuación:

[TABLE]
| EDT | Actividad / Entregable Clave | Duración | Predecesora | Costo S/ |
| 1.1 | Elaborar y validar el Acta de Constitución con Gerencia | 7 días | - | 200.00 |
| 1.2 | Formular y validar el Business Case y Viabilidad Económica | 7 días | 1.1 | 200.00 |
| 1.3 | Planificación: EDT, cronograma, presupuesto y recursos | 7 días | 1.2 | 220.00 |
| 1.4 | Plan de Desarrollo de Software, riesgos, comunicaciones y RACI | 12 días | 1.3 | 360.00 |
| 2.1 | Especificación de Requerimientos SRS bajo estándar IEEE 830 | 7 días | 1.1 | 190.00 |
| 2.2 - 2.3 | Estructura de Análisis y Matriz de Consistencia Metodológica | 7 días | 2.1 | 200.00 |
| 3.1 - 3.2 | Diseño de Arquitectura Servidor VPS particular y Modelado de Arquitectura Ágil, Historias de Usuario | 7 días | 2.1 | 250.00 |
| 3.3 - 3.4 | Diseño de Base de Datos PostgreSQL y Prototipos Maquetación directa en código (Angular 21) | 7 días | 3.1 | 250.00 |
| 3.5 | Elaboración de la Matriz de Trazabilidad de Requerimientos | 7 días | 3.3 | 110.00 |
| 4.1 | Módulo Transaccional Base - Catálogo, Talonario Virtual, Clientes | 14 días | 3.3 | 360.00 |
| 4.2 | Módulo de Cobros, Caja, Business Intelligence | 21 días | 4.1 | 380.00 |
| 4.3 | Módulo Predictivo de Demanda, Candado Digital de Entrega | 7 días | 4.2 | 120.00 |
| 5.1 | Pruebas unitarias, integración, sistema y UAT con usuarios | 15 días | 4.2 | 390.00 |
| 5.2 - 5.3 | Aseguramiento de Calidad SQA, Aceptación Operativa en Planta | 6 días | 5.1 | 180.00 |
| 6.1 | Despliegue en producción y Acta de Entrega en Planta, Semana 11 | 7 días | 5.1 | 380.00 |
| 6.2 | Manual de usuario, guía técnica de despliegue y capacitación | 8 días | 6.1 | 320.00 |
| 7.1 - 7.6 | Prácticas de Campo I/II, RSU, Pretest, Postest, muestra censal n=125 e Informe | 65 días | 2.1 | 400.00 |
| 8.1 - 8.5 | Inferencia estadística, Paper IEEE, Memoria Técnica y Cierre | 26 días | 7.6 | 310.00 |
| TOTAL | Presupuesto valorizado total del proyecto, período de 16 semanas | 16 sem. | - | 5,100.00 |
[/TABLE]

Diagrama de Gantt Oficial del Proyecto:
Figura 1: Diagrama de Gantt del proyecto — 16 semanas académicas con la programación de actividades y los hitos H1 a H7.
8   Manejo de Riesgos
El proyecto implementa una gestión formal de riesgos basada en las directrices de la Matriz de Riesgos institucional (código MR-G2-2026). La evaluación se realiza mediante una matriz 3x3 que pondera la Probabilidad de ocurrencia (Alta = 3, Media = 2, Baja = 1) y el Impacto operativo (Alto = 3, Medio = 2, Bajo = 1), obteniendo una Severidad de 1 a 9 clasificada en tres niveles: Alto (6 a 9), Medio (3 a 4) y Bajo (1 a 2). A continuación se presenta la Matriz de Riesgos completa con los 12 eventos de riesgo identificados, sus consecuencias, evaluación, planes de mitigación y responsables asignados:

[TABLE]
| N° | EDT | Tipo | Riesgo / Fuente | Impacto | Prob. | Valor | Nivel | Estrategia y Plan de Mitigación | Responsable |
| R1 | 7.1.1 | Gestión | Demora de la empresa en entregar registros históricos de talonarios y Excels. | Alto | Medio | 6.0 | Alto | Mitigar: cronograma de digitalización asistida por lotes semanales con apoyo del personal de taller. | Gerardo Erick Plasencia Torres |
| R2 | 6.2.3 | Organizacional | Resistencia del personal de taller al cambio (costumbre de libretas manuales). | Medio | Medio | 4.0 | Medio | Mitigar: capacitación in situ, pantallas táctiles simplificadas y manuales visuales de uso rápido. | Jose Estibb Anhuaman Delgado |
| R3 | 6.1.1 | Externo | Cortes imprevistos en el suministro eléctrico comercial o fallas en el enlace de fibra óptica en planta durante jornadas de alta producción. | Alto | Bajo | 3.0 | Medio | Mitigar: persistencia local en caché del navegador (Local Storage) y base de datos cloud con respaldo continuo. | Jose Diego Rodriguez Vasquez |
| R4 | 4.1.1 | Gestión | Discrepancias entre contratos físicos, tarifas vigentes y configuración del sistema. | Medio | Bajo | 2.0 | Bajo | Mitigar: formalizar con Gerencia la aprobación del formulario digital antes de la Fase III. | Gerardo Erick Plasencia Torres |
| R5 | 4.2.1 | Técnico | Capturas de pantalla de pagos Yape cargadas con montos que no coinciden con voucher. | Medio | Bajo | 2.0 | Bajo | Mitigar: validación visual rápida con confirmación explícita de recepción en cuenta por administración. | Jose Diego Rodriguez Vasquez |
| R6 | 6.1.1 | Técnico | Indisponibilidad temporal de servicios cloud contratados (Servidor VPS particular / PostgreSQL Docker). | Alto | Bajo | 3.0 | Medio | Transferir: continuidad respaldada en SLA 99.9% de proveedores cloud y monitoreo preventivo. | Jose Diego Rodriguez Vasquez |
| R7 | 8.1.1 | Calidad | Datos históricos insuficientes o de baja calidad para entrenar modelo de IA. | Medio | Medio | 4.0 | Medio | Mitigar: reentrenamiento progresivo con data real recolectada durante la operación en planta. | Jose Diego Rodriguez Vasquez |
| R8 | 4.2.2 | Gestión | Solicitudes de cambio no controladas sobre reportes gerenciales durante sprints. | Medio | Medio | 4.0 | Medio | Mitigar: registro y priorización formal en procedimiento RFC con aprobación de Product Owner. | Gerardo Erick Plasencia Torres |
| R9 | 1.1.2 | Gestión | Demora de Gerencia en la validación y firma del Acta de Constitución y Business Case. | Medio | Bajo | 2.0 | Bajo | Mitigar: agenda fija de revisión y firma con Gerencia dentro de la misma semana de entrega. | Gerardo Erick Plasencia Torres |
| R10 | 2.1.1 | Gestión | Requerimientos funcionales incompletos o ambiguos entregados por la empresa. | Medio | Medio | 4.0 | Medio | Mitigar: entrevistas estructuradas, prototipos navegables en Maquetación directa en código (Angular 21) y validación escrita con gerentes. | Jose Estibb Anhuaman Delgado |
| R11 | 3.3.1 | Técnico | Crecimiento del volumen de datos y concurrencia no previstos en base de datos. | Alto | Bajo | 3.0 | Medio | Mitigar: pruebas de carga y estrés, índices optimizados y escalado administrado en la nube. | Jose Estibb Anhuaman Delgado |
| R12 | 5.1.4 | Calidad | Defectos críticos detectados tardíamente durante la aceptación en planta. | Alto | Medio | 6.0 | Alto | Mitigar: pruebas continuas por sprint y sesiones UAT tempranas con el personal de mostrador. | Jose Estibb Anhuaman Delgado |
[/TABLE]

Distribución y balance de mitigaciones: El perfil de riesgo del proyecto registra 2 riesgos en nivel Alto (R1: disponibilidad de registros para línea base e IA; R12: defectos en aceptación final), 7 riesgos en nivel Medio (R2, R3, R6, R7, R8, R10, R11) y 3 riesgos en nivel Bajo (R4, R5, R9).
Asignación equitativa de responsabilidades: Conforme a las directrices de clase y la Matriz de Responsabilidades (RACI), la gestión y mitigación de los riesgos se distribuye equilibradamente entre los miembros del equipo: 4 riesgos asignados a Gerardo Plasencia (Gestión, Arquitectura y Trazabilidad: R1, R4, R8, R9), 4 riesgos a Jose Estibb Anhuaman (Frontend, QA, Concurrencia y UAT: R2, R10, R11, R12) y 4 riesgos a Jose Diego Rodriguez (Backend, IA, Pagos e Infraestructura Cloud: R3, R5, R6, R7).
9   Planeación de Dependencias del Proyecto
A continuación se detallan las respuestas técnicas y operativas a las preguntas de dependencias del proyecto:
¿Este proyecto compite por los recursos de otros proyectos?
No. El equipo de desarrollo del Grupo 2 mantiene asignación y dedicación exclusiva al Proyecto Capstone durante las 16 semanas académicas del período 2026-II. Asimismo, las estaciones de trabajo de planta y el enlace de red son de uso operativo exclusivo de Impresos Trujillo E.I.R.L.; no existe competencia de recursos con ninguna otra iniciativa.
¿Este proyecto depende del éxito de otro proyecto?
No. El proyecto es completamente autónomo y autosuficiente. Sus entradas críticas (talonarios físicos, Excels de archivo y flujos de caja) provienen de la operación interna del negocio y de las sesiones de relevamiento técnico.
¿Algún otro proyecto depende de este?
Ningún otro proyecto depende del desarrollo ni de la culminación de esta plataforma web.
¿Existe otra dependencia importante que puede afectar a este objeto?
Sí. Se identifican tres dependencias operativas fundamentales: (1) La disponibilidad semanal de la Gerencia General (Angel Rodríguez y Marcell Vásquez) y del personal de planta para las revisiones de sprint y pruebas UAT; (2) La continuidad de los servicios de nube de Servidor VPS particular propio (Ubuntu + Docker) y PostgreSQL Docker bajo sus acuerdos de nivel de servicio (SLA 99.9%); y (3) La entrega formal del sistema al 100% en la semana 11 para habilitar la ventana de recolección experimental de datos postest (n=125).