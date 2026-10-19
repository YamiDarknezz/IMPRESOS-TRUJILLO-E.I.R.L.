# AUDITORÍA EXHAUSTIVA Y ANCLAJE METODOLÓGICO: SEMANA 02
## Proyecto Capstone — Ciclo 2026-II
### Entregables Evaluados: Matriz de Consistencia, Estructura de Análisis, EDT, Cronograma (Gantt)

---

## 1. INTRODUCCIÓN Y ALCANCE DE LA AUDITORÍA

Esta auditoría revisa los cuatro entregables técnicos y metodológicos de la **Semana 02** (elaborados en la Semana 03 del calendario universitario, del 31/08/2026 al 05/09/2026):
1. **Matriz de Consistencia** (`plantilla_matriz_consistencia.docx` vs `matriz_consistencia.docx`).
2. **Estructura de Análisis** (`plantilla_estructura_analisis.docx` vs `estructura_analisis.docx`).
3. **Estructura de Desglose del Trabajo (EDT)** (`plantilla_edt.pdf` vs `edt.docx`).
4. **Cronograma y Presupuesto Gantt** (`plantilla_cronograma.xlsx` vs `cronograma.xlsx`).

Se audita la fidelidad estructural a las plantillas, la integración de todas las observaciones docentes registradas en `docs/contexto/notas_clase/` (Semanas 2, 3, 4, 5 y 6), y el anclaje simétrico con la **Semana 01**.

---

## 2. HALLAZGOS E INCONGRUENCIAS DETECTADAS EN ENTREGABLES PREVIOS

### 2.1 Mutilación del Título y Variable Dependiente (Desaparición de "y financieros"):
- **Hallazgo Crítico:** En `matriz_consistencia.docx`, `estructura_analisis.docx`, `edt.docx` y `cronograma.xlsx`, el título y la definición de la Variable Dependiente se redactaron como:
  > *"para la optimización de los procesos operativos en la empresa Impresos Trujillo E.I.R.L."*
  **Se omitió la palabra "financieros"**, rompiendo la coherencia con el Acta de Constitución y el Business Case de Semana 1.
- **Evidencia en Notas del Docente:** En `notas_clase_profesor_3.md` (Línea 81), el docente observó textualmente a nuestro grupo:
  > *"En la pregunta problema desapareció 'financiera' en algunas cosas y aparece en otras; revisar si se retira o no."*
  Y en `notas_clase_profesor_6.txt` (Línea 1):
  > *"revise los objetivos entre todos los documentos porque varían (los objetivos no pueden cambiar, revise su matriz de consistencia)."*
- **Subsanación:** El título y la Variable Dependiente deben contener obligatoriamente **"procesos operativos y financieros"** en los cuatro documentos, dado que el sistema resuelve fugas de dinero por cobros no liquidados, descalces de caja y rentabilidad comercial.

### 2.2 En la Matriz de Consistencia (`plantilla_matriz_consistencia.docx`):
- **Estructura de la Plantilla:** La plantilla es una tabla de 8 filas y 5 columnas (`PROBLEMA`, `HIPÓTESIS`, `OBJETIVO GENERAL`, `VARIABLE INDEPENDIENTE`, `METODOLOGÍA`).
- **Verbos Pre-establecidos:** El docente pide expresamente usar sus verbos de plantilla (*"Determinar/Establecer/Definir la influencia de VI en VD"*) porque al tratarse de un diseño pre-experimental (G X O1 / O2), no se puede dar por sentada la mejora antes de medir el postest.
- **Población y Muestra:** En versiones preliminares se intentó poner "personas o trabajadores". El docente prohibió esto rotundamente: *"población y muestra son números, aca no estamos en letras, la unidad de análisis son Registros"*. En el taller se evalúan **registros de órdenes de trabajo (N = 125/mes, n = 125 pretest y 125 postest, T = 250 registros)**.

### 2.3 En la Estructura de Análisis (`plantilla_estructura_analisis.docx`):
- **Estructura Oficial:** La plantilla exige 6 puntos: 1. Variables de Estudio, 2. Población, 3. Muestra, 4. Objetivo General y Específicos, 5. Antecedentes (2 Internacionales, 2 Nacionales, 2 Locales), 6. Definición del Problema.
- **Formato de Antecedentes:** El docente observó: *"los antecedentes se redactan en prosa"* (`notas_clase_profesor_6.txt` L15) y *"Todos los ANTECEDENTES deben tener valores, no pueden ser cualitativos ni descriptivos"* (`notas_clase_profesor_2.txt` L8). Deben relacionarse con la variable dependiente (tiempos de atención, pérdidas de dinero, roturas de inventario).

### 2.4 En la EDT (`plantilla_edt.pdf` y `edt.docx`):
- **Niveles de Desglose:** El docente advirtió en Semana 2 (Línea 3): *"Regla para el EDT 3-5 de 3 a 5 niveles sin contar la raíz que es el titulo"*. En borradores previos se llegó a 6 niveles (1.1.1.1.1.1).
- **Prohibición de Conectores "Y" y Paréntesis:** *"Evitar conectores lógicos como 'Y': significan composición. Ejemplo mal: 'Desarrollo de Backend y Frontend'. Subdividir"* (`notas_clase_profesor_3.md` L47), y *"El profesor vio en el EDT en la descripción paréntesis y los condenó"* (`notas_clase_profesor_4.txt` L27).
- **Inclusión Obligatoria de Todos los Documentos y Capacitación:** En la EDT deben figurar todos los entregables académicos del curso y un paquete de trabajo explícito de capacitación al personal de la empresa.

### 2.5 En el Cronograma (`plantilla_cronograma.xlsx` y `cronograma.xlsx`):
- **Estructura de Columnas:** Las columnas fijadas en la plantilla oficial son: `Estructura de la EDT` (Código y Nombre), `Duración`, `Predecesora`, `Costo estimado`, y el Diagrama de Gantt temporal a la derecha.
- **Responsables Equilibrados (MultiRol):** En versiones previas solo se colocaba como responsable al Líder de Proyecto. El docente observó: *"Tener más responsables; no colocar solamente al líder, agregar a los demás responsables por igual"* (`notas_clase_profesor_3.md` L126).

---

## 3. MATRIZ DE RESOLUCIÓN DE OBSERVACIONES DOCENTES (SEMANA 02)

| # | Observación Docente | Documento Afectado | Acción Correctiva de Anclaje Aplicada |
|:---|:---|:---|:---|
| **O1** | Título debe incluir espacialidad, temporalidad y "financieros". | MC, EA, EDT, Cronograma | Se estandariza: *Implementación de un sistema web transaccional con módulos de inteligencia de negocios e inteligencia artificial para la optimización de los procesos operativos y financieros en Impresos Trujillo E.I.R.L.* |
| **O2** | Trabajo es EXPERIMENTAL (Pre-experimental G X O1/O2). | MC (Fila 3, Col 4) | Se adopta el diseño formal: G O1 → X → O2 con medición pretest en talonarios físicos y postest en sistema web. |
| **O3** | Población y muestra son NÚMEROS, unidad de análisis son registros. | MC, EA | Población N = 125 órdenes/mes (N1=75 gigantografías, N2=50 imprenta). Muestra censal n = 125, T = 250 registros evaluados. |
| **O4** | Verbos de objetivos deben seguir la plantilla ("Determinar la influencia de..."). | MC (Col 2), EA (Sección 4) | Se estructuran los 5 OE canónicos con la fórmula: *Determinar la influencia de [VI] en [Indicador de VD]*. |
| **O5** | Eliminar conectores "Y" en objetivos específicos. | MC, EA | Cada OE mide un único indicador cuantitativo independiente, sin dobles metas ni conjunciones compuestas. |
| **O6** | Antecedentes redactados en prosa y con cifras numéricas de impacto. | EA (Sección 5) | 6 investigaciones (2 int, 2 nac, 2 loc) en prosa estricta, reportando reducciones porcentuales de tiempo, mermas y costos. |
| **O7** | Grafo EDT debe tener actividades y códigos visibles; simplificar niveles. | EDT, Cronograma | EDT ajustada a 4 niveles jerárquicos: Fases (1-5), Paquetes (X.X), Actividades (X.X.X) y Entregables (X.X.X.X). |
| **O8** | EDT sin paréntesis y sin "Y"; incluir capacitación y todos los documentos. | EDT, Cronograma | Nombres atómicos sin composición binaria; incluye módulo de capacitación in situ y entregables de práctica de campo y tesis. |
| **O9** | Reparto equitativo de responsables en cronograma (MultiRol). | Cronograma (Gantt) | Asignación distribuida entre Erick Plasencia (Líder/DevOps), Estibb Anhuaman (Frontend/QA) y Diego Rodriguez (Backend/IA). |

---

## 4. ANCLAJE MATRIZ SEMANA 01 ⟷ SEMANA 02

```
=============================================================================================
SEMANA 01 (Acta / Business Case / SRS)          SEMANA 02 (Matriz Consistencia / EA / EDT)
=============================================================================================
Título: VI + VD + Lugar (con "financieros") ──> Fila 0 de MC, Título de EA, Raíz de EDT y Cronograma
Objetivo General                            ──> Objetivo General en MC (Col 2) y EA (Punto 4)
OE1: Digitalizar emisión de órdenes         ──> OE1 / Ind. 1 VD: Tiempo promedio de registro (min)
OE2: Candado digital de cobro en caja       ──> OE2 / Ind. 2 VD: Tasa de órdenes impagas entregadas (%)
OE3: Control de insumos por receta          ──> OE3 / Ind. 3 VD: Discrepancia de inventario / mermas (%)
OE4: Tableros analíticos gerenciales BI     ──> OE4 / Ind. 4 VD: Exactitud de arqueos diarios de caja (%)
OE5: Modelo predictivo de insumos con IA    ──> OE5 / Ind. 5 VD: Precisión en demanda de materiales (%)
Fases del Cronograma (Fases I a V)          ──> Nivel 1 de la EDT (Fases 1 a 5) y Fases del Gantt
Presupuesto Resumido (S/ 5,100 valorizado)  ──> Sumatoria consolidada de costos en Cronograma Gantt
=============================================================================================
```
