# INSTRUMENTOS DE RECOLECCIÓN DE DATOS — SEM07 (BORRADOR PARA REVISIÓN)
## Proyecto Capstone UPN 2026-II · Impresos Trujillo E.I.R.L.

### Estado y corte

- SEM07 de entregables: 05/10/2026–10/10/2026; corresponde a semana académica 08.
- El sábado 10 es clase/Monitoreo 1; no se agregan observaciones de trabajo en taller ese día.
- Esta fuente define instrumentos y campos para aplicación. **No contiene resultados de aplicación ni acreditación psicométrica** hasta recibir registros originales.
- El número `125` aparece en actas/documentos previos como dataset histórico reportado; el CSV/fichas de origen no están versionados en esta carpeta. Confirmar tamaño, anonimización y disponibilidad antes de fijarlo como N censal.

## Matriz de instrumentos

| Código | Variable/dimensión | Técnica e instrumento | Unidad | Aplicación y evidencia requerida |
|:---|:---|:---|:---|:---|
| INST-01 | Tiempo de atención/cotización | Observación y cronometraje | Minutos por orden | Hoja de observación fechada, operador, inicio/fin y fase pre/post. |
| INST-02 | Consumo/merma de sustratos | Inspección y medición física | m² y porcentaje | Registro de bobina, pedido, área usada, retazo reutilizable y descarte. No inferir merma desde el stock teórico. |
| INST-03 | Caja y pagos | Conciliación de cierre | S/ y número de casos | Cierre de caja, métodos de pago, descuadre explicado y órdenes entregadas con saldo. Usar exporte anonimizado. |
| INST-04 | Usabilidad percibida | Cuestionario SUS (10 ítems) | Puntaje 0–100 | Formulario completado por cada participante y cálculo de puntaje con respuestas originales. |

## INST-01 — ficha de tiempos

Registrar sin rellenar datos retrospectivos no observados:

| ID anonimizado | Fecha | Canal | Inicio atención | Fin cotización | Emisión/cobro anticipo | Tiempo total | Fase (pre/post) | Observador |
|:---|:---|:---|:---|:---|:---|:---:|:---|:---|
| Pendiente de observación | | | | | | | | |

Definir y aplicar los mismos hitos de inicio/fin en pretest y postest. Los timestamps de creación en PostgreSQL no sustituyen el cronometraje de atención si no registran el inicio de la atención.

## INST-02 — ficha de consumo y merma física

| ID bobina/lote | Material | Dimensiones/unidad | ID orden anonimizado | Área tomada | Retazo reutilizable | Descarte medido | % merma | Fase | Responsable |
|:---|:---|:---|:---|:---:|:---:|:---:|:---:|:---|:---|
| Pendiente de observación | | | | | | | | | |

Fórmula y convención de denominador deben acordarse antes de levantar la muestra (por ejemplo, descarte / material efectivamente consumido); registrar unidades compatibles. No consignar los porcentajes de ejemplo que aparecen en versiones anteriores como observaciones reales. En SEM07 no se acreditó un módulo BI ni captura sistemática del consumo/merma por orden.

## INST-03 — ficha de caja y entrega

| Fecha de cierre | Unidad de negocio | Efectivo | Pagos digitales por método | Total sistema | Total físico/conciliado | Diferencia y motivo | ID orden anonimizado entregada con saldo | Evidencia |
|:---|:---|---:|:---|---:|---:|:---|:---|:---|
| Pendiente de observación | | | | | | | | |

Cruzar con `cierres_caja`, `orden_pagos` y estado de la orden cuando proceda. No usar datos personales ni declarar “cero entregas con saldo” sin revisar el universo definido y adjuntar el corte.

## INST-04 — cuestionario SUS

Usar los diez ítems oficiales SUS y escala Likert de 1 a 5. Aplicar después de que cada participante use el sistema; guardar formulario anónimo, perfil de usuario, fecha, versión de software y consentimiento cuando corresponda. Puntaje estándar: para ítems impares restar 1, para pares restar la respuesta a 5; sumar y multiplicar por 2.5. El diseño del instrumento no constituye un resultado SUS.

## Validez y confiabilidad — pendiente

- **V de Aiken:** no fijar 0.94 ni 0.96 hasta disponer de matriz de puntuaciones de los jueces, número de jueces, escala, fórmula aplicada y resultados por ítem/instrumento.
- **Alfa de Cronbach:** no fijar 0.89 sin respuestas del piloto, ítems incluidos, N y cálculo reproducible. No valida por sí solo los cuatro instrumentos heterogéneos.
- Los datos de ejemplo numéricos de borradores previos quedan retirados de esta versión de trabajo; completar las tablas solo con formularios observados y anonimizados.
