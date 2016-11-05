FROM node:6
EXPOSE 3000
COPY package.json /usr/src/app/package.json
#COPY tsconfig.json /usr/src/app/tsconfig.json
#COPY typings.json /usr/src/app/typings.json
COPY webpack.config.js /usr/src/app/webpack.config.js

WORKDIR /usr/src/app
RUN npm install
COPY src /usr/src/app/src
#RUN ./node_modules/.bin/typings install
RUN mkdir dist
RUN ./node_modules/.bin/webpack
ENTRYPOINT npm start