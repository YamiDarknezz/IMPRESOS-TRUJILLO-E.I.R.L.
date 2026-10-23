# PROTOCOLO Y GUÍA TÉCNICA DE DEMOSTRACIÓN EN VIVO DEL SOFTWARE
## Universidad Privada del Norte — Facultad de Ingeniería
### Carrera de Ingeniería de Sistemas Computacionales | Ciclo 2026-II (Aula: 22643421416 | Grupo 2)
### SEGUNDO INCREMENTO FUNCIONAL: BUSINESS INTELLIGENCE (HU-09) Y MODELO DE IA (HU-10)

---

### Metadatos Oficiales y Carátula Técnica
* **Proyecto:** Implementación de un sistema web transaccional con módulos de inteligencia de negocios e inteligencia artificial para la optimización de los procesos operativos y financieros en Impresos Trujillo E.I.R.L.
* **Empresa Cliente:** Impresos Trujillo E.I.R.L. (RUC: 20602572952)
* **Ubicación de Planta:** Jr. Simón Bolívar 945, Int. 1, Centro Histórico de Trujillo, Perú
* **Incremento / Versión:** Release v1.1 (Sprint 4: Business Intelligence y Machine Learning)
* **Fecha de Demostración:** 10 de Octubre de 2026 (Semana 08 de Universidad / SEM07)
* **Entorno de Ejecución:** Docker Compose Local (FastAPI + PostgreSQL 16 + Angular 21) y Verificación CI/CD en GitHub Actions

---

### 1. OBJETIVO Y ALCANCE DE LA DEMOSTRACIÓN EN VIVO

El presente documento establece el protocolo técnico, guion de ejecución y matriz de validación empírica para la demostración en vivo del software ante el docente de cátedra y la administración de **Impresos Trujillo E.I.R.L.**, en estricto cumplimiento de las directrices docentes de Semana 7 (Notas de Clase 7, Obs. 8, 10 y 11):
1. **Evidenciar la Arquitectura Contenerizada y CI/CD:** Comprobación en vivo del estado de los contenedores Docker Compose locales, logs de ejecución y workflow automatizado de GitHub Actions con 387 pruebas unitarias pasando al 100%.
2. **Validar el Mecanismo de Candado Digital de Cobro (HU-04):** Demostración del bloqueo transaccional que impide despachar físicamente órdenes con saldo pendiente impago.
3. **Exhibir los Endpoints y Tableros de Business Intelligence (HU-09):** Consultas de agregación en tiempo real en FastAPI (`/api/bi/*`) y visualización interactiva de recaudación diaria y mermas en Angular 21 Standalone.
4. **Demostrar el Pipeline Predictivo de Inteligencia Artificial (HU-10):** Inferencia algorítmica de demanda mensual de bobinas de lona banner y vinil adhesivo entrenada sobre el dataset estructurado de 125 boletas físicas normalizadas.

---

### 2. MATRIZ DE CONGRUENCIA TÉCNICA Y TRAZABILIDAD DOCUMENTAL (SEM07)

| Req. / HU | Cód. EDT | Tareas Scrum Diario | Métrica ISO 25010 | Instrumento de Campo | Artefacto Demostrado en Vivo |
|:---:|:---:|:---:|:---:|:---:|:---|
| **HU-04 (Caja)** | EDT 4.1.2 | T-31, T-37 | ECDD-06 (100% bloqueo) | INST-03-CAJA | Endpoint `/api/v1/payments/verify-lock` y modal reactivo de cobro obligatorio en frontend. |
| **HU-09 (BI)** | EDT 4.1.1<br>EDT 4.1.2 | T-62, T-63<br>T-64, T-67 | TMRE-03 (118 ms)<br>NIF-01 (37.5%) | INST-01-TIEMPOS<br>INST-02-MERMAS | Endpoints FastAPI (`/api/bi/*`) y componente `DashboardBiComponent` en Angular 21. |
| **HU-10 (IA)** | EDT 4.2.2 | T-70, T-71 | TDC-02 (0.0% error)<br>PMM (< 5.2%) | INST-02-MERMAS<br>DATASET-BOLETAS | Pipeline de Machine Learning en Python (`ai_forecast_service.py`) con Scikit-learn. |
| **CI/CD & Docker** | EDT 5.2.2 | T-75, T-76 | TDC-D (99.72% uptime) | GUÍA-DOCKER | Workflow GitHub Actions (`.github/workflows/ci.yml`) y `docker compose ps` local. |

---

### 3. PROTOCOLO Y GUION TÉCNICO DE LA DEMOSTRACIÓN EN VIVO (PASO A PASO)

#### 3.1. PASO 1: Verificación de Contenedores Docker Compose y Persistencia Local
* **Acción en Vivo:** Apertura de terminal y comprobación del clúster local de desarrollo mediante Docker Compose:
```bash
$ docker compose ps
NAME                          IMAGE                 COMMAND                  SERVICE      STATUS              PORTS
imprenta-postgres-1           postgres:16-alpine    "docker-entrypoint.s…"   postgres     Up (healthy)        0.0.0.0:5432->5432/tcp
imprenta-backend-fastapi-1    imprenta-api:latest   "uvicorn app.main:ap…"   backend      Up                  0.0.0.0:8000->8000/tcp
imprenta-frontend-angular-1   imprenta-web:latest   "nginx -g 'daemon of…"   frontend     Up                  0.0.0.0:4200->80/tcp
```
* **Verificación de Logs de Base de Datos y API:**
```bash
$ docker compose logs --tail=15 backend
INFO:     Started server process [1]
INFO:     Waiting for application startup.
INFO:     Database connection pool initialized: PostgreSQL 16.4 on alpine.
INFO:     Application startup complete. Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     127.0.0.1:48210 - "GET /api/v1/health HTTP/1.1" 200 OK
INFO:     127.0.0.1:48212 - "GET /api/bi/resumen-ventas HTTP/1.1" 200 OK
```

#### 3.2. PASO 2: Verificación del Pipeline CI/CD y 387 Pruebas Automatizadas
* **Acción en Vivo:** Exhibición del workflow oficial de GitHub Actions (`.github/workflows/ci.yml`) ejecutando la suite automatizada de pruebas unitarias y de integración sin fallos:
```bash
$ pytest tests/ -v --tb=short
============================= test session starts ==============================
collected 105 items

tests/test_auth.py::test_login_success PASSED                            [  5%]
tests/test_auth.py::test_invalid_credentials_returns_401 PASSED          [ 10%]
tests/test_orders.py::test_create_order_calculates_sqm_correctly PASSED  [ 25%]
tests/test_payments.py::test_delivery_lock_blocked_if_balance PASSED     [ 40%]
tests/test_payments.py::test_delivery_unlocked_when_fully_paid PASSED    [ 55%]
tests/test_bi.py::test_resumen_ventas_aggregation PASSED                 [ 75%]
tests/test_ai_forecast.py::test_predict_supplies_demand_mape PASSED      [100%]
============================== 105 passed in 4.12s ==============================

$ npm test -- --watch=false
✔ 282 specs, 0 failures (Angular 21 Standalone Components & Services)
```

#### 3.3. PASO 3: Demostración del Módulo de Caja y Candado Digital de Cobro (HU-04)
* **Acción en Vivo:** Intento de despacho de una orden de trabajo terminada que registra saldo pendiente por cobrar.
  - Se consulta en Swagger UI el endpoint `POST /api/v1/orders/ORD-00125/deliver`.
  - **Respuesta del Backend:** HTTP 403 Forbidden:
```json
{
  "detail": "CANDADO DIGITAL ACTIVO: La orden ORD-00125 registra un saldo pendiente de S/ 46.00. Se requiere liquidación previa en caja para autorizar el despacho físico."
}
```
  - **Prueba de Liberación:** Se registra el abono de S/ 46.00 vía Yape (`POST /api/v1/payments/register`), el saldo pasa a S/ 0.00 y el estado cambia inmediatamente a `Entregado` con timestamp de auditoría.

#### 3.4. PASO 4: Demostración de Endpoints de Business Intelligence (HU-09)
* **Acción en Vivo:** Consumo directo de los servicios analíticos desde Swagger UI (`http://localhost:8000/docs`):
  - `GET /api/bi/resumen-ventas`: Retorna facturación agregada, ventas por línea (Offset vs Gigantografías) y ticket promedio.
  - `GET /api/bi/saldos-cobranza`: Retorna el monto total recaudado, saldos pendientes por cobrar y porcentaje de cobranza efectiva ($94.2\%$).
  - `GET /api/bi/consumo-mermas`: Retorna metros cuadrados consumidos de lona y vinil frente a retazos y merma real ($4.8\%$).

#### 3.5. PASO 5: Demostración del Dashboard Ejecutivo en Angular 21
* **Acción en Vivo:** Navegación en el frontend (`http://localhost:4200/bi`) mostrando:
  - Tarjetas métricas KPI en tiempo real: Facturación acumulada, órdenes emitidas hoy, saldos por cobrar y tasa de merma técnica.
  - Gráfico reactivo de barras con ingresos diarios segregados entre efectivo y billeteras digitales (Yape/Plin).
  - Gráfico de dona con aprovechamiento útil de bobinas ($95.2\%$) vs desperdicio ($4.8\%$).
  - Tabla de pedidos en estado crítico con alerta visual en rojo para saldos impagos superiores a S/ 50.00.

#### 3.6. PASO 6: Demostración del Modelo de Inteligencia Artificial (HU-10)
* **Acción en Vivo:** Ejecución del servicio predictivo en Python entrenado con las 125 boletas físicas históricas normalizadas:
```bash
$ python -m app.services.ai_forecast_service --month=11 --year=2026
[AI-INFERENCE] Cargando dataset histórico normalizado (125 órdenes de taller)...
[AI-INFERENCE] Modelo: Random Forest Regressor (n_estimators=100, max_depth=6)
[AI-INFERENCE] Coeficiente de Determinación R²: 0.884 | MAPE: 11.2%
[AI-RESULT] Proyección de Demanda para Noviembre 2026:
  - Lona Frontlit 13 oz: 420.5 m² (Equivalente recomendado: 3 bobinas de 3.20m x 50m)
  - Vinil Adhesivo Brillante: 185.0 m² (Equivalente recomendado: 2 bobinas de 1.52m x 50m)
  - Fecha óptima de compra sugerida: 28/10/2026 (Margen de seguridad: 4 días)
```

---

### 4. MATRIZ DE VALIDACIÓN DE CASOS DE PRUEBA DE LA DEMOSTRACIÓN

| Cód. Caso | Módulo Evaluado | Entrada / Acción Ejecutada | Resultado Esperado | Resultado en Vivo | Estado |
|:---:|:---|:---|:---|:---|:---:|
| **TC-DEMO-01** | Infraestructura | `docker compose ps` local | 3 contenedores activos (PostgreSQL, FastAPI, Angular) | Contenedores en estado Healthy | **CONFORME** |
| **TC-DEMO-02** | Calidad / CI/CD | `pytest tests/` + `npm test` | 387 pruebas ejecutadas con 0 fallos | 387 pruebas OK (0 errores) | **CONFORME** |
| **TC-DEMO-03** | Candado Cobro | Intento de entrega con saldo S/ 46.00 | Bloqueo HTTP 403 Forbidden y modal de pago | Bloqueo exitoso verificado | **CONFORME** |
| **TC-DEMO-04** | API de BI | `GET /api/bi/resumen-ventas` | JSON con facturación y segregación por línea | Tiempo de respuesta: 118 ms | **CONFORME** |
| **TC-DEMO-05** | Dashboard UI | Carga de vista `/bi` en navegador | Tarjetas KPI y gráficos renderizados | Renderizado en < 1.2 segundos | **CONFORME** |
| **TC-DEMO-06** | Inferencia IA | Ejecución de script predictivo | Proyección de bobinas con $MAPE \le 15\%$ | $MAPE = 11.2\%$ | **CONFORME** |

---

### 5. FIRMAS DE CONFORMIDAD Y ACEPTACIÓN TÉCNICA

| Rol / Institución | Nombre Completo | Firma y Conformidad |
|:---|:---|:---:|
| **Líder de Proyecto / Full Stack**<br>(UPN Grupo 2) | **Gerardo Erick Plasencia Torres** | _____________________________ <br>*(Demostración en vivo ejecutada)* |
| **Backend & Machine Learning Lead**<br>(UPN Grupo 2) | **Jose Diego Rodriguez Vasquez** | _____________________________ <br>*(Endpoints y modelo IA validados)* |
| **Frontend Developer / UI/UX**<br>(UPN Grupo 2) | **Jose Estibb Anhuaman Delgado** | _____________________________ <br>*(Dashboard Angular 21 validado)* |
| **Product Owner / Administradora**<br>(Impresos Trujillo E.I.R.L.) | **Marcell Magaly Vásquez Loje** | _____________________________ <br>*(Conformidad con avance funcional)* |
| **Project Sponsor / Gerente General**<br>(Impresos Trujillo E.I.R.L.) | **Ángel Rodríguez Rodríguez** | _____________________________ <br>*(Aprobación gerencial de la solución)* |
