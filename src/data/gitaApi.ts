// API gratuita del Bhagavad Gita — sin key
// https://vedicscriptures.github.io

export interface Verso {
  chapter: number;
  verse: number;
  text: string;        // sánscrito
  transliteration: string;
  word_meanings: string;
  translations: { author_name: string; language: string; description: string }[];
}

export interface Capitulo {
  chapter_number: number;
  name: string;
  name_meaning: string;
  name_translation: string;
  verses_count: number;
  chapter_summary: string;
}

export async function getCapitulosGita(): Promise<Capitulo[]> {
  const res = await fetch('https://vedicscriptures.github.io/chapters');
  if (!res.ok) throw new Error('Error cargando capítulos');
  return res.json();
}

export async function getVersosCapitulo(capitulo: number): Promise<Verso[]> {
  const res = await fetch(`https://vedicscriptures.github.io/chapter/${capitulo}`);
  if (!res.ok) throw new Error('Error cargando versos');
  return res.json();
}

export async function getVerso(capitulo: number, verso: number): Promise<Verso> {
  const res = await fetch(`https://vedicscriptures.github.io/chapter/${capitulo}/verse/${verso}`);
  if (!res.ok) throw new Error('Error cargando verso');
  return res.json();
}

// Versos destacados hardcodeados (para offline)
export const VERSOS_DESTACADOS = [
  {
    ref: 'गीता 2:47',
    texto: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।',
    significado: 'तुम्हें केवल कर्म करने का अधिकार है, फल की चिंता मत करो।',
  },
  {
    ref: 'गीता 2:20',
    texto: 'न जायते म्रियते वा कदाचित्।',
    significado: 'आत्मा न कभी जन्म लेती है और न कभी मरती है।',
  },
  {
    ref: 'गीता 4:7',
    texto: 'यदा यदा हि धर्मस्य ग्लानिर्भवति भारत।',
    significado: 'जब-जब धर्म की हानि होती है, तब-तब मैं प्रकट होता हूं।',
  },
  {
    ref: 'गीता 9:22',
    texto: 'अनन्याश्चिन्तयन्तो मां ये जनाः पर्युपासते।',
    significado: 'जो मुझे एकाग्र मन से भजते हैं, उनकी मैं स्वयं रक्षा करता हूं।',
  },
  {
    ref: 'गीता 18:66',
    texto: 'सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज।',
    significado: 'सभी धर्मों को छोड़कर मेरी शरण में आओ, मैं तुम्हें मुक्त कर दूंगा।',
  },
];

export function getVersoDelDia() {
  const hoy = new Date();
  const idx = (hoy.getFullYear() * 365 + hoy.getMonth() * 30 + hoy.getDate()) % VERSOS_DESTACADOS.length;
  return VERSOS_DESTACADOS[idx];
}
