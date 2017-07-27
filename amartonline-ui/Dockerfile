FROM node:8.1.4

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install -p

# Copy app source into app directory
COPY . /usr/src/app

# Build and optimize react app
RUN npm run build

EXPOSE 3000

# Run npm start to launch the app
CMD ["npm", "start"]
