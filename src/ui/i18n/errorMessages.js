/**
 * Traducción de errores técnicos a mensajes accionables para el usuario.
 *
 * Usabilidad (Módulo 4, heurística 9 de Nielsen): los mensajes de error
 * dicen qué pasó y cómo resolverlo, nunca códigos ni jerga ("Error 500").
 */

export function toUserMessage(err) {
  const raw = err?.message || ''

  if (/failed to fetch|networkerror|load failed|econnrefused|abort/i.test(raw)) {
    return 'No pudimos conectar con el modelo de IA. Comprueba que Ollama esté en ejecución y vuelve a intentarlo.'
  }
  if (/error:?\s*(4\d\d|5\d\d)|api error|ollama error/i.test(raw)) {
    return 'El modelo de IA no respondió correctamente. Espera unos segundos y vuelve a intentarlo.'
  }
  if (/json|parse|unexpected token/i.test(raw)) {
    return 'La respuesta del modelo llegó incompleta. Vuelve a intentarlo.'
  }
  return 'Algo salió mal al generar el contenido. Vuelve a intentarlo.'
}
