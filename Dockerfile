FROM node:12
LABEL developer="bright"

# set work directory
WORKDIR /usr/src/keeneye
# copy package.js
COPY package*.json ./
# install dependencies
RUN npm install
RUN npm run jsDoc
COPY . .

EXPOSE 4001

CMD ["npm", "start"]