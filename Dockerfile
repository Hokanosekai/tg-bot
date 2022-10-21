FROM node:18.3.0 as production

ENV NODE_ENV production
ENV DB_PORT 3306
ENV DB_USER root
ENV DB_PASSWORD root
ENV DB_DATABASE tgbot

WORKDIR /app
COPY package.json .
COPY package-lock.json .
RUN npm install --force

COPY . .

CMD ["npm", "run", "start:dev"]