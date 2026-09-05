# Acta de Constitución del Proyecto

| Campo | Detalle |
| :--- | :--- |
| **Proyecto:** | Implementación de un sistema web transaccional con módulos de inteligencia de negocios e inteligencia artificial para la optimización de los procesos operativos en la empresa Impresos Trujillo E.I.R.L. |
| **Código:** | Grupo 2 (Aula: 22643421416) |
| **Fecha:** | 22 de agosto de 2026 |

---

## Racionalidad y Propósito del Proyecto

Impresos Trujillo E.I.R.L. presenta deficiencias operativas y financieras originadas por la gestión manual de sus actividades mediante talonarios físicos volantes y hojas de cálculo independientes que se sobrescriben periódicamente. Esta condición genera una pérdida crítica de trazabilidad histórica en los registros de órdenes de trabajo, contratos y proformas. En el área de producción, la ausencia de un control sistematizado de insumos provoca quiebres de inventario no advertidos y mermas descontroladas (principalmente en vinilos, lonas y pegamentos, con pérdidas estimadas superiores a S/ 3,500 mensuales), al no existir una fórmula estandarizada de consumo ni un mecanismo de reserva previa al aceptar pedidos. 

En el ámbito financiero, la falta de conciliación estricta entre adelantos y saldos pendientes permite la entrega física de trabajos sin la liquidación total del cobro, incrementando la cartera morosa e imposibilitando un arqueo confiable de caja. Asimismo, la empresa carece de separación contable operativa entre sus dos líneas de negocio fundamentales: Imprenta y Gigantografías, y no cuenta con herramientas analíticas ni predictivas para anticipar la demanda de materiales. El propósito del presente proyecto es implementar una plataforma web integral que automatice el flujo transaccional de órdenes, estandarice el control de inventarios mediante recetas de insumos y reglas técnicas de consumo, asegure el cumplimiento de cobros previo a la entrega, segregue los arqueos de caja por unidad y suministre capacidades de inteligencia de negocios y predicción de demanda para una toma de decisiones informada.

---

## Objetivos del Proyecto

### Objetivo General
Implementar un sistema web transaccional con módulos de inteligencia de negocios e inteligencia artificial para la optimización de los procesos operativos y financieros en la empresa Impresos Trujillo E.I.R.L.

### Objetivos Específicos
1. **OE1:** Reducir el tiempo promedio de registro, procesamiento y consulta de órdenes de trabajo y proformas de 18 a 3 minutos mediante la digitalización del talonario comercial y centralización de registros operativos.
2. **OE2:** Disminuir en un 80% las discrepancias de inventario y mermas de insumos mediante la reserva automática de stock por orden y el cálculo estandarizado de consumo de pegamento (regla de 5 metros lineales de material).
3. **OE3:** Eliminar al 100% las pérdidas financieras generadas por entregas de trabajos con saldos pendientes mediante la validación automática de cobro completo en el pipeline operativo.
4. **OE4:** Incrementar al 95% la exactitud de los arqueos y liquidaciones diarias de caja mediante la segregación operativa por unidad de negocio (Imprenta y Gigantografías) y el desglose de medios de pago (efectivo, Yape y transferencias).
5. **OE5:** Proporcionar visibilidad analítica y predictiva de la demanda operativa con una precisión mínima del 85% para anticipar los requerimientos de reabastecimiento de insumos críticos.

---

## Estrategia del Proyecto

### Modelo de Intervención
El proyecto se desarrollará bajo la metodología ágil **Scrum** complementada con prácticas de flujo visual **Kanban** para la sincronización operativa en taller. Se implementará una arquitectura web distribuida compuesta por un cliente SPA en **Angular 21**, una API RESTful asíncrona en **FastAPI (Python 3.11)**, base de datos relacional transaccional en **PostgreSQL**, y módulos analíticos y predictivos en **Scikit-learn** y **Prophet**. El despliegue de backend y base de datos se estructurará sobre contenedores **Docker** alojados en servicios de nube optimizados (**Cloud Run**). La ejecución se distribuirá en sprints quincenales orientados a la entrega de procesos de negocio funcionales y verificables directamente en las estaciones de trabajo de la empresa.

### Alcance (Productos y Entregables)

#### Módulos del Software:
1. **Módulo Transaccional:**
   - Registro y gestión de clientes y catálogo de productos con definición de recetas de insumos (propios, servicios y subcontratados).
   - Gestión integral de órdenes de trabajo mediante talonario virtual adaptado al formato de Contrato / Proforma (N° correlativo, cliente, dirección, teléfono, adelanto, saldo, total, fecha pactada, indicador de IGV y firma).
   - Control de inventario con reserva automática de stock al crear la orden y ajuste por mermas/devolución al finalizar la producción.
   - Cálculo automatizado de aproximación de consumo de goma/pegamento (cuota por cada 5 metros lineales procesados).
   - Módulo de cobros con registro cronológico de eventos de pago (efectivo, Yape y transferencia bancaria) y candado de seguridad para entrega física.
   - Cierre de caja por usuario con segregación obligatoria de cuentas para Imprenta y Gigantografías.
2. **Módulo de Inteligencia de Negocios (BI):**
   - Tableros de control ejecutivos con indicadores clave (ingresos por período, rotación de materiales, saldos pendientes y volumen de trabajo).
   - Reportes analíticos de productividad por operario y rentabilidad por tipo de producto, con soporte de exportación tabular compatible con Microsoft Excel 2021 (.xlsx).
3. **Módulo de Inteligencia Artificial (IA):**
   - Modelo predictivo de demanda de insumos críticos para apoyo al reabastecimiento mensual.
   - Algoritmo de alertas inteligentes para detección de anomalías en demoras de producción y consumos excesivos de material.

#### Documentos Entregables:
1. Acta de Constitución del Proyecto (Project Charter).
2. Caso de Negocio (Business Case).
3. Especificación de Requerimientos de Software (SRS formal bajo estándar IEEE 830).
4. Carpeta Consolidada de Prácticas de Campo (evidencias de relevamiento técnico y actas de visita).
5. Informe Experimental de Resultados Pretest y Postest Operativo en la empresa.
6. Informe de Charla y Actividad de Responsabilidad Social Universitaria.
7. Manuales de Usuario y Guía Técnica de Despliegue en la infraestructura reutilizada.
8. Artículo Científico (Paper de Investigación) e Informe Final de Proyecto.

### Límites del Alcance (Lo que NO Producirá el Proyecto)
- No incluye integración ni facturación electrónica directa con la API de SUNAT (la emisión formal se mantiene vía Portal SUNAT/Clave SOL; el sistema gestiona comprobantes informativos internos).
- No contempla el desarrollo de aplicaciones móviles nativas para sistemas Android o iOS (la interfaz se implementa como aplicación web responsive accesible desde navegadores en smartphones y PCs).
- No incorpora pasarela de pagos bancaria automatizada con cobro en línea (la conciliación de pagos electrónicos se realiza mediante carga y validación asistida de capturas).
- No incluye módulos de gestión de recursos humanos, control biométrico de asistencia ni cálculo de planillas salariales (normativa SUNAFIL).
- No gestiona compras ni emisión de órdenes de pago a proveedores externos de insumos o servicios tercerizados fuera del registro de costos.

### Cronograma Resumido de Fases e Hitos

| Fase | Período Estimado | Hito / Entregable Principal |
| :--- | :--- | :--- |
| **Fase I: Inicio y Planificación Estratégica** | 22/08/2026 - 28/08/2026 | Acta de Constitución y Business Case formalmente aprobados. |
| **Fase II: Análisis y Especificación de Procesos** | 29/08/2026 - 04/09/2026 | Documento SRS aprobado y Matriz de Trazabilidad definida. |
| **Fase III: Construcción del Núcleo Transaccional** | 05/09/2026 - 23/10/2026 | Versión Beta funcional operativa (órdenes, inventario, pagos y caja) desplegada en taller. |
| **Fase IV: Desarrollo de Inteligencia de Negocios** | 24/10/2026 - 30/10/2026 | Dashboards gerenciales y reportes analíticos con exportación a Excel 2021 operativos. |
| **Fase V: Modelamiento e Integración de IA** | 31/10/2026 - 06/11/2026 | Modelo predictivo de demanda entrenado y módulo de alertas integrado al sistema. |
| **Fase VI: Implantación, Pruebas y Evaluación Experimental** | 07/11/2026 - 20/11/2026 | Sistema al 100% en producción en taller/oficina, aplicación de Postest y Acta de Conformidad de la Empresa. |
| **Fase VII: Cierre del Proyecto y Difusión Científica** | 21/11/2026 - 11/12/2026 | Charla de Responsabilidad Social realizada, Paper de investigación e Informe Final concluidos. |

### Presupuesto Resumido por Categorías

| Categoría | Ítem | Costo (S/) |
| :--- | :--- | :--- |
| **Recursos Humanos** | Equipo de Proyecto MultiRol (3 desarrolladores: 240 horas valorizadas a S/ 20.00/h) | 4,800.00 |
| **Tecnología y Nube** | Dominio web anual (.pe / .com) | 110.00 |
| **Tecnología y Nube** | Alojamiento en la nube (Cloud Run y PostgreSQL gestionado en Supabase - plan proyecto) | 70.00 |
| **Infraestructura y Hardware** | Reutilización de las 6 computadoras existentes de oficina/taller y enlace de red de 200 Mbps | 0.00 |
| **Documentación y Logística** | Impresiones oficiales, carpetas de prácticas de campo, viáticos de visitas técnicas y capacitación | 120.00 |
| **TOTAL VALORIZADO DEL PROYECTO** | | **5,100.00** |

*Nota aclaratoria de presupuesto: La infraestructura física (las 6 estaciones de trabajo de oficina/taller y la conexión a internet simétrica de 200 Mbps) es de propiedad de la empresa y se reutiliza íntegramente a costo S/ 0.00. El monto en efectivo neto a financiar por el equipo para consumibles y servicios es de S/ 300.00, mientras que la inversión valorizada total del proyecto asciende a S/ 5,100.00.*

### Riesgos, Supuestos y Restricciones de Alto Nivel

#### Matriz de Riesgos Iniciales:
| Riesgo | Prob. | Impacto | Acciones de Mitigación |
| :--- | :---: | :---: | :--- |
| **R1: Demora en la entrega de registros históricos** (talonarios físicos y Excels) por parte de la empresa, limitando la data para el pretest y el entrenamiento de IA. | 3/5 | 4/5 | Establecer un cronograma de digitalización asistida por lotes semanales con apoyo del personal de taller. |
| **R2: Resistencia al cambio operativo** por parte del personal de taller acostumbrado a la anotación en libretas manuales. | 3/5 | 3/5 | Conducir sesiones de capacitación in situ, simplificar las pantallas táctiles y elaborar manuales de uso rápidos con diagramas visuales. |
| **R3: Interrupciones en el fluido eléctrico o inestabilidad de red** local en el taller durante jornadas de alta demanda productiva. | 2/5 | 4/5 | Implementar persistencia temporal de datos en navegador (local storage) y alojar la base de datos en nube con réplica y alta disponibilidad. |
| **R4: Discrepancias imprevistas en los formatos de contratos físicos** o tarifas durante la etapa de pruebas en taller. | 2/5 | 3/5 | Formalizar la aprobación del formulario del contrato/proforma digital con gerencia previo a la culminación de la Fase II. |

#### Suposiciones:
1. La empresa garantizará el acceso continuo a los registros históricos de órdenes de trabajo, talonarios de contratos/proformas y archivos Excel para el levantamiento de la línea base.
2. La gerencia y el personal clave dispondrán de un mínimo de 2 horas semanales para reuniones de coordinación, validación de avances y pruebas operativas.
3. Las 6 computadoras registradas en oficina y taller (sistemas Windows 10 y Windows 11) y el enlace de internet de 200 Mbps se mantendrán operativos y disponibles.
4. Las políticas de cotización, adelantos obligatorios y fórmulas de consumo de insumos (regla técnica de 5 metros de pegamento) permanecerán estables durante el período experimental.

#### Restricciones:
1. Plazo estricto de entrega: El sistema debe encontrarse 100% operativo e implantado en la empresa en la semana 11 del ciclo académico para la ejecución del postest y emisión del informe empresarial.
2. Arquitectura de cliente ligero: El sistema debe operar exclusivamente en entorno web mediante navegadores modernos (Google Chrome y Microsoft Edge), sin requerir instalación de clientes pesados en las estaciones de trabajo.
3. Compatibilidad ofimática: Todo reporte o exportación de datos debe ser nativamente compatible con Microsoft Excel 2021 LTSC.
4. Límite presupuestario universitario: Los gastos en efectivo de tecnología, dominio y papelería no podrán exceder la cuota autofinanciada de S/ 300.00 asignada al proyecto.

---

## Estructura de Gobernabilidad

La empresa no cuenta con un departamento de TI formal. La máxima instancia de gobernabilidad, supervisión y aprobación del proyecto recae en los propietarios y administradores de la empresa.

### Organigrama Funcional de Impresos Trujillo E.I.R.L.
- **Nivel Directivo / Gerencia General:**
  - *Angel Almilcar Rodríguez Evangelista:* Gerente / Jefe de Taller (toma de decisiones operativas y validación en planta).
  - *Marcell Magaly Vásquez Loje:* Gerente / Jefa de Oficina (toma de decisiones comerciales y financieras).
- **Nivel de Supervisión y Coordinación:**
  - *Manuel:* Subgerente Operativo (gestiona de manera transversal las actividades de oficina y taller).
- **Nivel Operativo de Oficina:**
  - *Ashlee:* Diseñadora Gráfica (elaboración, revisión y aprobación de artes publicitarios con clientes).
- **Nivel Operativo de Taller:**
  - *Marilú:* Secretaria de Taller (atención de pedidos en mostrador y registro de proformas).
  - *Aldair, Alexis y Gabriel:* Operarios de Producción e Impresión (operación de plotters de gigantografía, prensas y acabados en ambas áreas).

### Mecanismos de Comunicación y Rendición de Cuentas:
- **Reuniones quincenales presenciales de revisión de Sprint (Sprint Review):** Presentación de incrementos de software funcionales directamente en las terminales de trabajo de Jr. Simón Bolívar 945.
- **Actas de Acuerdo y Aceptación:** Documentación formal con firma de gerencia para validar el cumplimiento de cada hito y entregable de fase.
- **Canal oficial de coordinación técnica (WhatsApp y Correo Institucional):** Comunicación inmediata para la atención de consultas sobre datos y pruebas operativas.
- **Gestión transparente en Repositorio GitHub:** Registro continuo de código fuente, historias de usuario, tablero de tareas y control de versiones auditables.

---

## Gerencia del Proyecto (Sistema MultiRol del Equipo Capstone)

El equipo de desarrollo opera bajo el marco de trabajo ágil **Scrum con un esquema MultiRol estructurado**. Al tratarse de un equipo de tres profesionales de ingeniería, cada integrante asume responsabilidades multifuncionales a lo largo del ciclo de vida del software:

| Integrante | Rol Principal | Roles Asignados en el Proyecto (MultiRol) |
| :--- | :--- | :--- |
| **Gerardo Erick Plasencia Torres** | Líder de Proyecto / Full Stack | - Project Manager / Coordinador General con el Cliente<br>- Scrum Master (facilitador de ceremonias ágiles)<br>- Arquitecto de Software y Sistemas<br>- Desarrollador Full Stack (Integración Core Backend-Frontend)<br>- Ingeniero DevOps y Cloud (Docker, CI/CD y Cloud Run) |
| **Jose Estibb Anhuaman Delgado** | Desarrollador Frontend | - Desarrollador Frontend Lead (Angular 21 SPA)<br>- Diseñador UI/UX y Prototipado de Interfaces<br>- Ingeniero de Calidad / QA Tester Funcional (Pruebas de Usabilidad, UI y Aceptación)<br>- Analista de Requerimientos y Procesos de Negocio |
| **Jose Diego Rodriguez Vasquez** | Desarrollador Backend / IA | - Desarrollador Backend Lead (FastAPI / Python 3.11)<br>- Ingeniero de Datos e Inteligencia Artificial (Scikit-learn / Prophet)<br>- Administrador de Base de Datos (DBA PostgreSQL)<br>- Ingeniero de Calidad / QA Tester de Rendimiento, Seguridad e Integración de APIs |

*Todos los integrantes participan conjuntamente en el levantamiento de información en taller, las sesiones de pruebas de campo, la capacitación de los operarios de la empresa y la redacción del informe final y artículo científico.*

---

## Control de Cambios

Cualquier propuesta de modificación que altere el alcance, los costos o los plazos pactados se someterá a un procedimiento formal de Control de Cambios:
1. **Emisión de Solicitud de Cambio (RFC):** Identificación del requerimiento emergente, justificación técnica y origen de la solicitud.
2. **Evaluación de Impacto:** Análisis conjunto por el equipo de proyecto para determinar el impacto en la arquitectura, el esfuerzo en horas y el cronograma de sprints.
3. **Aprobación Formal:** Para ser implementado, el cambio deberá contar con el visto bueno del Líder de Proyecto y la confirmación expresa de la Gerencia de la empresa.
4. **Registro y Trazabilidad:** Todo cambio aprobado se registrará en la Matriz de Trazabilidad, se actualizarán los documentos correspondientes y se versionará mediante Pull Requests auditados en GitHub.

---

## Aprobado por:

| Por la Empresa (Cliente) | Por el Equipo de Proyecto |
| :--- | :--- |
| **Angel Almilcar Rodríguez Evangelista**<br>Gerente / Jefe de Taller<br>Impresos Trujillo E.I.R.L. | **Gerardo Erick Plasencia Torres**<br>Líder del Proyecto Capstone<br>Universidad Privada del Norte |
| **Marcell Magaly Vásquez Loje**<br>Gerente / Jefa de Oficina<br>Impresos Trujillo E.I.R.L. | |
