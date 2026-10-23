# ESPECIFICACIÓN DE REQUERIMIENTOS DE SOFTWARE (SRS)
## Estándar IEEE Std 830-1998
### Universidad Privada del Norte — Ciclo 2026-II
### Curso: Proyecto Capstone (Aula: 22643421416 | Grupo 2)
### Organización Cliente: Impresos Trujillo E.I.R.L.

---

## HISTORIAL DE VERSIONES

#### TABLA 1: HISTORIAL DE VERSIONES
| Fecha | Versión | Autor | Organización | Descripción |
|:---|:---|:---|:---|:---|
| 28/08/2026 | 1.0 | Gerardo Erick Plasencia Torres | UPN - Capstone | Elaboración inicial de especificación según estándar IEEE 830. |
| 04/09/2026 | 1.1 | Jose Estibb Anhuaman Delgado | UPN - Capstone | Reubicación formal de autenticación a Requerimientos No Funcionales. |
| 11/09/2026 | 1.2 | Jose Diego Rodriguez Vasquez | UPN - Capstone | Detalle de reglas de negocio para recetas y mermas de impresión. |
| 26/09/2026 | 1.3 | Gerardo Erick Plasencia Torres | UPN - Capstone | Consolidación y validación para el cierre formal del hito T1. |

---

## INFORMACIÓN DEL PROYECTO

#### TABLA 2: INFORMACIÓN DEL PROYECTO
| Empresa / Organización | Impresos Trujillo E.I.R.L. |
|:---|:---|
| **Proyecto** | Implementación de un sistema web transaccional con módulos de inteligencia de negocios e inteligencia artificial para la optimización de los procesos operativos y financieros en Impresos Trujillo E.I.R.L. |
| **Fecha de preparación** | 28 de agosto de 2026 |
| **Cliente** | Angel Almilcar Rodríguez Evangelista / Marcell Magaly Vásquez Loje |
| **Patrocinador principal** | Universidad Privada del Norte (UPN) |
| **Gerente / Líder de Proyecto** | Gerardo Erick Plasencia Torres |
| **Gerente / Líder de Análisis de negocio y requerimientos** | Jose Estibb Anhuaman Delgado / Jose Diego Rodriguez Vasquez |

---

## APROBACIONES

#### TABLA 3: APROBACIONES FORMALES
| Nombre y Apellido | Cargo | Departamento u Organización | Fecha | Firma |
|:---|:---|:---|:---|:---|
| **Angel Almilcar Rodríguez Evangelista** | Gerente / Jefe de Taller | Impresos Trujillo E.I.R.L. | 28/08/2026 | __________________ |
| **Marcell Magaly Vásquez Loje** | Gerente / Jefa de Oficina | Impresos Trujillo E.I.R.L. | 28/08/2026 | __________________ |
| **Gerardo Erick Plasencia Torres** | Líder de Proyecto Capstone | Universidad Privada del Norte | 28/08/2026 | __________________ |
| **Jose Estibb Anhuaman Delgado** | Analista de Requerimientos | Universidad Privada del Norte | 28/08/2026 | __________________ |

---

## 1. PROPÓSITO

El presente documento define formalmente la Especificación de Requerimientos de Software (SRS) para el desarrollo e implantación del sistema web integral de gestión en **Impresos Trujillo E.I.R.L.**, bajo las directrices del estándar internacional **IEEE Std 830-1998**.

El software tiene como propósito sustituir la operatoria física tradicional basada en talonarios de papel y cuadernos de notas por una solución web moderna, automatizando el flujo completo desde la cotización y emisión del pedido hasta el cobro en caja, la asignación de materiales en taller, el monitoreo analítico gerencial y la predicción de insumos mediante inteligencia artificial.

El sistema comprende tres submódulos articulados:
1. **Submódulo Transaccional Operativo:** Emisión de órdenes con formato de Contrato/Proforma, registro de cobros con candado digital y control de stock por recetas.
2. **Submódulo de Inteligencia de Negocios (BI):** Dashboards ejecutivos con métricas de ventas, rentabilidad y productividad por operario.
3. **Submódulo de Inteligencia Artificial (IA):** Modelo predictivo de series temporales para estimar la demanda mensual de rollos de lona y vinil.

---

## 2. ALCANCE DEL PRODUCTO / SOFTWARE

### 2.1 Beneficios del Sistema:
1. **Reducción del tiempo de atención:** Disminución del tiempo de emisión de órdenes de trabajo de 18.5 minutos a menos de 5 minutos por cliente.
2. **Cero fugas de cobranza:** Erradicación del 100% de pérdidas ocasionadas por entregas de trabajos con saldos pendientes sin liquidar en caja.
3. **Trazabilidad absoluta:** Eliminación total de traspapeleo o extravío de hojas físicas en taller mediante un pipeline digital de estados.
4. **Continuidad de producción:** Prevención de desabastecimiento de insumos críticos mediante alertas tempranas y reserva por receta.
5. **Decisiones estratégicas oportunas:** Disponibilidad inmediata de indicadores financieros consolidados sin requerir arqueos manuales en papel.

### 2.2 Alcance del Software:
El sistema abarcará la gestión de clientes, catálogo de productos con fórmulas de consumo por m², talonario virtual correlativo, estados de producción en taller, gestión de cobros multicanal (efectivo, Yape, transferencias), arqueo de caja diario segregado, tableros BI interactivos y predicción de compras con IA.

### 2.3 Límites del Alcance (Lo que NO incluye):
- No incluye facturación electrónica directa con la API de SUNAT (la emisión formal se mantiene vía Portal SOL).
- No contempla aplicaciones móviles nativas para tiendas Play Store ni App Store (arquitectura SPA web responsive).
- No incorpora pasarela de pagos con débito automático en línea.
- No incluye módulos de recursos humanos ni cálculo de planillas de sueldos (SUNAFIL).

---

## 3. REFERENCIAS

1. **IEEE Std 830-1998:** *IEEE Recommended Practice for Software Requirements Specifications*. Institute of Electrical and Electronics Engineers.
2. **ISO/IEC/IEEE 29148:2018:** *Systems and software engineering — Life cycle processes — Requirements engineering*.
3. **ISO/IEC 25010:2011:** *Systems and software engineering — Systems and software Quality Requirements and Evaluation (SQuaRE) — System and software quality models*.
4. **Ley N° 29733:** *Ley de Protección de Datos Personales del Perú* y su Reglamento aprobado por D.S. N° 003-2013-JUS.
5. **Resolución de Superintendencia N° 007-99/SUNAT:** *Reglamento de Comprobantes de Pago del Perú*.

---

## 4. FUNCIONALIDADES DEL PRODUCTO

1. **Gestión Comercial y Emisión de Órdenes:** Registro rápido de clientes, catálogo parametrizable de productos gráficos y generación digital de órdenes de trabajo con numeración correlativa y cálculo automático de IGV.
2. **Control de Cobros y Candado de Caja:** Registro cronológico de anticipos y liquidaciones, arqueo diario de caja segregado (Imprenta vs Gigantografías) y restricción estricta de entrega para pedidos con saldo pendiente.
3. **Control de Inventario y Consumo por Recetas:** Deducción automática de rollos de lona, vinil adhesivo y tintas según las dimensiones de cada trabajo, y ajuste de mermas al finalizar la producción.
4. **Seguimiento Visual de Producción en Taller:** Tablero operativo de estados de trabajo para operarios y diseñadores (Pendiente, En Taller, Terminado, Entregado).
5. **Inteligencia de Negocios y Analítica:** Tableros gerenciales con indicadores de ingresos, saldos por cobrar, productos más rentables y exportación nativa a Excel 2021 (.xlsx).
6. **Módulo Predictivo de Demanda (IA):** Algoritmo de aprendizaje automático para pronóstico mensual de consumo de materiales gráficos críticos.

---

## 5. CLASES Y CARACTERÍSTICAS DE USUARIOS

> *Nota Metodológica:* Siguiendo la observación del docente, en esta sección se incluyen **exclusivamente las clases de usuarios de la empresa que MANIPULAN directamente el software**. Los clientes externos de mostrador no operan el sistema y quedan excluidos.

| Clase de Usuario | Perfil y Cargo en la Empresa | Nivel Técnico y Habilidades Digitales | Frecuencia de Uso | Necesidad de Capacitación |
|:---|:---|:---|:---|:---|
| **Administradora de Oficina** | Marcell Magaly Vásquez Loje (Jefa de Oficina y Comercial) | Usuario intermedio. Manejo fluido de Microsoft Excel, WhatsApp Desktop y portal web SUNAT. | Continuo (8 horas diarias en mostrador) | Capacitación en emisión rápida de órdenes digitales, gestión de clientes y arqueo de caja segregado (2 sesiones de 45 min). |
| **Jefe de Taller y Producción** | Angel Almilcar Rodríguez Evangelista (Gerente / Jefe de Producción) | Usuario intermedio. Experiencia en software RIP PhotoPrint y sistemas operativos Windows. | Frecuente (intermitente entre oficina y taller) | Capacitación en asignación de órdenes a operarios, control de stock de insumos y lectura de tableros BI gerenciales (2 sesiones de 45 min). |
| **Operarios y Diseñadores Gráficos** | Diseñadores y técnicos de taller (Alexis, Aldair, Gabriel) | Usuario técnico avanzado en diseño gráfico (Illustrator, CorelDRAW, RIP) pero con nula experiencia previa en ERPs o sistemas web transaccionales. | Frecuente (actualización de estados en máquinas y registro de mermas) | Capacitación en interfaz visual del tablero de producción, cambio de estados de orden y registro de consumos reales de taller (2 sesiones de 30 min). |

---

## 6. ENTORNO OPERATIVO

El software opera en un entorno web cliente-servidor distribuido bajo las siguientes condiciones de hardware y software:
- **Lado Cliente (Estaciones de Trabajo de Impresos Trujillo):**
  - Sistemas operativos: Microsoft Windows 10 Pro 64-bit y Windows 11 Pro 64-bit.
  - Navegadores compatibles: Google Chrome (versión 120 o superior) y Microsoft Edge (versión 120 o superior).
  - Resolución de pantalla recomendada: 1920x1080 píxeles (mínimo soportado: 1366x768 píxeles).
  - Hardware de usuario: Procesadores Intel Core i5/i7 con 8 GB a 16 GB de memoria RAM.
- **Lado Servidor (Infraestructura de Producción):**
  - Servidor VPS propio: Linux Ubuntu 24.04 LTS (2 vCPU, 4 GB RAM, 60 GB SSD NVMe).
  - Motor de Contenedores: Docker Engine 26+ con Docker Compose.
  - Servidor Web y Proxy Inverso: Nginx con certificados SSL/TLS emitidos por Let's Encrypt.
  - Base de Datos: PostgreSQL 16 nativo en contenedor Docker.
  - Entorno Backend: Python 3.11 con framework FastAPI y dependencias Pydantic v2 y SQLAlchemy 2.

---

## 7. REQUERIMIENTOS FUNCIONALES

> *Nota Metodológica:* Los requerimientos funcionales se encuentran clasificados estrictamente por **procesos de negocio reales de la imprenta**, atendiendo a la directriz docente de que el sistema gestiona operaciones reales y no meros formularios. La autenticación y gestión de credenciales se traslada a la Sección 10.

### 7.1 Proceso 1: Gestión Comercial y Emisión de Órdenes de Trabajo

- **RF-01: Gestión de Directorio de Clientes:** El sistema permitirá registrar, consultar y actualizar los datos de clientes comerciales (Razón Social o Nombre, RUC o DNI, teléfono móvil de contacto y dirección).
- **RF-02: Catálogo Parametrizable de Productos y Recetas:** El sistema permitirá configurar productos gráficos clasificados en tres naturalezas: propios (lona, vinil, gigantografía), servicios de taller (corte, diseño, ojillado) y tercerizados (sellos de jebe, encuadernación rústica), asociando fórmulas de insumos por metro cuadrado.
- **RF-03: Emisión de Orden con Formato Talonario Contrato/Proforma:** El sistema generará órdenes de trabajo asignando automáticamente un número correlativo único estructurado, calculando el subtotal, el desglose opcional de IGV (18%) y el monto total en soles (S/).
- **RF-04: Impresión y Descarga de Comprobante Interno:** El sistema permitirá imprimir el comprobante de la orden en formato optimizado para impresoras térmicas o estándar, replicando la estructura del talonario físico.
- **RF-05: Modificación de Pedidos en Estado Pendiente:** El sistema permitirá modificar los ítems de una orden únicamente mientras se encuentre en estado "Pendiente" y no haya iniciado trabajo en taller.

### 7.2 Proceso 2: Control de Cobros y Liquidación de Caja

- **RF-06: Registro Cronológico de Cobros y Anticipos:** El sistema permitirá registrar pagos vinculados a una orden de trabajo indicando fecha, hora, monto, medio de pago (Efectivo, Yape/Plin o Transferencia bancaria) y referencia de comprobante.
- **RF-07: Candado Digital de Despacho (Regla Estricta):** El sistema bloqueará de manera automática el cambio de estado de una orden a "Entregado" si el campo `saldo_pendiente` es mayor a S/ 0.00, exigiendo el registro de la liquidación previa en caja.
- **RF-08: Arqueo Diario y Cierre de Caja Segregado:** El sistema consolidará al cierre de jornada los ingresos totales por usuario y segregará los montos recaudados entre las líneas operativas de Imprenta y Gigantografías, facilitando la conciliación con el efectivo físico y las cuentas digitales.

### 7.3 Proceso 3: Control de Inventario y Consumo por Receta

- **RF-09: Reserva Automática de Insumos al Crear Orden:** Al crearse una orden de trabajo de gigantografía o imprenta, el sistema descontará preventivamente de la disponibilidad de inventario la cantidad de lona, vinil o papel calculada por la receta según el metraje solicitado.
- **RF-10: Registro de Mermas y Ajuste de Producción en Taller:** Al marcar una orden como "Terminado", el sistema permitirá al operario de taller registrar metros lineales o metros cuadrados adicionales consumidos por fallas de ripeo o mermas de ajuste de máquina.
- **RF-11: Alertas de Stock Mínimo Crítico:** El sistema emitirá alertas visuales cuando el inventario disponible de insumos clave caiga por debajo del umbral de seguridad fijado por el Jefe de Taller.

### 7.4 Proceso 4: Trazabilidad y Pipeline de Producción en Taller

- **RF-12: Tablero Visual de Estados de Trabajo:** El sistema proveerá una vista de pipeline con cuatro estados operativos secuenciales: `Pendiente` (creado en oficina), `En Taller` (tomado por maquinista/diseñador), `Terminado` (fabricación finalizada y control de calidad aprobado) y `Entregado` (despachado al cliente con saldo liquidado).
- **RF-13: Asignación de Maquinaria y Operario:** El sistema permitirá asignar cada orden a una máquina específica (ej. Wit-Color Ultra 1000) y a un operario responsable.

### 7.5 Proceso 5: Inteligencia de Negocios y Predicción con IA

- **RF-14: Dashboard Gerencial de Ventas y Rendimiento:** El sistema mostrará cuadros de mando interactivos con ingresos diarios, semanales y mensuales, tasa de pedidos liquidados y volumen de producción por operario.
- **RF-15: Exportación Tabular a Microsoft Excel 2021:** El sistema permitirá exportar todas las tablas analíticas y de auditoría de caja en formato nativo `.xlsx`, garantizando compatibilidad absoluta con Microsoft Office 2021 LTSC.
- **RF-16: Predicción Mensual de Demanda de Insumos (IA):** El sistema proyectará la demanda mensual de rollos de lona banner y vinil adhesivo mediante un modelo de aprendizaje automático entrenado con datos históricos, recomendando la fecha y cantidad óptima de reabastecimiento.

---

## 8. REGLAS DE NEGOCIO

- **RN-01 (Numeración Correlativa Inmutable):** Toda orden de trabajo generada tendrá un correlativo numérico autoincremental único. Queda estrictamente prohibida la eliminación física de órdenes emitidas; únicamente se permite su anulación motivada por auditoría.
- **RN-02 (Anticipo Mínimo de Trabajo):** No se creará ninguna orden de trabajo si el cliente no aporta un anticipo mínimo del 50% del costo total pactado, salvo autorización expresa y documentada de la Gerencia General.
- **RN-03 (Candado Digital de Entrega):** Ningún producto podrá ser marcado como "Entregado" si existe un saldo pendiente por cobrar mayor a S/ 0.00. El botón de despacho permanecerá inhabilitado por software hasta la liquidación del cobro.
- **RN-04 (Segregación de Caja):** Los fondos recaudados en efectivo y medios digitales deben estar segregados entre la actividad de Gigantografías y la de Imprenta Comercial al momento de emitir el arqueo diario.
- **RN-05 (Reserva de Material Gráfico):** La reserva de insumos se efectúa multiplicando las dimensiones del arte (base x altura en metros) por el factor de desperdicio técnico fijado en el catálogo para cada sustrato.
- **RN-06 (Auditoría de Modificaciones):** Todo cambio en precios, anulación de orden o ajuste manual de inventario registrará automáticamente el usuario, fecha, hora y justificación del evento.

---

## 9. REQUERIMIENTOS DE INTERFACES EXTERNAS

### 9.1 Interfaces de Usuario (UI)
- **Diseño Responsive:** La interfaz se adaptará de forma fluida a pantallas de computadoras de escritorio (resoluciones panorámicas) y dispositivos móviles en taller.
- **Maquetación Directa en Código:** Se diseña e implementa directamente en componentes de Angular 21, replicando la paleta institucional y la estructura de casillas del talonario comercial físico de la imprenta.
- **Notificaciones Contextuales:** Alertas no invasivas de confirmación de operaciones, advertencias de stock mínimo y mensajes claros de validación.

### 9.2 Interfaces de Hardware
- **Impresoras de Taller:** El sistema interactúa de manera indirecta con la impresora de gran formato Wit-Color Ultra 1000 a través de los archivos de salida generados en las estaciones de RIP en red.
- **Impresoras de Comprobantes:** Compatibilidad con impresoras de oficina conectadas vía USB o red local para la emisión de contratos y hojas de trabajo en taller.

### 9.3 Interfaces de Software
- **FastAPI Backend REST API:** Comunicación síncrona/asíncrona mediante endpoints REST y serialización JSON.
- **PostgreSQL 16 en Docker:** Motor relacional para la persistencia transaccional con integridad referencial estricta.
- **Microsoft Office 2021 LTSC:** Generación nativa de archivos `.xlsx` compatibles con Excel 2021 mediante librerías de backend sin requerir licencias ofimáticas del servidor.

### 9.4 Interfaces de Comunicación
- **Protocolo HTTPS:** Toda la comunicación entre navegadores cliente y el servidor VPS se transmite cifrada mediante protocolo HTTPS con TLS 1.3.
- **Formato de Intercambio:** Uso exclusivo de JSON estándar codificado en UTF-8 para todas las peticiones y respuestas de la API.

---

## 10. REQUERIMIENTOS NO FUNCIONALES

> *Nota Metodológica:* Atendiendo a la retroalimentación del docente (*"AUTENTICACION NO ES FUNCIONALIDAD, MOVERLA A NO FUNCIONAL"*), la autenticación, roles de acceso y seguridad se establecen aquí como atributos de calidad del software bajo la norma ISO/IEC 25010.

### 10.1 Seguridad y Control de Acceso (Autenticación y Autorización)
- **RNF-01 (Autenticación Basada en Tokens JWT):** El acceso al sistema requerirá autenticación obligatoria mediante usuario y contraseña, emitiendo tokens criptográficos JSON Web Tokens (JWT) con expiración temporal configurada a 8 horas.
- **RNF-02 (Cifrado de Credenciales):** Las contraseñas de los usuarios se almacenarán en la base de datos protegidas mediante algoritmo de derivación de claves criptográficas robusto (Bcrypt / Argon2), prohibiéndose el almacenamiento en texto plano.
- **RNF-03 (Control de Acceso Basado en Roles - RBAC):** El sistema segregará los privilegios en tres perfiles:
  - *Administrador / Gerencia:* Acceso irrestricto a caja, configuración de catálogo, anulación de órdenes y dashboards BI.
  - *Operador de Oficina:* Emisión de órdenes, registro de clientes y cobro de anticipos.
  - *Operador de Taller:* Visualización del pipeline de producción, cambio de estados de trabajo y registro de mermas.

### 10.2 Rendimiento y Eficiencia
- **RNF-04 (Tiempo de Respuesta en Transacciones):** El tiempo medio de respuesta para la creación de órdenes de trabajo y registro de pagos no superará los 1.5 segundos bajo condiciones normales de red local.
- **RNF-05 (Carga Inicial de la Aplicación):** La carga inicial de la aplicación SPA en Angular no excederá los 2.0 segundos en navegadores con caché habilitada.

### 10.3 Fiabilidad y Disponibilidad
- **RNF-06 (Disponibilidad Operativa):** El sistema garantizará una disponibilidad mínima del 99.0% durante el horario de atención comercial de la empresa (lunes a sábado de 8:00 AM a 8:00 PM).
- **RNF-07 (Tolerancia a Cortes Eléctricos):** La base de datos PostgreSQL operará con transacciones atómicas (ACID) y persistencia en volúmenes Docker respaldados, asegurando que ante un corte súbito de fluido eléctrico no se corrompan los datos.

### 10.4 Mantenibilidad y Portabilidad
- **RNF-08 (Despliegue Contenedorizado):** El backend, la base de datos y los servicios auxiliares deben empaquetarse en contenedores Docker estandarizados, permitiendo su migración o replicación en minutos mediante Docker Compose.

---

## 11. OTROS REQUERIMIENTOS

1. **Políticas de Respaldo Automatizado:** Configuración de copias de seguridad automáticas diarias de la base de datos PostgreSQL exportadas a almacenamiento cifrado.
2. **Compatibilidad con Entorno Operativo Existente:** El software no requerirá componentes de pago de terceros ni hardware adicional en las computadoras de Impresos Trujillo E.I.R.L.
3. **Resguardo de Datos Personales:** Cumplimiento estricto de la Ley N° 29733 de Datos Personales en el almacenamiento de DNI, nombres y teléfonos de clientes.

---

## 12. GLOSARIO

- **Autocopiante:** Papel químico especial utilizado para talonarios que permite duplicar o triplicar la escritura sin usar papel carbón.
- **Bcrypt:** Función criptográfica unidireccional de derivación de claves diseñada para el hashing seguro de contraseñas.
- **Candado Digital:** Validación obligatoria de software que bloquea la acción de entrega física de un pedido mientras figure saldo pendiente en caja.
- **IEEE 830:** Estándar internacional del Institute of Electrical and Electronics Engineers para la especificación formal de requerimientos de software.
- **JWT:** JSON Web Token (estándar abierto RFC 7519 para transmisión segura de afirmaciones de identidad entre partes).
- **Lona Banner 13 oz:** Material vinílico industrial pesado comúnmente empleado en gigantografías y publicidad exterior.
- **Merma:** Porción de sustrato o tinta consumida en pruebas de calce, corte o desperdicio técnico durante la producción gráfica.
- **RBAC:** Role-Based Access Control (modelo de seguridad que restringe el acceso a funciones y vistas según el rol asignado al usuario).
- **Receta de Insumos:** Relación cuantitativa que define cuánta materia prima (tinta, metros de vinil, adhesivo) consume una unidad de producto gráfico terminado.
