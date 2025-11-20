# Инструкция по деплою на Vercel

## Способ 1: Через Vercel CLI (рекомендуется)

### 1. Установите Vercel CLI (если еще не установлен)
```bash
npm i -g vercel
```

### 2. Перейдите в папку проекта
```bash
cd santaclaus
```

### 3. Войдите в Vercel
```bash
vercel login
```

### 4. Задеплойте проект
```bash
vercel
```

Следуйте инструкциям:
- Set up and deploy? **Y**
- Which scope? Выберите ваш аккаунт
- Link to existing project? **N** (для первого деплоя)
- What's your project's name? **santaclaus** (или любое другое имя)
- In which directory is your code located? **./** (текущая директория)

### 5. Для production деплоя
```bash
vercel --prod
```

## Способ 2: Через GitHub (рекомендуется для автоматических деплоев)

### 1. Создайте репозиторий на GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/ваш-username/santaclaus.git
git push -u origin main
```

### 2. Импортируйте проект в Vercel
1. Зайдите на https://vercel.com
2. Нажмите "Add New Project"
3. Импортируйте ваш GitHub репозиторий
4. Vercel автоматически определит настройки
5. Нажмите "Deploy"

## Настройка переменных окружения (опционально)

Если вы используете Twitter API, добавьте переменные окружения в Vercel:

1. Зайдите в настройки проекта на Vercel
2. Перейдите в "Environment Variables"
3. Добавьте:
   - `TWITTER_API_KEY`
   - `TWITTER_API_SECRET`
   - `TWITTER_ACCESS_TOKEN`
   - `TWITTER_ACCESS_TOKEN_SECRET`

## Структура проекта

Проект готов к деплою:
- ✅ `vercel.json` - конфигурация Vercel
- ✅ `api/` - serverless functions
- ✅ `index.html` - главная страница
- ✅ `styles/` - CSS файлы
- ✅ `scripts/` - JavaScript файлы

## После деплоя

После успешного деплоя вы получите URL вида:
`https://santaclaus.vercel.app`

Обновите `scripts/config.js` с вашим новым URL:
```javascript
BASE_URL: "https://ваш-проект.vercel.app"
```

