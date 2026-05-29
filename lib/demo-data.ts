import { type Exercise } from './exercise-engine'

export type DemoLesson = {
  id: string
  title: string
  duration_minutes: number
  exercises: Exercise[]
  intro_video_url?: string   // URL de YouTube: youtube.com/watch?v=ID
  key_concepts?: string[]    // Conceptos clave que se muestran antes de practicar
  requires_audio?: boolean   // true = pendiente de generar audio con IA
}

export type DemoSection = {
  id: string
  title: string
  lessons: DemoLesson[]
}

export type DemoModule = {
  id: string
  title: string
  description: string
  emoji: string
  sections: DemoSection[]
}

export type DemoLevel = {
  id: string
  title: string
  description: string
  total_hours: number
  modules: DemoModule[]
}

// ─────────────────────────────────────────────────────────────────────────────
// Shorthand helpers (mantiene el archivo legible)
// ─────────────────────────────────────────────────────────────────────────────
type MC = { question: string; options: string[]; correct: string; explanation?: string }
type FB = { sentence: string; answer: string; hint?: string; explanation?: string }
type SO = { words: string[]; correct_order: string[] }

const mc = (id: string, d: 1|2|3, c: MC): Exercise => ({ id, type: 'multiple_choice', difficulty: d, content: c })
const fb = (id: string, d: 1|2|3, c: FB): Exercise => ({ id, type: 'fill_blank',       difficulty: d, content: c })
const so = (id: string, d: 1|2|3, c: SO): Exercise => ({ id, type: 'sentence_order',   difficulty: d, content: c })

// ─────────────────────────────────────────────────────────────────────────────
export const DEMO_LEVELS: DemoLevel[] = [
  {
    id: 'A1',
    title: 'Inglés Básico A1',
    description: 'De cero a conversación: 8 módulos progresivos · gramática · vocabulario · situaciones reales',
    total_hours: 70,
    modules: [

      // ══════════════════════════════════════════════════════════════════════
      // MÓDULO 1 — Alfabeto, Pronunciación y Fonética Básica
      // Semanas 1-2 · 8 horas
      // ══════════════════════════════════════════════════════════════════════
      {
        id: 'mod1-alfabeto',
        title: 'Módulo 1 · Alfabeto y Fonética',
        description: 'El alfabeto A-Z, vocales, consonantes, deletreo y sílabas',
        emoji: '🔤',
        sections: [
          {
            id: 's1-alfabeto',
            title: 'El Alfabeto Inglés',
            lessons: [
              {
                id: 'l1-az',
                title: 'El Alfabeto A–Z y su pronunciación',
                duration_minutes: 10,
                key_concepts: [
                  'El alfabeto inglés tiene 26 letras (A–Z)',
                  'Las vocales son: A, E, I, O, U',
                  'El resto son consonantes (B, C, D, F…)',
                  'Las letras se pronuncian diferente al español',
                ],
                exercises: [
                  mc('1a1',1,{ question:'¿Cuántas letras tiene el alfabeto inglés?', options:['26','27','25','28'], correct:'26', explanation:'El inglés tiene 26 letras: A B C … Z.' }),
                  mc('1a2',1,{ question:'¿Cuáles son las vocales en inglés?', options:['A E I O U','A B C D E','B C D F G','A E I O Y'], correct:'A E I O U', explanation:'Las 5 vocales son: A, E, I, O, U.' }),
                  so('1a3',1,{ words:['C','A','B'], correct_order:['A','B','C'] }),
                  mc('1a4',1,{ question:'¿Qué letra va DESPUÉS de la G?', options:['H','F','I','J'], correct:'H', explanation:'...E, F, G, H, I...' }),
                  fb('1a5',2,{ sentence:'The alphabet has ___ letters.', answer:'twenty-six', hint:'26 = twenty-six' }),
                  so('1a6',2,{ words:['F','D','E'], correct_order:['D','E','F'] }),
                  mc('1a7',2,{ question:'¿Qué letra va ANTES de la Z?', options:['Y','X','W','V'], correct:'Y', explanation:'...X, Y, Z son las últimas letras.' }),
                  so('1a8',2,{ words:['M','K','L'], correct_order:['K','L','M'] }),
                  mc('1a9',3,{ question:'¿Cuántas vocales tiene el alfabeto inglés?', options:['5','6','4','7'], correct:'5', explanation:'A, E, I, O, U — cinco vocales.' }),
                ]
              },
              {
                id: 'l1-vowels',
                title: 'Vocales y Consonantes',
                duration_minutes: 8,
                key_concepts: [
                  'Vocales (vowels): A, E, I, O, U',
                  'Consonantes (consonants): todas las demás letras',
                  '"An" se usa antes de vocales: an apple, an egg',
                  '"A" se usa antes de consonantes: a book, a cat',
                ],
                exercises: [
                  mc('1v1',1,{ question:'¿Cuál de estas ES vocal?', options:['A','B','C','D'], correct:'A', explanation:'A es vocal. B, C, D son consonantes.' }),
                  mc('1v2',1,{ question:'¿Cuál de estas NO es vocal?', options:['B','E','I','O'], correct:'B', explanation:'B es consonante. E, I, O son vocales.' }),
                  fb('1v3',1,{ sentence:'The word "APPLE" has ___ vowels.', answer:'two', hint:'A y E son vocales en "APPLE"' }),
                  mc('1v4',2,{ question:'"CAT" — ¿cuántas vocales tiene?', options:['1','2','0','3'], correct:'1', explanation:'Solo la "A" es vocal en C-A-T.' }),
                  mc('1v5',2,{ question:'¿Cuál es vocal en "ENGLISH"?', options:['E e I','N G S','L S H','G L H'], correct:'E e I', explanation:'Las vocales de ENGLISH son E, I.' }),
                  fb('1v6',2,{ sentence:'B, D, F, G are all ___.', answer:'consonants', hint:'Letras que no son vocales = consonants' }),
                  mc('1v7',3,{ question:'"BEAUTIFUL" — ¿cuántas vocales tiene?', options:['5','4','3','6'], correct:'5', explanation:'B-E-A-U-T-I-F-U-L → E, A, U, I, U = 5 vocales.' }),
                ]
              },
            ]
          },
          {
            id: 's1-deletreo',
            title: 'Deletreo y Sílabas',
            lessons: [
              {
                id: 'l1-spelling',
                title: 'Deletreo: Spelling en inglés',
                duration_minutes: 8,
                exercises: [
                  mc('1s1',1,{ question:'¿Cómo se deletrea "CAT"?', options:['C-A-T','C-E-T','K-A-T','C-A-D'], correct:'C-A-T', explanation:'CAT (gato) = C-A-T.' }),
                  mc('1s2',1,{ question:'¿Cómo se deletrea "DOG"?', options:['D-O-G','D-A-G','D-O-C','D-U-G'], correct:'D-O-G', explanation:'DOG (perro) = D-O-G.' }),
                  fb('1s3',1,{ sentence:'S-U-N spells the word ___.', answer:'sun', hint:'S-U-N = ??' }),
                  mc('1s4',2,{ question:'B-O-O-K — ¿qué palabra es?', options:['book','cook','look','hook'], correct:'book', explanation:'B-O-O-K = "book" (libro).' }),
                  fb('1s5',2,{ sentence:'"How do you spell DOG?" "D-O-___"', answer:'G', hint:'Última letra de DOG' }),
                  mc('1s6',2,{ question:'¿Cuántas letras tiene "ENGLISH"?', options:['7','6','8','5'], correct:'7', explanation:'E-N-G-L-I-S-H = 7 letras.' }),
                  so('1s7',3,{ words:['you','your','spell','Can','name'], correct_order:['Can','you','spell','your','name'] }),
                ]
              },
              {
                id: 'l1-silabas',
                title: 'Sílabas y acento de palabras',
                duration_minutes: 8,
                requires_audio: true,
                exercises: [
                  mc('1sl1',1,{ question:'"CAT" — ¿cuántas sílabas tiene?', options:['1','2','3','0'], correct:'1', explanation:'"Cat" tiene una sílaba: CAT.' }),
                  mc('1sl2',1,{ question:'"HAPP-Y" — ¿cuántas sílabas tiene?', options:['2','1','3','4'], correct:'2', explanation:'"Happy" se divide: HAPP-Y = 2 sílabas.' }),
                  mc('1sl3',2,{ question:'"EN-GLISH" — ¿cuántas sílabas?', options:['2','1','3','4'], correct:'2', explanation:'EN-GLISH = 2 sílabas.' }),
                  fb('1sl4',2,{ sentence:'"BEAUTIFUL" has ___ syllables: beau-ti-ful.', answer:'three', hint:'Cuenta los grupos: beau-ti-ful' }),
                  mc('1sl5',2,{ question:'"HEL-LO" — ¿en qué sílaba está el acento?', options:['LO','HEL','Las dos','Ninguna'], correct:'LO', explanation:'hel-LO — el acento cae en la segunda sílaba.' }),
                  mc('1sl6',3,{ question:'"STU-DENT" — ¿cuántas sílabas?', options:['2','1','3','4'], correct:'2', explanation:'STU-DENT = 2 sílabas.' }),
                  mc('1sl7',3,{ question:'"UN-DER-STAND" — ¿cuántas sílabas?', options:['3','2','4','1'], correct:'3', explanation:'UN-DER-STAND = 3 sílabas.' }),
                ]
              },
            ]
          },
        ]
      },

      // ══════════════════════════════════════════════════════════════════════
      // MÓDULO 2 — Saludos, Presentaciones e Identidad Personal
      // Semanas 2-3 · 8 horas
      // ══════════════════════════════════════════════════════════════════════
      {
        id: 'mod2-saludos',
        title: 'Módulo 2 · Saludos e Identidad',
        description: 'Saludos, presentaciones, países, profesiones y pronombres',
        emoji: '👋',
        sections: [
          {
            id: 's2-saludos',
            title: 'Saludos y Presentaciones',
            lessons: [
              {
                id: 'l2-saludos',
                title: 'Saludos básicos en inglés',
                duration_minutes: 5,
                key_concepts: [
                  'Hello / Hi = Hola',
                  'Good morning = Buenos días · Good afternoon = Buenas tardes',
                  'Good evening = Buenas noches (al llegar) · Good night = Buenas noches (al despedirse)',
                  'How are you? = ¿Cómo estás? → I\'m fine, thanks! = ¡Estoy bien, gracias!',
                  'Goodbye / Bye / See you later = Adiós / Hasta luego',
                ],
                exercises: [
                  mc('2g1',1,{ question:'¿Cómo dices "Hola" en inglés?', options:['Hello','Goodbye','Thank you','Please'], correct:'Hello', explanation:'"Hello" o "Hi" = Hola.' }),
                  mc('2g2',1,{ question:'¿Cómo saludas en la mañana?', options:['Good morning','Good night','Goodbye','Good evening'], correct:'Good morning', explanation:'"Good morning" = Buenos días.' }),
                  mc('2g3',1,{ question:'¿Qué significa "How are you?"', options:['¿Cómo estás?','¿Cómo te llamas?','¿De dónde eres?','¿Qué haces?'], correct:'¿Cómo estás?', explanation:'"How are you?" pregunta sobre tu estado.' }),
                  fb('2g4',1,{ sentence:'Good ___, see you tomorrow!', answer:'bye', hint:'Despedida corta' }),
                  mc('2g5',2,{ question:'Respuesta correcta a "How are you?"', options:["I'm fine, thanks!","My name is Ana","I am from Colombia","I have a dog"], correct:"I'm fine, thanks!", explanation:'"I\'m fine, thanks!" = Estoy bien, gracias.' }),
                  so('2g6',2,{ words:['meet','Nice','to','you'], correct_order:['Nice','to','meet','you'] }),
                  mc('2g7',2,{ question:'¿Cómo te despides "Hasta luego"?', options:['See you later','Good morning','Nice to meet you','How are you'], correct:'See you later', explanation:'"See you later" = Hasta luego.' }),
                  fb('2g8',2,{ sentence:'Good ___, have a nice night!', answer:'evening', hint:'Saludo de tarde-noche' }),
                  mc('2g9',3,{ question:'¿Cuál es la forma MÁS formal de saludar?', options:['Good morning, sir.','Hey!','Hi!','Yo!'], correct:'Good morning, sir.', explanation:'En contextos formales usamos "Good morning/afternoon" con título.' }),
                ]
              },
              {
                id: 'l2-presentacion',
                title: 'Cómo presentarte: nombre, edad y origen',
                duration_minutes: 6,
                key_concepts: [
                  'My name is ___ = Me llamo ___',
                  'I am from ___ = Soy de ___',
                  'I am ___ years old = Tengo ___ años',
                  'What is your name? = ¿Cómo te llamas?',
                  'How old are you? = ¿Cuántos años tienes?',
                  'Where are you from? = ¿De dónde eres?',
                ],
                exercises: [
                  mc('2p1',1,{ question:'¿Cómo dices "Me llamo Carlos"?', options:['My name is Carlos','I have Carlos','He is Carlos','You are Carlos'], correct:'My name is Carlos', explanation:'"My name is ___" = Me llamo ___.' }),
                  fb('2p2',1,{ sentence:'My ___ is María.', answer:'name', hint:'"Nombre" en inglés' }),
                  so('2p3',1,{ words:['name','My','is','Juan'], correct_order:['My','name','is','Juan'] }),
                  mc('2p4',1,{ question:'¿Cómo dices "Soy de Colombia"?', options:['I am from Colombia','I have Colombia','Colombia is me','I go Colombia'], correct:'I am from Colombia', explanation:'"I am from ___" = Soy de ___.' }),
                  fb('2p5',2,{ sentence:'I am ___ Bogotá.', answer:'from', hint:'"De" en esta frase es "from"' }),
                  mc('2p6',2,{ question:'¿Cómo preguntas el nombre de alguien?', options:['What is your name?','How are you?','Where are you?','Who you are?'], correct:'What is your name?', explanation:'"What is your name?" = ¿Cómo te llamas?' }),
                  so('2p7',2,{ words:['from','I','am','Colombia'], correct_order:['I','am','from','Colombia'] }),
                  fb('2p8',2,{ sentence:'I am ___ years old. (12)', answer:'twelve', hint:'12 = twelve' }),
                  mc('2p9',3,{ question:'¿Cómo preguntas la edad de alguien?', options:['How old are you?','How are you?','What old are you?','How much old?'], correct:'How old are you?', explanation:'"How old are you?" = ¿Cuántos años tienes?' }),
                ]
              },
            ]
          },
          {
            id: 's2-identidad',
            title: 'Países, Nacionalidades y Profesiones',
            lessons: [
              {
                id: 'l2-countries',
                title: 'Países y Nacionalidades en inglés',
                duration_minutes: 8,
                exercises: [
                  mc('2c1',1,{ question:'¿Cómo se dice "Colombia" en inglés?', options:['Colombia','Colombiana','Colombie','Kolumbia'], correct:'Colombia', explanation:'"Colombia" se escribe igual en inglés.' }),
                  mc('2c2',1,{ question:'¿Cómo se dice la nacionalidad de alguien de Colombia?', options:['Colombian','Colombish','Colombianian','Colombian-ish'], correct:'Colombian', explanation:'Colombia → Colombian (colombiano/a).' }),
                  fb('2c3',1,{ sentence:'She is from ___ (USA).', answer:'the United States', hint:'El país más grande de América del Norte' }),
                  mc('2c4',2,{ question:'¿Cuál es la nacionalidad de alguien de España?', options:['Spanish','Spanishman','Espanish','Spanian'], correct:'Spanish', explanation:'Spain → Spanish (español/a).' }),
                  so('2c5',2,{ words:['from','She','is','Mexico'], correct_order:['She','is','from','Mexico'] }),
                  mc('2c6',2,{ question:'"I am Brazilian." ¿De qué país es?', options:['Brazil','Brazilia','Brasil','Britain'], correct:'Brazil', explanation:'Brazilian = de Brazil (Brasil).' }),
                  fb('2c7',2,{ sentence:'He is from England. He is ___.', answer:'English', explanation:'England → English' }),
                  mc('2c8',3,{ question:'¿Cuál es la nacionalidad de alguien de France?', options:['French','Frenchman','Francish','Francese'], correct:'French', explanation:'France → French (francés/a).' }),
                ]
              },
              {
                id: 'l2-professions',
                title: 'Profesiones básicas: What do you do?',
                duration_minutes: 7,
                exercises: [
                  mc('2pr1',1,{ question:'¿Cómo se dice "médico" en inglés?', options:['doctor','teacher','engineer','nurse'], correct:'doctor', explanation:'"Doctor" = médico.' }),
                  mc('2pr2',1,{ question:'"She is a teacher." ¿Qué es ella?', options:['Maestra','Enfermera','Doctora','Cocinera'], correct:'Maestra', explanation:'"Teacher" = maestro/a.' }),
                  fb('2pr3',1,{ sentence:'He works at a hospital. He is a ___.', answer:'doctor', hint:'Trabaja en hospital → médico' }),
                  mc('2pr4',2,{ question:'"What do you do?" significa:', options:['¿A qué te dedicas?','¿Cómo estás?','¿Dónde trabajas?','¿Cuándo trabajas?'], correct:'¿A qué te dedicas?', explanation:'"What do you do?" pregunta la profesión.' }),
                  so('2pr5',2,{ words:['a','She','nurse','is'], correct_order:['She','is','a','nurse'] }),
                  mc('2pr6',2,{ question:'"I am an engineer." ¿Por qué "an" y no "a"?', options:['Engineer empieza con vocal','Engineer es plural','Engineer es femenino','Es incorrecto'], correct:'Engineer empieza con vocal', explanation:'"An" se usa antes de vocales: an engineer, an apple.' }),
                  fb('2pr7',2,{ sentence:'My father drives a bus. He is a bus ___.', answer:'driver', hint:'Quien maneja (drive) = driver' }),
                  mc('2pr8',3,{ question:'¿Cuál de estas es una profesión?', options:['firefighter','table','book','happy'], correct:'firefighter', explanation:'"Firefighter" = bombero/a.' }),
                ]
              },
            ]
          },
          {
            id: 's2-pronouns',
            title: 'Pronombres Personales',
            lessons: [
              {
                id: 'l2-pronouns',
                title: 'I, you, he, she, it, we, they',
                duration_minutes: 7,
                exercises: [
                  mc('2pn1',1,{ question:'¿Cuál es el pronombre para "yo"?', options:['I','you','he','we'], correct:'I', explanation:'"I" siempre se escribe en mayúscula y significa "yo".' }),
                  mc('2pn2',1,{ question:'¿Cuál se usa para hablar de un niño (él)?', options:['he','she','it','they'], correct:'he', explanation:'"He" = él (masculino).' }),
                  fb('2pn3',1,{ sentence:'María is my sister. ___ is very kind.', answer:'She', hint:'María es femenino → she' }),
                  mc('2pn4',1,{ question:'¿Cuál se usa para "nosotros"?', options:['we','they','you','us'], correct:'we', explanation:'"We" = nosotros.' }),
                  so('2pn5',2,{ words:['is','He','my','brother'], correct_order:['He','is','my','brother'] }),
                  mc('2pn6',2,{ question:'Un gato — ¿qué pronombre usas?', options:['it','he','she','they'], correct:'it', explanation:'"It" se usa para animales y cosas (no personas).' }),
                  fb('2pn7',2,{ sentence:'Carlos and Ana are friends. ___ study together.', answer:'They', hint:'Dos personas = they' }),
                  mc('2pn8',3,{ question:'¿Cuándo usas "you" en inglés?', options:['Singular y plural (tú/ustedes)','Solo singular (tú)','Solo plural (ustedes)','Solo formal'], correct:'Singular y plural (tú/ustedes)', explanation:'"You" sirve para tú y ustedes en inglés.' }),
                ]
              },
            ]
          },
          {
            id: 's2-numeros',
            title: 'Números 1–100',
            lessons: [
              {
                id: 'l2-num1-20',
                title: 'Números del 1 al 20',
                duration_minutes: 7,
                exercises: [
                  mc('2n1',1,{ question:'¿Cómo se dice "3"?', options:['three','two','four','free'], correct:'three', explanation:'3 = three.' }),
                  mc('2n2',1,{ question:'¿Cuánto es "seven"?', options:['7','6','8','5'], correct:'7', explanation:'Seven = 7.' }),
                  fb('2n3',1,{ sentence:'I have ___ fingers. (10)', answer:'ten', hint:'10 = ten' }),
                  so('2n4',1,{ words:['two','one','three'], correct_order:['one','two','three'] }),
                  mc('2n5',1,{ question:'¿Cómo se dice "12"?', options:['twelve','eleven','thirteen','twenty'], correct:'twelve', explanation:'12 = twelve.' }),
                  fb('2n6',2,{ sentence:'A week has ___ days.', answer:'seven', hint:'7 días = seven' }),
                  so('2n7',2,{ words:['eight','six','seven'], correct_order:['six','seven','eight'] }),
                  mc('2n8',2,{ question:'¿Cuánto es "fifteen"?', options:['15','14','16','50'], correct:'15', explanation:'Fifteen = 15.' }),
                  mc('2n9',3,{ question:'¿Cuánto es "eleven + eight"?', options:['nineteen','twenty','eighteen','seventeen'], correct:'nineteen', explanation:'11 + 8 = 19 = nineteen.' }),
                ]
              },
              {
                id: 'l2-num20-100',
                title: 'Números del 20 al 100',
                duration_minutes: 6,
                exercises: [
                  mc('2nb1',1,{ question:'¿Cómo se dice "20"?', options:['twenty','twelve','two','twety'], correct:'twenty', explanation:'20 = twenty.' }),
                  mc('2nb2',1,{ question:'¿Cuánto es "fifty"?', options:['50','15','55','40'], correct:'50', explanation:'Fifty = 50.' }),
                  fb('2nb3',1,{ sentence:'There are ___ minutes in an hour.', answer:'sixty', hint:'60 = sixty' }),
                  mc('2nb4',2,{ question:'¿Cómo se dice "35"?', options:['thirty-five','fifty-three','three-five','fifteen'], correct:'thirty-five', explanation:'35 = thirty-five.' }),
                  fb('2nb5',2,{ sentence:'I am ___ years old. (14)', answer:'fourteen', hint:'14 = fourteen' }),
                  so('2nb6',2,{ words:['sixty','forty','fifty'], correct_order:['forty','fifty','sixty'] }),
                  mc('2nb7',3,{ question:'¿Cuánto es "forty + thirty"?', options:['seventy','eighty','sixty','ninety'], correct:'seventy', explanation:'40 + 30 = 70 = seventy.' }),
                  mc('2nb8',3,{ question:'¿Cómo se dice "100"?', options:['one hundred','one thousand','ten hundred','ninety-nine'], correct:'one hundred', explanation:'100 = one hundred.' }),
                ]
              },
            ]
          },
        ]
      },

      // ══════════════════════════════════════════════════════════════════════
      // MÓDULO 3 — Verbo To Be, Artículos y Gramática Esencial
      // Semanas 3-5 · 10 horas
      // ══════════════════════════════════════════════════════════════════════
      {
        id: 'mod3-tobe',
        title: 'Módulo 3 · To Be y Gramática',
        description: 'To be, artículos, this/that, adjetivos, posesivos y plurales',
        emoji: '⚡',
        sections: [
          {
            id: 's3-tobe',
            title: 'Verbo To Be',
            lessons: [
              {
                id: 'l3-tobe-afirmativa',
                title: 'To be afirmativa: am / is / are',
                duration_minutes: 7,
                key_concepts: [
                  'I am → I\'m (yo soy / estoy)',
                  'He / She / It is → He\'s / She\'s / It\'s (él, ella, eso es / está)',
                  'You / We / They are → You\'re / We\'re / They\'re (eres, somos, son)',
                  'To be = SER y ESTAR en inglés (un solo verbo para los dos)',
                ],
                exercises: [
                  mc('3tb1',1,{ question:'"I ___ a student."', options:['am','is','are','be'], correct:'am', explanation:'I → am.' }),
                  mc('3tb2',1,{ question:'"She ___ beautiful."', options:['is','am','are','be'], correct:'is', explanation:'She/He/It → is.' }),
                  fb('3tb3',1,{ sentence:'They ___ friends.', answer:'are', hint:'They → are' }),
                  so('3tb4',1,{ words:['happy','am','I'], correct_order:['I','am','happy'] }),
                  fb('3tb5',2,{ sentence:'My parents ___ from Bogotá.', answer:'are', hint:'"My parents" es plural' }),
                  so('3tb6',2,{ words:['a','teacher','She','is','good'], correct_order:['She','is','a','good','teacher'] }),
                  mc('3tb7',2,{ question:'"We ___ in the classroom."', options:['are','is','am','be'], correct:'are', explanation:'We → are.' }),
                  fb('3tb8',3,{ sentence:'It ___ a beautiful day.', answer:'is', hint:'It → is' }),
                ]
              },
              {
                id: 'l3-tobe-negativa',
                title: 'To be negativa: am not / isn\'t / aren\'t',
                duration_minutes: 6,
                exercises: [
                  mc('3tn1',1,{ question:'"I ___ tired." (negativo)', options:["am not","is not","are not","not am"], correct:"am not", explanation:'"I am not" = I\'m not.' }),
                  fb('3tn2',1,{ sentence:'She ___ a doctor. (negativo)', answer:"is not", hint:'She is → She is not' }),
                  so('3tn3',2,{ words:['not','happy','am','I'], correct_order:['I','am','not','happy'] }),
                  mc('3tn4',2,{ question:'Contracción de "is not":', options:["isn't","isn't","not is","isno"], correct:"isn't", explanation:'"is not" → "isn\'t"' }),
                  fb('3tn5',2,{ sentence:"They ___ from Mexico. (contracción)", answer:"aren't", hint:'"are not" → "aren\'t"' }),
                  so('3tn6',3,{ words:["isn't","cold","today","It"], correct_order:['It',"isn't","cold","today"] }),
                  mc('3tn7',3,{ question:'"We ___ ready yet." (contracción)', options:["aren't","isn't","am not","not are"], correct:"aren't", explanation:'"We are not" → "We aren\'t".' }),
                ]
              },
              {
                id: 'l3-tobe-pregunta',
                title: 'To be interrogativa: Am I? / Is she? / Are you?',
                duration_minutes: 7,
                exercises: [
                  mc('3tq1',1,{ question:'¿Cómo preguntas "¿Eres estudiante?"', options:['Are you a student?','You are a student?','Is you a student?','Do you student?'], correct:'Are you a student?', explanation:'Con "you" la pregunta es "Are you...?"' }),
                  fb('3tq2',1,{ sentence:'___ she a doctor?', answer:'Is', hint:'She → Is' }),
                  so('3tq3',2,{ words:['tired','Am','I'], correct_order:['Am','I','tired'] }),
                  mc('3tq4',2,{ question:'"___ they from Spain?"', options:['Are','Is','Am','Do'], correct:'Are', explanation:'"They" → "Are they...?"' }),
                  so('3tq5',2,{ words:['ready','you','Are'], correct_order:['Are','you','ready'] }),
                  mc('3tq6',2,{ question:'Respuesta corta: "Are you happy?" → "___, I am."', options:['Yes','No','Not','Sure'], correct:'Yes', explanation:'Respuesta afirmativa corta: "Yes, I am."' }),
                  fb('3tq7',3,{ sentence:'___ your brother a teacher?', answer:'Is', hint:'"Brother" = he → Is' }),
                  mc('3tq8',3,{ question:'"Is it cold?" → Respuesta negativa corta:', options:["No, it isn't.","No, it aren't.","Not, it is.","No, am not."], correct:"No, it isn't.", explanation:'"No, it isn\'t." = No, (no lo está).' }),
                ]
              },
              {
                id: 'l3-contracciones',
                title: 'Contracciones con To Be: I\'m, she\'s, they\'re…',
                duration_minutes: 5,
                exercises: [
                  mc('3co1',1,{ question:'Contracción de "I am":', options:["I'm","I's","Im","I are"], correct:"I'm", explanation:'"I am" → "I\'m".' }),
                  mc('3co2',1,{ question:'Contracción de "She is":', options:["She's","She'm","Shes","She're"], correct:"She's", explanation:'"She is" → "She\'s".' }),
                  fb('3co3',1,{ sentence:"___ happy. (I am)", answer:"I'm", hint:'Contrae "I am"' }),
                  fb('3co4',2,{ sentence:"___ my best friend. (He is)", answer:"He's", hint:'Contrae "He is"' }),
                  so('3co5',2,{ words:["They're",'the','park','in'], correct_order:["They're",'in','the','park'] }),
                  mc('3co6',2,{ question:'Contracción de "We are":', options:["We're","We's","We'm","Wer"], correct:"We're", explanation:'"We are" → "We\'re".' }),
                  fb('3co7',3,{ sentence:"___ a great day! (It is)", answer:"It's", hint:'Contrae "It is"' }),
                ]
              },
            ]
          },
          {
            id: 's3-articulos',
            title: 'Artículos y Demostrativos',
            lessons: [
              {
                id: 'l3-a-an',
                title: 'Artículos "a" y "an"',
                duration_minutes: 6,
                exercises: [
                  mc('3ar1',1,{ question:'"___ apple"', options:['an','a','the','one'], correct:'an', explanation:'"An" antes de vocales. "Apple" → vocal A.' }),
                  mc('3ar2',1,{ question:'"___ book"', options:['a','an','the','one'], correct:'a', explanation:'"A" antes de consonantes. "Book" → consonante B.' }),
                  fb('3ar3',1,{ sentence:'She has ___ orange.', answer:'an', hint:'"Orange" empieza con vocal O' }),
                  mc('3ar4',2,{ question:'"___ hour"', options:['an','a','the','one'], correct:'an', explanation:'"Hour" suena como vocal (la H es silenciosa).' }),
                  so('3ar5',2,{ words:['an','is','This','umbrella'], correct_order:['This','is','an','umbrella'] }),
                  fb('3ar6',2,{ sentence:'I want ___ ice cream.', answer:'an', hint:'"Ice" empieza con vocal I' }),
                  mc('3ar7',3,{ question:'"___ university"', options:['a','an','the','one'], correct:'a', explanation:'"University" suena "yu-ni..." — sonido consonante.' }),
                ]
              },
              {
                id: 'l3-the',
                title: 'El artículo "the": cuándo usarlo',
                duration_minutes: 7,
                exercises: [
                  mc('3th1',1,{ question:'¿Cuándo usas "the"?', options:['Cuando ya sabes de qué hablas','Siempre','Con vocales','Con plurales'], correct:'Cuando ya sabes de qué hablas', explanation:'"The" es el artículo definido — algo específico que ya conoces.' }),
                  fb('3th2',1,{ sentence:'___ sun is very hot today.', answer:'The', hint:'Solo hay un sol → "the"' }),
                  mc('3th3',1,{ question:'I see a dog. ___ dog is big.', options:['The','A','An','No article'], correct:'The', explanation:'La segunda mención usa "the" porque ya sabemos de qué perro hablamos.' }),
                  so('3th4',2,{ words:['the','is','book','on','table','The'], correct_order:['The','book','is','on','the','table'] }),
                  mc('3th5',2,{ question:'"___ Eiffel Tower is in Paris."', options:['The','A','An','—'], correct:'The', explanation:'Monumentos únicos usan "the".' }),
                  fb('3th6',2,{ sentence:'Please close ___ door.', answer:'the', hint:'La puerta específica que ves → "the"' }),
                  mc('3th7',3,{ question:'"She plays ___ piano."', options:['the','a','an','—'], correct:'the', explanation:'Con instrumentos musicales se usa "the".' }),
                ]
              },
              {
                id: 'l3-this-that',
                title: 'This / That / These / Those',
                duration_minutes: 6,
                exercises: [
                  mc('3dt1',1,{ question:'"This" se usa para cosas que están:', options:['Cerca de ti','Lejos de ti','En plural','En pasado'], correct:'Cerca de ti', explanation:'"This" = esto (cerca). "That" = eso (lejos).' }),
                  mc('3dt2',1,{ question:'¿Cuál es el plural de "this"?', options:['these','those','that','thiss'], correct:'these', explanation:'"This" (singular) → "these" (plural).' }),
                  fb('3dt3',1,{ sentence:'___ is my book. (cerca)', answer:'This', hint:'Cerca + singular = This' }),
                  so('3dt4',2,{ words:['my','This','pen','is'], correct_order:['This','is','my','pen'] }),
                  mc('3dt5',2,{ question:'"That is a great idea!" — ¿"that" aquí?', options:['Lejos o ya mencionado','Cerca de ti','En plural','En futuro'], correct:'Lejos o ya mencionado', explanation:'"That" señala algo distante o ya mencionado.' }),
                  fb('3dt6',2,{ sentence:'___ are my friends. (grupo cerca)', answer:'These', hint:'Cerca + plural = These' }),
                  mc('3dt7',3,{ question:'¿Cuál es correcto? "___ books over there are mine."', options:['Those','These','This','That'], correct:'Those', explanation:'"Those" = esos/esas (lejos, plural).' }),
                ]
              },
            ]
          },
          {
            id: 's3-grammar',
            title: 'Adjetivos, Posesivos y Plurales',
            lessons: [
              {
                id: 'l3-adjectives',
                title: 'Adjetivos básicos: big, small, old, new…',
                duration_minutes: 7,
                exercises: [
                  mc('3adj1',1,{ question:'¿Qué significa "big"?', options:['grande','pequeño','viejo','nuevo'], correct:'grande', explanation:'"Big" = grande.' }),
                  mc('3adj2',1,{ question:'¿Cuál es el opuesto de "new"?', options:['old','big','cold','fast'], correct:'old', explanation:'"New" (nuevo) ↔ "old" (viejo).' }),
                  fb('3adj3',1,{ sentence:'The elephant is very ___ . (grande)', answer:'big', hint:'Grande = big' }),
                  so('3adj4',2,{ words:['dog','The','is','small'], correct_order:['The','dog','is','small'] }),
                  mc('3adj5',2,{ question:'¿Cómo se dice "el carro rojo"?', options:['the red car','the car red','red the car','car the red'], correct:'the red car', explanation:'En inglés el adjetivo va ANTES del sustantivo: red car.' }),
                  fb('3adj6',2,{ sentence:'It is a ___ day. (frío)', answer:'cold', hint:'Frío = cold' }),
                  mc('3adj7',3,{ question:'"She has long, beautiful hair." — ¿cuántos adjetivos hay?', options:['2','1','3','0'], correct:'2', explanation:'"long" y "beautiful" son los dos adjetivos.' }),
                ]
              },
              {
                id: 'l3-possessives',
                title: 'Posesivos: my, your, his, her, its, our, their',
                duration_minutes: 6,
                exercises: [
                  mc('3po1',1,{ question:'María tiene un perro. "___ dog is big."', options:['Her','His','Their','Our'], correct:'Her', explanation:'"Her" es posesivo femenino.' }),
                  mc('3po2',1,{ question:'Juan tiene una casa. "___ house is nice."', options:['His','Her','Their','Our'], correct:'His', explanation:'"His" es posesivo masculino.' }),
                  fb('3po3',1,{ sentence:'Pedro and Ana love ___ children.', answer:'their', hint:'Dos personas juntas → their' }),
                  so('3po4',2,{ words:['name','Her','María','is'], correct_order:['Her','name','is','María'] }),
                  fb('3po5',2,{ sentence:'My brother lost ___ keys.', answer:'his', hint:'"Brother" es masculino' }),
                  mc('3po6',2,{ question:'¿Cuál es el posesivo de "I"?', options:['my','your','his','our'], correct:'my', explanation:'I → my (mi/mis).' }),
                  mc('3po7',3,{ question:'"The dog wagged ___ tail."', options:['its','his','her','their'], correct:'its', explanation:'"Its" es el posesivo para cosas y animales (sin género).' }),
                ]
              },
              {
                id: 'l3-plural',
                title: 'Sustantivos: singular y plural regular',
                duration_minutes: 6,
                exercises: [
                  mc('3pl1',1,{ question:'¿Cómo formas el plural regular de "book"?', options:['books','booeks','bookes','bookss'], correct:'books', explanation:'La regla general: sustantivo + S → books.' }),
                  fb('3pl2',1,{ sentence:'One cat → two ___.', answer:'cats', hint:'cat + s' }),
                  mc('3pl3',1,{ question:'¿Cuál es el plural de "box"?', options:['boxes','boxs','boxies','boxen'], correct:'boxes', explanation:'Palabras en -x, -s, -ch, -sh → agrega -es.' }),
                  fb('3pl4',2,{ sentence:'One dish → three ___.', answer:'dishes', hint:'dish → dish + es' }),
                  mc('3pl5',2,{ question:'¿Cuál es el plural de "baby"?', options:['babies','babys','babyes','baby'], correct:'babies', explanation:'Palabras en consonante + y → cambia y por ies: babies.' }),
                  mc('3pl6',2,{ question:'¿Cuál es el plural de "man"?', options:['men','mans','manes','mans'], correct:'men', explanation:'"Man" es irregular: man → men.' }),
                  mc('3pl7',3,{ question:'¿Cuál es el plural de "child"?', options:['children','childs','childes','child'], correct:'children', explanation:'"Child" es irregular: child → children.' }),
                ]
              },
            ]
          },
        ]
      },

      // ══════════════════════════════════════════════════════════════════════
      // MÓDULO 4 — Vocabulario Temático Cotidiano
      // Semanas 5-7 · 10 horas
      // ══════════════════════════════════════════════════════════════════════
      {
        id: 'mod4-vocab',
        title: 'Módulo 4 · Vocabulario Cotidiano',
        description: 'Familia, hogar, comida, ropa, animales, clima y más',
        emoji: '🏠',
        sections: [
          {
            id: 's4-familia',
            title: 'Familia y Hogar',
            lessons: [
              {
                id: 'l4-family',
                title: 'La familia en inglés',
                duration_minutes: 7,
                exercises: [
                  mc('4f1',1,{ question:'¿Cómo se dice "madre"?', options:['mother','father','sister','brother'], correct:'mother', explanation:'"Mother" = madre.' }),
                  mc('4f2',1,{ question:'¿Cómo se dice "hermano"?', options:['brother','sister','father','cousin'], correct:'brother', explanation:'"Brother" = hermano.' }),
                  fb('4f3',1,{ sentence:'My ___ is 5 years old. (hermana pequeña)', answer:'sister', hint:'Hermana = sister' }),
                  so('4f4',2,{ words:['is','grandfather','My','old'], correct_order:['My','grandfather','is','old'] }),
                  mc('4f5',2,{ question:'"My aunt\'s son is my ___"', options:['cousin','uncle','nephew','brother'], correct:'cousin', explanation:'El hijo de tu tía/tío es tu primo/a = cousin.' }),
                  fb('4f6',2,{ sentence:'My father\'s mother is my ___.', answer:'grandmother', hint:'La mamá de tu papá' }),
                  mc('4f7',3,{ question:'"My parents have two children: my sister and ___."', options:['me','I','my','mine'], correct:'me', explanation:'"Me" es objeto. "I" es sujeto. Aquí es objeto → "me".' }),
                ]
              },
              {
                id: 'l4-home',
                title: 'El hogar y las habitaciones',
                duration_minutes: 6,
                exercises: [
                  mc('4h1',1,{ question:'¿Dónde cocinas en casa?', options:['kitchen','bedroom','bathroom','living room'], correct:'kitchen', explanation:'"Kitchen" = cocina.' }),
                  mc('4h2',1,{ question:'¿Cómo se dice "cuarto de baño"?', options:['bathroom','bedroom','kitchen','hall'], correct:'bathroom', explanation:'"Bathroom" = cuarto de baño.' }),
                  fb('4h3',1,{ sentence:'I sleep in my ___.', answer:'bedroom', hint:'Cuarto donde duermes' }),
                  so('4h4',2,{ words:['the','is','TV','in','living','The','room'], correct_order:['The','TV','is','in','the','living','room'] }),
                  mc('4h5',2,{ question:'"We eat in the ___."', options:['dining room','bathroom','garage','bedroom'], correct:'dining room', explanation:'"Dining room" = comedor.' }),
                  fb('4h6',2,{ sentence:'We park the car in the ___.', answer:'garage', hint:'Donde guardas el carro' }),
                  mc('4h7',3,{ question:'¿Cómo se dice "jardín"?', options:['garden','yard','park','outside'], correct:'garden', explanation:'"Garden" = jardín (también "yard" en inglés americano).' }),
                ]
              },
            ]
          },
          {
            id: 's4-comida',
            title: 'Comida, Ropa y Colores',
            lessons: [
              {
                id: 'l4-food',
                title: 'Comida y bebida: breakfast, lunch, dinner',
                duration_minutes: 7,
                exercises: [
                  mc('4fd1',1,{ question:'¿Cómo se dice "desayuno"?', options:['breakfast','lunch','dinner','snack'], correct:'breakfast', explanation:'"Breakfast" = desayuno (primera comida del día).' }),
                  mc('4fd2',1,{ question:'¿Qué es "water"?', options:['agua','leche','jugo','café'], correct:'agua', explanation:'"Water" = agua.' }),
                  fb('4fd3',1,{ sentence:'I eat ___ every morning. (huevos)', answer:'eggs', hint:'Huevos = eggs' }),
                  mc('4fd4',2,{ question:'"I\'m hungry." significa:', options:['Tengo hambre','Tengo sed','Tengo frío','Tengo sueño'], correct:'Tengo hambre', explanation:'"Hungry" = hambriento/a.' }),
                  so('4fd5',2,{ words:['lunch','I','at','eat','school'], correct_order:['I','eat','lunch','at','school'] }),
                  mc('4fd6',2,{ question:'¿Cuál es la comida de la noche?', options:['dinner','breakfast','lunch','snack'], correct:'dinner', explanation:'"Dinner" = cena.' }),
                  fb('4fd7',3,{ sentence:'I am ___. Can I have some water? (sed)', answer:'thirsty', hint:'Sed = thirsty' }),
                ]
              },
              {
                id: 'l4-colors',
                title: 'Colores y Ropa',
                duration_minutes: 7,
                exercises: [
                  mc('4cl1',1,{ question:'¿Cómo se dice "rojo"?', options:['red','blue','green','yellow'], correct:'red', explanation:'"Red" = rojo.' }),
                  mc('4cl2',1,{ question:'¿Cómo se dice "camisa"?', options:['shirt','shoes','pants','jacket'], correct:'shirt', explanation:'"Shirt" = camisa.' }),
                  fb('4cl3',1,{ sentence:'The sky is ___.', answer:'blue', hint:'El cielo es azul' }),
                  so('4cl4',2,{ words:['a','She','red','wearing','is','shirt'], correct_order:['She','is','wearing','a','red','shirt'] }),
                  mc('4cl5',2,{ question:'¿Cómo se dicen "zapatos"?', options:['shoes','pants','socks','boots'], correct:'shoes', explanation:'"Shoes" = zapatos.' }),
                  fb('4cl6',2,{ sentence:'I wear ___ when it\'s cold. (abrigo/chaqueta)', answer:'jacket', hint:'Para el frío = jacket' }),
                  mc('4cl7',3,{ question:'"His T-shirt is ___ and ___." (blanco y negro)', options:['white and black','white and dark','bright and black','clear and black'], correct:'white and black', explanation:'White = blanco, Black = negro.' }),
                ]
              },
            ]
          },
          {
            id: 's4-naturaleza',
            title: 'Animales, Clima y Tiempo',
            lessons: [
              {
                id: 'l4-animals',
                title: 'Animales comunes en inglés',
                duration_minutes: 6,
                exercises: [
                  mc('4an1',1,{ question:'¿Cómo se dice "perro"?', options:['dog','cat','bird','fish'], correct:'dog', explanation:'"Dog" = perro.' }),
                  mc('4an2',1,{ question:'"The ___ says meow."', options:['cat','dog','bird','cow'], correct:'cat', explanation:'"Cat" = gato. Los gatos dicen meow.' }),
                  fb('4an3',1,{ sentence:'A ___ can fly. (pájaro)', answer:'bird', hint:'Vuela = bird' }),
                  so('4an4',2,{ words:['a','has','horse','The','big','tail'], correct_order:['The','horse','has','a','big','tail'] }),
                  mc('4an5',2,{ question:'"Cow" en español es:', options:['vaca','caballo','cerdo','oveja'], correct:'vaca', explanation:'"Cow" = vaca.' }),
                  fb('4an6',2,{ sentence:'A ___ lives in the sea. (pez/ballena)', answer:'fish', hint:'Animal acuático común' }),
                  mc('4an7',3,{ question:'¿Cuál de estos es un animal salvaje?', options:['lion','dog','cat','cow'], correct:'lion', explanation:'"Lion" (león) es salvaje. Dog, cat y cow son domésticos.' }),
                ]
              },
              {
                id: 'l4-weather',
                title: 'Estaciones, clima y meses del año',
                duration_minutes: 7,
                exercises: [
                  mc('4w1',1,{ question:'¿Cómo se dice "hace frío"?', options:["It's cold","It's hot","It's sunny","It's windy"], correct:"It's cold", explanation:'"It\'s cold" = hace frío.' }),
                  mc('4w2',1,{ question:'¿Cuál es la traducción de "spring"?', options:['primavera','verano','otoño','invierno'], correct:'primavera', explanation:'"Spring" = primavera.' }),
                  fb('4w3',1,{ sentence:"It's raining. Take your ___ .", answer:'umbrella', hint:'Lo que usas cuando llueve' }),
                  so('4w4',2,{ words:['very','today','It\'s','hot'], correct_order:["It's",'very','hot','today'] }),
                  mc('4w5',2,{ question:'¿Cuántos meses tiene un año?', options:['twelve','ten','eleven','eight'], correct:'twelve', explanation:'Un año = 12 meses = twelve months.' }),
                  fb('4w6',2,{ sentence:'The ___ month of the year is January.', answer:'first', hint:'Enero es el primer mes' }),
                  mc('4w7',3,{ question:'"In ___ the leaves fall from the trees."', options:['autumn','spring','summer','winter'], correct:'autumn', explanation:'"Autumn" (también "fall" en USA) = otoño.' }),
                ]
              },
              {
                id: 'l4-months-ordinals',
                title: 'Meses y Números Ordinales',
                duration_minutes: 6,
                exercises: [
                  mc('4mo1',1,{ question:'¿Cuál es el primer mes del año?', options:['January','February','March','December'], correct:'January', explanation:'"January" = enero, primer mes.' }),
                  mc('4mo2',1,{ question:'¿Cómo se dice "primero"?', options:['first','second','third','fourth'], correct:'first', explanation:'"First" = primero (1st).' }),
                  fb('4mo3',1,{ sentence:'My birthday is in ___ . (diciembre)', answer:'December', hint:'El último mes del año' }),
                  so('4mo4',2,{ words:['the','July','month','is','seventh'], correct_order:['July','is','the','seventh','month'] }),
                  mc('4mo5',2,{ question:'¿Cómo se dice "tercero"?', options:['third','second','fourth','first'], correct:'third', explanation:'"Third" = tercero (3rd).' }),
                  fb('4mo6',2,{ sentence:'February is the ___ month. (2do)', answer:'second', hint:'2do = second' }),
                  mc('4mo7',3,{ question:'"December is the ___ month of the year."', options:['twelfth','tenth','eleventh','thirteenth'], correct:'twelfth', explanation:'Diciembre = mes 12 = twelfth.' }),
                ]
              },
            ]
          },
        ]
      },

      // ══════════════════════════════════════════════════════════════════════
      // MÓDULO 5 — Presente Simple y Rutinas Diarias
      // Semanas 7-9 · 10 horas
      // ══════════════════════════════════════════════════════════════════════
      {
        id: 'mod5-present',
        title: 'Módulo 5 · Presente Simple',
        description: 'Acciones cotidianas, hábitos, la hora y frecuencia',
        emoji: '📅',
        sections: [
          {
            id: 's5-afirmaciones',
            title: 'Afirmaciones y Negaciones',
            lessons: [
              {
                id: 'l5-afirmativa',
                title: 'Presente Simple afirmativo: I work / She works',
                duration_minutes: 8,
                exercises: [
                  mc('5af1',1,{ question:'"She ___ to school every day."', options:['goes','go','going','went'], correct:'goes', explanation:'She/He/It → agrega -s o -es.' }),
                  fb('5af2',1,{ sentence:'I ___ coffee every morning.', answer:'drink', hint:'Con "I" el verbo no cambia' }),
                  so('5af3',1,{ words:['plays','He','football'], correct_order:['He','plays','football'] }),
                  mc('5af4',2,{ question:'"My sister ___ English very well."', options:['speaks','speak','speaking','spoke'], correct:'speaks', explanation:'"Sister" = she → agrega -s.' }),
                  fb('5af5',2,{ sentence:'We ___ in Bogotá.', answer:'live', hint:'Con "we" el verbo no cambia' }),
                  so('5af6',2,{ words:['every','She','reads','books','week'], correct_order:['She','reads','books','every','week'] }),
                  mc('5af7',3,{ question:'"The baby ___ a lot."', options:['cries','crys','cry','crying'], correct:'cries', explanation:'cry → -y con consonante antes → ies.' }),
                  fb('5af8',3,{ sentence:'He ___ his teeth twice a day.', answer:'brushes', hint:'brush → brush + es' }),
                ]
              },
              {
                id: 'l5-negativa',
                title: 'Negaciones: don\'t y doesn\'t',
                duration_minutes: 6,
                exercises: [
                  mc('5ng1',1,{ question:'"I ___ like coffee."', options:["don't","doesn't","not","isn't"], correct:"don't", explanation:'"I" → "don\'t".' }),
                  mc('5ng2',1,{ question:'"She ___ eat meat."', options:["doesn't","don't","not","isn't"], correct:"doesn't", explanation:'"She" → "doesn\'t".' }),
                  fb('5ng3',1,{ sentence:'They ___ speak French.', answer:"don't", hint:'"They" → don\'t' }),
                  so('5ng4',2,{ words:["don't","I","like","Mondays"], correct_order:['I',"don't",'like','Mondays'] }),
                  fb('5ng5',2,{ sentence:'He ___ play guitar.', answer:"doesn't", hint:'"He" → doesn\'t' }),
                  mc('5ng6',3,{ question:'"My dog ___ like strangers."', options:["doesn't","don't","not like","isn't like"], correct:"doesn't", explanation:'"My dog" = it → "doesn\'t".' }),
                  so('5ng7',3,{ words:['My','doesn\'t','dog','like','strangers'], correct_order:['My','dog',"doesn't",'like','strangers'] }),
                ]
              },
              {
                id: 'l5-preguntas',
                title: 'Preguntas: Do you? / Does she?',
                duration_minutes: 8,
                exercises: [
                  mc('5pq1',1,{ question:'"___ you speak English?"', options:['Do','Does','Are','Is'], correct:'Do', explanation:'"You/I/we/they" → "Do" en preguntas.' }),
                  mc('5pq2',1,{ question:'"___ she like pizza?"', options:['Does','Do','Is','Are'], correct:'Does', explanation:'"She/He/It" → "Does" en preguntas.' }),
                  so('5pq3',2,{ words:['you','Do','coffee','drink'], correct_order:['Do','you','drink','coffee'] }),
                  fb('5pq4',2,{ sentence:'___ they live in Medellín?', answer:'Do', hint:'"They" → Do' }),
                  mc('5pq5',2,{ question:'"___ your brother play football?"', options:['Does','Do','Is','Has'], correct:'Does', explanation:'"Brother" = he → Does.' }),
                  so('5pq6',3,{ words:['Does','work','she','here'], correct_order:['Does','she','work','here'] }),
                  mc('5pq7',3,{ question:'Respuesta corta: "Do you like music?" → "Yes, ___."', options:['I do','I does','I am','yes I'], correct:'I do', explanation:'Respuesta corta: "Yes, I do."' }),
                ]
              },
            ]
          },
          {
            id: 's5-frecuencia',
            title: 'Adverbios de Frecuencia y La Hora',
            lessons: [
              {
                id: 'l5-frequency',
                title: 'Always, usually, sometimes, never…',
                duration_minutes: 7,
                exercises: [
                  mc('5fr1',1,{ question:'¿Cuál significa "siempre"?', options:['always','never','sometimes','usually'], correct:'always', explanation:'"Always" = siempre (100%).' }),
                  mc('5fr2',1,{ question:'"Never" en español es:', options:['nunca','siempre','a veces','normalmente'], correct:'nunca', explanation:'"Never" = nunca (0%).' }),
                  fb('5fr3',1,{ sentence:'I ___ eat breakfast. (siempre)', answer:'always', hint:'Siempre = always' }),
                  so('5fr4',2,{ words:['usually','I','lunch','at','eat','noon'], correct_order:['I','usually','eat','lunch','at','noon'] }),
                  mc('5fr5',2,{ question:'"She ___ goes to the gym." (a veces)', options:['sometimes','never','always','usually'], correct:'sometimes', explanation:'"Sometimes" = a veces.' }),
                  mc('5fr6',2,{ question:'¿Dónde va el adverbio de frecuencia?', options:['Antes del verbo principal','Al final','Al inicio','Después del objeto'], correct:'Antes del verbo principal', explanation:'I always eat. / She never drinks. — antes del verbo.' }),
                  fb('5fr7',3,{ sentence:'He is ___ late for school. (rara vez)', answer:'rarely', hint:'Rara vez = rarely / seldom' }),
                ]
              },
              {
                id: 'l5-time',
                title: 'La hora: What time is it? / It\'s 3 o\'clock',
                duration_minutes: 7,
                exercises: [
                  mc('5ti1',1,{ question:'¿Cómo preguntas la hora?', options:["What time is it?","What is the hour?","How is the time?","Which time is?"], correct:"What time is it?", explanation:'"What time is it?" = ¿Qué hora es?' }),
                  mc('5ti2',1,{ question:'"It\'s 3 o\'clock." ¿Qué hora es?', options:['3:00','3:30','2:00','4:00'], correct:'3:00', explanation:'"O\'clock" marca la hora en punto.' }),
                  fb('5ti3',1,{ sentence:"It's half past seven. = It's ___ .", answer:'7:30', hint:'"Half past" = y media' }),
                  mc('5ti4',2,{ question:'"It\'s quarter to five." ¿Qué hora es?', options:['4:45','5:15','4:15','5:45'], correct:'4:45', explanation:'"Quarter to" = quince para. Quarter to five = 4:45.' }),
                  so('5ti5',2,{ words:['is','time','What','it'], correct_order:['What','time','is','it'] }),
                  fb('5ti6',2,{ sentence:"School starts at ___ in the morning. (8:00)", answer:'eight o\'clock', hint:'8 = eight o\'clock' }),
                  mc('5ti7',3,{ question:'"It\'s ten past nine." ¿Qué hora es?', options:['9:10','9:50','10:09','8:50'], correct:'9:10', explanation:'"Ten past nine" = nueve y diez = 9:10.' }),
                ]
              },
              {
                id: 'l5-preposiciones-tiempo',
                title: 'Preposiciones de tiempo: at, in, on',
                duration_minutes: 6,
                exercises: [
                  mc('5pt1',1,{ question:'"___ Monday" — ¿qué preposición?', options:['on','at','in','by'], correct:'on', explanation:'"On" se usa con días: on Monday, on Friday.' }),
                  mc('5pt2',1,{ question:'"___ 6 o\'clock" — ¿qué preposición?', options:['at','in','on','by'], correct:'at', explanation:'"At" se usa con horas: at 6 o\'clock.' }),
                  fb('5pt3',1,{ sentence:'I was born ___ January.', answer:'in', hint:'"In" con meses y años' }),
                  so('5pt4',2,{ words:['at','I','up','wake','seven'], correct_order:['I','wake','up','at','seven'] }),
                  mc('5pt5',2,{ question:'"She studies ___ the morning."', options:['in','on','at','by'], correct:'in', explanation:'"In the morning/afternoon/evening" para partes del día.' }),
                  fb('5pt6',2,{ sentence:'My birthday is ___ August 15th.', answer:'on', hint:'"On" con fechas específicas' }),
                  mc('5pt7',3,{ question:'"The meeting is ___ noon."', options:['at','in','on','during'], correct:'at', explanation:'"At noon, at midnight, at night" — momentos específicos.' }),
                ]
              },
            ]
          },
        ]
      },

      // ══════════════════════════════════════════════════════════════════════
      // MÓDULO 6 — Situaciones Comunicativas Reales
      // Semanas 9-11 · 8 horas
      // ══════════════════════════════════════════════════════════════════════
      {
        id: 'mod6-situaciones',
        title: 'Módulo 6 · Situaciones Reales',
        description: 'Restaurante, compras, direcciones, transporte y la hora',
        emoji: '🗺️',
        sections: [
          {
            id: 's6-servicios',
            title: 'En el Restaurante y las Compras',
            lessons: [
              {
                id: 'l6-restaurant',
                title: 'En el restaurante: pedir comida y bebida',
                duration_minutes: 8,
                exercises: [
                  mc('6r1',1,{ question:'¿Cómo pides algo en un restaurante?', options:["I'd like a pizza, please.","Give me pizza.","Pizza want I.","Me give pizza please."], correct:"I'd like a pizza, please.", explanation:'"I\'d like + objeto + please" es la forma educada.' }),
                  mc('6r2',1,{ question:'"Can I see the menu, please?" significa:', options:['¿Puedo ver el menú?','¿Cuánto cuesta?','¿Está lista la orden?','¿Qué me recomienda?'], correct:'¿Puedo ver el menú?', explanation:'"Menu" = carta/menú del restaurante.' }),
                  fb('6r3',1,{ sentence:"I'd like a glass of ___, please. (agua)", answer:'water', hint:'Agua = water' }),
                  so('6r4',2,{ words:['chicken','I','the','like','would'], correct_order:['I','would','like','the','chicken'] }),
                  mc('6r5',2,{ question:'"How much is it?" significa:', options:['¿Cuánto cuesta?','¿Está rico?','¿Cuántas porciones?','¿Qué es esto?'], correct:'¿Cuánto cuesta?', explanation:'"How much" pregunta el precio.' }),
                  fb('6r6',2,{ sentence:'Could we have the ___, please? (cuenta)', answer:'bill', hint:'La cuenta = the bill' }),
                  mc('6r7',3,{ question:'"The food was delicious!" ¿Qué significa?', options:['¡La comida estaba deliciosa!','¡La comida era cara!','¡Quiero más comida!','¡La comida llegó tarde!'], correct:'¡La comida estaba deliciosa!', explanation:'"Delicious" = delicioso/a.' }),
                  so('6r8',3,{ words:['please','table','a','for','two','like','I\'d'], correct_order:["I'd",'like','a','table','for','two','please'] }),
                ]
              },
              {
                id: 'l6-shopping',
                title: 'De compras: precios, tallas y colores',
                duration_minutes: 7,
                exercises: [
                  mc('6sh1',1,{ question:'¿Cómo preguntas el precio?', options:['How much is it?','How many is it?','What cost is?','Price how much?'], correct:'How much is it?', explanation:'"How much is it?" = ¿Cuánto cuesta?' }),
                  mc('6sh2',1,{ question:'"Do you have this in a larger size?" significa:', options:['¿Lo tienen en talla más grande?','¿De qué color es?','¿Está en oferta?','¿Cuántos quedan?'], correct:'¿Lo tienen en talla más grande?', explanation:'"Larger size" = talla más grande.' }),
                  fb('6sh3',1,{ sentence:'This shirt is on ___. It\'s 50% off! (oferta)', answer:'sale', hint:'Descuento = on sale' }),
                  so('6sh4',2,{ words:['blue','this','Do','in','you','have'], correct_order:['Do','you','have','this','in','blue'] }),
                  mc('6sh5',2,{ question:'"I\'ll take it!" ¿Qué significa?', options:['¡Me lo llevo!','¡No lo quiero!','¡Es muy caro!','¡Lo pensaré!'], correct:'¡Me lo llevo!', explanation:'"I\'ll take it" = Me lo llevo. Indica que comprará el artículo.' }),
                  fb('6sh6',2,{ sentence:'Can I pay by ___ ? (tarjeta)', answer:'card', hint:'Con tarjeta de crédito/débito' }),
                  mc('6sh7',3,{ question:'"Do you accept credit cards?" ¿Qué preguntas?', options:['¿Aceptan tarjetas de crédito?','¿Tienen efectivo?','¿Cuánto debo?','¿Dónde está la caja?'], correct:'¿Aceptan tarjetas de crédito?', explanation:'"Accept" = aceptar, "credit card" = tarjeta de crédito.' }),
                ]
              },
            ]
          },
          {
            id: 's6-ciudad',
            title: 'Direcciones y Transporte',
            lessons: [
              {
                id: 'l6-directions',
                title: 'Pedir y dar direcciones',
                duration_minutes: 8,
                exercises: [
                  mc('6d1',1,{ question:'¿Cómo preguntas dónde está el banco?', options:['Where is the bank?','How is the bank?','What is the bank?','Who is the bank?'], correct:'Where is the bank?', explanation:'"Where" pregunta el lugar.' }),
                  mc('6d2',1,{ question:'"Turn left" significa:', options:['Gira a la izquierda','Gira a la derecha','Sigue recto','Para aquí'], correct:'Gira a la izquierda', explanation:'"Left" = izquierda, "right" = derecha.' }),
                  fb('6d3',1,{ sentence:'Go ___ for two blocks, then turn right.', answer:'straight', hint:'Seguir recto = go straight' }),
                  so('6d4',2,{ words:['the','Where','is','pharmacy'], correct_order:['Where','is','the','pharmacy'] }),
                  mc('6d5',2,{ question:'"The bank is next to the supermarket." ¿Qué significa?', options:['El banco está al lado del supermercado','El banco está enfrente','El banco está detrás','El banco está lejos'], correct:'El banco está al lado del supermercado', explanation:'"Next to" = al lado de.' }),
                  so('6d6',2,{ words:['right','Turn','at','corner','the'], correct_order:['Turn','right','at','the','corner'] }),
                  mc('6d7',3,{ question:'"It\'s across from the park." ¿Dónde está?', options:['Enfrente del parque','Detrás del parque','Al lado del parque','Dentro del parque'], correct:'Enfrente del parque', explanation:'"Across from" = enfrente de.' }),
                ]
              },
              {
                id: 'l6-transport',
                title: 'Medios de transporte y cómo usarlos',
                duration_minutes: 6,
                exercises: [
                  mc('6tr1',1,{ question:'¿Cómo se dice "autobús"?', options:['bus','taxi','metro','train'], correct:'bus', explanation:'"Bus" = autobús.' }),
                  mc('6tr2',1,{ question:'"I take the ___ to work." (metro/tren subterráneo)', options:['subway','bus','car','bike'], correct:'subway', explanation:'"Subway" (USA) = metro. También "underground" o "tube" (UK).' }),
                  fb('6tr3',1,{ sentence:'I ride my ___ to school. (bicicleta)', answer:'bike', hint:'Bicicleta = bike' }),
                  mc('6tr4',2,{ question:'"How do you get to work?" significa:', options:['¿Cómo llegas al trabajo?','¿A qué hora llegas?','¿Cuánto tardas?','¿Con quién vas?'], correct:'¿Cómo llegas al trabajo?', explanation:'"How do you get to...?" = ¿Cómo llegas a...?' }),
                  so('6tr5',2,{ words:['take','I','bus','the','to','school'], correct_order:['I','take','the','bus','to','school'] }),
                  mc('6tr6',3,{ question:'"I get to school on foot." ¿Cómo llega?', options:['Caminando','En bus','En carro','En bicicleta'], correct:'Caminando', explanation:'"On foot" = a pie, caminando.' }),
                ]
              },
            ]
          },
          {
            id: 's6-there',
            title: 'There is / There are y Can / Can\'t',
            lessons: [
              {
                id: 'l6-there-is',
                title: 'There is / There are: describir lugares',
                duration_minutes: 5,
                exercises: [
                  mc('6th1',1,{ question:'"___ a hospital near here."', options:['There is','There are','Is there','Are there'], correct:'There is', explanation:'"There is" + singular.' }),
                  mc('6th2',1,{ question:'"___ many parks in the city."', options:['There are','There is','Is there','Are there'], correct:'There are', explanation:'"There are" + plural.' }),
                  fb('6th3',2,{ sentence:'___ a bank on Main Street.', answer:'There is', hint:'Singular → There is' }),
                  so('6th4',2,{ words:['a','the','There','in','is','café','corner'], correct_order:['There','is','a','café','in','the','corner'] }),
                  mc('6th5',3,{ question:'"Are there any seats available?"', options:['Sí, pregunta si hay asientos','No, afirma que hay','Sí, pide asientos','No, niega los asientos'], correct:'Sí, pregunta si hay asientos', explanation:'"Are there...?" pregunta si existe algo.' }),
                ]
              },
              {
                id: 'l6-can',
                title: 'Can / Can\'t: permisos y habilidades',
                duration_minutes: 7,
                exercises: [
                  mc('6cn1',1,{ question:'"She ___ swim very well."', options:['can','cans','is can','does can'], correct:'can', explanation:'"Can" no cambia con ningún sujeto.' }),
                  fb('6cn2',1,{ sentence:'I ___ speak English!', answer:'can', hint:'Habilidad → can' }),
                  mc('6cn3',1,{ question:'"He ___ fly." (negativo)', options:["can't","cans't","don't can","not can"], correct:"can't", explanation:'"Cannot" → "can\'t".' }),
                  so('6cn4',2,{ words:['guitar','play','can','She','the'], correct_order:['She','can','play','the','guitar'] }),
                  mc('6cn5',2,{ question:'"Can I use the bathroom?" — ¿para qué usas "can" aquí?', options:['Pedir permiso','Expresar habilidad','Dar una orden','Hacer una sugerencia'], correct:'Pedir permiso', explanation:'"Can I...?" pide permiso en inglés.' }),
                  fb('6cn6',2,{ sentence:'"___ you help me, please?" (¿Puedes ayudarme?)', answer:'Can', hint:'Can you...? = ¿Puedes...?' }),
                  mc('6cn7',3,{ question:'"You can\'t park here." — ¿qué significa?', options:['No puedes estacionar aquí','No puedes entrar aquí','No puedes hablar aquí','No puedes comer aquí'], correct:'No puedes estacionar aquí', explanation:'"Park" = estacionar. "Can\'t park" = no puedes estacionar.' }),
                ]
              },
            ]
          },
        ]
      },

      // ══════════════════════════════════════════════════════════════════════
      // MÓDULO 7 — Pasado Simple y Narración Básica
      // Semanas 11-13 · 8 horas
      // ══════════════════════════════════════════════════════════════════════
      {
        id: 'mod7-pasado',
        title: 'Módulo 7 · Pasado Simple',
        description: 'Was/were, verbos regulares e irregulares, narración de eventos',
        emoji: '⏰',
        sections: [
          {
            id: 's7-was-were',
            title: 'To Be en Pasado',
            lessons: [
              {
                id: 'l7-was-were',
                title: 'Was / Were: To Be en pasado',
                duration_minutes: 7,
                exercises: [
                  mc('7ww1',1,{ question:'"I ___ happy yesterday."', options:['was','were','am','is'], correct:'was', explanation:'"Was" es el pasado de "am/is" (I, he, she, it).' }),
                  mc('7ww2',1,{ question:'"They ___ at school."', options:['were','was','are','is'], correct:'were', explanation:'"Were" es el pasado de "are" (you, we, they).' }),
                  fb('7ww3',1,{ sentence:'It ___ very cold last night.', answer:'was', hint:'"It" → was' }),
                  so('7ww4',2,{ words:['at','was','yesterday','She','home'], correct_order:['She','was','at','home','yesterday'] }),
                  mc('7ww5',2,{ question:'"Where ___ you born?"', options:['were','was','are','did'], correct:'were', explanation:'"You" en pasado → "were".' }),
                  fb('7ww6',2,{ sentence:'My parents ___ not at home. (contracción)', answer:"weren't", hint:'"were not" → "weren\'t"' }),
                  mc('7ww7',3,{ question:'"___ the movie good?" (pregunta)', options:['Was','Were','Did','Is'], correct:'Was', explanation:'"The movie" = it → "Was it good?"' }),
                  so('7ww8',3,{ words:['great','yesterday','was','The','weather'], correct_order:['The','weather','was','great','yesterday'] }),
                ]
              },
            ]
          },
          {
            id: 's7-regular',
            title: 'Past Simple: Verbos Regulares',
            lessons: [
              {
                id: 'l7-regular',
                title: 'Verbos regulares en pasado: -ed',
                duration_minutes: 8,
                exercises: [
                  mc('7rg1',1,{ question:'¿Cómo formas el pasado de "walk"?', options:['walked','walkd','walking','walks'], correct:'walked', explanation:'"Walk" → walked (+ ed).' }),
                  fb('7rg2',1,{ sentence:'She ___ TV last night. (watch)', answer:'watched', hint:'watch + ed = watched' }),
                  mc('7rg3',2,{ question:'Pasado de "study":', options:['studied','studyed','studid','studeed'], correct:'studied', explanation:'"Study" termina en consonante + y → ied: studied.' }),
                  so('7rg4',2,{ words:['last','I','week','worked'], correct_order:['I','worked','last','week'] }),
                  fb('7rg5',2,{ sentence:'He ___ to music all afternoon. (listen)', answer:'listened', hint:'listen + ed = listened' }),
                  mc('7rg6',2,{ question:'Pasado de "stop":', options:['stopped','stoped','stopping','stops'], correct:'stopped', explanation:'"Stop" dobla la consonante final: stopped.' }),
                  so('7rg7',3,{ words:['played','They','park','in','the','football'], correct_order:['They','played','football','in','the','park'] }),
                  mc('7rg8',3,{ question:'Pasado de "dance":', options:['danced','danceed','dancing','dancd'], correct:'danced', explanation:'"Dance" termina en -e, solo agrega -d: danced.' }),
                ]
              },
            ]
          },
          {
            id: 's7-irregular',
            title: 'Verbos Irregulares y Preguntas',
            lessons: [
              {
                id: 'l7-irregular',
                title: 'Verbos irregulares más comunes',
                duration_minutes: 8,
                exercises: [
                  mc('7ir1',1,{ question:'Pasado de "go":', options:['went','goed','going','gone'], correct:'went', explanation:'"Go" → went (irregular).' }),
                  mc('7ir2',1,{ question:'Pasado de "have":', options:['had','haved','having','has'], correct:'had', explanation:'"Have" → had (irregular).' }),
                  fb('7ir3',1,{ sentence:'She ___ a great time at the party. (have)', answer:'had', hint:'have → had' }),
                  mc('7ir4',2,{ question:'Pasado de "eat":', options:['ate','eated','eating','eat'], correct:'ate', explanation:'"Eat" → ate (irregular).' }),
                  so('7ir5',2,{ words:['to','last','went','She','weekend','the','beach'], correct_order:['She','went','to','the','beach','last','weekend'] }),
                  mc('7ir6',2,{ question:'Pasado de "see":', options:['saw','seed','seen','sawn'], correct:'saw', explanation:'"See" → saw (irregular).' }),
                  fb('7ir7',3,{ sentence:'I ___ my friend yesterday at the mall. (see)', answer:'saw', hint:'see → saw' }),
                  mc('7ir8',3,{ question:'Pasado de "buy":', options:['bought','buyed','buying','buied'], correct:'bought', explanation:'"Buy" → bought (irregular).' }),
                ]
              },
              {
                id: 'l7-negativa-pregunta',
                title: 'Negativa: didn\'t / Preguntas: Did you?',
                duration_minutes: 7,
                exercises: [
                  mc('7np1',1,{ question:'¿Cómo niegas en pasado simple?', options:["didn't + verb","wasn't + verb","don't + verb","not + verb"], correct:"didn't + verb", explanation:'"Didn\'t" = did not. Se usa para todos los sujetos.' }),
                  fb('7np2',1,{ sentence:'I ___ watch TV last night.', answer:"didn't", hint:'"did not" → "didn\'t"' }),
                  mc('7np3',1,{ question:'"Did you go to the party?"', options:['¿Fuiste a la fiesta?','¿Vas a la fiesta?','¿Irás a la fiesta?','¿Estás en la fiesta?'], correct:'¿Fuiste a la fiesta?', explanation:'"Did you + verb?" pregunta en pasado.' }),
                  so('7np4',2,{ words:["didn't","She","school","yesterday","go","to"], correct_order:['She',"didn't",'go','to','school','yesterday'] }),
                  mc('7np5',2,{ question:'Respuesta corta: "Did he call?" → "No, ___."', options:["he didn't","he don't","he wasn't","he no"], correct:"he didn't", explanation:'"No, he didn\'t." = Respuesta corta negativa.' }),
                  fb('7np6',2,{ sentence:'___ they arrive on time?', answer:'Did', hint:'"Did" comienza preguntas en pasado' }),
                  so('7np7',3,{ words:['go','did','you','yesterday','Where'], correct_order:['Where','did','you','go','yesterday'] }),
                  mc('7np8',3,{ question:'"What ___ you do last weekend?"', options:['did','were','was','do'], correct:'did', explanation:'"What did you do?" = ¿Qué hiciste?' }),
                ]
              },
            ]
          },
        ]
      },

      // ══════════════════════════════════════════════════════════════════════
      // MÓDULO 8 — Habilidades Integradas y Preparación A1
      // Semanas 13-16 · 8 horas
      // (Audio/Speaking/Writing → pendiente generación con IA)
      // ══════════════════════════════════════════════════════════════════════
      {
        id: 'mod8-repaso',
        title: 'Módulo 8 · Repaso y Examen A1',
        description: 'Repaso de gramática, vocabulario clave y simulacro de examen',
        emoji: '🏆',
        sections: [
          {
            id: 's8-grammar-review',
            title: 'Repaso de Gramática',
            lessons: [
              {
                id: 'l8-grammar-mix',
                title: 'Repaso completo: todos los puntos gramaticales',
                duration_minutes: 15,
                exercises: [
                  mc('8gm1',1,{ question:'"She ___ happy right now."', options:['is','are','am','be'], correct:'is', explanation:'Presente: She → is.' }),
                  mc('8gm2',1,{ question:'"I ___ go to school yesterday." (pasado negativo)', options:["didn't","don't","wasn't","weren't"], correct:"didn't", explanation:'Pasado negativo: didn\'t + verbo base.' }),
                  fb('8gm3',1,{ sentence:'There ___ five students in the classroom.', answer:'are', hint:'Five students = plural → are' }),
                  mc('8gm4',2,{ question:'"___ you speak French?" (presente)', options:['Do','Does','Did','Are'], correct:'Do', explanation:'Pregunta presente con "you" → Do.' }),
                  so('8gm5',2,{ words:['can','She','sing','but','dance','can\'t','she'], correct_order:['She','can','sing','but','she',"can't",'dance'] }),
                  mc('8gm6',2,{ question:'"They ___ at the park yesterday." (pasado)', options:['were','are','was','is'], correct:'were', explanation:'"They" en pasado → were.' }),
                  fb('8gm7',2,{ sentence:'I ___ my keys. Where are they? (pasado de "lose")', answer:'lost', hint:'lose → lost (irregular)' }),
                  mc('8gm8',3,{ question:'"She ___ her homework every day." (hábito)', options:['does','did','is doing','do'], correct:'does', explanation:'Hábito en presente + she → does.' }),
                  so('8gm9',3,{ words:['always','She','to','early','goes','bed'], correct_order:['She','always','goes','to','bed','early'] }),
                  mc('8gm10',3,{ question:'"___ children love to play." (artículo)', options:['—','The','A','An'], correct:'—', explanation:'Sin artículo con sustantivos plurales en afirmaciones generales: "Children love to play."' }),
                ]
              },
            ]
          },
          {
            id: 's8-vocab-review',
            title: 'Repaso de Vocabulario',
            lessons: [
              {
                id: 'l8-vocab-500',
                title: 'Las 500 palabras clave del A1',
                duration_minutes: 15,
                exercises: [
                  mc('8vr1',1,{ question:'¿Qué significa "beautiful"?', options:['hermoso/a','feo/a','grande','pequeño'], correct:'hermoso/a', explanation:'"Beautiful" = hermoso, bello.' }),
                  mc('8vr2',1,{ question:'¿Qué significa "important"?', options:['importante','interesante','diferente','divertido'], correct:'importante', explanation:'"Important" = importante.' }),
                  fb('8vr3',1,{ sentence:'I need to ___ my room. (limpiar)', answer:'clean', hint:'Limpiar = clean' }),
                  mc('8vr4',2,{ question:'"I am excited!" ¿Cómo te sientes?', options:['Emocionado','Cansado','Aburrido','Enojado'], correct:'Emocionado', explanation:'"Excited" = emocionado, entusiasmado.' }),
                  so('8vr5',2,{ words:['every','She','Spanish','studies','day'], correct_order:['She','studies','Spanish','every','day'] }),
                  mc('8vr6',2,{ question:'¿Qué significa "delicious"?', options:['delicioso','peligroso','interesante','caro'], correct:'delicioso', explanation:'"Delicious" = delicioso.' }),
                  mc('8vr7',2,{ question:'"Busy" en español es:', options:['ocupado','aburrido','cansado','feliz'], correct:'ocupado', explanation:'"Busy" = ocupado.' }),
                  fb('8vr8',3,{ sentence:'Can you ___ me? I don\'t understand. (ayudar)', answer:'help', hint:'Ayudar = help' }),
                  mc('8vr9',3,{ question:'"I feel ___ today. I need to rest." (cansado)', options:['tired','excited','happy','bored'], correct:'tired', explanation:'"Tired" = cansado.' }),
                  mc('8vr10',3,{ question:'¿Qué significa "practice"?', options:['practicar','preparar','producir','planear'], correct:'practicar', explanation:'"Practice" = practicar (también sustantivo: la práctica).' }),
                ]
              },
              {
                id: 'l8-mini-exam',
                title: 'Simulacro de Examen A1 (estilo Cambridge KET)',
                duration_minutes: 20,
                exercises: [
                  mc('8ex1',1,{ question:'"What is your name?" → Respuesta correcta:', options:['My name is Ana.','I am from Colombia.','I am fine.','My name Ana.'], correct:'My name is Ana.', explanation:'"My name is ___" es la estructura correcta.' }),
                  mc('8ex2',1,{ question:'Elige la oración correcta:', options:["She doesn't like coffee.","She don't like coffee.","She not like coffee.","She isn't like coffee."], correct:"She doesn't like coffee.", explanation:'"She" + negativa presente → "doesn\'t".' }),
                  so('8ex3',2,{ words:['school','go','every','I','to','day'], correct_order:['I','go','to','school','every','day'] }),
                  mc('8ex4',2,{ question:'"Yesterday, I ___ to the store." (ir)', options:['went','go','goes','gone'], correct:'went', explanation:'"Go" → pasado irregular: went.' }),
                  fb('8ex5',2,{ sentence:'There ___ 30 students in my class.', answer:'are', hint:'30 students = plural → are' }),
                  mc('8ex6',2,{ question:'"Can you speak more slowly, please?" — ¿qué significa "slowly"?', options:['despacio','rápido','claramente','fuerte'], correct:'despacio', explanation:'"Slowly" = despacio, lentamente.' }),
                  so('8ex7',3,{ words:['last','did','What','weekend','you','do'], correct_order:['What','did','you','do','last','weekend'] }),
                  mc('8ex8',3,{ question:'Elige la oración correcta en pasado:', options:["I didn't go to the party.","I didn't went to the party.","I not went to party.","I no go to party."], correct:"I didn't go to the party.", explanation:'"Didn\'t" + verbo base (no pasado).' }),
                  fb('8ex9',3,{ sentence:'She ___ born in 2010. (was/were)', answer:'was', hint:'"She" → was en pasado' }),
                  mc('8ex10',3,{ question:'"The children were playing in ___."', options:['the park','a park','park','parks'], correct:'the park', explanation:'"The park" = el parque (específico que ya conocen).' }),
                ]
              },
            ]
          },
        ]
      },

    ]
  }
]

// ─────────────────────────────────────────────────────────────────────────────
export function getDemoLesson(lessonId: string): DemoLesson | null {
  for (const level of DEMO_LEVELS) {
    for (const module of level.modules) {
      for (const section of module.sections) {
        for (const lesson of section.lessons) {
          if (lesson.id === lessonId) return lesson
        }
      }
    }
  }
  return null
}

export function getDemoModule(moduleId: string): { module: DemoModule; levelId: string } | null {
  for (const level of DEMO_LEVELS) {
    for (const module of level.modules) {
      if (module.id === moduleId) return { module, levelId: level.id }
    }
  }
  return null
}
