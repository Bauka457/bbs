# Love Letters

React + Vite приложение, готовое к публикации на Vercel.

## Run Locally

**Prerequisites:**  Node.js


1. Установите зависимости:
   `npm install`
2. Запустите локальный сервер:
   `npm run dev`
3. Откройте адрес, который напечатает Vite (обычно `http://localhost:3000`).

## Проверка перед публикацией

```bash
npm run lint
npm run build
```

## Публикация на GitHub и Vercel

1. Создайте пустой репозиторий на GitHub без README и `.gitignore`.
2. Инициализируйте Git в этой папке и отправьте код:

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/USERNAME/REPOSITORY.git
   git push -u origin main
   ```

3. На [vercel.com](https://vercel.com) выберите **Add New Project**, импортируйте этот GitHub-репозиторий и нажмите **Deploy**.
4. Vercel автоматически определит Vite. Параметры сборки: `npm run build`, папка результата: `dist`.

Файлы `.env*` игнорируются Git. Не добавляйте API-ключи в репозиторий или клиентский код.
