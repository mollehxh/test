# Используйте базовый образ с поддержкой Node.js
FROM node:latest

# Установите рабочую директорию внутри контейнера
WORKDIR /app

# Скопируйте package.json и package-lock.json в контейнер
COPY package*.json ./

# Установите зависимости
RUN npm install

# Скопируйте остальные файлы проекта в контейнер
COPY . .

# Соберите статические файлы для продакшн сборки
RUN npm run build

# Откройте порт, на котором работает ваш ReactJS клиент (обычно 80)
EXPOSE 8080

# Запустите сервер для обслуживания статических файлов
CMD [ "node", "server.cjs" ]
