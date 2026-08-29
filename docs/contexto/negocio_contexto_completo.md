# Contexto del Negocio — Impresos Trujillo
## Consolidado para Capstone (actualizado: 28/08/2026)

---

## 1. Datos de la Empresa

| Campo | Dato |
|-------|------|
| Razón social | Impresos Trujillo |
| RUC | 20602572952 |
| Ubicación | Trujillo, Perú |
| Dirección | JR. Bolivar 945 |
| Teléfono | 924 943 790 |
| Horario de atención | 10 AM – 8 PM |
| Moneda | Soles peruanos (S/) |
| Zona horaria | UTC-5 (sin horario de verano) |

Número de RUC:
20602572952 - IMPRESOS TRUJILLO E.I.R.L.
Tipo Contribuyente:
EMPRESA INDIVIDUAL DE RESP. LTDA

Nombre Comercial:
-

Fecha de Inscripción:
25/10/2017

Fecha de Inicio de Actividades:
25/10/2017

Estado del Contribuyente:
ACTIVO

Condición del Contribuyente:
HABIDO

Domicilio Fiscal:
JR. SIMON BOLIVAR NRO. 945 INT. 1 TRUJILLO LA LIBERTAD - TRUJILLO - TRUJILLO

Sistema Emisión de Comprobante:
MANUAL

Actividad Comercio Exterior:
SIN ACTIVIDAD

Sistema Contabilidad:
MANUAL

Actividad(es) Económica(s):
Principal - 1811 - IMPRESIÓN
Secundaria 1 - 7310 - PUBLICIDAD
Comprobantes de Pago c/aut. de impresión (F. 806 u 816):
FACTURA
BOLETA DE VENTA
GUIA DE REMISION - REMITENTE
Sistema de Emisión Electrónica:
FACTURA PORTAL DESDE 23/10/2021
BOLETA PORTAL DESDE 23/06/2022
Emisor electrónico desde:
23/10/2021

Comprobantes Electrónicos:
FACTURA (desde 23/10/2021),GUIA (desde 27/10/2021),BOLETA (desde 23/06/2022)

Afiliado al PLE desde:
-

Padrones:
NINGUNO

---

## 2. Equipo Humano

### Dueños
| Nombre | Rol |
|--------|-----|
| Angel Almilcar Rodriguez Evangelista | Dueño / Encargado |
| Marcell Magaly Vasquez Loje | Dueña |

### Desarrollo del proyecto (Capstone)
| Nombre | Rol |
|--------|-----|
| Gerardo Erick Plasencia Torres | Líder de grupo / Coordinador |
| [Integrante 2] | Desarrollador Frontend |
| [Integrante 3] | Desarrollador Backend / IA |

### Personal del taller
- **Cantidad estimada:** 3 a 4 trabajadores
- **Nivel tecnológico:** Básico (ambos grupos: dueños y personal)

### Gobernabilidad de TI
- **No existe un área de TI formal.**
- El responsable técnico es a la vez desarrollador, administrador de infraestructura y usuario administrador.
- Constituye un **único punto de falla** del proyecto → declarar como riesgo.

---

## 3. El Negocio

### Qué produce y vende

| Categoría | Ejemplos |
|-----------|----------|
| Gran formato (producción propia) | Banners, gigantografías, carteles, lonas |
| Oficina / promocional | Agendas, lapiceros, llaveros |
| Personalizados | Tazas, trofeos, medallas, pulseras Tyvek |

- Parte se produce en el taller (impresión sobre vinilos, lonas, acrílicos).
- Parte se **subcontrata** a proveedores externos (lapiceros, llaveros, trofeos, diseños).
- Los productos se clasifican en: `propio` / `servicio` / `subcontratado`.

### Contexto operativo

| Dato | Valor |
|------|-------|
| Equipo de trabajo | ~4-5 personas |
| Computadoras en el taller | 6 a 8 |
| Conexión a internet | 200 Mbps |
| Métodos de pago | Efectivo, Yape, Transferencia |
| Software actual | Excel + cuaderno (inventario manual) |
| Sistema previo | Todo manual |

### Volumen del negocio

| Dato | Valor |
|------|-------|
| Pedidos por mes | 100 a 150 |
| Materiales en inventario | 800 a 1,000 |
| Movimiento mensual | ~S/ 30,000 |

### Planes de crecimiento
- Expansión enfocada en **más talleres de producción**.
- Rubro: Imprenta, Publicidad y Marketing.

---

## 4. Los 4 Problemas Principales

| # | Problema | Descripción |
|---|----------|-------------|
| 1 | **Sin control de inventario** | Se pueden aceptar dos trabajos que compiten por el mismo material sin advertirlo hasta que falta. |
| 2 | **Sin visibilidad de etapas** | No se sabe qué espera aprobación del cliente, qué está en producción y qué está listo para entregar. |
| 3 | **Sin registro confiable de cobranza** | No se conoce con precisión cuánto se cobró, por qué método, ni cuánto queda por cobrar en un período. |
| 4 | **Sin trazabilidad de responsabilidades** | No queda registro de qué trabajador ejecutó cada trabajo. |

**Problema adicional:** Falta de automatización y dependencia de presencia total de los dueños para cierre de caja.

---

## 5. Objetivos del Proyecto

| # | Objetivo |
|---|----------|
| 1 | Controlar el inventario de materiales en tiempo real, con alertas de stock bajo y tiempo de reabastecimiento por material. |
| 2 | Dar seguimiento a cada trabajo por etapas, desde que ingresa hasta que se entrega. |
| 3 | Conocer los ingresos reales por período, método de pago y trabajador. |
| 4 | Garantizar que no se entregue trabajo sin haber cobrado el total. |
| 5 | Permitir el trabajo desde celular, no solo desde computadora. |

---

## 6. Flujo del Negocio

```
1. Llega un cliente y pide algo (ej: una gigantografía de 3x2m).
2. Se cotiza y se registra la orden: qué es, para cuándo, cuánto cuesta,
   qué materiales va a consumir. Se cobra un ADELANTO OBLIGATORIO.
3. El trabajo pasa por etapas: puede requerir diseño y aprobación del cliente
   antes de imprimirse, o ir directo a producción.
4. Se produce, consumiendo material del inventario. El consumo real casi
   nunca coincide exactamente con lo estimado.
5. Se cobra el saldo. A veces el cliente lo paga antes de venir a buscar.
6. Se entrega al cliente — NUNCA antes de que haya pagado el total.
```

### Dos reglas del negocio clave

1. **El adelanto habilita la producción; el pago completo habilita la entrega.**
   No se trabaja sin adelanto, y no se entrega sin haber cobrado todo.

2. **Los materiales se comprometen al aceptar el trabajo, no al producirlo.**
   Si aceptás dos gigantografías y solo tenés lona para una, tenés un problema.

---

## 7. Pipeline de Producción

```
Pendiente → En diseño → Aprobado → En producción → Finalizada → Entregada

                    Cancelada  (fuera del flujo, devuelve stock)
```

### Reglas del servidor

| Regla | Por qué |
|-------|---------|
| A **Finalizada** solo se llega por "Reportar uso" | Es donde se ajusta el stock a las cantidades reales. |
| **No se puede marcar Entregada sin el pago completo** | El cliente no se lleva el trabajo sin haber pagado todo. |
| **Entregada es definitiva** — no se puede deshacer | El trabajo ya salió del taller. |
| **Cancelar** devuelve el stock reservado | No es solo cambiar una etiqueta. |
| **Editar y cancelar** solo mientras esté en el pipeline | Después de finalizar el stock ya se ajustó. |
| Se puede **retroceder dentro del pipeline** | Corregir una etapa mal marcada mientras sigue en el taller. |
| Una orden **cancelada** no cambia de estado | Terminal. |

---

## 8. Actores y Permisos

| Permiso | Administrador | Trabajador |
|---------|:------------:|:----------:|
| Ver órdenes | Todas | Solo asignadas + sin asignar |
| Crear / editar / cancelar orden | ✅ | ❌ |
| Asignar orden a alguien | ✅ | ❌ |
| Avanzar etapa de producción | ✅ | Solo sus órdenes |
| Reportar uso (finalizar) | ✅ | Solo sus órdenes |
| Confirmar pago | ✅ | Solo sus órdenes |
| Inventario | Crear / editar / ajustar | Solo lectura |
| Clientes, productos, unidades | ✅ | ❌ |
| Finanzas | Todo el negocio | Solo su monto generado |
| Auditoría | ✅ | ❌ |
| Dashboard | ✅ | ❌ |

**Validación:** Todos los permisos se validan en el servidor, no solo escondiendo botones.

---

## 9. Pantallas del Sistema

| # | Pantalla | Acceso | Contenido principal |
|---|----------|--------|---------------------|
| 1 | Inicio de sesión | Público | Correo y contraseña, mensajes de error, indicador de carga. |
| 2 | Órdenes | Ambos | Panel de métricas (admin): total, en proceso, finalizadas, por cobrar. Filtros por etapa, búsqueda, rango de fechas. Tabla con ID, cliente, asignado, fechas, finanzas, estado, etapa, acciones. |
| 3 | Formulario de orden | Solo admin | Cliente (selector + alta rápida), producto (autocompleta), descripción, fecha entrega, asignación, materiales estimados, finanzas (total, adelanto obligatorio, descuento, saldo, método pago). |
| 4 | Inventario | Admin edita / Trabajador lee | Material, stock, unidad, alerta mínima, días reabastecimiento, estado (OK / Stock bajo). |
| 5 | Finanzas | Ambos (alcance por rol) | Filtro fechas/trabajador. Tarjetas: ingresos, contratos, adelantos, por cobrar. Desglose por método pago. Tabla por trabajador (admin). Exportación CSV. |
| 6 | Clientes | Solo admin | Listado, búsqueda, alta/edición, ficha con historial de órdenes, facturado, por cobrar. |
| 7 | Productos | Solo admin | Catálogo: nombre, tipo (propio/servicio/subcontratado), precio base, receta de materiales. |
| 8 | Unidades de medida | Solo admin | Catálogo de unidades (nombre y abreviatura). |
| 9 | Auditoría | Solo admin | Historial: fecha, usuario, acción, documento, detalle. |

### Ventanas emergentes
- Reportar uso de materiales
- Confirmar pago (con selección de método)
- Editar material
- Ficha de cliente

---

## 10. Interfaces Externas

| Interfaz | Estado | Descripción |
|----------|--------|-------------|
| Cámara | ❌ No | El sistema no captura imágenes. Permisos del navegador bloquean cámara, micrófono y geolocalización. |
| Impresión de documentos | ⚠️ Factible | No hay generación actual, pero es factible considerar contratos o tickets. |
| WhatsApp | ✅ Sí | Comunicación con clientes. Los diseños manyas veces se reciben por WhatsApp. |
| Yape | ⚠️ A considerar | Vincular pago con contrato. |
| Integraciones externas | ❌ Ninguna | No se requieren otras integraciones. |

---

## 11. Requerimientos No Funcionales

| Requerimiento | Estado |
|---------------|--------|
| Rendimiento | ⚠️ Pendiente especificar |
| Usuarios simultáneos | 5 a 6 |
| Funcionamiento sin internet | No (requiere conexión permanente) |
| Disponibilidad | Sin SLA. Servicios gratuitos (no garantizan continuidad). |
| Usabilidad | Español, responsive, modo claro/oscuro, validación por campo, confirmación en acciones irreversibles. |
| Mantenibilidad | 42 pruebas automatizadas, documentación de contexto y decisiones. |

---

## 12. Stack Tecnológico Propuesto

| Capa | Tecnología | Justificación |
|------|-----------|---------------|
| Frontend | Angular 21 | SPA responsive (computadora + celular). Standalone components. |
| Backend | FastAPI (Python 3.11) | Lógica de negocio en servidor, validación, permisos, pruebas automatizadas. |
| Base de datos | PostgreSQL | Transacciones atómicas (descuento de inventario + creación de orden deben ser completos). |
| Despliegue | Docker + Cloud Run | Sin cold start, costo mínimo. |

### Justificación de costo
- Los tres componentes son de **código abierto y sin costo de licencia**.
- Se alinea con la restricción presupuestaria del proyecto.

---

## 13. Regulaciones

| Norma | Aplicabilidad |
|-------|---------------|
| Ley N° 29733 — Protección de Datos Personales | Aplica: se almacenan datos de clientes (nombre, RUC/DNI, teléfono, email, dirección). Falta confirmar registro ante ANPD. |
| SUNAT | No emite facturación electrónica. Guarda RUC/DNI informativo. |
| SUNAFIL | No maneja planillas, asistencia ni sueldos. No es sistema de RR.HH. |

### Medidas de seguridad implementadas
- Acceso con usuario y contraseña (nunca en texto plano).
- Contraseña mínima de 8 caracteres y verificación de sesiones revocadas.
- Control de acceso por roles validado en el servidor.
- Base de datos cerrada a accesos directos desde el navegador.
- Registro de auditoría de todas las operaciones.
- Comunicación cifrada (HTTPS) y cabeceras de seguridad.
- Credenciales de servicio con permisos acotados.
- **Pendiente:** copias de seguridad automáticas (bloqueado por presupuesto).

---

## 14. Decisiones de Diseño

| Decisión | Descripción |
|----------|-------------|
| **D1 — Stock se reserva al crear la orden** | Se descuentan materiales estimados inmediatamente. Si no alcanza, la orden no se crea. Evita comprometer material ya asignado. |
| **D2 — Al finalizar solo se ajusta la diferencia** | Si usaste más: merma. Si usaste menos: devolución con confirmación explícita. |
| **D3 — Todo lo que toca stock va en transacción** | Lecturas antes de escrituras. Consistencia de inventario. |
| **D4 — Pago es historial de eventos** | Cada pago registra fecha, monto, método, tipo. Permite saber cuándo entró la plata. |
| **D4b — Pago condiciona la entrega** | Adelanto obligatorio + pago completo para entregar. |
| **D5 — Contratos e Ingresos usan fechas distintas** | Contratos = fecha de creación. Ingresos = fecha real del pago. |
| **D6 — Backend como único punto de acceso** | Seguridad: toda la lógica de permisos vive en el servidor. |
| **D7 — Unidad de medida sale de catálogo** | Evita errores de tipeo. |
| **D8 — Productos propios tienen receta** | Conecta catálogo con inventario. Autocompleta materiales al crear orden. |

---

## 15. Alcance: Qué se Descartó

| Se descartó | Razón |
|-------------|-------|
| Plan de pagos por cuotas múltiples | Adelanto + saldo cubre el día a día. |
| Descuentos por línea o porcentaje | Alcanza un campo simple sobre el total. |
| Límite de crédito por cliente | Innecesario para el tamaño del negocio. |
| Lista de precio por cliente | Idem. |
| Etapa "En acabados" en el pipeline | 6 estados alcanzan. |
| Email/dirección obligatorios en cliente | Muchos trabajos son rápidos e informales. |
| Registro abierto de usuarios | Equipo chico, se crean a mano. |

---

## 16. Pendientes Conocidos

| Pendiente | Estado |
|-----------|--------|
| Copias de seguridad automáticas | Bloqueado por plan Blaze (PEN 100 reembolsable). |
| Migración a Cloud Run | Elimina cold start. Dockerfile ya compatible. |
| Solo 2 momentos de pago por orden | La estructura soporta historial completo, pero la interfaz solo permite adelanto + final. |
| Sin costos ni margen | Finanzas es puro ingreso; no sabe cuánto costó producir. |
| Órdenes de compra a proveedores | No implementado para subcontratados. |
| Alertas automáticas | Órdenes vencidas o stock bajo (hoy solo se ven en pantalla). |
| Dominio propio | Planeado, no comprado. |

---

## 17. Glosario

| Término | Definición |
|---------|------------|
| Orden / Orden de trabajo | El pedido de un cliente. |
| Material / Insumo | Lo que se consume para producir (lona, vinilo, acrílico, tinta). |
| Producto / Servicio | Lo que se le vende al cliente; puede tener receta de materiales. |
| Receta | Lista de materiales y cantidades que consume un producto propio. |
| Reservar stock | Descontar del inventario al crear la orden, aunque no se haya producido. |
| Merma | Material consumido por encima de lo estimado. |
| Devolución | Material estimado que no se usó y vuelve al inventario. |
| Adelanto | Pago parcial al hacer el pedido. |
| Saldo pendiente | Lo que falta cobrar (total − descuento − pagos recibidos). |
| Días de reabastecimiento | Cuántos días demora reponer un material desde que se pide. |
| Asignar una orden | Designar qué trabajador es responsable de ese trabajo. |
| Subcontratar / Tercerizar | Mandar a producir un ítem a un proveedor externo. |
| Yape | Aplicación de pago móvil peruana. |

---

## 18. Resumen de Cobertura para Documentos

| Documento | Respondido | Por validar | Falta |
|-----------|:----------:|:-----------:|:-----:|
| Acta de Constitución | 2 | 4 | 6 |
| Business Case | 2 | 4 | 8 |
| Requerimientos de Software | 9 | 5 | 2 |
| **Total** | **13** | **13** | **16** |
