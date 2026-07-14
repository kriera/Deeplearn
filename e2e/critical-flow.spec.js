/**
 * E2E — Flujo crítico de DeepLearn (Playwright).
 *
 * Testing (Módulo 6): E2E solo para el flujo crítico de negocio, con el
 * modelo de IA mockeado vía page.route para que el test sea determinista
 * (no depende de un Ollama vivo) y selectores accesibles (getByRole/Label).
 */

import { test, expect } from '@playwright/test'

const OLLAMA_CHAT = 'http://localhost:11434/api/chat'

function quizQuestions(level = 1) {
  return [1, 2, 3, 4, 5].map((n) => ({
    id: `l${level}q${n}`,
    question: `Pregunta ${n} del nivel ${level}?`,
    options: [`Correcta ${n}`, `Distractor ${n}B`, `Distractor ${n}C`, `Distractor ${n}D`],
    correct_index: 0,
    explanation: `Porque la opción Correcta ${n} es la que describe el concepto.`,
  }))
}

function ollamaReply(json) {
  return {
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({ message: { content: JSON.stringify(json) } }),
  }
}

/** Mockea el endpoint de Ollama decidiendo la respuesta según el prompt. */
async function mockModel(page) {
  await page.route(OLLAMA_CHAT, async (route) => {
    const prompt = route.request().postDataJSON()?.messages?.at(-1)?.content ?? ''
    if (prompt.includes('SIMPLER re-explanation')) {
      await route.fulfill(
        ollamaReply({ explanation: 'Re-explicación más sencilla.', questions: quizQuestions() }),
      )
    } else if (prompt.includes('"questions"')) {
      await route.fulfill(ollamaReply({ questions: quizQuestions() }))
    } else {
      await route.fulfill(
        ollamaReply({
          level: 1,
          label: 'Elemental',
          explanation: 'La fotosíntesis explicada de forma elemental.',
        }),
      )
    }
  })
}

async function startLearningPath(page) {
  await page.goto('/')
  await page.getByLabel('¿Qué quieres aprender hoy?').fill('fotosíntesis')
  await page.getByRole('button', { name: /Generar ruta de aprendizaje/ }).click()
  await expect(page.getByText('Nivel 1 de 5 — Elemental')).toBeVisible({ timeout: 15000 })
}

test.describe('DeepLearn — Flujo crítico', () => {
  test('camino completo: concepto → nivel → quiz aprobado → nivel desbloqueado', async ({
    page,
  }) => {
    await mockModel(page)
    await startLearningPath(page)

    await expect(page.getByText('La fotosíntesis explicada de forma elemental.')).toBeVisible()
    await page.getByRole('button', { name: /Responder quiz/ }).click()

    await expect(page.getByText('Pregunta 1 de 5')).toBeVisible({ timeout: 10000 })
    for (let n = 1; n <= 5; n++) {
      await page.getByRole('button', { name: `Correcta ${n}`, exact: false }).click()
    }
    await page.getByRole('button', { name: 'Enviar respuestas' }).click()

    await expect(page.getByText('¡Nivel superado!')).toBeVisible({ timeout: 10000 })
    await expect(page.getByText('Has acertado 5/5')).toBeVisible()
  })

  test('camino de fallo: suspender el quiz permite reintentar', async ({ page }) => {
    await mockModel(page)
    await startLearningPath(page)
    await page.getByRole('button', { name: /Responder quiz/ }).click()

    await expect(page.getByText('Pregunta 1 de 5')).toBeVisible({ timeout: 10000 })
    for (let n = 1; n <= 5; n++) {
      await page.getByRole('button', { name: `Distractor ${n}B`, exact: false }).click()
    }
    await page.getByRole('button', { name: 'Enviar respuestas' }).click()

    await expect(page.getByText('¡Sigue intentando!')).toBeVisible({ timeout: 10000 })
    await page.getByRole('button', { name: 'Intentar de nuevo' }).click()
    await expect(page.getByText('Pregunta 1 de 5')).toBeVisible()
  })

  test('navegación: volver al inicio desde el nivel', async ({ page }) => {
    await mockModel(page)
    await startLearningPath(page)

    await page.getByRole('button', { name: 'Volver a inicio' }).click()
    await expect(page.getByLabel('¿Qué quieres aprender hoy?')).toBeVisible()
  })

  test('estado de error: sin modelo disponible se ofrece reintento', async ({ page }) => {
    await page.route(OLLAMA_CHAT, (route) => route.abort('connectionrefused'))
    await page.goto('/')
    await page.getByLabel('¿Qué quieres aprender hoy?').fill('fotosíntesis')
    await page.getByRole('button', { name: /Generar ruta de aprendizaje/ }).click()

    await expect(page.getByText('No pudimos generar esta explicación.')).toBeVisible({
      timeout: 15000,
    })

    // Al reintentar con el modelo ya disponible, la explicación se genera
    await page.unroute(OLLAMA_CHAT)
    await mockModel(page)
    await page.getByRole('button', { name: 'Reintentar generación' }).click()
    await expect(page.getByText('La fotosíntesis explicada de forma elemental.')).toBeVisible({
      timeout: 10000,
    })
  })
})
