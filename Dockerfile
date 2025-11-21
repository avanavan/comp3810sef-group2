FROM node:current-alpine3.22

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .

ENV MONGO_URL=""
EXPOSE 8000

CMD ["npm", "start"]