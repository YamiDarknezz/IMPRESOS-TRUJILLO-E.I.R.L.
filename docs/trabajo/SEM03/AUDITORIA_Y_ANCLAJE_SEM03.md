# AUDITORÍA EXHAUSTIVA Y ANCLAJE METODOLÓGICO: SEMANA 03
## Proyecto Capstone — Ciclo 2026-II
### Entregables Evaluados: Plan de Desarrollo de Software, Matriz de Riesgos, Matriz de Responsabilidades (RACI), Matriz de Comunicaciones

---

## 1. INTRODUCCIÓN Y ALCANCE DE LA AUDITORÍA

Esta auditoría revisa los cuatro entregables de gestión de ingeniería de la **Semana 03** (elaborados en la Semana 04 del calendario universitario, del 07/09/2026 al 12/09/2026):
1. **Plan de Desarrollo de Software (PDS)** (`plantilla_plan_desarrollo_software.docx` vs `plan_desarrollo_software.docx`).
2. **Matriz de Riesgos** (`plantilla_matriz_riesgos.xls` vs `matriz_riesgos.xls`).
3. **Matriz de Responsabilidades (RACI)** (`plantilla_matriz_responsabilidades.xlsx` vs `matriz_responsabilidades.xlsx`).
4. **Matriz de Comunicaciones** (`plantilla_matriz_comunicaciones.xlsx` vs `matriz_comunicaciones.xlsx`).

Se audita la estricta fidelidad a las plantillas oficiales, la resolución de todas las observaciones docentes registradas en `docs/contexto/notas_clase/` (Semanas 3, 4 y 6) y el anclaje simétrico con la **Semana 01** y **Semana 02**.

---

## 2. HALLAZGOS E INCONGRUENCIAS DETECTADAS EN ENTREGABLES PREVIOS

### 2.1 Mutilación del Título Canónico:
- **Hallazgo:** En `matriz_riesgos.xls`, `matriz_responsabilidades.xlsx`, `matriz_comunicaciones.xlsx` y `plan_desarrollo_software.docx`, el título del proyecto omitía la frase **"y financieros"**, contraviniendo el anclaje fijado con el Acta de Constitución y la Matriz de Consistencia.
- **Subsanación:** Se restaura el título canónico completo en las cabeceras de los cuatro documentos:
  > **Implementación de un sistema web transaccional con módulos de inteligencia de negocios e inteligencia artificial para la optimización de los procesos operativos y financieros en Impresos Trujillo E.I.R.L.**

### 2.2 Desalineación Crítica de Códigos EDT en la Matriz de Riesgos y el PDS:
- **Hallazgo:** En las versiones preliminares de `matriz_riesgos.xls` y en la Tabla 16 de `plan_desarrollo_software.docx`, figuraban códigos EDT ficticios como `7.1.1`, `6.2.3`, `6.1.1`, `4.1.1` y `8.1.1`, los cuales **no existían en la EDT oficial de 4 niveles**.
- **Observación Docente:** En `notas_clase_profesor_4.txt` (Líneas 22 y 26):
  > *"EL PROFE DETECTO INCONGRUENCIAS EN LA TABLA DEL EDT y faltas de especificación..."*
  > *"el profe indica entre el plan y la matriz de riesgos hay muchas inconsistencias..."*
- **Subsanación:** Se sincronizaron todos los riesgos con los códigos reales de la EDT canónica aprobada:
  - Riesgo R1 (Demora en datos históricos): Código EDT `1.1.2` / `5.4.1`.
  - Riesgo R2 (Resistencia al cambio en taller): Código EDT `5.3.2`.
  - Riesgo R3 (Cortes eléctricos y caídas de red): Código EDT `5.2.1`.
  - Riesgo R4 (Discrepancias en tarifas y recetas): Código EDT `3.1.2`.
  - Riesgo R5 (Vouchers Yape inconsistentes): Código EDT `3.3.1`.
  - Riesgo R6 (Caída temporal de VPS/Docker): Código EDT `5.2.1`.
  - Riesgo R7 (Volumen insuficiente para IA): Código EDT `4.2.2`.

### 2.3 En el Plan de Desarrollo de Software (`plantilla_plan_desarrollo_software.docx`):
- **Portada y Roles:** En la Tabla 2 de control de elaboración (`ELABORÓ`, `REVISÓ`, `AUTORIZÓ`), el docente ordenó: *"COLOCAR JEFE DE PROYECTO EN REVISADO"* (`notas_clase_profesor_4.txt` L33) y la Gerencia General en Autorizó.
- **Antecedentes y Problema:** Los antecedentes se extraen íntegramente de la Estructura de Análisis (en prosa continua y con datos cuantitativos) y debe incluirse textualmente la **Pregunta Problema** canónica (`notas_clase_profesor_4.txt` L15-16).
- **Separación de Características y Beneficios:** En la entrega previa estaban fusionados. El docente ordenó explícitamente: *"SEPARAR CARACTERÍSTICAS DE BENEFICIOS ESTÁ TODO COMBINADO ESO TAMBIÉN NO SEPARAMOS CORREGIRLO"* (`notas_clase_profesor_4.txt` L18 y L36).
- **Entregables del Proyecto (Sección 5 / Tabla 22):** El docente observó en Semana 6 (Línea 13): *"ítem 6 del plan de desarrollo de sw es una fila por entregable"*. Se listan los entregables formales fila por fila con su fecha programada.

### 2.4 En la Matriz de Responsabilidades RACI (`plantilla_matriz_responsabilidades.xlsx`):
- **Inclusión de Operarios:** En borradores previos solo se colocaba al equipo y al Product Owner. El docente ordenó: *"Debe colocar también a los operarios"* (`notas_clase_profesor_3.md` L26). Se incluyó a los maquinistas y diseñadores de taller (Alexis, Aldair, Gabriel).
- **Exclusión del Docente:** El docente no forma parte del equipo ejecutor ni del RACI (`notas_clase_profesor_4.txt` L53).
- **Equilibrio de Responsabilidades (R):** El docente advirtió: *"Todos los miembros del equipo deben tener la misma cantidad de responsabilidades (R)"* y *"El Jefe de Proyectos no debe tener full I porque es como si fuera locutor; es quien más se involucra"* (`notas_clase_profesor_3.md` L18-19). Se balanceó la distribución de 'R' entre Erick Plasencia, Estibb Anhuaman y Diego Rodriguez.

### 2.5 En la Matriz de Comunicaciones (`plantilla_matriz_comunicaciones.xlsx`):
- **Enfoque en Entregables y Sin Conectores "Y":** *"debe estar de todos los entregables... aquí también indica el profesor NADA DE 'Y'... aquí también van entregables y no acciones"* (`notas_clase_profesor_4.txt` L57-59).
- **Prioridad Presencial:** Se formalizó la reunión técnica presencial en la sede del Jr. Simón Bolívar 945 como el canal prioritario para acuerdos y Sprint Reviews.

---

## 3. MATRIZ DE RESOLUCIÓN DE OBSERVACIONES DOCENTES (SEMANA 03)

| # | Observación Docente | Documento Afectado | Acción Correctiva de Anclaje Aplicada |
|:---|:---|:---|:---|
| **O1** | Título debe incluir espacialidad, temporalidad y "financieros". | PDS, Riesgos, RACI, Comunicaciones | Estandarizado con la fórmula canónica completa: *...procesos operativos y financieros en Impresos Trujillo E.I.R.L.* |
| **O2** | Sincronizar códigos EDT entre Matriz de Riesgos y PDS. | PDS (Tab 16), Matriz Riesgos | Se mapearon todos los riesgos a los códigos oficiales de 4 niveles de la EDT (1.1.2 a 5.4.1). |
| **O3** | Los riesgos NUNCA somos nosotros (cero riesgos de estudiantes). | PDS, Matriz Riesgos | Se eliminaron riesgos como "falta de experiencia" o "atraso del equipo"; solo se contemplan riesgos operacionales de la imprenta. |
| **O4** | Separar Características de Beneficios en el PDS (Sección 2.6). | PDS (Sección 2.6) | Se crearon dos subsecciones independientes: 2.6.1 Características del Sistema y 2.6.2 Beneficios Operativos y Financieros. |
| **O5** | Colocar Jefe de Proyecto en "REVISÓ" en la portada del PDS. | PDS (Tabla 2) | Portada estructurada: Elaboró: Analistas (EAD/JRV), Revisó: Líder de Proyecto (EPT), Autorizó: Gerencia General (Cliente). |
| **O6** | Ítem de entregables del PDS debe ser una fila por entregable. | PDS (Tabla 22) | Tabla estructurada con una fila individual para cada uno de los entregables verificables del proyecto. |
| **O7** | Incorporar a los operarios en la Matriz de Responsabilidades RACI. | Matriz RACI | Se agregaron las columnas para los operarios de taller (Alexis, Aldair, Gabriel) como consultados o informados en producción. |
| **O8** | Reparto equitativo de 'R' entre los estudiantes en el RACI. | Matriz RACI | Distribución balanceada de roles ejecutores (R) entre Erick, Estibb y Diego; nadie queda como mero locutor o informado. |
| **O9** | Matriz de Comunicaciones sin "Y" y enfocada en entregables. | Matriz Comunicaciones | Cada fila corresponde a un entregable atómico formal, definiendo emisor, receptor, canal presencial y frecuencia. |

---

## 4. ANCLAJE MATRIZ SEMANA 01, SEMANA 02 Y SEMANA 03

```
====================================================================================================
SEMANA 01 / SEMANA 02                           SEMANA 03 (Plan de Desarrollo / Matrices)
====================================================================================================
Título: VI + VD + Lugar (con "financieros") ──> Portadas y encabezados de PDS, Riesgos, RACI y Com.
Objetivos General y Específicos (OE1 - OE5) ──> Sección 2.3 de PDS (Objetivos del Proyecto)
Pregunta Problema Canónica                  ──> Sección 2.2 de PDS (Identificación del Problema)
Antecedentes Cuantitativos en Prosa         ──> Sección 2.1 de PDS (Antecedentes de Investigación)
Suposiciones y Restricciones (4 gemelas)    ──> Sección 2.7 de PDS (Suposiciones y Limitaciones)
Códigos EDT (Fases 1 a 5, 4 niveles)        ──> Códigos EDT en Matriz de Riesgos, RACI y Comunicaciones
Presupuesto Consolidado (S/ 5,100 / S/ 300) ──> Sección 4 de PDS y costeo de recursos en Cronograma
====================================================================================================
```
