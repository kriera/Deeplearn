# ADR-005: Distribución local-first con Ollama como requisito

**Fecha de la decisión**: 2026-07-14
**Estado**: Aceptado

## Contexto

DeepLearn genera todo su contenido con un LLM. Al preparar el despliegue en Vercel surgió la pregunta clave de distribución: ¿de dónde salen las llamadas al modelo cuando la app corre en el navegador de un visitante?

La primera versión del proyecto (implementación previa, archivada) exploraba que cada usuario aportara su propia API key de un proveedor cloud. Al reescribir el proyecto se construyó también un proxy serverless (`api/ai.js` con validación de entrada y rate limiting) para poder servir contenido con una key propia. Ninguna de las dos opciones se llegó a cablear al frontend.

## Opciones Consideradas

1. **Local-first: el usuario instala Ollama** — la app (local o desplegada) llama a `localhost:11434` en la máquina del propio usuario.
2. **Proxy serverless con key del proyecto** — el frontend llama a `/api/ai`, que reenvía al proveedor con una key privada; requiere CORS restringido, autenticación y control de coste.
3. **BYO API key** — el usuario introduce su propia key de un proveedor cloud en la app; la key viviría en el navegador.

## Decisión

Elegimos la **opción 1: distribución local-first con Ollama como requisito de la aplicación**, configurable por variables de entorno (`VITE_AI_PROVIDER`, `VITE_AI_BASE_URL`, `VITE_AI_MODEL`) a través del composition root (`src/composition/container.js`).

## Justificación

- **Privacidad y control**: no hay servidor propio intermediando ni API keys de pago que gestionar; el usuario elige y controla el proveedor de IA (criterio del máster). La ejecución (navegador + Ollama) y la persistencia (localStorage) ocurren en su máquina.
  - **Matiz honesto (revisado 2026-07-17):** que Ollama sea local **no** implica automáticamente que los prompts no salgan de la máquina. El modelo por defecto `gpt-oss:120b-cloud` es un modelo `-cloud`: Ollama actúa de pasarela y **reenvía los prompts a `ollama.com`** (requiere `ollama signin`). Se mantiene por defecto por su calidad de contenido. Para privacidad total (prompts que no salen de la máquina) el usuario debe configurar un modelo genuinamente local (p. ej. `VITE_AI_MODEL=llama3.2`), soportado por el mismo composition root. Es decir, "local-first" aquí significa _sin backend propio ni secretos_, no _cero telemetría del proveedor de modelo_ con la configuración por defecto.
- **Coste cero y sin secretos**: no hay API key que proteger, rotar ni pagar; elimina el riesgo de coste descontrolado.
- **Coherente con ADR-002 y ADR-003**: modelo local + persistencia en localStorage = aplicación completa sin backend propio.
- La opción 2 exige asumir coste por visitante anónimo y endurecer el proxy (auth, CORS, rate limit distribuido); la opción 3 expone una key de pago en el navegador — ambas desproporcionadas para el alcance actual.

## Consecuencias

### Positivas

- El despliegue en Vercel sirve la SPA estática; la única dependencia del usuario es tener Ollama en ejecución.
- Sin secretos en producción ni superficie de ataque de proxy.
- La UI detecta la ausencia de Ollama y lo comunica con mensaje accionable y reintento.

### Negativas

- Fricción de onboarding: el usuario debe instalar Ollama y descargar el modelo (documentado como requisito en el README).
- La demo pública no genera contenido para visitantes sin Ollama.
- El proxy serverless (`api/ai.js` con validación y rate limiting) quedó sin consumidor y **se eliminó en el PR #11** (era la salida registrada como DT-004): mantener código muerto en producción pesa más que el valor de reserva. Los providers cloud permanecen como estrategias del factory, configurables por entorno para desarrollo.

## Nota operativa: uso desde el despliegue público (añadida el 2026-07-16)

Que la app esté servida desde Vercel no contradice el local-first: el navegador
del usuario ejecuta la SPA y llama a `http://localhost:11434` **en su propia
máquina**. Para que esa llamada funcione desde un origen HTTPS público hacen
falta dos condiciones, documentadas en el README:

1. **CORS en Ollama**: por defecto Ollama solo acepta orígenes locales. El
   usuario debe arrancarlo con `OLLAMA_ORIGINS` incluyendo el dominio público
   (p. ej. `OLLAMA_ORIGINS=https://<app>.vercel.app`).
2. **Contenido mixto**: Chrome, Edge y Firefox permiten que una página HTTPS
   llame a `http://localhost` (origen potencialmente confiable). Safari puede
   bloquearlo; en ese caso la alternativa es ejecutar la app en local
   (`npm run dev`), que queda documentada como vía soportada.

## Referencias

- `~/bigschool_master/extracted_text/Integracion De Apis Y Plataformas Ia Populares/` (rúbrica coste/privacidad/control)
- `~/bigschool_master/extracted_text/Modelos De Ia Locales/`
- [ADR-002](002-ollama-local-ai-provider.md), [ADR-003](003-localstorage-persistence.md)
