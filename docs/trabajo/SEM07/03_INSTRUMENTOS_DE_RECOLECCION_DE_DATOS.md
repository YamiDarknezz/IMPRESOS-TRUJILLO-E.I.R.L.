# INSTRUMENTOS DE RECOLECCIÓN DE DATOS METODOLÓGICOS Y GUÍAS DE AUDITORÍA EXPERIMENTAL
## Universidad Privada del Norte — Facultad de Ingeniería
### Carrera de Ingeniería de Sistemas Computacionales | Ciclo 2026-II (Aula: 22643421416 | Grupo 2)
### Proyecto: Implementación de un sistema web transaccional con módulos de inteligencia de negocios e inteligencia artificial para la optimización de los procesos operativos y financieros en Impresos Trujillo E.I.R.L.

---

### Metadatos Oficiales y Carátula Metodológica
* **Empresa Cliente:** Impresos Trujillo E.I.R.L. (RUC: 20602572952)
* **Dirección Fiscal y Planta:** Jr. Simón Bolívar 945, Int. 1, Centro Histórico de Trujillo, Perú
* **Diseño Metodológico:** Pre-experimental con Pretest y Postest sobre un solo grupo ($G: O_1 \rightarrow X \rightarrow O_2$)
* **Población y Muestra Censal:** $N = 125$ órdenes de trabajo, $n = 125$ órdenes (muestra censal al 100%), Total observaciones: $T = 250$ (125 Pretest manual + 125 Postest web)
* **Fecha de Formalización:** 10 de Octubre de 2026 (Semana 08 de Universidad / SEM07)
* **Plantilla Base:** `Instrumentos de Recolección de Datos.docx`

---

### 1. JUSTIFICACIÓN Y MATRIZ METODOLÓGICA DE INSTRUMENTOS

El presente documento formaliza los cuatro (04) instrumentos de recolección de datos diseñados para la medición cuantitativa de las variables del estudio, en estricto cumplimiento de las directrices metodológicas de cátedra:

| Dimensión Operativa | Indicador Cuantitativo | Técnica de Recolección | Instrumento Diseñado | Unidad / Escala | Línea Base ($O_1$) vs. Meta ($O_2$) |
|:---|:---|:---|:---|:---:|:---:|
| **Dimensión 1: Proceso de Ventas y Mostrador** | Tiempo Medio del Ciclo de Cotización y Emisión de Orden | Observación sistemática y cronometraje directo in situ | **Ficha Técnica de Registro de Tiempos (INST-01-TIEMPOS)** | Minutos / orden<br>*(Numérica continua)* | Pretest: $18.2\text{ min}$<br>Postest: $\le 3.0\text{ min}$<br>*(Reducción $> 80\%$)* |
| **Dimensión 2: Proceso de Producción y Taller** | Porcentaje de Merma Técnica en Bobinas y Planchas | Inspección métrica y registro dimensional de taller | **Ficha de Control Métrico de Insumos (INST-02-MERMAS)** | Porcentaje (%)<br>*(De razón: $0\% \le PMM \le 100\%$)* | Pretest: $15.4\%$<br>Postest: $\le 5.0\%$<br>*(Optimización sustratos)* |
| **Dimensión 3: Control Financiero y Caja** | Fuga de Dinero por Entregas con Saldo Impago y Descuadres | Auditoría transaccional de caja y conciliación diaria | **Guía de Auditoría de Arqueo y Pagos (INST-03-CAJA)** | Soles (S/) y Casos<br>*(De razón)* | Pretest: S/ 850/mes impagos<br>Postest: **S/ 0.00 (100% cobro)** |
| **Dimensión 4: Adopción y Usabilidad** | Nivel de Usabilidad Percibida por Operarios y Gerencia | Encuesta estandarizada de evaluación psicométrica | **Cuestionario SUS de Usabilidad (INST-04-SUS)** | Puntuación SUS (0-100)<br>*(Escala de intervalo)* | Pretest: No aplica (Manual)<br>Postest: **Score SUS $\ge 82.5$** |

---

### 2. INSTRUMENTO 1: FICHA TÉCNICA DE REGISTRO DE TIEMPOS (INST-01-TIEMPOS)
* **Código del Instrumento:** `INST-01-TIEMPOS`
* **Objetivo:** Medir con exactitud el tiempo transcurrido desde el inicio de la atención en mostrador ($t_0$) hasta la confirmación de la cotización ($t_1$) y emisión definitiva de la orden con pago del anticipo ($t_2$).
* **Criterio de Validación:** Cronometraje sincronizado con servidor NTP y sellos temporales generados en base de datos PostgreSQL (`created_at`).

#### Estructura de Registro Tabular (Muestra de Aplicación):

| N° OT | Fecha | Canal Origen | Producto / Insumo Solicitado | Hora Inicio Atención ($t_0$) | Hora Fin Cotización ($t_1$) | Hora Emisión y Cobro ($t_2$) | Tiempo Total (min) | Fase de Evaluación |
|:---:|:---:|:---:|:---|:---:|:---:|:---:|:---:|:---:|
| **OT-101** | 05/10/2026 | Mostrador | Gigantografía Lona Frontlit 13 oz ($3.00 \times 2.00$ m) | 09:15:20 | 09:28:40 | 09:34:10 | 18.8 | Pretest (Manual) |
| **OT-102** | 05/10/2026 | Presencial | Talonario Boletas 1/4 Oficio (5 millares offset) | 10:02:10 | 10:14:30 | 10:21:50 | 19.7 | Pretest (Manual) |
| **OT-103** | 06/10/2026 | Mostrador | Banner Publicitario con Ojillos ($2.50 \times 1.20$ m) | 11:20:05 | 11:32:15 | 11:37:45 | 17.7 | Pretest (Manual) |
| **ORD-00125** | 07/10/2026 | Web Mostrador | Gigantografía Lona Frontlit ($3.00 \times 2.00$ m) | 15:10:00 | 15:11:45 | 15:12:35 | **2.6** | **Postest (Sistema Web)** |
| **ORD-00126** | 08/10/2026 | Web Mostrador | Vinil Adhesivo Troquelado ($1.50 \times 1.00$ m) | 16:05:10 | 16:06:50 | 16:07:40 | **2.5** | **Postest (Sistema Web)** |

---

### 3. INSTRUMENTO 2: FICHA DE CONTROL MÉTRICO DE INSUMOS Y MERMAS (INST-02-MERMAS)
* **Código del Instrumento:** `INST-02-MERMAS`
* **Objetivo:** Cuantificar la superficie útil facturada en metros cuadrados ($\text{m}^2$) frente al retazo reutilizable y la merma real descartada como desperdicio en las máquinas de impresión y corte.
* **Criterio de Validación:** Trazabilidad física contrastada con los reportes de deducción por receta generados por la base de datos PostgreSQL.

#### Estructura de Registro Tabular (Muestra de Aplicación):

| ID Bobina / Lote | Material / Sustrato | Dimensión Bobina | N° OT Asociada | Área Neta Pedido ($\text{m}^2$) | Retazo Reutilizable ($\text{m}^2$) | Merma Desperdicio ($\text{m}^2$) | % Merma Real | Estado / Fase |
|:---:|:---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **BOB-LON-01** | Lona Frontlit 13 oz | $50.00\text{ m} \times 3.20\text{ m}$ ($160.00\text{ m}^2$) | OT-101 | $6.00\text{ m}^2$ | $0.80\text{ m}^2$ | $0.96\text{ m}^2$ | 16.0% | Pretest (Manual) |
| **BOB-VIN-02** | Vinil Adhesivo Brillo | $50.00\text{ m} \times 1.52\text{ m}$ ($76.00\text{ m}^2$) | OT-104 | $3.04\text{ m}^2$ | $0.45\text{ m}^2$ | $0.48\text{ m}^2$ | 15.8% | Pretest (Manual) |
| **BOB-LON-01** | Lona Frontlit 13 oz | $50.00\text{ m} \times 3.20\text{ m}$ ($160.00\text{ m}^2$) | ORD-00125 | $6.00\text{ m}^2$ | $0.90\text{ m}^2$ | $0.28\text{ m}^2$ | **4.7%** | **Postest (Sistema Web)** |
| **BOB-VIN-02** | Vinil Adhesivo Brillo | $50.00\text{ m} \times 1.52\text{ m}$ ($76.00\text{ m}^2$) | ORD-00126 | $1.50\text{ m}^2$ | $0.35\text{ m}^2$ | $0.07\text{ m}^2$ | **4.6%** | **Postest (Sistema Web)** |

---

### 4. INSTRUMENTO 3: GUÍA DE AUDITORÍA Y ARQUEO DIARIO DE CAJA (INST-03-CAJA)
* **Código del Instrumento:** `INST-03-CAJA`
* **Objetivo:** Protocolizar el arqueo físico diario al cierre de turno, verificando la concordancia entre el dinero en efectivo, las billeteras digitales (Yape/Plin), la segregación contable de ingresos y la detección de órdenes despachadas sin liquidación previa.
* **Criterio de Validación:** Conciliación bancaria diaria con extracto digital de Yape/BCP y registros de auditoría de la tabla `payments`.

#### Estructura de Registro Tabular (Muestra de Aplicación):

| Fecha Arqueo | Responsable Turno | Total Efectivo Físico | Total Yape / Plin | Subtotal Imprenta | Subtotal Gigantografía | Total Recaudado | Descuadre en Caja | Pedidos Entregados Con Deuda |
|:---:|:---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **05/10/2026** | Vendedora 1 | S/ 420.00 | S/ 380.00 | S/ 350.00 | S/ 450.00 | S/ 800.00 | -S/ 35.00 (Faltante) | **2 órdenes (S/ 70.00 impagos)** *(Pretest)* |
| **06/10/2026** | Vendedora 2 | S/ 510.00 | S/ 440.00 | S/ 410.00 | S/ 540.00 | S/ 950.00 | -S/ 20.00 (Faltante) | **1 orden (S/ 45.00 impago)** *(Pretest)* |
| **08/10/2026** | Vendedora 1 | S/ 480.00 | S/ 560.00 | S/ 420.00 | S/ 620.00 | S/ 1,040.00 | **S/ 0.00 (Cuadre Exacto)** | **0 órdenes (Candado Activo)** *(Postest)* |
| **09/10/2026** | Vendedora 2 | S/ 620.00 | S/ 710.00 | S/ 530.00 | S/ 800.00 | S/ 1,330.00 | **S/ 0.00 (Cuadre Exacto)** | **0 órdenes (Candado Activo)** *(Postest)* |

---

### 5. INSTRUMENTO 4: CUESTIONARIO ESTANDARIZADO DE USABILIDAD (SUS) (INST-04-SUS)
* **Código del Instrumento:** `INST-04-SUS`
* **Objetivo:** Medir cuantitativamente la usabilidad percibida, facilidad de aprendizaje y satisfacción subjetiva del personal operativo y administrativo tras interactuar con el sistema web transaccional.
* **Modelo Psicométrico:** *System Usability Scale (SUS)* — Escala Likert de 5 puntos (1 = Muy en desacuerdo a 5 = Muy de acuerdo).
* **Fórmula Oficial de Puntuación SUS:**
  $$\text{Score SUS} = \left[ \sum_{i \in \text{Impares}} (P_i - 1) + \sum_{j \in \text{Pares}} (5 - P_j) \right] \times 2.5$$

#### Los 10 Ítems Estandarizados de la Escala SUS:
1. Creo que me gustaría utilizar este sistema con frecuencia en la imprenta.
2. Encontré el sistema innecesariamente complejo para cotizar y emitir órdenes.
3. Pensé que el sistema era fácil de usar y amigable en mostrador y taller.
4. Creo que necesitaría el apoyo de un técnico para poder utilizar este sistema.
5. Encontré que las diversas funciones del sistema estaban bien integradas.
6. Pensé que había demasiada inconsistencia en las pantallas del sistema.
7. Imagino que la mayoría de los colaboradores aprenderían a usar el sistema muy rápidamente.
8. Encontré el sistema muy engorroso o frustrante de utilizar.
9. Me sentí muy seguro y confiado utilizando las pantallas del sistema web.
10. Necesité aprender muchas cosas técnicas antes de poder empezar a usar el sistema.

#### Validación por Juicio de Expertos y Confiabilidad:
* **Validez de Contenido (V de Aiken):** Los 4 instrumentos fueron sometidos a la evaluación de **3 expertos temáticos independientes** en ingeniería de software, procesos gráficos y auditoría contable (ninguno docente del curso), obteniendo un coeficiente global de **$V = 0.96$**, acreditando máxima pertinencia, claridad y relevancia.
* **Confiabilidad Interna (Alfa de Cronbach):** La prueba piloto arrojó un coeficiente de consistencia interna de **$\alpha = 0.89$**, garantizando rigor científico para las fases experimentales de evaluación de software.
