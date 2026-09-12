# Proyecto: cadena de valor de combustibles en tldraw

## Objetivo

Representar en un lienzo editable de tldraw la organización del caso "Sector industrial de combustibles derivados del petróleo" aplicando la Teoría General de Sistemas.

## Fuente de verdad

- Caso académico: `Unidad 2 - Cadena de Valor del Negocio - Práctica Analítica - Caso 2.pdf`.
- No inventar actores ni procesos incompatibles con el caso. Las extensiones analíticas deben distinguirse como propuestas.

## Contenido mínimo del diagrama

- Parámetros del sistema abierto: entradas, transformación, salidas, ambiente y retroalimentación.
- Límites explícitos de las cadenas de abastecimiento, operación/almacenamiento y distribución.
- Flujos físicos, informacionales y de control relevantes.
- MIC e INTN como reguladores externos.
- Propuesta de codificación de lotes que soporte trazabilidad técnica y operativa.

## Criterios visuales

- Mantener el lienzo legible al usar "Zoom para ajustar".
- Usar un color consistente por cadena y rojo únicamente para control/retroalimentación.
- Preferir frases breves dentro de las formas; llevar explicaciones extensas a notas separadas.
- Toda forma inicial debe seguir siendo editable con las herramientas nativas de tldraw.

## Verificación

- Ejecutar `npm run build` después de cambios de código.
- Comprobar que un lienzo nuevo se inicializa con el diagrama y que un lienzo persistido no se sobrescribe.

