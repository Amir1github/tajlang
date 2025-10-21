import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { word, language = 'en' } = await request.json();

    if (!word) {
      return NextResponse.json(
        { error: 'Word is required' },
        { status: 400 }
      );
    }

    // Здесь можно интегрировать с реальным API Ameena
    // Пока используем заглушку с более реалистичными описаниями
    const descriptions = {
      en: {
        'салом': 'A common Tajik greeting meaning "hello" or "peace". Used in both formal and informal situations.',
        'рахмат': 'Tajik word for "thank you" or "thanks". Used to express gratitude.',
        'хуб': 'Tajik word meaning "good" or "well". Can be used as an adjective or adverb.',
        'забон': 'Tajik word for "language" or "tongue". Refers to the ability to speak a language.',
        'книга': 'Tajik word for "book". Used to refer to any written material or publication.',
        'донишгох': 'Tajik word for "university" or "institute of higher education".',
        'хона': 'Tajik word for "house" or "home". Refers to a place where someone lives.',
        'омеда': 'Tajik word for "welcome" or "come in". Used as a greeting when someone arrives.',
        'хуш омадед': 'Tajik phrase meaning "welcome" or "you are welcome here".',
        'ташаккур': 'Tajik word for "thanks" or "gratitude". More formal than "рахмат".'
      },
      ru: {
        'салом': 'Распространенное таджикское приветствие, означающее "привет" или "мир". Используется в формальных и неформальных ситуациях.',
        'рахмат': 'Таджикское слово, означающее "спасибо" или "благодарю". Используется для выражения благодарности.',
        'хуб': 'Таджикское слово, означающее "хорошо" или "хороший". Может использоваться как прилагательное или наречие.',
        'забон': 'Таджикское слово, означающее "язык" или "речь". Относится к способности говорить на языке.',
        'книга': 'Таджикское слово, означающее "книга". Используется для обозначения любого письменного материала или публикации.',
        'донишгох': 'Таджикское слово, означающее "университет" или "институт высшего образования".',
        'хона': 'Таджикское слово, означающее "дом" или "жилище". Относится к месту, где кто-то живет.',
        'омеда': 'Таджикское слово, означающее "добро пожаловать" или "заходите". Используется как приветствие при прибытии.',
        'хуш омадед': 'Таджикская фраза, означающая "добро пожаловать" или "вы здесь желанны".',
        'ташаккур': 'Таджикское слово, означающее "спасибо" или "благодарность". Более формальное, чем "рахмат".'
      }
    };

    // Проверяем, есть ли предопределенное описание
    const predefinedDescription = descriptions[language as 'en' | 'ru']?.[word.toLowerCase()];
    
    if (predefinedDescription) {
      return NextResponse.json({
        description: predefinedDescription,
        source: 'predefined'
      });
    }

    // Если нет предопределенного описания, генерируем общее
    const generalDescriptions = {
      en: `A Tajik word meaning "${word}". This word is commonly used in Tajik language and culture.`,
      ru: `Таджикское слово, означающее "${word}". Это слово широко используется в таджикском языке и культуре.`
    };

    return NextResponse.json({
      description: generalDescriptions[language as 'en' | 'ru'],
      source: 'generated'
    });

  } catch (error) {
    console.error('Error in Ameena describe API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
