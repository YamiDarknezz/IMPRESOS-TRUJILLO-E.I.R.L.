# AGILE PRODUCT BACKLOG Y ESPECIFICACIÓN DEL SPRINT 1
## Universidad Privada del Norte — Ciclo 2026-II
### Curso: Proyecto Capstone (Aula: 22643421416 | Grupo 2)
### Proyecto: Implementación de un sistema web transaccional con módulos de inteligencia de negocios e inteligencia artificial para la optimización de los procesos operativos y financieros en Impresos Trujillo E.I.R.L.

---

### Metadatos Oficiales del Documento
* **Empresa Beneficiaria:** Impresos Trujillo E.I.R.L.
* **RUC:** 20602572952
* **Dirección Fiscal y Taller:** Jr. Simón Bolívar 945, Int. 1, Centro Histórico de Trujillo, La Libertad, Perú
* **Fecha de Emisión:** 19 de Septiembre de 2026
* **Versión:** 1.0 (Línea Base Oficial del Backlog)
* **Plantilla Base:** `SCRUM_Agile-Product-Backlog.docx`

---

### Sponsor Acceptance / Aprobación del Patrocinador

El presente documento formaliza el Product Backlog consensuado entre el equipo de desarrollo de la Universidad Privada del Norte y la dirección de la empresa Impresos Trujillo E.I.R.L., aprobando la priorización de historias de usuario, estimaciones de esfuerzo y criterios de aceptación.

| Por el Product Owner / Sponsor Empresarial | Por el Equipo de Desarrollo (Scrum) |
|:---|:---|
| **Firma:** ________________________________________ | **Firma:** ________________________________________ |
| **Nombre:** Marcell Magaly Vásquez Loje | **Nombre:** Gerardo Erick Plasencia Torres |
| **Cargo:** Administradora General / Product Owner | **Cargo:** Líder de Proyecto / Full Stack Developer |
| **Empresa:** Impresos Trujillo E.I.R.L. | **Equipo:** Grupo 2 — Proyecto Capstone UPN |
| **Fecha:** 19/09/2026 | **Fecha:** 19/09/2026 |

---

### 1. Resumen del Enfoque Ágil y Metodología Scrum

El desarrollo del sistema web se estructura bajo el marco de trabajo Scrum adaptado a proyectos de ingeniería de software con rigor académico y validación experimental pretest-postest:
* **Product Owner Empresarial:** Conducido por Marcell Magaly Vásquez Loje (Administradora de la imprenta), quien valida que cada incremento funcional responda directamente a las necesidades del taller y mostrador.
* **Ciclos de Sprint:** 4 Sprints quincenales orientados a entregables funcionales incrementales.
* **Estimación en Story Points (SP):** Se emplea la escala de Fibonacci (1, 2, 3, 5, 8, 13) basada en complejidad técnica, volumen de trabajo e incertidumbre.
* **Priorización MoSCoW:** Clasificación estricta en *Must Have* (indispensables para operación básica), *Should Have* (críticos para optimización y analítica) y *Could Have* (mejoras operativas complementarias).
* **Velocidad y Capacidad Global:** El Product Backlog totaliza **65 Story Points (SP)** distribuidos en 10 Historias de Usuario principales.

---

### 2. Tabla Maestra del Product Backlog Oficial
*(Fiel reflejo de la Tabla Oficial de la Plantilla de Cátedra)*

| Task ID | Story (Historia de Usuario) | Estimate (SP) | Priority (MoSCoW) |
|:---:|:---|:---:|:---:|
| **HU-01** | Como Administrador u Operador del sistema, quiero autenticarme mediante credenciales seguras y tener acceso restringido según mi rol (Administrador, Mostrador, Operario de Taller), para proteger la confidencialidad de la información y prevenir acciones no autorizadas. | **3 SP** | Must Have (1) |
| **HU-02** | Como Vendedora de mostrador o Administradora, quiero registrar y consultar clientes comerciales con autocompletado por RUC/DNI, para agilizar la atención en ventanilla y evitar duplicidad de registros. | **5 SP** | Must Have (2) |
| **HU-03** | Como Vendedora de mostrador, quiero emitir órdenes de trabajo bajo el formato virtual de contrato proforma con numeración correlativa única y cálculo automático de medidas (m²) e importes, para eliminar errores de cálculo manual y sustituir el talonario físico de papel. | **8 SP** | Must Have (3) |
| **HU-04** | Como Administradora o Cajera, quiero registrar pagos y anticipos vinculados a cada orden y contar con un candado digital que bloquee la entrega física del producto si existe saldo pendiente impago, para eliminar la fuga de ingresos y deudas incobrables. | **5 SP** | Must Have (4) |
| **HU-05** | Como Administradora, quiero ejecutar el arqueo de caja diario con segregación automática de ingresos entre Imprenta y Gigantografías y por medio de pago (Efectivo, Yape/Plin, Transferencia), para conciliar las cuentas en menos de 10 minutos y detectar inconsistencias. | **5 SP** | Must Have (5) |
| **HU-06** | Como Jefe de Producción u Operario de máquina, quiero visualizar en un tablero Kanban interactivo las órdenes en cola asignadas a máquinas específicas (Plotter Wit-Color, Offset, Guillotina), para organizar la carga de trabajo y reducir cuellos de botella en taller. | **8 SP** | Must Have (6) |
| **HU-07** | Como Operario de taller o Administradora, quiero registrar el consumo real de metros de lona/vinil y las mermas técnicas generadas por falla o ajuste, para sincerar el stock disponible y costear con precisión los trabajos ejecutados. | **5 SP** | Should Have (7) |
| **HU-08** | Como Vendedora de mostrador, quiero enviar notificaciones automáticas vía WhatsApp al cliente cuando su pedido pase a estado "Listo para Recojo", para descongestionar el taller y reducir los tiempos muertos de almacenamiento. | **5 SP** | Could Have (8) |
| **HU-09** | Como Gerente General, quiero visualizar tableros ejecutivos de Business Intelligence con ventas agregadas, márgenes por producto y tendencias por período, para tomar decisiones estratégicas de compra e inversión basadas en datos reales. | **8 SP** | Should Have (9) |
| **HU-10** | Como Administradora o Gerente General, quiero consultar recomendaciones predictivas de abastecimiento de insumos clave generadas por un modelo de Machine Learning, para evitar roturas de stock en temporadas de alta demanda y optimizar las compras a Lima. | **13 SP** | Should Have (10) |
| **TOTAL** | **Product Backlog Integral del Sistema Web (10 Historias de Usuario)** | **65 SP** | **100% Priorizado** |

---

### 3. Especificación Detallada de Historias de Usuario y Gráficas de Interfaces (UI/UX)

#### HU-01: Control de Acceso, Autenticación Segura y Roles de Usuario (RBAC)
* **Estimación:** 3 Story Points | **Prioridad:** Must Have | **Sprint Asignado:** Sprint 1
* **Formulación:** *Como Administrador u Operador del sistema, quiero ingresar al sistema web mediante correo institucional y contraseña encriptada, para acceder únicamente a las funciones autorizadas según mi perfil operativo (Administrador, Mostrador, Taller).*
* **Criterios de Aceptación (Given-When-Then):**
  - **Escenario 1 (Autenticación exitosa):** *Dado* que el usuario está en la pantalla `/login`, *cuando* ingresa su correo y contraseña válidos y presiona "Iniciar Sesión", *entonces* el sistema genera un token JWT firmado, almacena la sesión de forma segura y redirige al dashboard correspondiente a su rol.
  - **Escenario 2 (Credenciales inválidas):** *Dado* que el usuario ingresa una contraseña errónea, *cuando* presiona "Iniciar Sesión", *entonces* el sistema muestra una alerta visual en rojo: *"Credenciales incorrectas"* y no revela si el error fue de correo o clave.
  - **Escenario 3 (Control de rutas RBAC):** *Dado* que un operario de taller autenticado intenta acceder a la ruta `/caja` o `/reportes`, *cuando* ingresa la URL, *entonces* el guard de navegación de Angular bloquea el acceso y lo redirige a `/produccion` con una notificación de *"Acceso denegado"*.
* **Definition of Done (DoD):**
  - Endpoint REST `/api/v1/auth/login` implementado en FastAPI con hashing seguro `bcrypt`.
  - Tokens JWT con caducidad configurada (8 horas) y emisión de Refresh Token.
  - Formulario reactivo en Angular 21 con validación visual en tiempo real.
  - Pruebas unitarias de backend con pytest aprobadas con cobertura $\ge 80\%$.
* **Gráfica de Interfaz (Wireframe UI - Login):**
```text
+-----------------------------------------------------------------------+
|                       IMPRESOS TRUJILLO E.I.R.L.                      |
|                  Sistema de Gestión Operativa y Financiera            |
+-----------------------------------------------------------------------+
|                                                                       |
|                     +-----------------------------+                   |
|                     |        INICIAR SESIÓN       |                   |
|                     |                             |                   |
|                     |  Correo Electrónico:        |                   |
|                     |  [ admin@impresostrujillo.pe]                   |
|                     |                             |                   |
|                     |  Contraseña:                |                   |
|                     |  [ •••••••••••••• ] [O]     |                   |
|                     |                             |                   |
|                     |  Rol de Acceso:             |                   |
|                     |  [ Administrador       |v]  |                   |
|                     |                             |                   |
|                     |  [   INGRESAR AL SISTEMA  ] |                   |
|                     |                             |                   |
|                     |  Soporte: admin@upn.pe      |                   |
|                     +-----------------------------+                   |
|                                                                       |
+-----------------------------------------------------------------------+
```

---

#### HU-02: Gestión de Clientes Comerciales y Catálogo de Insumos
* **Estimación:** 5 Story Points | **Prioridad:** Must Have | **Sprint Asignado:** Sprint 1 (Base DB) / Sprint 2 (UI)
* **Formulación:** *Como Vendedora de mostrador, quiero buscar y registrar clientes mediante su RUC o DNI y seleccionar productos con sus medidas y sustratos asociados, para cotizar pedidos con rapidez y sin duplicar información.*
* **Criterios de Aceptación:**
  - **Escenario 1 (Búsqueda predictiva):** *Dado* que la vendedora digita 3 caracteres en el campo de cliente, *cuando* el sistema consulta la base de datos, *entonces* despliega un menú desplegable con coincidencias de RUC/DNI y Razón Social.
  - **Escenario 2 (Validación de RUC):** *Dado* que se ingresa un RUC de 11 dígitos, *cuando* se valida el formato numérico, *entonces* el sistema habilita el botón de guardado y bloquea entradas alfanuméricas.
* **Definition of Done (DoD):**
  - Tablas relacionales `clientes` y `productos` creadas en PostgreSQL con constraints de unicidad en documento.
  - Endpoints CRUD en FastAPI con filtrado por texto y paginación.

---

#### HU-03: Emisión de Órdenes de Trabajo con Talonario Virtual
* **Estimación:** 8 Story Points | **Prioridad:** Must Have | **Sprint Asignado:** Sprint 2
* **Formulación:** *Como Vendedora de mostrador, quiero registrar una orden de trabajo en un formulario que replique los campos de la boleta física (Medidas, Material, Acabados, A cuenta, Saldo), asignándole un correlativo único (ej. ORD-2026-00125), para agilizar la atención y garantizar la trazabilidad de los trabajos.*
* **Criterios de Aceptación:**
  - **Escenario 1 (Cálculo automático de m²):** *Dado* que la vendedora ingresa base $= 2.00$ m y altura $= 1.50$ m para una gigantografía en banner, *cuando* cambia de campo, *entonces* el sistema calcula automáticamente $3.00\text{ m}^2$ y multiplica por el precio unitario del sustrato.
  - **Escenario 2 (Asignación correlativa estricta):** *Dado* que se guarda la orden, *cuando* se confirma la transacción en la base de datos, *entonces* se genera el siguiente número correlativo sin saltos y se emite la orden en estado `Pendiente`.
* **Gráfica de Interfaz (Wireframe UI - Talonario Virtual):**
```text
+-----------------------------------------------------------------------+
| IMPRESOS TRUJILLO | Talonario Virtual de Órdenes | Orden: ORD-00125   |
+-----------------------------------------------------------------------+
| CLIENTE: [ 20601234567 - PUBLICIDAD NORTE S.A.C.           ] [+ Nuevo]|
| TELÉFONO: 948123456   | FECHA: 19/09/2026 | ENTREGA PROG: 21/09/2026   |
+-----------------------------------------------------------------------+
| ÍTEM | PRODUCTO / MATERIAL | BASE(m) | ALT(m) | CANT | P.UNIT | TOTAL |
|  1   | Gigantografía Lona  |  3.00   |  2.00  |   1  | S/15.00| S/90.00|
|  2   | Acabado: Ojillados  |   -     |   -    |   6  | S/ 1.00| S/ 6.00|
+-----------------------------------------------------------------------+
| INDICACIONES DE TALLER: [ Dejar 5 cm de demasía perimétrica         ] |
+-----------------------------------------------------------------------+
| MÁQUINA DESTINO: [ Plotter Wit-Color Ultra 1000  |v]                  |
| RESUMEN: Subtotal: S/ 96.00 | A Cuenta: [ S/ 50.00 ] | Saldo: S/ 46.00|
| [ ] Requerir Boleta / Factura (+IGV 18%)                              |
|                                                                       |
| [ CANCELAR ]                      [ IMPRIMIR ORDEN ] [ GUARDAR ORDEN ]|
+-----------------------------------------------------------------------+
```

---

#### HU-04: Candado Digital de Cobro y Validación Previa a Entrega
* **Estimación:** 5 Story Points | **Prioridad:** Must Have | **Sprint Asignado:** Sprint 2 / Sprint 3
* **Formulación:** *Como Administradora o Cajera, quiero que el sistema bloquee automáticamente el cambio de estado a "Entregado" si la orden presenta un saldo pendiente mayor a S/ 0.00, para evitar que trabajos terminados salgan del taller sin haber sido liquidados al 100%.*
* **Criterios de Aceptación:**
  - **Escenario 1 (Bloqueo de entrega por deuda):** *Dado* que una orden tiene un saldo pendiente de S/ 46.00, *cuando* el usuario intenta marcar el botón "Entregar Pedido", *entonces* el sistema desactiva la acción y abre un modal obligatorio de liquidación en caja: *"Orden con saldo pendiente de S/ 46.00. Registre el pago para liberar el pedido"*.
  - **Escenario 2 (Liberación con pago completo):** *Dado* que se registra el cobro de los S/ 46.00 mediante Yape con número de operación, *cuando* el saldo llega a S/ 0.00, *entonces* el sistema desbloquea inmediatamente el botón y cambia el estado a `Entregado`.
* **Gráfica de Interfaz (Wireframe UI - Candado Digital de Entrega):**
```text
+-----------------------------------------------------------------------+
|                   LIQUIDACIÓN Y CANDADO DIGITAL DE ENTREGA            |
+-----------------------------------------------------------------------+
| ORDEN N°: ORD-00125  | CLIENTE: PUBLICIDAD NORTE S.A.C.               |
| MONTO TOTAL: S/ 96.00 | ANTICIPO PAGADO: S/ 50.00                     |
|                                                                       |
| >>> SALDO PENDIENTE POR COBRAR: S/ 46.00 <<<                          |
|                                                                       |
| [!] CANDADO DIGITAL ACTIVO: NO SE PERMITE LA ENTREGA FÍSICA           |
|                                                                       |
| Registrar Cobro de Liquidación:                                       |
| Medio de Pago: [ Yape / Plin              |v]                         |
| N° Operación:  [ 49201948               ]                             |
| Monto a Cobrar:[ 46.00                  ]                             |
|                                                                       |
| [ REGISTRAR PAGO Y LIBERAR ENTREGA ]             [ CERRAR VENTANA ]   |
+-----------------------------------------------------------------------+
```

---

#### HU-05: Control de Caja Diario y Arqueo Dual Segregado
* **Estimación:** 5 Story Points | **Prioridad:** Must Have | **Sprint Asignado:** Sprint 3
* **Formulación:** *Como Administradora, quiero consultar el arqueo diario consolidando cobros en efectivo y billeteras digitales con segregación de ingresos entre Imprenta y Gigantografías, para cuadrar la caja en menos de 10 minutos al cierre de jornada.*
* **Criterios de Aceptación:**
  - **Escenario 1 (Segregación de ingresos):** *Dado* el cierre de turno, *cuando* se genera el arqueo, *entonces* el sistema desglosa los montos recaudados en: Total Efectivo, Total Yape/Plin, Total Transferencia, separando los subtotales de la línea de Imprenta Offset y la línea de Gigantografías.

---

#### HU-06: Asignación de Órdenes y Tablero de Producción de Taller
* **Estimación:** 8 Story Points | **Prioridad:** Must Have | **Sprint Asignado:** Sprint 3
* **Formulación:** *Como Operario de taller (Plotter, Offset, Guillotina), quiero visualizar un tablero Kanban en tiempo real con las órdenes asignadas a mi puesto de trabajo, para cambiar su estado (En Cola -> En Impresión -> Acabado -> Listo) y conocer las especificaciones de medidas y acabados sin papeles dispersos.*

---

#### HU-07: Control de Insumos y Registro de Mermas de Taller
* **Estimación:** 5 Story Points | **Prioridad:** Should Have | **Sprint Asignado:** Sprint 3
* **Formulación:** *Como Operario de máquina, quiero reportar mermas técnicas de sustrato (por descalibración de cabezal o atasco) al finalizar un trabajo, para descontar con exactitud el inventario real de bobinas en el taller.*

---

#### HU-08: Notificaciones Automatizadas de Pedido vía WhatsApp
* **Estimación:** 5 Story Points | **Prioridad:** Could Have | **Sprint Asignado:** Sprint 4
* **Formulación:** *Como Vendedora de mostrador, quiero que el sistema genere un enlace directo de notificación de WhatsApp al cliente informándole que su pedido está listo para recoger, para reducir el tiempo de permanencia en taller.*

---

#### HU-09: Dashboard Ejecutivo y Analítica de Negocio (BI)
* **Estimación:** 8 Story Points | **Prioridad:** Should Have | **Sprint Asignado:** Sprint 4
* **Formulación:** *Como Gerente General, quiero consultar gráficos interactivos de ventas mensuales, productos más rentables y desempeño de cobranza, para planificar compras y estrategias comerciales con datos objetivos.*

---

#### HU-10: Módulo Predictivo de Demanda con Inteligencia Artificial
* **Estimación:** 13 Story Points | **Prioridad:** Should Have | **Sprint Asignado:** Sprint 4
* **Formulación:** *Como Administradora, quiero consultar recomendaciones predictivas automáticas de metros de lona y vinil a comprar para el siguiente mes, para abastecerme oportunamente y reducir compras de emergencia a sobreprecio.*

---

### 4. Definición del Sprint 1 (Alcance, Capacidad y Cierre Técnico)

* **Período de Ejecución:** Lunes 14/09/2026 al Sábado 19/09/2026 (Semana 05 Universidad / SEM04).
* **Meta del Sprint (Sprint Goal):** *"Establecer la infraestructura de desarrollo local contenerizada en Docker Compose, desplegar la base de datos relacional PostgreSQL con tablas de seguridad y catálogo, e implementar el módulo de autenticación segura con JWT y control de perfiles RBAC tanto en backend como frontend."*
* **Capacidad del Equipo:** 72 horas hombre planificadas / 70 horas efectivas ejecutadas.
* **Historias Abordadas en Sprint 1:**
  - `HU-01` (3 SP): Autenticación y Control de Acceso por Roles $\rightarrow$ **100% COMPLETADA (Done)**.
  - `HU-02` (5 SP): Modelamiento relacional de clientes e insumos $\rightarrow$ **30% AVANCE (Base de datos finalizada; UI pasa a Sprint 2)**.
* **Story Points Devengados al Cierre del Sprint 1:** **3 SP** estrictamente bajo Definition of Done.
* **Deuda Técnica Trasladada Planificadamente al Sprint 2:**
  - Parametrización de catálogo de insumos en formularios Angular (HU-02).
  - Implementación de pipeline de integración continua básica (CI) en GitHub Actions.
  - Creación de suite de pruebas unitarias para componentes visuales de Angular 21.
