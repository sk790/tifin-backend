FROM node:20

WORKDIR /tifin-backend

COPY . .

RUN npm install

EXPOSE 3000

CMD ["npm", "run", "start"]