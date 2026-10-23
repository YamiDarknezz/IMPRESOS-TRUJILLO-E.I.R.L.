# AUDITORÍA EXHAUSTIVA Y ANCLAJE METODOLÓGICO: SEMANA 01
## Proyecto Capstone — Ciclo 2026-II
### Entregables Evaluados: Acta de Constitución, Business Case, Requerimientos de Software (IEEE 830)

---

## 1. INTRODUCCIÓN Y ALCANCE DE LA AUDITORÍA

Esta auditoría revisa de manera forense los tres entregables iniciales del proyecto frente a:
1. Las plantillas oficiales provistas por el docente en `docs/plantillas/SEM01/`.
2. Las notas de retroalimentación de clase de Semana 1 y Semana 2 (`docs/contexto/notas_clase/notas_clase_profesor_1.md` y `notas_clase_profesor_2.txt`).
3. El anclaje obligatorio con los documentos de Semana 2 (`matriz_consistencia.docx`, `estructura_analisis.docx`, `edt.docx`, `cronograma.xlsx`).
4. El esclarecimiento del desfase de una semana (Semana 02 universitaria = Entrega de paquetes `SEM01`).

---

## 2. HALLAZGOS E INCONGRUENCIAS DETECTADAS EN ENTREGABLES PREVIOS

### 2.1 En el Acta de Constitución (`plantilla_acta_constitucion.docx` vs `acta_constitucion.docx`):
- **Problema de Título:** Se detectó el uso de comas y frases compuestas redundantes ("desarrollar e implementar"), cuando el docente prohibió explícitamente comas y dobles verbos (*"Solo colocar IMPLEMENTAR o DISEÑAR nunca los dos"*, *"no colocar coma en el titulo y falto el lugar"*).
- **Racionalidad (Floro histórico):** Se incluía historia redundante de la empresa en lugar de ir directamente al grano: *"NO COLOCAR HISTORIA DE LA EMPRESA DEBEN SER CONCRETOS A LO QUE SE HARA"*, *"mucho floro no historia quitar eso"*.
- **Riesgos Mal Planteados:** En borradores previos figuraban riesgos imputables al equipo de estudiantes (ej. "curva de aprendizaje del framework", "falta de experiencia"). El docente fue tajante: *"LOS RIESGOS NO PODEMOS SER NOSOTROS, NO PUEDES DECIR EL RIESGO ES MI FALTA DE CONOCIMIENTO"*.
- **Presupuesto y Gratuitad:** En borradores se omitían costos o se ponía "gratis". El docente corrigió: *"no usar aproximados colocar montos nada es gratis"*. La infraestructura física se reutiliza (costo S/ 0.00 de adquisición pero con valorización de activos y costos de servicios).
- **Entregables Incompletos:** Faltaba listar explícitamente los documentos académicos y técnicos formales como entregables de fase (*"AGREGAR DOCUMENTOS A LOS ENTREGABLES"*).

### 2.2 En el Business Case (`plantilla_business_case.docx` vs `business_case.docx`):
- **Violación Severa de Cabeceras de Tablas de la Plantilla:**
  * En la plantilla, la Tabla 1 y Tabla 2 tienen cabecera: `['Campo', 'Detalle']`. En versiones previas se insertaron textos espurios o columnas alteradas.
  * En la Tabla 3, la plantilla exige `['Integrante', 'Código', 'Rol en el equipo', 'Correo']`. Se había cambiado a `['Integrante', 'Código', 'Rol en el Equipo (MultiRol)', 'Correo Institucional']`.
  * En la Tabla 8, la plantilla exige `['Ítem de Software', 'Descripción']`. Se había cambiado a `['Ítem de Software', 'Descripción y Versión Real']`.
  * En la Tabla 9, la plantilla exige `['Ítem de Hardware', 'Descripción']`. Se había modificado a `['Estación / Recurso', 'Especificaciones Técnicas y Capacidades Reales']`.
  * En la Tabla 16, la plantilla exige `['Hito/Entregable', 'Fecha Tentativa']`. Se había cambiado a `['Hito / Entregable Principal', 'Fecha Límite']`.
  * En la Tabla 20, la plantilla exige `['No Hacer Nada (Status Quo)', 'Factores Clave que muestran la No Viabilidad']`. Se había cambiado a `['Alternativa', 'Factores Clave que Muestran la No Viabilidad']`.
  * En la Tabla 23, la plantilla exige `['Semana', 'Entregables', 'Fecha Inicio / Fecha Fin']`. Se había cambiado a `['Fase / Sprint', 'Entregables Principales', 'Fechas de Inicio y Fin']`.
- **Inconsistencia en Suposiciones:** Se habían puesto más suposiciones en el Business Case que en el Acta de Constitución (*"Se puso mas Suposiciones que en la constitucion INCOHERENCIA"*). Deben ser IDÉNTICAS y en formato de lista.
- **Justificación Débil (Sección 2.4):** Se justificaba con "beneficios futuros" cuando el docente ordenó: *"NO es para poner beneficios. Es para poner qué sucederá con la empresa cuando NO se automatice eso. ESA ES LA JUSTIFICACIÓN"*, *"2.4 es muy baja mejorar la justificacion"*.
- **Alineamiento Estratégico (Sección 6.2):** Observación directa: *"6.2 de business case mal aplicado"*. Si la empresa no cuenta con un Plan Estratégico formal documentado, se declara explícitamente su planeamiento funcional u operativo o se marca "?", confrontando los objetivos del proyecto con las metas operativas del negocio y evidenciando relación directa obligatoria.
- **Capacidades de Hardware y Versiones de Software (Sección 4.4):** Faltaban versiones reales exactas de software (SO, versiones de Excel, RIP Photoprint) y capacidades técnicas reales de hardware (RAM, procesador, almacenamiento, BIOS).
- **Evidencias Gráficas (Sección 11):** Faltaban fotografías reales de la visita técnica al taller de la empresa en Trujillo (*"11 FOTOS FALTARON EVIDENCIAS DE QUE SE FUE A LA EMPRESA"*).

### 2.3 En Requerimientos de Software (`plantilla_requerimientos_software.docx` vs `requerimientos_software.docx`):
- **Violación de la Portada:** En la plantilla oficial, la tabla 2 no tiene fila de cabecera con `['Campo', 'Detalle']`, sino que inicia directamente en la fila 0 con `['Empresa / Organización', '']`. Se había insertado una cabecera artificial `['Campo', 'Detalle']` empujando los campos.
- **Error Crítico: Confundir Autenticación con Requerimiento Funcional:**
  * El docente enfatizó: *"el profe hizo incapie en que la empresa pide procesos no logins"*, *"AUTENTICACION NO ES FUNCIONALIDAD"*, *"MOVER AUTENTICACION A NO FUNCIONAL"*.
  * Todo inicio de sesión, JWT, roles y hashing SHA-256 debe pertenecer a Requerimientos No Funcionales (RNF-Seguridad), dejando los Requerimientos Funcionales (RF) exclusivamente a los **procesos de negocio de la imprenta** (emisión de órdenes, liquidación de saldos de cobro, cálculo de recetas de insumos, etc.).
- **Inclusión de Clientes Externos que no Usan el Software:**
  * El docente remarcó: *"si el cliente no manipula el software no debe aparecer en el punto 5"*. El cliente comercial compra en el mostrador pero no opera el sistema web. Solo operan: Administradora de Oficina, Gerente de Taller y Diseñadores/Operarios de Producción.
- **Referencias Débiles:** Se requerían normas formales de ingeniería de requisitos (IEEE 830, ISO 29148, ISO 25010 y Ley N° 29733 de Datos Personales).

---

## 3. MATRIZ DE RESOLUCIÓN DE OBSERVACIONES DOCENTES (SEMANA 01)

| # | Observación Docente (Notas 1 y 2) | Documento Afectado | Acción Correctiva de Anclaje Aplicada |
|:---|:---|:---|:---|
| **O1** | Título es VI + VD + Lugar; sin comas ni dobles verbos ("desarrollar e implementar"). | Acta, BC, SRS | Título único fijado: *Implementación de un sistema web transaccional con módulos de inteligencia de negocios e inteligencia artificial para la optimización de los procesos operativos y financieros en Impresos Trujillo E.I.R.L.* |
| **O2** | En Racionalidad mencionar el problema a resolver; eliminar historia y floro. | Acta (Row 5) | Se redacta diagnóstico conciso: gestión manual en talonarios de papel genera 18.5 min/orden, 14.3% de extravíos, pérdidas por órdenes entregadas sin liquidar saldo y descontrol de stock. |
| **O3** | Objetivos específicos deben medir la Variable Dependiente y no tener "Y". | Acta, BC, SRS | Se fijan los 5 OE canónicos alineados a los 5 indicadores cuantitativos de la VD (tiempos, extravíos, saldos pendientes, paros de stock, consolidación de caja). |
| **O4** | Agregar documentos formales a la lista de entregables del proyecto. | Acta (Row 9), BC (Tab 23) | Se listan: SRS IEEE 830, Carpeta de Prácticas de Campo, Informe Pretest/Postest, Manuales, Paper de Investigación e Informe Final. |
| **O5** | En fases colocar nombres reales, no sólo números de semana. | Acta (Tab 1), BC (Tab 23) | Fases: I. Inicio y Delimitación, II. Planificación y Diseño, III. Construcción Transaccional, IV. Módulos BI e IA, V. Validación Experimental y Cierre. |
| **O6** | Los riesgos NUNCA pueden ser culpa del equipo universitario. | Acta (Tab 3), BC (Tab 19) | Se descartan "falta de experiencia" y se colocan riesgos operacionales de la imprenta: cortes eléctricos, falla de conectividad local, resistencia al cambio. |
| **O7** | Suposiciones y restricciones deben ser listas idénticas entre Acta y BC. | Acta (Row 9), BC (2.5, 2.6, 5.4, 5.5) | Se crea el listado idéntico de 4 Suposiciones y 4 Restricciones palabra por palabra en ambos documentos. |
| **O8** | En Gobierno indicar cargos y procedencias; el docente NO es parte del gobierno. | BC (Tabla 4) | Se añade columna "Procedencia" (Empresa / Universidad). El docente figura como Asesor Académico Externo, jamás con rol ejecutivo de decisión. |
| **O9** | Pregunta problema debe estar articulada con la Estructura de Análisis. | BC (4.1), SRS (1) | Pregunta canónica idéntica a Matriz de Consistencia: *¿De qué manera la implementación de un sistema web transaccional con módulos de inteligencia de negocios e inteligencia artificial optimiza los procesos operativos y financieros en Impresos Trujillo E.I.R.L.?* |
| **O10** | En levantamiento de información colocar fechas exactas, no semanas. | BC (Tabla 5) | Fechas reales consignadas: 15/08/2026, 18/08/2026, 20/08/2026 y 22/08/2026. |
| **O11** | Detallar versiones de software y capacidades de hardware reales. | BC (Tablas 8 y 9) | Windows 10/11 Pro, Office 2021 LTSC, PhotoPrint 12 Cloud Edition; PCs Core i5/i7, 8-16GB RAM, SSD 480GB, BIOS UEFI. |
| **O12** | Justificación (2.4) debe explicar qué sucede si NO se automatiza. | BC (2.4) | Se detalla el colapso operativo por acumulación de papel, fuga de cobranzas no liquidadas e incapacidad de escalar pedidos comerciales. |
| **O13** | Autenticación NO es funcionalidad: moverla a Requerimientos No Funcionales. | SRS (Secciones 7 y 10) | La Sección 7 contiene solo Procesos de Negocio de imprenta; el inicio de sesión y roles se trasladan a la Sección 10 (Seguridad). |
| **O14** | En Clases de Usuario solo quienes manipulan el software; no clientes de mostrador. | SRS (Sección 5) | Se definen únicamente: Administradora de Oficina, Jefe de Taller/Producción y Operarios/Diseñadores. |
| **O15** | Respetar encabezados y formato de tablas de plantillas al 100%. | Todos los documentos | Cabeceras de plantillas intactas (`Campo`, `Detalle`, etc.) sin modificaciones. |

---

## 4. ANCLAJE CON SEMANA 02 (ESTRUCTURA DE ANÁLISIS, MATRIZ DE CONSISTENCIA, EDT Y CRONOGRAMA)

Para que el proyecto mantenga coherencia indestructible de Semana 1 a Semana 7, los elementos de Semana 1 quedan amarrados a Semana 2 bajo las siguientes reglas:

```
[SEMANA 01: Acta & Business Case]
  ├── Título del Proyecto          ───> [SEMANA 02: Matriz de Consistencia & Estructura de Análisis]
  ├── Variable Independiente (VI)  ───> [SEMANA 02: VI y sus 4 Indicadores Funcionales]
  ├── Variable Dependiente (VD)    ───> [SEMANA 02: VD y sus 5 Indicadores Cuantitativos]
  ├── Objetivos General y Específ. ───> [SEMANA 02: Objetivos y Pregunta Problema en Matriz]
  ├── Supuestos y Restricciones    ───> [SEMANA 02: Restricciones en Estructura de Análisis]
  ├── Fases e Hitos Principales    ───> [SEMANA 02: Fases de la EDT y Actividades de Cronograma]
  └── Presupuesto por Categorías   ───> [SEMANA 02: Costeo preliminar de Actividades de Cronograma]
```

Cualquier alteración futura en un entregable posterior deberá consultar y obedecer este anclaje.

---

## 5. REVISIÓN TRANSVERSAL DE NOTAS DE CLASE (SEMANAS 1 A 7) CON IMPACTO EN SEMANA 1

Al revisar exhaustivamente las notas de clase de todas las semanas (`notas_clase_profesor_1.md` a `notas_clase_profesor_7.txt`), se identificaron observaciones posteriores que retroalimentan y perfeccionan directamente los entregables de Semana 1:

| Origen | Observación Textual del Docente | Impacto Directo en Entregables de Semana 1 | Subsanación Aplicada en `docs/trabajo/SEM01/` |
|:---|:---|:---|:---|
| **Semana 3** (Línea 81) | *"En la pregunta problema desapareció 'financiera' en algunas cosas y aparece en otras; revisar si se retira o no."* | Inconsistencia de redacción entre el Título, Pregunta Problema y Objetivos. | Se estandarizó la fórmula completa: **"procesos operativos y financieros"** de forma idéntica en el Acta, Business Case y Requerimientos. |
| **Semana 3** (Línea 88) | *"QUITAR LAS 'Y' en los objetivos específicos: separas un indicador en dos."* | Objetivos que mezclaban dos propósitos o dos indicadores mediante la conjunción "y". | Cada uno de los 5 Objetivos Específicos apunta a un único proceso e indicador medible, eliminando conjunciones compuestas. |
| **Semana 4** (Línea 21) | *"el control de cambios viene de el acta de constitución y el protocolo de comunicación esto debe ir congruente en los 3 archivos"* | Desconexión en el procedimiento de control de cambios. | Se estandarizó el mismo procedimiento formal de 4 pasos (RFC, Evaluación, Aprobación de Gerencia, Registro Git) en Acta y Business Case. |
| **Semana 5** (Línea 31) | *"Alternativas de solución: aca se debe colocar nombres de otras soluciones que existen en el mercado... ej: ponen 'EXCEL' y quieren competir contra el es tonto JALADOS porque esa comparacion es parcializada"* | En la Tabla 22 de Business Case (Selección de Alternativas), comparar contra "Excel" invalida académicamente la evaluación de software. | Se reemplazó "Excel" por software comercial real del mercado: **Opción B: ERP Gráfico Especializado (PrintIQ / Optimus Graphic)** y **Opción C: Software Administrativo MYPE Genérico (Defontana ERP)**. |
| **Semana 6** (Línea 1) | *"revise los objetivos entre todos los documentos porque varían (los objetivos no pueden cambiar, revise su matriz de consistencia)."* | Los objetivos del Acta y Business Case tenían discrepancias con la Matriz de Consistencia. | Se fijó el set canónico idéntico de 1 Objetivo General y 5 Objetivos Específicos palabra por palabra para todos los documentos del ciclo. |
| **Semana 6** (Línea 5) | *"mejorar el control de cambios colocando los cargos de stakeholders"* | En la tabla de Control de Cambios solo figuraban nombres de alumnos sin sus roles. | Se añadieron los cargos formales de stakeholders en la Tabla 25 de Business Case y Acta de Constitución. |
| **Semana 6** (Línea 7) | *"6.2 de business case mal aplicado."* | En Alineamiento Estratégico, la empresa familiar no tiene un Plan Estratégico formal documentado, pero opera bajo ejes funcionales que deben explicitarse y confrontarse. | Se estructuraron los 4 Ejes Estratégicos Funcionales de la Gerencia (Celeridad, Disciplina Financiera, Abastecimiento, Control) demostrando su Relación Directa con el proyecto. |
| **Semana 7** (Línea 17) | *"Incorporar el Acta de Aceptación de Entregables... debe existir evidencia de aceptación por parte del cliente."* | Todo entregable marcado como terminado debe contar con validación y firma del cliente. | Se estructuraron las tablas de firmas de aprobación en el Acta de Constitución, Business Case y Requerimientos con Marcell Vásquez y Angel Rodríguez. |

