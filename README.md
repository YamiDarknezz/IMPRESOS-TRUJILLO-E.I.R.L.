# IMPRESOS TRUJILLO E.I.R.L. — Capstone Project

Sistema web de gestión de órdenes, inventario, pagos y reportes para la imprenta
**Impresos Trujillo E.I.R.L.** (Trujillo, Perú), con un módulo de Inteligencia de Negocios
y un módulo de Inteligencia Artificial.

## Curso

- **Asignatura:** Capstone Project Sistemas
- **Código de aula:** 22643421416
- **Docente:** Jose Alberto Gomez Avila — jose.gomez@upn.pe
- **Grupo:** 2

## Equipo

| Rol | Nombre | Enfoque principal |
|-----|--------|-------------------|
| Líder de Proyecto / Full Stack | Gerardo Erick Plasencia Torres | Arquitectura, backend, integración, coordinación |
| Desarrollador Frontend | Jose Estibb Anhuaman Delgado | UI/UX, componentes Angular, dashboards |
| Desarrollador Backend / IA | Jose Diego Rodriguez Vasquez | API, lógica de negocio, modelos de IA, reportes |

> Sistema MultiRol: todos participan en todas las fases (Scrum).

## Stack tecnológico

- **Frontend:** Angular 21
- **Backend:** FastAPI (Python 3.11)
- **Base de datos:** PostgreSQL
- **IA:** Scikit-learn / Prophet
- **Despliegue:** Docker + Cloud Run

## Estructura del repositorio

```
docs/
  contexto/        # Notas de clase, contexto del negocio y replanteamiento
  plantillas/      # Plantillas .docx de los entregables del curso
  referencias/     # Sílabo y material de clase (PDF)
```

Los documentos entregables (Acta de Constitución, Business Case, Requerimientos de
Software) se generan a partir de las plantillas, manteniendo consistencia entre ellos.

## Componentes obligatorios del proyecto

1. **Transaccional** (ciclos 1-4): órdenes, inventario, pagos, clientes, productos.
2. **Inteligencia de Negocios** (ciclos 5-7): dashboards y reportes.
3. **Módulo de Inteligencia Artificial** (ciclos 8-9): predicción de demanda, alertas, sugerencia de precio.
