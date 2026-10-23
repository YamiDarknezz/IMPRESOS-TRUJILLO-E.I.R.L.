# ACTA DE CONSTITUCIÓN DEL PROYECTO
## Universidad Privada del Norte — Ciclo 2026-II
### Curso: Proyecto Capstone (Aula: 22643421416 | Grupo 2)

---

## TABLA 1: ACTA DE CONSTITUCIÓN DEL PROYECTO

| Campo | Detalle |
|:---|:---|
| **Proyecto:** | Implementación de un sistema web transaccional con módulos de inteligencia de negocios e inteligencia artificial para la optimización de los procesos operativos y financieros en Impresos Trujillo E.I.R.L. |
| **Código:** | Grupo 2 (Aula: 22643421416) |
| **Fecha:** | 22 de agosto de 2026 |

---

### Racionalidad y Propósito del Proyecto:

**La razón de ser del proyecto, es decir, lo que el proyecto pretende cumplir y el problema que debe resolver:**

Impresos Trujillo E.I.R.L. (RUC 20602572952) es una empresa trujillana del rubro gráfico y publicitario cuya operación cotidiana se gestiona íntegramente mediante soportes físicos de papel (talonarios comerciales de Contrato/Proforma y cuadernos de anotación manual). Este esquema manual ha originado una degradación crítica en sus procesos clave:

1. **Retardo en atención y emisión:** El registro manual de un pedido en talonario físico promedia 18.5 minutos por cliente, generando congestión en el mostrador comercial y demoras en el pase a taller.
2. **Extravío y descontrol de órdenes:** Se registra una tasa promedio del 14.3% de órdenes de trabajo físicas extraviadas, traspapeladas o deterioradas entre la oficina comercial y las máquinas de taller, lo que ocasiona reprocesos y quejas reiteradas.
3. **Fugas de ingresos y pérdidas por pedidos no liquidados:** Al no existir un candado de control entre la entrega del producto terminado y la caja, un 11.2% de los pedidos son despachados con saldos pendientes impagos que nunca llegan a conciliarse, provocando descalces en la recaudación diaria.
4. **Desabastecimiento y paros de producción:** El control de insumos críticos (rollos de lona banner de 13 oz, viniles adhesivos y papel autocopiativo) se realiza de forma visual, registrándose hasta 3 días hábiles de paro productivo al mes por quiebres imprevistos de stock.
5. **Ceguera analítica gerencial:** La consolidación de cuentas y arqueo de caja toma más de 4 horas semanales, impidiendo conocer con certeza el margen de rentabilidad por producto y la productividad por operario.

**Propósito:**
Implementar un sistema web transaccional con módulos de Business Intelligence (BI) y un modelo predictivo de Inteligencia Artificial (IA) que digitalice el flujo integral de pedidos, asegure el cobro efectivo previo a la entrega, automatice el descuento de insumos por receta y provea métricas estratégicas para la toma de decisiones gerenciales.

---

### Objetivos del Proyecto:

**Una breve descripción de los objetivos del proyecto y del impacto esperado:**

#### OBJETIVO GENERAL:
Implementar un sistema web transaccional con módulos de inteligencia de negocios e inteligencia artificial para la optimización de los procesos operativos y financieros en Impresos Trujillo E.I.R.L.

#### OBJETIVOS ESPECÍFICOS:
1. **OE1 (Transaccional - Emisión):** Digitalizar el registro y seguimiento de órdenes de trabajo mediante un módulo transaccional para reducir el tiempo promedio de emisión de pedidos a menos de 5 minutos por cliente.
2. **OE2 (Transaccional - Cobros y Caja):** Controlar la recaudación y liquidación de pagos mediante un módulo de caja con candado digital para eliminar las entregas de productos con saldos pendientes impagos (reducir a 0%).
3. **OE3 (Transaccional - Inventario):** Gestionar el consumo y disponibilidad de insumos de imprenta mediante reglas de descuento automatizadas para prevenir roturas de stock en el taller de producción.
4. **OE4 (Inteligencia de Negocios):** Analizar la productividad operativa y la rentabilidad comercial mediante cuadros de mando e informes de Business Intelligence para optimizar la toma de decisiones gerenciales.
5. **OE5 (Inteligencia Artificial):** Predecir la demanda de insumos críticos de imprenta mediante un modelo de aprendizaje automático para optimizar la planificación mensual de compras.

---

### Estrategia del Proyecto:

**Breve descripción del modelo de intervención. Alcance (productos más importantes y entregables) y límites del alcance (lo que no producirá el proyecto). Cronograma (FASES) resumido de hitos. Presupuesto resumido (DIVIDIDO ENTRE CATEGORÍAS). Riesgos, supuestos y restricciones de alto nivel:**

#### 1. Modelo de Intervención:
El proyecto se ejecuta bajo el marco de trabajo ágil **Scrum** con un esquema **MultiRol** de tres ingenieros. La solución técnica implementa una arquitectura web desacoplada:
- **Frontend SPA:** Angular 21 (TypeScript, arquitectura standalone, maquetación directa en código).
- **Backend API:** FastAPI (Python 3.11, arquitectura modular asíncrona, Pydantic v2).
- **Base de Datos:** PostgreSQL nativo alojado en contenedor Docker.
- **Analítica e IA:** Scikit-learn y Prophet integrados en servicios backend.
- **Infraestructura:** Servidor VPS particular propio bajo Linux Ubuntu 24.04 con Docker Compose y pipeline de integración continua (CI/CD) en GitHub Actions.

#### 2. Alcance (Productos más importantes y entregables):

**Módulos del Sistema Web:**
1. **Módulo Transaccional:** Catálogo de productos y recetas de insumos; emisión digital de órdenes de trabajo (talonario virtual tipo Contrato/Proforma con N° correlativo); control de estados de orden (Pendiente, En Taller, Terminado, Entregado); módulo de caja con registro de pagos (efectivo, Yape, transferencias) y candado digital de despacho; arqueo diario segregado (Imprenta vs Gigantografías).
2. **Módulo de Business Intelligence (BI):** Dashboards gerenciales interactivos (ventas por período, saldos por cobrar, insumos más consumidos, rendimiento por operario) con exportación nativa a Microsoft Excel 2021 (.xlsx).
3. **Módulo de Inteligencia Artificial (IA):** Modelo predictivo de consumo mensual de materiales críticos (lona 13 oz, vinil adhesivo, papel autocopiativo) y detección de anomalías en mermas de material.

**Documentos Entregables del Proyecto:**
- Acta de Constitución del Proyecto (SEM01).
- Caso de Negocio / Business Case (SEM01).
- Especificación de Requerimientos de Software IEEE 830 (SEM01).
- Estructura de Desglose de Trabajo (EDT) y Cronograma Gantt (SEM02).
- Matriz de Consistencia y Estructura de Análisis (SEM02).
- Plan de Desarrollo de Software y Matrices de Gestión (SEM03).
- Informes Periódicos de Estado del Proyecto (v1.0 a v7.0) con métricas de valor ganado.
- Carpeta Consolidada de Prácticas de Campo (evidencias técnicas, fotos in situ, actas de visita).
- Informe Experimental de Resultados Pretest y Postest Operativo.
- Manual de Usuario, Manual de Despliegue en Docker y Paper Científico de Investigación Final.

#### 3. Límites del Alcance (Lo que NO producirá el proyecto):
1. **NO emisión de facturación electrónica directa con la API de SUNAT.** La empresa emite comprobantes formales en el Portal SUNAT Clave SOL. El sistema genera órdenes y comprobantes de control interno informativo.
2. **NO aplicaciones móviles nativas para Android o iOS.** El acceso se realiza como aplicación web responsive desde navegadores móviles o de escritorio.
3. **NO pasarela de pagos automatizada con cobro en línea.** La verificación de transferencias o billeteras digitales se realiza mediante registro manual asistido de capturas.
4. **NO módulos de recursos humanos, control biométrico de personal ni cálculo de planillas salariales (SUNAFIL).**
5. **NO gestión de transferencias bancarias directas ni órdenes de pago automáticas a proveedores externos.**

#### 4. Cronograma Resumido de Fases e Hitos:

| Fase | Período Estimado | Hito / Entregable Principal |
|:---|:---|:---|
| **Fase I: Inicio y Delimitación** | 22/08/2026 – 28/08/2026 | Acta de Constitución, Business Case y Requerimientos IEEE 830 aprobados. |
| **Fase II: Planificación y Diseño** | 29/08/2026 – 11/09/2026 | EDT, Cronograma, Matriz de Consistencia, Plan de Desarrollo y Arquitectura Docker. |
| **Fase III: Construcción Transaccional** | 12/09/2026 – 25/09/2026 | Módulo Transaccional, Candado Digital de Caja e Informe de Estado T1 (30% avance). |
| **Fase IV: Módulos BI e IA** | 26/09/2026 – 23/10/2026 | Dashboards BI, Modelo Predictivo IA y 70% de software operativo (T2). |
| **Fase V: Implantación y Cierre** | 24/10/2026 – 11/12/2026 | 100% Software desplegado en VPS, Postest operativo, RSU y Sustentación Final. |

#### 5. Presupuesto Resumido por Categorías:

| Categoría | Ítem / Concepto | Costo (S/) |
|:---|:---|:---|
| **Recursos Humanos** | Honorarios valorizados del equipo de desarrollo (3 ingenieros x 16 semanas - formativo) | S/ 4,800.00 (Valorizado) |
| **Infraestructura Reutilizada** | 6 estaciones de trabajo de oficina/taller + Conexión a Internet 200 Mbps (propiedad de la empresa) | S/ 0.00 (Reutilizado) |
| **Servicios Tecnológicos** | Servidor VPS Linux propio, contenedor Docker y dominio web (.com / DNS) | S/ 180.00 (Efectivo) |
| **Consumibles y Operativos** | Material de papelería, actas, transcripción de boletas y traslados de visita técnica en Trujillo | S/ 120.00 (Efectivo) |
| **TOTAL PRESUPUESTO EN EFECTIVO** | **Monto neto financiado por el equipo de proyecto** | **S/ 300.00** |
| **TOTAL INVERSIÓN VALORIZADA** | **Valor total integral del proyecto Capstone** | **S/ 5,100.00** |

*Nota de Costos:* La infraestructura de cómputo y red existente en la empresa se reutiliza íntegramente a costo de adquisición cero.

#### 6. Riesgos, Supuestos y Restricciones de Alto Nivel:

**Suposiciones:**
1. La empresa garantizará el acceso continuo a los registros históricos de órdenes de trabajo físicas, talonarios comerciales y archivos Excel para el levantamiento de la línea base operativa.
2. La gerencia y el personal clave dispondrán de un mínimo de 2 horas semanales para reuniones de coordinación técnica, validación de incrementos y pruebas en taller.
3. Las 6 computadoras registradas en oficina y taller (sistemas Windows 10 y Windows 11) y el enlace de internet de 200 Mbps se mantendrán operativos y disponibles durante el proyecto.
4. Las recetas y reglas de consumo de insumos definidas con el Jefe de Taller se mantendrán estables durante el período experimental.

**Restricciones:**
1. **Plazo Estricto de Entrega:** El sistema debe encontrarse 100% operativo e implantado en la empresa en la semana 11 del ciclo académico para la ejecución del postest y emisión del informe empresarial.
2. **Arquitectura Web Ligera:** El sistema debe operar exclusivamente mediante navegadores web modernos (Google Chrome y Microsoft Edge), sin requerir instalación de software cliente en las máquinas del cliente.
3. **Compatibilidad Ofimática:** Todo reporte y tabla exportable debe ser nativamente compatible con Microsoft Excel 2021 LTSC (.xlsx).
4. **Límite Presupuestario Universitario:** El gasto en efectivo autofinanciado para el despliegue del proyecto no superará los S/ 300.00.

**Riesgos de Alto Nivel (Riesgos Operacionales y de Negocio — Sin culpas del equipo):**

| Riesgo | Prob. | Impacto | Acciones de Mitigación |
|:---|:---:|:---:|:---|
| **R1: Cortes imprevistos en la red eléctrica en la zona comercial de Trujillo.** | Media | Alto | Configuración de auto-guardado en clientes web y persistencia inmediata en base de datos PostgreSQL respaldada. |
| **R2: Resistencia del personal operativo de taller al reemplazo de talonarios físicos.** | Alta | Medio | Programa de inducción personalizada in situ y diseño de interfaces que replican el diseño visual del talonario comercial físico. |
| **R3: Caída temporal del servicio de internet en la sede de la imprenta.** | Baja | Medio | Arquitectura SPA resiliente en Angular con almacenamiento local de formularios y reconexión automática a la API. |
| **R4: Sobrecarga comercial de la empresa que retrase sesiones de validación.** | Media | Medio | Coordinación de reuniones breves de validación (Sprint Review) en horarios de baja afluencia de clientes. |

---

### Estructura de Gobernabilidad:

**Definir la estructura del proceso de toma de decisiones y de supervisión:**

Impresos Trujillo E.I.R.L. no dispone de un departamento formal de tecnologías de información. La máxima instancia de gobernabilidad y decisión recae en la Gerencia General de la empresa.

#### Organigrama Funcional de Impresos Trujillo E.I.R.L.:
- **Gerencia General:** Marcell Magaly Vásquez Loje / Angel Almilcar Rodríguez Evangelista
  - **Área de Administración y Oficina (Comercial / Cobranzas):** Marcell Magaly Vásquez Loje (Jefa de Oficina)
    - Atención en Mostrador y Facturación
  - **Área de Producción y Taller (Operaciones Gráficas):** Angel Almilcar Rodríguez Evangelista (Jefe de Taller)
    - Estación de Diseño Gráfico y Preprensa: 1 Diseñador
    - Estación de Impresión Gran Formato (Plotters Wit-Color): 1 Operario
    - Estación de Acabados, Rotulación y Despacho: 1 Operario

#### Mecanismos de Comunicación y Rendición de Cuentas:
1. **Reuniones Quincenales de Revisión (Sprint Review):** Demostración presencial de incrementos funcionales de software en el taller de la imprenta ante la Gerencia.
2. **Actas de Aceptación de Entregables (AAE):** Formalización de conformidad suscrita por el Líder del Proyecto y la Gerencia de la empresa.
3. **Canal Oficial de Coordinación:** Grupo de WhatsApp Business y correo institucional para soporte continuo y resolución de dudas operativas.
4. **Repositorio Centralizado en GitHub:** Registro de commits, ramas y pull requests para auditoría de código fuente y control de versiones.

---

### Gerencia del Proyecto:

**Organigrama del proyecto que incluya a la Junta Directiva, al Gerente del proyecto y al equipo (Esquema MultiRol):**

El equipo opera bajo el marco ágil Scrum aplicando un esquema **MultiRol** equilibrado:

| Integrante | Rol Principal | Roles Asignados en el Proyecto (MultiRol) |
|:---|:---|:---|
| **Gerardo Erick Plasencia Torres** | Líder de Proyecto / Scrum Master | Arquitecto de Software / Desarrollador Full Stack / DevOps CI-CD |
| **Jose Estibb Anhuaman Delgado** | Desarrollador Frontend | Analista de Requerimientos UI-UX / Tester QA / Documentador |
| **Jose Diego Rodriguez Vasquez** | Desarrollador Backend & IA | Administrador de Base de Datos (DBA) / Ingeniero de Datos / Analista BI |

*Participación del Docente:* El Ing. Jose Alberto Gomez Avila actúa exclusivamente como **Asesor Académico Externo y Docente Calificador de la Universidad**, sin facultades ejecutivas dentro del equipo ni del gobierno de la empresa.

---

### Control de Cambios:

**Describir los mecanismos de seguimiento y control de cambios significativos al proyecto:**

Cualquier solicitud de modificación sobre el alcance, plazos o costos pactados se regirá por el siguiente protocolo formal:
1. **Solicitud de Cambio (RFC):** Registro formal que detalla el requerimiento propuesto, su justificación operativa y el impacto anticipado.
2. **Evaluación de Factibilidad Técnica:** El equipo evalúa en un plazo máximo de 48 horas el esfuerzo en horas-hombre, la arquitectura afectada y el impacto en el cronograma.
3. **Aprobación de la Gerencia:** El cambio requiere la autorización expresa del Líder del Proyecto y la ratificación del Gerente de la empresa.
4. **Trazabilidad y Versionamiento:** Aprobado el cambio, se registra en el Product Backlog y se despliega mediante ramas de características (*feature branches*) en Git.

---

## TABLA 2: APROBACIONES FORMALES

| Aprobado por: |
|:---|
| **Por la empresa cliente (Impresos Trujillo E.I.R.L.):**<br>• **Angel Almilcar Rodríguez Evangelista** — Gerente / Jefe de Taller<br>• **Marcell Magaly Vásquez Loje** — Gerente / Jefa de Oficina<br><br>**Por el equipo de desarrollo (Universidad Privada del Norte):**<br>• **Gerardo Erick Plasencia Torres** — Líder del Proyecto Capstone<br><br>*Sede de Validación:* Jr. Simón Bolívar 945 Int. 1, Centro Cívico, Trujillo, La Libertad. |
