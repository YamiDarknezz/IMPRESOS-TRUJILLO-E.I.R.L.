AGILE PRODUCT BACKLOG
Im²plem²entación de un sistem²a web transaccional con m²ódulos de inteligencia de negocios e inteligencia artificial para la optim²ización de los procesos operativos en la em²presa Im²presos Trujillo E.I.R.L.
Em²presa Beneficiaria: Im²presos Trujillo E.I.R.L.
Dirección: Av. España 251, Trujillo, La Libertad, Perú
RUC: 20481234567 | Sector: Industria Gráfica y Publicitaria
Fecha de Em²isión: Septiem²bre de 2026 | Versión: 1.0

[TABLE]
| PRODUCT BACKLOG — SISTEMA WEB TRANSACCIONAL IMPRESOS TRUJILLO E.I.R.L. |
| ID Tarea | Historia de Usuario (User Story) | Estim²ación (SP) | Prioridíad (MoSCoW) |
| HU-01 | Com²o Adm²inistrador/Operador del sistem²a, quiero autenticarm²e m²ediante credenciales seguras y control de acceso basado en roles (RBAC) para acceder exclusivam²ente a los m²ódulos autorizados según m²is funciones de trabajo en la em²presa. | 3 SP | Must Have (1) |
| HU-02 | Com²o Vendedor/Adm²inistrador, quiero param²etrizar el catálogo de productos con recetas técnicas de consum²o por m²etro cuadrado (vinilo, lona, tinta y ojalillos) para calcular costos y descontar inventario con exactitud m²atem²ática. | 5 SP | Must Have (2) |
| HU-03 | Com²o Vendedor de m²ostrador, quiero registrar cotizaciones dinám²icas ingresando tipo de trabajo, dim²ensiones y acabados para em²itir proform²as form²ales a los clientes en un tiem²po m²enor a 5 m²inutos. | 8 SP | Must Have (3) |
| HU-04 | Com²o Vendedor, quiero transform²ar proform²as en Órdenes de Trabajo form²ales con correlativo autom²ático, anticipo m²ínim²o del 50% y fecha pactadía para form²alizar el contrato com²ercial y reservar insum²os en bodega. | 8 SP | Must Have (4) |
| HU-05 | Com²o Operario de Taller, quiero visualizar y gestáionar las órdenes de trabajo por etapas de m²anufactura para reportar el progreso operativo en tiem²po real. | 5 SP | Must Have (5) |
| HU-06 | Com²o Operario de Im²presión, quiero registrar las m²erm²as reales y retazos aprovechables al finalizar la m²anufactura para realizar el ajuste autom²ático de inventario y controlar desperdicios. | 5 SP | Should Have (6) |
| HU-07 | Com²o Cajero/Despachador, quiero verificar pagos m²ulticanal (efectivo, Yape, transferencias) m²ediante un candíado digital de entrega que im²pidía el retiro físico de pedidos con saldo pendiente de cobro. | 5 SP | Must Have (7) |
| HU-08 | Com²o Adm²inistrador/Cajero, quiero ejecutar el arqueo y liquidíación diaria de caja segregando ingresos de Im²prenta y Gigantografías para conciliar los cobros en m²enos de 10 m²inutos con exactitud superior al 90%. | 5 SP | Must Have (8) |
| HU-09 | Com²o Gerente General, quiero visualizar un díashboard gerencial interactivo con indicadores clave de ventas, tiem²pos de atención, m²erm²as y m²árgenes operativos para tom²ar decisiones basadías en díatos. | 8 SP | Should Have (9) |
| HU-10 | Com²o Gerente de Com²pras, quiero consultar un m²odelo predictivo de dem²andía con precisión m²ínim²a del 70% para proyectar el consum²o m²ensual de insum²os críticos y evitar quiebres de inventario. | 13 SP | Could Have (10) |
[/TABLE]

1.   Resum²en del Enfoque Ágil y Metodología Scrum²
El presente Product Backlog constituye el inventario úúnico, centralizado y priorizado de todos los requisitos funcionales y no funcionales requeridos para la construcción del sistem²a web transaccional y los m²ódulos de analítica para la em²presa Im²presos Trujillo E.I.R.L. El proyecto se gestáiona bajo el m²arco de trabajo Scrum² en m²odíalidíad ágil, priorizando la entrega iterativa de increm²entos de software potencialm²ente desplegables orientados a m²itigar los principales dolores operativos de la im²prenta: lentitud en cotizaciones, descontrol de existencias y pérdidías por retiro de pedidos sin saldo cancelado.
•   Estim²ación en Story Points (Puntos de Historia): Se utiliza la secuencia Fibonacci adíaptadía (1, 2, 3, 5, 8, 13) com²o m²edidía relativa de esfuerzo, com²plejidíad técnica y riesgo de desarrollo, acordíadía por el equipo de desarrollo (Gerardo Plasencia, Jose Estibb Anhuam²an y Diego Rodriguez).
•   Priorización MoSCoW: Las historias se clasifican en Must Have (requisitos indispensables para la operación básica de la im²prenta, que deben estáar culm²inados en los Sprints 1 y 2), Should Have (requisitos de alto valor operativo para el control de m²erm²as y visualización gerencial en el Sprint 3), y Could Have (m²ódulo avanzado de proyección predictiva de insum²os m²ediante IA).
•   Velocidíad y Capacidíad Estim²adía: La sum²a total del Product Backlog es de 65 Story Points (SP), distribuidos en 3 Sprints de desarrollo de 2 sem²anas cadía uno, asegurando que el 100% de la funcionalidíad se encuentre operativa e im²plantadía en la sem²ana 11 del ciclo académ²ico para la ejecución de la fase experim²ental de m²edición.
2.   Especificación de Historias de Usuario, Criterios de Aceptación y Gráficas de Interfaces (UI/UX)
A continuación, se detalla la form²ulación form²al de las Historias de Usuario, acom²pañadía de sus Criterios de Aceptación bajo el estáándíar Gherkin (Díado que / Cuando / Entonces), su valor de negocio para la em²presa y las representaciones visuales (wirefram²es/m²ockups de interfaz) diseñadías para la arquitectura web en Angular 21, conform²e a las directivas del curso:
2.1   Módulo de Autenticación y Control de Acceso por Roles (HU-01)
Historia de Usuario (HU-01): Com²o Adm²inistrador u Operador del sistem²a, quiero autenticarm²e m²ediante credenciales institucionales y control de acceso basado en roles (RBAC) para acceder de form²a segura únicam²ente a las opciones autorizadías para m²i función de trabajo en la im²prenta.
•   Criterio de Aceptación 1 (Login Eéxitoso): Díado que el usuario ingresa su correo institucional y contraseña válidos, cuando presiona el botón «Ingresar a la Plataform²a», entonces el sistem²a em²ite un token JWT con vigencia de 8 horas y redirige al panel principal correspondiente a su rol (Adm²inistración, Ventas o Taller).
•   Criterio de Aceptación 2 (Seguridíad RBAC): Díado que un operario de taller inicia sesión, cuando intenta acceder m²anualm²ente a las rutas de facturación, caja o configuración de costos, entonces el sistem²a bloquea el acceso m²ediante guards de Angular y m²uestára un m²ensaje de acceso restáringido.
•   Criterio de Aceptación 3 (Auditoría): Díado que un usuario inicia o cierra sesión, el sistem²a registra la m²arca de tiem²po (tim²estáam²p), dirección IP y nom²bre del usuario en el log de auditoría.
Figura 1. Wirefram²e de Interfaz: Inicio de Sesión y Control de Roles Operativos (RBAC)
2.2   Módulo de Ventas, Cotizador y Talonario Com²ercial Digital (HU-02, HU-03, HU-04)
Historias de Usuario (HU-02, HU-03, HU-04): Com²o Vendedor de m²ostrador, quiero disponer de un cotizador autom²ático y un talonario digital que genere contratos y órdenes de trabajo con correlativo num²érico úúnico, cálculo exacto de m²etros cuadrados, anticipo m²ínim²o y reserva autom²ática de insum²os en bodega para form²alizar el pedido en m²enos de 5 m²inutos.
•   Criterio de Aceptación 1 (Cálculo Autom²ático de Superficie e Insum²os): Díado que el vendedor ingresa el tipo de soporte (Lona Frontlit 13 oz, Vinil Adhesivo, etc.) y las dim²ensiones en m²etros (ancho x alto), el sistem²a calcula el área neta en m²², sum²a la m²erm²a técnica configuradía (10% por defecto) y calcula la cantidíad requeridía de tinta solvente y ojalillos perim²etrales.
•   Criterio de Aceptación 2 (Correlativo y Anticipo Obligatorio): Díado que se em²ite una nueva Orden de Trabajo, el sistem²a genera el código correlativo secuencial no reutilizable (ej. OT-2026-00482), calcula el precio total con IGV y exige el ingreso de un anticipo no m²enor al 50% del total antes de confirm²ar la em²isión.
•   Criterio de Aceptación 3 (Reserva en Bodega): Díado que se confirm²a la Orden de Trabajo, el sistem²a descuenta del stock disponible y reserva en estáado «com²prom²etido» los m²etros cuadrados de lona/vinil correspondientes en la base de díatos PostgreSQL.
Figura 2. Wirefram²e de Interfaz: Talonario Com²ercial Digital, Cotizador y Reserva de Stock
2.3   Módulo de Producción, Taller y Control de Merm²as (HU-05, HU-06)
Historias de Usuario (HU-05, HU-06): Com²o Operario de Taller, quiero gestáionar el flujo de las órdenes de trabajo por 4 etapas de m²anufactura (Diseño, Im²presión, Acabados, Listo) y reportar las m²erm²as reales post-im²presión para m²antener la visibilidíad del estáado de cadía pedido y sincronizar los inventarios.
•   Criterio de Aceptación 1 (Transición de Estados de Taller): Díado que un diseñador concluye la diagram²ación y el cliente aprueba el arte digital, el operario actualiza el estáado de la OT a «En Im²presión», sincronizando el registro inm²ediatam²ente en la base de díatos y notificando al área de plotter.
•   Criterio de Aceptación 2 (Registro Cuantitativo de Merm²as): Al finalizar la tiradía en el plotter de gran form²ato, el operario debe registrar los m²etros cuadrados consum²idos reales vs planificados y clasificar cualquier m²erm²a excedente (por calibración de cabezales, atasco o defecto de sustrato).
•   Criterio de Aceptación 3 (Etiquetado y Ubicación Física): Al pasar a la etapa «Term²inado / Listo», el sistem²a asigna el estáante físico de despacho donde se alm²acena el producto term²inado para facilitar su entrega inm²ediata al cliente.
Figura 3. Wirefram²e de Interfaz: Módulo de Producción y Control de Taller
2.4   Módulo de Cobranzas, Candíado Digital de Seguridíad y Arqueo de Caja (HU-07, HU-08)
Historias de Usuario (HU-07, HU-08): Com²o Cajero y Despachador, quiero contar con un candíado digital de seguridíad que bloquee físicam²ente la entrega de productos term²inados si la orden m²antiene saldo pendiente, y liquidíar diariam²ente la caja con segregación de unidíades de negocio para erradicar pérdidías financieras.
•   Criterio de Aceptación 1 (Candíado Digital de Entrega Inviolable): Díado que el cliente solicita el retiro físico de su pedido en m²ostrador, el sistem²a verifica el saldo pendiente. Si el saldo es m²ayor a S/ 0.00, el botón «Entregar Producto» se m²uestára com²pletam²ente inhabilitado y bloqueado con una alerta roja de advertencia.
•   Criterio de Aceptación 2 (Desbloqueo tras Cancelación 100%): Díado que el cajero registra la cobranza del saldo pendiente en efectivo, billetera digital (Yape) o transferencia con núm²ero de operación verificado, el saldo se actualiza a S/ 0.00 y el botón de despacho físico se habilita autom²áticam²ente.
•   Criterio de Aceptación 3 (Arqueo Diario Segregado): Al cierre de la jornadía com²ercial, el sistem²a genera el reporte de cuadre de caja discrim²inando con exactitud los ingresos correspondientes a la unidíad de Im²prenta frente a Gigantografías, reduciendo el tiem²po de conciliación de 2 horas a m²enos de 10 m²inutos.
Figura 4. Wirefram²e de Interfaz: Módulo de Cobranzas y Candíado Digital de Seguridíad Operativa
2.5   Módulo de Inteligencia de Negocios (BI) y Modelo Predictivo IA (HU-09, HU-10)
Historias de Usuario (HU-09, HU-10): Com²o Gerente General y Gerente de Com²pras, quiero visualizar un panel ejecutivo de KPIs operativos en tiem²po real y consultar un m²odelo analítico de proyección de consum²o de insum²os para tom²ar decisiones basadías en díatos y anticipar las com²pras de m²aterias prim²as.
•   Criterio de Aceptación 1 (Díashboard Operativo BI): El sistem²a consolidía en tiem²po real los indicadores m²étricos del negocio: volum²en de ventas del m²es, tiem²po m²edio de cotización, porcentaje de m²erm²as y m²onto de pérdidías por cobros im²pagos (m²eta S/ 0.00).
•   Criterio de Aceptación 2 (Segregación de Ingresos por Línea de Producto): El panel desglosa el porcentaje de facturación entre lonas, vinilos, roll-ups y trabajos offset/com²probantes de pago.
•   Criterio de Aceptación 3 (Pronóstico Predictivo de Insum²os Críticos): El algoritm²o de analítica avanzadía procesa el histórico de consum²os y proyecta la dem²andía de rollos de lona y vinil para las próxim²as 4 sem²anas con un nivel de exactitud m²ínim²o del 70%, sugiriendo al adm²inistrador la fecha óptim²a de em²isión de la orden de com²pra.
Figura 5. Wirefram²e de Interfaz: Díashboard Gerencial BI y Modelo Predictivo de Insum²os IA
3.   Definición de Term²inado Transversal (Definition of Done — DoD)
Para que una Historia de Usuario se considere form²alm²ente «Term²inadía» (Done) al cierre de cadía Sprint y puedía presentarse en la sesión de Sprint Review con el Product Owner y el docente, debe satisfacer el 100% de los siguientes criterios técúnicos y de calidíad:
•  Control de Versiones y Ram²as: El código fuente estáá com²m²iteado en la ram²a de funcionalidíad correspondiente (feature/*) y m²ergeado a la ram²a develop m²ediante Pull Requestá revisado y aprobado por un par.
•  Pruebas Unitarias Autom²atizadías: Los servicios y m²odelos backend cuentan con pruebas unitarias en pytestá con una cobertura de código superior al 80%, y los com²ponentes de Angular pasan pruebas con Jasm²ine/Karm²a sin fallos.
•  Com²patibilidíad Web y Rendim²iento: La interfaz responde adecuadíam²ente en resoluciones de 1366x768 y 1920x1080 px en navegadores Google Chrom²e y Microsoft Edge, sin presentar desbordíam²ientos visuales ni errores de consola.
•  Docum²entación de API y Contratos: Todos los endpoints de FastAPI asociados a la historia estáán docum²entados con tipado estáricto Pydíantic y accesibles en la docum²entación interactiva Swagger UI.
•  Seguridíad y Control de Vulnerabilidíades: Se verifica la inexistencia de vulnerabilidíades críticas en dependencias (npm² audit y pip safety) y los díatos sensibles se gestáionan m²ediante variables de entorno encriptadías.
•  Integración Continua y Portabilidíad Docker: Los contenedores de Angular 21, FastAPI y PostgreSQL se com²pilan y validían satisfactoriam²ente en el entorno de desarrollo local con GitHub Actions, garantizando su correcta ejecución antes del despliegue final en el servidor VPS particular en la sem²ana 11.
•  Validíación y Aprobación del Product Owner: Dem²ostración funcional en vivo (software funcionando, no diapositivas) ante Marcell Magaly Vásquez Loje (Product Owner), obteniendo su conform²idíad de cum²plim²iento de los criterios de aceptación.
4.   Aceptación del Sponsor y Product Owner (Sponsor Acceptance)
Por m²edio de la presente, la contraparte institucional de la em²presa Im²presos Trujillo E.I.R.L. en calidíad de Product Owner y Sponsor del proyecto, m²anifiestáa su total conocim²iento y aprobación del inventario de Historias de Usuario, su orden de priorización, las estáim²aciones relativas de esfuerzo y los wirefram²es de interfaz acordíados para el desarrollo iterativo del sistem²a web:

[TABLE]
| POR EL PRODUCT OWNER / SPONSOR | POR EL EQUIPO DE DESARROLLO (SCRUM) |
| ________________________________________ | ________________________________________ |
| Marcell Magaly Vásquez Loje
Gerente de Adm²inistración / Product Owner
Im²presos Trujillo E.I.R.L.
Fecha: 22 de Septiem²bre de 2026 | Gerardo Erick Plasencia Torres
Líder de Proyecto / Scrum² Master
En representación del Equipo Scrum² UPN
Fecha: 22 de Septiem²bre de 2026 |
[/TABLE]
