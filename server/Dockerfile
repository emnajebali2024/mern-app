FROM node:lts-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ENV MONGO_URI=mongodb://mongodb:27017/mern

EXPOSE 9000

CMD ["npm", "start"]
# rebuild after dependency fix
