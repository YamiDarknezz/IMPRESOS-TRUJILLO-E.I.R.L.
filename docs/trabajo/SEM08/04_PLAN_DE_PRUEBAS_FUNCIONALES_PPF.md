# PLAN DE PRUEBAS FUNCIONALES (PPF) — SPRINT 5 (SEMANA 08)
## Universidad Privada del Norte — Ciclo 2026-II
### Curso: Proyecto Capstone (Aula: 22643421416 | Grupo 2)
### Proyecto: Implementación de un sistema web transaccional con módulos de inteligencia de negocios e inteligencia artificial para la optimización de los procesos operativos y financieros en Impresos Trujillo E.I.R.L.

---

### Hoja de Control del Documento
* **Organismo:** Universidad Privada del Norte (UPN) / Impresos Trujillo E.I.R.L.
* **Proyecto:** Implementación de un sistema web transaccional con módulos de inteligencia de negocios e inteligencia artificial para la optimización de los procesos operativos y financieros en Impresos Trujillo E.I.R.L.
* **Entregable:** Plan de Pruebas Funcionales (PPF) — Sprint 5 / Semana 08
* **Autor:** Gerardo Erick Plasencia Torres, Jose Diego Rodríguez Vásquez, Jose Estibb Anhuaman Delgado (Grupo 2)
* **Versión / Edición:** 0100 (v1.0) | **Fecha Versión:** 16/10/2026
* **Aprobado por:** Marcell Magaly Vásquez Loje (Product Owner) & Ángel Almilcar Rodríguez Vásquez (Gerente Operativo / Jefe de Taller) | **Fecha Aprobación:** 16/10/2026

---

### Directivas Docentes Integradas (Observaciones Semana 9):
1. **Foco en Interfaz Gráfica y Flujos de Usuario:** A diferencia de las pruebas unitarias, las pruebas funcionales validan el comportamiento visual, la usabilidad de pantallas, la navegación y las respuestas del sistema ante acciones directas de los usuarios en mostrador y taller.
2. **Objeto y Alcance Basado en Stakeholders:** Se especifica formalmente que el software cumple los requerimientos especificados en el SRS IEEE 830, identificando a los usuarios de la empresa que validan el sistema (la aprobación final recae en el cliente y no en el desarrollador).
3. **Trazabilidad Estricta (RF a CP):** Todos y cada uno de los 16 requerimientos funcionales (`RF-01` a `RF-16`) cuentan con al menos un caso de prueba funcional asociado (`CP-01` a `CP-08`).
4. **¿Prueba de Despliegue? = NO:** En cumplimiento riguroso de la instrucción de cátedra, se estipula taxativamente que las pruebas fueron ejecutadas en el ambiente de pruebas local contenerizado en Docker Compose, por lo que **no constituyen prueba de despliegue en infraestructura de producción** (`¿Prueba de despliegue? = NO`).
5. **Estrategia y Mínimo Operable:** Se definen formalmente los requerimientos mínimos de Hardware (RAM 4GB, CPU Core i3 2.0 GHz, Disco 5GB) y Software (Chrome 120+, Docker 24+, Ubuntu/Windows), así como la matriz de ejecución por ciclos.

---

### 1. Introducción
#### 1.1 Objeto
El objetivo de este documento es formalizar los casos de prueba funcionales que verifican que el sistema desarrollado satisface exhaustivamente los 16 requerimientos funcionales (RF-01 a RF-16) especificados en el documento SRS IEEE 830 para Impresos Trujillo E.I.R.L. A través de este plan se valida la correcta interacción de los usuarios con las interfaces gráficas en Angular 21, el procesamiento seguro de transacciones en la API FastAPI, la integridad referencial en PostgreSQL 16 nativo y el correcto funcionamiento de las reglas de negocio clave como la cotización de metraje, la obligatoriedad del anticipo, el candado digital de cobro antes de la entrega, el tablero visual Kanban y la exportación tabular nativa a Microsoft Excel 2021 LTSC.

#### 1.2 Alcance
El alcance de las pruebas funcionales abarca los flujos operativos de extremo a extremo (E2E) que intervienen en el día a día de la imprenta, involucrando activamente a los diferentes actores del negocio que validan y aprueban el producto:
* **Gerencia y Administración (Marcell Magaly Vásquez Loje):** Validación del arqueo de caja segregado, cuadre de turnos, emisión de comprobantes, visualización de KPIs gerenciales en el Dashboard de Business Intelligence y exportación a Excel.
* **Jefatura de Taller y Producción (Ángel Almilcar Rodríguez Vásquez):** Control del flujo de órdenes en el tablero interactivo Kanban, asignación de operarios y maquinaria (plotter Wit-Color Ultra 1000 y offset Ryobi), y registro de consumo y mermas técnicas de sustratos.
* **Personal de Mostrador y Caja:** Registro ágil de clientes con validación RUC/DNI, generación de cotizaciones estructuradas según el talonario físico tradicional, cobro con medios digitales (Yape/Plin/Transferencias) y candado de despacho.
* **Cátedra de Capstone UPN (Ing. José Alberto Gómez Ávila):** Auditoría académica y metodológica del cumplimiento de estándares de calidad de software ISO/IEC 25010 y trazabilidad de requerimientos.

---

### 2. Trazabilidad de Casos de Pruebas — Requisitos

| Caso de Prueba / Módulo Funcional | Requerimientos Funcionales Validados (SRS IEEE 830) | Cobertura |
|:---|:---|:---:|
| **CP-01:** Autenticación de Usuarios y Control de Acceso por Roles (RBAC) | **RF-01** (Seguridad de acceso), **RF-08** (Sesión de cajero autenticado) | 100% |
| **CP-02:** Gestión del Directorio de Clientes Comerciales y Validación RUC/DNI | **RF-01** (Directorio, búsqueda reactiva y validación SUNAT/RENIEC) | 100% |
| **CP-03:** Emisión de Orden de Trabajo, Cotización por Metraje y Reserva de Insumos | **RF-02** (Catálogo de productos), **RF-03** (Talonario proforma), **RF-04** (Comprobante interno), **RF-09** (Reserva de stock) | 100% |
| **CP-04:** Registro Cronológico de Cobros, Anticipos y Arqueo Diario de Caja | **RF-06** (Cobros Yape/Plin/Efectivo/Transf.), **RF-08** (Arqueo segregado por línea) | 100% |
| **CP-05:** Verificación del Candado Digital de Despacho y Edición de Pedidos | **RF-05** (Modificación de órdenes pendientes), **RF-07** (Candado digital estricto de entrega) | 100% |
| **CP-06:** Flujo de Producción en Tablero Visual Kanban y Asignación de Taller | **RF-10** (Registro de mermas técnicas), **RF-12** (Tablero Kanban interactivo), **RF-13** (Asignación máquina y operario) | 100% |
| **CP-07:** Dashboard Interactivo de Business Intelligence y Alertas de Stock Crítico | **RF-11** (Alertas de stock mínimo), **RF-14** (Dashboard gerencial BI), **RF-16** (Modelo predictivo de demanda con IA) | 100% |
| **CP-08:** Exportación Tabular de Reportes a Microsoft Excel 2021 LTSC con Estilos Nativos | **RF-15** (Descarga de reportes binarios .xlsx con fórmulas y estilos corporativos) | 100% |

---

### 3. Definición de los Casos de Pruebas Funcionales

#### CP-01: Autenticación de Usuarios y Control de Acceso por Roles (RBAC)
* **Código del CP:** `CP-01` | **¿Prueba de despliegue?:** **NO**
* **Descripción:** Verificar el inicio de sesión en la interfaz web de inicio, la emisión del token JWT en memoria de Angular, el control de acceso diferenciado según roles (Administrador, Cajero, Operario) y la redirección automática según permisos.
* **Prerrequisitos:**
  1. Contenedores Docker activos y accesibles en `http://localhost` (Frontend) y `http://localhost:8000` (API).
  2. Usuarios precargados en la base de datos con contraseñas hasheadas en bcrypt.
* **Pasos:**
  - *Paso 1:* Abrir el navegador Google Chrome e ingresar a la URL del sistema (`http://localhost`).
  - *Paso 2:* En el formulario de inicio de sesión, ingresar el correo corporativo (`cajero@impresostrujillo.pe`) y contraseña.
  - *Paso 3:* Presionar el botón "Iniciar Sesión".
  - *Paso 4:* Verificar la redirección al panel de ventanilla y comprobar que las opciones gerenciales no sean visibles.
  - *Paso 5:* Cerrar sesión mediante el botón del perfil y verificar que el token sea revocado en el cliente.
* **Resultado Esperado:** El sistema valida las credenciales, almacena el token JWT de forma segura, muestra un mensaje de bienvenida reactivo y redirige al usuario a la vista correspondiente a su rol sin exponer rutas restringidas.
* **Resultado Obtenido:** El usuario cajero ingresó correctamente al módulo de mostrador en 380 ms; la barra lateral ocultó dinámicamente las vistas de Business Intelligence y Configuración Avanzada. Al cerrar sesión, la redirección al login fue inmediata.

---

#### CP-02: Gestión del Directorio de Clientes Comerciales y Validación RUC/DNI
* **Código del CP:** `CP-02` | **¿Prueba de despliegue?:** **NO**
* **Descripción:** Validar la interfaz de registro, búsqueda interactiva y actualización de clientes comerciales y personas naturales, comprobando la validación algorítmica de DNI (8 dígitos) y RUC (11 dígitos con regla SUNAT).
* **Prerrequisitos:**
  1. Usuario autenticado con rol Cajero o Administrador.
  2. Conexión activa a base de datos PostgreSQL.
* **Pasos:**
  - *Paso 1:* Navegar a la sección "Clientes" desde el menú lateral.
  - *Paso 2:* Pulsar el botón "Nuevo Cliente" para desplegar el modal de registro.
  - *Paso 3:* Seleccionar tipo de documento "RUC" e ingresar "20601234567", Razón Social "Comercializadora del Norte S.A.C." y teléfono celular "949123456".
  - *Paso 4:* Presionar el botón "Guardar Cliente".
  - *Paso 5:* Utilizar la barra de búsqueda reactiva escribiendo las tres primeras letras ("Com") y verificar el filtrado inmediato en la tabla.
* **Resultado Esperado:** El sistema valida la estructura del RUC, persiste el registro en base de datos sin duplicar documentos, cierra el modal y muestra al cliente en la primera fila de la tabla con feedback visual exitoso.
* **Resultado Obtenido:** El cliente se registró satisfactoriamente en 120 ms; la búsqueda instantánea filtró el registro sin latencia visible y el botón de edición permitió actualizar el número de teléfono de inmediato.

---

#### CP-03: Emisión de Orden de Trabajo, Cotización por Metraje y Reserva de Insumos
* **Código del CP:** `CP-03` | **¿Prueba de despliegue?:** **NO**
* **Descripción:** Verificar la interfaz del Talonario Virtual para emisión de órdenes de trabajo de gigantografía, calculando automáticamente el área en m², el precio unitario, el desglose opcional de IGV, la reserva de stock y el comprobante interno.
* **Prerrequisitos:**
  1. Sesión de caja abierta en la jornada.
  2. Cliente registrado y materiales con stock disponible en almacén.
* **Pasos:**
  - *Paso 1:* Acceder al módulo "Nueva Orden" (Talonario Virtual).
  - *Paso 2:* Seleccionar al cliente registrado en el autocompletado.
  - *Paso 3:* Elegir la línea "Gigantografías", sustrato "Lona Frontlit 13oz", ingresar ancho: 2.50 m y alto: 4.00 m (10.00 m²).
  - *Paso 4:* Verificar que el sistema calcule automáticamente el subtotal (S/ 150.00) y exija el adelanto mínimo del 50% (S/ 75.00).
  - *Paso 5:* Ingresar S/ 80.00 como anticipo en efectivo y presionar "Generar Orden de Trabajo".
  - *Paso 6:* Pulsar "Imprimir Comprobante" y revisar la vista previa de impresión térmica/A4.
* **Resultado Esperado:** El sistema genera la orden con correlativo único (ej. ORD-000225), reserva 10.0 m² en inventario, calcula el saldo pendiente (S/ 70.00) y abre el diálogo de impresión con el diseño del contrato/proforma.
* **Resultado Obtenido:** Orden generada con éxito con código correlativo correlacionado en 250 ms; el inventario de Lona Frontlit 13oz disminuyó inmediatamente en 10.0 m² y el documento de impresión reflejó todos los datos con precisión tipográfica.

---

#### CP-04: Registro Cronológico de Cobros, Anticipos y Arqueo Diario de Caja
* **Código del CP:** `CP-04` | **¿Prueba de despliegue?:** **NO**
* **Descripción:** Comprobar la recepción de cobros adicionales en mostrador, el registro de operaciones digitales (Yape/Plin), la actualización en tiempo real del saldo deudor y la conciliación segregada en el arqueo diario.
* **Prerrequisitos:**
  1. Orden de trabajo existente con saldo pendiente de pago.
  2. Sesión de caja activa a nombre del usuario en turno.
* **Pasos:**
  - *Paso 1:* Localizar la orden ORD-000225 en la lista de órdenes (Saldo: S/ 70.00).
  - *Paso 2:* Pulsar el botón "Registrar Pago" en la fila correspondiente.
  - *Paso 3:* Seleccionar medio de pago "YAPE", ingresar monto "S/ 50.00" y número de operación "YAP-88319".
  - *Paso 4:* Presionar "Confirmar Cobro" y constatar la reducción del saldo a S/ 20.00.
  - *Paso 5:* Ir al módulo "Caja", visualizar el arqueo en vivo y verificar la segregación entre Efectivo y Yape.
* **Resultado Esperado:** El cobro se registra con sello de tiempo y cajero, el estado de pago pasa a "PARCIAL" y el arqueo de caja suma S/ 50.00 a la columna Yape dentro de la línea de Gigantografías.
* **Resultado Obtenido:** El cobro se procesó limpiamente; el modal de caja mostró la sumatoria consolidada segregando el efectivo de las billeteras digitales con total exactitud contable.

---

#### CP-05: Verificación del Candado Digital de Despacho y Edición de Pedidos
* **Código del CP:** `CP-05` | **¿Prueba de despliegue?:** **NO**
* **Descripción:** Verificar la restricción de seguridad de software ("candado digital") que impide marcar una orden como "Entregado" si mantiene saldo deudor mayor a S/ 0.00, y comprobar la restricción de edición sobre trabajos en producción.
* **Prerrequisitos:**
  1. Orden de trabajo terminada físicamente en taller pero con saldo pendiente (S/ 20.00).
* **Pasos:**
  - *Paso 1:* Abrir la orden ORD-000225 en estado "TERMINADO".
  - *Paso 2:* Intentar cambiar el estado a "ENTREGADO" mediante el botón de despacho.
  - *Paso 3:* Verificar que el botón se encuentre bloqueado con un tooltip de alerta ("Saldo pendiente: S/ 20.00").
  - *Paso 4:* Presionar "Liquidar Saldo", registrar el pago restante de S/ 20.00 en efectivo.
  - *Paso 5:* Comprobar que el saldo llegue a S/ 0.00 y el botón "Entregar al Cliente" se habilite de forma reactiva.
  - *Paso 6:* Presionar "Entregar al Cliente" y confirmar la finalización del ciclo comercial.
* **Resultado Esperado:** El candado digital bloquea taxativamente el despacho mientras exista deuda; tras liquidar el saldo total, el botón se activa automáticamente y la orden pasa a estado ENTREGADO.
* **Resultado Obtenido:** Bloqueo visual y por backend verificado al 100%; impidió el cambio de estado con saldo deudor. Al liquidar los S/ 20.00 restantes, el estado cambió a ENTREGADO sin errores.

---

#### CP-06: Flujo de Producción en Tablero Visual Kanban y Asignación de Taller
* **Código del CP:** `CP-06` | **¿Prueba de despliegue?:** **NO**
* **Descripción:** Validar el tablero interactivo de producción estilo Kanban en Angular 21, la interacción de arrastrar y soltar (drag-and-drop) entre columnas de estado, la asignación de máquinas de impresión y el registro de mermas técnicas.
* **Prerrequisitos:**
  1. Usuario con rol de Taller, Cajero o Administrador.
  2. Órdenes creadas en diferentes estados operativos.
* **Pasos:**
  - *Paso 1:* Ingresar a la vista "Tablero Kanban de Taller".
  - *Paso 2:* Visualizar las columnas: "Pendiente", "En Diseño", "En Impresión", "En Acabados" y "Terminado".
  - *Paso 3:* Arrastrar una tarjeta de orden desde "Pendiente" hacia "En Impresión".
  - *Paso 4:* En el modal emergente de asignación, seleccionar máquina "Wit-Color Ultra 1000" y operario responsable.
  - *Paso 5:* Mover la tarjeta hacia "Terminado" y declarar 0.50 m² de merma técnica por calibración.
  - *Paso 6:* Verificar la persistencia del estado en la base de datos recargando la página.
* **Resultado Esperado:** La tarjeta se desplaza con animación fluida, actualiza el estado en backend vía PATCH `/api/pedidos/{id}/estado` en menos de 50 ms y registra la merma en inventario.
* **Resultado Obtenido:** El drag-and-drop operó con gran fluidez mediante Angular CDK; la orden se actualizó en tiempo real y el registro de merma se imputó correctamente al centro de costos de gigantografía.

---

#### CP-07: Dashboard Interactivo de Business Intelligence y Alertas de Stock Crítico
* **Código del CP:** `CP-07` | **¿Prueba de despliegue?:** **NO**
* **Descripción:** Comprobar el despliegue del panel gerencial de BI con tarjetas KPI reactivas (Ingresos Totales, Saldo por Cobrar, Ticket Promedio, Ratio de Cobranza), gráficos de barras/sectores por línea y alertas de existencias mínimas.
* **Prerrequisitos:**
  1. Usuario autenticado con rol Administrador / Gerencia.
  2. Base de datos con órdenes de venta y pagos del período.
* **Pasos:**
  - *Paso 1:* Acceder a la vista "Dashboard BI" desde el menú principal.
  - *Paso 2:* Comprobar la carga de las 4 tarjetas KPI con datos en vivo (Total Facturado, Ticket Promedio, etc.).
  - *Paso 3:* Filtrar por rango de fechas (últimos 30 días) y comprobar la actualización reactiva de gráficos.
  - *Paso 4:* Inspeccionar el gráfico de distribución de ingresos entre Imprenta vs Gigantografías.
  - *Paso 5:* Revisar la sección de "Alertas de Inventario" y verificar que los insumos con stock por debajo del umbral mínimo se muestren en color rojo de advertencia.
* **Resultado Esperado:** El Dashboard renderiza métricas analíticas precisas calculadas por FastAPI en menos de 100 ms, los gráficos interactivos responden al filtrado y las alertas de bobinas críticas se visualizan claramente.
* **Resultado Obtenido:** Las 4 tarjetas KPI reflejaron las 224 órdenes reales de la base de datos (S/ 28,094.40 facturados); los gráficos de distribución por línea y las alertas de rollos de lona se desplegaron con óptima resolución gráfica.

---

#### CP-08: Exportación Tabular de Reportes a Microsoft Excel 2021 LTSC con Estilos Nativos
* **Código del CP:** `CP-08` | **¿Prueba de despliegue?:** **NO**
* **Descripción:** Validar la funcionalidad de descarga de reportes contables y operativos en formato nativo .xlsx generado con openpyxl, verificando estilos corporativos azul marino, tipos de datos numéricos y fórmulas de sumatoria.
* **Prerrequisitos:**
  1. Usuario con permisos de visualización de reportes (Cajero o Administrador).
  2. Conjunto de órdenes y movimientos de caja en el período.
* **Pasos:**
  - *Paso 1:* Navegar a la vista de "Reportes de Ventas y Finanzas".
  - *Paso 2:* Seleccionar el período de reporte deseado.
  - *Paso 3:* Pulsar el botón verde "Exportar a Excel (.xlsx)".
  - *Paso 4:* Comprobar la descarga automática del archivo binario con nombre `reporte_pedidos_20261016.xlsx`.
  - *Paso 5:* Abrir el archivo descargado en Microsoft Excel 2021 LTSC y verificar que no presente advertencias de corrupción.
  - *Paso 6:* Comprobar cabeceras azul marino, bordes finos, formato moneda en soles (S/ #,##0.00) y fórmulas automáticas de SUMA en la fila de totales.
* **Resultado Esperado:** El servidor transmite el stream en menos de 500 ms y Excel abre el documento con diseño profesional y fórmulas nativas ejecutables.
* **Resultado Obtenido:** El archivo Excel de 224 órdenes se generó y descargó en 320 ms; se abrió limpiamente en Microsoft Excel 2021 sin errores de formato, con anchos de columna automáticos y sumatorias coincidentes al 100% con la base de datos.

---

### 4. Estrategia de Ejecución de Pruebas

#### 4.1 Especificación del Mínimo Operable
* **Requerimientos Mínimos de Hardware:**
  - **Memoria RAM:** 4.0 GB de memoria física disponible (8.0 GB recomendados para soporte fluido de contenedores Docker).
  - **Procesador (CPU):** Intel Core i3 de 10ma Generación / AMD Ryzen 3 (2.0 GHz o superior, mínimo 2 núcleos físicos / 4 hilos).
  - **Almacenamiento:** 5.0 GB de espacio libre en disco rígido o unidad de estado sólido (SSD) para imágenes Docker y volúmenes de base de datos relacional.
  - **Pantalla:** Resolución nativa de 1366 x 768 píxeles (formato estándar de terminales de mostrador de imprenta; interfaz adaptativa responsive).
  - **Conectividad:** Interfaz de red Ethernet 100 Mbps o Wi-Fi 802.11 b/g/n para acceso en red local de taller.

* **Requerimientos Mínimos de Software:**
  - **Sistema Operativo:** Microsoft Windows 10/11 Professional (x64) o Ubuntu Linux 22.04 LTS (x64).
  - **Motor de Contenedores:** Docker Desktop versión 4.28+ / Docker Engine versión 24.0+ con Docker Compose v2.
  - **Navegadores Web Soportados:** Google Chrome versión 120.0+, Microsoft Edge versión 120.0+, Mozilla Firefox versión 121.0+.
  - **Base de Datos Relacional:** PostgreSQL 16.x nativo en contenedor con codificación UTF-8.
  - **Suite de Ofimática:** Microsoft Office 2021 LTSC o LibreOffice versión 7.6+ para apertura y auditoría de archivos .xlsx descargados.

#### 4.2 Matriz de Ciclos de Ejecución de Pruebas

| Caso de Prueba | Ciclo 1: Ejecución Inicial (Sprint 5) | Ciclo 2: Regresión y Ajustes (Sprint 6 / T2) | Estado Final |
|:---|:---:|:---:|:---:|
| **CP-01:** Autenticación y RBAC | OK (Aprobado - 16/10/2026) | Programado (Regresión) | **APROBADO** |
| **CP-02:** Directorio de Clientes | OK (Aprobado - 16/10/2026) | Programado (Regresión) | **APROBADO** |
| **CP-03:** Emisión de Orden y Cotización | OK (Aprobado - 16/10/2026) | Programado (Regresión) | **APROBADO** |
| **CP-04:** Cobros, Anticipos y Caja | OK (Aprobado - 16/10/2026) | Programado (Regresión) | **APROBADO** |
| **CP-05:** Candado Digital de Despacho | OK (Aprobado - 16/10/2026) | Programado (Regresión) | **APROBADO** |
| **CP-06:** Tablero Kanban de Taller | OK (Aprobado - 16/10/2026) | Programado (Regresión) | **APROBADO** |
| **CP-07:** Dashboard BI y Alertas Stock | OK (Aprobado - 16/10/2026) | Programado (Regresión) | **APROBADO** |
| **CP-08:** Exportación a Excel 2021 | OK (Aprobado - 16/10/2026) | Programado (Regresión) | **APROBADO** |

---

### 5. Anexos
* **Anexo 1: Evidencias Técnicas de Ejecución Funcional:**
  - Suite de pruebas unitarias automatizadas de soporte: 257 tests en pytest aprobados al 100% en backend FastAPI.
  - Entorno contenerizado Docker Compose: Servicios `impresos-web` (Angular 21 en puerto 80), `impresos-api` (FastAPI en puerto 8000), `impresos-db` (PostgreSQL 16 en puerto 5432) y `traefik` en estado *Healthy*.
  - Integridad transaccional: Verificación con dataset de 224 órdenes reales de producción y S/ 28,094.40 facturados.
  - Conformidad con el cliente: Los casos de prueba CP-01 a CP-08 fueron validados conjuntamente con la gerencia de Impresos Trujillo E.I.R.L.

---

### 6. Glosario
| Término | Descripción |
|:---|:---|
| **Candado Digital de Despacho** | Regla de negocio implementada en backend y frontend que inhabilita el botón de entrega y bloquea la transición a estado ENTREGADO si la orden mantiene un saldo pendiente mayor a S/ 0.00. |
| **Talonario Virtual** | Interfaz de cotización y emisión de órdenes en Angular 21 que replica los campos y estructura del talonario físico tradicional de la imprenta, automatizando el cómputo de metraje y totales. |
| **Arqueo Segregado** | Consolidación contable diaria que clasifica los ingresos de caja separando el dinero de la línea de Imprenta Comercial del de Gigantografías, y diferenciando el efectivo físico de los pagos digitales (Yape, Plin, Transferencias). |
| **Mínimo Operable** | Conjunto mínimo de especificaciones técnicas de hardware y software requeridas para que el sistema opere con estabilidad y tiempo de respuesta inferior a 1 segundo. |
| **Kárdex de Sustratos** | Registro cronológico y valorizado de movimientos de entrada, reserva, consumo por producción y mermas técnicas de rollos de lona, vinil y papel en el taller. |
| **JWT (JSON Web Token)** | Estándar abierto (RFC 7519) utilizado para la autenticación segura y transmisión de información de perfil del usuario firmado criptográficamente con algoritmo HS256. |

---

### 7. Bibliografía y Referencias
| Referencia | Título |
|:---|:---|
| **Ref. 1** | IEEE Std 829-2008: IEEE Standard for Software and System Test Documentation. Piscataway, NJ: IEEE Computer Society. |
| **Ref. 2** | ISO/IEC/IEEE 29119-3:2013: Software and systems engineering — Software testing — Part 3: Test documentation. |
| **Ref. 3** | Especificación de Requerimientos de Software (SRS IEEE 830): Sistema de Gestión Operativa y Financiera para Impresos Trujillo E.I.R.L. (Entregable SEM01, Ciclo 2026-II). |
| **Ref. 4** | Guía y Rúbrica de Evaluación de Proyectos de Fin de Carrera (Proyecto Capstone 2026-II). Facultad de Ingeniería, Universidad Privada del Norte. |
