FROM  node:19-alpine

COPY package.json /app/
COPY index.js /app/
COPY messages.json /app/
COPY .env /app/

WORKDIR /app

RUN npm install 

CMD ["node", "index.js"]