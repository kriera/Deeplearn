/**
 * demoData — Sesión de ejemplo con contenido REAL generado por Ollama
 * (gpt-oss:120b-cloud). Permite explorar la app desplegada SIN Ollama instalado
 * (modo demo, ADR-005): los 5 niveles ya están generados y desbloqueados, así que
 * la navegación no dispara ninguna llamada al modelo.
 *
 * Base auto-generada con scripts/gen-demo y CURADA A MANO: el modelo colocaba mal
 * `correct_index` en varias preguntas (contradecía su propia `explanation`), así que
 * los índices se revisaron y corrigieron manualmente. Si regeneras con `npm run
 * gen:demo`, vuelve a revisar cada correct_index antes de dar por buena la salida.
 */

export const DEMO_SESSION = {
  id: 'demo-fotosintesis',
  concept: 'la fotosíntesis',
  normalizedConcept: 'la fotosíntesis',
  createdAt: '2026-07-15T10:00:00.000Z',
  levelsUnlocked: 5,
  currentLevelIndex: 0,
  levels: [
    {
      number: 1,
      status: 'ready',
      explanation:
        'Las plantas son como cocineras pequeñas que hacen su propia comida. Usan la luz del sol como una estufa caliente. También toman agua del suelo con sus raíces. Y respiran aire, agarrando el gas llamado dióxido de carbono. Con esa luz, agua y aire, fabrican azúcar, su comida. Esa azúcar les da energía para crecer y hacer hojas verdes. Cada vez que hacen esto, sueltan oxígeno al aire. El oxígeno es lo que nosotros respiramos para vivir. Así, las plantas comen luz y nos dan aire limpio.',
      questions: [
        {
          id: 'l1q1',
          question:
            '¿Qué utiliza la planta como si fuera una estufa caliente para cocinar su comida?',
          options: ['El aire alrededor', 'El agua del suelo', 'La luz del sol', 'El viento'],
          correct_index: 2,
          explanation:
            'La luz del sol actúa como la estufa que calienta la preparación; el agua es un ingrediente, no la fuente de calor, y el aire y el viento no cumplen esa función.',
        },
        {
          id: 'l1q2',
          question:
            'Si una planta no pudiera tomar agua del suelo, ¿qué pasaría con su comida hecha de luz?',
          options: [
            'No podría crear azúcar porque le falta un ingrediente',
            'Producirá más oxígeno',
            'Seguiría haciendo azúcar igual',
            'Cambiará de color a rojo',
          ],
          correct_index: 0,
          explanation:
            'El agua es uno de los tres componentes necesarios; sin ella la planta no puede formar azúcar. Las otras opciones no tienen base en la explicación.',
        },
        {
          id: 'l1q3',
          question: '¿Cuál es la analogía que mejor describe a la planta según el texto?',
          options: [
            'Una pequeña fábrica que produce ropa',
            'Un conductor que lleva pasajeros',
            'Una cocinera que prepara su propia comida',
            'Un guardia que protege la casa',
          ],
          correct_index: 2,
          explanation:
            'El texto compara a la planta con una cocinera que hace su comida; las demás analogías no aparecen ni se relacionan con la función descrita.',
        },
        {
          id: 'l1q4',
          question: '¿Qué ocurre con el oxígeno cuando la planta prepara su azúcar?',
          options: [
            'Lo guarda dentro de sus hojas',
            'Lo usa para crecer raíces',
            'Lo transforma en agua',
            'Lo libera al aire para que lo respiramos',
          ],
          correct_index: 3,
          explanation:
            'Al producir azúcar, la planta suelta oxígeno al aire, que es lo que respiramos; no lo guarda, transforma ni usa para raíces según la explicación.',
        },
        {
          id: 'l1q5',
          question:
            '¿Cuál de las siguientes ideas es un error sobre cómo las plantas hacen su comida?',
          options: [
            'Usan sus raíces para absorber agua del suelo',
            'Liberan oxígeno después de cocinar su azúcar',
            'Comen frutas que encuentran en el suelo',
            'Necesitan luz, agua y aire para crear azúcar',
          ],
          correct_index: 2,
          explanation:
            'Las plantas no comen frutas; obtienen sus ingredientes del sol, agua y aire. Las otras opciones describen correctamente procesos mencionados.',
        },
      ],
      generationError: null,
    },
    {
      number: 2,
      status: 'ready',
      explanation:
        'La fotosíntesis es el proceso que usan las plantas para convertir la luz del sol en energía química. En ella, el pigmento llamado clorofila (una sustancia verde que absorbe luz) captura fotones (partículas de luz) y los usa para transformar dióxido de carbono del aire y agua del suelo en glucosa, un azúcar que la planta usa como alimento, y oxígeno, que se libera al ambiente. Un ejemplo concreto es una hoja de árbol en un día soleado: la hoja toma luz, absorbe CO₂ y succiona agua por las raíces, y luego produce azúcar que alimenta el árbol y libera oxígeno que respiramos. Este proceso es la base de la cadena alimentaria y explica por qué las plantas son productores en los ecosistemas.',
      questions: [
        {
          id: 'l2q1',
          question: '¿Cuál es la función principal de la clorofila en la fotosíntesis?',
          options: [
            'Almacenar glucosa dentro de la hoja',
            'Descomponer el dióxido de carbono en nitrógeno',
            'Transformar agua en oxígeno directamente',
            'Capturar fotones de la luz solar',
          ],
          correct_index: 3,
          explanation:
            'La clorofila actúa como pigmento que absorbe luz y captura fotones; no convierte agua ni almacena glucosa, y no descompone CO₂ en nitrógeno.',
        },
        {
          id: 'l2q2',
          question:
            'Si una planta no recibe suficiente luz, ¿qué consecuencia directa tiene sobre la producción de glucosa?',
          options: [
            'Se transforma el dióxido de carbono en nitrógeno',
            'Aumenta la cantidad de oxígeno liberado',
            'Se mantiene igual porque el agua aporta la energía',
            'Disminuye la cantidad de glucosa formada',
          ],
          correct_index: 3,
          explanation:
            'Menos luz significa menos fotones capturados, lo que reduce la energía disponible para crear glucosa; el oxígeno no aumenta y el agua no sustituye la energía luminosa.',
        },
        {
          id: 'l2q3',
          question:
            'Una analogía: la fotosíntesis es a una planta lo que la cocina es a una persona. ¿Qué elemento de la analogía corresponde al dióxido de carbono?',
          options: [
            'El chef que controla el proceso',
            'El fuego que calienta la olla',
            'Los ingredientes que la planta necesita',
            'El vapor que sale al final',
          ],
          correct_index: 2,
          explanation:
            'El dióxido de carbono actúa como un ingrediente esencial que la planta incorpora, similar a los ingredientes en una receta; no es la fuente de calor, el chef ni el vapor.',
        },
        {
          id: 'l2q4',
          question:
            '¿Qué ocurre con el oxígeno producido durante la fotosíntesis en una hoja de árbol bajo el sol?',
          options: [
            'Se almacena como azúcar dentro del tronco',
            'Se libera al ambiente para que lo respiren los seres vivos',
            'Se usa para absorber más luz solar',
            'Se convierte en dióxido de carbono dentro de la hoja',
          ],
          correct_index: 1,
          explanation:
            'El oxígeno generado se libera al aire, contribuyendo a la respiración de otros organismos; no se transforma en CO₂, ni se almacena como azúcar, ni sirve para captar más luz.',
        },
        {
          id: 'l2q5',
          question: '¿Cuál de las siguientes afirmaciones es un error común sobre la fotosíntesis?',
          options: [
            'Las plantas convierten luz solar en energía química',
            'La fotosíntesis produce glucosa y oxígeno a partir de agua y dióxido de carbono',
            'Las plantas obtienen energía directamente del oxígeno que liberan',
            'El proceso depende de clorofila para absorber luz',
          ],
          correct_index: 2,
          explanation:
            'Es incorrecto decir que las plantas obtienen energía del oxígeno que liberan; la energía proviene de la luz solar transformada en glucosa, mientras que las otras opciones describen correctamente el proceso.',
        },
      ],
      generationError: null,
    },
    {
      number: 3,
      status: 'ready',
      explanation:
        'La fotosíntesis es el proceso bioquímico mediante el cual las células vegetales, algas y cianobacterias convierten energía lumínica en energía química, almacenada en glucosa. Ocurre principalmente en los cloroplastos, donde el pigmento clorofila absorbe fotones y excita electrones que atraviesan la cadena de transporte de electrones, generando ATP y NADPH en la fase luminosa. En la fase oscura o ciclo de Calvin, el ATP y el NADPH se utilizan para fijar CO₂, formando un azúcar de seis carbonos. A diferencia de la respiración celular, que libera energía al oxidar glucosa, la fotosíntesis invierte energía para sintetizarla. Tres hechos verificables son: 1) la relación 6 CO₂ + 6 H₂O → C₆H₁₂O₆ + 6 O₂; 2) la máxima eficiencia fotoquímica se alcanza bajo luz roja; 3) la liberación de oxígeno proviene de la fotólisis del agua.',
      questions: [
        {
          id: 'l3q1',
          question:
            '¿Cuál es la ecuación global que representa la fotosíntesis según la explicación proporcionada?',
          options: [
            'CO₂ + H₂O → C₆H₁₂O₆ + O₂',
            '6 CO₂ + 6 H₂O → C₆H₁₂O₆ + 6 O₂',
            'C₆H₁₂O₆ + 6 O₂ → 6 CO₂ + 6 H₂O',
            '6 O₂ + 6 H₂O → C₆H₁₂O₆ + 6 CO₂',
          ],
          correct_index: 1,
          explanation:
            'La ecuación mostrada corresponde al hecho verificable número 1; la opción incorrecta que incluye O₂ como reactivo invierte la dirección del proceso.',
        },
        {
          id: 'l3q2',
          question:
            '¿Qué ocurre cuando la luz roja incide sobre los cloroplastos en condiciones óptimas?',
          options: [
            'Se alcanza la mayor eficiencia fotoquímica posible.',
            'Se libera oxígeno a partir del dióxido de carbono.',
            'Se produce una disminución del ATP generado.',
            'Se detiene la fase oscura del ciclo de Calvin.',
          ],
          correct_index: 0,
          explanation:
            'El punto 2 indica que la luz roja maximiza la eficiencia fotoquímica; la opción que menciona detención del ciclo de Calvin no está respaldada por la explicación.',
        },
        {
          id: 'l3q3',
          question:
            'Si se bloqueara la fotólisis del agua, ¿cuál sería el efecto inmediato en la fotosíntesis?',
          options: [
            'Aumento de la producción de glucosa.',
            'Reducción del número de fotones absorbidos por la clorofila.',
            'Disminución de la liberación de oxígeno.',
            'Incremento de la absorción de CO₂ en la fase luminosa.',
          ],
          correct_index: 2,
          explanation:
            'El hecho 3 señala que el oxígeno proviene de la fotólisis del agua; al bloquearla, la liberación de O₂ se reduce, mientras que las otras opciones no describen un efecto directo.',
        },
        {
          id: 'l3q4',
          question:
            '¿En qué se diferencia fundamentalmente la fotosíntesis de la respiración celular según la descripción?',
          options: [
            'La fotosíntesis ocurre solo en animales, la respiración solo en plantas.',
            'La fotosíntesis no produce ATP, la respiración sí lo hace.',
            'La fotosíntesis almacena energía, mientras que la respiración la libera.',
            'La fotosíntesis utiliza CO₂ como energía, la respiración usa O₂.',
          ],
          correct_index: 2,
          explanation:
            'El texto dice que la fotosíntesis invierte energía para sintetizar glucosa, a diferencia de la respiración que libera energía; la respuesta correcta refleja esa inversión, mientras que la opción sobre CO₂ como energía es incorrecta.',
        },
        {
          id: 'l3q5',
          question: 'Una analogía adecuada para describir la fase luminosa sería:',
          options: [
            'Un depósito que guarda oxígeno sin producirlo.',
            'Una central eléctrica que convierte luz en energía química.',
            'Un motor que quema combustible para producir calor.',
            'Una fábrica que descompone glucosa para obtener energía.',
          ],
          correct_index: 1,
          explanation:
            'La fase luminosa transforma energía lumínica en ATP y NADPH, similar a una central eléctrica que genera energía; la opción sobre descomposición corresponde a la respiración, no a la fotosíntesis.',
        },
      ],
      generationError: null,
    },
    {
      number: 4,
      status: 'ready',
      explanation:
        'La fotosíntesis es un proceso quimio‑fotosintético que acopla la captura de fotones por los fotosistemas I y II del fotosistema clorofílico con la transferencia de electrones a través de la cadena de transporte de electrones, generando un gradiente de protones que impulsa la síntesis de ATP mediante ATP sintasa. Simultáneamente, el NADP+ se reduce a NADPH en el fotosistema I, suministrando poder reductor para la fijación del CO₂ mediante la ruta C3 (ciclo de Calvin-Benson) y, en condiciones de alta temperatura, la ruta C4 o CAM que minimizan la foto‑respiración. Limitaciones críticas incluyen la fotoinhibición bajo luz intensa, la disponibilidad limitada de CO₂ y la vulnerabilidad del complejo fotosintético a herbicidas que bloquean el sitio Q_B. En la agricultura, la pérdida de eficiencia fotosintética por estrés hídrico es una causa principal de rendimiento subóptimo.',
      questions: [
        {
          id: 'l4q1',
          question:
            '¿Cuál es la función principal del gradiente de protones generado durante la fotosíntesis?',
          options: [
            'Impulsar la síntesis de ATP mediante la ATP sintasa',
            'Reducir NADP+ a NADPH en el fotosistema I',
            'Capturar fotones en los fotosistemas I y II',
            'Bloquear el sitio Q_B para prevenir la fotoinhibición',
          ],
          correct_index: 0,
          explanation:
            'El gradiente de protones se utiliza por la ATP sintasa para producir ATP; la opción distractora sobre la reducción de NADP+ corresponde a otro proceso, no al gradiente.',
        },
        {
          id: 'l4q2',
          question:
            'Si una planta está expuesta a luz muy intensa, ¿qué efecto directo se espera según la explicación?',
          options: [
            'Mejora de la disponibilidad de CO₂',
            'Reducción de la vulnerabilidad a herbicidas',
            'Aumento de la tasa de fotoinhibición',
            'Incremento de la eficiencia de la ruta C4',
          ],
          correct_index: 2,
          explanation:
            'La explicación indica que la luz intensa provoca fotoinhibición; la opción sobre incremento de CO₂ es incorrecta porque la disponibilidad de CO₂ no depende de la intensidad lumínica.',
        },
        {
          id: 'l4q3',
          question:
            'Comparar la ruta C4 con la ruta C3 en términos de foto‑respiración es más parecido a:',
          options: [
            'Ajustar la velocidad de un motor para evitar sobrecalentamiento en climas cálidos',
            'Instalar paneles solares en una zona con poca luz solar',
            'Cambiar de una lámpara incandescente a una LED para ahorrar energía',
            'Usar un filtro de aire en días de alta temperatura para reducir la entrada de contaminantes',
          ],
          correct_index: 2,
          explanation:
            'Al igual que cambiar a LED reduce pérdida de energía, la ruta C4 minimiza la foto‑respiración bajo altas temperaturas; la opción de filtro de aire es una analogía menos directa.',
        },
        {
          id: 'l4q4',
          question:
            '¿Qué ocurriría si un herbicida bloquea el sitio Q_B del complejo fotosintético?',
          options: [
            'Se interrumpiría la cadena de transporte de electrones, disminuyendo la generación de ATP',
            'Se potenciaría la ruta CAM en condiciones de sequía',
            'Se aumentaría la captación de fotones por los fotosistemas I y II',
            'Se favorecería la reducción de NADP+ a NADPH',
          ],
          correct_index: 0,
          explanation:
            'Bloquear Q_B detiene el flujo de electrones, reduciendo la producción de ATP; la opción sobre aumento de captura de fotones no está relacionada con el bloqueo de Q_B.',
        },
        {
          id: 'l4q5',
          question:
            'Una creencia errónea es que la pérdida de eficiencia fotosintética bajo estrés hídrico se debe principalmente a:',
          options: [
            'Inhibición de la ruta C3 por temperatura alta',
            'Bloqueo del sitio Q_B por herbicidas',
            'Reducción de la disponibilidad de CO₂ en los estomas cerrados',
            'Daño directo al fotosistema I por exceso de luz',
          ],
          correct_index: 3,
          explanation:
            'La creencia errónea es atribuir la caída de eficiencia a un daño directo al fotosistema I por exceso de luz (eso es fotoinhibición, no estrés hídrico); en realidad el estrés hídrico cierra los estomas y reduce la disponibilidad de CO₂.',
        },
      ],
      generationError: null,
    },
    {
      number: 5,
      status: 'ready',
      explanation:
        'La fotosíntesis acoplada a la cadena de transporte de electrones en los fotosistemas I y II transforma la energía fotónica en un gradiente electroquímico que impulsa la síntesis de ATP y la reducción de NADP⁺ a NADPH, con una eficiencia cuántica media de 0.85 mol e⁻ mol⁻¹ fotón. Las preguntas abiertas incluyen la arquitectura exacta del complejo de oxígeno‑evolución (OEC) bajo condiciones fisiológicas, la naturaleza de los estados excitónicos de los pigmentos de antena en ambientes de alta densidad y la integración de rutas de captura de luz suplementarias como la fotoprotección zeaxantina‑violaxantina. Los debates giran entre modelos estáticos de estructura del OEC y dinámicas basadas en redes de agua; también se discute si la fotosíntesis artificial debe imitar la arquitectura de los fotosistemas o emplear catalizadores moleculares de bajo coste. El estado del arte combina crio‑EM de 1.9 Å, espectroscopía de 2D‑IR y simulaciones cuánticas de 30 ps, pero la correlación directa entre dinámica estructural y eficiencia fotoquímica sigue sin resolverse.',
      questions: [
        {
          id: 'l5q1',
          question:
            '¿Cuál es la eficiencia cuántica promedio de transferencia de electrones por fotón en la fotosíntesis acoplada a los fotosistemas I y II?',
          options: [
            '1,00 mol e⁻ por mol fotón',
            '0,65 mol e⁻ por mol fotón',
            '0,75 mol e⁻ por mol fotón',
            '0,85 mol e⁻ por mol fotón',
          ],
          correct_index: 3,
          explanation:
            'El texto indica una eficiencia cuántica media de 0,85 mol e⁻ mol⁻¹ fotón; la opción 0,75 es cercana y puede parecer correcta, pero no coincide con el valor especificado.',
        },
        {
          id: 'l5q2',
          question:
            '¿Qué debate se mantiene respecto a la arquitectura del complejo de evolución del oxígeno (OEC) bajo condiciones fisiológicas?',
          options: [
            'Si la vía de electrones pasa por el fotosistema I antes del II',
            'Si su función depende de la luz azul o de la luz roja',
            'Si su estructura es estática o si involucra dinámicas mediadas por redes de agua',
            'Si está formado por proteínas de membrana o por ácidos nucleicos',
          ],
          correct_index: 2,
          explanation:
            'El extracto menciona una controversia entre modelos estáticos y dinámicas basadas en redes de agua; las demás opciones introducen conceptos no discutidos en la explicación.',
        },
        {
          id: 'l5q3',
          question:
            'Una analogía: si la fotoprotección zeaxantina‑violaxantina actuara como un "paraguas" para la luz excesiva, ¿qué aspecto del debate sobre fotosíntesis artificial estaría más directamente influenciado?',
          options: [
            'La elección del tipo de fuente de energía eléctrica en dispositivos fotovoltaicos',
            'La decisión de imitar la arquitectura completa de los fotosistemas o usar catalizadores más simples',
            'La necesidad de incluir pigmentos de clorofila en los materiales sintéticos',
            'La longitud de onda óptima para la excitación de electrones',
          ],
          correct_index: 1,
          explanation:
            'La analogía se refiere a la función protectora de la zeaxantina‑violaxantina, que es parte del debate sobre si la foto‑síntesis artificial debe reproducir los sistemas naturales o simplificarse; las otras opciones se alejan del tema central.',
        },
        {
          id: 'l5q4',
          question:
            'Si se descubriera que la dinámica estructural del OEC se correlaciona directamente con la eficiencia fotoquímica, ¿Cuál de los siguientes métodos se volvería crítico para validar esa relación?',
          options: [
            'Microscopía de fluorescencia convencional',
            'Espectroscopía 2D‑IR combinada con simulaciones cuánticas de corto plazo',
            'Cromatografía líquida de alta presión',
            'Cristalografía de rayos X a 3 Å',
          ],
          correct_index: 1,
          explanation:
            'El texto señala que la correlación entre dinámica estructural y eficiencia aún no está resuelta y menciona 2D‑IR y simulaciones cuánticas como herramientas avanzadas; la opción de espectroscopía 2D‑IR es la que mejor se alinea con validar dinámicas, mientras que la cromatografía no es relevante.',
        },
        {
          id: 'l5q5',
          question:
            '¿Cuál de las siguientes afirmaciones es una concepción errónea sobre los modos de captura de luz suplementarios mencionados?',
          options: [
            'Los pigmentos de antena pueden formar estados excitónicos en entornos de alta densidad',
            'La reducción de NADP⁺ a NADPH depende del flujo de electrones desde el fotosistema II',
            'La cadena de transporte de electrones está acoplada a la generación de un gradiente electroquímico',
            'La fotoprotección zeaxantina‑violaxantina sólo actúa bajo condiciones de alta intensidad lumínica',
          ],
          correct_index: 3,
          explanation:
            'El texto indica que la fotoprotección zeaxantina‑violaxantina es una ruta de captura de luz suplementaria, sin limitarla exclusivamente a alta intensidad; las otras opciones describen procesos que sí aparecen en la explicación.',
        },
      ],
      generationError: null,
    },
  ],
  attempts: [],
  evaluation: {
    preScore: null,
    postScore: null,
    feedback: '',
    startedAt: '2026-07-15T10:00:00.000Z',
    completedAt: null,
  },
}

export const DEMO_CARDS = [
  {
    id: 'demo-fotosintesis-l1c1',
    concept: 'la fotosíntesis',
    levelLabel: 'Elemental',
    front: '¿Qué hacen las plantas con la luz del sol?',
    back: 'Las plantas usan la luz del sol para crear su comida, como si fuera una cocina mágica.',
    interval: 1,
    ease: 2.5,
    nextReview: '2026-07-15T10:00:00.000Z',
    createdAt: '2026-07-15T10:00:00.000Z',
    lastReviewed: null,
    reviews: 0,
    remembered: 0,
    forgotten: 0,
  },
  {
    id: 'demo-fotosintesis-l1c2',
    concept: 'la fotosíntesis',
    levelLabel: 'Elemental',
    front: '¿De qué tres cosas necesitan las plantas para la fotosíntesis?',
    back: 'Necesitan luz del sol, agua y aire (que contiene dióxido de carbono).',
    interval: 1,
    ease: 2.5,
    nextReview: '2026-07-15T10:00:00.000Z',
    createdAt: '2026-07-15T10:00:00.000Z',
    lastReviewed: null,
    reviews: 0,
    remembered: 0,
    forgotten: 0,
  },
  {
    id: 'demo-fotosintesis-l1c3',
    concept: 'la fotosíntesis',
    levelLabel: 'Elemental',
    front: '¿Qué liberan las plantas al hacer fotosíntesis?',
    back: 'Liberan oxígeno al aire, que respiramos los animales y los humanos.',
    interval: 1,
    ease: 2.5,
    nextReview: '2026-07-15T10:00:00.000Z',
    createdAt: '2026-07-15T10:00:00.000Z',
    lastReviewed: null,
    reviews: 0,
    remembered: 0,
    forgotten: 0,
  },
  {
    id: 'demo-fotosintesis-l1c4',
    concept: 'la fotosíntesis',
    levelLabel: 'Elemental',
    front: '¿Dónde ocurre la fotosíntesis en la planta?',
    back: 'Sucede en las hojas, dentro de pequeñas partes verdes llamadas cloroplastos.',
    interval: 1,
    ease: 2.5,
    nextReview: '2026-07-15T10:00:00.000Z',
    createdAt: '2026-07-15T10:00:00.000Z',
    lastReviewed: null,
    reviews: 0,
    remembered: 0,
    forgotten: 0,
  },
  {
    id: 'demo-fotosintesis-l1c5',
    concept: 'la fotosíntesis',
    levelLabel: 'Elemental',
    front: '¿Por qué la fotosíntesis es importante para la vida?',
    back: 'Porque crea comida para la planta y oxígeno para que nosotros podamos respirar.',
    interval: 1,
    ease: 2.5,
    nextReview: '2026-07-15T10:00:00.000Z',
    createdAt: '2026-07-15T10:00:00.000Z',
    lastReviewed: null,
    reviews: 0,
    remembered: 0,
    forgotten: 0,
  },
]
