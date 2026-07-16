# Evals de contenido — DeepLearn

> **Ejecutado:** 2026-07-16T09:05:53.356Z
> **Modelo:** gpt-oss:120b-cloud
> **Resultado:** 182/182 checks OK · 0 fallos

| Suite            | Caso                     | Checks OK | Fallos | Duración |
| ---------------- | ------------------------ | --------- | ------ | -------- |
| A·nivel1         | fotosíntesis             | 12/12     | 0      | 40.2s    |
| A·nivel1         | la revolución francesa   | 12/12     | 0      | 22.3s    |
| A·nivel1         | el sistema solar         | 12/12     | 0      | 28.7s    |
| A·nivel1         | teoría de la relatividad | 12/12     | 0      | 18.6s    |
| A·nivel1         | photosynthesis           | 12/12     | 0      | 28.8s    |
| A·nivel1         | black holes              | 12/12     | 0      | 18.1s    |
| A·nivel1         | supply and demand        | 12/12     | 0      | 20.6s    |
| A·nivel1         | quantum entanglement     | 12/12     | 0      | 32.5s    |
| B·nivel5         | fotosíntesis             | 13/13     | 0      | 19.6s    |
| B·nivel5         | la revolución francesa   | 13/13     | 0      | 19.6s    |
| B·nivel5         | black holes              | 13/13     | 0      | 17.9s    |
| B·nivel5         | quantum entanglement     | 13/13     | 0      | 19.3s    |
| C·re-explicación | fotosíntesis             | 12/12     | 0      | 11.1s    |
| C·re-explicación | black holes              | 12/12     | 0      | 11.7s    |
| D·srs            | el sistema solar         | 5/5       | 0      | 3.3s     |
| D·srs            | supply and demand        | 5/5       | 0      | 5.5s     |

## Fallos detectados

_Sin fallos._

## Observaciones (no bloqueantes)

- [B·nivel5] fotosíntesis: complejidad (palabras/frase): nivel 1 = 10.1, nivel 5 = 35.5
- [B·nivel5] la revolución francesa: complejidad (palabras/frase): nivel 1 = 12.0, nivel 5 = 35.0
- [B·nivel5] black holes: complejidad (palabras/frase): nivel 1 = 9.5, nivel 5 = 24.4
- [B·nivel5] quantum entanglement: complejidad (palabras/frase): nivel 1 = 8.5, nivel 5 = 18.8

## Metodología

Cuatro suites contra el modelo real: (A) explicación + quiz del nivel Elemental para 8
conceptos (4 es / 4 en); (B) nivel Experto para 4 conceptos, verificando además que la
explicación difiere de la elemental y midiendo complejidad por frase; (C) re-explicación
con áreas débiles simuladas; (D) tarjetas SRS. Checks por caso: contrato JSON, 5 preguntas
no repetidas × 4 opciones únicas, `correct_index` válido y distribuido, ids únicos,
explicación por pregunta, longitudes acotadas e idioma del contenido generado.
