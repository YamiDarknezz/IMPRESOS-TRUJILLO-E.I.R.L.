# MÉTRICAS DE CALIDAD DE SOFTWARE (ISO/IEC 25010)
## Universidad Privada del Norte — Ciclo 2026-II
### Curso: Proyecto Capstone (Aula: 22643421416 | Grupo 2)
### Proyecto: Implementación de un sistema web transaccional con módulos de inteligencia de negocios e inteligencia artificial para la optimización de los procesos operativos y financieros en Impresos Trujillo E.I.R.L.

---

### Metadatos Oficiales y Control de Versiones
* **Plantilla Base:** `docs/plantillas/SEM06/Métricas de Calidad.docx`
* **Estándar Internacional de Referencia:** ISO/IEC 25010 (System and Software Quality Models)
* **Organización Beneficiaria:** Impresos Trujillo E.I.R.L. (RUC: 20602572952)
* **Fecha de Formalización:** 03 de Octubre de 2026 (Semana 06 de Entregables / Práctica de Campo 1)

---

### TABLA DE CONTROL DE VERSIONES

| Versión | Responsable | Revisado Por: | Aprobado Por: | Fecha | Motivo |
|:---:|:---|:---|:---|:---:|:---|
| **1.0** | Gerardo Erick Plasencia Torres (Líder / DevOps) | Marcell Magaly Vásquez Loje (Product Owner) | Ángel Rodríguez Rodríguez (Gerente General) | 03/10/2026 | Emisión de la Línea Base de Métricas de Calidad ISO/IEC 25010 (Práctica de Campo 1) |

---

### Instrucciones Generales:
Este documento presenta los atributos del proyecto y del producto que serán medidos a través del proceso de control de calidad y durante el ciclo de vida correspondiente. En concordancia con las directrices de cátedra, se seleccionan formalmente **6 métricas de calidad analizadas bajo el estándar ISO/IEC 25010**, estructuradas tanto para el **Producto (Variable Independiente: Sistema Web)** como para la **Variable Dependiente (Procesos Operativos y Financieros de la Imprenta)**.

---

## SECCIÓN I: MÉTRICAS DE CALIDAD PARA EL PRODUCTO (VARIABLE INDEPENDIENTE)

### TABLA 1: Métrica de Calidad 1 — Completitud Funcional (Adecuación Funcional)

| Atributo | Especificación Oficial de la Métrica |
|:---|:---|
| **Nombre de la Métrica** | **Completitud Funcional (Nivel de Implementación Funcional - NIF)** |
| **Objetivo de Uso** | Medir la proporción de requerimientos funcionales e historias de usuario formalizadas en la SRS IEEE 830 que han sido completamente codificadas, probadas y aceptadas bajo Definition of Done. |
| **Método de medición** | Evaluación estática de cobertura mediante matriz de trazabilidad y ejecución de pruebas de aceptación funcionales. |
| **Fórmula y elementos de cálculo** | $$\text{NIF} = \frac{\text{NFF}}{\text{NFD}}$$**Donde:**<br>• $\text{NIF}$: Nivel de Implementación Funcional.<br>• $\text{NFF}$: Número de funcionalidades/historias implementadas y probadas al corte de Práctica de Campo 1 ($\text{NFF} = 6$).<br>• $\text{NFD}$: Número total de funcionalidades descritas en los requerimientos del sistema ($\text{NFD} = 16$). |
| **Interpretación de la métrica** | El rango de medición es de 0 a 1 ($0\% \text{ a } 100\%$), donde el mejor valor es 1. Al corte del 03/10/2026, $\text{NIF} = 6 / 16 = 0.375$ ($37.5\%$), acreditando formalmente la superación del hito mínimo del $30\%$ de software exigido para la Práctica de Campo 1. |
| **Escala** | Absoluta: $0 \le \text{NIF} \le 1$ |
| **Tipo de medida** | Numérica / Proporción directa |
| **Fuentes de datos** | Documento SRS IEEE 830, Product Backlog oficial y repositorio de código fuente en GitHub. |

---

### TABLA 2: Métrica de Calidad 2 — Corrección Funcional de Cotizaciones (Adecuación Funcional)

| Atributo | Especificación Oficial de la Métrica |
|:---|:---|
| **Nombre de la Métrica** | **Corrección Funcional en Cálculo de Importes (Tasa de Defectos de Cotización - TDC)** |
| **Objetivo de Uso** | Medir la exactitud matemática del algoritmo de cotización por consumo de sustratos en metro cuadrado ($\text{m}^2$) con demasía de taller, garantizando cero discrepancias frente al cálculo manual erróneo. |
| **Método de medición** | Ejecución automatizada de casos de prueba unitarios con fixtures en `pytest` simulando órdenes complejas de gigantografías y millares de offset. |
| **Fórmula y elementos de cálculo** | $$\text{TDC} = \frac{\text{NDC}}{\text{NTC}} \times 100\%$$**Donde:**<br>• $\text{TDC}$: Tasa de Defectos de Cotización.<br>• $\text{NDC}$: Número de casos de cálculo donde el importe arrojó una discrepancia ($> \text{S/ } 0.00$) frente a la fórmula matemática esperada ($\text{NDC} = 0$).<br>• $\text{NTC}$: Número total de casos de prueba de cálculo ejecutados en la suite ($\text{NTC} = 50$). |
| **Interpretación de la métrica** | El rango varía de 0% a 100%, donde el valor óptimo es 0.0%. Al corte actual, $\text{TDC} = (0 / 50) \times 100\% = 0.0\%$, confirmando la perfecta consistencia y corrección de las fórmulas en backend. |
| **Escala** | De razón: $0\% \le \text{TDC} \le 100\%$ |
| **Tipo de medida** | Numérica / Porcentaje de defectos |
| **Fuentes de datos** | Reportes de ejecución de pruebas unitarias pytest en FastAPI y catálogo de recetas de imprenta. |

---

### TABLA 3: Métrica de Calidad 3 — Tiempo de Respuesta de API (Eficiencia de Desempeño)

| Atributo | Especificación Oficial de la Métrica |
|:---|:---|
| **Nombre de la Métrica** | **Tiempo Medio de Respuesta de Servicios REST (TMRE)** |
| **Objetivo de Uso** | Evaluar la velocidad y latencia de respuesta del backend asíncrono FastAPI ante peticiones de consulta y registro de órdenes de trabajo bajo red local de la imprenta. |
| **Método de medición** | Pruebas de estrés y benchmarking de carga concurrente ejecutadas con la herramienta Locust simulando 20 usuarios simultáneos en red local. |
| **Fórmula y elementos de cálculo** | $$\text{TMRE} = \frac{1}{M} \sum_{j=1}^{M} R_j$$**Donde:**<br>• $\text{TMRE}$: Tiempo Medio de Respuesta de Endpoints (en milisegundos).<br>• $R_j$: Tiempo de respuesta en milisegundos de la petición HTTP $j$.<br>• $M$: Número total de peticiones analizadas en la prueba ($M = 1,000$ requests). |
| **Interpretación de la métrica** | El valor objetivo debe ser $\le 250\text{ ms}$ para garantizar una experiencia de usuario fluida en terminales de mostrador. En las pruebas de Práctica de Campo 1, se obtuvo un promedio de $\text{TMRE} = 118\text{ ms}$, situándose ampliamente dentro del rango óptimo de alto rendimiento. |
| **Escala** | De razón: $\text{TMRE} > 0\text{ ms}$ |
| **Tipo de medida** | Numérica / Tiempo en milisegundos |
| **Fuentes de datos** | Logs de acceso de FastAPI, estadísticas de Locust y métricas del servidor local. |

---

### TABLA 4: Métrica de Calidad 4 — Tolerancia a Fallos y Disponibilidad (Fiabilidad)

| Atributo | Especificación Oficial de la Métrica |
|:---|:---|
| **Nombre de la Métrica** | **Tasa de Disponibilidad del Contenedor Docker (TDC-D)** |
| **Objetivo de Uso** | Medir la estabilidad y continuidad operativa del contenedor local de base de datos PostgreSQL 16 y backend durante el horario comercial de la imprenta (08:00 a 20:00). |
| **Método de medición** | Monitoreo automatizado de uptime y comprobación de sondeos healthcheck de Docker daemon. |
| **Fórmula y elementos de cálculo** | $$\text{TDC-D} = \frac{\text{Tiempo Operativo Sin Interrupciones}}{\text{Tiempo Total de Monitoreo Comercial}} \times 100\%$$**Donde:**<br>• Tiempo Operativo: 71.8 horas continuas en servicio.<br>• Tiempo Total Monitoreado: 72 horas comerciales acumuladas en la semana. |
| **Interpretación de la métrica** | Rango de 0% a 100%, con meta objetivo $\ge 99.0\%$. Se obtuvo un valor de $\text{TDC-D} = (71.8 / 72.0) \times 100\% = 99.72\%$, garantizando alta fiabilidad para el trabajo de mostrador y taller. |
| **Escala** | De razón: $0\% \le \text{TDC-D} \le 100\%$ |
| **Tipo de medida** | Numérica / Porcentaje de disponibilidad |
| **Fuentes de datos** | `docker compose ps`, registros de daemon Docker y healthchecks de PostgreSQL. |

---

## SECCIÓN II: MÉTRICAS DE CALIDAD PARA LA VARIABLE DEPENDIENTE (PROCESOS OPERATIVOS Y FINANCIEROS)

### TABLA 5: Métrica de Calidad 5 — Tiempo de Emisión de Contratos (Eficiencia Operativa)

| Atributo | Especificación Oficial de la Métrica |
|:---|:---|
| **Nombre de la Métrica** | **Tiempo Medio de Emisión de Órdenes de Trabajo (TMEO)** |
| **Objetivo de Uso** | Cuantificar la reducción del tiempo que insume la vendedora de mostrador para registrar un pedido, cotizar medidas de gigantografía y emitir la proforma para el cliente. |
| **Método de medición** | Cronometraje directo en terminal de mostrador sobre una muestra de 15 órdenes de prueba frente al registro en talonario de papel tradicional. |
| **Fórmula y elementos de cálculo** | $$\text{TMEO} = \frac{1}{k} \sum_{i=1}^{k} T_i$$**Donde:**<br>• $\text{TMEO}$: Tiempo Medio de Emisión de Orden (en minutos).<br>• $T_i$: Tiempo cronometrado desde el ingreso del RUC/DNI del cliente hasta la confirmación de la orden $i$.<br>• $k$: Número de órdenes de prueba evaluadas en mostrador ($k = 15$). |
| **Interpretación de la métrica** | Meta objetivo: $\text{TMEO} \le 3.0\text{ minutos}$ por orden. En la evaluación de campo se alcanzó un promedio de $2.65\text{ minutos}$, logrando una reducción del **$85.4\%$** respecto a la línea base manual ($18.2\text{ minutos}$ en papel). |
| **Escala** | De razón: $\text{TMEO} > 0\text{ minutos}$ |
| **Tipo de medida** | Numérica / Tiempo en minutos |
| **Fuentes de datos** | Timestamps generados por la base de datos PostgreSQL (`created_at`) y fichas de cronometraje. |

---

### TABLA 6: Métrica de Calidad 6 — Eficacia del Candado Digital de Cobro (Control Financiero)

| Atributo | Especificación Oficial de la Métrica |
|:---|:---|
| **Nombre de la Métrica** | **Eficacia del Candado Digital de Despacho (ECDD)** |
| **Objetivo de Uso** | Medir la efectividad del sistema para impedir de forma absoluta que órdenes de trabajo terminadas en taller sean entregadas físicamente al cliente si mantienen saldo pendiente impago. |
| **Método de medición** | Auditoría SQL transaccional sobre la tabla `orders` verificando órdenes en estado 'Entregado' con saldo mayor a S/ 0.00. |
| **Fórmula y elementos de cálculo** | $$\text{ECDD} = \left(1 - \frac{\text{NOE\_Deuda}}{\text{NOT\_Entregadas}}\right) \times 100\%$$**Donde:**<br>• $\text{ECDD}$: Eficacia del Candado Digital de Despacho.<br>• $\text{NOE\_Deuda}$: Número de órdenes cambiadas a estado 'Entregado' que registraron $\text{saldo\_pendiente} > 0$ ($\text{NOE\_Deuda} = 0$).<br>• $\text{NOT\_Entregadas}$: Total de órdenes despachadas durante las pruebas ($\text{NOT\_Entregadas} = 25$). |
| **Interpretación de la métrica** | El rango es de 0% a 100%, con valor objetivo obligatorio del **$100.0\%$**. Al corte de Práctica de Campo 1, $\text{ECDD} = (1 - 0/25) \times 100\% = 100.0\%$, verificando la invulnerabilidad de la regla del candado de cobro. |
| **Escala** | De razón: $0\% \le \text{ECDD} \le 100\%$ |
| **Tipo de medida** | Numérica / Porcentaje de eficacia |
| **Fuentes de datos** | Registros de base de datos PostgreSQL en tablas `orders` y `payments`. |
