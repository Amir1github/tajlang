'use client';

import { useState } from 'react';
import { useRouter } from 'expo-router';

export default function PrivacyPolicyPage() {
  const router = useRouter();
  const [language, setLanguage] = useState<'ru' | 'en' | 'tj'>('ru');

  const content = {
    ru: {
      title: 'Политика конфиденциальности TajLang',
      body: `
TajLang — это сервис для изучения таджикского языка с помощью уровней, тестов и лидерборда.

Мы собираем следующие данные:
- Email и имя пользователя при входе через Google или Facebook
- Никнейм и аватар, если вы укажете их в профиле

Данные хранятся в Supabase и защищены двухфакторной аутентификацией и резервным копированием. Мы не передаём информацию третьим лицам.

Сервис предлагает:
- Уровни с тестами
- Профиль с прогрессом и очками
- Возможность смены пароля и выхода из аккаунта
- Лидерборд с текущими лучшими пользователями

Нет возрастных ограничений.

Контакт: khaitovamir@gmail.com
      `,
    },
    en: {
      title: 'TajLang Privacy Policy',
      body: `
TajLang is a service for learning Tajik through levels, quizzes, and a leaderboard.

We collect:
- Email and name when signing in with Google or Facebook
- Nickname and avatar if provided

Data is stored in Supabase with two-factor authentication and backups. We do not share data with third parties.

Features include:
- Learning levels with tests
- Profile with progress and points
- Password change and sign-out options
- Leaderboard with top users

No age restrictions.

Contact: khaitovamir@gmail.com
      `,
    },
    tj: {
      title: 'Сиёсати махфиятии TajLang',
      body: `
TajLang — хидматрасон барои омӯзиши забони тоҷикӣ тавассути сатҳҳо, тестҳо ва рейтинг мебошад.

Маълумоти ҷамъоваришаванда:
- Почтаи электронӣ ва ном аз ҳисоби Google ё Facebook
- Лақаб ва аватар (агар нишон дода бошед)

Маълумот дар Supabase нигоҳ дошта мешавад ва бо аутентификатсияи дуқадамӣ муҳофизат мешавад. Мо маълумотро ба шахсони сеюм намедиҳем.

Имкониятҳо:
- Сатҳҳои омӯзишӣ бо тестҳо
- Профил бо хол ва сатҳҳои гузашта
- Иваз кардани парол ва баромадан аз аккаунт
- Рейтинги беҳтарин истифодабарандагон

Маҳдудияти синну сол нест.

Тамос: khaitovamir@gmail.com
      `,
    },
  };

  return (
    <div className="page-container">
      {/* Языковой переключатель */}
      <div className="lang-switcher">
        <button onClick={() => setLanguage('tj')}>Тоҷикӣ</button>
        <button onClick={() => setLanguage('en')}>English</button>
        <button onClick={() => setLanguage('ru')}>Русский</button>
      </div>

      {/* Заголовок */}
      <h1>{content[language].title}</h1>

      {/* Текст */}
      <pre>{content[language].body}</pre>

      {/* Кнопка домой */}
      <button className="home-btn" onClick={() => router.push('/')}>
        На главную
      </button>

      {/* Стили */}
      <style jsx>{`
        .page-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          height: 100vh;
          overflow-y: auto;
          font-family: sans-serif;
        }

        .lang-switcher {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
        }

        h1 {
          font-size: 24px;
          margin-bottom: 16px;
        }

        pre {
          white-space: pre-wrap;
          line-height: 1.6;
          margin-bottom: 20px;
        }

        .home-btn {
          background-color: #0070f3;
          color: white;
          padding: 10px 16px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }

        .home-btn:hover {
          background-color: #0059c1;
        }
      `}</style>
    </div>
  );
}
