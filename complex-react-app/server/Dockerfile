# Remember that node is necessary for React, otherwise you won't be able to use your app. 
FROM node:alpine
WORKDIR "/app"
COPY ./package.json ./
RUN npm install
COPY . .
CMD ["npm", "run", "start"]