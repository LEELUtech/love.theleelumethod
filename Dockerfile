FROM node:20-alpine

WORKDIR /app


COPY package.json package-lock.json ./
RUN npm ci

COPY . .

RUN chown -R node:node /app

USER node

RUN npm run build

EXPOSE 3000

CMD [ "npm", "start" ]
