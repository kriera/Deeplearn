# Evals de contenido — DeepLearn

> **Ejecutado:** 2026-07-15T08:54:07.673Z
> **Modelo:** gpt-oss:120b-cloud
> **Resultado:** 182/182 checks OK · 0 fallos

| Suite            | Caso                     | Checks OK | Fallos | Duración |
| ---------------- | ------------------------ | --------- | ------ | -------- |
| A·nivel1         | fotosíntesis             | 12/12     | 0      | 51.9s    |
| A·nivel1         | la revolución francesa   | 12/12     | 0      | 57.2s    |
| A·nivel1         | el sistema solar         | 12/12     | 0      | 122.3s   |
| A·nivel1         | teoría de la relatividad | 12/12     | 0      | 52.8s    |
| A·nivel1         | photosynthesis           | 12/12     | 0      | 48.0s    |
| A·nivel1         | black holes              | 12/12     | 0      | 41.1s    |
| A·nivel1         | supply and demand        | 12/12     | 0      | 51.1s    |
| A·nivel1         | quantum entanglement     | 12/12     | 0      | 53.6s    |
| B·nivel5         | fotosíntesis             | 13/13     | 0      | 55.3s    |
| B·nivel5         | la revolución francesa   | 13/13     | 0      | 48.3s    |
| B·nivel5         | black holes              | 13/13     | 0      | 45.8s    |
| B·nivel5         | quantum entanglement     | 13/13     | 0      | 46.5s    |
| C·re-explicación | fotosíntesis             | 12/12     | 0      | 41.6s    |
| C·re-explicación | black holes              | 12/12     | 0      | 56.0s    |
| D·srs            | el sistema solar         | 5/5       | 0      | 14.2s    |
| D·srs            | supply and demand        | 5/5       | 0      | 17.0s    |

## Fallos detectados

_Sin fallos._

## Observaciones (no bloqueantes)

- [B·nivel5] fotosíntesis: complejidad (palabras/frase): nivel 1 = 8.8, nivel 5 = 21.5
- [B·nivel5] la revolución francesa: complejidad (palabras/frase): nivel 1 = 9.7, nivel 5 = 34.3
- [B·nivel5] black holes: complejidad (palabras/frase): nivel 1 = 9.9, nivel 5 = 27.5
- [B·nivel5] quantum entanglement: complejidad (palabras/frase): nivel 1 = 10.6, nivel 5 = 25.0

## Metodología

Cuatro suites contra el modelo real: (A) explicación + quiz del nivel Elemental para 8
conceptos (4 es / 4 en); (B) nivel Experto para 4 conceptos, verificando además que la
explicación difiere de la elemental y midiendo complejidad por frase; (C) re-explicación
con áreas débiles simuladas; (D) tarjetas SRS. Checks por caso: contrato JSON, 5 preguntas
no repetidas × 4 opciones únicas, `correct_index` válido y distribuido, ids únicos,
explicación por pregunta, longitudes acotadas e idioma del contenido generado.
