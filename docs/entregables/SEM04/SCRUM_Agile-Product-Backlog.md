AGILE PRODUCT BACKLOG
Implementación de un sistema web transaccional con módulos de inteligencia de negocios e inteligencia artificial para la optimización de los procesos operativos en la empresa Impresos Trujillo E.I.R.L.
Empresa Beneficiaria: Impresos Trujillo E.I.R.L.
Dirección: Av. España 251, Trujillo, La Libertad, Perú
RUC: 20481234567 | Sector: Industria Gráfica y Publicitaria
Fecha de Emisión: Septiembre de 2026 | Versión: 1.0

[TABLE]
| PRODUCT BACKLOG — SISTEMA WEB TRANSACCIONAL IMPRESOS TRUJILLO E.I.R.L. |
| ID Tarea | Historia de Usuario (User Story) | Estimación (SP) | Prioridad (MoSCoW) |
| HU-01 | Como Administrador/Operador del sistema, quiero autenticarme mediante credenciales seguras y control de acceso basado en roles (RBAC) para acceder exclusivamente a los módulos autorizados según mis funciones de trabajo en la empresa. | 3 SP | Must Have (1) |
| HU-02 | Como Vendedor/Administrador, quiero parametrizar el catálogo de productos con recetas técnicas de consumo por metro cuadrado (vinilo, lona, tinta y ojalillos) para calcular costos y descontar inventario con exactitud matemática. | 5 SP | Must Have (2) |
| HU-03 | Como Vendedor de mostrador, quiero registrar cotizaciones dinámicas ingresando tipo de trabajo, dimensiones y acabados para emitir proformas formales a los clientes en un tiempo menor a 5 minutos. | 8 SP | Must Have (3) |
| HU-04 | Como Vendedor, quiero transformar proformas en Órdenes de Trabajo formales con correlativo automático, anticipo mínimo del 50% y fecha pactada para formalizar el contrato comercial y reservar insumos en bodega. | 8 SP | Must Have (4) |
| HU-05 | Como Operario de Taller, quiero gestionar las órdenes de trabajo por etapas de manufactura para reportar el progreso operativo en tiempo real. | 5 SP | Must Have (5) |
| HU-06 | Como Operario de Impresión, quiero registrar las mermas reales al finalizar la manufactura para realizar el ajuste automático de inventario. | 5 SP | Should Have (6) |
| HU-07 | Como Cajero/Despachador, quiero verificar pagos multicanal (efectivo, Yape, transferencias) mediante un candado digital de entrega que impida el retiro físico de pedidos con saldo pendiente de cobro. | 5 SP | Must Have (7) |
| HU-08 | Como Administrador/Cajero, quiero ejecutar el arqueo diario de caja segregando los ingresos de Imprenta, Gigantografías para conciliar los cobros en menos de 10 minutos con exactitud superior al 90%. | 5 SP | Must Have (8) |
| HU-09 | Como Gerente General, quiero visualizar un dashboard gerencial interactivo con indicadores clave de ventas, tiempos de atención, mermas y márgenes operativos para tomar decisiones basadas en datos. | 8 SP | Should Have (9) |
| HU-10 | Como Gerente de Compras, quiero consultar un modelo predictivo de demanda con precisión mínima del 70% para proyectar el consumo mensual de insumos críticos y mejorar la planificación de insumos. | 13 SP | Could Have (10) |
[/TABLE]

1.   Resumen del Enfoque Ágil y Metodología Scrum
El Product Backlog reúne las historias de usuario priorizadas para el desarrollo del sistema web. El proyecto se desarrolla con Scrum, priorizando la entrega progresiva de funcionalidades para optimizar los procesos operativos de la empresa.
•   Estimación en Story Points (Puntos de Historia): Se utiliza la secuencia Fibonacci adaptada (1, 2, 3, 5, 8, 13) como medida relativa de esfuerzo, complejidad técnica y riesgo de desarrollo, acordada por el equipo de desarrollo (Gerardo Plasencia, Jose Estibb Anhuaman y Diego Rodriguez).
•   Priorización MoSCoW: Las historias se clasifican en Must Have (requisitos indispensables para la operación básica de la imprenta, que deben estar culminados en los Sprints 1 y 2), Should Have (requisitos de alto valor operativo para el control de mermas y visualización gerencial en el Sprint 3), y Could Have (módulo avanzado de proyección predictiva de insumos mediante IA).
•   Velocidad y Capacidad Estimada: La suma total del Product Backlog es de 65 Story Points (SP), distribuidos en 3 Sprints de desarrollo de 2 semanas cada uno, asegurando que el 100% de la funcionalidad se encuentre operativa e implantada en la semana 11 del ciclo académico para la ejecución de la fase experimental de medición.
2.   Especificación de Historias de Usuario, Criterios de Aceptación y Gráficas de Interfaces (UI/UX)
A continuación, se detalla la formulación formal de las Historias de Usuario, acompañada de sus Criterios de Aceptación bajo el estándar Gherkin (Dado que / Cuando / Entonces), su valor de negocio para la empresa y las representaciones visuales (capturas de pantalla de la interfaz web en Angular 21) diseñadas para la arquitectura web en Angular 21, conforme a las directivas del curso:
2.1   Módulo de Autenticación y Control de Acceso por Roles (HU-01)
Historia de Usuario (HU-01): Como Administrador u Operador del sistema, quiero autenticarme mediante credenciales institucionales y control de acceso basado en roles (RBAC) para acceder de forma segura únicamente a las opciones autorizadas para mi función de trabajo en la imprenta.
•   Criterio de Aceptación 1 (Login Exitoso): Dado que el usuario ingresa su correo institucional y contraseña válidos, cuando presiona el botón «Ingresar a la Plataforma», entonces el sistema emite un token JWT con vigencia de 8 horas y redirige al panel principal correspondiente a su rol (Administración, Ventas o Taller).
•   Criterio de Aceptación 2 (Seguridad RBAC): Dado que un operario de taller inicia sesión, cuando intenta acceder manualmente a las rutas de facturación, caja o configuración de costos, entonces el sistema bloquea el acceso mediante guards de Angular y muestra un mensaje de acceso restringido.
•   Criterio de Aceptación 3 (Auditoría): Dado que un usuario inicia o cierra sesión, el sistema registra la marca de tiempo (timestamp), dirección IP y nombre del usuario en el log de auditoría.
Figura 1. Captura de Interfaz: Inicio de Sesión y Control de Acceso por Roles (RBAC)
2.2   Módulo de Ventas, Cotizador y Talonario Comercial Digital (HU-02, HU-03, HU-04)
Historias de Usuario (HU-02, HU-03, HU-04): Como Vendedor de mostrador, quiero disponer de un cotizador automático y un talonario digital que genere contratos y órdenes de trabajo con correlativo numérico único, cálculo exacto de metros cuadrados, anticipo mínimo y reserva automática de insumos en bodega para formalizar el pedido en menos de 5 minutos.
•   Criterio de Aceptación 1 (Cálculo Automático de Superficie e Insumos): Dado que el vendedor ingresa el tipo de soporte (Lona Frontlit 13 oz, Vinil Adhesivo, etc.) y las dimensiones en metros (ancho x alto), el sistema calcula el área neta en m², suma la merma técnica configurada (10% por defecto) y calcula la cantidad requerida de tinta solvente y ojalillos perimetrales.
•   Criterio de Aceptación 2 (Correlativo y Anticipo Obligatorio): Dado que se emite una nueva Orden de Trabajo, el sistema genera el código correlativo secuencial no reutilizable (ej. OT-2026-00482), calcula el precio total con IGV y exige el ingreso de un anticipo no menor al 50% del total antes de confirmar la emisión.
•   Criterio de Aceptación 3 (Reserva en Bodega): Dado que se confirma la Orden de Trabajo, el sistema descuenta del stock disponible y reserva en estado «comprometido» los metros cuadrados de lona/vinil correspondientes en la base de datos PostgreSQL.
Figura 2. Captura de Interfaz: Talonario Comercial Digital, Cotizador y Reserva de Stock
2.3   Módulo de Producción, Taller y Control de Mermas (HU-05, HU-06)
Historias de Usuario (HU-05, HU-06): Como Operario de Taller, quiero gestionar el flujo de las órdenes de trabajo por 4 etapas de manufactura (Diseño, Impresión, Acabados, Listo) y reportar las mermas reales post-impresión para mantener la visibilidad del estado de cada pedido y sincronizar los inventarios.
•   Criterio de Aceptación 1 (Transición de Estados de Taller): Dado que un diseñador concluye la diagramación y el cliente aprueba el arte digital, el operario actualiza el estado de la OT a «En Impresión», sincronizando el registro inmediatamente en la base de datos y notificando al área de plotter.
•   Criterio de Aceptación 2 (Registro Cuantitativo de Mermas): Al finalizar la tirada en el plotter de gran formato, el operario debe registrar los metros cuadrados consumidos reales vs planificados y clasificar cualquier merma excedente (por calibración de cabezales, atasco o defecto de sustrato).
•   Criterio de Aceptación 3 (Etiquetado y Ubicación Física): Al pasar a la etapa «Terminado / Listo», el sistema asigna el estante físico de despacho donde se almacena el producto terminado para facilitar su entrega inmediata al cliente.
Figura 3. Captura de Interfaz: Módulo de Producción y Control de Taller
2.4   Módulo de Cobranzas, Candado Digital de Seguridad y Arqueo de Caja (HU-07, HU-08)
Historias de Usuario (HU-07, HU-08): Como Cajero y Despachador, quiero contar con un candado digital de seguridad que bloquee físicamente la entrega de productos terminados si la orden mantiene saldo pendiente, y liquidar diariamente la caja con segregación de unidades de negocio para erradicar pérdidas financieras.
•   Criterio de Aceptación 1 (Candado Digital de Entrega Inviolable): Dado que el cliente solicita el retiro físico de su pedido en mostrador, el sistema verifica el saldo pendiente. Si el saldo es mayor a S/ 0.00, el botón «Entregar Producto» se muestra completamente inhabilitado y bloqueado con una alerta roja de advertencia.
•   Criterio de Aceptación 2 (Desbloqueo tras Cancelación 100%): Dado que el cajero registra la cobranza del saldo pendiente en efectivo, billetera digital (Yape) o transferencia con número de operación verificado, el saldo se actualiza a S/ 0.00 y el botón de despacho físico se habilita automáticamente.
•   Criterio de Aceptación 3 (Arqueo Diario Segregado): Al cierre de la jornada comercial, el sistema genera el reporte de cuadre de caja discriminando con exactitud los ingresos correspondientes a la unidad de Imprenta frente a Gigantografías, reduciendo el tiempo de conciliación de 2 horas a menos de 10 minutos.
Figura 4. Captura de Interfaz: Módulo de Cobranzas, Arqueo de Caja Dual y Candado Digital
2.5   Módulo de Inteligencia de Negocios (BI) y Modelo Predictivo IA (HU-09, HU-10)
Historias de Usuario (HU-09, HU-10): Como Gerente General y Gerente de Compras, quiero visualizar un panel ejecutivo de KPIs operativos en tiempo real y consultar un modelo analítico de proyección de consumo de insumos para tomar decisiones basadas en datos y anticipar las compras de materias primas.
•   Criterio de Aceptación 1 (Dashboard Operativo BI): El sistema consolida en tiempo real los indicadores métricos del negocio: volumen de ventas del mes, tiempo medio de cotización, porcentaje de mermas y monto de pérdidas por cobros impagos (meta S/ 0.00).
•   Criterio de Aceptación 2 (Segregación de Ingresos por Línea de Producto): El panel desglosa el porcentaje de facturación entre lonas, vinilos, roll-ups y trabajos offset/comprobantes de pago.
•   Criterio de Aceptación 3 (Pronóstico Predictivo de Insumos Críticos): El algoritmo de analítica avanzada procesa el histórico de consumos y proyecta la demanda de rollos de lona y vinil para las próximas 4 semanas con un nivel de exactitud mínimo del 70%, sugiriendo al administrador la fecha óptima de emisión de la orden de compra.
Figura 5. Captura de Interfaz: Dashboard Gerencial BI y Análisis Financiero Operativo
3.   Definición de Terminado Transversal (Definition of Done — DoD)
Para que una Historia de Usuario se considere formalmente «Terminada» (Done) al cierre de cada Sprint y pueda presentarse en la sesión de Sprint Review con el Product Owner y el docente, debe satisfacer el 100% de los siguientes criterios técnicos y de calidad:
•  Control de Versiones y Ramas: El código fuente está commiteado en la rama de funcionalidad correspondiente (feature/*) y mergeado a la rama develop mediante Pull Request revisado y aprobado por un par.
•  Pruebas Unitarias Automatizadas: Los servicios y modelos backend cuentan con pruebas unitarias en pytest con una cobertura de código superior al 80%, y los componentes de Angular pasan pruebas con Jasmine/Karma sin fallos.
•  Compatibilidad Web y Rendimiento: La interfaz responde adecuadamente en resoluciones de 1366x768 y 1920x1080 px en navegadores Google Chrome y Microsoft Edge, sin presentar desbordamientos visuales ni errores de consola.
•  Documentación de API y Contratos: Todos los endpoints de FastAPI asociados a la historia están documentados con tipado estricto Pydantic y accesibles en la documentación interactiva Swagger UI.
•  Seguridad y Control de Vulnerabilidades: Se verifica la inexistencia de vulnerabilidades críticas en dependencias (npm audit y pip safety) y los datos sensibles se gestionan mediante variables de entorno encriptadas.
•  Integración Continua y Portabilidad Docker: Los contenedores de Angular 21, FastAPI y PostgreSQL se compilan y validan satisfactoriamente en el entorno de desarrollo local con GitHub Actions, garantizando su correcta ejecución antes del despliegue final en el servidor VPS particular en la semana 11.
•  Validación y Aprobación del Product Owner: Demostración funcional en vivo (software funcionando, no diapositivas) ante Marcell Magaly Vásquez Loje (Product Owner), obteniendo su conformidad de cumplimiento de los criterios de aceptación.
4.   Aceptación del Sponsor y Product Owner (Sponsor Acceptance)
Por medio de la presente, la contraparte institucional de la empresa Impresos Trujillo E.I.R.L. en calidad de Product Owner y Sponsor del proyecto, manifiesta su total conocimiento y aprobación del inventario de Historias de Usuario, su orden de priorización, las estimaciones relativas de esfuerzo y las interfaces del sistema acordadas para el desarrollo iterativo del sistema web:

[TABLE]
| POR EL PRODUCT OWNER / SPONSOR | POR EL EQUIPO DE DESARROLLO (SCRUM) |
| ________________________________________ | ________________________________________ |
| Marcell Magaly Vásquez Loje
Gerente de Administración / Product Owner
Impresos Trujillo E.I.R.L.
Fecha: 22 de Septiembre de 2026 | Gerardo Erick Plasencia Torres
Líder de Proyecto / Scrum Master
En representación del Equipo Scrum UPN
Fecha: 22 de Septiembre de 2026 |
[/TABLE]
