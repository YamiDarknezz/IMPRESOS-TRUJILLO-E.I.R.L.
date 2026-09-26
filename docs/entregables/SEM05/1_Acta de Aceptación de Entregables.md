# ACTA DE ACEPTACIÓN DE ENTREGABLES

**Proyecto:** Implementación de un sistema web transaccional con módulos de inteligencia de negocios e inteligencia artificial para la optimización de los procesos operativos en la empresa Impresos Trujillo E.I.R.L.  
**Fecha de Emisión / Entrega:** 26/09/2026 | **Versión:** 1.0  
**Líder de Proyecto:** Gerardo Erick Plasencia Torres  
**Cliente / Beneficiario:** Impresos Trujillo E.I.R.L.  

---

## Control de Versiones

| Versión | Estado | Elaborada por | Aprobada por | Fecha (dd/mm/aaaa) |
|:---:|:---:|:---|:---|:---:|
| **1.0** | **Revisión** *(Lista para firma en reunión técnica)* | Gerardo Plasencia Torres | Marcell Magaly Vásquez Loje | 26/09/2026 |

---

## 1. Información General

| Campo | Detalle Institucional y Operativo |
|:---|:---|
| **Cliente:** | Impresos Trujillo E.I.R.L. — Marcell Magaly Vásquez Loje (Gerente de Administración / Product Owner) |
| **Nombre de la fase:** | Fases I, II y III: Inicio, Planificación, Requisitos, Arquitectura y Primer Incremento de Software (Semanas 1 a 5) |
| **Nombre del entregable:** | **Paquete Consolidado de Entregables de Línea Base y Primer Incremento de Software Funcional** |
| **Responsable de la ejecución:** | Gerardo Erick Plasencia Torres (Líder de Proyecto / Full Stack) — En representación del Equipo Scrum UPN |
| **Inicio de la ejecución:** | 22/08/2026 *(Conforme a cronograma oficial EDT)* |
| **Término de la ejecución:** | 25/09/2026 *(Cierre de ciclo técnico previo a reunión formal)* |
| **Cantidad de días de ejecución:** | **35 días calendario** *(25 días hábiles de desarrollo e ingeniería)* |
| **Cantidad de horas de ejecución:** | **220 horas hombre** *(Horas de desarrollo, modelado, arquitectura y pruebas acumuladas por el equipo)* |
| **Fecha de la reunión de aceptación:** | **26/09/2026** *(Reunión técnica presencial post-sesión de clase con la gerencia de la empresa)* |

---

## 2. Descripción del Entregable

El presente entregable formal consolida la entrega técnica e institucional de la línea base aprobada y el primer incremento operativo de software para la empresa **Impresos Trujillo E.I.R.L.**, cubriendo el período comprendido entre la Semana 1 y la Semana 5 del cronograma oficial del proyecto. El paquete comprende los siguientes componentes tangibles verificables:

### 2.1 Documentación de Ingeniería y Gestión de Proyecto (Línea Base Subsanada y Aprobada)
- **Acta de Constitución del Proyecto y Caso de Negocio (Business Case):** Formalización de objetivos estratégicos, análisis de viabilidad financiera (VAN = S/ 6,240.00, TIR = 42.5%, Payback = 1.4 meses) y alineamiento con la problemática de descontrol de mermas y cobranzas.
- **Especificación de Requerimientos de Software (SRS bajo estándar IEEE 830):** Levantamiento riguroso de requerimientos funcionales y reglas de negocio críticas (RN-01 a RN-04).
- **Planificación Estructurada del Proyecto:** Estructura de Desglose del Trabajo (EDT/WBS), Cronograma y Presupuesto base valorizado en S/ 5,100.00.
- **Matrices de Gestión del Proyecto:** Matriz de Riesgos (evaluación de severidad y planes de contingencia con 10%), Matriz de Comunicaciones y Matriz de Asignación de Responsabilidades (RACI).
- **Diseño UI y Agile Product Backlog:** Prototipos de interfaz de alta fidelidad y Product Backlog formalizado con 10 Historias de Usuario priorizadas bajo MoSCoW, criterios de aceptación en formato Gherkin y Definition of Done (DoD).
- **Monitoreo Ágil Periódico:** Informes de Estado del Proyecto (Semana 4 y 5) y Tableros Scrum Diarios de ejecución con seguimiento de avance y resolución de impedimentos.

### 2.2 Infraestructura y Arquitectura Tecnológica Contenerizada
- **Entorno Local Contenerizado:** Configuración integral con Docker Compose, orquestando servicios desacoplados para Angular 21 (Frontend), FastAPI (Backend REST) y PostgreSQL nativo (Base de datos relacional).
- **Esquema Relacional de Base de Datos:** Modelado y scripts de migración DDL con Alembic para tablas de usuarios, roles, permisos RBAC, catálogo de materiales, piezas de lote y consumos de taller.
- **Control de Versiones y Repositorio:** Gestión en GitHub con flujo de ramas estructurado (`main`, `develop`, `feature/*`), asegurando trazabilidad de cambios y calidad de código.

### 2.3 Módulos de Software Transaccionales y de Control Operativo (Incremento Funcional)
- **Módulo de Autenticación y Seguridad:** Inicio de sesión reactivo con tokens criptográficos JWT, hashing seguro de contraseñas con bcrypt y protección de navegación con Angular AuthGuards (RBAC).
- **Catálogo de Materiales y Recetas Métricas:** Parametrización de insumos de imprenta y gigantografía (vinilos, lonas, tintas, sustratos rígidos) con cálculo de área neta en metros cuadrados (m²) y costos técnicos.
- **Control Avanzado de Bobinas y Planchas Rígidas:** Seguimiento individual de rollos continuos (UV DTF Film A+B 100m, lona frontlit, vinil) y planchas (MDF 2.44x1.22m, acrílico, celtex), registrando cortes por orden de trabajo, mermas reales, recaudación acumulada y ganancia neta.
- **Módulo de Ventas y Mostrador Express:** Cotizador dinámico con anticipo obligatorio del 50%, talonario comercial digital con numeración secuencial correlativa y botón de Venta Rápida de mostrador en 1 clic para artículos menores (fotochecks, impresiones rápidas).
- **Auditoría y Arqueo de Caja con Candado Digital:** Candado digital inviolable que inhabilita físicamente el botón de entrega si existe saldo pendiente; auditoría de cierre de caja con opción de observar/anular transacciones fraudulentas o erróneas ("Yape falso", billete falso), deduciendo el arqueo y reabriendo el bloqueo de despacho.

### 2.4 Evidencia de Calidad y Verificación Técnica
- **Batería Integral de Pruebas Automatizadas:** 374 pruebas automatizadas con 100% de éxito (0 fallos), distribuidas en 93 pruebas unitarias y de integración en backend con pytest/FastAPI y 281 pruebas unitarias en frontend con Vitest y Angular 21 (servicios, componentes y guards).
- **Pipeline CI/CD Automatizado:** Workflows en GitHub Actions ejecutando compilación limpia y ejecución de pruebas en cada Pull Request.
- **Demostración Funcional en Vivo:** Demostración sobre software funcionando en entorno local contenerizado con Docker Compose y respaldo en VPS propio.

---

## 3. Observaciones Adicionales

Durante la revisión técnica del sistema y las sesiones de coordinación con la gerencia de Impresos Trujillo E.I.R.L., se registraron las siguientes observaciones, acuerdos operativos y requerimientos complementarios para las siguientes iteraciones:

1. **Resalte visual de saldos pendientes en interfaz:**  
   La contraparte solicita que en el listado general de órdenes se incorporen alertas cromáticas de alto contraste (rojo/amarillo) para identificar de forma inmediata qué pedidos tienen saldos por cobrar, evitando depender de consultas informales por mensajería externa (WhatsApp).
2. **Trazabilidad del canal de origen de venta:**  
   Se acordó añadir en el formulario de ventas la selección del medio por el cual ingresó el pedido (Mostrador presencial, WhatsApp institucional o Llamada telefónica), facilitando la identificación de la persona que pactó la orden.
3. **Ubicación física en estantes de taller:**  
   Para agilizar el retiro de materiales, se corroboró la pertinencia de mantener visible en inventario la ubicación física (estante / zona de taller) de bobinas y planchas para el personal de producción.
4. **Manejo de cuentas corporativas a crédito:**  
   Para el siguiente ciclo de cobranzas, se solicita contemplar una regla de excepción documentada que permita la entrega de productos a clientes corporativos con crédito preaprobado, emitiendo comprobante fiscal con saldo por liquidar según ciclo de facturación.
5. **Conformidad general preliminar:**  
   El cliente manifiesta su conformidad con los avances presentados, destacando la utilidad del candado digital de cobro y el control de ganancias netas por cada rollo de material UV DTF y lona.

---

## 4. Declaración de la Aceptación Formal

Mediante este documento se deja constancia formal que el entregable **Paquete Consolidado de Entregables de Línea Base y Primer Incremento de Software Funcional** ejecutado por el líder de proyecto **Gerardo Erick Plasencia Torres** (en representación del Equipo de Desarrollo Scrum UPN: Gerardo Plasencia, Jose Estibb Anhuaman y Jose Diego Rodríguez) ha sido presentado, revisado técnicamente y aceptado por **Marcell Magaly Vásquez Loje** (Gerente de Administración / Product Owner de Impresos Trujillo E.I.R.L.), de este modo queda constancia que se da por formalmente recibido y aceptado el entregable a entera satisfacción de la empresa.

---

## 5. Firmas de Aceptación del Entregable (En Caso de Aprobación)

| Nombre | Cargo Institucional | Fecha | Firma de Conformidad |
|:---|:---|:---:|:---:|
| **Marcell Magaly Vásquez Loje** | Gerente de Administración / Product Owner<br>Impresos Trujillo E.I.R.L. | 26/09/2026 | <br><br>____________________________________<br>Firma del Representante del Cliente |
| **Gerardo Erick Plasencia Torres** | Líder de Proyecto / Scrum Master<br>Equipo Scrum Capstone UPN | 26/09/2026 | <br><br>____________________________________<br>Firma de Entrega del Proyecto |

---

## 6. En Caso de Rechazo: Firma de Rechazo del Entregable

| Nombre | Cargo | Fecha | Motivo del Rechazo | Medida Correctiva Sugerida | Firma |
|:---:|:---:|:---:|:---:|:---:|:---:|
| — | — | — | *Sin observaciones que motiven rechazo formal* | — | — |
