# Especificación de Requerimientos de Software (SRS)
## Sistema Web Transaccional con Inteligencia de Negocios e Inteligencia Artificial para Impresos Trujillo E.I.R.L.
### Estándar IEEE 830

---

## Historial de Versiones

| Fecha | Versión | Autor | Organización | Descripción |
| :--- | :---: | :--- | :--- | :--- |
| 28/08/2026 | 1.0 | Equipo Capstone — Grupo 2 | UPN / Impresos Trujillo | Elaboración inicial completa de requerimientos de software alineada a los procesos reales de negocio y observaciones docentes. |

---

## Información del Proyecto

| Campo | Detalle |
| :--- | :--- |
| **Empresa / Organización** | Impresos Trujillo E.I.R.L. (RUC: 20602572952) |
| **Proyecto** | Implementación de un sistema web transaccional con módulos de inteligencia de negocios e inteligencia artificial para la optimización de los procesos operativos en la empresa Impresos Trujillo E.I.R.L. |
| **Código del Proyecto** | Grupo 2 (Aula: 22643421416) |
| **Fecha de Preparación** | 28 de agosto de 2026 |
| **Líder de Proyecto** | Gerardo Erick Plasencia Torres |
| **Cliente / Auspiciante** | Angel Almilcar Rodríguez Evangelista (Gerente / Jefe de Taller) y Marcell Magaly Vásquez Loje (Gerente / Jefa de Oficina) |

---

## Aprobaciones

| Nombre y Apellido | Cargo | Departamento u Organización | Fecha | Firma |
| :--- | :--- | :--- | :---: | :---: |
| **Angel Almilcar Rodríguez Evangelista** | Gerente / Jefe de Taller | Impresos Trujillo E.I.R.L. | 28/08/2026 | Aprobado |
| **Marcell Magaly Vásquez Loje** | Gerente / Jefa de Oficina | Impresos Trujillo E.I.R.L. | 28/08/2026 | Aprobado |
| **Gerardo Erick Plasencia Torres** | Líder de Proyecto / Scrum Master | Universidad Privada del Norte | 28/08/2026 | Aprobado |

---

# 1. Propósito
El presente documento tiene como propósito definir formalmente la Especificación de Requerimientos de Software (SRS) para el sistema web de gestión operativa, analítica y predictiva de **Impresos Trujillo E.I.R.L.**, bajo las directrices del estándar IEEE 830. Este sistema integra la gestión de órdenes de trabajo (talonario de contratos y proformas), control de inventario de materiales con cálculo técnico de pegamento, registro cronológico de pagos con candado de entrega y liquidación de caja dual para las unidades de Imprenta y Gigantografías, complementado con tableros de BI y modelos de Inteligencia Artificial para la predicción de demanda de insumos.

---

# 2. Alcance del Producto / Software
El sistema es una solución web multiplataforma accesible mediante navegadores web modernos desde las terminales de oficina y taller. Sus metas principales son:
* Automatizar el ciclo de atención comercial mediante órdenes digitales que replican y optimizan el talonario físico de contrato/proforma.
* Reducir las pérdidas económicas por mermas en vinilos y pegamento (cuantificadas en más de S/ 3,500 mensuales) a través de la reserva inmediata de stock y el cálculo de consumo por cada 5 metros lineales procesados.
* Eliminar al 100% las fugas de capital por entregas con saldos impagos mediante la validación automatizada de saldo en cero.
* Segregar de manera obligatoria e independiente los arqueos diarios de caja de las unidades de Imprenta y Gigantografías.
* Proporcionar capacidades predictivas de demanda de materiales críticos para compras estratégicas.

---

# 3. Referencias
1. IEEE Std 830-1998: *IEEE Recommended Practice for Software Requirements Specifications*.
2. Ley N° 29733: *Ley de Protección de Datos Personales del Perú* y su Reglamento (D.S. 003-2013-JUS).
3. Resolución de Superintendencia SUNAT N° 007-99/SUNAT: *Reglamento de Comprobantes de Pago*.
4. Documentos del Proyecto Capstone: *Acta de Constitución del Proyecto* y *Caso de Negocio (Business Case)*.

---

# 4. Funcionalidades del Producto
Las principales funcionalidades del sistema organizadas por procesos de negocio reales son:
1. **FN-01: Gestión y Emisión de Órdenes de Trabajo (Contrato / Proforma):** Generación digital con correlativo automático, datos de cliente, desglose de ítems, cálculo opcional de IGV, anticipo, saldo y compromiso de entrega.
2. **FN-02: Control de Inventario y Reserva de Materiales:** Reserva automática de stock al crear pedidos y ajuste por consumo real/mermas al finalizar la orden.
3. **FN-03: Cálculo Técnico Automatizado de Consumo de Pegamento:** Aproximación de gasto de goma/adhesivo a razón de 1 cuota por cada 5 metros lineales de material procesado.
4. **FN-04: Gestión de Cobranzas y Candado Digital de Entrega:** Registro histórico de eventos de pago (efectivo, Yape y transferencias) y bloqueo lógico de entrega física si existe saldo pendiente.
5. **FN-05: Cierre y Arqueo Diario de Caja Dual:** Liquidación independiente de ingresos por usuario para Imprenta y Gigantografías, desglosado por canal de pago.
6. **FN-06: Catálogo de Productos y Recetas de Insumos:** Mantenimiento de productos propios (con fórmula de materiales), servicios directos y trabajos subcontratados.
7. **FN-07: Inteligencia de Negocios y Reportes Gerenciales:** Dashboards ejecutivos con exportación nativa compatible con Microsoft Excel 2021 LTSC (.xlsx).
8. **FN-08: Inteligencia Artificial y Alertas Predictivas:** Modelo predictivo de demanda de insumos para reabastecimiento y detección de anomalías en consumos.

---

# 5. Clases y Características de Usuarios
*(Nota metodológica docente: El cliente externo comprador no opera directamente el sistema en mostrador o taller; el software es operado estrictamente por el personal interno).*

| Clase de Usuario | Descripción y Responsabilidades | Nivel Tecnológico | Necesidad de Capacitación |
| :--- | :--- | :--- | :--- |
| **Administrador / Dueños** (Angel Rodríguez, Marcell Vásquez) | Acceso total al sistema: configuración de tarifas, visualización de finanzas globales, dashboards de BI, auditoría y anulación de órdenes especiales. | Básico - Intermedio | 2 sesiones prácticas en navegación gerencial, exportación a Excel 2021 e interpretación de KPIs. |
| **Subgerencia Operativa** (Manuel) | Supervisión transversal de taller y oficina: asignación de órdenes a operarios, reasignación de etapas y monitoreo de stock crítico. | Intermedio | 2 sesiones en flujo de pipeline y balance de carga de trabajo entre áreas. |
| **Secretaría de Taller** (Marilú) | Atención en mostrador: registro de clientes, emisión de contratos/proformas, cobro de anticipos, registro de pagos y arqueo diario de caja. | Básico | 3 sesiones intensivas en emisión de órdenes rápidas, validación de Yape y cierre de caja dual. |
| **Diseñadora Gráfica** (Ashlee) | Revisión de artes publicitarios, actualización de órdenes en etapa 'En Diseño' y carga de especificaciones técnicas aprobadas por el cliente. | Avanzado (Ofimática y Diseño) | 1 sesión en interacción con el pipeline y vinculación de archivos. |
| **Operarios de Taller** (Aldair, Alexis, Gabriel) | Visualización de órdenes asignadas en taller, avance a 'En Producción', reporte de consumo real de materiales (merma) y marcado de 'Finalizada'. | Básico | 2 sesiones con terminales táctiles para reporte simple de uso de bobinas y goma. |

---

# 6. Entorno Operativo
El sistema operará bajo la siguiente infraestructura real de la empresa cliente:
* **Hardware de Terminales:** Reutilización de las 6 computadoras de oficina y taller (procesadores Intel Core i5 12400F, Core i5 10400T, Core i7 6700, AMD Ryzen 5 3400G; memoria RAM entre 8 GB y 32 GB; almacenamiento SSD NVMe y HDD).
* **Sistemas Operativos Cliente:** Windows 10 Pro 22H2 (compilaciones 19045.5371, 19045.5737, 19045.3324) y Windows 11 Pro 25H2 (compilación 26200.9168).
* **Navegadores Soportados:** Google Chrome (v128.0 o superior) y Microsoft Edge (v128.0 o superior) de 64 bits.
* **Integración Ofimática:** Compatibilidad estricta de salida y exportación tabular hacia **Microsoft Excel 2021 LTSC (v2108 / Compilación 14332.20721)** en formato `.xlsx`.
* **Infraestructura de Red:** Enlace de fibra óptica simétrica dedicada de 200 Mbps con red local LAN y Wi-Fi en Jr. Simón Bolívar 945 Int. 1.
* **Alojamiento Servidor:** Contenedores Docker desplegados en Google Cloud Run y base de datos relacional PostgreSQL 15 en Supabase.

---

# 7. Requerimientos Funcionales por Proceso de Negocio

### 7.1 Proceso 1: Gestión y Emisión de Órdenes (Contrato / Proforma)
* **RF-01: Registro de Contrato/Proforma Comercial:** El sistema permitirá registrar órdenes de trabajo replicando los campos del contrato físico: N° correlativo, Tipo (Contrato o Proforma), Selección de Cliente (DNI/RUC, Nombre, Teléfono, Dirección), Fecha pactada de entrega, Indicador de IGV (Sí/No) y Observaciones técnicas.
* **RF-02: Desglose de Productos y Servicios:** Cada orden permitirá agregar productos del catálogo (propios, servicios o subcontratados) especificando dimensiones (alto x ancho en metros para gigantografía), cantidad y precio unitario pactado.
* **RF-03: Cálculo Financiero de la Orden:** El sistema calculará automáticamente el Subtotal, IGV (18% si aplica), Monto Total, Adelanto Obligatorio y Saldo Pendiente.
* **RF-04: Transición de Estados en Pipeline:** La orden transitará por los estados: `Pendiente` (sin anticipo), `En Diseño`, `Aprobado`, `En Producción`, `Finalizada` y `Entregada`. El sistema permitirá además el estado terminal `Cancelada`.

### 7.2 Proceso 2: Control de Inventario y Cálculo de Mermas
* **RF-05: Reserva Automática de Stock:** Al registrar una orden con estado confirmado (con anticipo), el sistema descontará preventivamente del inventario los materiales estimados según la receta del producto.
* **RF-06: Cálculo Automatizado de Goma/Pegamento:** Para productos de gigantografía y vinilo adhesivo, el sistema calculará automáticamente el consumo aproximado de pegamento a razón de 1 cuota estándar por cada 5 metros lineales de material procesado.
* **RF-07: Reporte de Consumo Real y Ajuste de Merma:** Al marcar la orden como `Finalizada`, el operario registrará el material real consumido. Las discrepancias por exceso se registrarán como mermas operativas y los sobrantes se reintegrarán al stock disponible.
* **RF-08: Alertas de Stock Mínimo:** El sistema emitirá alertas visuales cuando el inventario de un material crítico alcance o sea inferior a su umbral de reposición configurado.

### 7.3 Proceso 3: Gestión de Cobranzas y Candado de Entrega
* **RF-09: Registro Histórico de Pagos:** El sistema permitirá registrar múltiples pagos asociados a una orden (adelanto y amortizaciones), consignando fecha/hora, monto, canal de pago (efectivo, Yape o transferencia bancaria), código de operación y usuario que cobra.
* **RF-10: Candado Digital de Entrega Física:** El sistema bloqueará de forma estricta e inviolable el cambio de estado a `Entregada` si el campo Saldo Pendiente es superior a S/ 0.00. Solo con el pago total verificado se habilitará la entrega física.
* **RF-11: Carga de Comprobantes Digitales:** Permitirá adjuntar imágenes o capturas de comprobantes de pago emitidos por billeteras móviles (Yape/Plin) para facilitar la auditoría contable.

### 7.4 Proceso 4: Cierre y Arqueo Diario de Caja Dual
* **RF-12: Segregación Obligatoria de Cajas:** El sistema mantendrá cuentas contables y liquidaciones diarias totalmente independientes para la unidad de `Imprenta` y la unidad de `Gigantografías`.
* **RF-13: Arqueo por Usuario y Medio de Pago:** Al finalizar el turno o jornada diaria, cada usuario generará su arqueo desglosando los montos totales recaudados en Efectivo, Yape/Móvil y Transferencias Bancarias por cada unidad.
* **RF-14: Validación de Cierre Gerencial:** La Jefa de Oficina o Gerente validará los cierres diarios, registrando observaciones y bloqueando modificaciones posteriores sobre el día cerrado.

### 7.5 Proceso 5: Catálogo de Productos y Recetas
* **RF-15: Clasificación de Productos:** El catálogo permitirá categorizar los productos en `Propio` (elaborado en taller), `Servicio` (mano de obra directa) y `Subcontratado` (tercerizado a imprentas aliadas).
* **RF-16: Recetas de Materiales:** Para productos propios, se definirá una lista de insumos asociados (ej. bobina de banner, ojales, pegamento, tinta) con cantidades estimadas por metro cuadrado o unidad.

### 7.6 Proceso 6: Inteligencia de Negocios y Reportes
* **RF-17: Tablero de Control Ejecutivo:** Presentación gráfica de métricas clave: volumen de ventas del mes, ingresos recaudados, cuentas por cobrar, materiales en punto de pedido y órdenes en proceso.
* **RF-18: Exportación Compatible con Excel 2021:** Todo reporte operativo (listado de órdenes, liquidaciones de caja e inventario) podrá exportarse en formato `.xlsx` nativamente compatible con Microsoft Excel 2021 LTSC.

### 7.7 Proceso 7: Inteligencia Artificial y Alertas Predictivas
* **RF-19: Modelo Predictivo de Demanda de Insumos:** El sistema procesará el histórico de consumo de materiales para proyectar los requerimientos de compra para los siguientes 30 días.
* **RF-20: Alertas Predictivas de Consumo Anómalo:** Detección automática de órdenes cuyos consumos reales de vinilo o pegamento superen significativamente el estimado teórico (> 25% de merma).

---

# 8. Reglas del Negocio
* **RN-01 (Anticipo Obligatorio):** Ninguna orden de trabajo podrá pasar a la etapa de diseño o producción sin el registro previo de un pago de adelanto en caja (mínimo 50% para clientes generales; órdenes corporativas con orden de compra formal podrán exceptuarse con autorización de Gerencia).
* **RN-02 (Candado de Entrega):** Ningún producto podrá ser retirado del establecimiento ni marcado en el sistema como `Entregada` si mantiene un saldo pendiente de liquidar (Saldo > S/ 0.00).
* **RN-03 (Reserva Inmediata de Stock):** La confirmación de una orden compromete inmediatamente los materiales del inventario, evitando su asignación concurrente a otros trabajos.
* **RN-04 (Parámetro Técnico de Goma):** El consumo teórico de pegamento se estandariza en 1 cuota por cada 5 metros lineales de material procesado en acabados de gran formato.
* **RN-05 (Independencia de Cajas):** Los fondos recaudados por trabajos de Imprenta tradicional y Gigantografías no podrán mezclarse en una sola cuenta operativa de liquidación.
* **RN-06 (Liberación por Cancelación):** La anulación de una orden en pipeline devuelve automáticamente el stock reservado al almacén disponible.
* **RN-07 (Inmutabilidad de Órdenes Cerradas):** Las órdenes entregadas o canceladas adquieren carácter definitivo y no pueden ser modificadas, garantizando la fidelidad de la auditoría.

---

# 9. Requerimientos de Interfaces Externas

### 9.1 Interfaces de Usuario (GUI)
* Interfaz web responsiva desarrollada con Angular 21, optimizada para resoluciones de pantalla estándar de oficina (1920x1080) y terminales compactas de taller (1366x768).
* Diseño sobrio con navegación intuitiva, soporte para modo claro y botones de acción rápida de gran tamaño para facilitar la operación en terminales táctiles de taller.

### 9.2 Interfaces de Hardware
* Interacción con el parque informático de las 6 computadoras existentes de oficina y taller.
* Conexión con impresoras térmicas de tickets y plotters de gigantografía mediante controladores de red e impresión estándar del sistema operativo Windows 10/11.

### 9.3 Interfaces de Software
* Backend API RESTful en FastAPI (Python 3.11).
* Base de datos PostgreSQL 15 en nube Supabase con transacciones concurrentes ACID.
* Generador de reportes en hojas de cálculo `.xlsx` compatibles con Microsoft Excel 2021 LTSC.
* Librerías de modelado predictivo Scikit-learn 1.4 y Prophet.

### 9.4 Interfaces de Comunicación
* Protocolo seguro HTTPS (TLS 1.3) para todo el tráfico web entre navegadores clientes y el servidor en la nube.
* WebSockets seguros (WSS) para la actualización en tiempo real del pipeline de órdenes entre terminales de oficina y taller.

---

# 10. Requerimientos No Funcionales

### 10.1 Seguridad y Control de Acceso (Autenticación y Autorización)
*(Nota: Autenticación trasladada a Requerimientos No Funcionales según directiva docente).*
* **RNF-01 (Autenticación de Usuarios):** El acceso al sistema requerirá credenciales personales (correo electrónico y contraseña cifrada con algoritmo bcrypt). Las sesiones se gestionarán mediante tokens criptográficos JWT (JSON Web Tokens) con tiempo de expiración y revocación segura.
* **RNF-02 (Control de Acceso Basado en Roles - RBAC):** El sistema restringirá el acceso a vistas y operaciones según el rol del usuario: Administrador (acceso total), Subgerente (supervisión y asignación), Diseñadora (diseño y catálogo), Secretaria (órdenes y caja de taller) y Operario (órdenes asignadas y reporte de insumos).
* **RNF-03 (Registro de Auditoría):** Todas las acciones críticas (creación de órdenes, anulación, cobros, ajustes de stock y cierres de caja) quedarán registradas en una tabla de auditoría inmutable (usuario, fecha, hora, IP, acción y valores anteriores/nuevos).

### 10.2 Rendimiento y Tiempo de Respuesta
* **RNF-04 (Tiempos de Respuesta):** Los endpoints de consulta transaccional responderán en menos de 500 milisegundos bajo condiciones normales de red de 200 Mbps.
* **RNF-05 (Concurrencia):** El sistema soportará un mínimo de 10 usuarios simultáneos interactuando en las diferentes terminales de oficina y taller sin degradación de rendimiento.

### 10.3 Disponibilidad y Fiabilidad
* **RNF-06 (Disponibilidad Operativa):** Disponibilidad garantizada de al menos 99.5% durante el horario de atención comercial (Lunes a Sábado de 10:00 AM a 8:00 PM).
* **RNF-07 (Tolerancia a Fallos y Persistencia Local):** Las pantallas operativas de taller mantendrán almacenamiento temporal en navegador (IndexedDB) para evitar la pérdida de datos ante microcortes eventuales de red.

### 10.4 Usabilidad y Facilidad de Mantenimiento
* **RNF-08 (Facilidad de Aprendizaje):** Un usuario nuevo con nivel de alfabetización digital básico podrá registrar una proforma u orden de trabajo en menos de 5 minutos tras una inducción guiada de 30 minutos.
* **RNF-09 (Mantenibilidad del Código):** La arquitectura seguirá principios de modularidad y clean code, con suite de pruebas automatizadas (pytest) cubriendo las reglas de negocio críticas.

---

# 11. Otros Requerimientos
* **Capacitación Operativa Obligatoria:** Se contempla la ejecución de un programa de inducción in situ de 4 sesiones de 45 minutos dirigido al personal de oficina y operarios de taller.
* **Cumplimiento de la Ley N° 29733:** Almacenamiento seguro de datos de clientes, sin exposición pública de números de teléfono, DNI o direcciones.

---

# 12. Glosario
* **Contrato / Proforma:** Documento físico y digital que formaliza el requerimiento del cliente, monto de anticipo, saldo y compromiso de entrega.
* **Talón de Aire:** Talonario manual transitorio utilizado en mostrador para apuntes rápidos de pedidos en taller.
* **Regla de Goma (5m):** Parámetro estandarizado que calcula el consumo de 1 porción de pegamento por cada 5 metros lineales de material en gran formato.
* **Candado de Entrega:** Validación algorítmica que prohíbe entregar un pedido si mantiene saldo mayor a cero.
* **Cierre de Caja Dual:** Arqueo contable independiente que liquida por separado las cuentas operativas de Imprenta y Gigantografías.
* **RBAC (Role-Based Access Control):** Mecanismo de seguridad que restringe las acciones del sistema según el rol del usuario autenticado.
