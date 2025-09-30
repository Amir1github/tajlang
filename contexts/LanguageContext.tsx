import React, { createContext, useContext, useState, useCallback } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';

type Language = 'en' | 'ru';
type Theme = 'light' | 'dark';

type TranslationKey = string;

type Translations = {
  [key in Language]: {
    [key: string]: string;
  };
};

const translations: Translations = {
  en: {
    Nickname: 'Nickname',
    Status: 'Status',
    Description: 'Description',
    Points: 'Points',
    BestStreak: 'Best Streak',
    lessons: 'lessons',
    NoDescription: 'No description',
    modeChanged: 'Mode changed',
     delete : 'Delete',
     cancel : 'Cancel',
     deleteChat : 'Delete Chat',
     noSavedChats : 'No saved chats',
     createNewChat : 'Create New Chat',
      back : 'Back',
      newChat : 'New Chat',
      tajikLanguageChat : 'Tajik Language Chat',
    exitTestMessage: 'Are you sure you want to exit. The progress will not be saved',

    exitTestTitle: 'Exiting the test',
    exit: 'Exit',
    NewChat: 'New Chat', 
   
    listChats: 'Chat List', 
    chats: 'Chats',
    preparation: 'Preparation',
    proceedToReading: 'Proceed To Reading',
    reading: 'Reading',
    online: 'Online',
offline: 'Offline',
lastSeen: 'Last seen',
minutesAgo: 'm ago',
hoursAgo: 'h ago', 
daysAgo: 'd ago',
    translatorTitle: 'Tajik Language Translator',
    warning: 'Warning: We are not responsible for the quality of this translation service. For best results, use full sentences.',
    inputLabel: 'Source text',
    inputPlaceholder: 'Enter text to translate to Tajik (full sentences recommended)...',
    outputLabel: 'Translation to Tajik',
    outputPlaceholder: 'Translation will appear here',
    translate: 'Translate',
    translating: 'Translating...',
    errorEmpty: 'Please enter text to translate',
    errorApi: 'Translation error. Please try again later.',
    infoApi: 'Using free MyMemory Translation API',
    infoLimit: 'Limit: ~1000 characters per request',
    infoTip: 'For more accurate translation, use full sentences',
    swap: 'Swap',
    top_learners: 'Top language learners this week',
    profile_description: 'View or edit your profile',
    instructions: 'Instructions',
    howToStudy: 'How to Study',
    tapWordsInstruction: '1. Tap on the word to see its meaning',
    learnPronunciationInstruction: '2. Listen to the pronunciation',
    practiceExamplesInstruction: '3. Practice using the word in examples',
    testInstructions: 'Test Instructions',
    multipleChoiceInstruction: 'Choose the correct answer from options',
    scoreRequirementInstruction: 'You need a minimum score to pass',
    pointsExplanationInstruction: 'Earn points for each correct answer',
    tips: 'Tips',
    reviewWordsInstruction: 'Review words after each lesson',
    takeNotesInstruction: 'Take notes to remember better',
    practiceRegularlyInstruction: 'Practice regularly for better results',
    startLearning: 'Start Learning',
    home: 'Home',
    profile: 'Profile',
    leaderboard: 'Leaderboard',
    settings: 'Settings',
    language: 'Language',
    learn: 'Learn Tajik',
    points: 'Points',
    levelsCompleted: 'Levels Completed',
    bestStreak: 'Best Streak',
    currentStreak: 'Current Streak',
    privacyPolicy: 'Privacy Policy',
    ourTeam: 'Our Team',
    days: 'lessons',
    recentAchievements: 'Recent Achievements',
    completed: 'Completed',
    earn: 'Earn',
    loading: 'Loading...',
    noLevels: 'No levels available',
    completePreviousLevel: 'Complete previous level to unlock',
    startTest: 'Start Test',
    testResults: 'Test Results',
    score: 'Score',
    congratulations: 'Congratulations! You\'ve passed this level!',
    tryAgain: 'Try again to pass this level.',
    retryButton: 'Try Again',
    returnHome: 'Return Home',
    levelNotFound: 'This level doesn\'t exist.',
    username: 'Username',
    enterUsername: 'Enter your username',
    changePhoto: 'Change Photo',
    saveChanges: 'Save Changes',
    saving: 'Saving...',
    profileUpdated: 'Profile updated successfully!',
    explanation: 'Explanation',
    examples: 'Examples',
    noExamples: 'No examples available',
    close: 'Close',
    hideKeyboard: 'Hide Keyboard',
    showKeyboard: 'Show Keyboard',
    correct: 'Correct!',
    incorrect: 'Incorrect',
    correctAnswer: 'Correct Answer',
    submit: 'Submit',
    finish: 'Finish',
    nextQuestion: 'Next Question',
    hideHint: 'Hide Hint',
    showHint: 'Show Hint',
    question: 'Question',
    levelAlreadyCompleted: 'You have already completed this level',
    goBack: 'Go Back',
    // Alphabet page translations
    tajikAlphabet: 'Tajik Alphabet',
    clickLetterInfo: 'Click on a letter for detailed information',
    transcription: 'Transcription',
    // Auth translations
    signIn: 'Sign In',
    signUp: 'Sign Up',
    signOut: 'Sign Out',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    newPassword: 'New Password',
    changePassword: 'Change Password',
    changing: 'Changing password...',
   
    passwordsDoNotMatch: 'Passwords do not match',
    errorLoadingData: 'Error loading data. Please try again.',
    retry: 'Retry',
    translator: 'Translator',
    from: 'From',
    to: 'To',
    listen: 'Listen',
    copy: 'Copy',
    share: 'Share',
    typeHere: 'Type here',
    typeTajikHere: 'Type tajik here',
 
    translationWillAppearHere: 'Translation will appear here',
    previousQuestion: 'Previous Question',
    darkMode: 'Dark Mode',
    lightMode: 'Light Mode',
    theme: 'Theme',
    enterDescription: 'Enter a short description about yourself...',
    yourAnswer: 'Your Answer',
    ok: 'OK',
    chatAssistant: 'Chat Assistant',
    chatTitle: 'Tajik Language Chat',
   
    placeholder: 'Ask a question about the Tajik language...',
    send: 'Send',
    error: 'An error occurred. Please try again.',
    grammar: 'Grammar',
    translatorHeadersubtitle: '🌐 Multi-language translator with Tajik support',
    search_by_username: "Search by username",
  sort: "Sort",
  sort_by: "Sort by",
  filters: "Filters",
  xp_points: "XP Points",
  min: "Min",
  max: "Max",
  min_streak: "Minimum streak",
  online_status: "Online Status",
  
  want_to_chat: "Want to chat",
  location: "Location",
  enter_location: "Enter location",
  reset: "Reset",
  apply: "Apply",
  loading_top_learners: "Loading top learners...",
  no_results_found: "No results found",
  try_adjusting_filters: "Try adjusting your filters",
  },
  ru: {
    search_by_username: "Поиск по никнейму",
  sort: "Сортировка",
  sort_by: "Сортировать по",
  filters: "Фильтры",
  xp_points: "Очки опыта",
  min: "Мин",
  max: "Макс",
  min_streak: "Минимальный streak",
  online_status: "Статус онлайн",
 
  
  want_to_chat: "Хочет общаться",
  location: "Местоположение",
  enter_location: "Введите местоположение",
  reset: "Сбросить",
  apply: "Применить",
  loading_top_learners: "Загрузка лучших учеников...",
  no_results_found: "Результаты не найдены",
  try_adjusting_filters: "Попробуйте изменить фильтры",
    translatorHeadersubtitle: '🌐 Многоязычный переводчик с поддержкой таджикского языка',
    Nickname: 'Ник',
    Status: 'Статус',
    Description: 'Описание',
    Points: 'Очки',
    BestStreak: 'Лучший рекорд',
    lessons: 'уроков',
    NoDescription: 'Нет описания',
    modeChanged: 'Режим изменен',
     delete : 'Удалить',
     cancel : 'Отмена',
     deleteChat : 'Удалить чат',
     noSavedChats : 'Нет сохраненных чатов',
     createNewChat : 'Создать новый чат',
      back : 'Назад',
      newChat : 'Новый чат',
      tajikLanguageChat : 'Чат по таджикскому языку',
    grammar: 'Грамматика',
    exitTestMessage: 'Вы уверены, что хотите выйти? Прогресс не будет сохранен',
   
    exitTestTitle: 'Выход из теста',
    exit: 'Выход',
    NewChat: 'Новый чат', 
    
    listChats: 'Список чатов', 
    chats: 'Чаты',
    preparation: 'Подготовка к тесту',
    proceedToReading: 'Перейти к чтению',
    reading: 'Чтение',
     chatTitle: 'Чат по таджикскому языку',
    
    placeholder: 'Задайте вопрос по таджикскому языку...',
    send: 'Отправить',
    error: 'Произошла ошибка. Попробуйте снова.',
    online: 'Онлайн',
offline: 'Офлайн',
lastSeen: 'Был в сети',
minutesAgo: ' мин. назад',
hoursAgo: ' ч. назад',
daysAgo: ' дн. назад',
    translatorTitle: 'Переводчик на таджикский язык',
    warning: 'Внимание: Мы не отвечаем за качество перевода этого сервиса. Для лучших результатов формируйте запросы полными предложениями.',
    inputLabel: 'Исходный текст',
    inputPlaceholder: 'Введите текст для перевода на таджикский (рекомендуется использовать полные предложения)...',
    outputLabel: 'Перевод на таджикский',
    outputPlaceholder: 'Здесь появится перевод',
    translate: 'Перевести',
    translating: 'Перевожу...',
    errorEmpty: 'Пожалуйста, введите текст для перевода',
    errorApi: 'Произошла ошибка при переводе. Попробуйте позже.',
    infoApi: 'Используется бесплатный API MyMemory Translation',
    infoLimit: 'Ограничение: ~1000 символов за запрос',
    infoTip: 'Для получения более точного перевода используйте полные предложения',
    swap: '↔',
    top_learners: 'Лучшие изучающие язык на этой неделе',
    profile_description: 'Просмотрите или измените ваш профиль',
    instructions: 'Инструкции',
    howToStudy: 'Как учиться',
    tapWordsInstruction: '1. Нажмите на слово, чтобы увидеть его значение',
    learnPronunciationInstruction: '2. Слушайте произношение',
    practiceExamplesInstruction: '3. Практикуйтесь, используя слово в примерах',
    testInstructions: 'Инструкции к тесту',
    multipleChoiceInstruction: 'Выберите правильный ответ из вариантов',
    scoreRequirementInstruction: 'Вам нужен минимальный балл для прохождения',
    pointsExplanationInstruction: 'Зарабатывайте очки за каждый правильный ответ',
    tips: 'Советы',
    reviewWordsInstruction: 'Повторяйте слова после каждого урока',
    takeNotesInstruction: 'Делайте заметки для лучшего запоминания',
    practiceRegularlyInstruction: 'Практикуйтесь регулярно для лучших результатов',
    startLearning: 'Начать обучение',
    home: 'Главная',
    profile: 'Профиль',
    leaderboard: 'Таблица лидеров',
    settings: 'Настройки',
    language: 'Язык',
    learn: 'Изучать таджикский',
    points: 'Очки',
    levelsCompleted: 'Уровней пройдено',
    bestStreak: 'Лучшая серия',
    currentStreak: 'Текущая серия',
    days: 'уроков',
    recentAchievements: 'Последние достижения',
    completed: 'Завершено',
    earn: 'Заработать',
    loading: 'Загрузка...',
    noLevels: 'Нет доступных уровней',
    completePreviousLevel: 'Пройдите предыдущий уровень, чтобы разблокировать',
    startTest: 'Начать тест',
    testResults: 'Результаты теста',
    score: 'Счет',
    congratulations: 'Поздравляем! Вы прошли этот уровень!',
    tryAgain: 'Попробуйте еще раз, чтобы пройти уровень.',
    retryButton: 'Попробовать снова',
    returnHome: 'Вернуться на главную',
    levelNotFound: 'Этот уровень не существует.',
    username: 'Имя пользователя',
    enterUsername: 'Введите имя пользователя',
    changePhoto: 'Изменить фото',
    saveChanges: 'Сохранить изменения',
    saving: 'Сохранение...',
    profileUpdated: 'Профиль успешно обновлен!',
    explanation: 'Объяснение',
    examples: 'Примеры',
    noExamples: 'Нет доступных примеров',
    close: 'Закрыть',
    hideKeyboard: 'Скрыть клавиатуру',
    showKeyboard: 'Показать клавиатуру',
    correct: 'Правильно!',
    incorrect: 'Неправильно',
    correctAnswer: 'Правильный ответ',
    submit: 'Отправить',
    finish: 'Завершить',
    nextQuestion: 'Следующий вопрос',
    hideHint: 'Скрыть подсказку',
    showHint: 'Показать подсказку',
    question: 'Вопрос',
    levelAlreadyCompleted: 'Вы уже прошли этот уровень',
    goBack: 'Назад',
    // Alphabet page translations
    tajikAlphabet: 'Таджикский алфавит',
    clickLetterInfo: 'Нажмите на букву для подробной информации',
    transcription: 'Транскрипция',
    // Auth translations
    signIn: 'Войти',
    signUp: 'Регистрация',
    signOut: 'Выйти',
    email: 'Email',
    password: 'Пароль',
    confirmPassword: 'Подтвердите пароль',
    newPassword: 'Новый пароль',
    changePassword: 'Изменить пароль',
    changing: 'Изменение пароля...',
  
    passwordsDoNotMatch: 'Пароли не совпадают',
    errorLoadingData: 'Ошибка загрузки данных. Пожалуйста, попробуйте снова.',
    retry: 'Повторить',
    translator: 'Переводчик',
    from: 'Из',
    to: 'В',
    listen: 'Слушать',
    copy: 'Копировать',
    share: 'Поделиться',
    typeHere: 'Введите ',
    typeTajikHere: 'Введите',
    
    translationWillAppearHere: 'Перевод появиться здесь',
    previousQuestion: 'Предыдущий вопрос',
    darkMode: 'Темная тема',
    lightMode: 'Светлая тема',
    theme: 'Тема',
    enterDescription: 'Введите краткое описание о себе...',
    yourAnswer: 'Ваш ответ',
    ok: 'ОК',
    chatAssistant: 'Чат-помощник',
    privacyPolicy: 'Политика конфиденциальности',
    ourTeam: 'Наша команда',
  }
};

export const lightTheme = {
  background: '#f8fafc',
  surface: '#ffffff',
  primary: '#6366f1',
  secondary: '#e5e7eb',
  text: '#1f2937',
  textSecondary: '#6b7280',
  textTertiary: '#9ca3af',
  border: '#e2e8f0',
  success: '#22c55e',
  error: '#ef4444',
  warning: '#f59e0b',
  card: '#ffffff',
  shadow: 'rgba(0, 0, 0, 0.1)',
};

export const darkTheme = {
  background: '#0f172a',
  surface: '#1e293b',
  primary: '#818cf8',
  secondary: '#374151',
  text: '#f1f5f9',
  textSecondary: '#cbd5e1',
  textTertiary: '#94a3b8',
  border: '#334155',
  success: '#34d399',
  error: '#f87171',
  warning: '#fbbf24',
  card: '#1e293b',
  shadow: 'rgba(0, 0, 0, 0.3)',
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  colors: typeof lightTheme;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    loadStoredPreferences();
  }, []);

  const loadStoredPreferences = async () => {
    try {
      const storedLanguage = await AsyncStorage.getItem('language');
      const storedTheme = await AsyncStorage.getItem('theme');
      
      if (storedLanguage && (storedLanguage === 'en' || storedLanguage === 'ru')) {
        setLanguage(storedLanguage);
      }
      
      if (storedTheme && (storedTheme === 'light' || storedTheme === 'dark')) {
        setTheme(storedTheme);
      }
    } catch (error) {
      console.error('Error loading stored preferences:', error);
    }
  };

  const handleSetLanguage = useCallback(async (lang: Language) => {
    setLanguage(lang);
    try {
      await AsyncStorage.setItem('language', lang);
    } catch (error) {
      console.error('Error saving language preference:', error);
    }
  }, []);

  const handleSetTheme = useCallback(async (newTheme: Theme) => {
    setTheme(newTheme);
    try {
      await AsyncStorage.setItem('theme', newTheme);
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  }, []);

  const t = useCallback(
    (key: TranslationKey) => {
      return translations[language][key] || key;
    },
    [language]
  );

  const colors = theme === 'dark' ? darkTheme : lightTheme;

  return (
    <LanguageContext.Provider value={{ 
      language, 
      setLanguage: handleSetLanguage, 
      theme, 
      setTheme: handleSetTheme, 
      colors, 
      t 
    }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}