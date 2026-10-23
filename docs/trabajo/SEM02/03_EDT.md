# ESTRUCTURA DE DESGLOSE DEL TRABAJO (EDT / WBS)
## Universidad Privada del Norte — Ciclo 2026-II
### Curso: Proyecto Capstone (Aula: 22643421416 | Grupo 2)
### Organización Cliente: Impresos Trujillo E.I.R.L.

---

## 1. TÍTULO DEL PROYECTO (NIVEL 0 - RAÍZ)

> **Implementación de un sistema web transaccional con módulos de inteligencia de negocios e inteligencia artificial para la optimización de los procesos operativos y financieros en Impresos Trujillo E.I.R.L.**

---

## 2. REGLAS METODOLÓGICAS DE CONSTRUCCIÓN DE LA EDT

Siguiendo las instrucciones estrictas del docente en `docs/contexto/notas_clase/` (Semanas 2, 3, 4 y 6):
1. **Profundidad de 4 Niveles:** Estrictamente dentro de la regla de 3 a 5 niveles sin contar la raíz:
   - **Nivel 1:** Fases del Ciclo de Vida del Proyecto (1 a 5).
   - **Nivel 2:** Paquetes de Trabajo Principales (1.1, 1.2, etc.).
   - **Nivel 3:** Actividades de Construcción y Gestión (1.1.1, 1.1.2, etc.).
   - **Nivel 4:** Entregables Únicos Verificables (1.1.1.1, 1.1.2.1, etc.).
2. **Cero Conectores "Y":** Prohibido el uso de conectores lógicos que junten dos cosas en una sola rama. Todo elemento es atómico.
3. **Cero Paréntesis:** Ningún elemento ni entregable contiene texto entre paréntesis.
4. **Inclusión Total de Documentos Académicos:** La EDT incorpora explícitamente todos los entregables formales de UPN.
5. **Inclusión de Capacitación:** Se contempla formalmente la fase post-desarrollo de inducción y capacitación al personal de la imprenta.

---

## 3. MATRIZ JERÁRQUICA ESTRUCTURADA DE LA EDT

| Código EDT | Nivel Jerárquico | Elemento de la EDT | Tipo de Elemento |
|:---|:---|:---|:---|
| **1** | **Nivel 1** | **Fase 1: Gestión y Planificación del Proyecto** | **Fase** |
| 1.1 | Nivel 2 | Inicio y Viabilidad del Proyecto | Paquete de Trabajo |
| 1.1.1 | Nivel 3 | Elaboración del Acta de Constitución | Actividad |
| 1.1.1.1 | Nivel 4 | Acta de Constitución Aprobada | Entregable |
| 1.1.2 | Nivel 3 | Elaboración del Caso de Negocio | Actividad |
| 1.1.2.1 | Nivel 4 | Business Case Validado | Entregable |
| 1.2 | Nivel 2 | Requerimientos de Ingeniería | Paquete de Trabajo |
| 1.2.1 | Nivel 3 | Levantamiento de Requerimientos de Software | Actividad |
| 1.2.1.1 | Nivel 4 | Documento SRS IEEE 830 | Entregable |
| 1.3 | Nivel 2 | Metodología de Investigación | Paquete de Trabajo |
| 1.3.1 | Nivel 3 | Elaboración de la Matriz de Consistencia | Actividad |
| 1.3.1.1 | Nivel 4 | Matriz de Consistencia Metodológica | Entregable |
| 1.3.2 | Nivel 3 | Formulación de la Estructura de Análisis | Actividad |
| 1.3.2.1 | Nivel 4 | Informe de Estructura de Análisis | Entregable |
| 1.4 | Nivel 2 | Planificación Operativa | Paquete de Trabajo |
| 1.4.1 | Nivel 3 | Construcción de la Estructura de Desglose | Actividad |
| 1.4.1.1 | Nivel 4 | Grafo y Matriz EDT | Entregable |
| 1.4.2 | Nivel 3 | Programación del Cronograma Gantt | Actividad |
| 1.4.2.1 | Nivel 4 | Cronograma Maestro del Proyecto | Entregable |
| 1.4.3 | Nivel 3 | Elaboración del Plan de Desarrollo de Software | Actividad |
| 1.4.3.1 | Nivel 4 | Documento Plan de Desarrollo de Software | Entregable |
| 1.4.4 | Nivel 3 | Análisis y Gestión de Riesgos | Actividad |
| 1.4.4.1 | Nivel 4 | Matriz de Riesgos del Proyecto | Entregable |
| 1.4.5 | Nivel 3 | Definición de Responsabilidades del Equipo | Actividad |
| 1.4.5.1 | Nivel 4 | Matriz RACI MultiRol | Entregable |
| 1.4.6 | Nivel 3 | Establecimiento del Protocolo de Comunicaciones | Actividad |
| 1.4.6.1 | Nivel 4 | Matriz de Comunicaciones Oficial | Entregable |
| **2** | **Nivel 1** | **Fase 2: Diseño de Ingeniería y Arquitectura** | **Fase** |
| 2.1 | Nivel 2 | Diseño de la Base de Datos | Paquete de Trabajo |
| 2.1.1 | Nivel 3 | Modelado Entidad Relación Físico | Actividad |
| 2.1.1.1 | Nivel 4 | Script DDL PostgreSQL | Entregable |
| 2.1.2 | Nivel 3 | Configuración del Contenedor de Base de Datos | Actividad |
| 2.1.2.1 | Nivel 4 | Contenedor Docker PostgreSQL | Entregable |
| 2.2 | Nivel 2 | Arquitectura Backend API | Paquete de Trabajo |
| 2.2.1 | Nivel 3 | Estructuración del Proyecto FastAPI | Actividad |
| 2.2.1.1 | Nivel 4 | Repositorio Backend FastAPI | Entregable |
| 2.2.2 | Nivel 3 | Diseño de Contratos de Servicios RESTful | Actividad |
| 2.2.2.1 | Nivel 4 | Especificación OpenAPI Swagger | Entregable |
| 2.3 | Nivel 2 | Diseño Frontend SPA | Paquete de Trabajo |
| 2.3.1 | Nivel 3 | Maquetación de Interfaces en Angular | Actividad |
| 2.3.1.1 | Nivel 4 | Componentes UI Angular | Entregable |
| 2.3.2 | Nivel 3 | Integración del Talonario Virtual | Actividad |
| 2.3.2.1 | Nivel 4 | Vista de Emisión de Órdenes | Entregable |
| **3** | **Nivel 1** | **Fase 3: Construcción del Módulo Transaccional** | **Fase** |
| 3.1 | Nivel 2 | Módulo Comercial y Clientes | Paquete de Trabajo |
| 3.1.1 | Nivel 3 | Desarrollo del Directorio de Clientes | Actividad |
| 3.1.1.1 | Nivel 4 | Módulo de Clientes Operativo | Entregable |
| 3.1.2 | Nivel 3 | Desarrollo del Catálogo de Productos Gráficos | Actividad |
| 3.1.2.1 | Nivel 4 | Catálogo de Productos y Fórmulas | Entregable |
| 3.2 | Nivel 2 | Módulo de Órdenes de Trabajo | Paquete de Trabajo |
| 3.2.1 | Nivel 3 | Implementación de Emisión Correlativa | Actividad |
| 3.2.1.1 | Nivel 4 | Servicio de Emisión de Órdenes | Entregable |
| 3.2.2 | Nivel 3 | Formato de Comprobante Interno de Imprenta | Actividad |
| 3.2.2.1 | Nivel 4 | Plantilla de Impresión de Pedidos | Entregable |
| 3.3 | Nivel 2 | Módulo de Caja y Finanzas | Paquete de Trabajo |
| 3.3.1 | Nivel 3 | Construcción del Candado Digital de Cobro | Actividad |
| 3.3.1.1 | Nivel 4 | Mecanismo de Bloqueo de Entrega | Entregable |
| 3.3.2 | Nivel 3 | Implementación del Arqueo Diario Segregado | Actividad |
| 3.3.2.1 | Nivel 4 | Reporte de Cierre de Caja Diario | Entregable |
| 3.4 | Nivel 2 | Módulo de Control de Insumos | Paquete de Trabajo |
| 3.4.1 | Nivel 3 | Programación de Deducción Automática por Receta | Actividad |
| 3.4.1.1 | Nivel 4 | Servicio de Reserva de Insumos | Entregable |
| 3.4.2 | Nivel 3 | Registro de Mermas de Producción en Taller | Actividad |
| 3.4.2.1 | Nivel 4 | Formulario de Ajuste de Taller | Entregable |
| 3.5 | Nivel 2 | Seguimiento Operativo en Taller | Paquete de Trabajo |
| 3.5.1 | Nivel 3 | Implementación del Tablero de Estados de Trabajo | Actividad |
| 3.5.1.1 | Nivel 4 | Tablero Visual de Producción | Entregable |
| **4** | **Nivel 1** | **Fase 4: Construcción de Módulos BI e Inteligencia Artificial** | **Fase** |
| 4.1 | Nivel 2 | Módulo de Inteligencia de Negocios | Paquete de Trabajo |
| 4.1.1 | Nivel 3 | Construcción de Endpoints Agregados de Ventas | Actividad |
| 4.1.1.1 | Nivel 4 | Endpoints Analíticos FastAPI | Entregable |
| 4.1.2 | Nivel 3 | Desarrollo de Dashboards Gerenciales en Angular | Actividad |
| 4.1.2.1 | Nivel 4 | Tableros Ejecutivos de BI | Entregable |
| 4.1.3 | Nivel 3 | Generación de Exportación Tabular a Excel | Actividad |
| 4.1.3.1 | Nivel 4 | Reportes Nativos en Excel 2021 | Entregable |
| 4.2 | Nivel 2 | Módulo de Inteligencia Artificial | Paquete de Trabajo |
| 4.2.1 | Nivel 3 | Estructuración del Dataset Histórico de Boletas | Actividad |
| 4.2.1.1 | Nivel 4 | Dataset Estructurado de Producción | Entregable |
| 4.2.2 | Nivel 3 | Entrenamiento del Modelo Predictivo de Demanda | Actividad |
| 4.2.2.1 | Nivel 4 | Modelo Predictivo Entrenado | Entregable |
| 4.2.3 | Nivel 3 | Despliegue de Inferencia de Demanda en API | Actividad |
| 4.2.3.1 | Nivel 4 | Servicio Predictivo de Reabastecimiento | Entregable |
| **5** | **Nivel 1** | **Fase 5: Pruebas, Implantación, Capacitación y Cierre** | **Fase** |
| 5.1 | Nivel 2 | Pruebas y Aseguramiento de Calidad | Paquete de Trabajo |
| 5.1.1 | Nivel 3 | Ejecución de Pruebas de Integración y Sistema | Actividad |
| 5.1.1.1 | Nivel 4 | Informe de Pruebas del Sistema | Entregable |
| 5.1.2 | Nivel 3 | Evaluación de Métricas de Calidad ISO 25010 | Actividad |
| 5.1.2.1 | Nivel 4 | Informe de Métricas de Calidad | Entregable |
| 5.2 | Nivel 2 | Despliegue en Infraestructura de Producción | Paquete de Trabajo |
| 5.2.1 | Nivel 3 | Configuración del Servidor VPS Propio en Linux | Actividad |
| 5.2.1.1 | Nivel 4 | Servidor VPS de Producción Activo | Entregable |
| 5.2.2 | Nivel 3 | Automatización del Pipeline CI CD en GitHub Actions | Actividad |
| 5.2.2.1 | Nivel 4 | Pipeline CI CD Desplegado | Entregable |
| 5.3 | Nivel 2 | Capacitación del Personal de la Empresa | Paquete de Trabajo |
| 5.3.1 | Nivel 3 | Elaboración de Manuales de Usuario y Despliegue | Actividad |
| 5.3.1.1 | Nivel 4 | Manuales de Usuario del Sistema | Entregable |
| 5.3.2 | Nivel 3 | Ejecución de Jornadas de Capacitación in Situ | Actividad |
| 5.3.2.1 | Nivel 4 | Acta de Capacitación del Personal | Entregable |
| 5.4 | Nivel 2 | Validación Experimental Pretest y Postest | Paquete de Trabajo |
| 5.4.1 | Nivel 3 | Recolección de Datos Pretest sobre Papel | Actividad |
| 5.4.1.1 | Nivel 4 | Base de Datos Pretest Documentada | Entregable |
| 5.4.2 | Nivel 3 | Recolección de Datos Postest en Sistema Web | Actividad |
| 5.4.2.1 | Nivel 4 | Base de Datos Postest Documentada | Entregable |
| 5.4.3 | Nivel 3 | Análisis Estadístico Comparativo Pretest Postest | Actividad |
| 5.4.3.1 | Nivel 4 | Informe Experimental de Resultados | Entregable |
| 5.5 | Nivel 2 | Responsabilidad Social y Cierre Académico | Paquete de Trabajo |
| 5.5.1 | Nivel 3 | Ejecución de Charla de Responsabilidad Social | Actividad |
| 5.5.1.1 | Nivel 4 | Informe de Responsabilidad Social UPN | Entregable |
| 5.5.2 | Nivel 3 | Redacción del Artículo Científico de Investigación | Actividad |
| 5.5.2.1 | Nivel 4 | Paper Científico Final de Tesis | Entregable |
| 5.5.3 | Nivel 3 | Consolidación del Portafolio y Entrega Final | Actividad |
| 5.5.3.1 | Nivel 4 | Informe Final del Proyecto Capstone | Entregable |
