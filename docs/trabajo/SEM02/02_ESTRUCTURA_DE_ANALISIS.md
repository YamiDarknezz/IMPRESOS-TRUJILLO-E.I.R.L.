# INFORME DE ESTRUCTURA DE ANÁLISIS
## Universidad Privada del Norte — Ciclo 2026-II
### Curso: Proyecto Capstone (Aula: 22643421416 | Grupo 2)
### Organización Cliente: Impresos Trujillo E.I.R.L.

---

## PORTADA Y DATOS GENERALES

#### TABLA 1: DATOS INSTITUCIONALES DEL INFORME
| Campo | Detalle Institucional |
|:---|:---|
| **Título del Proyecto** | Implementación de un sistema web transaccional con módulos de inteligencia de negocios e inteligencia artificial para la optimización de los procesos operativos y financieros en Impresos Trujillo E.I.R.L. |
| **Curso / Ciclo** | Proyecto Capstone (Aula: 22643421416) — Ciclo Académico 2026-II |
| **Docente Asesor** | Ing. Jose Alberto Gomez Avila |
| **Equipo de Desarrollo (MultiRol)** | • Gerardo Erick Plasencia Torres (Líder de Proyecto / Scrum Master / Full Stack)<br>• Jose Estibb Anhuaman Delgado (Analista Frontend / UI-UX / Tester QA)<br>• Jose Diego Rodriguez Vasquez (Desarrollador Backend & IA / DBA / Analista BI) |
| **Organización Cliente** | Impresos Trujillo E.I.R.L. (RUC: 20602572952) — Jr. Simón Bolívar Nro. 945 Int. 1, Centro Cívico, Trujillo, La Libertad |
| **Fecha de Presentación** | 04 de septiembre de 2026 |

---

## 1. VARIABLES DE ESTUDIO

### 1.1 Variable Independiente (VI)

- **Definición Nominal:** Sistema web transaccional con módulos de inteligencia de negocios e inteligencia artificial.
- **Definición Conceptual:** Conjunto integrado de componentes de software desacoplados compuesto por un cliente SPA en Angular 21, una API asíncrona en FastAPI (Python 3.11), persistencia relacional en PostgreSQL nativo bajo contenedores Docker, dashboards analíticos ejecutivos y modelos de aprendizaje automático orientados a la gestión, automatización y pronóstico de procesos de imprenta.
- **Definición Operacional:** Grado de construcción, despliegue y operatividad técnica del sistema evaluado a través de cuatro indicadores funcionales cuantitativos:
  1. *Indicador 1 (VI-1):* Porcentaje de implementación funcional del Módulo Transaccional (% de funciones de emisión de órdenes, catálogo de productos y recetas de insumos operativas).
  2. *Indicador 2 (VI-2):* Porcentaje de implementación funcional del Módulo de Cobros y Caja (% de funciones de candado digital de cobro, arqueo diario segregado y registro multicanal operativas).
  3. *Indicador 3 (VI-3):* Porcentaje de implementación funcional del Módulo de Business Intelligence (% de cuadros de mando interactivos y exportaciones .xlsx operativas).
  4. *Indicador 4 (VI-4):* Porcentaje de implementación funcional del Módulo de Inteligencia Artificial (% de precisión del modelo predictivo de series temporales de demanda de insumos desplegado).

### 1.2 Variable Dependiente (VD)

- **Definición Nominal:** Optimización de los procesos operativos y financieros en la empresa Impresos Trujillo E.I.R.L.
- **Definición Conceptual:** Grado de perfeccionamiento cuantitativo alcanzado en la eficiencia del ciclo de atención al cliente, la eliminación de extravíos de pedidos en taller, la supresión de pérdidas económicas por servicios no liquidados, la exactitud del cuadre de caja y la reducción de mermas y quiebres de inventario de insumos gráficos en la empresa.
- **Definición Operacional:** Nivel de desempeño y eficiencia medido antes (pretest) y después (postest) de la implantación del software, a través de cinco indicadores cuantitativos verificables:
  1. *Indicador 1 (VD-1):* **Tiempo promedio de registro y emisión de órdenes de trabajo** (Minutos requeridos por cliente en el mostrador de atención).
  2. *Indicador 2 (VD-2):* **Porcentaje de discrepancia en inventario de insumos gráficos** (% de desviación entre el consumo teórico por receta y el inventario físico en taller).
  3. *Indicador 3 (VD-3):* **Porcentaje de órdenes entregadas con saldo pendiente nulo** (% de trabajos despachados con 100% de liquidación en caja, erradicando entregas impagas).
  4. *Indicador 4 (VD-4):* **Porcentaje de exactitud en arqueos diarios de caja** (% de conciliación exacta entre los fondos recaudados en mostrador y los comprobantes emitidos).
  5. *Indicador 5 (VD-5):* **Porcentaje de precisión en la predicción de demanda de insumos críticos** (% de exactitud del modelo predictivo respecto al consumo real mensual de rollos de lona y vinil).

---

## 2. POBLACIÓN

- **Definición:** El universo poblacional de la investigación está constituido por el total de registros de órdenes de trabajo comerciales generadas mensualmente en las dos líneas de producción de Impresos Trujillo E.I.R.L.
- **Tamaño de la Población (N):** La empresa registra un volumen promedio histórico de **N = 125 registros de órdenes de trabajo por mes** (rango operativo documentado de 100 a 150 órdenes mensuales).
- **Estratificación Poblacional por Unidad de Negocio:**
  - *Estrato 1 (N1 - Gigantografías y Gran Formato):* 75 registros de órdenes mensuales (representa el 60% del volumen operativo en taller).
  - *Estrato 2 (N2 - Imprenta Comercial y Publicitaria):* 50 registros de órdenes mensuales (representa el 40% del volumen operativo en oficina).
  - **Población Total Mensual:** $N = N_1 + N_2 = 75 + 50 = 125$ registros de órdenes de trabajo.

---

## 3. MUESTRA

- **Tipo de Muestreo:** No probabilístico, censal. Se evalúa el 100% de la población mensual disponible durante los períodos de medición pre-experimental, garantizando validez estadística interna sin error muestral por selección aleatoria.
- **Tamaño de la Muestra (n):**
  - *Muestra Pretest ($n_{\text{pre}}$):* 125 registros de órdenes de trabajo evaluadas en soporte físico tradicional (talonarios manuales de papel y cuadernos de taller) correspondientes a 30 días hábiles previos a la implantación.
  - *Muestra Postest ($n_{\text{post}}$):* 125 registros de órdenes de trabajo procesadas íntegramente a través del sistema web transaccional durante 30 días hábiles de operación experimental.
  - **Total de Unidades de Análisis Evaluadas ($T$):**
    $$T = n_{\text{pre}} + n_{\text{post}} = 125 + 125 = 250 \text{ registros de órdenes de trabajo}$$
- **Unidad de Análisis:** Un registro individual de orden de trabajo / contrato de servicio gráfico comercial emitido en la empresa.

---

## 4. OBJETIVO GENERAL Y ESPECÍFICOS

### 4.1 Objetivo General:
Determinar la influencia de la implementación de un sistema web transaccional con módulos de inteligencia de negocios e inteligencia artificial en la optimización de los procesos operativos y financieros en Impresos Trujillo E.I.R.L., Trujillo - 2026.

### 4.2 Objetivos Específicos:
1. **OE1:** Determinar la influencia de la implementación del sistema en el tiempo de registro de órdenes de trabajo en Impresos Trujillo E.I.R.L.
2. **OE2:** Determinar la influencia de la implementación del sistema en el control de inventario de insumos en Impresos Trujillo E.I.R.L.
3. **OE3:** Determinar la influencia de la implementación del sistema en las pérdidas financieras por entrega de trabajos con saldo pendiente en Impresos Trujillo E.I.R.L.
4. **OE4:** Determinar la influencia de la implementación del sistema en la exactitud de los arqueos diarios de caja en Impresos Trujillo E.I.R.L.
5. **OE5:** Determinar la influencia del módulo de inteligencia artificial en la precisión de la predicción de demanda de insumos en Impresos Trujillo E.I.R.L.

---

## 5. ANTECEDENTES DE LA INVESTIGACIÓN

> *Nota Metodológica:* Siguiendo rigurosamente las observaciones docentes (`notas_clase_profesor_2.txt` L8, `notas_clase_profesor_3.md` L72 y `notas_clase_profesor_6.txt` L15), los seis antecedentes (2 internacionales, 2 nacionales y 2 locales) se encuentran redactados en **prosa continua**, vinculados a la Variable Dependiente y reportando **valores cuantitativos y porcentajes numéricos de impacto real**.

### 5.1 Antecedentes Internacionales

1. **Zamora Irrazabal, E. J. (2021).** *Desarrollo de una aplicación Web para el Control de Ventas en la Empresa LF Publicidad*. Tesis de Grado, Universidad Técnica de Babahoyo, Los Ríos, Ecuador.
   En esta investigación experimental aplicada a una imprenta publicitaria de formato mediano, el autor implementó un sistema web bajo arquitectura cliente-servidor para automatizar el registro de pedidos y cotizaciones. En sus resultados cuantitativos, el investigador logró reducir el tiempo promedio de atención y emisión de comprobantes de 16.4 minutos a 4.2 minutos por cliente, lo que representó una disminución neta del 74.39% en los tiempos de espera en mostrador. Asimismo, la tasa de extravío de especificaciones técnicas de diseño se redujo del 18.5% al 0.0%, eliminando por completo los reprocesos en taller. Este antecedente aporta evidencia empírica directa para el primer objetivo específico de nuestra investigación, validando que la digitalización del mostrador reduce drásticamente el tiempo de ciclo operativo en empresas gráficas.

2. **Alvear Macías, C. A. & Guallichico Guamán, J. L. (2019).** *Desarrollo de un sistema Customer Relationship Management (CRM) para la imprenta Copy&Print*. Tesis de Grado, Universidad Tecnológica Israel, Quito, Ecuador.
   Los investigadores diseñaron e implantaron una plataforma web transaccional orientada al seguimiento secuencial de órdenes de trabajo de imprenta a través de las fases de preprensa, impresión y acabados. En la evaluación postest, alcanzaron el 100% de trazabilidad de los trabajos en taller y redujeron en un 65.0% el tiempo global de respuesta al cliente. De manera fundamental, el estudio demostró que la incorporación de un módulo de liquidación previa al despacho erradicó en un 100% las entregas de trabajos con saldos monetarios impagos, recuperando un 12.8% de liquidez que anteriormente se consideraba incobrable. Este antecedente sustenta de forma directa el tercer objetivo específico de nuestro proyecto orientado a eliminar las pérdidas económicas derivadas de pedidos entregados sin cancelar en caja.

### 5.2 Antecedentes Nacionales

3. **Chávez Gutiérrez, V. L. (2024).** *Sistema web basado en Scrum para la gestión de pedidos en la imprenta "New Imprent M&C"*. Tesis de Titulación, Universidad César Vallejo, Lima, Perú.
   La investigación evaluó el impacto de un sistema web integral sobre el proceso de recepción, control de insumos y entrega de comprobantes en una imprenta comercial de Lima. Tras la fase experimental, el tiempo medio de registro de pedidos disminuyó de 21.3 minutos a 4.8 minutos por orden (reducción del 77.46%), mientras que el porcentaje de órdenes entregadas fuera del plazo pactado cayó del 24.6% al 3.1%. Adicionalmente, el control sistematizado de insumos permitió reducir las mermas de papel y vinil del 15.8% al 4.2%, generando un ahorro económico del 11.6% en el presupuesto mensual de compras de materia prima. La investigación aporta sustento metodológico robusto al segundo y cuarto objetivo específico de nuestro estudio.

4. **Espinoza Reina, S. R. (2024).** *Implementación de un sistema web para el proceso de cotizaciones en la imprenta Publiprint*. Tesis de Grado, Universidad Privada del Norte, Lima, Perú.
   El autor investigó la automatización del cálculo de costos y cotizaciones de servicios publicitarios mediante una aplicación web conectada a una base de datos relacional. En sus mediciones cuantitativas, determinó que el tiempo de cálculo de presupuestos complejos cayó de 25.0 minutos a tan solo 3.5 minutos (mejora del 86.0%). Asimismo, la precisión en la estimación de insumos requeridos por trabajo se incrementó del 68.4% al 96.2%, evitando compras sobredimensionadas de material. Este antecedente respalda el segundo objetivo específico de nuestro proyecto, demostrando que la parametrización de recetas de insumos por metro cuadrado optimiza el uso de materiales de impresión gran formato.

### 5.3 Antecedentes Locales (Trujillo / La Libertad)

5. **Rey Ascoy, J. H. (2023).** *Aplicación web para mejorar el control de los servicios de imprenta en la empresa Corporación Gráfica San José S.A.C.* Tesis de Grado, Universidad Nacional de Trujillo, Trujillo, Perú.
   En este estudio realizado en el centro histórico de Trujillo, se evaluó la implantación de una aplicación web para el control de órdenes de trabajo y caja en una empresa gráfica local con problemática idéntica a Impresos Trujillo E.I.R.L. En la fase post-experimental, la empresa logró reducir las discrepancias en arqueos diarios de caja de un 22.4% a un 1.8%, logrando un 98.2% de exactitud en la conciliación de ingresos entre efectivo y billeteras digitales. De igual modo, el tiempo de elaboración del informe de cierre diario se redujo de 150 minutos a 12 minutos por jornada (disminución del 92.0%). Este estudio local aporta validez ecológica directa para nuestro cuarto objetivo específico sobre arqueos de caja segregados.

6. **Huayan Urbina, J. H. (2021).** *Gestión de procesos en el área de producción para reducir los costos en la empresa Imprenta Gráfica Moderna E.I.R.L.* Tesis de Grado, Universidad Privada del Norte, Trujillo, Perú.
   La investigación analizó la optimización de flujos de taller y reducción de desperdicios en una imprenta trujillana dedicada a comprobantes y gigantografías. La estandarización de procesos y el control riguroso de inventarios redujo el costo por desperdicio de sustratos en un 38.5%, disminuyendo los días de retraso por falta imprevista de insumos de 4.2 días a 0.5 días al mes. Este antecedente local fundamenta de forma contundente nuestro tercer y quinto objetivo específico, demostrando la viabilidad de mitigar quiebres de stock mediante control sistemático y modelos predictivos de insumos.

---

## 6. DEFINICIÓN DEL PROBLEMA

### 6.1 Problema General:
¿De qué manera influye la implementación de un sistema web transaccional con módulos de inteligencia de negocios e inteligencia artificial en la optimización de los procesos operativos y financieros en Impresos Trujillo E.I.R.L., Trujillo - 2026?

### 6.2 Problemas Específicos:
1. **PE1:** ¿De qué manera influye la implementación del sistema en el tiempo de registro de órdenes de trabajo en Impresos Trujillo E.I.R.L.?
2. **PE2:** ¿De qué manera influye la implementación del sistema en el control de inventario de insumos en Impresos Trujillo E.I.R.L.?
3. **PE3:** ¿De qué manera influye la implementación del sistema en las pérdidas financieras por entrega de trabajos con saldo pendiente en Impresos Trujillo E.I.R.L.?
4. **PE4:** ¿De qué manera influye la implementación del sistema en la exactitud de los arqueos diarios de caja en Impresos Trujillo E.I.R.L.?
5. **PE5:** ¿De qué manera influye la implementación del módulo de inteligencia artificial en la precisión de la predicción de demanda de insumos en Impresos Trujillo E.I.R.L.?
