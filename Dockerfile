FROM node
WORKDIR /opt/ScreenShare
COPY package.json .
RUN npm install
COPY pages ./pages/
COPY src ./src/
COPY server.js .
ENV PORT=80
CMD npm start