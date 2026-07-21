/**
 * demoDataAstronomia — Segunda sesión de ejemplo del modo demo (ADR-005).
 *
 * Contenido de "la astronomía" en 5 niveles (Elemental → Experto) con quizzes y
 * tarjetas SRS, para explorar la app desplegada SIN Ollama. Los 5 niveles ya están
 * generados y desbloqueados, así que la navegación no dispara ninguna llamada al
 * modelo.
 *
 * Generado en paralelo (un agente por nivel siguiendo el contrato de Level.js) y
 * CURADO A MANO: se verificó que cada `correct_index` coincide con su `explanation`
 * y que los datos (leyes de Kepler, año luz/pársec, ley de Hubble, JWST…) son
 * factualmente correctos. Mantén esa revisión si regeneras el contenido.
 */

export const DEMO_SESSION = {
  id: 'demo-astronomia',
  concept: 'la astronomía',
  normalizedConcept: 'la astronomía',
  createdAt: '2026-07-15T10:00:00.000Z',
  levelsUnlocked: 5,
  currentLevelIndex: 0,
  levels: [
    {
      number: 1,
      status: 'ready',
      explanation:
        'La astronomía es mirar el cielo para conocer las cosas que brillan allá arriba. Por la noche vemos la luna y muchas estrellas pequeñas. De día vemos el sol, que es grande y calienta. Es como cuando abres una caja de juguetes y miras cada uno con cuidado. El cielo es esa caja enorme. Las estrellas y la luna son los juguetes que hay dentro. Nosotros los miramos, los contamos y aprendemos sus nombres. Mirar el cielo con curiosidad y ganas de saber, eso es la astronomía. ¡Y es muy divertido!',
      questions: [
        {
          id: 'l1q1',
          question: '¿Qué hacemos cuando hacemos astronomía?',
          options: [
            'Miramos el cielo y las cosas que brillan',
            'Comemos galletas en casa',
            'Dormimos toda la mañana',
            'Pintamos las paredes',
          ],
          correct_index: 0,
          explanation:
            'La astronomía es mirar el cielo y las cosas que brillan; las otras cosas no son mirar el cielo.',
        },
        {
          id: 'l1q2',
          question: 'En el cuento, el cielo es como una caja grande. ¿De qué es la caja?',
          options: ['De ropa', 'De juguetes', 'De zapatos', 'De comida'],
          correct_index: 1,
          explanation:
            'Dijimos que el cielo es como una caja de juguetes enorme; las estrellas son los juguetes de dentro.',
        },
        {
          id: 'l1q3',
          question: '¿Qué vemos en el cielo por la noche?',
          options: [
            'El sol muy fuerte',
            'La luna y muchas estrellas',
            'Nada de nada',
            'Muchos coches',
          ],
          correct_index: 1,
          explanation: 'Por la noche vemos la luna y muchas estrellas; el sol lo vemos de día.',
        },
        {
          id: 'l1q4',
          question: 'Si nunca miramos el cielo, ¿qué pasaría?',
          options: [
            'No conoceríamos las estrellas ni la luna',
            'Las estrellas se caerían',
            'El sol se apagaría',
            'La caja se rompería',
          ],
          correct_index: 0,
          explanation:
            'Si no miramos, no aprendemos sus nombres ni los conocemos; las estrellas y el sol siguen igual.',
        },
        {
          id: 'l1q5',
          question: '¿Cuál de estas frases es FALSA?',
          options: [
            'El sol es grande y calienta',
            'Por la noche vemos estrellas',
            'La astronomía es mirar el cielo',
            'El sol solo sale por la noche',
          ],
          correct_index: 3,
          explanation:
            'Es falsa porque el sol lo vemos de día, no de noche; las otras tres frases son verdaderas.',
        },
      ],
      generationError: null,
    },
    {
      number: 2,
      status: 'ready',
      explanation:
        'La astronomía es la ciencia que estudia los astros: las estrellas, los planetas y todo lo que existe en el espacio. Uno de sus conceptos clave es la órbita, que es el camino curvo que un objeto recorre alrededor de otro por efecto de la gravedad, la misma fuerza que en clase de Física hace que una pelota caiga al suelo. La Tierra, por ejemplo, sigue una órbita alrededor del Sol y tarda un año en completarla; por eso existen las estaciones. Para medir las enormes distancias del espacio, los astrónomos usan el año luz, que es la distancia que recorre la luz en un año, unos 9,46 billones de kilómetros. La estrella más cercana al Sol está a poco más de 4 años luz.',
      questions: [
        {
          id: 'l2q1',
          question: '¿Qué estudia la astronomía?',
          options: [
            'Solo los volcanes de la Tierra',
            'Los astros, como estrellas y planetas, y lo que existe en el espacio',
            'Únicamente el clima y las nubes',
            'Las plantas y los animales del mar',
          ],
          correct_index: 1,
          explanation:
            'La astronomía estudia los astros y el espacio; los volcanes, el clima y los seres vivos son objeto de otras ciencias como la geología o la biología.',
        },
        {
          id: 'l2q2',
          question: 'Según el texto, ¿qué es una órbita?',
          options: [
            'El camino curvo que un objeto recorre alrededor de otro por la gravedad',
            'Una estrella muy grande y caliente',
            'La distancia que recorre la luz en un año',
            'Un instrumento para mirar el cielo',
          ],
          correct_index: 0,
          explanation:
            'La órbita es el recorrido curvo de un objeto alrededor de otro debido a la gravedad; la distancia que recorre la luz en un año es el año luz, no una órbita.',
        },
        {
          id: 'l2q3',
          question:
            'En el ejemplo del texto, ¿cuánto tarda la Tierra en completar una órbita alrededor del Sol?',
          options: ['Un día', 'Un mes', 'Un año', 'Cuatro años'],
          correct_index: 2,
          explanation:
            'La Tierra tarda un año en dar una vuelta al Sol, y por eso existen las estaciones; un día es lo que tarda en girar sobre sí misma.',
        },
        {
          id: 'l2q4',
          question:
            '¿Qué pasaría si mides la distancia a una estrella lejana en kilómetros en lugar de en años luz?',
          options: [
            'Obtendrías un número muchísimo más grande e incómodo de manejar',
            'La distancia sería más corta',
            'La estrella se movería más deprisa',
            'No podrías medirla de ninguna forma',
          ],
          correct_index: 0,
          explanation:
            'El año luz existe precisamente para no manejar cifras enormes: un solo año luz son unos 9,46 billones de kilómetros, así que en kilómetros el número sería gigantesco, aunque la distancia real es la misma.',
        },
        {
          id: 'l2q5',
          question: '¿Cuál de estas afirmaciones es FALSA?',
          options: [
            'Un año luz es una distancia, no un tiempo',
            'La órbita se debe a la gravedad',
            'La estrella más cercana al Sol está a poco más de 4 años luz',
            'El año luz es el tiempo que tarda la Tierra en girar sobre sí misma',
          ],
          correct_index: 3,
          explanation:
            'La afirmación falsa es la última: el año luz mide una distancia (la que recorre la luz en un año), no el giro de la Tierra sobre sí misma, que dura un día; las otras tres son correctas.',
        },
      ],
      generationError: null,
    },
    {
      number: 3,
      status: 'ready',
      explanation:
        'La astronomía es la ciencia que estudia los cuerpos celestes aplicando las leyes de la física. El mecanismo formal que gobierna las órbitas es la gravitación universal de Newton, sintetizada antes por las tres leyes de Kepler: las órbitas son elipses con el Sol en uno de los focos (1ª); el radio vector barre áreas iguales en tiempos iguales, de modo que un planeta se mueve más rápido en el perihelio que en el afelio (2ª); y el cuadrado del período orbital es proporcional al cubo del semieje mayor (T²∝a³, 3ª). Conviene distinguir la astronomía de la astrología: la primera es una disciplina científica basada en observación y modelos contrastables, mientras que la segunda carece de fundamento empírico. Para medir distancias se usan unidades como el año luz (distancia que recorre la luz en un año) o el pársec (≈3,26 años luz), reservando la unidad astronómica para las distancias dentro del Sistema Solar.',
      questions: [
        {
          id: 'l3q1',
          question:
            'Según la tercera ley de Kepler, ¿qué relación existe entre el período orbital (T) y el semieje mayor (a) de una órbita?',
          options: [
            'T² es proporcional a a³',
            'T es proporcional a a',
            'T³ es proporcional a a²',
            'T² es proporcional a a',
          ],
          correct_index: 0,
          explanation:
            'La tercera ley establece que T²∝a³. Las demás invierten los exponentes o proponen una proporcionalidad lineal que no corresponde a la ley.',
        },
        {
          id: 'l3q2',
          question:
            'De acuerdo con la segunda ley de Kepler, ¿en qué punto de su órbita se mueve un planeta con mayor velocidad?',
          options: [
            'En el afelio, el punto más alejado del Sol',
            'En el perihelio, el punto más cercano al Sol',
            'A velocidad constante en toda la órbita',
            'En los dos focos de la elipse por igual',
          ],
          correct_index: 1,
          explanation:
            'Como el radio vector barre áreas iguales en tiempos iguales, el planeta acelera al acercarse al Sol, alcanzando su máxima velocidad en el perihelio; en el afelio va más lento y la velocidad nunca es constante.',
        },
        {
          id: 'l3q3',
          question: '¿Cuál es la diferencia fundamental entre astronomía y astrología?',
          options: [
            'La astronomía estudia solo estrellas y la astrología solo planetas',
            'Ambas son ciencias, pero usan telescopios distintos',
            'La astronomía es una ciencia basada en modelos contrastables y la astrología carece de fundamento empírico',
            'La astronomía es antigua y la astrología es moderna',
          ],
          correct_index: 2,
          explanation:
            'La distinción clave es epistemológica: la astronomía es una disciplina científica con modelos contrastables, mientras que la astrología no tiene base empírica. Las otras opciones describen diferencias inexistentes o triviales.',
        },
        {
          id: 'l3q4',
          question:
            'Si un exoplaneta orbita su estrella con un semieje mayor cuatro veces mayor que el de la Tierra alrededor del Sol (a=4 UA, misma masa estelar), ¿cómo cambia su período orbital respecto al terrestre?',
          options: ['Es 4 veces mayor', 'Es 8 veces mayor', 'Es 16 veces mayor', 'Es el mismo'],
          correct_index: 1,
          explanation:
            'Por T²∝a³, con a=4 se tiene T²=64, luego T=8. Un período 4 o 16 veces mayor confundiría la relación con a o con a³, y no puede permanecer igual al aumentar la distancia.',
        },
        {
          id: 'l3q5',
          question:
            '¿Cuál de las siguientes afirmaciones sobre las unidades de distancia astronómicas es FALSA?',
          options: [
            'Un año luz es la distancia que recorre la luz en un año',
            'Un pársec equivale aproximadamente a 3,26 años luz',
            'El año luz es una unidad de tiempo, no de distancia',
            'La unidad astronómica se emplea para distancias dentro del Sistema Solar',
          ],
          correct_index: 2,
          explanation:
            'La afirmación falsa es que el año luz mida tiempo: pese a su nombre, es una unidad de distancia. Las otras tres son correctas: el pársec ≈3,26 años luz y la UA se usa a escala del Sistema Solar.',
        },
      ],
      generationError: null,
    },
    {
      number: 4,
      status: 'ready',
      explanation:
        'La escala de distancias cósmicas se construye por peldaños encadenados: la paralaje trigonométrica calibra geométricamente las Cefeidas mediante la relación período-luminosidad de Leavitt, y estas a su vez anclan las supernovas de tipo Ia, usadas como candelas estándar tras corregir la relación de Phillips (anchura-luminosidad). Cada peldaño propaga su error al siguiente, y una mala calibración del punto cero se arrastra hasta H0. Al medir luminosidades hay que corregir la extinción interestelar, que enrojece y atenúa el flujo, degenerando con la distancia si no se modela la ley de extinción. Un modo de fallo clásico es el sesgo de Malmquist: en muestras limitadas por flujo solo detectamos los objetos intrínsecamente más luminosos a gran distancia, sesgando al alza la luminosidad media y falseando calibraciones. La tensión de Hubble (escala de distancias ~73 frente a CMB ~67 km/s/Mpc) ilustra cómo los errores sistemáticos residuales, no estadísticos, dominan hoy la cosmología de precisión.',
      questions: [
        {
          id: 'l4q1',
          question:
            '¿Qué propiedad física fundamental permite usar las Cefeidas como indicador de distancia?',
          options: [
            'La relación período-luminosidad de Leavitt, que liga el período de pulsación con la luminosidad absoluta',
            'Su corrimiento al rojo cosmológico, proporcional a la distancia por la ley de Hubble',
            'Su condición de candelas estándar con luminosidad idéntica e invariable',
            'La paralaje trigonométrica de la propia estrella, medible hasta escalas extragalácticas',
          ],
          correct_index: 0,
          explanation:
            'Las Cefeidas obedecen la relación período-luminosidad de Leavitt: medido el período, se infiere la luminosidad absoluta y con el flujo la distancia. El redshift no aplica a estrellas individuales cercanas; no tienen todas la misma luminosidad (depende del período); y la paralaje solo alcanza distancias galácticas modestas.',
        },
        {
          id: 'l4q2',
          question:
            'Si en una muestra limitada por flujo no se corrige el sesgo de Malmquist, ¿qué efecto se produce sobre la calibración?',
          options: [
            'Se subestima la luminosidad media porque solo se ven objetos débiles',
            'Se sobrestima la luminosidad media porque a gran distancia solo se detectan los objetos más luminosos',
            'No hay efecto si el detector es lo bastante sensible al ruido térmico',
            'Se elimina la extinción interestelar al promediar muchas fuentes',
          ],
          correct_index: 1,
          explanation:
            'El sesgo de Malmquist hace que a gran distancia solo superen el umbral de detección los objetos intrínsecamente más brillantes, elevando artificialmente la luminosidad media. No subestima (es lo contrario), no depende del ruido térmico y no tiene relación con corregir la extinción.',
        },
        {
          id: 'l4q3',
          question:
            '¿Por qué la extinción interestelar es un modo de fallo crítico en fotometría de distancias?',
          options: [
            'Aumenta el flujo observado, haciendo parecer los objetos más cercanos de lo que están',
            'Atenúa y enrojece el flujo, y si no se modela la ley de extinción degenera con la distancia',
            'Solo afecta a la espectroscopía, nunca a la fotometría de banda ancha',
            'Desplaza las líneas espectrales hacia el azul simulando un blueshift cosmológico',
          ],
          correct_index: 1,
          explanation:
            'La extinción atenúa (no aumenta) y enrojece el flujo; sin modelar la ley de extinción, esa atenuación se confunde con mayor distancia. Afecta a la fotometría de banda ancha y no produce desplazamientos de líneas tipo blueshift.',
        },
        {
          id: 'l4q4',
          question:
            'Sobre las supernovas de tipo Ia como candelas estándar, ¿cuál de estas afirmaciones es FALSA?',
          options: [
            'Se estandarizan aplicando la relación de Phillips entre anchura de la curva de luz y luminosidad pico',
            'Se calibran apoyándose en peldaños previos como las Cefeidas',
            'Son intrínsecamente candelas perfectas sin necesidad de corrección alguna',
            'Permiten alcanzar distancias mucho mayores que las Cefeidas por su alto brillo',
          ],
          correct_index: 2,
          explanation:
            'La afirmación falsa es que sean candelas perfectas: requieren la corrección de Phillips (anchura-luminosidad) para estandarizarse. Las otras tres son correctas: se calibran con Cefeidas, usan la relación de Phillips y superan en alcance a las Cefeidas.',
        },
        {
          id: 'l4q5',
          question:
            '¿Qué implica que la tensión de Hubble (~73 vs ~67 km/s/Mpc) persista con barras de error cada vez menores?',
          options: [
            'Que el problema es puramente estadístico y desaparecerá con más datos',
            'Que probablemente dominan errores sistemáticos residuales o física nueva, no la incertidumbre estadística',
            'Que la ley de Hubble ha sido refutada y no existe expansión',
            'Que la paralaje trigonométrica es incompatible con las Cefeidas',
          ],
          correct_index: 1,
          explanation:
            'Que la discrepancia se mantenga mientras los errores estadísticos se reducen apunta a sistemáticos residuales o física nueva, no a falta de datos. No refuta la expansión ni la ley de Hubble, ni implica incompatibilidad entre paralaje y Cefeidas.',
        },
      ],
      generationError: null,
    },
    {
      number: 5,
      status: 'ready',
      explanation:
        'En la frontera cosmológica persiste la tensión de Hubble: las mediciones locales de H0 mediante la escalera de distancias (cefeidas y supernovas Ia, SH0ES) rondan ~73 km/s/Mpc, mientras que la inferencia desde el fondo cósmico de microondas (Planck), asumiendo el modelo ΛCDM, arroja ~67. El debate abierto es si esto refleja física nueva (energía oscura dinámica, nueva física en el universo temprano) o sistemáticos no controlados en alguna de las escaleras. Aquí surge una compensación interpretativa: modificar el universo temprano (sonido acústico) suele reajustar otros observables, mientras que tocar la energía oscura tardía complica el ajuste del CMB. El JWST ha revelado galaxias tempranas sorprendentemente masivas y brillantes, tensionando la formación estelar en ΛCDM sin refutarlo aún. En paralelo, las biofirmas exoplanetarias (p. ej. señales tipo DMS en K2-18b) siguen siendo estadísticamente marginales y disputadas, y la astronomía multimensajero (ondas gravitacionales más contrapartes electromagnéticas) ofrece una vía independiente para acotar H0.',
      questions: [
        {
          id: 'l5q1',
          question:
            'Según la explicación, ¿qué valores aproximados de H0 (km/s/Mpc) enfrentan las mediciones locales y las inferidas del CMB?',
          options: [
            '~67 (local) frente a ~73 (CMB)',
            'Ambas coinciden en ~70',
            '~73 (local) frente a ~67 (CMB)',
            '~100 (local) frente a ~50 (CMB)',
          ],
          correct_index: 2,
          explanation:
            'El texto sitúa la medición local (SH0ES) en ~73 y la inferida del CMB (Planck) en ~67; no coinciden, y las opciones con los valores invertidos o iguales contradicen lo expuesto.',
        },
        {
          id: 'l5q2',
          question:
            '¿Cuál es el debate abierto central respecto a la tensión de Hubble mencionado?',
          options: [
            'Si el universo se expande o se contrae',
            'Si se debe a física nueva o a sistemáticos no controlados en las escaleras de medición',
            'Si las cefeidas existen realmente',
            'Si el CMB es de origen galáctico',
          ],
          correct_index: 1,
          explanation:
            'La explicación plantea explícitamente la disyuntiva entre física nueva (p. ej. energía oscura dinámica) y sistemáticos no controlados; las demás opciones no reflejan un debate real ni aparecen en el texto.',
        },
        {
          id: 'l5q3',
          question:
            'Según la compensación interpretativa descrita, ¿qué inconveniente tiene modificar la física del universo temprano para resolver la tensión?',
          options: [
            'Elimina por completo el fondo cósmico de microondas',
            'Hace innecesaria la energía oscura',
            'No tiene ningún inconveniente',
            'Suele reajustar otros observables, como la escala del sonido acústico',
          ],
          correct_index: 3,
          explanation:
            'El texto indica que tocar el universo temprano reajusta otros observables (sonido acústico), mientras que tocar la energía oscura tardía complica el ajuste del CMB; por eso es una compensación, no una solución gratuita.',
        },
        {
          id: 'l5q4',
          question:
            '¿Qué han aportado los resultados del JWST sobre galaxias tempranas, según la explicación?',
          options: [
            'Galaxias sorprendentemente masivas y brillantes que tensionan ΛCDM sin refutarlo aún',
            'La refutación definitiva del modelo ΛCDM',
            'La confirmación de que no existieron galaxias antes de cierta época',
            'La detección inequívoca de biofirmas',
          ],
          correct_index: 0,
          explanation:
            'La explicación afirma que el JWST reveló galaxias tempranas inesperadamente masivas que tensionan pero no refutan ΛCDM; las demás opciones exageran o tergiversan ese hallazgo.',
        },
        {
          id: 'l5q5',
          question: '¿Cuál de las siguientes afirmaciones es FALSA según la explicación?',
          options: [
            'La tensión de Hubble contrapone mediciones locales e inferencias del CMB',
            'La astronomía multimensajero ofrece una vía independiente para acotar H0',
            'Las biofirmas tipo DMS en K2-18b ya constituyen una detección confirmada e indisputada de vida',
            'Las galaxias masivas del JWST tensionan pero no refutan ΛCDM',
          ],
          correct_index: 2,
          explanation:
            'Es falsa: el texto describe las señales tipo DMS como estadísticamente marginales y disputadas, no como una detección confirmada; las otras tres afirmaciones sí reproducen fielmente lo expuesto.',
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
    id: 'demo-astronomia-l1c1',
    concept: 'la astronomía',
    levelLabel: 'Elemental',
    front: '¿Qué es la astronomía?',
    back: 'Mirar el cielo y las cosas que brillan.',
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
    id: 'demo-astronomia-l1c2',
    concept: 'la astronomía',
    levelLabel: 'Elemental',
    front: '¿A qué se parece el cielo?',
    back: 'A una caja de juguetes muy grande.',
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
    id: 'demo-astronomia-l1c3',
    concept: 'la astronomía',
    levelLabel: 'Elemental',
    front: '¿Qué vemos de noche en el cielo?',
    back: 'La luna y muchas estrellas.',
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
    id: 'demo-astronomia-l1c4',
    concept: 'la astronomía',
    levelLabel: 'Elemental',
    front: '¿Qué vemos de día en el cielo?',
    back: 'El sol, que es grande y calienta.',
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
    id: 'demo-astronomia-l1c5',
    concept: 'la astronomía',
    levelLabel: 'Elemental',
    front: '¿Qué hacemos con las estrellas?',
    back: 'Las miramos, las contamos y aprendemos sus nombres.',
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
