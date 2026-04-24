# GigaChat Clone

ChatGPT-подобный интерфейс на базе OpenAI API, созданный в рамках итогового задания по курсу "Основы frontend-разработки". (Gigachat в середине работалы превратился в ChatGPT, я не меняла названия файлов)

## Скриншоты

<img width="1200" height="1071" alt="image" src="https://github.com/user-attachments/assets/813c7894-7d0e-418d-92a3-2ac648e1d747" />

## Функциональность

- Потоковая передача ответов (SSE streaming)
- Markdown форматирование с подсветкой кода
- Управление несколькими чатами
- Сохранение истории в localStorage
- Автоматическое название чата из первого сообщения
- Поиск по чатам
- Копирование ответов
- Остановка генерации
- Настройка параметров модели (temperature, max_tokens и др.)

## Запуск

1. Клонировать репозиторий: `git clone https://github.com/Isabel2312/gigachat-clone`
2. Установить зависимости: `npm install`
3. Запустить: `npm run dev`
4. Открыть `http://localhost:5173`
5. В настройках (⚙) вставить OpenAI API ключ

## Технологии

- React 18 + TypeScript
- Zustand (state management)
- react-markdown + remark-gfm
- Vite
- CSS Modules
