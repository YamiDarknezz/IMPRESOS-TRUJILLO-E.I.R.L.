# Replanteamiento V2 — Sistema Impresos Trujillo
## Para Capstone — Ciclo 2026

---

## 1. Contexto del Proyecto

**Impresos Trujillo** es una imprenta familiar en Trujillo, Perú. Actualmente opera sin
un sistema formal de gestión: las órdenes se registran en cuadernos o hojas de cálculo,
el control de inventario es manual, y los pagos se llevan en libretas. Esto genera
problemas de pérdida de información, errores en el seguimiento de trabajos y falta de
visibilidad del negocio.

**El proyecto consiste en desarrollar un sistema web** que cubra la gestión de órdenes,
inventario, pagos, reportes financieros y un módulo de inteligencia artificial para
apoyo a la toma de decisiones.

---

## 2. Equipo del Proyecto (3 Desarrolladores)

| Rol | Nombre | Responsabilidad principal |
|-----|--------|---------------------------|
| **Líder de Proyecto / Full Stack** | Erick (Tú) | Arquitectura, backend, integración, coordinación con empresa |
| **Desarrollador Frontend** | [Integrante 2] | UI/UX, componentes Angular, dashboards |
| **Desarrollador Backend / IA** | [Integrante 3] | API, lógica de negocio, modelos de IA, reportes |

> Sistema **MultiRol**: todos participan en todas las fases, pero cada uno tiene un
> enfoque principal. En Scrum, todos son개발adores y todos participan en las ceremonies.

---

## 3. Stack Tecnológico Propuesto

| Capa | Tecnología | Justificación |
|------|-----------|---------------|
| Frontend | Angular 21 | Standalone components, tipado fuerte, escalable |
| Backend | FastAPI (Python 3.11) | Rápido, async, fácil de documentar con OpenAPI |
| Base de datos | PostgreSQL | Normalizado, robusto, escalable (migración desde cero) |
| Autenticación | JWT + bcrypt | Simple, seguro, sin dependencia de proveedores externos |
| IA | Scikit-learn / Prophet | Modelos de predicción de demanda y anomalias |
| Despliegue | Docker + Cloud Run | Sin cold start, costo mínimo |
| Control de versiones | Git + GitHub | Ramas por feature, PRs, code review |

### Por qué NO Firestore
- Firestore es NoSQL y dificulta las consultas complejas de BI
- No hay joins nativos, lo que complica reportes cruzados
- PostgreSQL permite funciones almacenadas, transacciones ACID y es el estándar para sistemas transaccionales

---

## 4. Los 3 Componentes Obligatorios

### Componente 1: Transaccional (Ciclos 1-4)

**Procesos reales del negocio:**

| Proceso | Descripción |
|---------|-------------|
| Gestión de órdenes | Crear, editar, cancelar órdenes de trabajo con pipeline de estados |
| Control de inventario | Stock con reserva al crear orden, ajuste al finalizar, alertas de mínimo |
| Gestión de pagos | Historial de pagos (adelanto + saldos), validación de entrega solo con pago completo |
| Gestión de clientes | CRUD con borrado lógico, historial de órdenes por cliente |
| Gestión de productos | Catálogo con receta de materiales, precios, tipos (propio/servicio/subcontratado) |
| Asignación de trabajadores | Asignar órdenes a personas, permisos por rol |

**Reglas de negocio clave:**
- Sin adelanto no se arranca el trabajo
- Sin pago completo no se entrega
- Stock se reserva al crear la orden, no al producir
- Cancelar devuelve el stock reservado
- Solo el admin puede crear/editar órdenes
- El trabajador solo ve sus órdenes asignadas

### Componente 2: Inteligencia de Negocios (Ciclos 5-7)

| Dashboard / Reporte | Descripción |
|---------------------|-------------|
| Dashboard principal | KPIs: órdenes del mes, ingresos, stock bajo, trabajos pendientes |
| Reporte de ingresos | Ingresos por período, método de pago, tendencia mensual |
| Reporte de inventario | Materiales con stock bajo, rotación, días de reabastecimiento |
| Reporte de productividad | Órdenes por trabajador, tiempos promedio de producción |
| Reporte de clientes | Top clientes, frecuencia, montos totales |
| Análisis de rentabilidad | Ingresos vs costos estimados por tipo de producto |
| Exportación Excel | Todos los reportes exportables a hojas de cálculo |

### Componente 3: Inteligencia Artificial (Ciclos 8-9)

| Modelo | Descripción |
|--------|-------------|
| **Predicción de demanda** | Modelo que predice qué materiales se necesitarán en las próximas semanas basado en histórico de órdenes |
| **Alertas inteligentes** | Detección de anomalías: órdenes con demoras inusuales, materiales con consumo fuera de patrón |
| **Sugerencia de precio** | Basado en costo de materiales + margen histórico + tipo de producto |

> Los modelos se entrenan con los datos reales generados por el sistema transaccional.
> Requieren mínimo 3-6 meses de datos para ser útiles.

---

## 5. Modelo de Datos (PostgreSQL)

### Tablas principales

```
usuarios
  id, nombre, email, password_hash, rol, activo, creado_en

clientes
  id, nombre, tipo, documento, telefono, email, direccion, notas, activo, creado_en

productos
  id, nombre, tipo (propio/servicio/subcontratado), precio_base, activo, creado_en

producto_materiales (receta)
  producto_id, material_id, cantidad_estimada

inventario
  id, nombre, unidad_id, stock_actual, alerta_minima, dias_reabastecimiento, activo

unidades
  id, nombre, abreviatura

ordenes
  id, cliente_id, asignado_a, descripcion, fecha_entrega_estimada,
  estado (pendiente/en_diseño/aprobado/en_producción/finalizada/entregada/cancelada),
  materiales_estimados (JSON), materiales_reales (JSON),
  creado_en, actualizado_en

orden_pagos
  id, orden_id, fecha, monto, metodo, tipo (adelanto/saldo), registrado_por

auditoria
  id, usuario_id, accion, tabla_afectada, registro_id, detalle, fecha
```

### Decisiones de diseño (mantenidas del original)

1. **Stock se reserva al crear la orden** — evita comprometer material ya asignado
2. **Al finalizar solo se ajusta la diferencia** — merma o devolución con confirmación
3. **Todo lo que toca stock va en transacción** — consistencia de inventario
4. **Pago es historial de eventos** — permite saber cuándo entró la plata
5. **Firestore bloqueado / Backend como único punto de acceso** — seguridad

---

## 6. Cronograma por Sprints (Scrum)

### Ciclo del curso: 16 semanas

| Sprint | Semanas | Componente | Entregable |
|--------|---------|------------|------------|
| **Sprint 0** | SEM 1-2 | Setup | Acta de Constitución, Business Case, setup del proyecto |
| **Sprint 1** | SEM 3-4 | Transaccional | CRUD de clientes + productos + inventario (funciones mínimas) |
| **Sprint 2** | SEM 5-6 | Transaccional | Órdenes con pipeline de estados + asignación + reserva de stock |
| **Sprint 3** | SEM 7-8 | Transaccional | Pagos + entregas + reglas de negocio (adelanto obligatorio, candado de entrega) |
| **Sprint 4** | SEM 9-10 | Transaccional | Roles/permisos + auditoría + funcionalidad completa |
| **Sprint 5** | SEM 11 | BI | Dashboards principales + reportes de ingresos |
| **Sprint 6** | SEM 12 | BI | Reportes de inventario + productividad + clientes + exportación Excel |
| **Sprint 7** | SEM 13-14 | IA | Modelo de predicción de demanda + alertas inteligentes |
| **Sprint 8** | SEM 15 | IA + Integración | Sugerencia de precio + integración completa |
| **Entrega** | SEM 16 | Final | Paper + Informe final + Entrega documentada |

### Hitos clave

| Semana | Hito | % Implementado |
|--------|------|----------------|
| SEM 4 | Funciones mínimas | ~15% |
| SEM 6 | Pipeline de órdenes funcional | ~30% |
| SEM 7 | Corte prácticas de campo | - |
| SEM 8 | Sistema transaccional completo | ~70% |
| SEM 9 | BI parcial | ~85% |
| SEM 10 | 100% implementado | 100% |
| SEM 11 | **Entrega a empresa** + pretest | - |
| SEM 12 | Responsabilidad social (4 pts) | - |
| SEM 13-14 | Cortes finales | - |
| SEM 15 | Evaluación entre equipos | - |
| SEM 16 | Paper + Informe final | - |

---

## 7. Estructura del Repositorio

```
impresos-trujillo/
├── frontend/                    # Angular 21
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/            # Guards, interceptors, servicios base
│   │   │   ├── shared/          # Componentes reutilizables
│   │   │   ├── features/
│   │   │   │   ├── auth/        # Login, registro
│   │   │   │   ├── dashboard/   # KPIs y resumen
│   │   │   │   ├── ordenes/     # CRUD órdenes + pipeline
│   │   │   │   ├── inventario/  # Gestión de stock
│   │   │   │   ├── clientes/    # CRUD clientes
│   │   │   │   ├── productos/   # CRUD productos + recetas
│   │   │   │   ├── pagos/       # Registro de pagos
│   │   │   │   ├── reportes/    # BI y reportes
│   │   │   │   └── ia/          # Predicciones y alertas
│   │   │   └── layout/          # Sidebar, header, navbar
│   │   └── environments/
│   └── angular.json
│
├── backend/                     # FastAPI (Python 3.11)
│   ├── app/
│   │   ├── main.py
│   │   ├── database.py
│   │   ├── auth/                # JWT, login, permisos
│   │   ├── models/              # SQLAlchemy ORM
│   │   ├── schemas/             # Pydantic
│   │   ├── routers/             # Endpoints
│   │   │   ├── auth.py
│   │   │   ├── clientes.py
│   │   │   ├── productos.py
│   │   │   ├── inventario.py
│   │   │   ├── ordenes.py
│   │   │   ├── pagos.py
│   │   │   ├── reportes.py
│   │   │   └── ia.py
│   │   ├── services/            # Lógica de negocio
│   │   └── tests/               # pytest
│   ├── Dockerfile
│   └── requirements.txt
│
├── docs/                        # Documentación del curso
│   ├── acta_constitucion.docx
│   ├── business_case.docx
│   ├── requerimientos_software.docx
│   └── notas_clase_profesor.md
│
└── docker-compose.yml
```

---

## 8. Documentos Requeridos (Summary)

| Documento | Semana | Estado |
|-----------|--------|--------|
| Acta de Constitución | SEM 1 | Pendiente |
| Business Case | SEM 1 | Pendiente |
| Documento de Requerimientos | SEM 1-2 | Pendiente |
| Prácticas de campo | SEM 7 | Pendiente |
| Entrega del software | SEM 11 | Pendiente |
| Informe de la empresa (pretest/postest) | SEM 11 | Pendiente |
| Responsabilidad social | SEM 12 | Pendiente |
| Paper + Informe final | SEM 16 | Pendiente |

---

## 9. Presupuesto Estimado (Borrador)

| Categoría | Ítem | Costo Estimado (S/) |
|-----------|------|---------------------|
| **Tecnología** | Dominio web (1 año) | 50 |
| **Tecnología** | Hosting Cloud Run (3 meses) | 0 (plan gratuito) |
| **Tecnología** | Base de datos PostgreSQL (Supabase free tier) | 0 |
| **Servicios** | Firebase Auth (plan gratuito) | 0 |
| **Recursos humanos** | Desarrolladores (estudiantes) | 0 (proyecto académico) |
| **Documentación** | Impresiones, carpetas | 30 |
| | **TOTAL** | **~80** |

> Nota: La empresa ya cuenta con infraestructura (computadoras, internet) que se
> reutilizará. Estos costos NO se consideran en el presupuesto del proyecto.

---

## 10. Riesgos Iniciales

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|-------------|---------|------------|
| La empresa no proporcione información a tiempo | 3/5 | 4/5 | Establecer reuniones semanales fijas con el contacto |
| Falta de datos históricos para IA | 4/5 | 3/5 | Generar datos de prueba realistas, postergar IA al final |
| Cambios de alcance por parte del cliente | 3/5 | 3/5 | Documentar alcance y límites desde el inicio (Acta de Constitución) |
| Conflictos de horario entre equipo | 2/5 | 2/5 | Usar herramientas de comunicación asíncrona, reuniones 1 vez por semana |
| Problemas de despliegue en producción | 2/5 | 4/5 | Dockerizar desde el inicio, probar en entorno similar a producción |

---

## 11. Suposiciones

- La empresa proporcionará acceso a información de prueba para el desarrollo
- El equipo tendrá disponibilidad de mínimo 20 horas semanales para el proyecto
- El contacto en la empresa estará disponible para consultas 1 vez por semana
- La empresa cuenta con computadoras e internet para probar el sistema
- Los datos de prueba serán representativos del negocio real

---

## 12. Restricciones

- El sistema debe ser web (accesible desde cualquier navegador)
- Debe funcionar en computadoras con especificaciones básicas
- No se requiere app móvil en esta fase
- El presupuesto es mínimo (proyecto académico)
- El plazo de entrega es la semana 11 del ciclo
- La IA requiere mínimo 3 meses de datos reales para ser útil
