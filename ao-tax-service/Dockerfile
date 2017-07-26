FROM node:8.1.4

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install

# Copy app source into app directory
COPY . /usr/src/app

EXPOSE 5003

# Run npm start to launch the api
CMD ["npm", "start"]
