# INFORME DE ESTADO DEL PROYECTO (v4.0)
## Implementación de un sistema web transaccional con módulos de inteligencia de negocios e inteligencia artificial para la optimización de los procesos operativos y financieros en Impresos Trujillo E.I.R.L.

> **BORRADOR PARA REVISIÓN INTERNA SEM07.** Se contrastó el código del corte y el workflow de GitHub del 10/10. Las cifras EVM, horas/costos, resultados de instrumentos y aceptación AAE-03 quedan pendientes de cotejo con sus fuentes originales; no presentar como final.

---

### Registro de Revisión

> Las entradas 1.0–3.0 se heredaron de versiones previas y no fueron revalidadas durante esta revisión; usarlas como historial solo después de cotejar los archivos y actas fuente.

| Versión | Fecha | Modificaciones / Descripción | Responsables / Cargos Formales |
|:---:|:---:|:---|:---|
| **1.0** | 26/09/2026 | Emisión formal del Informe de Estado del Proyecto al cierre de la Semana 5 (Sprint 2): consolidación del primer incremento de software funcional (catálogo de insumos, tracking de bobinas UV DTF y planchas MDF, ventas express, arqueo de caja con candado digital y pipeline CI/CD automatizado), sinceramiento de indicadores EVM, y articulación con el Acta de Aceptación de Entregables formal suscrita con la gerencia. | Gerardo Plasencia Torres (Líder / DevOps)<br>Jose Estibb Anhuaman Delgado (Frontend Lead)<br>Jose Diego Rodríguez Vásquez (Backend Lead) |
| **1.1** | 26/09/2026 | Registro de revisión/AAE-01 heredado del borrador. Verificar acta y firmas originales antes de citar aceptación o cargos. | Representantes de empresa y equipo — validar en acta |
| **2.0** | 02/10/2026 | Subsanación de observaciones docentes de Clase 6: reingeniería del presupuesto en 31 paquetes EDT (S/ 5,100.00), antecedentes APA 7ma con 6 tesis reales y formalización de cargos institucionales de stakeholders. | Ing. José Alberto Gómez Ávila (Docente Asesor / Cátedra Capstone UPN) |
| **3.0** | 03/10/2026 | Subsanación integral de observaciones de cátedra (Corte al 03/10/2026): justificación matemática explícita de semáforos semanales (95%, 96.5%, 96%), memoria de cálculo de amortización, columna de Fecha Real de Entrega al Cliente, digitalización y depuración de dataset histórico a partir de boletas físicas de la empresa para módulos BI e IA, ejecución de 375 pruebas unitarias y suscripción de Acta AAE-02. | Gerardo Erick Plasencia Torres (Líder / Full Stack)<br>Jose Diego Rodríguez Vásquez (Backend / IA)<br>Jose Estibb Anhuaman Delgado (Frontend / UX)<br>Docente Asesor (Cátedra Capstone UPN) |
| **4.0 — borrador revisado** | 10/10/2026 | Monitoreo de Avance 1, SEM07 (semana académica 08). El historial acredita mejoras de órdenes, pagos e inventario; CI verificable: 293 pruebas backend y 469 frontend. No se atribuyen a este corte los módulos BI/IA posteriores. Falta cotejar EVM, trabajo de campo y aceptación AAE-03. | Gerardo Erick Plasencia Torres, Jose Estibb Anhuaman Delgado, Jose Diego Rodríguez Vásquez |

---

### Tabla de contenido
1. Descripción del Proyecto
2. Resumen del Estado del Proyecto
3. Sustento del Estado del Proyecto
4. Cambios principales ocurridos desde el último reporte emitido
5. Hitos y entregables del proyecto (Semana/Mes Actual y Siguiente)
6. Indicadores Clave de Desempeño (KPI's)
* ANEXO 1: Tablas de Validación de Alcance, Tiempo y Costos
* ANEXO 2: Criterios y Leyendas de Semaforización Oficial
* ANEXO 3: Evidencias Técnicas del Software Desarrollado (Sprint 4)

---

### 1. DESCRIPCIÓN DEL PROYECTO:
El proyecto tiene como objetivo implementar un sistema web transaccional para Impresos Trujillo E.I.R.L., con alcance planificado de inteligencia de negocios e inteligencia artificial según la EDT. El diseño contempla una interfaz Angular, servicios REST con FastAPI y una base PostgreSQL contenerizada; los componentes y entregables por fase deben verificarse contra el corte correspondiente. Al 10/10/2026, la evidencia de repositorio revisada para este informe acredita cambios de órdenes, pagos e inventario y CI; no acredita que el Dashboard BI, las funciones analíticas/IA ni el despliegue VPS estuvieran terminados. La descripción del alcance objetivo no constituye evidencia de implementación o aceptación.

---

### 2. RESUMEN DEL ESTADO DEL PROYECTO
**Período evaluado: 05/10/2026–10/10/2026 (SEM07 / Semana académica 08).** El sábado 10 es jornada de clase; no se contabiliza como trabajo, horas-hombre ni costo.

| Alcance Semanal | Tiempo Semanal | Costo Semanal |
|:---:|:---:|:---:|
| **Pendiente: validar alcance/EDT** | **Pendiente: horas L–V** | **Pendiente: sustento AC/PV** |

#### Explicaciones de los Semáforos Semanales:

* **Respecto al Alcance:** Pendiente de recalcular con la línea base semanal y las actividades realmente aceptadas. El 80.0% del borrador contaba BI/IA como terminado, pero esos componentes no aparecen en el código verificable del corte. No conservar el semáforo sin reconciliar las actividades con la EDT y aplicar la regla binaria indicada por cátedra.

* **Respecto al Tiempo:** Pendiente de recalcular desde las duraciones y horas verificadas de lunes 05/10 a viernes 09/10. La tabla del borrador mezcla una actividad al 50%, 13 días reales frente a 12 planificados y una regla binaria 100%/0%; no conservar el 83.3% ni el SPI hasta corregir la base. Sábado es clase, no trabajo.

* **Respecto al Costo:** Pendiente de sustento con hoja de horas, línea base de costos y comprobantes/criterio de amortización. Los importes S/ 1,300 y S/ 1,400 del borrador no se presentan como costo real auditado en esta revisión.

---

### 3. SUSTENTO DEL ESTADO DEL PROYECTO

* **• Sustento del Alcance:** El historial de Git del corte registra las mejoras de órdenes, pagos e inventario de los PR #122–#127: teléfono/búsqueda de pedidos, filtro por local y pendientes del día, adelanto repartido en varios métodos, Yape por destinatario y consumo automático del rollo ligado a una orden. El código consultado no acredita en SEM07 un dashboard BI/IA ni endpoints de análisis de mermas; no se atribuyen al período. El run CI #38028670036 aporta evidencia técnica de 293 pruebas backend y 469 frontend aprobadas; no acredita despliegue (el job fue omitido). La copia AAE-03 archivada tiene campos de firma vacíos; la aceptación formal se mantiene pendiente de cotejo con ejemplar firmado.

* **• Sustento del Tiempo:** El período académico incluye el sábado 10/10, pero el trabajo Scrum se corta el viernes 09/10. La ejecución automática de CI concluyó a las 00:47 del sábado y no representa dedicación humana. Los commits finales llevan sellos entre el viernes por la noche y poco después de medianoche; confirmar con Estibb el día efectivo del trabajo sin reportar tareas de desarrollo en sábado.

* **• Sustento del Costo y Memoria de Amortización (Observación 4):** Pendiente de reconstrucción con las horas efectivamente trabajadas de lunes a viernes, el costo planificado de la línea base y comprobantes de VPS/recursos. No se conserva el desglose anterior como dato real hasta que el equipo proporcione sus fuentes.

---

### 4. CAMBIOS PRINCIPALES OCURRIDOS DESDE EL ÚLTIMO REPORTE EMITIDO:

Durante el corte SEM07, las entregas comprobables en el historial del repositorio fueron:

1. **Consulta de órdenes:** búsqueda por teléfono y filtros de local/pendientes del día (PR #122–#123).
2. **Pagos:** reparto del adelanto entre métodos y selección de destinatario de Yape (PR #124–#125).
3. **Inventario:** consumo del rollo asociado al crear/editar/cancelar una orden (PR #127).
4. **CI:** ejecución de pruebas y build en run #38028670036 (293 backend, 469 frontend). Despliegue VPS omitido.

El alcance BI/IA, los valores de merma/modelo, la validación psicométrica y la aceptación de cliente no se registran como concluidos en este borrador; requieren código/datos/firmas originales fechados dentro del período. Corroborar con Estibb y Diego si hubo prototipos locales no integrados y añadirlos solo con evidencia identificable.

---

### 5. HITOS Y ENTREGABLES DEL PROYECTO (SEMANA/MES ACTUAL Y SIGUIENTE):

En estricto cumplimiento de la estructura de la plantilla oficial, a continuación se detallan los hitos y entregables correspondientes exclusivamente a la semana en curso (período evaluado) y a la semana siguiente proyectada:

* **• Hitos y Entregables del Período Actual Evaluado (Semana 07: 05/10/2026 al 10/10/2026):**
  - **09–10/10/2026:** Integración de cambios de órdenes/filtros, pagos/Yape y consumo de rollo (PR #122–#127). El día exacto de trabajo humano queda por confirmar con las personas autoras; los merges automáticos con fecha posterior a medianoche no se contabilizan como jornada sabatina.
  - **10/10/2026:** Run CI #38028670036 completado automáticamente: 293 backend y 469 frontend aprobadas; job de despliegue omitido.
  - **10/10/2026:** Monitoreo de Avance 1 y clase universitaria. Se registra como hito académico, no como horas/tareas de desarrollo.

* **• Hitos y Entregables del Período Siguiente Proyectado (Semana 08: 12/10/2026 al 17/10/2026):**
  - **12–16/10/2026 (lunes–viernes):** según el cronograma, continuar deducción automática de insumos y registro de mermas (EDT 3.4), y completar el tablero de estados de taller (EDT 3.5). Cotejar tareas del Sprint 5 con backlog aprobado.
  - **17/10/2026 (sábado):** jornada académica; no registrar trabajo, horas ni costos sin actividad laboral confirmada. El inicio de Fase 4 BI/IA está planificado para el 19/10/2026.

#### Tabla 2: Hitos y Entregables Evaluados (Semana Actual y Siguiente):

| Código EDT | Actividad | Entregable | Fecha Planeada de Culminación | Fecha Real de Entrega | Estado |
|:---|:---|:---|:---:|:---:|:---|
| Pendiente de mapeo | Mejoras de búsqueda/listado y filtro de órdenes (PR #122–#123) | Cambios integrados en repositorio | Por cotejar con cronograma | No acreditada al cliente | Código integrado; EDT/aceptación por validar |
| Pendiente de mapeo | Adelanto repartido y destinatarios Yape (PR #124–#125) | Cambios integrados en repositorio | Por cotejar con cronograma | No acreditada al cliente | Código integrado; EDT/aceptación por validar |
| Pendiente de mapeo | Descuento automático de rollo asociado a orden (PR #127) | Cambios integrados en repositorio | Por cotejar con cronograma | No acreditada al cliente | Merge registrado 10/10 00:01; confirmar día de trabajo humano |
| **TOTAL** | Tres grupos de cambios versionados | Integraciones PR #122–#127 | EDT/plan por validar | Recepción del cliente no acreditada | Mapeo y porcentaje pendientes |

---

### 6. INDICADORES CLAVE DE DESEMPEÑO (KPI'S)

#### Estado de los KPI EVM

* **Schedule Variance (SV) / SPI:** pendiente de recalcular con línea base y jornada laboral L–V validadas.
* **Cost Variance (CV) / CPI:** pendiente de recalcular con hoja de horas, presupuesto de semana y fuentes de gastos/amortización.
* No conservar SV -S/30, SPI .98, CV +S/100 o CPI 1.08 como cifras finales sin reconciliar sus entradas y aritmética con el equipo.

---

### ANEXO 1: Tablas de Validación de Alcance, Tiempo y Costos

#### Tabla 3: Detalle de Validación del Alcance (Regla Binaria: 100% o 0%)

| ACTIVIDAD | ENTREGABLE | % CUMPLIMIENTO |
|:---|:---|:---:|
| Cambios de órdenes/pagos/inventario (PR #122–#127) | Código integrado; paquetes EDT y aceptación por cotejar | Pendiente |
| Dashboard/endpoints BI (HU-09) | No presentes en el código versionado del corte | No computar como terminado |
| Pipeline predictivo IA (HU-10) | No presente en el código versionado del corte | No computar como terminado |
| Instrumentos de campo | Diseño de fichas presente; validación/aplicación sin fuente primaria adjunta | Pendiente |
| **Cumplimiento Promedio Global del Período** | Denominador EDT semanal por validar con línea base | **Pendiente de calcular** |

#### Tabla 4: Detalle de Validación del Tiempo

| ACTIVIDAD | DURACIÓN ESTIMADA | DURACIÓN REAL | % CUMPLIMIENTO |
|:---|:---:|:---:|:---:|
| Cambios de órdenes/pagos/inventario (PR #122–#127) | Por reconstruir | Merge registrado el 09–10/10 | Pendiente de horas/trabajo real |
| CI automático (run #38028670036) | No aplica | Finalizó 10/10 a las 00:47 | Automatización; no es hora-hombre |
| Sábado 10/10 | Clase a las 07:00 | Sin tareas ni horas de desarrollo | Excluido del cómputo laboral |
| **Cumplimiento promedio del Período** | Línea base por confirmar | Registro horario por confirmar | **Pendiente de calcular** |

#### Tabla 5: Detalle de Validación de Costos y Memoria de Amortización

| RUBRO DE COSTO DEL PERÍODO EVALUADO | VALOR PLANIFICADO (PV) | COSTO REAL (AC) |
|:---|:---:|:---:|
| Horas de ingeniería (lunes–viernes) | Pendiente | Pendiente |
| Infraestructura/hosting y comprobantes asignados al corte | Pendiente | Pendiente |
| Depreciación/amortización (base, vida útil, porcentaje de uso) | Pendiente | Pendiente |
| **TOTAL (PV/AC)** | **Pendiente de cotejar con presupuesto** | **Pendiente de cotejar con registros reales** |

> No calcular CPI con el costo base transcrito hasta que el equipo identifique la línea base aprobada: el Markdown de costeo SEM05 presenta diferencias entre sus totales y el total general declarado; el XLSX SEM05 tiene una estructura de ocho fases/códigos que no coincide con la EDT vigente.

#### Tabla 5-B: Trazabilidad Integral de Actividades de la EDT Canónica
*(Cumplimiento de la observación docente de Clase 6: registrar todas las actividades de la EDT desde el inicio del proyecto hasta el cierre)*

> Reconstruida desde `docs/trabajo/SEM02/03_EDT.md` y `04_CRONOGRAMA.md`: incluye las 43 actividades de nivel 3 que aparecen en la EDT. La fecha planeada es la culminación programada del entregable asociado; la fecha real y el estado permanecen sin verificar hasta cotejarlos con evidencia primaria. El costeo SEM05 usa además la cifra de 31 paquetes de trabajo de nivel 4; esa unidad no equivale a estas 43 actividades y sus códigos/versiones deben conciliarse antes de reportar un total único.

| CÓDIGO EDT | ACTIVIDAD DE LA EDT | ENTREGABLE ASOCIADO | FECHA PLANIF. | FECHA REAL ENTREGA | ESTADO REAL (% CUMP.) |
|:---:|:---|:---|:---:|:---:|:---:|
| 1.1.1 | Elaboración del Acta de Constitución | Acta de Constitución Aprobada | 22/08/2026 | No verificada | Pendiente de cotejo |
| 1.1.2 | Elaboración del Caso de Negocio | Business Case Validado | 28/08/2026 | No verificada | Pendiente de cotejo |
| 1.2.1 | Levantamiento de Requerimientos de Software | Documento SRS IEEE 830 | 28/08/2026 | No verificada | Pendiente de cotejo |
| 1.3.1 | Elaboración de la Matriz de Consistencia | Matriz de Consistencia Metodológica | 02/09/2026 | No verificada | Pendiente de cotejo |
| 1.3.2 | Formulación de la Estructura de Análisis | Informe de Estructura de Análisis | 04/09/2026 | No verificada | Pendiente de cotejo |
| 1.4.1 | Construcción de la Estructura de Desglose | Grafo y Matriz EDT | 08/09/2026 | No verificada | Pendiente de cotejo |
| 1.4.2 | Programación del Cronograma Gantt | Cronograma Maestro del Proyecto | 09/09/2026 | No verificada | Pendiente de cotejo |
| 1.4.3 | Elaboración del Plan de Desarrollo de Software | Documento Plan de Desarrollo de Software | 10/09/2026 | No verificada | Pendiente de cotejo |
| 1.4.4 | Análisis y Gestión de Riesgos | Matriz de Riesgos del Proyecto | 10/09/2026 | No verificada | Pendiente de cotejo |
| 1.4.5 | Definición de Responsabilidades del Equipo | Matriz RACI MultiRol | 10/09/2026 | No verificada | Pendiente de cotejo |
| 1.4.6 | Establecimiento del Protocolo de Comunicaciones | Matriz de Comunicaciones Oficial | 11/09/2026 | No verificada | Pendiente de cotejo |
| 2.1.1 | Modelado Entidad Relación Físico | Script DDL PostgreSQL | 17/09/2026 | No verificada | Pendiente de cotejo |
| 2.1.2 | Configuración del Contenedor de Base de Datos | Contenedor Docker PostgreSQL | 18/09/2026 | No verificada | Pendiente de cotejo |
| 2.2.1 | Estructuración del Proyecto FastAPI | Repositorio Backend FastAPI | 22/09/2026 | No verificada | Pendiente de cotejo |
| 2.2.2 | Diseño de Contratos de Servicios RESTful | Especificación OpenAPI Swagger | 24/09/2026 | No verificada | Pendiente de cotejo |
| 2.3.1 | Maquetación de Interfaces en Angular | Componentes UI Angular | 23/09/2026 | No verificada | Pendiente de cotejo |
| 2.3.2 | Integración del Talonario Virtual | Vista de Emisión de Órdenes | 25/09/2026 | No verificada | Pendiente de cotejo |
| 3.1.1 | Desarrollo del Directorio de Clientes | Módulo de Clientes Operativo | 01/10/2026 | No verificada | Pendiente de cotejo |
| 3.1.2 | Desarrollo del Catálogo de Productos Gráficos | Catálogo de Productos y Fórmulas | 02/10/2026 | No verificada | Pendiente de cotejo |
| 3.2.1 | Implementación de Emisión Correlativa | Servicio de Emisión de Órdenes | 08/10/2026 | No verificada | Pendiente de cotejo |
| 3.2.2 | Formato de Comprobante Interno de Imprenta | Plantilla de Impresión de Pedidos | 09/10/2026 | No verificada | Pendiente de cotejo |
| 3.3.1 | Construcción del Candado Digital de Cobro | Mecanismo de Bloqueo de Entrega | 08/10/2026 | No verificada | Pendiente de cotejo |
| 3.3.2 | Implementación del Arqueo Diario Segregado | Reporte de Cierre de Caja Diario | 09/10/2026 | No verificada | Pendiente de cotejo |
| 3.4.1 | Programación de Deducción Automática por Receta | Servicio de Reserva de Insumos | 12/10/2026 | No verificada | Pendiente de cotejo |
| 3.4.2 | Registro de Mermas de Producción en Taller | Formulario de Ajuste de Taller | 14/10/2026 | No verificada | Pendiente de cotejo |
| 3.5.1 | Implementación del Tablero de Estados de Trabajo | Tablero Visual de Producción | 16/10/2026 | No verificada | Pendiente de cotejo |
| 4.1.1 | Construcción de Endpoints Agregados de Ventas | Endpoints Analíticos FastAPI | 23/10/2026 | No verificada | Pendiente de cotejo |
| 4.1.2 | Desarrollo de Dashboards Gerenciales en Angular | Tableros Ejecutivos de BI | 27/10/2026 | No verificada | Pendiente de cotejo |
| 4.1.3 | Generación de Exportación Tabular a Excel | Reportes Nativos en Excel 2021 | 28/10/2026 | No verificada | Pendiente de cotejo |
| 4.2.1 | Estructuración del Dataset Histórico de Boletas | Dataset Estructurado de Producción | 29/10/2026 | No verificada | Pendiente de cotejo |
| 4.2.2 | Entrenamiento del Modelo Predictivo de Demanda | Modelo Predictivo Entrenado | 03/11/2026 | No verificada | Pendiente de cotejo |
| 4.2.3 | Despliegue de Inferencia de Demanda en API | Servicio Predictivo de Reabastecimiento | 06/11/2026 | No verificada | Pendiente de cotejo |
| 5.1.1 | Ejecución de Pruebas de Integración y Sistema | Informe de Pruebas del Sistema | 13/11/2026 | No verificada | Pendiente de cotejo |
| 5.1.2 | Evaluación de Métricas de Calidad ISO 25010 | Informe de Métricas de Calidad | 14/11/2026 | No verificada | Pendiente de cotejo |
| 5.2.1 | Configuración del Servidor VPS Propio en Linux | Servidor VPS de Producción Activo | 18/11/2026 | No verificada | Pendiente de cotejo |
| 5.2.2 | Automatización del Pipeline CI CD en GitHub Actions | Pipeline CI CD Desplegado | 19/11/2026 | No verificada | Pendiente de cotejo |
| 5.3.1 | Elaboración de Manuales de Usuario y Despliegue | Manuales de Usuario del Sistema | 23/11/2026 | No verificada | Pendiente de cotejo |
| 5.3.2 | Ejecución de Jornadas de Capacitación in Situ | Acta de Capacitación del Personal | 25/11/2026 | No verificada | Pendiente de cotejo |
| 5.4.1 | Recolección de Datos Pretest sobre Papel | Base de Datos Pretest Documentada | 20/11/2026 | No verificada | Pendiente de cotejo |
| 5.4.2 | Recolección de Datos Postest en Sistema Web | Base de Datos Postest Documentada | 26/11/2026 | No verificada | Pendiente de cotejo |
| 5.4.3 | Análisis Estadístico Comparativo Pretest Postest | Informe Experimental de Resultados | 27/11/2026 | No verificada | Pendiente de cotejo |
| 5.5.1 | Ejecución de Charla de Responsabilidad Social | Informe de Responsabilidad Social UPN | 01/12/2026 | No verificada | Pendiente de cotejo |
| 5.5.2 | Redacción del Artículo Científico de Investigación | Paper Científico Final de Tesis | 04/12/2026 | No verificada | Pendiente de cotejo |
| 5.5.3 | Consolidación del Portafolio y Entrega Final | Informe Final del Proyecto Capstone | 05/12/2026 | No verificada | Pendiente de cotejo |

---

### ANEXO 2: Criterios y Leyendas de Semaforización Oficial

#### Tabla 6: Leyenda del Alcance

| Código de color | Criterio de Evaluación |
|:---:|:---|
| **Verde** | Cumplimiento promedio ponderado $\ge 75.0\%$ en las actividades del período evaluado. |
| **Amarillo** | Cumplimiento promedio ponderado entre $50.0\%$ y $74.9\%$. |
| **Rojo** | Cumplimiento promedio ponderado $< 50.0\%$. |

#### Tabla 7: Leyenda del Tiempo

| Código de color | Criterio de Evaluación |
|:---:|:---|
| **Verde** | Ejecución de días hombre en plazo $\ge 75.0\%$ frente a la programación ($SPI \ge 0.95$). |
| **Amarillo** | Ejecución de días hombre en plazo entre $50.0\%$ y $74.9\%$ ($0.85 \le SPI < 0.95$). |
| **Rojo** | Ejecución de días hombre en plazo $< 50.0\%$ ($SPI < 0.85$). |

#### Tabla 8: Leyenda del Costo

| Código de color | Criterio de Evaluación |
|:---:|:---|
| **Verde** | Costo real incurrido $\le 100.0\%$ del presupuesto planificado ($CPI \ge 1.00$). |
| **Amarillo** | Costo real incurrido excede entre $1.0\%$ y $15.0\%$ lo presupuestado ($0.85 \le CPI < 1.00$). |
| **Rojo** | Costo real incurrido excede en más del $15.0\%$ lo presupuestado ($CPI < 0.85$). |

---

### ANEXO 3: Evidencia Técnica Verificable del Corte SEM07

1. **Cambios de código:** PR #122–#127: búsqueda/teléfono de órdenes, filtro por local y pendientes del día, adelantos repartidos, Yape por destinatario y consumo automático de rollos asociados a órdenes.
2. **CI:** GitHub Actions run #38028670036, SHA `f812ece`, del 10/10/2026: 293 pruebas backend y 469 frontend aprobadas; build y validaciones CI correctas. El job de despliegue al VPS fue omitido.
3. **Alcance fuera del corte:** no adjuntar como evidencia SEM07 capturas de Dashboard BI, rutas analíticas de mermas ni inferencias de IA; no se encontraron esas rutas/componentes en el código versionado de la fecha.
4. **Aceptación:** la copia del AAE-03 en el repositorio conserva líneas de firma vacías. Se requiere el ejemplar firmado antes de afirmar conformidad formal del cliente.
5. **Instrumentos/métricas:** conservar las fichas como diseños de captura. Para informar V de Aiken, Alfa de Cronbach, Pretest/Postest, tiempos o mermas, adjuntar matriz de jueces y datos fuente anonimizados.
