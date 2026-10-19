# PLAN DE PRUEBAS UNITARIAS (PPU) — SPRINT 5 (SEMANA 08)
## Universidad Privada del Norte — Ciclo 2026-II
### Curso: Proyecto Capstone (Aula: 22643421416 | Grupo 2)
### Proyecto: Implementación de un sistema web transaccional con módulos de inteligencia de negocios e inteligencia artificial para la optimización de los procesos operativos y financieros en Impresos Trujillo E.I.R.L.

---

### Hoja de Control del Documento
* **Organismo:** Universidad Privada del Norte (UPN) / Impresos Trujillo E.I.R.L.
* **Proyecto:** Implementación de un sistema web transaccional con módulos de inteligencia de negocios e inteligencia artificial para la optimización de los procesos operativos y financieros en Impresos Trujillo E.I.R.L.
* **Entregable:** Plan de Pruebas Unitarias (PPU) — Sprint 5 / Semana 08
* **Autor:** Gerardo Erick Plasencia Torres, Jose Diego Rodríguez Vásquez, Jose Estibb Anhuaman Delgado (Grupo 2)
* **Versión / Edición:** 0100 (v1.0) | **Fecha Versión:** 16/10/2026
* **Aprobado por:** Marcell Magaly Vásquez Loje (Product Owner) & Ángel Almilcar Rodríguez Vásquez (Gerente Operativo / Jefe de Taller) | **Fecha Aprobación:** 16/10/2026

---

### Directivas Docentes Integradas (Observaciones Semana 9):
1. **Foco Estricto en Código e Interfaces Internas:** Las pruebas unitarias se orientan a funciones neurálgicas del sistema (`login()`, `crear_orden()`, `registrar_pago()`, `actualizar_stock_material()`, `cerrar_caja()`), excluyendo intencionalmente elementos de diseño visual, CSS o formularios HTML (los cuales corresponden al Plan de Pruebas Funcionales).
2. **Consistencia de Nomenclatura:** Los códigos `CA01`, `CA02`, `CA03`, `CA04` y `CA05` definidos en la matriz resumen se mantienen exactamente idénticos en todas las fichas de ejecución detalladas.
3. **Criterio de "Poner en Aprietos a la Función":** Cada caso cuenta con 6 intentos de prueba donde se evalúan entradas anómalas, valores negativos, nulos, inyecciones SQL/XSS, ataques de desbordamiento y violaciones de restricciones de integridad para demostrar la resiliencia y manejo de excepciones del backend.
4. **Respaldo de Ejecución Automatizada:** Todas las pruebas unitarias se ejecutan de forma automática mediante la suite de 257 tests automatizados en `pytest` implementada en FastAPI.

---

### 1. Matriz Resumen de Casos de Prueba Unitaria

| Número del Caso de Prueba | Componente | Descripción de lo que se Probará | Prerrequisitos |
|:---|:---|:---|:---|
| **CA01** | `login()` | Verificar autenticación segura de usuarios, control de contraseñas erróneas, bloqueo de inyecciones SQL/XSS, expiración de tokens JWT y rechazo de payloads desbordados. | Servicio FastAPI activo, base de datos PostgreSQL con tabla usuarios poblada y credenciales hash bcrypt. |
| **CA02** | `crear_orden()` | Validar registro de órdenes de trabajo, cálculo automático de cotización, reserva inmediata de stock de bobinas y regla del adelanto mínimo (50%). | Cliente registrado o corporativo, materiales en inventario con metraje disponible, caja abierta. |
| **CA03** | `registrar_pago()` | Comprobar registro de pagos parciales/totales, candado contra sobrepagos, validación de comprobante Yape/Plin y actualización de saldos. | Orden en estado PENDIENTE o EN_DISENO, sesión de caja activa. |
| **CA04** | `actualizar_stock_material()` | Verificar descuento de metraje cuadrado de rollos, impedimento de saldos negativos, cálculo de mermas técnicas y reajuste automático por edición. | Catálogo de materiales configurado, metraje positivo registrado en orden. |
| **CA05** | `cerrar_caja()` | Comprobar liquidación de arqueo diario por cajero, auditoría de discrepancias (sobrante/faltante), candado contra doble cierre y bloqueo de nuevas ventas. | Sesión de caja abierta en la jornada con movimientos de cobro registrados. |

---

### 2. Fichas de Ejecución Detallada

#### Ficha de Prueba: CA01 — Componente: `login()`
| Nº | Descripción | Método | Datos Entrada | Salida Esperada | ¿OK? | Observaciones |
|:---:|:---|:---:|:---|:---|:---:|:---|
| 1 | Autenticación exitosa con credenciales válidas de usuario administrador. | Automático | `username="admin@impresostrujillo.pe", password="Admin123*"` | `HTTP 200 OK (access_token JWT, token_type="bearer", exp=480m)` | **OK** | Generó token JWT firmado criptográficamente con algoritmo HS256 y claims de rol ADMIN. |
| 2 | Intento de autenticación con contraseña incorrecta (prueba de aprieto). | Automático | `username="admin@impresostrujillo.pe", password="ClaveErronea2026!"` | `HTTP 401 Unauthorized (detail="Credenciales de acceso incorrectas")` | **OK** | Rechazó la autenticación; verificación bcrypt comparó hashes sin filtrar detalles de usuario. |
| 3 | Intento de acceso con usuario inexistente en la base de datos. | Automático | `username="hacker_inexistente@externo.com", password="Pass123456"` | `HTTP 401 Unauthorized (detail="Credenciales de acceso incorrectas")` | **OK** | Respuesta opaca idéntica a clave incorrecta para mitigar enumeración de cuentas. |
| 4 | Inyección SQL en campo username para intentar bypass de autenticación. | Automático | `username="admin' OR '1'='1' --", password="any"` | `HTTP 422 Unprocessable Entity (error de validación de formato EmailStr)` | **OK** | Pydantic interceptó la cadena maliciosa antes de consultar el motor ORM parametrizado. |
| 5 | Envío de campos obligatorios vacíos o nulos en payload de login. | Automático | `username="", password=""` | `HTTP 422 Unprocessable Entity (detail="Field required")` | **OK** | Esquema de entrada rechazó los campos vacíos impidiendo consumo innecesario de CPU en bcrypt. |
| 6 | Payload desbordado con padding excesivo (> 10,000 car.) para saturar bcrypt. | Automático | `username="admin@impresostrujillo.pe", password="A"*12000` | `HTTP 422 Unprocessable Entity (detail="Longitud máxima de campo excedida (128 car.)")` | **OK** | Límite de longitud máxima en esquema previno ataques de denegación de servicio (DoS) por hashing. |

#### Ficha de Prueba: CA02 — Componente: `crear_orden()`
| Nº | Descripción | Método | Datos Entrada | Salida Esperada | ¿OK? | Observaciones |
|:---:|:---|:---:|:---|:---|:---:|:---|
| 1 | Registro estándar de orden con cliente válido y adelanto reglamentario del 50%. | Automático | `cliente_id=101, linea="GIGANTOGRAFIA", material_id=2 (Lona 13oz), 6m², total=120.00, adelanto=60.00` | `HTTP 201 Created (orden_id=225, estado="PENDIENTE", saldo=60.00, reserva stock 6m²)` | **OK** | Creó orden correctamente y reservó el metraje en inventario dentro de la misma transacción ACID. |
| 2 | Intento de creación de orden sin adelanto mínimo para cliente minorista. | Automático | `cliente_id=102, linea="IMPRENTA", total=250.00, adelanto=0.00, es_corporativo=False` | `HTTP 400 Bad Request (detail="Se requiere un adelanto mínimo del 50% (S/ 125.00)")` | **OK** | Regla de negocio del taller impidió la creación de orden sin pago inicial, protegiendo liquidez. |
| 3 | Intento de ingresar montos monetarios negativos en el total o adelanto. | Automático | `cliente_id=101, total=-80.00, adelanto=-40.00` | `HTTP 422 Unprocessable Entity (detail="El total debe ser estrictamente mayor a cero")` | **OK** | Validador numérico de Pydantic (gt=0) bloqueó la inserción de importes negativos. |
| 4 | Pedido de producción con metraje superior al stock remanente en taller. | Automático | `material_id=2, cantidad_m2=450.0 (Stock físico disponible: 35.0 m²)` | `HTTP 400 Bad Request (detail="Stock insuficiente de Lona 13oz. Disp: 35.0m², Sol: 450.0m²")` | **OK** | Disparó excepción de inventario e hizo rollback inmediato de la transacción relacional. |
| 5 | Registro de orden vinculada a un cliente inexistente (ID huérfano). | Automático | `cliente_id=999999, total=100.00, adelanto=50.00` | `HTTP 404 Not Found (detail="Cliente con ID 999999 no existe en el sistema")` | **OK** | Integridad referencial validada en capa de servicios antes de emitir la orden de trabajo. |
| 6 | Inyección de código malicioso XSS en observaciones técnicas de diseño. | Automático | `observaciones="<script>document.location='http://malicioso.com'</script>"` | `HTTP 201 Created (texto sanitizado en BD: &lt;script&gt;...)` | **OK** | Función de escape HTML neutralizó el script previniendo vulnerabilidades XSS en la interfaz web. |

#### Ficha de Prueba: CA03 — Componente: `registrar_pago()`
| Nº | Descripción | Método | Datos Entrada | Salida Esperada | ¿OK? | Observaciones |
|:---:|:---|:---:|:---|:---|:---:|:---|
| 1 | Registro de amortización parcial mediante Yape con número de operación. | Automático | `orden_id=200, monto=40.00 (Saldo pendiente S/ 70.00), medio="YAPE", nro_op="YAP-88319"` | `HTTP 201 Created (nuevo_saldo=30.00, estado_pago="PARCIAL", recibo emitido)` | **OK** | Registró el cobro, actualizó el saldo deudor y vinculó el movimiento al usuario en turno. |
| 2 | Intento de cobro con monto superior al saldo pendiente de la orden (sobrepago). | Automático | `orden_id=200, monto=95.00 (Saldo pendiente real: S/ 30.00)` | `HTTP 400 Bad Request (detail="El monto ingresado (S/ 95) excede el saldo pendiente (S/ 30)")` | **OK** | Candado financiero de cobro impidió discrepancias contables y generación de saldos ficticios. |
| 3 | Intento de registrar un pago con importe negativo o igual a cero. | Automático | `orden_id=200, monto=-25.00, medio_pago="EFECTIVO"` | `HTTP 422 Unprocessable Entity (detail="El monto del pago debe ser mayor que cero")` | **OK** | Pydantic validó restricción gt=0 en el esquema de request rechazando el pago. |
| 4 | Registro de pago asociado a una orden en estado anulada o cancelada. | Automático | `orden_id=185 (estado CANCELADA), monto=50.00` | `HTTP 400 Bad Request (detail="No se pueden registrar pagos en orden cancelada")` | **OK** | Máquina de estados bloqueó transacciones financieras sobre contratos rescindidos. |
| 5 | Envío de número de operación bancaria duplicado en el mismo día. | Automático | `medio_pago="PLIN", nro_operacion="PLN-44210" (ya registrado hoy)` | `HTTP 409 Conflict (detail="El número de comprobante ya fue registrado para hoy")` | **OK** | Restricción de unicidad en base de datos previno duplicación de ingresos digitales. |
| 6 | Registro de pago digital sin especificar número de operación bancaria. | Automático | `medio_pago="TRANSFERENCIA", nro_operacion=""` | `HTTP 422 Unprocessable Entity (detail="Nro de operación obligatorio para pagos digitales")` | **OK** | Regla condicional cruzada exigió código de trazabilidad bancaria para medios no presenciales. |

#### Ficha de Prueba: CA04 — Componente: `actualizar_stock_material()`
| Nº | Descripción | Método | Datos Entrada | Salida Esperada | ¿OK? | Observaciones |
|:---:|:---|:---:|:---|:---|:---:|:---|
| 1 | Descuento de metraje por consumo directo de orden finalizada en taller. | Automático | `material_id=1 (Vinil Gloss), cantidad=15.0 m², motivo="CONSUMO_ORDEN"` | `HTTP 200 OK (stock_anterior=85.0, stock_nuevo=70.0, kárdex generado)` | **OK** | Descontó inventario físico y persistió movimiento con responsable y timestamp. |
| 2 | Intento de ajuste manual que provocaría saldo negativo en almacén. | Automático | `material_id=3 (Lona Backlight), delta=-60.0 (Stock actual: 40.0 m²)` | `HTTP 400 Bad Request (detail="La operación generaría stock negativo (-20 m²)")` | **OK** | Check constraint en base de datos (stock >= 0) y validación de servicio impidieron saldo rojo. |
| 3 | Imputación de merma técnica ocurrida durante calibración de cabezales en plotter. | Automático | `material_id=2, cantidad=1.8 m², tipo="MERMA_CALIBRACION"` | `HTTP 200 OK (descuento 1.8 m², indicador de merma registrado para BI)` | **OK** | Registró desperdicio técnico asignándolo al centro de costos de gigantografía para BI. |
| 4 | Actualización de stock sobre un código de material inexistente en catálogo. | Automático | `material_id=9999, cantidad=10.0` | `HTTP 404 Not Found (detail="Material no catalogado en base de datos")` | **OK** | No afectó ningún registro y emitió error 404 limpio sin caídas de servidor. |
| 5 | Envío de valores de texto no numéricos en parámetro de metraje o stock. | Automático | `material_id=1, cantidad="quince_metros"` | `HTTP 422 Unprocessable Entity (detail="Input should be a valid number")` | **OK** | Coerción estricta de FastAPI/Pydantic bloqueó la solicitud antes de entrar a la base de datos. |
| 6 | Cancelación de orden de trabajo con restitución automática de insumos reservados. | Automático | `orden_id=210 (consumía 8.5 m²), accion="CANCELAR_ORDEN"` | `HTTP 200 OK (stock_restablecido=8.5 m², estado reserva revertido)` | **OK** | Garantizó que materiales de trabajos cancelados vuelvan al stock disponible sin descalce manual. |

#### Ficha de Prueba: CA05 — Componente: `cerrar_caja()`
| Nº | Descripción | Método | Datos Entrada | Salida Esperada | ¿OK? | Observaciones |
|:---:|:---|:---:|:---|:---|:---:|:---|
| 1 | Cierre de turno exitoso con coincidencia exacta entre sistema y efectivo físico. | Automático | `monto_declarado_efectivo=450.00 (Sistema reportó S/ 450.00)` | `HTTP 200 OK (caja_id=12, estado="CERRADA", discrepancia=0.00, candado activo)` | **OK** | Cuadre perfecto sin observaciones; generó resumen financiero discriminado por medio de pago. |
| 2 | Cierre con discrepancia física (faltante de caja) con justificación obligatoria. | Automático | `monto_declarado_efectivo=430.00 (Sistema calculó S/ 450.00), motivo="Vuelto erróneo"` | `HTTP 200 OK (estado="CERRADA_OBSERVADA", diferencia=-20.00, alerta auditoría)` | **OK** | El sistema registró el faltante y generó registro de auditoría sin frenar el cierre contable. |
| 3 | Intento de cerrar una sesión de caja ya liquidada previamente (doble cierre). | Automático | `caja_id=12 (ya en estado CERRADA), monto_declarado=450.00` | `HTTP 400 Bad Request (detail="La sesión de caja ya se encuentra CERRADA")` | **OK** | Candado de sesión impidió sobreescritura de liquidaciones contables ya emitidas. |
| 4 | Intento de cerrar sesión de caja de otro usuario sin rol de administrador. | Automático | `usuario_id=3 (Operario), intenta cerrar caja de usuario_id=2 (Cajero)` | `HTTP 403 Forbidden (detail="No tiene permisos para cerrar caja de terceros")` | **OK** | Control de acceso RBAC garantizó que cada cajero sea responsable de su propio arqueo. |
| 5 | Intento de registrar cobros u órdenes después de que la caja ha sido cerrada. | Automático | `Intenta registrar pago en orden 220 después del cierre de caja del turno` | `HTTP 400 Bad Request (detail="No existe sesión de caja abierta para cobros")` | **OK** | Candado digital estricto obliga a abrir formalmente una nueva sesión de caja antes de cobrar. |
| 6 | Ingreso de monto físico negativo en el arqueo de cierre de caja. | Automático | `monto_declarado_efectivo=-50.00` | `HTTP 422 Unprocessable Entity (detail="Monto declarado debe ser mayor o igual a cero")` | **OK** | Esquema de request rechazó importes negativos de efectivo en arqueo. |
